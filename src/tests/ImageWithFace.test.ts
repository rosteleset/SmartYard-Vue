import {mount} from '@vue/test-utils';
import {describe, expect, it} from 'vitest';
import ImageWithFace from '@/components/ImageWithFace.vue';
import {defaultGlobal} from "@/tests/__mocks.ts";


describe('ImageWithFace', () => {
    const mockImageUrl = 'https://via.placeholder.com/150';
    const mockFace = {
        left: '10',
        top: '20',
        width: '50',
        height: '50',
    };
    const mockColor = 'red';

    it('renders image and canvas correctly', async () => {
        const wrapper = mount(ImageWithFace, {
            props: {
                imageUrl: mockImageUrl,
                face: mockFace,
                color: mockColor,
            },
            global: defaultGlobal
        });
        const canvas = wrapper.find('canvas');
        const errorDiv = wrapper.find('.error');

        expect(canvas.exists()).toBe(true);
        expect(errorDiv.exists()).toBe(false);
    });

});
