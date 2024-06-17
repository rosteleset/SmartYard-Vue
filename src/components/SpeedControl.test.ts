import {mount} from '@vue/test-utils'
import {describe, expect, it} from 'vitest'
import SpeedControl from '@/components/SpeedControl.vue'
import TestWrapper from "@/mocks/TestWrapper.ts";

describe('SpeedControl', () => {
    it('should render options correctly', () => {
        const videoElement = document.createElement('video');
        const wrapper = mount(SpeedControl, {
            props: {
                videoElement
            }
        });

        const select = wrapper.findComponent({name: 'Select'});
        const options = select.props().options;
        expect(options).toHaveLength(4);
        expect(options[0].name).toBe('1');
        expect(options[1].name).toBe('1.5');
        expect(options[2].name).toBe('2');
        expect(options[3].name).toBe('10');
    });

    it('should update video playback rate on speed change', async () => {
        const videoElement = document.createElement('video');
        const wrapper = mount(SpeedControl, {
            props: {
                videoElement
            }
        });

        const select = wrapper.findComponent({name: 'Select'});

        await select.setValue({id: 2, name: '2'});
        expect(videoElement.playbackRate).toBe(2);

        await select.setValue({id: 10, name: '10'});
        expect(videoElement.playbackRate).toBe(10);
    });

    it('should have correct default speed', () => {
        const videoElement = document.createElement('video');
        mount(SpeedControl, {
            props: {
                videoElement
            }
        });

        expect(videoElement.playbackRate).toBe(1);
    });

    it('should update speed ref correctly', async () => {
        const videoElement = document.createElement('video');
        const wrapper: TestWrapper<Partial<typeof SpeedControl>> = mount(SpeedControl, {
            props: {
                videoElement
            }
        });

        const select = wrapper.findComponent({name: 'Select'});

        await select.setValue({id: 2, name: '2'});
        expect(wrapper.vm.speed.id).toBe(2);
    });
});
