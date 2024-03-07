// Это не глобальный стор. имеет свой набор камер для каждого экземпляра
// !!! Возможно стоит переместить 

import { onMounted, ref } from "vue";
import { get } from "../api";
import { Settings } from "../types/user";

const url = 'address/intercom';

export const useSettings = (flatId: string) => {
    const settings = ref<Settings>()

    const load = () => {
        get<Settings>(url, { flatId })
            .then(response => settings.value = response)
    }

    const save = (updated: Settings) => {
        
        get<Settings>(url, { flatId, settings: updated })
            .then(response => {
                settings.value = response
            })
    }

    onMounted(load)

    return {
        settings,
        load,
        save
    }
}