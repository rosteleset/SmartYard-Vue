import {mount} from '@vue/test-utils'
import {describe, expect, it} from 'vitest'
import Map from '@/components/Map.vue'
import VideoModal from '@/components/VideoModal.vue'
import {defaultGlobal, mockCamera} from "@/tests/__mocks.ts";

describe('Map', () => {
    const cameras = [
        mockCamera,
        {...{id: 2}, ...mockCamera}
    ]
    
    it('renders map and markers', () => {
        const wrapper = mount(Map, {
            props: {cameras},
            global: defaultGlobal
        })

        const map = wrapper.find('.leaflet-map')
        expect(map.exists()).toBe(true)

        const markers = wrapper.findAll('.leaflet-marker')
        expect(markers).toHaveLength(cameras.length)
    })

    it('opens VideoModal on marker click', async () => {
        const wrapper = mount(Map, {
            props: {cameras},
            global: defaultGlobal,
        })

        await wrapper.findAll('.leaflet-marker')[0].trigger('click') // The first marker

        const modal = wrapper.findComponent(VideoModal)
        expect(modal.exists()).toBe(true)
        expect(modal.props('camera')).toEqual(cameras[0])
    })

    it('closes VideoModal on close event', async () => {
        const wrapper = mount(Map, {
            props: {cameras},
            global: defaultGlobal
        })

        await wrapper.findAll('.leaflet-marker')[0].trigger('click') // The first marker

        const modal = wrapper.findComponent(VideoModal)
        expect(modal.exists()).toBe(true)

        await (modal.vm as any).$emit('onClose')
        expect(wrapper.findComponent(VideoModal).exists()).toBe(false)
    })
})
