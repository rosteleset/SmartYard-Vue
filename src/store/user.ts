import {onMounted, ref} from "vue";
import {Client} from "../types/user";
import {defineStore} from "pinia";
import useApi from "../hooks/useApi";
import {useRouter} from "vue-router";

const LOCAL_STORAGE_TOKEN_KEY = "jwt-token";

export const useUserStore = defineStore("user", () => {
    const {get} = useApi();
    const router = useRouter();
    const isLoaded = ref(false);
    const isAuth = ref(false);
    const error = ref<string>();


    const clients = ref<Client[]>([]);
    const token = ref<string | null>(
        localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY) || ""
    );

    const load = () => {

        if (!token.value) return isLoaded.value = true;

        // вынес отдельно для обратной совместимости
        get<Client[]>("address/getSettingsList")
            .then((clientsResponse) => {
                clients.value = clientsResponse;
                isLoaded.value = true;
                isAuth.value = true;
            })
            .catch((_error) => {
                const code = _error.response?.data?.code
                if (code === 401) {
                    isLoaded.value = true;
                    isAuth.value = false;
                }
                else {
                    error.value = _error.message;
                }
            })
    };

    const setToken = (_token: string) => {
        localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, _token);
        token.value = _token;
        if (_token)
            load()
    };

    const logout = async () => {
        // await request('user/registerPushToken', {pushToken: ""})
        setToken("")
        clients.value = []
        isAuth.value = false
        await router.push('/')
    }

    onMounted(load);

    return {
        load,
        clients,
        isLoaded,
        isAuth,
        error,
        token,
        setToken,
        logout
    };
});
