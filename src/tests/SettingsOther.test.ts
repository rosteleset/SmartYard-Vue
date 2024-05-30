import {mount} from '@vue/test-utils';
import {describe, expect, it} from 'vitest';
import SettingsOther from '@/components/SettingsOther.vue';
import Switch from '@/components/Switch.vue';
import Button from '@/components/Button.vue';
import {defaultGlobal} from "@/tests/__mocks.ts";

describe('SettingsOther', () => {

    it('renders correctly', () => {
        const wrapper = mount(SettingsOther, {
            global: defaultGlobal
        });

        expect(wrapper.find('h2').text()).toBe('Translated Text settings.other');
        expect(wrapper.findAllComponents({name: 'Select'})).toHaveLength(3);
        expect(wrapper.findAllComponents(Switch)).toHaveLength(2);
        expect(wrapper.findComponent(Button).text()).toBe('logout');
    });

    it('changes locale', async () => {
        const wrapper = mount(SettingsOther, {
            global: defaultGlobal
        });

        const newLocale = {
            id: 'ru',
            name: 'Русский',
        }

        await wrapper.findAllComponents({name: 'Select'})[0].setValue(newLocale);
        expect((wrapper.vm as any).changeLocale).toHaveBeenCalledWith(newLocale.id);
    });

    it('updates watchman mode', async () => {
        const wrapper = mount(SettingsOther, {
            global: defaultGlobal
        });

        await wrapper.findAllComponents(Switch)[0].setValue(true);
        expect((wrapper.vm as any).updateConfig).toHaveBeenCalledWith({watchmanMode: true});
    });

    it('updates columns count', async () => {
        const wrapper = mount(SettingsOther, {
            global: defaultGlobal
        });

        const newValue: number = 4

        await wrapper.findAllComponents({name: 'Select'})[2].setValue({
            id: newValue,
            name: newValue.toString(),
        });
        expect((wrapper.vm as any).updateConfig).toHaveBeenCalledWith({columnsCount: newValue});
    });

    it('calls logout method', async () => {
        const wrapper = mount(SettingsOther, {
            global:defaultGlobal
        });

        await wrapper.findComponent(Button).trigger('click');
        expect((wrapper.vm as any).logout).toHaveBeenCalled();
    });
});
