import axios from 'axios';

// Получение URL сервера и временного токена из окружения
const SERVER_URL = import.meta.env.VITE_SERVER_URL;
const TMP_TOKEN = import.meta.env.VITE_TMP_TOKEN;

// Создание экземпляра axios с предустановленными параметрами
const axiosInstance = axios.create({
    baseURL: SERVER_URL,
    headers: {
        "Authorization": `Bearer ${TMP_TOKEN}`,
        "Content-Type": "application/json",
    },
});

// Функция для отправки запроса
export const request = async (path: string, params?: object) => {
    const body = JSON.stringify(params);
    const response = await axiosInstance.post(path, body);
    return response.data;
}

// Функция для выполнения GET запроса
export const get = async <T>(path: string, params?: object): Promise<T> => {
    try {
        const body = JSON.stringify(params);
        const response = await axiosInstance.post(path, body);
        return response.data.data;
    } catch (error:any) {
        console.error("Ошибка во время запроса", error.message);
        throw error;
    }
}