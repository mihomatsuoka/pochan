/* ==========================================
   Project ぽちゃん
   queue.js
========================================== */


/* ==========================================
   待機列表示
========================================== */

function drawQueue(){

    if(state.queue.length === 0){

        return `

<li>
待っている人はいません
</li>

`;

    }


    return state.queue.map((person,index)=>`

<li>

<div>

${person.icon}
${person.name}

</div>


<div class="queue-number">

${index + 1}

</div>


</li>

`).join("");

}



/* ==========================================
   順番待ち
========================================== */

function joinQueue(){


    // 利用者未設定
    if(currentUser === ""){

        alert("設定画面で利用者を設定してください。");

        drawSettings();

        return;

    }



    // 家族情報取得
    const user = family.find(

        person => person.name === currentUser

    );



    // 入浴中チェック
    if(state.current.name === user.name){

        alert("現在入浴中です");

        return;

    }



    // 待機中チェック
    const exists = state.queue.find(

        person => person.name === user.name

    );



    if(exists){

        alert("すでに待機しています");

        return;

    }



    document.body.insertAdjacentHTML(

        "beforeend",

`

<div id="modal">

<div class="sheet">


<h2>

♨ 順番待ち

</h2>


<p>

${user.icon} ${user.name} を
待機列へ追加しますか？

</p>



<button
class="main-button"
onclick="addQueue()">

追加する

</button>



<button
class="close-button"
onclick="closeModal()">

キャンセル

</button>


</div>

</div>

`

    );

}



/* ==========================================
   モーダルを閉じる
========================================== */

function closeModal(){


    const modal = document.getElementById("modal");


    if(modal){

        modal.remove();

    }


}



/* ==========================================
   順番待ち追加
========================================== */

function addQueue(){


    const user = family.find(

        person => person.name === currentUser

    );



    state.queue.push({

        name:user.name,

        icon:user.icon

    });



    updateCrowded();

    saveData();

    closeModal();

    drawHome();


}



/* ==========================================
   入浴開始
========================================== */

function startBath(){


    if(state.current.status !== "空き"){

        alert("現在入浴中です");

        return;

    }



    if(state.queue.length === 0){

        alert("待機中の人がいません");

        return;

    }



    const next = state.queue.shift();



    state.current = {

        name:next.name,

        icon:next.icon,

        status:"入浴中",

        start:new Date()

    };
   console.log("入浴開始直後:", state.current);



    addHistory(

        next.name + " が入浴しました"

    );



    updateCrowded();

    saveData();

    drawHome();


}



/* ==========================================
   入浴終了
========================================== */

function finishBath(){

    if(state.current.status === "空き"){

        return;

    }


    // 入浴時間を計算
    const bathTime = Math.floor(

        (Date.now() - state.current.start) / 60000

    );


    // 名前を先に保存
    const bathName = state.current.name;


    // 履歴に追加
    addHistory(

        `${bathName} が退出しました（${bathTime}分）`

    );


    // 統計用データ
    // recordsが存在しない場合も作成する
    if(!Array.isArray(state.records)){

        state.records = [];

    }


    state.records.push({

　　　　date: getTodayString(),

        name: bathName,

        minutes: bathTime

    });


    // 空き状態に戻す
    state.current = {

        name: "誰もいません",

        icon: "🛁",

        status: "空き",

        start: null

    };


    // 混雑状況を更新
    updateCrowded();


    // データ保存
    saveData();


    // ホーム画面を更新
    drawHome();

}
