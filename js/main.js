window.addEventListener("load", async () => {

    // Firebaseの準備を待つ
    if (window.firebaseReady) {
        await window.firebaseReady;
    }

    // データ読み込み
    loadData();

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

