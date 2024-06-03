import {mount, VueWrapper} from '@vue/test-utils';
import {describe, expect, it, vi} from 'vitest';
import EventsListItem from '@/components/EventsListItem.vue';
import Modal from '@/components/Modal.vue';
import Button from '@/components/Button.vue';
import {Event} from '@/types/events';
import {nextTick} from 'vue';
import {defaultGlobal, FakeTransition, mockEvents} from "@/tests/__mocks.ts";

const openModal = async (wrapper:VueWrapper) => {
    await wrapper.find('.event__button').trigger('click');
    wrapper.findComponent(FakeTransition).vm.emitEnter()
    await nextTick()
}

const facesAdd = vi.fn().mockResolvedValue(undefined)
const facesRemove = vi.fn().mockResolvedValue(undefined)

vi.mock('@/hooks/useFaces', () => ({
    default: () => ({
        add: facesAdd,
        remove: facesRemove,
    }),
}));

describe('EventsListItem', () => {


    it('renders event information correctly', () => {
        const wrapper = mount(EventsListItem, {
            props: {event: mockEvents[0]},
        });

        expect(wrapper.find('.event span').text()).toBe('Event 1');
        expect(wrapper.find('.event__time').text()).toBe('00:00');
    });

    it('opens and closes modal on click', async () => {
        const wrapper = mount(EventsListItem, {
            props: {event: mockEvents[0]},
        });

        await wrapper.find('.event').trigger('click');
        await nextTick();

        expect(wrapper.findComponent(Modal).props('isOpen')).toBe(true);

        await wrapper.findComponent(Modal).vm.$emit('on-close');
        await nextTick();

        expect(wrapper.findComponent(Modal).props('isOpen')).toBe(false);
    });

    it('displays like and dislike buttons based on event flags', async () => {
        const wrapper = mount(EventsListItem, {
            props: {event: mockEvents[0]},
            global: defaultGlobal,
        });

        // обработка анимации модального окна
        await openModal(wrapper)

        expect(wrapper.findAllComponents(Button).length).toBe(1);
        expect(wrapper.findComponent(Button).text()).toBe(`Translated Text events.like`);
    });

    it('calls add and remove functions on like button clicks', async () => {
        const wrapper = mount(EventsListItem, {
            props: {event: mockEvents[0]},
            global: defaultGlobal,
        });

        // обработка анимации модального окна
        await openModal(wrapper)

        await wrapper.find('.button-success').trigger('click');
        expect(facesAdd).toHaveBeenCalledWith(mockEvents[0].uuid);

        const updatedEvent: Event = {...mockEvents[0], detailX: {...mockEvents[0].detailX, flags: ['canDislike']}};
        await wrapper.setProps({event: updatedEvent});
    });

    it('calls add and remove functions on dislike button clicks', async () => {
        const wrapper = mount(EventsListItem, {
            props: {event: mockEvents[0]},
            global: defaultGlobal,
        });

        const updatedEvent: Event = {...mockEvents[0], detailX: {...mockEvents[0].detailX, flags: ['canDislike']}};
        await wrapper.setProps({event: updatedEvent});

        // обработка анимации модального окна
        await openModal(wrapper)

        await wrapper.find('.button-error').trigger('click');
        expect(facesAdd).toHaveBeenCalledWith(mockEvents[0].uuid);
    });

    it('displays image error message when preview is not provided', async () => {
        const modifiedEvent = {...mockEvents[0], preview: undefined};
        const wrapper = mount(EventsListItem, {
            props: {event: modifiedEvent},
            global: defaultGlobal,
        });

        // обработка анимации модального окна
        await openModal(wrapper)

        expect(wrapper.find('.error').exists()).toBe(true);
    });
});
