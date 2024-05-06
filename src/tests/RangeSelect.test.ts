import {describe, it, expect, vi, beforeEach} from 'vitest'
import {mount, VueWrapper} from '@vue/test-utils'
import RangeSelect from '@/components/RangeSelect.vue'
import {nextTick, ref} from 'vue'
import {Camera} from "@/types/camera.ts";

vi.mock('@/hooks/useLocale', () => ({
    useLocale: () => ({
        locale: 'en',
        localizedDayjs: vi.fn().mockImplementation(() => ({
            format: (fmt: any) => `formatted_time_${fmt}`,
            isSame: vi.fn().mockReturnValue(true)
        }))
    })
}))

vi.mock('@/store/config.ts', () => ({
    useConfigStore: () => ({
        getTheme: vi.fn().mockReturnValue('light')
    })
}))

vi.mock('@/hooks/useRanges', () => ({
    useRanges: () => ({
        streams: ref([
            {
                stream: 'stream1',
                ranges: [{from: 1650000000, duration: 10000}]
            }
        ])
    })
}))

describe('RangeSelect.vue', () => {
    let wrapper: VueWrapper<any>;

    beforeEach(() => {
        wrapper = mount(RangeSelect, {
            props: {
                camera: {id: 1, name: 'Camera 1'} as Camera,
            }
        })
    })

    it('should split ranges correctly', async () => {
        const expectedRanges = wrapper.vm.ranges.value
        expect(expectedRanges.length).toBeGreaterThan(0)
        expect(expectedRanges[0]).toEqual({
            from: 1650000000,
            duration: 10000,
            date: new Date(1650000000 * 1000),
            streamUrl: 'stream1'
        })
    })

    it('should update selected date and filter ranges', async () => {
        await wrapper.setData({date: new Date(1650000000 * 1000)})
        await nextTick()
        expect(wrapper.vm.ranges.value.length).toBeGreaterThan(0)
        expect(wrapper.findAll('.range').length).toBeGreaterThan(0)
    })

    it('should handle range selection and update model value', async () => {
        await wrapper.setData({date: new Date(1650000000 * 1000)})
        await nextTick()
        wrapper.findAll('.range')[0].trigger('click')
        expect(wrapper.vm.model.from).toBe(1650000000)
    })
})
