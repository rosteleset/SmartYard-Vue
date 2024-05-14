import {getMessaging, onBackgroundMessage,} from "firebase/messaging/sw";
import {getFirebaseApp} from './firebase';
import {MessagePayload} from "firebase/messaging";

declare let self: ServiceWorkerGlobalScope

const firebaseApp = getFirebaseApp();

const messaging = getMessaging(firebaseApp);

function sendToClient(client: WindowClient, payload: MessagePayload) {
    client.postMessage({
        msg: payload,
        type: 'FCM_MESSAGE'
    });
}

onBackgroundMessage(messaging, (payload) => {
    const action = payload.data?.action;
    const server = payload.data?.server;
    switch (action) {
        case "inbox":
        case "videoReady":
        case "newAddress":
        case "paySuccess":
        case "chat":
            const title = payload.notification?.title || "smart yard";

            return self.registration.showNotification(title, {
                badge: payload.data?.badge,
                body: payload.notification?.body,
                icon: "/icon.png",
                data: payload
            })
        default:
            break;
    }

    if (server) {
        const title = "call";
        return self.registration.showNotification(title, {
            badge: payload.data?.badge,
            body: payload.data?.callerId,
            icon: `https://rbt-demo.lanta.me/mobile/call/camshot/${payload.data?.hash}`,
            data: payload
        })

    }
});

self.addEventListener('notificationclick', (event) => {
    let url = 'http://localhost:5173/chat';
    event.notification.close(); // Android needs explicit close.
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
                    sendToClient(windowClient, event.notification.data as MessagePayload)
            })
    );
});


