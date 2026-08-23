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
// プッシュ通知受信
// ==========================================

self.addEventListener(
    "push",
    event => {

        console.log(
            "★ プッシュ通知を受信"
        );

        let data = {};

        if(event.data){

            try{

                data =
                    event.data.json();

            }catch(error){

                data = {
                    body:
                        event.data.text()
                };

            }

        }


        const title =
            data.title ||
            "♨️ ぽちゃんからのお知らせ";


        const options = {

            body:
                data.body ||
                "ぽちゃんからのお知らせです。",

            icon:
                data.icon ||
                "./icon-192.png",

            badge:
                data.badge ||
                "./icon-192.png",

            data:
                data.data || {}

        };


        event.waitUntil(

            self.registration.showNotification(
                title,
                options
            )

        );

    }
);


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
