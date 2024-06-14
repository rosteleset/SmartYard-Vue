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

    it('renders correctly', () => {
        expect(wrapper.html()).toMatchInlineSnapshot(`
          "<button data-v-dc939e54="" class="nav"><svg data-v-dc939e54="" class="toggle-svg" viewbox="0 0 60 40">
              <g data-v-dc939e54="" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
                <path data-v-dc939e54="" id="top-line" d="M10,10 L50,10 Z"></path>
                <path data-v-dc939e54="" id="middle-line" d="M10,20 L50,20 Z"></path>
                <path data-v-dc939e54="" id="bottom-line" d="M10,30 L50,30 Z"></path>
              </g>
            </svg></button>"
        `);
    });

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
