import axios from "axios";
import { computed } from "vue";
import { useUserStore } from "../store/user";

// Получение URL сервера и временного токена из окружения
const SERVER_URL =
  import.meta.env.MODE === "development" && import.meta.env.VITE_DEV_PROXY_PREFIX &&
  !import.meta.env.VITE_SERVER_URL.includes("http")
    ? import.meta.env.VITE_DEV_PROXY_PREFIX + import.meta.env.VITE_SERVER_URL
    : import.meta.env.VITE_SERVER_URL;

const useApi = () => {
  const userStore = useUserStore();

  // Создание экземпляра axios с предустановленными параметрами
  const axiosInstance = computed(() =>
    axios.create({
      baseURL: SERVER_URL,
      headers: {
        Authorization: `Bearer ${userStore.token}`,
        "Content-Type": "application/json",
      },
    })
  );

  // Функция для отправки запроса
  const request = async (path: string, params?: object) => {
    const body = JSON.stringify(params);
    try {
      const response = await axiosInstance.value.post(path, body);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  };

  // Функция для выполнения GET запроса
  const get = async <T>(path: string, params?: object): Promise<T> => {
    try {
      const body = JSON.stringify(params);
      const response = await axiosInstance.value.post(path, body);
      return response.data.data;
    } catch (error: any) {
      console.error("Ошибка во время запроса", error.message);
      throw error;
    }
  };

  return {
    axiosInstance,
    request,
    get,
  };
};

export default useApi