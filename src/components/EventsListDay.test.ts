import {flushPromises, mount} from '@vue/test-utils';
import {beforeEach, describe, expect, it, Mock, vi} from 'vitest';
import EventsListDay from '@/components/EventsListDay.vue';
import EventsListItem from '@/components/EventsListItem.vue';
import useLocale from '@/hooks/useLocale';
import useEvents from '@/hooks/useEvents.ts';
import {ref} from 'vue';
import {defaultGlobal} from "@/mocks/__mockedGlobal.ts";
import {useElementVisibility} from "@vueuse/core";
import {mockEvents} from "@/mocks/Events.ts";

// Мокаем зависимости
vi.mock('@/hooks/useLocale');
vi.mock('@/hooks/useEvents.ts');
vi.mock('@vueuse/core', () => ({
    useElementVisibility: vi.fn()
}));
vi.mock('@/components/EventsListItem.vue')

describe('EventsListDay', () => {
    const day = {
        day: '2024-06-13',
        events: '1',
    };

    const mockGetEvents = vi.fn().mockResolvedValue(mockEvents);
    const eventsHook = {
        getEvents: mockGetEvents,
        eventType: ref<string>(),
        flatId: ref<string>(),
    };

    const mockLocalizedDayjs = vi.fn(() => ({
        format: () => 'Thursday, 13 June',
    }));

    const mockVisibility = ref(false)

    beforeEach(() => {
        (useElementVisibility as Mock).mockReturnValue(mockVisibility);
        (useLocale as Mock).mockReturnValue({localizedDayjs: ref(mockLocalizedDayjs)});
        (useEvents as Mock).mockReturnValue(eventsHook);
    });

    it('renders localized date correctly', async () => {
        const wrapper = mount(EventsListDay, {
            props: {day},
            global: {
                provide: {
                    events: eventsHook,
                },
                ...defaultGlobal
            },
        });

        const dayLabel = wrapper.find('.day-label');
        expect(dayLabel.text()).toBe('Thursday, 13 June');
    });

    it('fetches and renders events when visible', async () => {
        const wrapper = mount(EventsListDay, {
            props: {day},
            global: {
                provide: {
                    events: eventsHook,
                },
                ...defaultGlobal
            },
        });

        mockVisibility.value = true
        await flushPromises()

        expect(mockGetEvents).toHaveBeenCalledWith(day);

        const eventItems = wrapper.findAllComponents(EventsListItem);
        expect(eventItems.length).toBe(2);
        expect(eventItems[0].props('event')).toEqual(mockEvents[0]);
    });

    it('updates events when filters change', async () => {
        const wrapper = mount(EventsListDay, {
            props: {day},
            global: {
                provide: {
                    events: eventsHook,
                },
                ...defaultGlobal
            },
        });

        mockGetEvents.mockResolvedValue(mockEvents.slice(1))
        eventsHook.flatId.value = '1';
        await flushPromises();

        expect(mockGetEvents).toHaveBeenCalledWith(day);
        const eventItems = wrapper.findAllComponents(EventsListItem);
        expect(eventItems.length).toBe(1);
        expect(eventItems[0].props('event')).toEqual(mockEvents[1]);
    });
});
