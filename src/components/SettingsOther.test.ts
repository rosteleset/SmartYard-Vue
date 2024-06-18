import {beforeEach, describe, expect, it, vi} from 'vitest';
import {mount} from '@vue/test-utils';
import SettingsOther from '@/components/SettingsOther.vue';
import TestWrapper from "@/mocks/TestWrapper.ts";
import {defaultGlobal, mockTFunction} from "@/mocks/__mockedGlobal.ts";

// Мокаем useLocale
vi.mock('@/hooks/useLocale', () => ({
    default: vi.fn(() => ({
        availableLocales: ['en', 'ru'],
        locale: 'ru',
        changeLocale: vi.fn(),
        t: mockTFunction
    }))
}));

// Мокаем useConfigStore
vi.mock('@/store/config', () => ({
    useConfigStore: vi.fn(() => ({
        config: {
            watchmanMode: false,
            alwaysMenu: false,
            columnsCount: 2,
            theme: 'light',
        },
        updateConfig: vi.fn(),
    }))
}));

// Мокаем useUserStore
vi.mock('@/store/user.ts', () => ({
    useUserStore: vi.fn(() => ({
        logout: vi.fn(),
    }))
}));

describe('SettingsOther', () => {
    let wrapper: TestWrapper<Partial<typeof SettingsOther>>;

    beforeEach(() => {
        wrapper = mount(SettingsOther, {
            global: defaultGlobal
        });
    });

    it('renders correctly', () => {
        expect(wrapper.find('h2').text()).toBe('Translated settings.other');
        expect(wrapper.findAllComponents({name: 'Select'})).toHaveLength(3);
        expect(wrapper.findAllComponents({name: 'Switch'})).toHaveLength(2);
        expect(wrapper.findComponent({name: 'Button'}).exists()).toBe(true);
    });

    it('updates locale correctly', async () => {
        const selectLocale = wrapper.findAllComponents({name: 'Select'})[0];
        await selectLocale.vm.$emit('update:modelValue', {id: 'en', name: 'English'});

        expect(wrapper.vm.changeLocale).toHaveBeenCalledWith('en');
    });

    it('updates theme correctly', async () => {
        const selectTheme = wrapper.findAllComponents({name: 'Select'})[1];
        await selectTheme.vm.$emit('update:modelValue', {id: 'dark', name: 'Dark'});

        expect(wrapper.vm.updateConfig).toHaveBeenCalledWith({theme: 'dark'});
    });

    it('updates watchman mode correctly', async () => {
        const switchWatchmanMode = wrapper.findAllComponents({name: 'Switch'})[0];
        await switchWatchmanMode.vm.$emit('update:modelValue', true);

        expect(wrapper.vm.updateConfig).toHaveBeenCalledWith({watchmanMode: true});
    });

    it('updates always menu correctly', async () => {
        const switchAlwaysMenu = wrapper.findAllComponents({name: 'Switch'})[1];
        await switchAlwaysMenu.vm.$emit('update:modelValue', true);

        expect(wrapper.vm.updateConfig).toHaveBeenCalledWith({alwaysMenu: true});
    });

    it('updates column count correctly', async () => {
        const selectColumnsCount = wrapper.findAllComponents({name: 'Select'})[2];
        await selectColumnsCount.vm.$emit('update:modelValue', {id: 3, name: '3'});

        expect(wrapper.vm.updateConfig).toHaveBeenCalledWith({columnsCount: 3});
    });

    it('logs out correctly', async () => {
        const button = wrapper.findComponent({name: 'Button'});
        await button.trigger('click');

        expect(wrapper.vm.logout).toHaveBeenCalled();
    });
});
