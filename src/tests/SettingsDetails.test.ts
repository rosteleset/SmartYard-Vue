import {mount} from '@vue/test-utils';
import {describe, expect, it} from 'vitest';
import SettingsDetails from '@/components/SettingsDetails.vue';
import Button from '@/components/Button.vue';
import {defaultGlobal} from "@/tests/__mocks.ts";

describe('SettingsDetails', () => {

    it('renders correctly', () => {
        const wrapper = mount(SettingsDetails, {
            global:defaultGlobal
        });

        expect(wrapper.find('h2').text()).toBe('Translated Text settings.details');
        expect(wrapper.findAll('input')).toHaveLength(3);
        expect(wrapper.findComponent(Button).text()).toBe('Translated Text settings.save');
    });

    it('updates names', async () => {
        const wrapper = mount(SettingsDetails, {
            global:defaultGlobal
        });

        await wrapper.find('input[type="text"]').setValue('Jane');
        await wrapper.find('input[type="text"]:nth-of-type(2)').setValue('Smith');
        await wrapper.findComponent(Button).trigger('click');
        expect((wrapper.vm as any).sendName).toHaveBeenCalledWith({ name: 'Jane', patronymic: 'Smith' });
    });

    it('disables button during processing', async () => {
        const wrapper = mount(SettingsDetails, {
            global:defaultGlobal
        });
        await wrapper.findComponent(Button).trigger('click');
        expect(wrapper.findComponent(Button).props().disabled).toBe(true);
    });
});
