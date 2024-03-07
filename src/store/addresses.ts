import { defineStore } from "pinia";
import { computed, onMounted, ref } from "vue";
import { get } from "../api";
import { Building } from "../types/building";
import { useUserStore } from "./user";

export const useAdressesStore = defineStore("addresses", () => {
  const isLoaded = ref(false);
  const userStore = useUserStore();
  const addresses = ref<Building[]>([]);

  const load = () => {
    get<Building[]>("address/getAddressList").then((response) => {
      addresses.value = response;
      isLoaded.value = true;
    });
  };

  const getAdressByHouseId = (houseId: string): Building | undefined => {
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

  onMounted(load);

  return {
    isLoaded,
    addresses,
    load,
    getAdressByHouseId,
    getClientsByHouseId,
  };
});
