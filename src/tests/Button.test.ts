import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import Button from '@/components/Button.vue'

describe('Button.vue', () => {
  it('renders with correct default classes', () => {
    const wrapper = mount(Button, {
      props: {
        variant: 'primary'
      }
    })
    const button = wrapper.find('button')
    expect(button.classes()).toContain('button-primary')
  })

  it('applies the correct variant class', () => {
    const wrapper = mount(Button, {
      props: {
        variant: 'success'
      }
    })
    const button = wrapper.find('button')
    expect(button.classes()).toContain('button-success')
  })

  it('applies the bordered class when bordered is true', () => {
    const wrapper = mount(Button, {
      props: {
        variant: 'error',
        bordered: true
      }
    })
    const button = wrapper.find('button')
    expect(button.classes()).toContain('button-error')
    expect(button.classes()).toContain('button-bordered')
  })

  it('disables the button when disabled is true', () => {
    const wrapper = mount(Button, {
      props: {
        variant: 'primary',
        disabled: true
      }
    })
    const button = wrapper.find('button')
    expect(button.attributes('disabled')).toBeDefined()
  })

  it('emits click event when clicked', async () => {
    const wrapper = mount(Button, {
      props: {
        variant: 'primary'
      }
    })
    const button = wrapper.find('button')
    await button.trigger('click')
    expect(wrapper.emitted()).toHaveProperty('click')
  })
})
