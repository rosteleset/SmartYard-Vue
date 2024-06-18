import {beforeEach, describe, expect, it, MockInstance, vi} from 'vitest';
import {mount} from '@vue/test-utils';
import ImageWithFace from '@/components/ImageWithFace.vue';
import {defaultGlobal} from "@/mocks/__mockedGlobal.ts";

describe('ImageWithFace.vue', () => {
    let imgMock: MockInstance;

    beforeEach(() => {

        // Замокировать глобальный объект Image
        imgMock = vi.spyOn(global, 'Image').mockImplementation(() => {
            const img = {} as HTMLImageElement;
            img.onload = vi.fn();
            img.onerror = vi.fn();
            Object.defineProperty(img, 'src', {
                set() {
                    img.onload!({} as Event);
                },
            });
            Object.defineProperty(img, 'complete', {
                value: true
            });
            return img;
        });
    });

    it('handles image error correctly', async () => {
        imgMock.mockImplementation(() => {
            const img = {} as HTMLImageElement;
            img.onload = vi.fn();
            img.onerror = vi.fn();
            Object.defineProperty(img, 'src', {
                set() {
                    img.onerror!({} as Event);
                },
            });
            return img;
        });

        const wrapper = mount(ImageWithFace, {
            props: {
                imageUrl: 'http://example.com/bad-image.jpg',
                color: 'red',
            },
            global: defaultGlobal
        });

        await wrapper.vm.$nextTick();

        expect(wrapper.find('.error').exists()).toBe(true);
    });

});
