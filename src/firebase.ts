import {initializeApp} from "firebase/app";
import {getMessaging, getToken as messagingGetToken} from "firebase/messaging";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;
const getFirebaseApp = () => initializeApp(firebaseConfig);


const getToken = async (registration: ServiceWorkerRegistration) => {
    const messaging = getMessaging(getFirebaseApp());

    return await messagingGetToken(messaging, {
        vapidKey,
        serviceWorkerRegistration: registration
    })
}

export {getFirebaseApp, getToken};