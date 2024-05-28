import {DOMWrapper, mount} from '@vue/test-utils'
import {describe, it, expect} from 'vitest'
import Switch from '@/components/Switch.vue'

describe('Switch', () => {
    it('renders correctly with props', () => {
        const wrapper = mount(Switch, {
            props: {
                label: 'Test Label',
                justify: 'flex-start',
            },
            modelValue: false
        })

        expect(wrapper.find('.toggle-switch__label').text()).toBe('Test Label')
        expect(wrapper.find('.toggle-switch__container').attributes().style).toContain('justify-content: flex-start')
    })

    it('toggles the switch', async () => {
        const wrapper = mount(Switch, {
            props: {},
            modelValue: false
        })

        const checkbox: DOMWrapper<HTMLInputElement> = wrapper.find('input[type="checkbox"]')
        expect(checkbox.element.checked).toBe(false)

        await checkbox.setValue()
        expect(checkbox.element.checked).toBe(true)
    })

    it('applies checked class correctly', async () => {
        const wrapper = mount(Switch, {
            props: {},
            modelValue: false
        })

        const toggleSwitch = wrapper.find('.toggle-switch')
        expect(toggleSwitch.classes()).not.toContain('toggle-switch--checked')

        const checkbox = wrapper.find('input[type="checkbox"]')
        await checkbox.setValue()
        expect(toggleSwitch.classes()).toContain('toggle-switch--checked')
    })
})