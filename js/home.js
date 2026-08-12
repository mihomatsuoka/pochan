/* ==========================================
   Project ぽちゃん
   home.js
   ホーム画面
========================================== */
function drawHome(){

    currentPage = "home";

    app.innerHTML = `

<header class="header">

    <h1>ぽちゃん</h1>

    <p>毎日のお風呂を、少し快適に。</p>

</header>


<section class="today">

    <h2>♨ 本日の湯</h2>

    <p>${state.crowded}</p>

</section>

<section class="card">

    <h2>🛁 入浴中</h2>

    <div class="current">

        <div class="person">

            ${state.current.icon}
            ${state.current.name}

        </div>

        <div class="status">

            ${state.current.status}

        </div>

    </div>

    <p class="timer">

        ⏱ ${getBathTime()}

    </p>

</section>

<section class="card">

    <h2>🪵 待機中</h2>

    <ul class="queue">

        ${drawQueue()}

    </ul>

</section>

<section class="card">

    <h2>📜 本日の記録</h2>

    ${drawHistory()}

</section>　

    ${drawButtons()}


    ${drawBottomMenu()}

`;

}

/* ==========================================
   下メニュー
========================================== */

function drawBottomMenu(){

    return `

<nav class="bottom-menu">

<button onclick="drawHome()">

<span>🏠</span>

<small>ホーム</small>

</button>

<button onclick="drawStats()">

<span>📊</span>

<small>統計</small>

</button>

<button onclick="drawHistoryPage()">

<span>📜</span>

<small>履歴</small>

</button>

<button onclick="drawSettings()">

<span>⚙️</span>

<small>設定</small>

</button>

</nav>

`;

}
/* ==========================================
   ボタン表示
========================================== */


function drawButtons(){

    // お風呂が空いている
 if(state.current.status === "空き"){

    // 待機列の先頭がこの端末の利用者か
    const isFirst =
        state.queue.length > 0 &&
        state.queue[0].name === currentUser;

    return `

<div class="button-group">

    <button
        class="main-button"
        onclick="joinQueue()">

        ➕ 順番待ち

    </button>

    ${
        isFirst
        ? `
        <button
            class="main-button secondary"
            onclick="startBath()">

            ♨ 入浴開始

        </button>
        `
        : ""
    }

</div>

`;
}

    // 入浴中
    return `

<div class="button-group">

    <button
        class="main-button danger"
        onclick="finishBath()">

        🚪 入浴終了

    </button>

</div>

`;

}
