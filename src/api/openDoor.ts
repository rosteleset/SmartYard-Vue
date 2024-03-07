import { request } from "."

// Функция открытия двери по id домофона
const openDoor = (domophoneId: number) => {
    // Вызов функции request для открытия двери по указанному id
    request('address/openDoor', { domophoneId })
}

export default openDoor