import { defineStore } from "pinia";
import { ref, watch } from "vue";
import { getMessaging, MessagePayload, onMessage } from "firebase/messaging"
import { getFirebaseApp, getToken } from "@/firebase";
import useApi from "@/hooks/useApi";
import { useUserStore } from "@/store/user";

export const usePushStore = defineStore("push", () => {
    const userStore = useUserStore();
    const { request } = useApi();

    const firebaseApp = getFirebaseApp();
    const isSecureOrLocalhost = window.location.protocol === 'https:' || window.location.hostname === 'localhost';
    let messaging = null;
    
    try {
        messaging = (isSecureOrLocalhost && firebaseApp ? getMessaging(firebaseApp) : null);
    } catch (e) {
        console.warn(e)
    }
    
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

    const removeNotification = (messageId: string) => {
        try {
            notifications.value = notifications.value.filter(m => m.messageId !== messageId)

        } catch (e) {
            console.warn(e)
        }
    }
    const setCall = (payload?: MessagePayload) => {
        call.value = payload
    }

    const load = async () => {
        try {
            if ('serviceWorker' in navigator) {
                let registration = await navigator.serviceWorker.register(
                    import.meta.env.MODE === 'production' ? 'firebase-messaging-sw.js' : 'dev-sw.js?dev-sw', {
                    scope: `.${import.meta.env.VITE_BASE_PATH}/`,
                    type: import.meta.env.MODE === 'production' ? 'classic' : 'module'
                }
                );

                const token: string = await getToken(registration)

                await request('user/registerPushToken', { pushToken: token, platform: "web" })

                navigator.serviceWorker.addEventListener("message", (event) => {
                    if (event.data.type === "FCM_MESSAGE")
                        onPush(event.data.msg)
                });
                window.addEventListener("focus", () => onFocus(registration));
                if (messaging !== null)
                    onMessage(messaging, onPush);
            }
        } catch (e) {
            console.warn(e)
        }
    }

    watch(userStore, store => {
        if (store.isAuth)
            load()
    })

    return { notifications, addNotification, removeNotification, call, setCall, load }
})