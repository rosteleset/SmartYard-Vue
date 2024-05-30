import {mount} from '@vue/test-utils';
import {describe, expect, it, vi} from 'vitest';
import FlatSettings from '@/components/FlatSettings.vue';
import {defaultGlobal} from "@/tests/__mocks.ts";

describe('FlatSettings', () => {

    const { mockedResetCode } = vi.hoisted(() => {
        return { mockedResetCode: vi.fn(()=>new Promise(()=>'1111')) }
    })

    vi.mock('@/lib/resetCode', () => {
        return { default: mockedResetCode }
    })

    it('renders all settings', async () => {
        // Mocking props
        const flatId = '123';
        // Mounting the component
        const wrapper = mount(FlatSettings, {
            props: {
                flatId: flatId,
            },
            global: defaultGlobal
        });

        // Checking if all settings are rendered
        expect(wrapper.text()).toContain('Translated Text settings.intercom');
        expect(wrapper.text()).toContain('Translated Text settings.access');
        expect(wrapper.text()).toContain('Translated Text settings.reset-code');
        expect(wrapper.text()).toContain('Translated Text settings.guest-access');
        expect(wrapper.text()).toContain('Translated Text settings.frs');
    });

    it('calls update function when settings are changed', async () => {
        // Mocking props
        const flatId = '123';
        // Mounting the component
        const wrapper = mount(FlatSettings, {
            props: {
                flatId: flatId,
            },
            global: defaultGlobal
        });

        // Simulating update action
        const switches = wrapper.findAllComponents({name: 'Switch'})

        for (const _switch of switches) {
            await _switch.setValue(!_switch.props().modelValue)
        }

        expect((wrapper.vm as any).save).toHaveBeenCalledTimes(switches.length);
    });

    it('calls regenerateCode function when reset button is clicked', async () => {
        // Mocking props
        const flatId = '123';
        // Mounting the component
        const wrapper = mount(FlatSettings, {
            props: {
                flatId: flatId,
            },
            global: defaultGlobal
        });

        // Simulating click on reset button
        await wrapper.find('.reset').trigger('click');

        // Asserting that the regenerateCode function is called
        // This assumes that the regenerateCode function is a jest.fn() mock
        expect(mockedResetCode).toHaveBeenCalled();
    });

    it('calls setAutoOpen function when guest access button is clicked', async () => {
        // Mocking props
        const flatId = 'mockFlatId';
        // Mounting the component
        const wrapper = mount(FlatSettings, {
            props: {
                flatId: flatId,
            },
            global: defaultGlobal
        });

        // Simulating click on guest access button
        await wrapper.find('#autoOpenButton').trigger('click');

        // Asserting that the setAutoOpen function is called
        // This assumes that the setAutoOpen function is a jest.fn() mock
        expect((wrapper.vm as any).save).toHaveBeenCalled();
    });

    it('calls openFacesHandler function when faces button is clicked', async () => {
        // Mocking props
        const flatId = 'mockFlatId';
        // Mounting the component
        const wrapper = mount(FlatSettings, {
            props: {
                flatId: flatId,
            },
            global: defaultGlobal
        });

        // Simulating click on faces button
        await wrapper.find('.faces-block button').trigger('click');

        // Asserting that the openFacesHandler function is called
        // This assumes that the openFacesHandler function is a jest.fn() mock
        expect(defaultGlobal.mocks.$router.push).toHaveBeenCalled();
    });
});
