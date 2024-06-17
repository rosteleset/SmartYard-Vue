import {flushPromises, mount} from '@vue/test-utils';
import {beforeEach, describe, expect, it, Mock, vi} from 'vitest';
import VideoCard from '@/components/VideoCard.vue';
import VideoModal from '@/components/VideoModal.vue';
import {mockCameras} from "@/mocks/Cameras.ts";
import {useElementVisibility} from "@vueuse/core";
import {ref} from "vue";

const {createPlayer} = vi.hoisted(() => ({
    createPlayer: vi.fn().mockReturnValue({
        play: vi.fn(),
        pause: vi.fn(),
        onDestroy: vi.fn(),
    }),
}));

vi.mock('rbt-player', () => ({
    PlayerFactory: {
        createPlayer
    },
}));

vi.mock('@/store/config', () => ({
    useConfigStore: vi.fn().mockReturnValue({
        config: {
            watchmanMode: true,
        },
    }),
}));

vi.mock('@vueuse/core', () => ({
    useElementVisibility: vi.fn()
}));

vi.mock('@/components/VideoModal.vue')

const camera = mockCameras[0]

describe('VideoCard', () => {

    const visibility = ref(false)
    beforeEach(() => {
        visibility.value = false;
        (useElementVisibility as Mock).mockReturnValue(visibility);
    })

    it('should render correctly', () => {
        const wrapper = mount(VideoCard, {
            props: {
                camera,
            },
        });

        expect(wrapper.find('.video').exists()).toBe(true);
        expect(wrapper.find('.video__preview').exists()).toBe(true);
        expect(wrapper.find('.video__player').exists()).toBe(true);
    });

    it('should open modal on video click', async () => {
        const wrapper = mount(VideoCard, {
            props: {
                camera,
            },
        });

        const previewElement = wrapper.find('.video__preview');
        await previewElement.trigger('click');

        expect(wrapper.findComponent(VideoModal).exists()).toBe(true);
    });

    it('should close modal on close handler', async () => {
        const wrapper = mount(VideoCard, {
            props: {
                camera,
            },
        });

        const previewElement = wrapper.find('.video__preview');
        await previewElement.trigger('click');

        const modal = wrapper.findComponent(VideoModal);
        modal.vm.$emit('on-close');

        await wrapper.vm.$nextTick();

        expect(wrapper.findComponent(VideoModal).exists()).toBe(false);
    });

    it('should mount and dismount player', async () => {
        const wrapper = mount(VideoCard, {
            props: {
                camera,
            },
        });
        visibility.value = true
        await flushPromises()
        // console.log(wrapper.vm.targetIsVisible)
        expect(createPlayer).toHaveBeenCalled();

        wrapper.unmount();
        expect(createPlayer().onDestroy).toHaveBeenCalled();
    });

    it('should reflect index if provided', () => {
        const wrapper = mount(VideoCard, {
            props: {
                camera,
                index: 1,
            },
        });

        const indexElement = wrapper.find('.number');
        expect(indexElement.exists()).toBe(true);
        expect(indexElement.text()).toBe('1');
    });

    it('should handle visibility change', async () => {
        const wrapper = mount(VideoCard, {
            props: {
                camera,
            },
        });
        visibility.value = true;
        await flushPromises()

        const {play, pause} = createPlayer();

        await wrapper.setProps({camera: {...camera, url: ''}});
        expect(pause).toHaveBeenCalled();

        await wrapper.setProps({camera});
        expect(play).toHaveBeenCalled();
    });
});
