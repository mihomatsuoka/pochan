/* ==========================================
   Project ぽちゃん
   history.js
========================================== */


/* ==========================================
   ホーム画面用（最新5件）
========================================== */

function drawHistory(){

    if(state.history.length === 0){

        return `

<div class="history-item">

まだ履歴はありません

</div>

`;

    }

    return state.history
        .slice(0,5)
        .map(item => `

<div class="history-item">

${item}

</div>

`).join("");

}


/* ==========================================
   履歴画面
========================================== */

function drawHistoryPage(){

    currentPage = "history";

    app.innerHTML = `

<header class="header">

    <h1>📜 履歴</h1>

    <p>入浴履歴一覧</p>

</header>

<section class="card">

    <h2>最近の履歴</h2>

    ${drawAllHistory()}

</section>

${drawBottomMenu()}

`;

}


/* ==========================================
   全履歴表示
========================================== */

function drawAllHistory(){

    if(state.history.length === 0){

        return `

<div class="history-item">

履歴はありません

</div>

`;

    }

    return state.history
        .map(item => `

<div class="history-item">

${item}

</div>

`).join("");

}


/* ==========================================
   履歴追加
========================================== */

function addHistory(text){

    state.history.unshift(

        now() + "　" + text

    );


}
