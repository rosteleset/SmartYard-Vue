import { request } from "."

const openDoor = (domophoneId: number) => {
    request('address/openDoor', { domophoneId })
}

export default openDoor