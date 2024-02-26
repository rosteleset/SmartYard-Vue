import axios from 'axios'

const SERVER = '/api/mobile'
const TMP_TOKEN = '71548ef5-0c50-4e48-a14a-96972609758a'

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