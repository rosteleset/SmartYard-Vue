import { onMounted, ref } from "vue";
import { get } from "../api";
import { Settings } from "../types/user";

const settings = ref<Settings[]>([])

export const useUser = () => {

    onMounted(() => {
        get<Settings[]>('address/getSettingsList')
            .then((response) => {
                settings.value = response
            })
    })

    return {
        settings
    }
}