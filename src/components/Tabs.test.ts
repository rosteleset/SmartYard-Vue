import {mount} from '@vue/test-utils'
import {describe, it, expect} from 'vitest'
import Tabs from '@/components/Tabs.vue'

const tabs = [
    {tabId: 'tab1', tabTitle: 'Tab 1'},
    {tabId: 'tab2', tabTitle: 'Tab 2'},
    {tabId: 'tab3', tabTitle: 'Tab 3'},
];

describe('Tabs', () => {
    it('should render tabs correctly', () => {
        const wrapper = mount(Tabs, {
            props: {
                tabs
            }
        });

        const tabElements = wrapper.findAll('.tabs > div');
        expect(tabElements).toHaveLength(tabs.length);
        tabElements.forEach((tab, index) => {
            expect(tab.text()).toBe(tabs[index].tabTitle);
        });
    });

    it('should set the first tab as active by default', () => {
        const wrapper = mount(Tabs, {
            props: {
                tabs
            }
        });

        const activeTab = wrapper.find('.tabs > div.active');
        expect(activeTab.exists()).toBe(true);
        expect(activeTab.text()).toBe(tabs[0].tabTitle);
    });

    it('should change active tab on click', async () => {
        const wrapper = mount(Tabs, {
            props: {
                tabs
            }
        });

        const tabElements = wrapper.findAll('.tabs > div');
        await tabElements[1].trigger('click');

        const activeTab = wrapper.find('.tabs > div.active');
        expect(activeTab.exists()).toBe(true);
        expect(activeTab.text()).toBe(tabs[1].tabTitle);
    });

    it('should display content for the active tab', async () => {
        const wrapper = mount(Tabs, {
            props: {
                tabs
            },
            slots: {
                tab1: '<div id="tab1-content">Content 1</div>',
                tab2: '<div id="tab2-content">Content 2</div>',
                tab3: '<div id="tab3-content">Content 3</div>',
            }
        });

        // Check initial content
        let activeContent = wrapper.find('#tab1-content');
        expect(activeContent.exists()).toBe(true);

        // Click second tab and check content
        const tabElements = wrapper.findAll('.tabs > div');
        await tabElements[1].trigger('click');

        activeContent = wrapper.find('#tab2-content');
        expect(activeContent.exists()).toBe(true);
    });
});
