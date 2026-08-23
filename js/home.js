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

  <p class="clean-status">
    🧹 掃除：
    <span class="${
        state.bathInfo.cleaned
        ? "cleaned"
        : "not-cleaned"
    }">
        ${
            state.bathInfo.cleaned
            ? "○ 完了"
            : "× 未完了"
        }
    </span>
</p>

<p class="bath-note">
    ※ 毎日0時に未完了に戻ります
</p>

    <button
        class="main-button"
        onclick="toggleBathCleaned()">

        ${
            state.bathInfo.cleaned
            ? "掃除を未完了に戻す"
            : "掃除完了にする"
        }

    </button>

  <p>
    🛁 入浴可能：
    ${
        state.bathInfo.availableTime
        ? state.bathInfo.availableTime + "〜"
        : "未設定"
    }
</p>

<input
    type="time"
    id="available-time"
    value="${state.bathInfo.availableTime}"
>

<button
    class="main-button"
    onclick="setBathAvailableTime()">

    入浴可能時刻を設定

</button>

</section>


<section class="card">

    <h2>🛁 入浴中</h2>

    <div class="current">

        <div class="person">

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

    <h2>📋 本日の入浴状況</h2>

    ${drawTodayBathStatus()}

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

// ==========================================
// 本日の入浴状況
// ==========================================

function drawTodayBathStatus(){

    const today =
　　　　　　　　getTodayString();
       
    return family.map(person => {

        // 今日この人が入浴した記録があるか
        const hasBath =
            state.records.some(
                record =>
                    record.date === today &&
                    record.name === person.name
            );

        return `

        <div class="today-bath-person">

            <span class="today-bath-name">
                ${person.name}
            </span>

            <span class="${
                hasBath
                ? "today-bath-done"
                : "today-bath-notyet"
            }">

                ${
                    hasBath
                    ? "✓ 入浴済み"
                    : "未入浴"
                }

            </span>

        </div>

        `;

    }).join("");

}
