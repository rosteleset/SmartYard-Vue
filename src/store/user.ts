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


    const clients = ref<Client[]>([]);
    const token = ref<string | null>(
        localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY) || ""
    );

    const load = () => {
        const loaded = (auth: boolean) => {
            isLoaded.value = true;
            isAuth.value = auth;
        }

        if (!token.value) return isLoaded.value = true;

        // вынес отдельно для обратной совместимости
        get<Client[]>("address/getSettingsList")
            .then((clientsResponse) => {
                clients.value = clientsResponse;
                loaded(true)
            })
            .catch(() => {
                loaded(false)
            })
    };

    const setToken = (_token: string) => {
        localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, _token);
        token.value = _token;
        if (_token)
            load()
    };

    const logout = () => {
        setToken("")
        clients.value = []
        isAuth.value = false
        router.push('/')
    }

    onMounted(load);

    return {
        load,
        clients,
        isLoaded,
        isAuth,
        token,
        setToken,
        logout
    };
});
