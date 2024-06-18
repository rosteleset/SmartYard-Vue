import {flushPromises, mount} from '@vue/test-utils';
import {beforeEach, describe, expect, it, Mock, vi} from 'vitest';
import EventsListItem from '@/components/EventsListItem.vue';
import Modal from '@/components/Modal.vue';
import Button from '@/components/Button.vue';
import useEventNames from '@/hooks/useEventNames';
import useLocale from '@/hooks/useLocale';
import useFaces from '@/hooks/useFaces';
import {mockEvents} from "@/mocks/Events.ts";
import {Event} from '@/types/events'
import {defaultGlobal} from "@/mocks/__mockedGlobal.ts";

// Мокаем зависимости
vi.mock('@/hooks/useEventNames');
vi.mock('@/hooks/useLocale');
vi.mock('@/hooks/useFaces');
vi.mock('@/assets/information.svg?component', () => ({
    default: {
        template: '<svg></svg>'
    }
}));
vi.mock('@/components/ImageWithFace.vue')

describe('EventsListItem', () => {
    const event = mockEvents[0]

    const eventNames = {
        'test-event': 'Test Event',
        'default': 'Default Event'
    };

    const localizedDayjs = vi.fn(() => ({
        format: vi.fn().mockReturnValue('12:00')
    }));

    const add = vi.fn().mockResolvedValue(true);
    const remove = vi.fn().mockResolvedValue(true);

    beforeEach(() => {
        (useEventNames as Mock).mockReturnValue({eventNames: {value: eventNames}});
        (useLocale as Mock).mockReturnValue({localizedDayjs: {value: localizedDayjs}});
        (useFaces as Mock).mockReturnValue({add, remove});
    });

    it('renders event name and time correctly', () => {
        const wrapper = mount(EventsListItem, {
            props: {event},
            global: defaultGlobal
        });

        expect(wrapper.find('.event span').text()).toBe('Default Event');
        expect(wrapper.find('.event__time').text()).toBe('12:00');
    });

    it('opens and closes modal', async () => {
        const wrapper = mount(EventsListItem, {
            props: {event},
            global: defaultGlobal
        });

        await wrapper.find('.event').trigger('click');
        expect(wrapper.findComponent(Modal).props('isOpen')).toBe(true);

        wrapper.findComponent(Modal).vm.$emit('onClose');
        await flushPromises()
        expect(wrapper.findComponent(Modal).props('isOpen')).toBe(false);
    });

    it('renders like button and handles like', async () => {
        const wrapper = mount(EventsListItem, {
            props: {event},
            global: defaultGlobal
        });

        await wrapper.find('.event').trigger('click');
        await flushPromises()
        const likeButton = wrapper.findComponent(Button);

        expect(likeButton.exists()).toBe(true);
        expect(likeButton.text()).toBe('Translated events.like');  // Assuming the translation key for like is 'events.like'

        await likeButton.trigger('click');
        expect(add).toHaveBeenCalledWith(event.uuid);
    });

    it('renders dislike button and handles dislike', async () => {
        const eventWithDislike: Event = mockEvents[1];

        const wrapper = mount(EventsListItem, {
            props: {event: eventWithDislike},
            global: defaultGlobal
        });

        await wrapper.find('.event').trigger('click');
        const dislikeButton = wrapper.findComponent(Button);

        expect(dislikeButton.exists()).toBe(true);
        expect(dislikeButton.text()).toBe('Translated events.dislike');  // Assuming the translation key for dislike is 'events.dislike'

        await dislikeButton.trigger('click');
        expect(remove).toHaveBeenCalledWith({event: eventWithDislike.uuid});
    });
});
