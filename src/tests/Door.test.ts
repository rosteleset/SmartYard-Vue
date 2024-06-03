import {mount} from '@vue/test-utils';
import Door from '@/components/Door.vue';
import {Domophone} from '@/types/domophone';
import {describe, expect, it, vi} from "vitest";
import {defaultGlobal} from "@/tests/__mocks.ts";

const { mockOpenDoor } = vi.hoisted(() => {
    return { mockOpenDoor: vi.fn() }
})
vi.mock('@/lib/openDoor', () => ({
    default: mockOpenDoor
}))

describe('Door', () => {
    const mockDomophone: Domophone = {
        domophoneId: 123,
        doorId: 456,
        icon: 'entrance',
        name: 'Main Entrance',
    };

    it('renders correctly with props', async () => {
        const wrapper = mount(Door, {
            props: {
                data: mockDomophone,
            },
            global: defaultGlobal
        });

        expect(wrapper.find('.door__label').text()).toBe(mockDomophone.name);
        expect(wrapper.find('svg').exists()).toBe(true);
        expect(wrapper.find('button').exists()).toBe(true);
    });

    it('emits open event when button is clicked', async () => {
        const wrapper = mount(Door, {
            props: {
                data: mockDomophone,
            },
            global: defaultGlobal
        });

        console.log(wrapper.find('button').html())
        await wrapper.find('button').trigger('click');

        expect(mockOpenDoor).toBeCalledWith(mockDomophone.domophoneId);
    });
});
