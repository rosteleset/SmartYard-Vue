// CamerasList.spec.ts
import {mount} from '@vue/test-utils'
import {describe, expect, it, vi} from 'vitest'
import CamerasList from '@/components/CamerasList.vue'
import {mockCameras} from "@/mocks/Cameras.ts";

// Mock modules
vi.mock('@/store/config', () => ({
    useConfigStore: vi.fn(() => ({
        config: {columnsCount: 4}
    }))
}))

vi.mock('@/components/VideoCard.vue')

describe('CamerasList', () => {
    it('renders the correct number of Video components', () => {
        const cameras = mockCameras
        const wrapper = mount(CamerasList, {
            props: {
                cameras
            }
        })

        const videoComponents = wrapper.findAllComponents({name: 'VideoCard'})
        expect(videoComponents.length).toBe(cameras.length)
    })

    it('passes the correct props to each Video component', () => {
        const cameras = mockCameras
        const wrapper = mount(CamerasList, {
            props: {
                cameras
            }
        })

        const videoComponents = wrapper.findAllComponents({name: 'VideoCard'})
        videoComponents.forEach((videoComponent, index) => {
            expect(videoComponent.props().camera).toEqual(cameras[index])
            expect(videoComponent.props().index).toBe(index + 1)
        })
    })

})
