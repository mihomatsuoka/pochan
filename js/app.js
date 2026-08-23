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
// 通知用：前回の待機順位
let previousQueuePosition = 0;

let notifiedAsFirst = false;

let longBathNotified = false;

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
    crowded: "🟢 空いています",

   notification: {
    enabled: true,
    longBathMinutes: 30
},
 bathInfo: {
    cleaned: false,
    availableTime: "",
    date: ""
}

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

            //通常の通知チェック
         //    checkQueueNotification();
            // 入浴開始通知
　　　　　  　  // checkBathStartNotification();
// Firebase更新前の自分の順位を保存
let oldPosition = 0;

if(currentUser !== ""){

    const oldIndex =
        state.queue.findIndex(
            person => person.name === currentUser
        );

    if(oldIndex !== -1){

        oldPosition = oldIndex + 1;

    }

}


// Firebaseのデータを読み込む
Object.assign(
    state,
    firebaseData
);

console.log(
    "Firebase更新後の現在:",
    state.current
);

console.log(
    "Firebase更新後の待機列:",
    state.queue
);
               
// 本日の湯の情報を確認
if(
    !state.bathInfo ||
    typeof state.bathInfo !== "object"
){

    state.bathInfo = {
        cleaned: false,
        availableTime: ""
    };

}

if(
    !state.notification ||
    typeof state.notification !== "object"
){

    state.notification = {
        enabled: true,
        longBathMinutes: 30
    };

}

if(
    state.notification.longBathMinutes === undefined
){

    state.notification.longBathMinutes = 30;

}


               
console.log(
    "本日の湯情報:",
    state.bathInfo
);
               
console.log(
    "通知チェック",
    "利用者:", currentUser,
    "待機列:", state.queue
);               


// Firebase更新後の自分の順位
let newPosition = 0;

if(currentUser !== ""){

    const newIndex =
        state.queue.findIndex(
            person => person.name === currentUser
        );

    if(newIndex !== -1){

        newPosition = newIndex + 1;

    }

}

console.log(
    "順位チェック",
    "前:", oldPosition,
    "後:", newPosition
);
// 2番目 → 1番目になった瞬間
if(
    oldPosition === 2 &&
    newPosition === 1
){

    if(
        state.notification &&
        state.notification.enabled &&
        "Notification" in window &&
        Notification.permission === "granted"
    ){

        new Notification(
            "♨️ ぽちゃんからのお知らせ",
            {
                body:
                    "もうすぐお風呂です！"
            }
        );

    }

}


// localStorageにも同期
localStorage.setItem(
    "pochan-data",
    JSON.stringify(state)
);


updateCrowded();


// 通常の通知チェック
//checkQueueNotification();
// 入浴開始通知
　checkBathStartNotification();

           if(currentPage === "home"){

    drawHome();

}

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
   今日の日付
========================================== */

function getTodayString(){

    const d = new Date();

    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");

    return `${y}/${m}/${day}`;

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

    // 誰かが入浴中
    if(state.current.status === "入浴中"){

        if(count >= 3){

            state.crowded = "🔴 混雑中！";

        }else{

            state.crowded = "🟡 ちょっと待ってね";

        }

    }

    // 誰も入浴していない
    else{

        if(count === 0){

            state.crowded = "🟢 空いています";

        }

        else if(count <= 2){

            state.crowded = "🟡 ちょっと待ってね";

        }

        else{

            state.crowded = "🔴 混雑中！";

        }

    }

}

/* ==========================================
   待機列通知
========================================== */

function checkQueueNotification(){

    // 通知設定がOFFなら何もしない
    if(
        !state.notification ||
        !state.notification.enabled
    ){

        return;

    }


    // 通知が利用できない
    if(
        !("Notification" in window) ||
        Notification.permission !== "granted"
    ){

        return;

    }


    // 利用者未設定
    if(currentUser === ""){

        return;

    }


    // 待機列から自分を探す
    const position =
        state.queue.findIndex(
            person => person.name === currentUser
        );


    // 待機列にいない
    if(position === -1){

        previousQueuePosition = 0;
        notifiedAsFirst = false;

        return;

    }


    // 順位は0から始まるので +1
    const currentPosition =
        position + 1;


    // ==========================================
    // 1番目になった瞬間
    // ==========================================

    if(
        currentPosition === 1 &&
        previousQueuePosition !== 1 &&
        !notifiedAsFirst
    ){

        // お風呂が空いている
        if(state.current.status === "空き"){

            new Notification(
                "♨️ ぽちゃんの時間です！",
                {
                    body:
                        "お風呂の順番になりました。"
                }
            );

            notifiedAsFirst = true;

        }

    }


    // 今回の順位を保存
    previousQueuePosition =
        currentPosition;

}

/* ==========================================
   長風呂通知
========================================== */

