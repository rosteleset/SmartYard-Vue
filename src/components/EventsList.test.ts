import {mount} from '@vue/test-utils';
import {describe, it, expect, beforeEach, vi, Mock} from 'vitest';
import EventsList from '@/components/EventsList.vue';
import EventsListDay from '@/components/EventsListDay.vue';
import useEvents from '@/hooks/useEvents.ts';
import mockClients from "@/mocks/Clients.ts";

// Мокаем зависимость useEvents
vi.mock('@/hooks/useEvents.ts');
vi.mock('@/components/EventsListDay.vue')

describe('EventsList', () => {
    const clients = mockClients

    const mockDays = [
        {day: '2024-06-13', events: [{id: 1, name: 'Event 1'}]},
        {day: '2024-06-14', events: [{id: 2, name: 'Event 2'}]},
    ];

    const eventsHook = {
        days: mockDays,
    };

    beforeEach(() => {
        (useEvents as Mock).mockReturnValue(eventsHook);
    });

    it('renders correctly with days', () => {
        const wrapper = mount(EventsList, {
            props: {clients},
            global: {
                provide: {
                    events: eventsHook,
                },
            },
        });

        // Проверяем, что рендерятся EventsListDay компоненты
        const eventDayComponents = wrapper.findAllComponents(EventsListDay);
        expect(eventDayComponents.length).toBe(mockDays.length);

        // Проверяем, что каждый компонент EventsListDay получает правильный пропс
        eventDayComponents.forEach((component, index) => {
            expect(component.props('day')).toEqual(mockDays[index]);
        });
    });
});
