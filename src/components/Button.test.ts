import {describe, expect, it} from 'vitest';
import {mount} from '@vue/test-utils';
import Button from '@/components/Button.vue';

describe('Button', () => {
    it('renders with correct variant class', async () => {
        const wrapper = mount(Button, {
            props: {
                variant: 'primary'
            }
        });
        expect(wrapper.classes()).toContain('button-primary');

        await wrapper.setProps({variant: 'success'});
        expect(wrapper.classes()).toContain('button-success');

        await wrapper.setProps({variant: 'error'});
        expect(wrapper.classes()).toContain('button-error');
    });

    it('renders with bordered class when bordered is true', () => {
        const wrapper = mount(Button, {
            props: {
                variant: 'primary',
                bordered: true
            }
        });
        expect(wrapper.classes()).toContain('button-bordered');
    });

    it('is disabled when disabled prop is true', () => {
        const wrapper = mount(Button, {
            props: {
                variant: 'primary',
                disabled: true
            }
        });
        expect(wrapper.attributes('disabled')).toBeDefined();
    });

    it('emits click event when clicked', async () => {
        const wrapper = mount(Button, {
            props: {
                variant: 'primary'
            }
        });

        await wrapper.trigger('click');
        expect(wrapper.emitted()).toHaveProperty('click');
    });

    it('does not emit click event when disabled', async () => {
        const wrapper = mount(Button, {
            props: {
                variant: 'primary',
                disabled: true
            }
        });

        await wrapper.trigger('click');
        expect(wrapper.emitted()).not.toHaveProperty('click');
    });

    it('renders slot content', () => {
        const wrapper = mount(Button, {
            props: {
                variant: 'primary'
            },
            slots: {
                default: 'Click Me'
            }
        });
        expect(wrapper.text()).toBe('Click Me');
    });
});
