import {mount} from '@vue/test-utils';
import {describe, it, expect, beforeEach} from 'vitest';
import Label from '@/components/Label.vue'; // Предположим, что ваш компонент находится в этом пути
import ArrowIcon from '@/assets/arrowRight.svg?component';
import TestWrapper from "@/mocks/TestWrapper.ts";
import {defaultGlobal} from "@/mocks/__mockedGlobal.ts";

describe('Label', () => {
    let wrapper: TestWrapper<Partial<typeof Label>>;

    beforeEach(() => {
        wrapper = mount(Label, {
            props: {
                icon: ArrowIcon,
                text: 'Test Label'
            },
            global: defaultGlobal
        });
    })
    it('renders the correct text', () => {

        expect(wrapper.find('.text').text()).toBe('Test Label');
    });

    it('toggles isOpen when clicked and emits toggle event', async () => {

        const label = wrapper.find('.label');
        await label.trigger('click');

        expect(wrapper.vm.isOpen).toBe(true);
        expect(wrapper.emitted().toggle).toBeTruthy();
        expect(wrapper.emitted().toggle[0]).toEqual([true]);

        await label.trigger('click');

        expect(wrapper.vm.isOpen).toBe(false);
        expect(wrapper.emitted().toggle[1]).toEqual([false]);
    });

    it('renders ArrowIcon with correct rotation based on isOpen', async () => {

        const arrow = wrapper.find('.arrow');
        expect(arrow.classes()).not.toContain('open');

        await wrapper.find('.label').trigger('click');
        expect(arrow.classes()).toContain('open');
    });
});
