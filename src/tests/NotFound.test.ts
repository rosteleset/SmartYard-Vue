import {mount} from '@vue/test-utils'
import {describe, expect, it} from 'vitest'
import NotFound from '@/components/NotFound.vue'
import {defaultGlobal} from "@/tests/__mocks.ts";

describe('NotFound', () => {
    it('renders 404 text', () => {
        const wrapper = mount(NotFound, {
            global: defaultGlobal
        })

        expect(wrapper.text()).toContain('404')
    })
})
