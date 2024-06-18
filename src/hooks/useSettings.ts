import {onMounted, ref} from "vue";
import {Settings} from "../types/user";
import useApi from "./useApi";

const url = "address/intercom";

const useSettings = (flatId: string) => {
    const {get} = useApi();
    const settings = ref<Settings>();


    const load = () => {
        get<Settings>(url, {flatId}).then(
            (response) => (settings.value = response)
        );

    };

    const save = (updated: Settings) => {
        get<Settings>(url, {flatId, settings: updated}).then((response) => {
            settings.value = response;
        });
    };

    onMounted(load);

    return {
        settings,
        load,
        save,
    };
};

export default useSettings;
