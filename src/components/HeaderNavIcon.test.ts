import {beforeEach, describe, expect, it} from 'vitest';
import {mount} from '@vue/test-utils';
import HeaderNavIcon from '@/components/HeaderNavIcon.vue';
import {ref} from "vue";
import TestWrapper from "@/mocks/TestWrapper.ts";

describe('HeaderNavIcon', () => {
    const isMenuOpen = ref(false);
    let wrapper: TestWrapper<Partial<typeof HeaderNavIcon>>;

    beforeEach(() => {
        wrapper = mount(HeaderNavIcon, {
            global: {
                provide: {
                    isMenuOpen,
                },
            },
        });
    })

    it('toggles menu state on button click', async () => {

        const button = wrapper.find('button');
        await button.trigger('click');
        expect(isMenuOpen.value).toBe(true);

        await button.trigger('click');
        expect(isMenuOpen.value).toBe(false);

    });

    it('applies active class to svg when menu is open', async () => {
        isMenuOpen.value = false;

        const svg = wrapper.find('svg');
        expect(svg.classes()).not.toContain('active');

        isMenuOpen.value = true;
        await wrapper.vm.$nextTick();
        expect(svg.classes()).toContain('active');
    });
});
