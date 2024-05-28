import {mount} from '@vue/test-utils'
import {describe, expect, it} from 'vitest'
import Map from '@/components/Map.vue'
import {LMap, LMarker, LTileLayer} from '@vue-leaflet/vue-leaflet'
import VideoModal from '@/components/VideoModal.vue'
import {mockCamera} from "@/tests/__mocks.ts";

describe('Map', () => {
    const cameras = [
        mockCamera,
        mockCamera
    ]

    it('renders map with markers', async () => {
        const wrapper = mount(Map, {
            props: { cameras }
        })

        // Проверка, что карта рендерится
        expect(wrapper.findComponent(LMap).exists()).toBe(true)

        // Проверка, что tile layer рендерится
        expect(wrapper.findComponent(LTileLayer).exists()).toBe(true)

        // Проверка, что маркеры рендерятся
        const markers = wrapper.findAllComponents(LMarker)
        expect(markers).toHaveLength(cameras.length)

        // Проверка, что маркеры имеют правильные координаты
        cameras.forEach((camera, index) => {
            const marker = markers[index]
            expect(marker.props().latLng).toEqual([camera.lat, camera.lon])
        })
    })

    it('opens modal on marker click', async () => {
        const wrapper = mount(Map, {
            props: { cameras }
        })

        // Находим маркер
        const marker = wrapper.findComponent(LMarker)
        await marker.trigger('click')

        // Проверка, что модальное окно открыто
        expect(wrapper.findComponent(VideoModal).exists()).toBe(true)
    })

    it('closes modal on modal close event', async () => {
        const wrapper = mount(Map, {
            props: { cameras }
        })

        // Открываем модальное окно
        const marker = wrapper.findComponent(LMarker)
        await marker.trigger('click')

        // Закрываем модальное окно
        const modal = wrapper.findComponent(VideoModal)
        await modal.vm.$emit('on-close')

        // Проверка, что модальное окно закрыто
        expect(wrapper.findComponent(VideoModal).exists()).toBe(false)
    })
})
