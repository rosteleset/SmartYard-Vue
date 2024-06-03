import {describe, expect, it} from 'vitest';
import {mount} from '@vue/test-utils';
import HeaderNavIcon from '@/components/HeaderNavIcon.vue';
import {ref} from 'vue';

describe('HeaderNavIcon', () => {
    it('renders correctly', () => {
        const wrapper = mount(HeaderNavIcon, {
            global: {
                provide: {
                    isMenuOpen: ref(false),
                },
            },
        });

        expect(wrapper.find('button').exists()).toBe(true);
        expect(wrapper.find('svg').exists()).toBe(true);
    });

    it('toggles isMenuOpen on click', async () => {
        const isMenuOpen = ref(false);
        const wrapper = mount(HeaderNavIcon, {
            global: {
                provide: {
                    isMenuOpen,
                },
            },
        });

        const svg = wrapper.find('svg');

        expect(isMenuOpen.value).toBe(false);
        await svg.trigger('click');
        expect(isMenuOpen.value).toBe(true);
        await svg.trigger('click');
        expect(isMenuOpen.value).toBe(false);
    });

    it('applies active class when isMenuOpen is true', async () => {
        const isMenuOpen = ref(false);
        const wrapper = mount(HeaderNavIcon, {
            global: {
                provide: {
                    isMenuOpen,
                },
            },
        });

        const svg = wrapper.find('svg');
        expect(svg.classes()).not.toContain('active');

        await svg.trigger('click');
        expect(svg.classes()).toContain('active');
    });
});
