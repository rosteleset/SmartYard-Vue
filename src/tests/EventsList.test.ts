import {mount} from '@vue/test-utils';
import {beforeEach, describe, expect, it} from 'vitest';
import EventsList from '@/components/EventsList.vue';
import EventsListDay from '@/components/EventsListDay.vue';
import {Client} from '@/types/user';
import {defaultGlobal} from "@/tests/__mocks.ts";

describe('EventsList', () => {
    let clients: Client[];

    beforeEach(() => {
        clients = [
            {
                houseId: 'house1',
                flatId: 'flat1',
                address: 'Address 1',
                services: ['internet'],
            },
            {
                houseId: 'house2',
                flatId: 'flat2',
                address: 'Address 2',
                services: ['phone'],
            },
        ];
    });

    it('renders a list of EventsListDay components based on days', () => {
        const wrapper = mount(EventsList, {
            props: { clients },
            global: defaultGlobal
        });

        const eventsListDays = wrapper.findAllComponents(EventsListDay);
        expect(eventsListDays.length).toBe(2);

        const dayProps = eventsListDays.map(wrapper => wrapper.props().day);
        expect(dayProps).toEqual([
            { day: '2023-01-01', events: '1' },
            { day: '2023-01-02', events: '2' },
        ]);
    });
});
