import {flushPromises, mount} from '@vue/test-utils';
import {beforeEach, describe, expect, it, vi} from 'vitest';
import Modal from '@/components/Modal.vue';
import TestWrapper from "@/mocks/TestWrapper.ts";
import {defaultGlobal} from "@/mocks/__mockedGlobal.ts";

// Мокаем зависимость
vi.mock('@/assets/close.svg?component', () => ({
    default: {
        template: '<svg></svg>'
    }
}));

describe('Modal', () => {
    let wrapper: TestWrapper<Partial<typeof Modal>>;
    beforeEach(() => {
        wrapper = mount(Modal, {
            props: {
                title: 'Test Modal',
                isOpen: true
            },
            slots: {
                default: '<div>Modal Content</div>'
            },
            global: defaultGlobal
        });
    });

    it('renders modal when isOpen is true', async () => {

        expect(wrapper.find('.modal').exists()).toBe(true);
        expect(wrapper.find('.modal__header h3').text()).toBe('Test Modal');
        expect(wrapper.find('.modal__body').text()).toBe('Modal Content');
    });

    it('emits onClose when clicking on close button', async () => {
        await wrapper.find('.modal__close').trigger('click');

        await flushPromises()
        expect(wrapper.emitted()).toHaveProperty('onClose');
    });

    it('emits onClose when clicking on overlay', async () => {
        await wrapper.find('.modal__overlay').trigger('click');
        expect(wrapper.emitted('onClose')).toBeTruthy();
    });

    it('does not close modal when clicking inside modal content', async () => {
        await wrapper.find('.modal').trigger('click');
        expect(wrapper.emitted('onClose')).toBeFalsy();
    });

    it('adds and removes scroll-block class to body on mount and unmount', async () => {
        await wrapper.setProps({isOpen: false})
        await wrapper.setProps({isOpen: true})
        await flushPromises()

        expect(document.body.classList.contains('scroll-block')).toBe(true);

        await wrapper.setProps({isOpen: false});
        expect(document.body.classList.contains('scroll-block')).toBe(false);
    });
});
