import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import PhoneInput from '@/components/PhoneInput.vue'

describe('PhoneInput', () => {
    it('applies phone mask correctly', async () => {
        const wrapper = mount(PhoneInput, {
            props: {
                modelValue: '79991234567'
            }
        })

        const input = wrapper.find('input')
        await input.setValue('89991234567')

        expect(input.element.value).toBe('+7 (999) 123-45-67')
    })

    it('emits update:modelValue with correct value', async () => {
        const wrapper = mount(PhoneInput, {
            props: {
                modelValue: ''
            }
        })

        const input = wrapper.find('input')
        await input.setValue('89991234567')

        expect(wrapper.emitted()['update:modelValue'][0]).toEqual(['79991234567'])
    })

    it('renders modelValue correctly', async () => {
        const wrapper = mount(PhoneInput, {
            props: {
                modelValue: '79991234567'
            }
        })

        const input = wrapper.find('input')
        expect(input.element.value).toBe('+7 (999) 123-45-67')
    })
})
