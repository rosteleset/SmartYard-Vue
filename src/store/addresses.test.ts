import {beforeEach, describe, expect, it, Mock, vi} from "vitest";
import {useAddressesStore} from "@/store/addresses.ts";
import {createPinia, setActivePinia} from "pinia";
import useApi from "@/hooks/useApi.ts";
import {useUserStore} from "@/store/user.ts";
import {nextTick} from "vue";

vi.mock('"@/store/user')
vi.mock('@/hooks/useApi')


describe('addresses store', () => {
    let store: ReturnType<(typeof useAddressesStore)>;

    const mockGet = vi.fn();

    beforeEach(() => {
        setActivePinia(createPinia());
        (useApi as Mock).mockReturnValue({get: mockGet});
        store = useAddressesStore();
    })

    it('инициализируется с правильными начальными значениями', () => {

        expect(store.isLoaded).toBe(false);
        expect(store.addresses).toEqual([]);
    });

    it('загружает данные при вызове load', async () => {
        mockGet.mockResolvedValue([{houseId: '1', address: 'Test Address'}]);


        await store.load();
        expect(store.isLoaded).toBe(true);
        expect(store.addresses).toEqual([{houseId: '1', address: 'Test Address'}]);
    });

    it('обрабатывает ошибки при загрузке данных', async () => {
        mockGet.mockRejectedValue(new Error('Network Error'));


        await store.load();
        expect(store.isLoaded).toBe(true);
        expect(store.addresses).toEqual([]);
    });

    it('возвращает правильный адрес по houseId', () => {

        store.addresses = [{houseId: '1', address: 'Test Address', cctv: 1}];

        const result = store.getAddressByHouseId('1');
        expect(result).toEqual({houseId: '1', address: 'Test Address', cctv: 1});
    });

    it('возвращает undefined, если адрес по houseId не найден', () => {

        store.addresses = [{houseId: '1', address: 'Test Address', cctv: 1}];

        const result = store.getAddressByHouseId('2');
        expect(result).toBeUndefined();
    });

    it('возвращает правильных клиентов по houseId', () => {
        const userStore = useUserStore();
        userStore.clients = [
            {houseId: '1', flatId: '1', address: 'test', services: ['domophone']},
            {houseId: '2', flatId: '1', address: 'test', services: ['domophone']}
        ];


        const result = store.getClientsByHouseId('1').value;
        expect(result).toEqual([{houseId: '1', flatId: '1', address: 'test', services: ['domophone']}]);
    });

    it('возвращает правильный адрес по flatId', () => {
        const userStore = useUserStore();
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

    it('реагирует на изменение состояния userStore', async () => {
        const userStore = useUserStore();
        userStore.isAuth = false;


        store.load = vi.fn();
        userStore.isAuth = true;
        await nextTick()
        expect(store.load).toHaveBeenCalled();
    });
})