// Cameras.spec.ts
import {flushPromises, mount, VueWrapper} from '@vue/test-utils'
import {describe, expect, it, Mock, vi} from 'vitest'
import Cameras from '@/components/Cameras.vue'
import useCameras from '@/hooks/useCameras'
import {useAddressesStore} from '@/store/addresses'
import {defaultGlobal} from "@/mocks/__mockedGlobal.ts";
import {createTestingPinia} from "@pinia/testing";
import {mockBuildings} from "@/mocks/Building.ts";

// Mock modules
vi.mock('@/hooks/useCameras', () => ({
    default: vi.fn(() => ({
        cameras: []
    }))
}))

vi.mock('@/store/addresses', () => ({
    useAddressesStore: vi.fn(() => ({
        getAddressByHouseId: vi.fn()
    }))
}))

vi.mock('@/store/config', () => ({
    useConfigStore: vi.fn(() => ({
        config: {columnsCount: 4}
    }))
}))

vi.mock('@/components/Map.vue')
vi.mock('@/components/Label.vue')
vi.mock('@/components/CamerasList.vue')
vi.mock('@/components/NotFound.vue')


describe('Cameras', () => {
    it('renders NotFound component when houseId is invalid', () => {
        const getAddressByHouseId = vi.fn().mockReturnValue(undefined)
        // useAddressesStore.mockReturnValueOnce({getAddressByHouseId})
        const wrapper: VueWrapper<Partial<typeof Cameras>> = mount(Cameras, {
            props: {
                houseId: 'invalid-id'
            },
            global: {
                plugins: [
                    createTestingPinia({
                        createSpy: vi.fn(),
                        initialState: {
                            addresses: {
                                getAddressByHouseId
                            }
                        }
                    })
                ],
                mocks: defaultGlobal.mocks,
                stubs: defaultGlobal.stubs
            }
        })
        expect(wrapper.findComponent({name: 'NotFound'}).exists()).toBe(true)
    })

    it('renders CamerasList and Map components when cameras are available', async () => {
        (useCameras as Mock).mockReturnValueOnce({
            cameras: [{id: 1, name: 'Camera 1'}]
        })
        const getAddressByHouseId = vi.fn().mockReturnValue(mockBuildings[0])
        const mock = useAddressesStore as any
        mock.mockReturnValueOnce({getAddressByHouseId})
        const wrapper: VueWrapper<Partial<typeof Cameras>> = mount(Cameras, {
            props: {
                houseId: 'valid-id',
            },
            global: defaultGlobal
        })
        wrapper.vm.isOpen = true
        await flushPromises()
        expect(wrapper.findComponent({name: 'CamerasList'}).exists()).toBe(true)
        expect(wrapper.findComponent({name: 'Map'}).exists()).toBe(true)
    })

})
