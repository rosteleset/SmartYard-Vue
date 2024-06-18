import {beforeEach, describe, expect, it, vi} from 'vitest';
import {mount} from '@vue/test-utils';
import SettingsDetails from '@/components/SettingsDetails.vue';
import TestWrapper from "@/mocks/TestWrapper.ts";
import {defaultGlobal} from "@/mocks/__mockedGlobal.ts";

// Мокаем useConfigStore
vi.mock('@/store/config.ts', () => ({
    useConfigStore: vi.fn(() => ({
        names: {name: 'John', patronymic: 'Doe'},
        sendName: vi.fn()
    }))
}));

describe('SettingsDetails', () => {
    let wrapper: TestWrapper<Partial<typeof SettingsDetails>>;

    beforeEach(() => {
        wrapper = mount(SettingsDetails, {
            global: defaultGlobal
        });
    });

    it('renders correctly', () => {
        expect(wrapper.find('h2').text()).toBe('Translated settings.details');
        const inputs = wrapper.findAll('input');
        expect(inputs.at(0)?.element.value).toBe('John');
        expect(inputs.at(1)?.element.value).toBe('Doe');
    });

    it('updates name and patronymic model values', async () => {
        const inputs = wrapper.findAll('input');
        const nameInput = inputs.at(0);
        const patronymicInput = inputs.at(1);

        await nameInput?.setValue('Jane');
        await patronymicInput?.setValue('Smith');

        expect(wrapper.vm.name).toBe('Jane');
        expect(wrapper.vm.patronymic).toBe('Smith');
    });

    it('calls updateNames on button click', async () => {
        const button = wrapper.findComponent({name: 'Button'});
        const mockSendName = wrapper.vm.sendName;

        await button.trigger('click');

        expect(mockSendName).toHaveBeenCalledWith({name: 'John', patronymic: 'Doe'});
    });

    it('disables button during processing', async () => {
        const button = wrapper.findComponent({name: 'Button'});

        wrapper.vm.isProcessed = true;
        await wrapper.vm.$nextTick();

        expect(button.attributes('disabled')).toBe('');
    });
});
