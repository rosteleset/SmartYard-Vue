import {mount} from '@vue/test-utils';
import {beforeEach, describe, expect, it, vi} from 'vitest';
import VideoModal from '@/components/VideoModal.vue';
import ArrowIcon from '@/assets/arrowRight.svg?component';
import {mockCameras} from "@/mocks/Cameras.ts";

const {createPlayer} = vi.hoisted(() => ({
    createPlayer: vi.fn().mockReturnValue({
        play: vi.fn(),
        pause: vi.fn(),
        onDestroy: vi.fn(),
        generatePreview: vi.fn(),
        generateStream: vi.fn(),
        calculateAspectRatio: vi.fn(),
        getSize: vi.fn().mockReturnValue({width: '100px', height: '100px'}),
        initializeVideoStream: vi.fn(),
    }),
}));

vi.mock('@/lib/player', () => ({
    PlayerFactory: {
        createPlayer
    },
}));

vi.mock('@/assets/arrowRight.svg?component', () => ({
    default: {
        template: '<svg></svg>',
    },
}));

vi.mock("@/components/CustomControls.vue");
vi.mock("@/components/RangeSelect.vue");
vi.mock("@/components/SpeedControl.vue");

const camera = mockCameras[0]

describe('VideoModal', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should render correctly', () => {
        const wrapper = mount(VideoModal, {
            props: {
                camera,
            },
        });

        expect(wrapper.find('.video-wrap').exists()).toBe(true);
        expect(wrapper.find('.video-container').exists()).toBe(true);
        expect(wrapper.find('.video-element').exists()).toBe(true);
        expect(wrapper.findComponent(ArrowIcon).exists()).toBe(true);
    });

    it('should call onClose when video-wrap is clicked', async () => {
        const wrapper = mount(VideoModal, {
            props: {
                camera,
            },
        });

        await wrapper.find('.video-wrap').trigger('mousedown');
        expect(wrapper.emitted('onClose')).toBeTruthy();
    });

    it('should not call onClose when video-container is clicked', async () => {
        const wrapper = mount(VideoModal, {
            props: {
                camera,
            },
        });

        await wrapper.find('.video-container').trigger('mousedown');
        expect(wrapper.emitted('onClose')).toBeFalsy();
    });

    it('should toggle info panel', async () => {
        const wrapper = mount(VideoModal, {
            props: {
                camera,
            },
        });

        const toggleButton = wrapper.find('.toggle-info');
        expect(wrapper.find('.info').classes()).not.toContain('open');

        await toggleButton.trigger('click');
        expect(wrapper.find('.info').classes()).toContain('open');

        await toggleButton.trigger('click');
        expect(wrapper.find('.info').classes()).not.toContain('open');
    });

    it('should initialize and destroy player', async () => {
        const wrapper = mount(VideoModal, {
            props: {
                camera,
            },
        });

        await wrapper.find('.video-element').trigger('canplay')

        const player = createPlayer();

        expect(createPlayer).toHaveBeenCalled();
        expect(player.calculateAspectRatio).toHaveBeenCalled();

        wrapper.unmount();
        expect(player.onDestroy).toHaveBeenCalled();
    });

    it('should update player size on window resize', async () => {
        mount(VideoModal, {
            props: {
                camera,
            },
        });

        const player = createPlayer();

        window.dispatchEvent(new Event('resize'));
        expect(player.getSize).toHaveBeenCalled();
    });

    it('should handle video click to play/pause', async () => {
        const wrapper = mount(VideoModal, {
            props: {
                camera,
            },
        });

        const player = createPlayer();
        const videoElement = wrapper.find('.video-element').element as HTMLVideoElement;
        vi.spyOn(videoElement, 'paused', 'get').mockReturnValue(true);

        await wrapper.find('.video-element').trigger('click');
        expect(player.play).toHaveBeenCalled();

        vi.spyOn(videoElement, 'paused', 'get').mockReturnValue(false);
        await wrapper.find('.video-element').trigger('click');
        expect(player.pause).toHaveBeenCalled();
    });
});
