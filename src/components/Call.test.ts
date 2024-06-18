import {beforeEach, describe, expect, it, vi} from 'vitest';
import {flushPromises, mount} from '@vue/test-utils';
import Call from '@/components/Call.vue';
import {usePushStore} from '@/store/push';
import openDoor from '@/lib/openDoor';
import {defaultGlobal} from "@/mocks/__mockedGlobal.ts";

vi.mock('@/store/push');
vi.mock('@/lib/openDoor');

describe('Call', () => {
    let pushStoreMock: any;

    beforeEach(() => {
        pushStoreMock = {
            call: {
                data: {
                    callerId: '1234',
                    domophoneId: '5678',
                    dtmf: '123',
                    extension: 'ext',
                    flatId: 'flat1',
                    flatNumber: '101',
                    hash: 'hash123',
                    server: 'server',
                }
            },
            setCall: vi.fn(),
        };

        (usePushStore as any).mockReturnValue(pushStoreMock);
    });

    it('renders modal with call details', async () => {
        const wrapper = mount(Call, {global: defaultGlobal});
        await flushPromises();
        expect(wrapper.findComponent({name: 'Modal'}).exists()).toBe(true);
        expect(wrapper.find('.wrap').exists()).toBe(true);
        expect(wrapper.find('.image').attributes('src')).toContain('hash123');
    });

    it('renders open door button when domophoneId is present', async () => {
        const wrapper = mount(Call, {global: defaultGlobal});
        await flushPromises();

        const button = wrapper.findComponent({name: 'Button', props: {variant: 'success'}});
        expect(button.exists()).toBe(true);
    });

    it('renders ignore button', async () => {
        const wrapper = mount(Call, {global: defaultGlobal});
        await flushPromises();

        const button = wrapper.findComponent({name: 'Button', props: {variant: 'error'}});
        expect(button.exists()).toBe(true);
    });

    it('calls openDoor with domophoneId on click open button', async () => {
        const wrapper = mount(Call, {global: defaultGlobal});
        await flushPromises();

        const button = wrapper.findComponent({name: 'Button', props: {variant: 'success'}});

        await button.trigger('click');
        expect(openDoor).toHaveBeenCalledWith(5678);
    });

    it('calls setCall on click ignore button', async () => {
        const wrapper = mount(Call, {global: defaultGlobal});
        await flushPromises();

        const button = wrapper.findAllComponents({name: 'Button', props: {variant: 'error'}}).at(1);

        await button?.trigger('click');
        expect(pushStoreMock.setCall).toHaveBeenCalled();
    });

    it('does not render modal when call is undefined', async () => {
        pushStoreMock.call = null;
        const wrapper = mount(Call, {global: defaultGlobal});
        await flushPromises();

        expect(wrapper.findComponent({name: 'Modal'}).props().isOpen).toBe(false);
    });
});
