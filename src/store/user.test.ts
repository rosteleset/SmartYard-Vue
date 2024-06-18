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

    it('Initialization of state', () => {
        // Проверить, что состояние isLoaded, isAuth и error правильно инициализируются при создании стора.
        expect(store.isAuth).toBe(false)
        expect(store.isLoaded).toBe(false)
        expect(store.error).toBe(null)
    })

    it("Without token", async () => {
        // Проверить, что метод load устанавливает isLoaded в true даже если token отсутствует.
        await store.load();

        expect(store.isLoaded).toBe(true);
        expect(store.isAuth).toBe(false);
    })

    it("With token", async () => {
        // Проверить, что метод load корректно работает с валидным токеном и обновляет состояние клиентов и isAuth.
        const fakeClients: Client[] = [];
        mockGet.mockResolvedValue(fakeClients);

        await store.setToken("valid-token");

        expect(store.clients).toEqual(fakeClients);
        expect(store.isAuth).toBe(true);
    })

    it("With invalid token", async () => {
        // Проверить, что метод load корректно обрабатывает ошибку 401 и устанавливает isAuth в false.
        mockGet.mockRejectedValueOnce({message: "auth error", response: {data: {code: 401}}})

        await store.setToken("invalid-token");

        expect(store.isLoaded).toBe(true);
        expect(store.isAuth).toBe(false);
        expect(store.error).toBe(null)
    })

    it("With other error", async () => {
        // Проверить, что метод load корректно обрабатывает другие ошибки и устанавливает сообщение об ошибке в error.
        mockGet.mockRejectedValueOnce(new Error('Server error'))

        await store.load()

        expect(store.isLoaded).toBe(true);
        expect(store.isAuth).toBe(false);
        expect(store.error).toBe('Server error')
    })

    it("Setting token", () => {
        // Проверить, что метод setToken корректно сохраняет токен в localStorage и состоянии стора.
        store.setToken("new-token");
        expect(localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY)).toBe("new-token");
        expect(store.token).toBe("new-token");
    })

    it("Logout", async () => {
        // Проверить, что метод logout корректно очищает состояние стора и перенаправляет на главную страницу.
        await store.logout();
        expect(localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY)).toBe(null);
        expect(store.clients).toEqual([]);
        expect(store.isAuth).toBe(false);
        expect(mockPush).toHaveBeenCalledWith('/');
    })

})
