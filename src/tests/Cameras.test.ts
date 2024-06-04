import {mount} from '@vue/test-utils'
import {describe, expect, it} from 'vitest'
import Cameras from '@/components/Cameras.vue'
import NotFound from '@/components/NotFound.vue'
import Label from '@/components/Label.vue'
import CamerasList from '@/components/CamerasList.vue'
import Map from '@/components/Map.vue'
import {defaultGlobal} from "@/tests/__mocks.ts";

describe('Cameras', () => {
    it('displays NotFound if houseId is incorrect', () => {

        const wrapper = mount(Cameras, {
            props: { houseId: 'invalid-house-id' }
        })

        expect(wrapper.findComponent(NotFound).exists()).toBe(true)
    })

    it('displays Label and cameras if houseId is correct and cameras are available', async () => {

        const wrapper = mount(Cameras, {
            global:defaultGlobal
        })

        expect(wrapper.findComponent(NotFound).exists()).toBe(false)
        expect(wrapper.findComponent(Label).exists()).toBe(true)

        await wrapper.findComponent(Label).trigger('click')
        expect(wrapper.findComponent(CamerasList).exists()).toBe(true)
        expect(wrapper.findComponent(Map).exists()).toBe(true)
    })
})
