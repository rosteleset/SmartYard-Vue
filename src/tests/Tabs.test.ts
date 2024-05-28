import {mount} from '@vue/test-utils'
import {describe, it, expect} from 'vitest'
import Tabs from '@/components/Tabs.vue'

const tabsData = [
    {tabId: 'tab1', tabTitle: 'Tab 1'},
    {tabId: 'tab2', tabTitle: 'Tab 2'},
    {tabId: 'tab3', tabTitle: 'Tab 3'}
]

describe('Tabs', () => {
    it('renders the correct number of tabs', () => {
        const wrapper = mount(Tabs, {
            props: {
                tabs: tabsData
            }
        })
        const tabElements = wrapper.findAll('.tabs > div')
        expect(tabElements).toHaveLength(tabsData.length)
    })

    it('displays the correct tab titles', () => {
        const wrapper = mount(Tabs, {
            props: {
                tabs: tabsData
            }
        })
        tabsData.forEach((tab, index) => {
            expect(wrapper.findAll('.tabs > div').at(index)?.text()).toBe(tab.tabTitle)
        })
    })

    it('activates the correct tab on click', async () => {
        const wrapper = mount(Tabs, {
            props: {
                tabs: tabsData,
            }
        })
        const tabElements = wrapper.findAll('.tabs > div')
        await tabElements.at(1)?.trigger('click')
        expect(tabElements.at(1)?.classes()).toContain('active')
        // "as any" это 🩼
        expect((wrapper.vm as any).activeTab).toBe(1)
    })

    it('renders the correct tab content', async () => {
        const wrapper = mount(Tabs, {
            props: {
                tabs: tabsData
            },
            slots: {
                tab1: '<div>Content for Tab 1</div>',
                tab2: '<div>Content for Tab 2</div>',
                tab3: '<div>Content for Tab 3</div>'
            }
        })
        expect(wrapper.html()).toContain('Content for Tab 1')
        await wrapper.findAll('.tabs > div').at(1)?.trigger('click')
        expect(wrapper.html()).toContain('Content for Tab 2')
        await wrapper.findAll('.tabs > div').at(2)?.trigger('click')
        expect(wrapper.html()).toContain('Content for Tab 3')
    })

    it('applies transition when changing tabs', async () => {
        const wrapper = mount(Tabs, {
            props: {
                tabs: tabsData
            },
            slots: {
                tab1: '<div>Content for Tab 1</div>',
                tab2: '<div>Content for Tab 2</div>',
                tab3: '<div>Content for Tab 3</div>'
            },
            global: {
                stubs: {
                    transition: false
                },
            },
        })
        await wrapper.findAll('.tabs > div').at(1)?.trigger('click')
        expect(wrapper.find('.fade-enter-active').exists()).toBe(true)
    })
})
