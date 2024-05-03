import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import {mount, VueWrapper} from '@vue/test-utils'
import Video from '@/components/Video.vue'
import {nextTick} from 'vue'
import {Camera} from "@/types/camera.ts";


vi.mock('@/store/config', () => ({
    useConfigStore: () => ({
        config: {watchmanMode: false}
    })
}))

vi.mock('rbt-player', () => ({
    PlayerFactory: {
        createPlayer: vi.fn().mockReturnValue({
            play: vi.fn(),
            pause: vi.fn(),
            onDestroy: vi.fn()
        })
    }
}))

describe('Video.vue', () => {
    let wrapper: VueWrapper<any>;

    beforeEach(() => {
        wrapper = mount(Video, {
            props: {
                camera: {
                    id: 1,
                    url: 'https://example.com/stream',
                    serverType: 'test',
                    token: '123'
                } as Camera,
                index: 1
            }
        })
    })

    afterEach(() => {
        wrapper.unmount()
    })

    it('mounts the player when the component is visible', async () => {
        wrapper.vm.mount()
        await nextTick()

        expect(wrapper.vm.player).toBeDefined()
    })

    it('destroys the player on unmount', async () => {
        wrapper.vm.mount()
        await nextTick()
        const player = wrapper.vm.player
        wrapper.vm.dismount()
        expect(player.onDestroy).toHaveBeenCalled()
    })

    it('handles opening and closing of the modal', async () => {
        await wrapper.vm.openHandler()
        expect(wrapper.vm.isOpen).toBe(true)
        expect(wrapper.vm.styles).toBeDefined()

        wrapper.vm.closeHandler()
        expect(wrapper.vm.isOpen).toBe(false)
    })

    it('pauses the player when component becomes invisible', async () => {
        wrapper.vm.targetIsVisible = true
        await nextTick()
        wrapper.vm.targetIsVisible = false
        await nextTick()
        expect(wrapper.vm.timer).toBeDefined()
    })
})
