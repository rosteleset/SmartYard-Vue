import {mount} from '@vue/test-utils';
import {beforeEach, describe, expect, it} from 'vitest';
import EventsFilter from '@/components/EventsFilter.vue';
import {Client} from '@/types/user';
import {defaultGlobal} from "@/tests/__mocks.ts";


describe('EventsFilter', () => {
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

    it('renders Select components for event types and clients', () => {
        const wrapper = mount(EventsFilter, {
            props: { clients },
            global: defaultGlobal
        });

        const selects = wrapper.findAllComponents({name:"Select"});
        expect(selects.length).toBe(2);

        const eventTypes = selects[0].props().options;
        expect(eventTypes).toEqual([
            { id: "1", name: "Event 1" },
            { id: "2", name: "Event 2" },
        ]);

        const clientOptions = selects[1].props().options;
        expect(clientOptions).toEqual([
            { id: 'flat1', name: 'flat1' },
            { id: 'flat2', name: 'flat2' },
        ]);
    });

    it('correctly sets selectedType and selectedClient', async () => {
        const wrapper = mount(EventsFilter, {
            props: { clients },
            global: defaultGlobal
        });

        const eventSelect = wrapper.findAllComponents({name:"Select"})[0];
        const clientSelect = wrapper.findAllComponents({name:"Select"})[1];
        await eventSelect.vm.$emit('update:modelValue', { id: "2", name: "Event 2" });
        expect((wrapper.vm as any).events.eventType.value).toBe("2");

        await clientSelect.vm.$emit('update:modelValue', { id: "flat2", name: "flat2" });
        expect((wrapper.vm as any).events.flatId.value).toBe("flat2");
    });
});
