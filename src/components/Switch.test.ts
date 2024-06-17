import {DOMWrapper, mount} from '@vue/test-utils'
import {describe, it, expect} from 'vitest'
import Switch from '@/components/Switch.vue'

describe('Switch', () => {
    it('should render label when provided', () => {
        const wrapper = mount(Switch, {
            props: {
                label: 'Test Label',
            }
        });

        const label = wrapper.find('.toggle-switch__label');
        expect(label.exists()).toBe(true);
        expect(label.text()).toBe('Test Label');
    });

    it('should not render label when not provided', () => {
        const wrapper = mount(Switch);

        const label = wrapper.find('.toggle-switch__label');
        expect(label.exists()).toBe(false);
    });

    it('should apply justify style when provided', () => {
        const wrapper = mount(Switch, {
            props: {
                justify: 'flex-end',
            }
        });

        const container = wrapper.find('.toggle-switch__container');
        expect(container.attributes('style')).toContain('justify-content: flex-end');
    });

    it('should not apply justify style when not provided', () => {
        const wrapper = mount(Switch);

        const container = wrapper.find('.toggle-switch__container');
        expect(container.attributes('style')).toBeUndefined();
    });

    it('should update model value when clicked', async () => {
        const wrapper = mount(Switch, {
            props: {
                modelValue: false,
            }
        });

        const checkbox: DOMWrapper<HTMLInputElement> = wrapper.find('input[type="checkbox"]');
        await checkbox.setValue(true);

        expect(wrapper.emitted('update:modelValue')).toBeTruthy();
        expect(wrapper.emitted('update:modelValue')?.at(0)).toEqual([true]);
    });

    it('should reflect model value change', async () => {
        const wrapper = mount(Switch, {
            props: {
                modelValue: false,
            }
        });

        const checkbox: DOMWrapper<HTMLInputElement> = wrapper.find('input[type="checkbox"]');
        expect(checkbox.element.checked).toBe(false);

        await wrapper.setProps({modelValue: true});
        expect(checkbox.element.checked).toBe(true);
    });
});
