import { ref } from "vue";
import { get } from "../api";
import { Building } from "../types/building";

const addresses = ref<Building[]>([])

const load = () => {
    get<Building[]>('address/getAddressList')
        .then(r => addresses.value = r)
}

export const useAdresses = () => {
    return {
        addresses,
        load
    }
}