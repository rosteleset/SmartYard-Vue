import { onMounted, ref } from "vue";
import { get } from "../api";
import { Building } from "../types/building";
import { defineStore } from "pinia";


export const useAdressesStore = defineStore('addresses', () => {
    const addresses = ref<Building[]>([])

    const load = () => {
        get<Building[]>('address/getAddressList')
            .then(response => addresses.value = response)
    }

    onMounted(load)

    return {
        addresses,
        load
    }
});