import {mount} from '@vue/test-utils'
import {describe, expect, it} from 'vitest'
import Push from '@/components/Push.vue'
import {defaultGlobal, mockNotifications} from "@/tests/__mocks.ts";


describe('Push', () => {
    it('renders notifications', () => {

        const wrapper = mount(Push, {
            global: defaultGlobal
        })

        for (const mockNotification of mockNotifications) {
            const item = wrapper.find(`.item-${mockNotification.messageId}`)
            expect(item.text()).toContain(mockNotification.notification.title)
            expect(item.text()).toContain(mockNotification.notification.body)
        }
    })

    it('calls router.push on notification click', async () => {


        const wrapper = mount(Push, {
            global: defaultGlobal
        })

        await wrapper.find('.item').trigger('click')
        expect(defaultGlobal.mocks.$router.push).toHaveBeenCalledWith('/chat')
    })

    it('removes notification on close icon click', async () => {

        const wrapper = mount(Push, {
            global: defaultGlobal
        })

        await wrapper.find('.close-icon').trigger('click')
        expect((wrapper.vm as any).push.removeNotification).toHaveBeenCalledWith(mockNotifications[0])
    })
})
