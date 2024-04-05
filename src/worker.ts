export type {};
declare const self: ServiceWorkerGlobalScope;
import {getMessaging, onBackgroundMessage} from "firebase/messaging/sw";
import {getFirebaseApp} from "@/firebase";

const firebaseApp = getFirebaseApp();

const messaging = getMessaging(firebaseApp);

onBackgroundMessage(messaging, (payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    const action = payload.data?.action;
    const server = payload.data?.server;
    console.log(1)
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
        const title =  "Вызов";
        return self.registration.showNotification(title, {
            badge: payload.data?.badge,
            body: payload.data?.callerId,
            icon: `https://rbt-demo.lanta.me/mobile/call/camshot/${payload.data?.hash}`,
            data: payload
        })

    }
});

self.addEventListener('notificationclick', (event) => {
    console.log(2)
    let url = 'http://localhost:5173/chat';
    event.notification.close(); // Android needs explicit close.
    event.waitUntil(
        self.clients.matchAll({type: 'window'}).then(windowClients => {
            console.log(windowClients)
            for (const windowClient of windowClients) {
                windowClient.postMessage({
                    type: 'push-message',
                    payload: event.notification.data
                });
                if ('focus' in windowClient) {
                    windowClient.postMessage(event.notification.data)
                    return windowClient.focus();
                }
            }

            if (self.clients.openWindow) {
                return self.clients.openWindow(url);
            }
        })
    );
});


console.log("worker ok");


