import { initializeApp } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js";

import {
    getDatabase,
    ref,
    set,
    onValue
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-database.js";

import {
    getMessaging,
    getToken,
    onMessage
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-messaging.js";


// ==========================================
// Firebase設定
// ==========================================

const firebaseConfig = {

    apiKey: "AIzaSyDY8gBLVlYP3V4QjVIN7QknguBYi-wApgw",

    authDomain: "potyan-8ff1f.firebaseapp.com",

    projectId: "potyan-8ff1f",

    storageBucket: "potyan-8ff1f.firebasestorage.app",

    messagingSenderId: "132062388678",

    appId: "1:132062388678:web:9b5ebb33aa6147efaf12c7",

    measurementId: "G-9NLLMEEC78"

};


// ==========================================
// Firebase初期化
// ==========================================

const firebaseApp =
    initializeApp(firebaseConfig);


// ==========================================
// Realtime Database
// ==========================================

const db =
    getDatabase(
        firebaseApp,
        "https://potyan-8ff1f-default-rtdb.asia-southeast1.firebasedatabase.app"
    );


// ==========================================
// Firebase Messaging
// ==========================================

const messaging =
    getMessaging(firebaseApp);


// ==========================================
// VAPID公開鍵
// ==========================================

const vapidKey =
    "BP-hB_2FY3RkoolT4Cp9ApEmXW8LbNT9Lk5wtNmYCUo6UL3Sittv_8eKgSLI9rLFNQsgkwMwvPMhRlk1wblw_HI";


// ==========================================
// 接続確認
// ==========================================

console.log("Firebase 接続OK");
console.log(db);

console.log(
    "Firebase Messaging 接続OK"
);


// ==========================================
// 他のJSから使えるようにする
// ==========================================

window.firebaseDB = db;

window.firebaseRef = ref;

window.firebaseSet = set;

window.firebaseOnValue = onValue;


// ==========================================
// FCM用
// ==========================================

window.firebaseMessaging = messaging;

window.firebaseGetToken = getToken;

window.firebaseOnMessage = onMessage;

window.firebaseVapidKey = vapidKey;


console.log(
    "firebaseOnValue:",
    window.firebaseOnValue
);

console.log(
    "FCM準備OK"
);


// ==========================================
// FCM開始
// Firebaseの準備が完了してから実行
// ==========================================

setTimeout(() => {

    if(
        typeof window.setupFCM === "function"
    ){

        console.log(
            "★ Firebase準備完了 → FCM開始"
        );

        window.setupFCM();

    }

}, 500);
