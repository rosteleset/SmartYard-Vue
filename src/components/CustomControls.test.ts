// CustomControls.spec.ts
import {DOMWrapper, flushPromises, mount} from '@vue/test-utils'
import {beforeEach, describe, expect, it, vi} from 'vitest'
import CustomControls from '@/components/CustomControls.vue'
import dayjs from 'dayjs'
import {mockFormatedRanges} from "@/mocks/Streams.ts";

// Mock the icons
vi.mock('../assets/play.svg?component', () => ({
    default: {
        name: 'PlayIcon',
        template: '<svg></svg>',
    },
}))

vi.mock('../assets/settings.svg?component', () => ({
    default: {
        name: 'SettingsIcon',
        template: '<svg></svg>',
    },
}))

describe('CustomControls', () => {
    let videoElementMock: HTMLVideoElement

    beforeEach(() => {
        videoElementMock = document.createElement('video')
        Object.defineProperty(videoElementMock, 'currentTime', {
            writable: true,
        })
    })

    it('renders correctly', () => {
        const range = mockFormatedRanges[0]
        const wrapper = mount(CustomControls, {
            props: {
                videoElement: videoElementMock,
                range,
            },
        })
        expect(wrapper.exists()).toBe(true)
    })

    it('displays the correct initial time', () => {
        const range = mockFormatedRanges[0]
        const wrapper = mount(CustomControls, {
            props: {
                videoElement: videoElementMock,
                range,
            },
        })

        const timeDisplay = wrapper.find('.time-display')
        expect(timeDisplay.text()).toBe(dayjs(range.date).format('HH:mm:ss'))
    })

    it('updates the currentTime on videoElement timeupdate event', async () => {
        const range = mockFormatedRanges[0]
        const wrapper = mount(CustomControls, {
            props: {
                videoElement: videoElementMock,
                range,
            },
        });
        videoElementMock.dispatchEvent(new Event('timeupdate'))

        await flushPromises()

        const slider: DOMWrapper<HTMLInputElement> = wrapper.find('.custom-slider')
        expect(slider.element.value).toBe('1800')
    })

    it('emits pause event when play button is clicked', async () => {
        const range = mockFormatedRanges[0]
        const wrapper = mount(CustomControls, {
            props: {
                videoElement: videoElementMock,
                range,
            },
        })

        const button = wrapper.find('.button')
        await button.trigger('click')

        expect(wrapper.emitted('pause')).toBeTruthy()
    })

    it('updates the videoElement currentTime when slider input changes', async () => {
        const range = mockFormatedRanges[0]
        const wrapper = mount(CustomControls, {
            props: {
                videoElement: videoElementMock,
                range,
            },
        })

        const slider = wrapper.find('.custom-slider')
        await slider.setValue(1800)
        expect(videoElementMock.currentTime).toBe(1800)
    })
})
