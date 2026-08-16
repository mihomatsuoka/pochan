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

    <!-- 混雑状況 -->
    <p>${state.crowded}</p>

    <!-- 掃除状況 -->
    <p>
        🧹 掃除：
        ${
            state.bathInfo.cleaned
            ? "○ 完了"
            : "× 未完了"
        }
    </p>

    <!-- 入浴可能時刻 -->
    <p>
        🛁 入浴可能：
        ${
            state.bathInfo.availableTime
            ? state.bathInfo.availableTime + "〜"
            : "未設定"
        }
    </p>

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

    // ==========================================
    // 自分が入浴中
    // ==========================================

    if(state.current.name === currentUser){

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


    // ==========================================
    // 自分が待機列にいるか
    // ==========================================

    const isWaiting =
        state.queue.some(
            person => person.name === currentUser
        );


    // ==========================================
    // 待機列にいない
    // ==========================================

    if(!isWaiting){

        return `

        <div class="button-group">

            <button
                class="main-button"
                onclick="joinQueue()">

                ➕ 順番待ち

            </button>

        </div>

        `;

    }


    // ==========================================
    // 待機列にいる
    // ==========================================

    const isFirst =
        state.queue.length > 0 &&
        state.queue[0].name === currentUser;


    // お風呂が空いていて自分が先頭なら
    if(
        state.current.status === "空き" &&
        isFirst
    ){

        return `

        <div class="button-group">

            <button
                class="main-button secondary"
                onclick="startBath()">

                ♨ 入浴開始

            </button>

        </div>

        `;

    }


    // 待機中だがまだ順番ではない
    return `

    <div class="button-group">

        <p>
            🪵 現在 ${state.queue.findIndex(
                person => person.name === currentUser
            ) + 1} 番目です
        </p>

    </div>

    `;

}
