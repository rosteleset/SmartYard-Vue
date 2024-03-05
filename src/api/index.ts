import axios from 'axios'

const SERVER_URL = import.meta.env.VITE_SERVER_URL
const TMP_TOKEN = import.meta.env.VITE_TMP_TOKEN


const axiosInstance = axios.create({
    baseURL: SERVER_URL,
    headers: {
        "Authorization": `Bearer ${TMP_TOKEN}`,
        "Content-Type": "application/json",
    },
});

export const request = async (path: string, params?: object) => {
    const body = JSON.stringify(params)
    const response = await axiosInstance.post(
        path,
        body,
    )
    return response.data
}

export const get = async <T>(path: string, params?: object): Promise<T> => {
    try {
        const body = JSON.stringify(params)
        const response = await axiosInstance.post(path, body);
        return response.data.data;
    } catch (error) {
        console.error("Error during request", error);
        throw error;
    }
}
