import {defineStore} from "pinia";
import {computed, onMounted, ref, watch} from "vue";
import useApi from "@/hooks/useApi";
import {Building} from "@/types/building";
import {useUserStore} from "@/store/user";

export const useAddressesStore = defineStore("addresses", () => {
    const userStore = useUserStore();
    const {get} = useApi();
    const isLoaded = ref(false);
    const addresses = ref<Building[]>([]);

    const load = async () => {
        if (!userStore.isAuth)
            return
        try {
            addresses.value = await get<Building[]>("address/getAddressList");
            isLoaded.value = true;
        } catch (e) {
            isLoaded.value = true;
        }
    };

    const getAddressByHouseId = (houseId: string): Building | undefined => {
        const result = addresses.value.find(
            (address) => address.houseId === houseId
        );
        return result;
    };

    const getClientsByHouseId = (houseId: string) => {
        return computed(() =>
            userStore.clients.filter((client) => client.houseId === houseId)
        );
    };

    const getAddressByFlatId = (flatId: string): Building | undefined => {
        const client = userStore.clients.find((client) => client.flatId === flatId);
        return client && getAddressByHouseId(client.houseId);
    };

    watch(userStore, load)
    onMounted(load)

    return {
        isLoaded,
        addresses,
        load,
        getAddressByHouseId,
        getClientsByHouseId,
        getAddressByFlatId,
    };
});
