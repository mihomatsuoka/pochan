importScripts(
    "https://www.gstatic.com/firebasejs/12.17.1/firebase-app-compat.js"
);

importScripts(
    "https://www.gstatic.com/firebasejs/12.17.1/firebase-messaging-compat.js"
);


// ==========================================
// Firebase設定
// ==========================================

firebase.initializeApp({

    apiKey: "AIzaSyDY8gBLVlYP3V4QjVIN7QknguBYi-wApgw",

    authDomain: "potyan-8ff1f.firebaseapp.com",

    projectId: "potyan-8ff1f",

    storageBucket: "potyan-8ff1f.firebasestorage.app",

    messagingSenderId: "132062388678",

    appId: "1:132062388678:web:9b5ebb33aa6147efaf12c7"

});


// ==========================================
// Firebase Messaging
// ==========================================

const messaging =
    firebase.messaging();


// ==========================================
// バックグラウンド通知
// ==========================================

messaging.onBackgroundMessage(
    payload => {

        console.log(
            "★ FCMバックグラウンド通知:",
            payload
        );

        const notificationTitle =
            payload.notification?.title ||
            "♨️ ぽちゃんからのお知らせ";

        const notificationOptions = {

            body:
                payload.notification?.body ||
                "ぽちゃんからのお知らせです。"

        };


        self.registration.showNotification(
            notificationTitle,
            notificationOptions
        );

    }
);
