import {createPinia, setActivePinia} from 'pinia';
import {beforeEach, describe, expect, it, Mock, vi} from 'vitest';
import {useConfigStore} from '@/store/config';
import useApi from '@/hooks/useApi';
import {useUserStore} from '@/store/user';
import {nextTick} from 'vue';

vi.mock('@/hooks/useApi');
vi.mock('vue-router')

describe('useConfigStore', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
        localStorage.clear();
        // Mock return values for useApi
        (useApi as Mock).mockReturnValue({get: vi.fn()});

    });

    it('initializes config from localStorage', () => {
        localStorage.setItem('config', JSON.stringify({theme: 'dark'}));
        const store = useConfigStore();
        expect(store.config.theme).toBe('dark');
    });

    it('updates config and saves to localStorage', async () => {
        const store = useConfigStore();
        store.updateConfig({theme: 'light'});
        await nextTick();
        expect(store.config.theme).toBe('light');
        expect(localStorage.getItem('config')).toBe(JSON.stringify({theme: 'light'}));
    });

    it('returns correct theme', () => {
        const store = useConfigStore();
        expect(store.getTheme()).toBe('light');
        store.updateConfig({theme: 'dark'});
        expect(store.getTheme()).toBe('dark');
        store.updateConfig({theme: 'auto'});
        // Assuming the test environment prefers light scheme
        expect(store.getTheme()).toBe('light');
    });

    it('updates document theme attribute on theme change', async () => {
        const store = useConfigStore();
        store.updateConfig({theme: 'dark'});
        await nextTick();
        expect(document.documentElement.dataset.theme).toBe('dark');
    });

    it('fetches notifications and names on user auth', async () => {

        (useApi as Mock).mockReturnValue({
            get: vi.fn((url) => {
                if (url === 'user/notification') return Promise.resolve({enable: 't'});
                if (url === 'user/getName') return Promise.resolve({name: 'John', patronymic: 'Doe'});
                return Promise.resolve([])
            }),
            request: vi.fn()
        });

        const userStore = useUserStore();
        const store = useConfigStore();

        await userStore.setToken("valid-token")
        await nextTick()

        expect(store.notifications).toEqual({enable: 't'});
        expect(store.names).toEqual({name: 'John', patronymic: 'Doe'});
    });
});
