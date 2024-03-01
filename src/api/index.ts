import axios from 'axios'

const SERVER_URL = '/api/mobile'
const TMP_TOKEN = '71548ef5-0c50-4e48-a14a-96972609758a'

// const SERVER_URL = '/api/mobile'
// const TMP_TOKEN = 'f3d1ac97-e805-4baa-bb7c-14899711e2f8'


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
