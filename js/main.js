/* ==========================================
   Project ぽちゃん
   main.js
========================================== */

window.addEventListener("load", () => {

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

        drawHome();

    }

},1000);
