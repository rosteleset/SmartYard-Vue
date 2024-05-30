// tests/unit/CustomControls.spec.ts
import {mount} from '@vue/test-utils';
import {describe, expect, it, vi} from 'vitest';
import CustomControls from '@/components/CustomControls.vue';
import dayjs from 'dayjs';
import {ref} from "vue";

// Mocking PlayIcon and SettingsIcon components
vi.mock('@/assets/play.svg?component', () => ({
    default: {template: '<svg />'},
}));
vi.mock('@/assets/settings.svg?component', () => ({
    default: {template: '<svg />'},
}));

describe('CustomControls', () => {
    const currentTime = ref(0);
    const mockVideoElement = {
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        get currentTime() {
            return currentTime.value;
        },
        set currentTime(value) {
            currentTime.value = value;
        }
    };

    const mockRange = {from: 1625097600, duration: 3600, date: new Date(1625097600 * 1000), streamUrl: 'stream1'};

    it('renders correctly', () => {
        const wrapper = mount(CustomControls, {
            props: {
                videoElement: mockVideoElement as unknown as HTMLVideoElement,
                range: mockRange,
            },
        });

        expect(wrapper.find('.custom-controls').exists()).toBe(true);
        expect(wrapper.find('.button').exists()).toBe(true);
        expect(wrapper.find('.custom-slider').exists()).toBe(true);
    });

    it('updates currentTime when videoElement currentTime changes', async () => {


        const wrapper = mount(CustomControls, {
            props: {
                videoElement: mockVideoElement as unknown as HTMLVideoElement,
                range: mockRange,
            },
        });

        currentTime.value = 50;
        await wrapper.vm.$nextTick();
        expect((wrapper.vm as any).currentTime).toBe(50);
    });

    it('emits pause event when pause button is clicked', async () => {
        const wrapper = mount(CustomControls, {
            props: {
                videoElement: mockVideoElement as unknown as HTMLVideoElement,
                range: mockRange,
            },
        });

        await wrapper.find('.button').trigger('click');
        expect(wrapper.emitted().pause).toBeTruthy();
    });

    it('updates videoElement currentTime when slider input changes', async () => {
        const wrapper = mount(CustomControls, {
            props: {
                videoElement: mockVideoElement as unknown as HTMLVideoElement,
                range: mockRange,
            },
        });

        const slider = wrapper.find('.custom-slider');
        await slider.setValue(30);
        await slider.trigger('input');
        expect(mockVideoElement.currentTime).toBe(30);
    });

    it('shows and hides time display on drag start and end', async () => {
        const wrapper = mount(CustomControls, {
            props: {
                videoElement: mockVideoElement as unknown as HTMLVideoElement,
                range: mockRange,
            },
        });

        const slider = wrapper.find('.custom-slider');
        await slider.trigger('mousedown');
        expect((wrapper.vm as any).isDraggable).toBe(true);
        expect(wrapper.find('.time-display').classes()).toContain('visible');

        await slider.trigger('mouseup');
        expect((wrapper.vm as any).isDraggable).toBe(false);
        expect(wrapper.find('.time-display').classes()).not.toContain('visible');
    });

    it('correctly formats the time display', async () => {
        const wrapper = mount(CustomControls, {
            props: {
                videoElement: mockVideoElement as unknown as HTMLVideoElement,
                range: mockRange,
            },
        });

        currentTime.value = 50;
        await wrapper.vm.$nextTick();
        const formattedTime = dayjs(mockRange.date).add(50, 'seconds').format('HH:mm:ss');
        expect(wrapper.find('.time-display').text()).toBe(formattedTime);
    });
});
