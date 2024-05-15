import {defineStore} from "pinia";
import {onMounted, ref} from "vue";
import {getMessaging, MessagePayload, onMessage} from "firebase/messaging"
import {getFirebaseApp, getToken} from "@/firebase.ts";
import useApi from "@/hooks/useApi.ts";

export const usePushStore = defineStore("push", () => {
    const {request} = useApi();
    const firebaseApp = getFirebaseApp();
    const messaging = getMessaging(firebaseApp);

    const notifications = ref<MessagePayload[]>([])
    const call = ref<MessagePayload>()

    const onFocus = (serviceWorker: ServiceWorkerRegistration) => {
        serviceWorker.getNotifications().then(notifications => {
            for (const notification of notifications) {
                onPush(notification.data.FCM_MSG)
                notification.close()
            }
        })
    }

    const onPush = (payload: MessagePayload) => {
        if (payload.data?.action)
            addNotification(payload)
        if (payload.data?.server)
            setCall(payload)
    }

    const addNotification = (payload: MessagePayload) => {
        notifications.value.push(payload)
    }
    const removeNotification = (notification: MessagePayload) => {
        notifications.value = notifications.value.filter(m => m.messageId !== notification.messageId)
    }
    const setCall = (payload?: MessagePayload) => {
        call.value = payload
    }


    onMounted(() => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register(
                import.meta.env.MODE === 'production' ? 'firebase-messaging-sw.js' : 'dev-sw.js?dev-sw', {
                    scope: './',
                    type: import.meta.env.MODE === 'production' ? 'classic' : 'module'
                }
            )
                .then((registration) => {
                    getToken(registration)
                        .then(token => {
                            request('user/registerPushToken', {pushToken: token, platform: "android"})
                        })
                    navigator.serviceWorker.addEventListener("message", (event) => {
                        if (event.data.type === "FCM_MESSAGE")
                            onPush(event.data.msg)
                    });
                    window.addEventListener("focus", () => onFocus(registration));
                    onMessage(messaging, onPush);
                })
        }
    })


    return {notifications, addNotification, removeNotification, call, setCall}
})