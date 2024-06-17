import {describe, it, expect} from 'vitest';
import {mount} from '@vue/test-utils';
import NotFound from '@/components/NotFound.vue';
import {RouterLinkStub} from '@vue/test-utils';

describe('NotFound', () => {
    it('renders 404 text', () => {
        const wrapper = mount(NotFound, {
            global: {
                stubs: {
                    RouterLink: RouterLinkStub
                }
            }
        });
        expect(wrapper.text()).toContain('404');
    });

    it('has a link to go home', () => {
        const wrapper = mount(NotFound, {
            global: {
                stubs: {
                    RouterLink: RouterLinkStub
                }
            }
        });
        const link = wrapper.findComponent(RouterLinkStub);
        expect(link.exists()).toBe(true);
        expect(link.props().to).toBe('/addresses');
        expect(link.text()).toBe('go home');
    });
});
