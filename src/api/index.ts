import axios from 'axios'

const SERVER_URL = '/api/mobile'
const TMP_TOKEN = 'dcd9324a-12ae-4874-ab27-2c5eee734329'

const axiosInstance = axios.create({
    baseURL: SERVER_URL,
    headers: {
        "Authorization": `Bearer ${TMP_TOKEN}`,
        "Content-Type": "application/json",
    },
});

export const response = ({ path, body = "" }: { path: string, body?: string }) => {
    return axiosInstance.post(
        path,
        body,
    )
}

export async function get<T>(path: string, params?: object): Promise<T> {
    try {
        const body = JSON.stringify(params)
        const response = await axiosInstance.post(path, body);
        return response.data.data;
    } catch (error) {
        console.error("Error during request", error);
        throw error;
    }
}
