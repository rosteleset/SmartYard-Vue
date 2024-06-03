// tests/unit/EventsListDay.spec.ts

import {mount} from '@vue/test-utils';
import {beforeEach, describe, expect, it, vi} from 'vitest';
import EventsListDay from '@/components/EventsListDay.vue';
import EventsListItem from '@/components/EventsListItem.vue';
import {EventDay} from '@/types/events';
import {nextTick, ref} from 'vue';
import {mockEvents, mockGetEvents} from "@/tests/__mocks.ts";

const visibility = ref(false)
vi.mock('@vueuse/core', () => ({
    useElementVisibility: () => visibility
}))

describe('EventsListDay', () => {
    let day: EventDay;

    beforeEach(() => {
        visibility.value = false;
        day = {
            day: '2023-01-01',
            events: '1',
        };
    });

    it('renders the day label correctly', () => {
        const wrapper = mount(EventsListDay, {
            props: {day},
        });

        expect(wrapper.find('.day-label').text()).toBe('Sunday, 1 January');
    });

    it('loads events when element becomes visible', async () => {
        const wrapper = mount(EventsListDay, {
            props: {day},
        });

        // Simulate the element becoming visible
        (wrapper.vm as any).targetIsVisible = true;
        await nextTick();

        expect(mockGetEvents).toHaveBeenCalledWith(day);
        expect((wrapper.vm as any).events).toEqual([]);
    });

    it('displays the events correctly', async () => {
        const wrapper = mount(EventsListDay, {
            props: {day},
            global: {stubs:{transition:true}}
        });

        visibility.value = true
        await nextTick();
        await nextTick();
        await nextTick();
        await nextTick();

        expect((wrapper.vm as any).events).toEqual(mockEvents);
        expect(wrapper.findAllComponents(EventsListItem).length).toBe(2);
    });

    it('updates events when dependencies change', async () => {
        const wrapper = mount(EventsListDay, {
            props: {day},
        });

        visibility.value = true;
        await nextTick();
        await nextTick();
        await nextTick();
        await nextTick(); // wait for events to be fetched

        expect((wrapper.vm as any).events).toEqual(mockEvents);

        // Simulate dependency change
        (wrapper.vm as any).flatId = 'newFlatId';
        await nextTick();
        expect((wrapper.vm as any).events).toEqual([]);

        visibility.value = true;
        await nextTick();
        await nextTick(); // wait for events to be fetched again

        expect((wrapper.vm as any).events).toEqual(mockEvents);
    });
});
