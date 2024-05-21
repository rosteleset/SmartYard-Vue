import {defineStore} from "pinia";
import {onMounted, reactive, ref, watch} from "vue";
import {Names, Notifications} from "@/types/user.ts";
import useApi from "@/hooks/useApi.ts";
import {useUserStore} from "@/store/user.ts";

// Интерфейс для хранилища конфигурации
interface ConfigStore {
    [key: string]: any;
}

// Константа для хранения значений конфигурации по умолчанию
const DEFAULT_CONFIG: ConfigStore = {} as ConfigStore;

// Константа для хранения имени хранилища
const STORE_NAME = "config";

// Функция для получения конфигурации из локального хранилища
const getConfig = (): ConfigStore => {
    const config = localStorage.getItem(STORE_NAME);
    return config ? JSON.parse(config) : DEFAULT_CONFIG;
};

const getPreferredScheme = () =>
    window?.matchMedia?.("(prefers-color-scheme:dark)")?.matches
        ? "dark"
        : "light";

// Экспорт хука для работы с конфигурацией
export const useConfigStore = defineStore(STORE_NAME, () => {
    const {get, request} = useApi();
    const userStore = useUserStore();
    const config = ref<ConfigStore>(getConfig());
    const notifications = ref<Notifications>({});
    const names = ref<Names>({} as Names);

    reactive(config);
    // Функция для обновления конфигурации
    const updateConfig = (params: ConfigStore) => {
        config.value = {
            ...config.value,
            ...params,
        };
    };

    const getTheme = () => {
        if (!config.value.theme)
            updateConfig({theme: "auto"});
        if (config.value.theme !== "auto")
            return config.value.theme;
        return getPreferredScheme();
    };

    const updateTheme = () => {
        document.documentElement.dataset["theme"] = getTheme();
    };

    const sendName = async (names: Names) => {
        const url = "user/sendName";
        await request(url, names);
        return;
    };

    watch(config, (value) => {
        updateTheme();
        localStorage.setItem(STORE_NAME, JSON.stringify(value));
    });

    watch(userStore, store => {
        if (store.isAuth) {
            get<Notifications>("user/notification")
                .then(
                    (response) => (notifications.value = response)
                );
            get<Names>("user/getName")
                .then((namesResponse) => {
                    names.value = namesResponse;
                });
        }
    })

    onMounted(updateTheme)

    return {
        config,
        notifications,
        names,
        updateConfig,
        getTheme,
        updateTheme,
        sendName,
    };
});
