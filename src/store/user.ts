import { onMounted, ref } from "vue";
import { get } from "../api";
import { Client } from "../types/user";
import { defineStore } from "pinia";


export const useUserStore = defineStore('user', () => {
    const clients = ref<Client[]>([])

    const load = () => {
        get<Client[]>('address/getSettingsList')
            .then((response) => {
                clients.value = response
            })
    }

    onMounted(load)

    return {
        clients: clients
    }
});