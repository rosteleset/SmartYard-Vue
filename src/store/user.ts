import { onMounted, ref } from "vue";
import { get } from "../api";
import { Settings } from "../types/user";
import { defineStore } from "pinia";


export const useUserStore = defineStore('user', () => {
    const settings = ref<Settings[]>([])

    const load = () => {
        get<Settings[]>('address/getSettingsList')
            .then((response) => {
                settings.value = response
            })
    }

    onMounted(load)

    return {
        settings
    }
});