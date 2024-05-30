import {mount} from '@vue/test-utils'
import {describe, expect, it} from 'vitest'
import Label from '@/components/Label.vue'
import ArrowIcon from "@/assets/arrowRight.svg?component";
import {markRaw} from "vue";

describe('Label', () => {
    it('renders icon, text, and arrow', async () => {
        const text = 'Label Text'
        const wrapper = mount(Label, {
            props: {icon: markRaw(ArrowIcon), text}
        })
        const iconElement = wrapper.find('.icon svg')
        expect(iconElement.exists()).toBe(true)

        const textElement = wrapper.find('.text')
        expect(textElement.text()).toBe(text)

        const arrowElement = wrapper.find('.arrow svg')
        expect(arrowElement.exists()).toBe(true)
    })

    it('emits toggle event when label is clicked', async () => {
        const text = 'Label Text'
        const wrapper = mount(Label, {
            props: {icon: markRaw(ArrowIcon), text}
        })

        await wrapper.trigger('click')
        const toggle: [][] = wrapper.emitted('toggle') || []
        expect(wrapper.emitted('toggle')).toBeTruthy()
        expect(toggle[0]).toEqual([true])

        await wrapper.trigger('click')
        expect(toggle[1]).toEqual([false])
    })
})
