import {getMessaging, onBackgroundMessage} from "firebase/messaging/sw";
import {getFirebaseApp} from './firebase';
import {SERVER_URL} from "@/lib/const.ts";

declare let self: ServiceWorkerGlobalScope

self.addEventListener('notificationclick', (event) => {
    event.notification.close(); // Android needs explicit close.
    let url = `${self.registration.scope}chat`;
    event.waitUntil(
        self.clients.matchAll({type: 'window'}).then(windowClients => {
            for (const windowClient of windowClients) {
                if ('focus' in windowClient) {
                    return windowClient.focus();
                }
            }

            if (self.clients.openWindow) {
                return self.clients.openWindow(url)
            }
            return null
        })
            .then(windowClient => {
                if (windowClient)
                    windowClient.postMessage({
                        msg: event.notification.data.FCM_MSG,
                        type: 'FCM_MESSAGE'
                    });
            })
    );
});

const firebaseApp = getFirebaseApp();
const messaging = getMessaging(firebaseApp);

onBackgroundMessage(messaging, (payload) => {
    if (payload.notification) {
        // payload.notification.image = "/icon.png"
    } else if (payload.data?.server) {
        const title = "call";
        self.registration.showNotification(title, {
            body: payload.data?.callerId,
            icon: `${SERVER_URL}/call/camshot/${payload.data?.hash}`,
            data: {FCM_MSG: payload}
        })
    }

    return payload;
});




