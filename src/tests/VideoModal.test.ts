import {DOMWrapper, mount} from '@vue/test-utils';
import {beforeEach, describe, expect, it, vi} from 'vitest';
import VideoModal from '@/components/VideoModal.vue';
import {PlayerFactory} from 'rbt-player';
import {nextTick} from 'vue';
import {Camera} from '@/types/camera';
import {defaultGlobal} from "@/tests/__mocks.ts";

vi.mock('@/assets/arrowRight.svg?component', () => ({
    default: {template: '<svg />'},
}));

describe('VideoModal', () => {
    let mockCamera: Camera;
    let mockPlayer: ReturnType<typeof PlayerFactory.createPlayer>;

    beforeEach(() => {
        mockCamera = {
            id: 1,
            name: 'Camera 1',
            lat: '0',
            lon: '0',
            serverType: 'flussonic',
            url: 'http://example.com',
            token: 'token'
        };
        mockPlayer = PlayerFactory.createPlayer({
            camera: mockCamera,
            videoElement: {} as unknown as HTMLVideoElement,
            autoplay: true,
        });
    });

    it('renders correctly', () => {
        const wrapper = mount(VideoModal, {
            props: {
                camera: mockCamera,
            },
            global: defaultGlobal
        });

        expect(wrapper.find('.video-wrap').exists()).toBe(true);
        expect(wrapper.find('.video-container').exists()).toBe(true);
        // expect(wrapper.findComponent(CustomControls).exists()).toBe(true);
        // expect(wrapper.findComponent(RangeSelect).exists()).toBe(true);
        // expect(wrapper.findComponent(SpeedControl).exists()).toBe(true);
    });

    it('initializes player on mount', async () => {
        const wrapper = mount(VideoModal, {
            props: {
                camera: mockCamera,
            },
            attachTo: document.body, // Attach to document body to ensure elements are in DOM
        });

        await nextTick();
        const videoElement = wrapper.find('video.video-element').element as HTMLVideoElement;
        const previewElement = wrapper.find('video.video-preview').element as HTMLVideoElement;

        expect(videoElement).toBeTruthy();
        expect(previewElement).toBeTruthy();

        expect(PlayerFactory.createPlayer).toHaveBeenCalledWith(expect.objectContaining({
            camera: expect.objectContaining(mockCamera),
            videoElement,
            previewElement,
            autoplay: true,
        }));
    });

    it('cleans up player on unmount', () => {
        const wrapper = mount(VideoModal, {
            props: {
                camera: mockCamera,
            },
        });

        wrapper.unmount();
        expect(mockPlayer.onDestroy).toHaveBeenCalled();
    });

    it('plays and pauses video on click', async () => {
        const wrapper = mount(VideoModal, {
            props: {
                camera: mockCamera,
            },
            global: defaultGlobal,
        });

        const videoElement:DOMWrapper<HTMLVideoElement> = wrapper.find('video.video-element');

        await videoElement.trigger('click');
        expect(mockPlayer.play).toHaveBeenCalled();

        Object.defineProperty(videoElement.element, 'paused', {
            writable: true,
            value: false,
        });

        await videoElement.trigger('click');
        expect(mockPlayer.pause).toHaveBeenCalled();
    });

    it('toggles info panel visibility', async () => {
        const wrapper = mount(VideoModal, {
            props: {
                camera: mockCamera,
            },
        });

        const button = wrapper.find('.toggle-info');
        expect(wrapper.find('.info').classes()).not.toContain('open');

        await button.trigger('click');
        expect(wrapper.find('.info').classes()).toContain('open');

        await button.trigger('click');
        expect(wrapper.find('.info').classes()).not.toContain('open');
    });

    it('emits onClose event when clicking outside video container', async () => {
        const wrapper = mount(VideoModal, {
            props: {
                camera: mockCamera,
            },
        });

        await wrapper.trigger('mousedown');
        expect(wrapper.emitted().onClose).toBeTruthy();

        await wrapper.find('.video-container').trigger('mousedown.stop');
        expect(wrapper.emitted().onClose).toHaveLength(1);
    });
});
