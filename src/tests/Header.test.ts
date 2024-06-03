import {describe, expect, it} from 'vitest';
import {mount} from '@vue/test-utils';
import Header from '@/components/Header.vue';
import {defaultGlobal, mockRouter} from "@/tests/__mocks.ts";

describe('Header', () => {

    it('renders correctly', () => {
        const wrapper = mount(Header, {
            global: defaultGlobal
        });

        expect(wrapper.html()).toContain('class="header__label">');
        expect(wrapper.html()).toContain('SmartYard-WEB');
    });

    it('hides go back button when isFirst is false', async () => {
        const wrapper = mount(Header, {
            global: defaultGlobal
        });

        history.pushState({}, '');
        await mockRouter.push('/');

        expect(wrapper.findComponent({ name: 'GoBack' }).exists()).toBe(false);
    });
});
