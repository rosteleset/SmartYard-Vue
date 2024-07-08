import {getCurrentInstance, onMounted, ref} from "vue";
import {Client} from "@/types/user";
import {defineStore} from "pinia";
import useApi from "@/hooks/useApi";
import {useRouter} from "vue-router";
import {deleteToken} from "@/firebase";

const LOCAL_STORAGE_TOKEN_KEY = "jwt-token";

export const useUserStore = defineStore("user", () => {
    const {get, request} = useApi();
    const router = useRouter();
    const isLoaded = ref(false);
    const isAuth = ref(false);
    const error = ref<string | null>(null);


    const clients = ref<Client[]>([]);
    const token = ref<string | null>(
        localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY) || ""
    );

    const load = async () => {

        if (!token.value) {
            isLoaded.value = true
            return;
        }

        try {
            clients.value = await get<Client[]>("address/getSettingsList");
            isAuth.value = true;
            isLoaded.value = true;
        } catch (_error: any) {
            const code = _error.response?.data?.code
            isLoaded.value = true;
            if (code === 401) {
                isAuth.value = false;
            } else {
                error.value = _error.message;
            }
        }
    };

    const setToken = (_token: string | null) => {
        token.value = _token;
        if (_token) {
            localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, _token);
            return load()
        } else {
            localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY);
            return Promise.resolve();
        }
    };

    const logout = async () => {
        await request('user/registerPushToken', {pushToken: "",platform: "web"})
        await deleteToken()
        await setToken("")
        clients.value = []
        isAuth.value = false
        await router.push('/')
    }

    if (getCurrentInstance()) {
        onMounted(load)
    }

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
