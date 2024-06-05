import {afterEach, beforeEach, describe, expect, it, Mock, vi} from "vitest";
import {useUserStore} from "@/store/user";
import useApi from "@/hooks/useApi";
import {Client} from "@/types/user";
import {createPinia, setActivePinia} from "pinia";
import {useRouter} from "vue-router";

vi.mock('@/hooks/useApi')
vi.mock('@/store/push')
vi.mock('vue-router')

const LOCAL_STORAGE_TOKEN_KEY = "jwt-token";

describe('users store', () => {
    let store: ReturnType<(typeof useUserStore)>

    const mockGet = vi.fn();
    const mockPush = vi.fn();

    beforeEach(() => {
        setActivePinia(createPinia());
        (useApi as Mock).mockReturnValue({get: mockGet});
        (useRouter as Mock).mockReturnValue({push: mockPush});
        store = useUserStore();
    })

    afterEach(() => {
        vi.clearAllMocks()
    })

    it('Инициализация состояния', () => {
        // Проверить, что состояние isLoaded, isAuth и error правильно инициализируются при создании стора.
        expect(store.isAuth).toBe(false)
        expect(store.isLoaded).toBe(false)
        expect(store.error).toBe(null)

    })

    it("Без токена", async () => {
        await store.load();

        expect(store.isLoaded).toBe(true);
        expect(store.isAuth).toBe(false);
    })

    it("С токеном", async () => {
        const fakeClients: Client[] = [];
        mockGet.mockResolvedValue(fakeClients);

        await store.setToken("valid-token");

        expect(store.clients).toEqual(fakeClients);
        expect(store.isAuth).toBe(true);
    })

    it("C невалидным токеном", async () => {
        mockGet.mockRejectedValueOnce({message: "auth error", response: {data: {code: 401}}})

        await store.setToken("invalid-token");

        expect(store.isLoaded).toBe(true);
        expect(store.isAuth).toBe(false);
        expect(store.error).toBe(null)
    })

    it("С другой ошибкой", async () => {
        mockGet.mockRejectedValueOnce(new Error('Server error'))

        await store.load()

        expect(store.isLoaded).toBe(true);
        expect(store.isAuth).toBe(false);
        expect(store.error).toBe('Server error')
    })

    it("Установка токена", () => {
        store.setToken("new-token");
        expect(localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY)).toBe("new-token");
        expect(store.token).toBe("new-token");
    })

    it("Выход из системы", async () => {
        await store.logout();
        expect(localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY)).toBe(null);
        expect(store.clients).toEqual([]);
        expect(store.isAuth).toBe(false);
        expect(mockPush).toHaveBeenCalledWith('/');
    })

})