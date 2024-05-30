import {mount} from '@vue/test-utils';
import {describe, expect, it} from 'vitest';
import SettingsNotifications from '@/components/SettingsNotifications.vue';
import Switch from '@/components/Switch.vue';
import {defaultGlobal} from "@/tests/__mocks.ts";

describe('SettingsNotifications', () => {

    it('renders correctly', () => {
        const wrapper = mount(SettingsNotifications, {
            global: defaultGlobal
        });

        expect(wrapper.find('h2').text()).toBe('Translated Text settings.notifications');
        expect(wrapper.findAllComponents(Switch)).toHaveLength(2);
    });

    it('toggles notifications enable switch', async () => {
        const wrapper = mount(SettingsNotifications, {
            global: defaultGlobal
        });

        await wrapper.findAllComponents(Switch)[0].setValue(true)
        expect((wrapper.vm as any).notificationsEnable).toBe(true);

        await wrapper.findAllComponents(Switch)[0].setValue(false)
        expect((wrapper.vm as any).notificationsEnable).toBe(false);
    });

    it('toggles notifications money switch', async () => {
        const wrapper = mount(SettingsNotifications, {
            global: defaultGlobal
        });

        await wrapper.findAllComponents(Switch)[1].setValue(true);
        expect((wrapper.vm as any).notificationsMoney).toBe(true);

        await wrapper.findAllComponents(Switch)[1].setValue(false);
        expect((wrapper.vm as any).notificationsMoney).toBe(false);
    });
});
