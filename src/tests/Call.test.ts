// tests/unit/Call.spec.ts
import {mount} from '@vue/test-utils'
import {describe, expect, it, vi} from 'vitest'
import Call from '@/components/Call.vue'
import Modal from '@/components/Modal.vue'
import Button from '@/components/Button.vue'
import {usePushStore} from '@/store/push'
import {defaultGlobal} from "@/tests/__mocks.ts";
import {createTestingPinia} from "@pinia/testing";

vi.mock('firebase/messaging')
vi.mock('@/lib/openDoor')
const pinia = createTestingPinia({createSpy: vi.fn});

const store = usePushStore(pinia)

describe('Call', () => {
    const pushStoreMock = {
        call: {
            data: {
                callerId: 'caller123',
                domophoneId: '123',
                dtmf: 'dtmf',
                extension: 'extension',
                flatId: 'flatId',
                flatNumber: 'flatNumber',
                hash: 'hash',
                pass: 'pass',
                platform: 'platform',
                port: 'port',
                server: 'server',
                stun: 'stun',
                stunTransport: 'stunTransport',
                timestamp: 'timestamp',
                transport: 'transport',
                ttl: 'ttl',
            },
            from: 'test',
            collapseKey: '1',
            messageId: '1'
        },
        setCall: vi.fn()
    }
    const setCall= vi.fn()
    store.setCall = setCall
    store.call = pushStoreMock.call

    it('displays a modal window when there is a call', async () => {
        const wrapper = mount(Call, {global: defaultGlobal})
        await wrapper.vm.$nextTick()

        expect(wrapper.findComponent(Modal).props('isOpen')).toBe(true)
        expect(wrapper.find('.wrap').exists()).toBe(true)
    })

    it('does not display modal window when not called', async () => {
        store.call = undefined

        const wrapper = mount(Call)
        await wrapper.vm.$nextTick()

        expect(wrapper.findComponent(Modal).props('isOpen')).toBe(false)
        expect(wrapper.find('.wrap').exists()).toBe(false)
    })

    it('displays the call image', async () => {
        store.call = pushStoreMock.call
        const wrapper = mount(Call, {global: defaultGlobal})
        await wrapper.vm.$nextTick()

        const img = wrapper.find('img.image')
        expect(img.exists()).toBe(true)
        expect(img.attributes('src')).toBe('https://rbt-demo.lanta.me/mobile/call/live/hash')
    })

    it('opens the door when you press the "open" button', async () => {
        const wrapper = mount(Call)
        const button = wrapper.findAllComponents(Button).find(btn => btn.text() === 'call.open')
        await button?.trigger('click')
        // expect(wrapper.vm.openDoor).toHaveBeenCalledWith(Number(pushStoreMock.call.data.domophoneId))
    })

    it('ignores the call when pressing the "ignore" button', async () => {
        const wrapper = mount(Call, {global:defaultGlobal})
        await wrapper.vm.$nextTick()

        const button = wrapper.findAllComponents(Button).find(btn => btn.text() === 'Translated Text call.ignore')
        await button?.trigger('click')

        expect(store.setCall).toHaveBeenCalled()
    })
})
