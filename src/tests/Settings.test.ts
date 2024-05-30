import {mount} from '@vue/test-utils';
import {describe, it, expect} from 'vitest';
import Settings from '@/components/Settings.vue';
import SettingsDetails from '@/components/SettingsDetails.vue';
import SettingsNotifications from '@/components/SettingsNotifications.vue';
import SettingsOther from '@/components/SettingsOther.vue';
import {defaultGlobal} from "@/tests/__mocks.ts";

describe('Settings', () => {
    it('renders all subcomponents', () => {
        const wrapper = mount(Settings, {global: defaultGlobal});

        // Проверяем, что все подкомпоненты отображаются
        expect(wrapper.findComponent(SettingsDetails).exists()).toBe(true);
        expect(wrapper.findComponent(SettingsNotifications).exists()).toBe(true);
        expect(wrapper.findComponent(SettingsOther).exists()).toBe(true);
    });
});
