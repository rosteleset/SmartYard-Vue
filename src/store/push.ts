import {defineStore} from "pinia";
import {onMounted, ref} from "vue";
import {getMessaging, MessagePayload, NotificationPayload, onMessage} from "firebase/messaging"
import {getFirebaseApp, getToken} from "@/firebase.ts";
import useApi from "@/hooks/useApi.ts";
import {useRouter} from "vue-router";

interface Call {
    callerId: string,
    domophoneId: string,
    dtmf: string,
    extension: string,
    flatId: string,
    flatNumber: string,
    hash?: string,
    pass?: string,
    platform?: string,
    port?: string,
    server: string,
    stun?: string,
    stunTransport?: string,
    timestamp?: string,
    transport?: string,
    ttl?: string,
}

export const usePushStore = defineStore("push", () => {
    const {request} = useApi();
    const router = useRouter();
    const firebaseApp = getFirebaseApp();
    const messaging = getMessaging(firebaseApp);

    const notifications = ref<MessagePayload[]>([])
    const call = ref<MessagePayload>()

    const init = (registration: ServiceWorkerRegistration) => {
        getToken(registration).then(token => {
            const storageToken = localStorage.getItem('push-token')
            if (token !== storageToken) {
                localStorage.setItem('push-token', token)
                request('user/registerPushToken', {pushToken: token, platform: "android"}).then(() => {
                })
            }
        })
        navigator.serviceWorker.addEventListener("message", (event) => {
            console.log('event', event)
            if (event.data.type === "push-message")
                addNotification(event.data.msg)
        });
    }

    const addNotification = (payload: MessagePayload) => {
        notifications.value.push(payload)
    }
    const removeNotification = (notification: MessagePayload) => {
        notifications.value = notifications.value.filter(m => m.messageId !== notification.messageId)
    }
    const setCall = () => {
    }

    onMessage(messaging, (event) => {
        console.log(event)
        if (event.data?.action)
            addNotification(event)
        else {
            router.push({path: "/call", query: event.data}).then(() => {
            })
        }
    })

    onMounted(() => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register(
                import.meta.env.MODE === 'production' ? 'firebase-messaging-sw.js' : 'dev-sw.js?dev-sw', {
                    scope: './',
                    type: import.meta.env.MODE === 'production' ? 'classic' : 'module'
                }
            ).then(init)
        }
    })

    return {notifications, removeNotification}
})