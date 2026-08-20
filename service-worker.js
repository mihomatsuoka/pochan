self.addEventListener("install", () => {

    console.log("ぽちゃん Service Worker インストール");

    self.skipWaiting();

});


self.addEventListener("activate", () => {

    console.log("ぽちゃん Service Worker 有効化");

});
