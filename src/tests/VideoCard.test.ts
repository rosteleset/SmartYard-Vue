import {mount} from '@vue/test-utils';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import VideoCard from '@/components/VideoCard.vue';
import VideoModal from '@/components/VideoModal.vue';
import {Camera} from '@/types/camera';

describe('VideoCard', () => {
    let mockCamera: Camera;

    beforeEach(() => {
        mockCamera = { id: 1, name: 'Camera 1', lat: '0', lon: '0', serverType: 'flussonic', url: 'http://example.com', token: 'token' };
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('renders correctly', () => {
        const wrapper = mount(VideoCard, {
            props: {
                camera: mockCamera,
            },
        });

        expect(wrapper.find('.video').exists()).toBe(true);
        expect(wrapper.find('video.video__preview').exists()).toBe(true);
        expect(wrapper.find('video.video__player').exists()).toBe(true);
        expect(wrapper.findComponent(VideoModal).exists()).toBe(false);
    });

    it('opens modal on click', async () => {
        const wrapper = mount(VideoCard, {
            props: {
                camera: mockCamera,
            },
        });

        await wrapper.find('video.video__preview').trigger('click');
        expect(wrapper.findComponent(VideoModal).exists()).toBe(true);
    });

    it('closes modal when onClose event is emitted', async () => {
        const wrapper = mount(VideoCard, {
            props: {
                camera: mockCamera,
            },
        });

        await wrapper.find('video.video__preview').trigger('click');
        expect(wrapper.findComponent(VideoModal).exists()).toBe(true);

        await wrapper.findComponent(VideoModal).vm.$emit('on-close');
        expect(wrapper.findComponent(VideoModal).exists()).toBe(false);
    });
});
