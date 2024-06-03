import {mount} from '@vue/test-utils';
import {describe, expect, it} from 'vitest';
import Events from '@/components/Events.vue';
import EventsFilter from '@/components/EventsFilter.vue';
import EventsList from '@/components/EventsList.vue';
import Label from '@/components/Label.vue';
import {defaultGlobal, mockClients} from "@/tests/__mocks.ts";

describe('Events', () => {
    const houseId = 'house1';

    it('renders Label, EventsFilter, and EventsList components', async () => {
        const wrapper = mount(Events, {
            props: {houseId},
            global: defaultGlobal
        });

        expect(wrapper.findComponent(Label).exists()).toBe(true);
        expect(wrapper.findComponent(EventsFilter).exists()).toBe(false);
        expect(wrapper.findComponent(EventsList).exists()).toBe(false);

        await wrapper.findComponent(Label).trigger('click');

        expect(wrapper.findComponent(EventsFilter).exists()).toBe(true);
        expect(wrapper.findComponent(EventsList).exists()).toBe(true);
    });

    it('toggles event list visibility when label is clicked', async () => {
        const wrapper = mount(Events, {
            props: {houseId},
            global: defaultGlobal
        });

        const label = wrapper.findComponent(Label);
        await label.trigger('click');

        expect(wrapper.findComponent(EventsFilter).isVisible()).toBe(true);
        expect(wrapper.findComponent(EventsList).isVisible()).toBe(true);
    });

    it('passes clients prop to EventsFilter and EventsList components', async () => {
        const wrapper = mount(Events, {
            props: {houseId},
            global:defaultGlobal
        });
        await wrapper.findComponent(Label).trigger('click');

        const eventsFilter = wrapper.findComponent(EventsFilter);
        const eventsList = wrapper.findComponent(EventsList);

        expect(eventsFilter.props('clients')).toEqual(mockClients);

        expect(eventsList.props('clients')).toEqual([
            {
                houseId: 'house1',
                flatId: 'flat1',
                address: 'Address 1',
                services: ['internet'],
            },
            {
                houseId: 'house1',
                flatId: 'flat2',
                address: 'Address 2',
                services: ['phone'],
            },
        ]);
    });
});
