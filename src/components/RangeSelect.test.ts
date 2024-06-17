import {describe, it, expect, vi} from 'vitest';
import {flushPromises, mount} from '@vue/test-utils';
import RangeSelect from '@/components/RangeSelect.vue';
import VueDatePicker from '@vuepic/vue-datepicker';
import dayjs from 'dayjs';
import {ref} from "vue";
import {mockCameras} from "@/mocks/Cameras.ts";
import TestWrapper from "@/mocks/TestWrapper.ts";

// Mock hooks and store
vi.mock('@/hooks/useLocale', () => ({
    default: vi.fn(() => ({
        locale: 'en',
        localizedDayjs: dayjs
    }))
}));
vi.mock('@/hooks/useRanges', () => ({
    default: vi.fn(() => ({
        streams: ref([
            {
                stream: 'stream1',
                ranges: [
                    {from: 1625097600, duration: 7200}, // 2 hours duration
                    {from: 1625099200, duration: 10800} // 3 hours duration
                ]
            }
        ])
    }))
}));
vi.mock('@/store/config.ts', () => ({
    useConfigStore: () => ({
        getTheme: () => 'light'
    })
}));

describe('RangeSelect', () => {
    it('renders VueDatePicker component', () => {
        const wrapper = mount(RangeSelect, {
            props: {
                camera: mockCameras[0],
                modelValue: {from: 0, duration: 0, date: new Date(), streamUrl: ''}
            }
        });

        const datePicker = wrapper.findComponent(VueDatePicker);
        expect(datePicker.exists()).toBe(true);
    });

    it('renders list of ranges correctly', async () => {
        const wrapper: TestWrapper<Partial<typeof RangeSelect>> = mount(RangeSelect, {
            props: {
                camera: mockCameras[0],
                modelValue: {from: 0, duration: 0, date: new Date(), streamUrl: ''}
            }
        });

        wrapper.vm.date = new Date(1625097600000)
        await flushPromises();

        const rangeItems = wrapper.findAll('.range');
        expect(rangeItems).toHaveLength(2);

        const firstRangeText = `${dayjs(1625097600000).format('HH:mm')} - ${dayjs(1625097600000).add(7200, 'second').format('HH:mm')}`;
        expect(rangeItems[0].text()).toBe(firstRangeText);

        const secondRangeText = `${dayjs(1625099200000).format('HH:mm')} - ${dayjs(1625099200000).add(10800, 'second').format('HH:mm')}`;
        expect(rangeItems[1].text()).toBe(secondRangeText);
    });

    it('updates model on range click', async () => {
        const wrapper: TestWrapper<Partial<typeof RangeSelect>> = mount(RangeSelect, {
            props: {
                camera: mockCameras[0],
                modelValue: {from: 0, duration: 0, date: new Date(), streamUrl: ''}
            }
        });

        wrapper.vm.date = new Date(1625097600000)
        await flushPromises();

        const rangeItems = wrapper.findAll('.range');
        await rangeItems[0].trigger('click');

        expect(wrapper.emitted()['update:modelValue']).toBeTruthy();
        expect(wrapper.emitted()['update:modelValue'][0]).toEqual([{
            from: 1625097600,
            duration: 7200,
            date: new Date(1625097600000),
            streamUrl: 'stream1'
        }]);
    });
});
