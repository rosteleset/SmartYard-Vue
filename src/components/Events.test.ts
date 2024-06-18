// Events.spec.ts
import {mount} from '@vue/test-utils'
import {beforeEach, describe, expect, it, Mock, vi} from 'vitest'
import Events from '@/components/Events.vue'
import useEvents from '@/hooks/useEvents'
import {defaultGlobal} from "@/mocks/__mockedGlobal.ts";
import mockClients from "@/mocks/Clients.ts";
import {ref} from "vue";

vi.mock('@/assets/events.svg?component', () => ({
    default: {
        name: 'EventIcon',
        template: '<svg></svg>',
    },
}))

vi.mock("@/components/EventsFilter.vue");
vi.mock("@/components/EventsList.vue");

vi.mock('@/hooks/useEvents', () => ({
    default: vi.fn(),
}))

vi.mock("@/store/addresses", () => ({
    useAddressesStore: () => ({
        getClientsByHouseId: vi.fn().mockReturnValue(ref(mockClients))
    })
}))

describe('Events', () => {

    beforeEach(() => {
        (useEvents as Mock).mockReturnValue([]);
    })

    it('renders correctly', () => {
        const wrapper = mount(Events, {
            props: {
                houseId: '1234',
            },
            global: defaultGlobal
        })
        expect(wrapper.exists()).toBe(true)
    })

    it('displays the correct label', () => {
        const wrapper = mount(Events, {
            props: {
                houseId: '1234',
            },
            global: defaultGlobal,
        })

        const label = wrapper.findComponent({name: 'Label'})
        expect(label.exists()).toBe(true)
        expect(label.props('text')).toBe('Translated addresses.events')
    })

    it('toggles the events list when label is clicked', async () => {
        const wrapper = mount(Events, {
            props: {
                houseId: '1234',
            },
            global: defaultGlobal
        })

        const label = wrapper.findComponent({name: 'Label'})
        await label.trigger('click')

        const eventsDiv = wrapper.find('.events')
        expect(eventsDiv.exists()).toBe(true)
    })

    it('provides events to child components', () => {
        mount(Events, {
            props: {
                houseId: '1234',
            },
            global: defaultGlobal
        })

        expect(useEvents).toHaveBeenCalledWith(mockClients.map(item => item.flatId))
    })

    it('renders EventsFilter and EventsList components when open', async () => {
        const wrapper = mount(Events, {
            props: {
                houseId: '1234',
            },
            global: defaultGlobal
        })

        const label = wrapper.findComponent({name: 'Label'})
        await label.trigger('click')

        const eventsFilter = wrapper.findComponent({name: 'EventsFilter'})
        const eventsList = wrapper.findComponent({name: 'EventsList'})
        expect(eventsFilter.exists()).toBe(true)
        expect(eventsList.exists()).toBe(true)
    })
})
