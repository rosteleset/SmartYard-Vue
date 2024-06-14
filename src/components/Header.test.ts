import {beforeEach, describe, expect, it, vi} from 'vitest';
import {flushPromises, mount} from '@vue/test-utils';
import Header from '@/components/Header.vue';
import GoBack from "@/assets/goBack.svg"

import {defaultGlobal} from "@/mocks/__mockedGlobal.ts";
import TestWrapper from "@/mocks/TestWrapper.ts";

// Mock useLocale
vi.mock('@/hooks/useLocale', () => ({
    default: () => ({
        t: (key: string) => key, // Простая реализация функции перевода
    }),
}));

// Mock useConfigStore
vi.mock('@/store/config.ts', () => ({
    useConfigStore: () => ({
        config: {
            alwaysMenu: false,
        },
    }),
}));

const router = vi.hoisted(() => ({
    RouteLocationNormalizedLoaded: vi.fn(),
    RouteRecord: vi.fn(),
    useRouter: () => ({
        push: vi.fn(),
        currentRoute: "",
        getRoutes: vi.fn().mockReturnValue([]),
        back: vi.fn()
    }),
    RouterLink: (props: any) => {
        return `<a href="${props.to}">Input</a>`
    }
}))
vi.mock('vue-router', () => router)

export const mockRouter = {
    push: vi.fn(),
    currentRoute: "",
    getRoutes: vi.fn(),
    back: vi.fn()
}

describe('Header', () => {
    let wrapper: TestWrapper<Partial<typeof Header>>;

    beforeEach(() => {
        wrapper = mount(Header, {
            global: {
                provide: {
                    isMenuOpen: false
                },
                ...defaultGlobal
            },
        });
    })

    it('renders header label', async () => {
        expect(wrapper.find('.header__label').text()).toContain('SmartYard-WEB');
    });

    it('shows go back button when isFirst is true', async () => {
        (wrapper.vm as any).isFirst = true
        await flushPromises()
        console.log(wrapper.html())
        expect(wrapper.findComponent(GoBack).exists()).toBe(true);
    });

    it('hides go back button when isFirst is false', async () => {
        expect(wrapper.findComponent({name: 'GoBack'}).exists()).toBe(false);
    });

    it('renders menu items when alwaysMenu is true', async () => {
        vi.mock('@/store/config.ts', () => ({
            useConfigStore: () => ({
                config: {
                    alwaysMenu: true,
                },
            }),
        }));

        await flushPromises();

        expect(wrapper.find('.menu').exists()).toBe(true);
    });
});
