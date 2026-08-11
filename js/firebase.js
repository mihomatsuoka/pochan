import { initializeApp } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js";
import {
    getDatabase,
    ref,
    set,
    onvalue
} from "https://www.gstatic.com/firebasejs/12.17.1/firebase-database.js";
const firebaseConfig = {
    apiKey: "AIzaSyDY8gBLVlYP3V4QjVIN7QknguBYi-wApgw",
    authDomain: "potyan-8ff1f.firebaseapp.com",
    projectId: "potyan-8ff1f",
    storageBucket: "potyan-8ff1f.firebasestorage.app",
    messagingSenderId: "132062388678",
    appId: "1:132062388678:web:9b5ebb33aa6147efaf12c7",
    measurementId: "G-9NLLMEEC78"
};

const firebaseApp = initializeApp(firebaseConfig);

const db = getDatabase(firebaseApp);

console.log("Firebase 接続OK");
console.log(db);

window.firebaseDB = db;
window.firebaseRef = ref;
window.firebaseSet = set;
window.firebaseonvalue = onvalue;
