import {mount} from '@vue/test-utils'
import {describe, expect, it, vi} from 'vitest'
import Door from '@/components/Door.vue'
import openDoor from '@/lib/openDoor'
import {mockDomophones} from "@/mocks/Domophone.ts";
import {defaultGlobal} from "@/mocks/__mockedGlobal.ts";

// Mock the icons
vi.mock('@/assets/barrier.svg?component', () => ({
    default: {
        name: 'BarrierIcon',
        template: '<svg></svg>',
    },
}))

vi.mock('@/assets/entrance.svg?component', () => ({
    default: {
        name: 'EntranceIcon',
        template: '<svg></svg>',
    },
}))

vi.mock('@/assets/gate.svg?component', () => ({
    default: {
        name: 'GateIcon',
        template: '<svg></svg>',
    },
}))

vi.mock('@/lib/openDoor', () => ({
    default: vi.fn(),
}))

describe('Door', () => {
    const domophoneData = mockDomophones[0]

    it('renders correctly', () => {
        const wrapper = mount(Door, {
            props: {
                data: domophoneData,
            },
            global: defaultGlobal
        })
        expect(wrapper.exists()).toBe(true)
    })

    it('displays the correct name', () => {
        const wrapper = mount(Door, {
            props: {
                data: domophoneData,
            },
            global: defaultGlobal
        })

        const label = wrapper.find('.door__label')
        expect(label.text()).toBe(domophoneData.name)
    })

    it('uses the correct icon', () => {
        const wrapper = mount(Door, {
            props: {
                data: domophoneData,
            },
            global: defaultGlobal
        })

        const icon = wrapper.findComponent({name: 'EntranceIcon'})
        expect(icon.exists()).toBe(true)
    })

    it('calls openDoor with the correct domophoneId when button is clicked', async () => {
        const wrapper = mount(Door, {
            props: {
                data: domophoneData,
            },
            global: defaultGlobal
        })

        const button = wrapper.find('button')
        await button.trigger('click')

        expect(openDoor).toHaveBeenCalledWith(domophoneData.domophoneId)
    })
})
