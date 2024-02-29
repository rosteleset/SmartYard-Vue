// Это не глобальный стор. имеет свой набор камер для каждого экземпляра
// !!! Возможно стоит переместить 

import { onMounted, ref } from "vue";
import { get } from "../api";
import { Settings } from "../types/user";

export const useSettings = (flatId: string) => {
    const settings = ref<Settings>()

    const load = () => {
        get<Settings>('address/intercom', { flatId })
            .then(response => settings.value = response)
    }

    const save = (updated: Settings) => {
        const _updated = { ...updated }
        if (_updated.allowDoorCode) {
            _updated.enableDoorCode = _updated.allowDoorCode
            delete _updated.allowDoorCode
        }
        console.log(updated);

        get<Settings>('address/intercom', { flatId, settings: _updated })
            .then(response => {
                console.log(response);

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