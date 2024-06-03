// tests/unit/FacesListItem.spec.ts

import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import FacesListItem from '@/components/FacesListItem.vue';
import { Face } from '@/types/faces';

// Mocking the SVG components
vi.mock('@/assets/delete.svg?component', () => ({
    default: {
        template: '<svg></svg>'
    }
}));

vi.mock('@/assets/plus.svg?component', () => ({
    default: {
        template: '<svg></svg>'
    }
}));

describe('FacesListItem', () => {
    it('renders plus icon when face is not provided', () => {
        const wrapper = mount(FacesListItem, {
            global: {
                provide: {
                    handlers: {
                        addFace: vi.fn(),
                        selectFace: vi.fn(),
                        removeFace: vi.fn()
                    }
                }
            }
        });
        expect(wrapper.find('.face__plus').exists()).toBe(true);
    });

    it('calls addFace when plus icon is clicked', async () => {
        const addFace = vi.fn();
        const wrapper = mount(FacesListItem, {
            global: {
                provide: {
                    handlers: {
                        addFace,
                        selectFace: vi.fn(),
                        removeFace: vi.fn()
                    }
                }
            }
        });
        await wrapper.find('.face__plus').trigger('click');
        expect(addFace).toHaveBeenCalled();
    });

    it('renders face image and delete button when face is provided', () => {
        const face: Face = {
            faceId: '123',
            image: 'http://example.com/image.jpg'
        };
        const wrapper = mount(FacesListItem, {
            props: { face },
            global: {
                provide: {
                    handlers: {
                        addFace: vi.fn(),
                        selectFace: vi.fn(),
                        removeFace: vi.fn()
                    }
                }
            }
        });
        expect(wrapper.find('img.face__image').attributes('src')).toBe(face.image);
        expect(wrapper.find('button').exists()).toBe(true);
    });

    it('calls selectFace when face image is clicked', async () => {
        const selectFace = vi.fn();
        const face: Face = {
            faceId: '123',
            image: 'http://example.com/image.jpg'
        };
        const wrapper = mount(FacesListItem, {
            props: { face },
            global: {
                provide: {
                    handlers: {
                        addFace: vi.fn(),
                        selectFace,
                        removeFace: vi.fn()
                    }
                }
            }
        });
        await wrapper.find('img.face__image').trigger('click');
        expect(selectFace).toHaveBeenCalledWith(face);
    });

    it('calls removeFace when delete button is clicked', async () => {
        const removeFace = vi.fn();
        const face: Face = {
            faceId: '123',
            image: 'http://example.com/image.jpg'
        };
        const wrapper = mount(FacesListItem, {
            props: { face },
            global: {
                provide: {
                    handlers: {
                        addFace: vi.fn(),
                        selectFace: vi.fn(),
                        removeFace
                    }
                }
            }
        });
        await wrapper.find('button').trigger('click');
        expect(removeFace).toHaveBeenCalledWith(face);
    });
});
