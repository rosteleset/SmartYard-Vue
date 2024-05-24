import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {mount, VueWrapper} from '@vue/test-utils'
import VideoModal from '@/components/VideoModal.vue'
import {Camera} from "@/types/camera.ts";
import {ref} from "vue";

vi.mock('rbt-player', () => ({
    PlayerFactory: {
        createPlayer: vi.fn().mockReturnValue({
            play: vi.fn(),
            pause: vi.fn(),
            onDestroy: vi.fn(),
            calculateAspectRatio: vi.fn(),
            getSize: vi.fn(() => ({ width: '100%', height: '100%' })),
            generateStream: vi.fn(),
        })
    }
}))

vi.mock('@/hooks/useZoom', () => ({
    useZoom: () => ({
        onDrag: ref(false),
        videoStyles: ref({})
    })
}))

vi.mock('@/hooks/useRanges', () => ({
    useRanges: () => ({
        stream: ref([]),
    })
}))
describe('VideoModal.vue', () => {
    let wrapper:VueWrapper<any>;

    beforeEach(() => {
        wrapper = mount(VideoModal, {
            props: {
                camera: {
                    id: 1,
                    url: 'https://example.com/stream',
                    serverType: 'test',
                    token: '123'
                } as Camera,
                styles: {  }
            }
        })
    })

    afterEach(() => {
        wrapper.unmount()
    })

    it('creates a player on mounted', async () => {
        expect(wrapper.vm.player).toBeDefined()
    })
    //
    // it('applies styles on can play event', async () => {
    //     await wrapper.vm.onCanPlay()
    //     expect(wrapper.vm.styles.value).toEqual({ width: '100%', height: '100%' })
    // })
    //
    // it('handles play/pause based on video state', async () => {
    //     const videoEl = wrapper.vm.videoElement.value = {
    //         paused: true,
    //         play: vi.fn(),
    //         pause: vi.fn(),
    //     }
    //     await wrapper.vm.playPause()
    //     expect(videoEl.play).toHaveBeenCalled()
    //
    //     videoEl.paused = false
    //     await wrapper.vm.playPause()
    //     expect(videoEl.pause).toHaveBeenCalled()
    // })
    //
    // it('reacts to range change to generate stream', async () => {
    //     const newRange = { from: '2021-01-01T00:00:00Z', duration: 3600 }
    //     wrapper.vm.currentRange.value = newRange
    //     await nextTick()
    //     expect(wrapper.vm.player.value.generateStream).toHaveBeenCalledWith(newRange.from, newRange.duration)
    // })
    //
    // it('cleans up on unmount', async () => {
    //     await wrapper.unmount()
    //     expect(wrapper.vm.player.value.onDestroy).toHaveBeenCalled()
    //     expect(document.body.classList.contains('scroll-block')).toBe(false)
    // })
    //
    // it('emits close on mousedown', async () => {
    //     wrapper.find('.video-wrap').trigger('mousedown')
    //     expect(wrapper.emitted()).toHaveProperty('onClose')
    // })
})
