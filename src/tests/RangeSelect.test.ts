import {mount, VueWrapper} from '@vue/test-utils'
import RangeSelect from '@/components/RangeSelect.vue'
import {describe, expect, it, vi} from 'vitest'
import VueDatePicker from '@vuepic/vue-datepicker'
import {defaultGlobal, mockCamera} from "@/tests/__mocks.ts";
import {ref} from "vue";

vi.mock('@/hooks/useRanges', () => ({
    default: () => ({
        streams: ref([
            {
                stream: 'stream1',
                ranges: [
                    {from: 1625097600, duration: 3600},  // Example range
                    {from: 1625101200, duration: 3600}
                ]
            },
            {
                stream: 'stream2',
                ranges: [
                    {from: 1625104800, duration: 7200},
                    {from: 1625112000, duration: 3600}
                ]
            }
        ])
    })
}))

describe('RangeSelect', () => {
    it('renders correctly', () => {
        const wrapper: VueWrapper = mount(RangeSelect, {
            props: {
                camera: mockCamera,
                modelValue: {from: 1625097600, duration: 3600, date: new Date(1625097600 * 1000), streamUrl: 'stream1'}
            },
            global: defaultGlobal
        })

        expect(wrapper.exists()).toBe(true)
        expect(wrapper.findComponent(VueDatePicker).exists()).toBe(true)
    })

    it('displays correct dates in the date picker', async () => {
        const wrapper: VueWrapper = mount(RangeSelect, {
            props: {
                camera: mockCamera,
                modelValue: {from: 1625097600, duration: 3600, date: new Date(1625097600 * 1000), streamUrl: 'stream1'}

            },
            global: defaultGlobal
        })

        const datePickerWrapper = wrapper.findComponent(VueDatePicker);
        const datePickerProps = datePickerWrapper.props() as any;
        const allowedDates = datePickerProps.allowedDates as Date[];

        expect(allowedDates).toContainEqual(new Date(1625097600 * 1000));
        expect(allowedDates).toContainEqual(new Date(1625101200 * 1000));
    })

    it('updates the model when a range is clicked', async () => {
        const wrapper: VueWrapper = mount(RangeSelect, {
            props: {
                camera: mockCamera,
                modelValue: {from: 1625097600, duration: 3600, date: new Date(1625097600 * 1000), streamUrl: 'stream1'},
                'onUpdate:modelValue': vi.fn()
            },
            global: defaultGlobal,
            // emits: ['update:modelValue'],
        })

        const datePickerWrapper = wrapper.findComponent(VueDatePicker);
        await datePickerWrapper.setValue((wrapper.props() as any).modelValue.date)

        const rangeItems = wrapper.findAll('.range')
        expect(rangeItems.length).toBe(4)

        await rangeItems[1].trigger('click')
        expect(wrapper.emitted('update:modelValue')).toBeTruthy()
        expect(wrapper.emitted('update:modelValue')?.[0][0]).toEqual({
            from: 1625101200,
            duration: 3600,
            date: new Date(1625101200 * 1000),
            streamUrl: 'stream1'
        })
    })
})
