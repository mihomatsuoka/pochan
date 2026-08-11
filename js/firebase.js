import { initializeApp } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js";

import {
    getDatabase,
    ref,
    set,
    onValue
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-database.js";


// Firebase設定
const firebaseConfig = {

    apiKey: "AIzaSyDY8gBLVlYP3V4QjVIN7QknguBYi-wApgw",

    authDomain: "potyan-8ff1f.firebaseapp.com",

    projectId: "potyan-8ff1f",

    storageBucket: "potyan-8ff1f.firebasestorage.app",

    messagingSenderId: "132062388678",

    appId: "1:132062388678:web:9b5ebb33aa6147efaf12c7",

    measurementId: "G-9NLLMEEC78"

};


// Firebaseを初期化
const firebaseApp = initializeApp(firebaseConfig);


// Realtime Database
const db = getDatabase(firebaseApp);


// 接続確認
console.log("Firebase 接続OK");
console.log(db);


// 他のJavaScriptから使えるようにする
window.firebaseDB = db;

window.firebaseRef = ref;

window.firebaseSet = set;

window.firebaseOnValue = onValue;
