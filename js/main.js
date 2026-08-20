window.addEventListener("load", async () => {

   // Service Workerを登録
    if ("serviceWorker" in navigator) {

        try {

            const registration =
                await navigator.serviceWorker.register(
                    "./service-worker.js"
                );

            console.log(
                "Service Worker 登録OK",
                registration
            );

        } catch (error) {

            console.error(
                "Service Worker 登録失敗:",
                error
            );

        }

    }


    // Firebaseの準備を待つ
    
    if (window.firebaseReady) {
        await window.firebaseReady;
    }

    // データ読み込み
    loadData();

    //通知監視開始
  //  startNotificationListener();

    // 混雑状況更新
    updateCrowded();

    // ローディング画面
    showSplash();

});

//taima-
setInterval(() => {

    if(currentPage === "home"){

        const timer =
            document.querySelector(".timer");

        if(timer){

            timer.textContent =
                "⏱ " + getBathTime();

        }

    }

}, 1000);

