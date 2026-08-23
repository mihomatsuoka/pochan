/* ==========================================
   Project ぽちゃん
   service-worker.js
========================================== */


// ==========================================
// インストール
// ==========================================

self.addEventListener("install", event => {

    console.log(
        "ぽちゃん Service Worker インストール"
    );

    self.skipWaiting();

});


// ==========================================
// 有効化
// ==========================================

self.addEventListener("activate", event => {

    console.log(
        "ぽちゃん Service Worker 有効化"
    );

    event.waitUntil(
        self.clients.claim()
    );

});


// ==========================================
// 通知クリック
// ==========================================

self.addEventListener(
    "notificationclick",
    event => {

        event.notification.close();

        event.waitUntil(
            self.clients.matchAll({
                type: "window",
                includeUncontrolled: true
            })
            .then(clients => {

                if(clients.length > 0){

                    return clients[0].focus();

                }

                return self.clients.openWindow(
                    "./"
                );

            })
        );

    }
);
