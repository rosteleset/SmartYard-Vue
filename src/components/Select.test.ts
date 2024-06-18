import {beforeEach, describe, expect, it} from 'vitest';
import {flushPromises, mount} from '@vue/test-utils';
import Select from '@/components/Select.vue';
import TestWrapper from "@/mocks/TestWrapper.ts";
import {defaultGlobal} from "@/mocks/__mockedGlobal.ts";

describe('Select', () => {
    let wrapper: TestWrapper<Partial<typeof Select>>;

    const options = [
        {id: 1, name: 'Option 1'},
        {id: 2, name: 'Option 2'},
        {id: 3, name: 'Option 3'}
    ];

    beforeEach(() => {
        wrapper = mount(Select, {
            props: {
                options,
                allowUndefined: true,
                undefinedText: 'All'
            },
            global: defaultGlobal
        });
    });

    it('renders select box with placeholder', () => {
        const selectBox = wrapper.find('.select-box');
        expect(selectBox.exists()).toBe(true);
        expect(selectBox.text()).toContain('all All');
    });

    it('toggles dropdown on click', async () => {
        const selectBox = wrapper.find('.select-box');
        await selectBox.trigger('click');

        expect(wrapper.find('.dropdown').exists()).toBe(true);

        await selectBox.trigger('click');

        expect(wrapper.find('.dropdown').exists()).toBe(false);
    });

    it('selects an option and updates the model', async () => {
        const selectBox = wrapper.find('.select-box');
        await selectBox.trigger('click');

        const optionsList = wrapper.findAll('.dropdown div');
        expect(optionsList).toHaveLength(4); // 3 options + 1 for undefined

        await optionsList[1].trigger('click');

        expect(wrapper.emitted()['update:modelValue']).toBeTruthy();
        expect(wrapper.emitted()['update:modelValue'][0]).toEqual([{id: 1, name: 'Option 1'}]);
        expect(selectBox.text()).toContain('Option 1');
    });

    it('closes the dropdown when clicking outside', async () => {
        const selectBox = wrapper.find('.select-box');
        await selectBox.trigger('click');

        expect(wrapper.find('.dropdown').exists()).toBe(true);

        window.dispatchEvent(new Event('click'));
        await flushPromises();

        expect(wrapper.find('.dropdown').exists()).toBe(false);
    });
});
