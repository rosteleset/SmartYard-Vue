import axios from 'axios'

const SERVER = '/api/mobile'
const TMP_TOKEN = 'dcd9324a-12ae-4874-ab27-2c5eee734329'

export const response = ({ path, body = "" }: { path: string, body?: string }) => {
    const headers = {
        "Authorization": `Bearer ${TMP_TOKEN}`,
        "Content-Type": "application/json",
    }

    return axios.post(
        `${SERVER}/${path}`,
        body,
        { headers }
    )
}