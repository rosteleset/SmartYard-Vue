import {flushPromises, mount} from '@vue/test-utils';
import {beforeEach, describe, expect, it, Mock, vi} from 'vitest';
import FlatSettings from '@/components/FlatSettings.vue';
import Switch from '@/components/Switch.vue';
import {useRouter} from 'vue-router';
import dayjs from 'dayjs';
import TestWrapper from "@/mocks/TestWrapper.ts";
import {ref} from "vue";
import {defaultGlobal} from "@/mocks/__mockedGlobal.ts";
import {mockSettings} from "@/mocks/Settings.ts";

const {mockSave} = vi.hoisted(() => ({mockSave: vi.fn()}))
vi.mock('vue-router', () => ({
    useRouter: vi.fn(),
}));

vi.mock('@/assets/reload.svg?component', () => ({
    default: {
        template: '<svg></svg>'
    }
}));

vi.mock('@/hooks/useSettings', () => ({
    default: () => ({
        settings: ref(mockSettings[0]),
        save: mockSave
    })
}));

vi.mock('@/lib/resetCode', () => ({
    default: vi.fn(() => Promise.resolve('new-code')),
}));

describe('FlatSettings', () => {
    let wrapper: TestWrapper<Partial<typeof FlatSettings>>;
    const mockRouterPush = vi.fn();

    beforeEach(() => {
        (useRouter as Mock).mockReturnValue({push: mockRouterPush});

        wrapper = mount(FlatSettings, {
            props: {
                flatId: '123',
            },
            global: {
                ...defaultGlobal
            },
        });
    });

    it('renders correctly with initial settings', () => {
        expect(wrapper.find('h4').text()).toBe('Translated settings.intercom');
        expect(wrapper.findAllComponents(Switch).length).toBe(6);
    });

    it('regenerates code when regenerate button is clicked', async () => {
        const button = wrapper.find('.reset');
        await button.trigger('click');
        await flushPromises()
        expect(wrapper.find('strong').text()).toBe('new-code');
    });

    it('navigates to faces page when faces button is clicked', async () => {
        const button = wrapper.find('#facesButton');
        await button.trigger('click');

        expect(mockRouterPush).toHaveBeenCalledWith('/faces/123');
    });

    it('saves correct settings when a switch is toggled', async () => {
        const switches = wrapper.findAllComponents({name: 'Switch'})

        for (const _switch of switches) {
            await _switch.setValue(!_switch.props().modelValue)
        }

        expect(mockSave).toHaveBeenCalledTimes(switches.length);
    });

    it('sets autoOpen correctly when button is clicked', async () => {
        const autoOpenButton = wrapper.find('#autoOpenButton');
        await autoOpenButton.trigger('click');

        expect(mockSave).toHaveBeenCalledWith({autoOpen: dayjs().add(1, 'hour').format('YYYY-MM-DD HH:mm:ss')});
    });
});
