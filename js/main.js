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


// 1秒ごとにタイマー更新
setInterval(() => {

    if(currentPage === "home"){

      //  drawHome();

    }

}, 1000);
