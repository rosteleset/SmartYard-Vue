import {onMounted, ref} from "vue";
import {Client, Names, Notifications} from "../types/user";
import {defineStore} from "pinia";
import useApi from "../hooks/useApi";
import generateDeviceId from "@/lib/generateDeviceId.ts";

const LOCAL_STORAGE_TOKEN_KEY = "jwt-token";

export const useUserStore = defineStore("user", () => {
    const {get} = useApi();
    const deviceId = ref(generateDeviceId());
    const isLoaded = ref(false);
    const clients = ref<Client[]>([]);
    const names = ref<Names>({} as Names);
    const notifications = ref<Notifications>({});
    const error = ref<string>();
    const token = ref<string | null>(
        localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY) ||
        import.meta.env.VITE_TMP_TOKEN ||
        ""
    );

    const load = () => {
        error.value = undefined;
        Promise.all([
            get<Client[]>("address/getSettingsList"),
            get<Notifications>("user/notification"),
        ])
            .then(([clientsResponse, notificationsResponse]) => {
                clients.value = clientsResponse;
                notifications.value = notificationsResponse;
                isLoaded.value = true;
            })
            .catch((_error) => {
                error.value = _error.message;
                isLoaded.value = true;
            });

        // вынес отдельно для обратной совместимости
        get<Names>("user/getName")
            .then((namesResponse) => {
                names.value = namesResponse;
            })
            .catch((_error) => {
                // error.value = _error.message;
            });
    };

    const setToken = (_token: string) => {
        localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, _token);
        token.value = _token;
    };

    onMounted(load);

    return {
        load,
        clients,
        names,
        notifications,
        isLoaded,
        error,
        token,
        setToken,
        deviceId
    };
});
