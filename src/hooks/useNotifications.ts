import {ref} from "vue";
import {MessagePayload} from "firebase/messaging";

const useNotifications = () => {
    const notifications = ref<MessagePayload[]>([])
    // const addNotification = (payload: MessagePayload) => {
    //     notifications.value.push(payload)
    // }

    return {notifications}
}

export default useNotifications;