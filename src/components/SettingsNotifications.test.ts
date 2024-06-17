import {beforeEach, describe, expect, it, vi} from 'vitest';
import {mount} from '@vue/test-utils';
import SettingsNotifications from '@/components/SettingsNotifications.vue';
import TestWrapper from "@/mocks/TestWrapper.ts";
import {defaultGlobal} from "@/mocks/__mockedGlobal.ts";

// Мокаем useConfigStore
vi.mock('@/store/config.ts', () => ({
    useConfigStore: vi.fn(() => ({
        notifications: {
            enable: true,
            money: false
        }
    }))
}));

vi.mock('@/lib/convertSettingsBoolean', () => ({
    default: (val: boolean) => val
}));

describe('SettingsNotifications', () => {
    let wrapper: TestWrapper<Partial<typeof SettingsNotifications>>;

    beforeEach(() => {
        wrapper = mount(SettingsNotifications, {
            global: defaultGlobal
        });
    });

    it('renders correctly', () => {
        expect(wrapper.find('h2').text()).toBe('Translated settings.notifications');
        expect(wrapper.findAllComponents({name: 'Switch'})).toHaveLength(2);
    });

    it('initializes switch values based on store', () => {
        const switches = wrapper.findAllComponents({name: 'Switch'});
        expect(switches[0].props('modelValue')).toBe(true);
        expect(switches[1].props('modelValue')).toBe(false);
    });

    it('updates notification enable value', async () => {
        const switchEnable = wrapper.findAllComponents({name: 'Switch'})[0];

        await switchEnable.vm.$emit('update:modelValue', false);

        expect(wrapper.vm.notificationsEnable).toBe(false);
    });

    it('updates notification money value', async () => {
        const switchMoney = wrapper.findAllComponents({name: 'Switch'})[1];

        await switchMoney.vm.$emit('update:modelValue', true);

        expect(wrapper.vm.notificationsMoney).toBe(true);
    });
});
