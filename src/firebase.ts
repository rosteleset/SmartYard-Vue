// Import the functions you need from the SDKs you need

import {getMessaging, getToken, onMessage} from 'firebase/messaging';
import {initializeApp} from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = initializeApp({
    apiKey: "AIzaSyAFkbkOT0gId8ZVh44nSBVpkMeQQbCN6oc",
    authDomain: "rosteleset-d38e1.firebaseapp.com",
    projectId: "rosteleset-d38e1",
    storageBucket: "rosteleset-d38e1.appspot.com",
    messagingSenderId: "13160569054",
    appId: "1:13160569054:web:c6bbb75e09b56844078a4f"
});

console.log('*** Firebase Config ***', firebaseConfig)

const messaging = getMessaging(firebaseConfig);
console.log(messaging);
const vapidKEY = "BNCFz9Y0C8bn6siEF-_Mu2CrdITso6rWKLXhF30yh2aa8vFkNp8dgmSfe6n5nq3ORPoynmH3kQuAKJC-KKy7rIc"
export const getOrRegisterServiceWorker = () => {
    if ('serviceWorker' in navigator) {
        console.log(import.meta.env.MODE);
        return window.navigator.serviceWorker
            .getRegistration('/firebase-push-notification-scope')
            .then(serviceWorker => {
                    if (serviceWorker) {
                        console.log("service worker exists");
                        return serviceWorker;
                    }
                    console.log("service worker is gonna be register");
                    return window.navigator.serviceWorker.register(import.meta.env.MODE === 'production' ? '/sw.js' : '/dev-sw.js?dev-sw',
                        {type: import.meta.env.MODE === 'production' ? 'classic' : 'module'})
                        .then((serviceWorker) => {
                            console.log("success registering SW");
                        }).catch((err) => {
                            console.log("registering failed", err);
                        });
                    // { type:  'module' });
                }
            )
    }
    throw new Error('The browser doesn`t support service worker.');
};

export const getFirebaseToken = () =>
    getOrRegisterServiceWorker()
        .then((serviceWorkerRegistration) =>
            getToken(messaging, {vapidKey: vapidKEY, serviceWorkerRegistration}));


export const onForegroundMessage = () =>
    new Promise((resolve) => {
        onMessage(messaging, (payload) => {
            resolve(payload);
        });
    });
