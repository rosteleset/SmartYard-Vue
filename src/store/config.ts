import { defineStore } from "pinia";
import { ref, watch } from "vue";

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

// Экспорт хука для работы с конфигурацией
export const useConfigStore = defineStore(STORE_NAME, () => {
  const config = ref<ConfigStore>(getConfig());

  // Функция для обновления конфигурации
  const updateConfig = (params: ConfigStore) => {
    config.value = {
      ...config.value,
      ...params,
    };
  };

  watch(config, (value) =>
    localStorage.setItem(STORE_NAME, JSON.stringify(value))
  );

  return {
    config,
    updateConfig,
  };
});
