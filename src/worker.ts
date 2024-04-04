import {initializeApp} from "firebase/app";
import {getMessaging} from "firebase/messaging/sw";
import {getToken, onMessage} from "firebase/messaging";

const firebaseConfig = {
    apiKey: "AIzaSyAFkbkOT0gId8ZVh44nSBVpkMeQQbCN6oc",
    authDomain: "rosteleset-d38e1.firebaseapp.com",
    projectId: "rosteleset-d38e1",
    storageBucket: "rosteleset-d38e1.appspot.com",
    messagingSenderId: "13160569054",
    appId: "1:13160569054:web:c6bbb75e09b56844078a4f",
};

const firebaseApp = initializeApp(firebaseConfig);

const messaging = getMessaging(firebaseApp);

onMessage(messaging, (payload) => {
    console.log('0 Message received. ', payload);
});

console.log("kok");