function checkLongBathNotification(){

    // 通知設定がOFFなら終了
    if(
        !state.notification ||
        !state.notification.enabled
    ){
        return;
    }


    // 入浴中ではない
    if(state.current.status !== "入浴中"){

        longBathNotified = false;

        return;

    }


    // 次の人が待っていない
    if(state.queue.length === 0){

        longBathNotified = false;

        return;

    }


    // 入浴時間を計算
    const bathMinutes =
        Math.floor(
            (Date.now() - state.current.start) / 60000
        );


    // 指定時間未満なら何もしない
    if(
        bathMinutes <
        state.notification.longBathMinutes
    ){

        return;

    }


    // すでに通知済みなら何もしない
    if(longBathNotified){

        return;

    }


    // 通知が許可されているか
    if(
        !("Notification" in window) ||
        Notification.permission !== "granted"
    ){

        return;

    }


    // 長風呂通知
    new Notification(
        "♨️ ぽちゃんからのお知らせ",
        {
            body:
                `${state.current.name}さん、そろそろお風呂を交代してね！`
        }
    );


    // 1回通知したら再通知しない
    longBathNotified = true;

}

　setInterval(
    checkLongBathNotification,
    30000
); 

/* ==========================================
   掃除状態切り替え
========================================== */

function toggleBathCleaned(){

    state.bathInfo.cleaned =
        !state.bathInfo.cleaned;

    saveData();

    drawHome();

}

/* ==========================================
   本日の湯の日付チェック
========================================== */

function checkBathInfoDate(){

    const today =
        new Date().toLocaleDateString("ja-JP");

    // 日付が変わっていたらリセット
    if(state.bathInfo.date !== today){

        state.bathInfo = {

            cleaned: false,

            availableTime: "",

            date: today

        };

        saveData();

        console.log(
            "日付が変わったため、本日の湯をリセットしました"
        );

    }

}

checkBathInfoDate();

setInterval(
    checkBathInfoDate,
    60000
);

/* ==========================================
   入浴可能時刻設定
========================================== */

function setBathAvailableTime(){

    const input =
        document.getElementById("available-time");

    if(!input){

        return;

    }

    if(input.value === ""){

        alert("入浴可能時刻を選択してください。");

        return;

    }

    state.bathInfo.availableTime =
        input.value;

    saveData();

    drawHome();

}

/* ==========================================
   入浴開始通知用
========================================== */

let previousBathName = "";

/* ==========================================
   入浴開始通知チェック
========================================== */

function checkBathStartNotification(){

    console.log(
        "★ 入浴開始通知チェック実行",
        "現在:",
        state.current.name,
        "前回:",
        previousBathName
    );


    // 現在の入浴者
    const currentBathName =
        state.current.name;


    // ==========================================
    // 前回と今回が同じなら何もしない
    // ==========================================

    if(
        previousBathName === currentBathName
    ){

        return;

    }


    // ==========================================
    // 今回の状態を保存
    // ==========================================

    const oldBathName =
        previousBathName;

    previousBathName =
        currentBathName;


    console.log(
        "★ 入浴者が変化",
        "前:",
        oldBathName,
        "後:",
        currentBathName
    );


    // ==========================================
    // 「誰もいません」→「誰かが入浴中」
    // の変化だけを通知対象にする
    // ==========================================

    if(
        oldBathName !== "誰もいません" ||
        state.current.status !== "入浴中"
    ){

        return;

    }


    // ==========================================
    // 通知状態チェック
    // ==========================================

    console.log(
        "★ 通知状態チェック",
        "Notification:",
        "Notification" in window,
        "permission:",
        "Notification" in window
            ? Notification.permission
            : "未対応"
    );


    if(
        !("Notification" in window) ||
        Notification.permission !== "granted"
    ){

        console.log(
            "★ 通知できません"
        );

        return;

    }


    // ==========================================
    // 本日の入浴済み状況
    // ==========================================

    const todayBathNames =
        getTodayBathNames();


    // ==========================================
    // 本日まだ入浴していない家族
    // ==========================================

    const notBathNames =
        family
            .map(
                person =>
                    person.name
            )
            .filter(
                name =>
                    !todayBathNames.includes(name)
            )
            .filter(
                name =>
                    name !== currentBathName
            );


    // ==========================================
    // 通知内容
    // ==========================================

    let notificationBody =
        `${currentBathName}が入浴しました`;


    if(notBathNames.length > 0){

        notificationBody +=
            `。あと入っていないのは${notBathNames.join("・")}です`;

    }


    console.log(
        "★ 入浴開始通知を送信:",
        notificationBody
    );


    // ==========================================
    // 通知
    // ==========================================

    new Notification(
        "♨️ ぽちゃんからのお知らせ",
        {
            body:
                notificationBody
        }
    );

}

/* ==========================================
   本日の入浴済み判定
========================================== */

function getTodayBathNames(){

    const today =
        new Date().toLocaleDateString("ja-JP");


    return state.records
        .filter(
            record =>
                record.date === today
        )
        .map(
            record =>
                record.name
        );

}
