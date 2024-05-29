import {mount} from '@vue/test-utils'
import {describe, expect, it} from 'vitest'
import SpeedControl from '@/components/SpeedControl.vue'

describe('SpeedControl', () => {
    it('renders correctly', () => {
        const videoElement = document.createElement('video')
        const wrapper = mount(SpeedControl, {
            props: {
                videoElement
            }
        })

        expect(wrapper.exists()).toBe(true)
        expect(wrapper.findComponent({name: "Select"}).exists()).toBe(true)
    })

    it('updates playback speed when a different option is selected', async () => {
        const videoElement = document.createElement('video')
        const wrapper = mount(SpeedControl, {
            props: {
                videoElement
            }
        })

        const selectComponent = wrapper.findComponent({name:'Select'})

        // Initial playback speed should be 1 (the default value)
        expect(videoElement.playbackRate).toBe(1)

        // Select the option with speed 1.5
        await selectComponent.vm.$emit('update:modelValue', {id: 1.5, name: '1.5'})
        expect(videoElement.playbackRate).toBe(1.5)

        // Select the option with speed 2
        await selectComponent.vm.$emit('update:modelValue', {id: 2, name: '2'})
        expect(videoElement.playbackRate).toBe(2)

        // Select the option with speed 10
        await selectComponent.vm.$emit('update:modelValue', {id: 10, name: '10'})
        expect(videoElement.playbackRate).toBe(10)
    })
})
