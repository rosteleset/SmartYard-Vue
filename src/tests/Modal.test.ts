import {mount} from '@vue/test-utils'
import {describe, it, expect} from 'vitest'
import Modal from '@/components/Modal.vue'
import {nextTick} from "vue";

describe('Modal', () => {
    it('renders correctly when open', async () => {
        const wrapper = mount(Modal, {
            props: {
                isOpen: true

            },
            slots: {
                default:"<div class='test'>test</div>"
            },
            global: {
                stubs: {
                    teleport: true,
                },
            },
        })

        await nextTick()

        expect(wrapper.find('.modal__overlay').exists()).toBe(true)
        expect(wrapper.find('.test').exists()).toBe(true)
    })

    it('does not render when closed', () => {
        const wrapper = mount(Modal, {
            props: {
                isOpen: false
            },
            global: {
                stubs: {
                    teleport: true,
                },
            },
        })
        expect(wrapper.find('.modal__overlay').exists()).toBe(false)
    })

    it('renders correctly when reopen', async () => {
        const wrapper = mount(Modal, {
            props: {
                isOpen: false,
            },
            slots: {
                default:"<div class='test'>test</div>"
            },
            global: {
                stubs: {
                    teleport: true,
                },
            },
        })

        expect(wrapper.find('.modal__overlay').exists()).toBe(false)
        await wrapper.setProps({ isOpen: true })

        expect(wrapper.find('.modal__overlay').exists()).toBe(true)
    })

    it('renders title when provided', async () => {
        const wrapper = mount(Modal, {
            props: {
                isOpen: true,
                title: 'Test Title'
            },
            global: {
                stubs: {
                    teleport: true,
                    transition: false
                },
            },
        })
        // ожидание анимации
        await nextTick()
        expect(wrapper.find('.modal__header h3').text()).toBe('Test Title')
    })

    it('emits onClose when close button is clicked', async () => {
        const wrapper = mount(Modal, {
            props: {
                isOpen: true
            },
            global: {
                stubs: {
                    teleport: true,
                    transition: false
                },
            },
        })

        // ожидание анимации
        await nextTick()

        await wrapper.find('.modal__close').trigger('click')
        expect(wrapper.emitted('onClose')).toHaveLength(1)
    })

    it('emits onClose when overlay is clicked', async () => {
        const wrapper = mount(Modal, {
            props: {
                isOpen: true
            },
            global: {
                stubs: {
                    teleport: true,
                    transition: false
                },
            },
        })

        // ожидание анимации
        await nextTick()

        await wrapper.find('.modal__overlay').trigger('click')
        expect(wrapper.emitted('onClose')).toHaveLength(1)
    })

    it('does not emit onClose when modal content is clicked', async () => {
        const wrapper = mount(Modal, {
            props: {
                isOpen: true
            },
            global: {
                stubs: {
                    teleport: true,
                    transition: false
                },
            },
        })

        // ожидание анимации
        await nextTick()

        await wrapper.find('.modal').trigger('click')
        expect(wrapper.emitted('onClose')).toBeUndefined()
    })
})