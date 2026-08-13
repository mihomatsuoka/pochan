/* ==========================================
   Project ぽちゃん
   app.js
   アプリ全体の管理
========================================== */

// アプリ本体
const app = document.getElementById("app");

// 現在表示中の画面
let currentPage = "splash";

// この端末の利用者
let currentUser = localStorage.getItem("pochan-user") || "";
// アイコン
let currentIcon = localStorage.getItem("pochan-icon") || "";

/* ==========================================
   アプリの状態
========================================== */

const state = {

    // 現在入浴中
    current: {

        name: "誰もいません",

        icon: "🛁",

        status: "空き",

        start: null

    },

    // 待機列
    queue: [],

    // 履歴
    history: [],

    // 統計用データ
　　records: [],

    // 混雑状況
    crowded: "🟢 空いています"

};

/* ==========================================
   家族一覧
========================================== */
const family = [

{ id:1, name:"雄一"},

{ id:2, name:"彰子"},

{ id:3, name:"美穂"},

{ id:4, name:"駿佑"},

{ id:5, name:"知里"}

];

/* ==========================================
   保存
========================================== */

function saveData(){

    // 今まで通りlocalStorageにも保存
    localStorage.setItem(
        "pochan-data",
        JSON.stringify(state)
    );

    // Firebaseにも保存
    if(window.firebaseDB){

        const dataRef =
            window.firebaseRef(
                window.firebaseDB,
                "pochan"
            );

        window.firebaseSet(
            dataRef,
            state
        );

        console.log("Firebaseに保存しました");

    }

}
/* ==========================================
   利用者保存
========================================== */

function saveCurrentUser(){

    localStorage.setItem(

        "pochan-user",

        currentUser

    );

}
// アイコン保存

function saveCurrentIcon(){

    localStorage.setItem(
        "pochan-icon",
        currentIcon
    );

}

/* ==========================================
   読み込み
========================================== */

function loadData(){

    // Firebaseから読み込む
    if(window.firebaseDB){

        const dataRef =
            window.firebaseRef(
                window.firebaseDB,
                "pochan"
            );

        window.firebaseOnValue(
            dataRef,
            (snapshot) => {

                const firebaseData =
                    snapshot.val();

                // Firebaseにデータがない場合
                if(!firebaseData){

                    state.current = {
                        name: "誰もいません",
                        icon: "🛁",
                        status: "空き",
                        start: null
                    };

                    state.queue = [];
                    state.history = [];
                    state.records = [];
                    state.crowded = "🟢 空いています";

                    localStorage.removeItem(
                        "pochan-data"
                    );

                    console.log(
                        "Firebaseにデータがないため初期状態にしました"
                    );

                    updateCrowded();
                    //drawHome();

                    return;
                }

                // Firebaseのデータを読み込む
                Object.assign(
                    state,
                    firebaseData
                );

                // localStorageにも同期
                localStorage.setItem(
                    "pochan-data",
                    JSON.stringify(state)
                );

                console.log(
                    "Firebaseからデータを読み込みました"
                );

                updateCrowded();
               // drawHome();

            }
        );

        return;
    }


    // Firebaseが使えない場合だけ
    // localStorageから読み込む

    const data =
        localStorage.getItem(
            "pochan-data"
        );

    if(!data){

        return;

    }

    const obj =
        JSON.parse(data);

    Object.assign(
        state,
        obj
    );

  

}
/* ==========================================
   現在時刻
========================================== */

function now(){

    const d = new Date();

    const y = d.getFullYear();
    const m = String(d.getMonth()+1).padStart(2,"0");
    const day = String(d.getDate()).padStart(2,"0");

    const h = String(d.getHours()).padStart(2,"0");
    const min = String(d.getMinutes()).padStart(2,"0");

    return `${y}/${m}/${day} ${h}:${min}`;

}

/* ==========================================
   入浴時間
========================================== */

function getBathTime(){

    if(
        state.current.status === "空き" ||
        state.current.start === null
    ){

        return "--";

    }

   const diff = Math.floor(
    (Date.now() - state.current.start) / 60000
);
    if(isNaN(diff)){

        return "--";

    }

    return diff + "分";

}
/* ==========================================
   混雑状況
========================================== */

function updateCrowded(){

    const count = state.queue.length;

    if(count===0){

        state.crowded="🟢 空いています";

    }

    else if(count<=2){

        state.crowded="🟡 ちょっと待ってね";

    }

    else{

        state.crowded="🔴 混雑中！";

    }

}

/* ==========================================
   待機列の先頭通知
========================================== */

function checkQueueNotification(){

    // 通知が許可されていない場合
    if(
        !("Notification" in window) ||
        Notification.permission !== "granted"
    ){

        return;

    }

    // 利用者が設定されていない場合
    if(currentUser === ""){

        return;

    }

    // 待機列に誰もいない場合
    if(state.queue.length === 0){

        return;

    }

    // 先頭の人
    const first = state.queue[0];

    // 自分が先頭なら通知
    if(first.name === currentUser){

        new Notification(
            "♨ ぽちゃん",
            {
                body: "もうすぐお風呂です！"
            }
        );

    }

}
