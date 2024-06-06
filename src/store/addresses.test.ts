import {afterEach, beforeEach, describe, expect, it, Mock, vi} from "vitest";
import {useAddressesStore} from "@/store/addresses";
import {createPinia, setActivePinia} from "pinia";
import useApi from "@/hooks/useApi.ts";
import {useUserStore} from "@/store/user";
import {getCurrentInstance, nextTick} from "vue";
import mockedStore from "@/mocks/mockedStore.ts";

// Мокирование зависимостей
vi.mock('@/hooks/useApi')
vi.mock('@/store/push')
vi.mock('vue-router')

describe('addresses store', () => {
    let store: ReturnType<(typeof useAddressesStore)>;
    let userStore: ReturnType<(typeof useUserStore)>;

    const mockGet = vi.fn();

    // Настройка окружения перед каждым тестом
    beforeEach(() => {
        setActivePinia(createPinia());
        (useApi as Mock).mockReturnValue({get: mockGet});
        store = useAddressesStore(createPinia());
        userStore = mockedStore(useUserStore);
    });

    // Очистка моков после каждого теста
    afterEach(() => {
        vi.clearAllMocks();
    });

    // Проверка инициализации с правильными начальными значениями
    it('initializes with correct default values', () => {
        expect(store.isLoaded).toBe(false);
        expect(store.addresses).toEqual([]);
    });

    // Проверка загрузки данных при вызове load
    it('loads data when load is called', async () => {
        mockGet.mockResolvedValue([{houseId: '1', address: 'Test Address'}]);

        await store.load();
        expect(store.isLoaded).toBe(true);
        expect(store.addresses).toEqual([{houseId: '1', address: 'Test Address'}]);
    });

    // Проверка обработки ошибок при загрузке данных
    it('handles errors when loading data', async () => {
        mockGet.mockRejectedValue(new Error('Network Error'));

        await store.load();
        expect(store.isLoaded).toBe(true);
        expect(store.addresses).toEqual([]);
    });

    // Проверка правильного возврата адреса по houseId
    it('returns correct address by houseId', () => {
        store.addresses = [{houseId: '1', address: 'Test Address', cctv: 1}];

        const result = store.getAddressByHouseId('1');
        expect(result).toEqual({houseId: '1', address: 'Test Address', cctv: 1});
    });

    // Проверка возврата undefined, если адрес по houseId не найден
    it('returns undefined if address by houseId is not found', () => {
        store.addresses = [{houseId: '1', address: 'Test Address', cctv: 1}];

        const result = store.getAddressByHouseId('2');
        expect(result).toBeUndefined();
    });

    // Проверка правильного возврата клиентов по houseId
    it('returns correct clients by houseId', () => {
        userStore.clients = [
            {houseId: '1', flatId: '1', address: 'test', services: ['domophone']},
            {houseId: '2', flatId: '1', address: 'test', services: ['domophone']}
        ];

        const result = store.getClientsByHouseId('1').value;
        expect(result).toEqual([{houseId: '1', flatId: '1', address: 'test', services: ['domophone']}]);
    });

    // Проверка правильного возврата адреса по flatId
    it('returns correct address by flatId', () => {
        userStore.clients = [
            {houseId: '1', flatId: '1', address: 'test', services: ['domophone']},
            {houseId: '2', flatId: '1', address: 'test', services: ['domophone']}
        ];

        store.addresses = [
            {houseId: '1', address: 'Test Address', cctv: 1},
            {houseId: '2', address: 'Test Address', cctv: 1}
        ];

        const result = store.getAddressByFlatId('1');
        expect(result).toEqual({houseId: '1', address: 'Test Address', cctv: 1});
    });

    // Проверка реакции на изменение состояния userStore
    it('reacts to userStore state changes', async () => {
        if (getCurrentInstance()) {
            userStore.isAuth = false;
            store.load = vi.fn();
            userStore.isAuth = true;
            await nextTick();
            expect(store.load).toHaveBeenCalled();
        }
    });
});
