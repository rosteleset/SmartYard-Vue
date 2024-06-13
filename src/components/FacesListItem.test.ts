import {mount} from '@vue/test-utils';
import {describe, expect, it, vi} from 'vitest';
import FacesListItem from '@/components/FacesListItem.vue';
import PlusIcon from '@/assets/plus.svg?component';
import {mockFaces} from "@/mocks/Faces.ts";

describe('FacesListItem', () => {
    const face = mockFaces[0]

    it('renders a plus icon when face is not provided', () => {
        const addFaceMock = vi.fn();
        const wrapper = mount(FacesListItem, {
            props: {},
            global: {
                provide: {
                    handlers: {
                        addFace: addFaceMock,
                    },
                },
            },
        });

        expect(wrapper.findComponent(PlusIcon).exists()).toBe(true);
        wrapper.find('.face__plus').trigger('click');
        expect(addFaceMock).toHaveBeenCalled();
    });

    it('renders face image and delete button when face is provided', () => {
        const selectFaceMock = vi.fn();
        const removeFaceMock = vi.fn();
        const wrapper = mount(FacesListItem, {
            props: { face },
            global: {
                provide: {
                    handlers: {
                        selectFace: selectFaceMock,
                        removeFace: removeFaceMock,
                    },
                },
            },
        });

        const img = wrapper.find('img.face__image');
        expect(img.exists()).toBe(true);
        expect(img.attributes('src')).toBe(face.image);
        img.trigger('click');
        expect(selectFaceMock).toHaveBeenCalledWith(face);

        const deleteButton = wrapper.find('button');
        expect(deleteButton.exists()).toBe(true);
        deleteButton.trigger('click');
        expect(removeFaceMock).toHaveBeenCalledWith(face);
    });
});
