import {flushPromises, mount} from '@vue/test-utils';
import {beforeEach, describe, expect, it, Mock, vi} from 'vitest';
import EventsFilter from '@/components/EventsFilter.vue';
import useEventNames from '@/hooks/useEventNames.ts';
import useEvents from '@/hooks/useEvents.ts';
import mockClients from "@/mocks/Clients.ts";
import {defaultGlobal} from "@/mocks/__mockedGlobal.ts";
import {ref} from "vue";

// Мокаем зависимости
vi.mock('@/hooks/useEventNames.ts');
vi.mock('@/hooks/useEvents.ts');
vi.mock('@/components/Select.vue')

describe('EventsFilter', () => {
    const clients = mockClients

    const eventNames = {
        default: 'Default',
        event1: 'Event 1',
        event2: 'Event 2',
    };

    const eventsHook = {
        eventType: ref<string>(),
        flatId: ref<string>(),
    };

    beforeEach(() => {
        (useEventNames as Mock).mockReturnValue({eventNames: {value: eventNames}});
        (useEvents as Mock).mockReturnValue(eventsHook);
    });

    it('renders correctly with clients and event types', () => {
        const wrapper = mount(EventsFilter, {
            props: {clients},
            global: {
                provide: {
                    events: eventsHook,
                },
                ...defaultGlobal
            },
        });

        // Проверяем, что рендерятся Select компоненты
        const selects = wrapper.findAllComponents({name: 'Select'});
        expect(selects.length).toBe(2);

        // Проверяем, что опции типов событий корректные
        const typeOptions = selects[0].props('options');
        expect(typeOptions).toEqual([
            {id: 'event1', name: 'Event 1'},
            {id: 'event2', name: 'Event 2'},
        ]);

        // Проверяем, что опции клиентов корректные
        const clientOptions = selects[1].props('options');
        expect(clientOptions).toEqual([
            {id: '1A', name: '101'},
            {id: '2B', name: '102'},
            {id: '3C', name: '103'},
            {id: '4D', name: '104'},
        ]);
    });

    it('updates selectedType when eventType changes', async () => {
        const wrapper = mount(EventsFilter, {
            props: {clients},
            global: {
                provide: {
                    events: eventsHook,
                },
                ...defaultGlobal
            },
        });

        eventsHook.eventType.value = 'event1';
        await wrapper.vm.$nextTick();

        const selects = wrapper.findAllComponents({name: 'Select'});
        const selectedType = selects[0].props('modelValue');
        expect(selectedType).toEqual({id: 'event1', name: 'Event 1'});
    });

    it('updates selectedClient when flatId changes', async () => {

        const wrapper = mount(EventsFilter, {
            props: {clients},
            global: {
                provide: {
                    events: eventsHook,
                },
                ...defaultGlobal
            },
        });

        eventsHook.flatId.value = '1A';
        await flushPromises()

        const selects = wrapper.findAllComponents({name: 'Select'});
        const selectedClient = selects[1].props('modelValue');
        console.log(selectedClient)
        expect(selectedClient).toEqual({id: '1A', name: '101'});
    });

    it('updates eventType when selectedType changes', async () => {
        const wrapper = mount(EventsFilter, {
            props: {clients},
            global: {
                provide: {
                    events: eventsHook,
                },
                ...defaultGlobal
            },
        });

        const selects = wrapper.findAllComponents({name: 'Select'});
        await selects[0].vm.$emit('update:modelValue', {id: 'event2', name: 'Event 2'});

        expect(eventsHook.eventType.value).toBe('event2');
    });

    it('updates flatId when selectedClient changes', async () => {
        const wrapper = mount(EventsFilter, {
            props: {clients},
            global: {
                provide: {
                    events: eventsHook,
                },
                ...defaultGlobal
            },
        });

        const selects = wrapper.findAllComponents({name: 'Select'});
        await selects[1].vm.$emit('update:modelValue', {id: '2', name: '102'});

        expect(eventsHook.flatId.value).toBe('2');
    });
});
