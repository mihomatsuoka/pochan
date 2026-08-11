/* ==========================================
   Project ぽちゃん Ver.3
========================================== */

const app = document.getElementById("app");

/*==========================================
  データ
==========================================*/

const state = {

    current:{

        name:"父",

        icon:"👨",

        status:"入浴中",

        start:new Date()

    },
    /*==========================================
  保存
==========================================*/

function saveData(){

    localStorage.setItem(

        "pochan-data",

        JSON.stringify(state)

    );

}


/*==========================================
  読み込み
==========================================*/

function loadData(){

    const data = localStorage.getItem("pochan-data");

    if(!data){

        return;

    }

    const obj = JSON.parse(data);

    Object.assign(state,obj);

    if(state.current.start){

        state.current.start = new Date(state.current.start);

    }

}

    queue:[

        {
            name:"母",
            icon:"👩"
        },

        {
            name:"私",
            icon:"🧑"
        }

    ],

    history:[

        "19:15　父が入浴しました",

        "18:52　弟が退出しました",

        "18:30　母が入浴しました"

    ],

    crowded:"空いています"

};


/*==========================================
  入浴時間
==========================================*/

function getBathTime(){

    const diff = Math.floor(

        (Date.now()-state.current.start)/60000

    );

    return diff;

}

/*==========================================
  ホーム画面
==========================================*/

function drawHome(){

    app.innerHTML=`

<header class="header">

<h1>ぽちゃん</h1>

<p>毎日のお風呂を、少し快適に。</p>

</header>


<section class="today">

<h2>♨ 本日の湯</h2>

<p>${state.crowded}</p>

</section>



<section class="card">

<h2>♨ ご入浴中</h2>

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

⏱ ${getBathTime()}分

</p>

${
getBathTime()>=30

?

`<p class="warning">

♨ 長風呂です

</p>`

:

""

}

</section>



<section class="card">

<h2>🪵 お待ちの方</h2>

<ul class="queue">

${drawQueue()}

</ul>

</section>



<section class="card">

<h2>📜 本日の記録</h2>

${drawHistory()}

</section>



<div class="button-group">

<button

class="main-button"

onclick="joinQueue()">

＋ 順番待ち

</button>

<button

class="main-button secondary"

onclick="startBath()">

♨ 入浴開始

</button>

<button

class="main-button danger"

onclick="finishBath()">

🚪 入浴終了

</button>

</div>


${bottomMenu()}

`;

}


/*==========================================
  待機列
==========================================*/

function drawQueue(){

    return state.queue.map((person,index)=>`

<li>

<div>

${person.icon}

${person.name}

</div>

<div class="queue-number">

${index+1}

</div>

</li>

`).join("");

}


/*==========================================
  履歴
==========================================*/

function drawHistory(){

    return state.history.map(item=>`

<div class="history-item">

${item}

</div>

`).join("");

}


/*==========================================
  下メニュー
==========================================*/

function bottomMenu(){

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

<button onclick="drawSetting()">

<span>⚙️</span>

<small>設定</small>

</button>

</nav>

`;

}
/*==========================================
  家族一覧
==========================================*/

const family = [

    {name:"父",icon:"👨"},
    {name:"母",icon:"👩"},
    {name:"私",icon:"🧑"},
    {name:"弟",icon:"👦"}

];


/*==========================================
  順番待ち画面
==========================================*/

function joinQueue(){

    const list = family.map(person=>`

<button class="member-button"

onclick="addQueue('${person.name}','${person.icon}')">

${person.icon}

${person.name}

</button>

`).join("");


    document.body.insertAdjacentHTML(

        "beforeend",

        `

<div id="modal">

<div class="sheet">

<h2>♨ 順番待ち</h2>

<p>誰が並びますか？</p>

${list}

<button
class="close-button"
onclick="closeModal()">

閉じる

</button>

</div>

</div>

`

    );

}


/*==========================================
  閉じる
==========================================*/

function closeModal(){

    document.getElementById("modal").remove();

}


/*==========================================
  追加
==========================================*/

function addQueue(name,icon){

    const exist = state.queue.find(

        p=>p.name===name

    );

    if(exist){

        alert("すでに並んでいます");

        return;

    }

    state.queue.push({

        name:name,

        icon:icon

    });

    closeModal();

    drawHome();

}
/*==========================================
  入浴開始
==========================================*/

function startBath(){

    if(state.queue.length === 0){

        alert("待機中の人はいません");

        return;

    }

    const next = state.queue.shift();

    state.current = {

        name: next.name,

        icon: next.icon,

        status: "入浴中",

        start: new Date()

    };

    updateCrowded();

    saveData();

    drawHome();

}



/*==========================================
  入浴終了
==========================================*/

function finishBath(){

    state.history.unshift(

        now()+"　"+state.current.name+" が退出しました"

    );

    if(state.queue.length>0){

        startBath();

        return;

    }

    state.current = {

        name:"誰もいません",

        icon:"🛁",

        status:"空き",

        start:new Date()

    };

    updateCrowded();

    drawHome();

}


/*==========================================
  時刻
==========================================*/

function now(){

    const d=new Date();

    return d.toLocaleTimeString(

        "ja-JP",

        {

            hour:"2-digit",

            minute:"2-digit"

        }

    );

}


/*==========================================
  混雑
==========================================*/

function updateCrowded(){

    const n=state.queue.length;

    if(n===0){

        state.crowded="🟢 空いています";

    }

    else if(n<=2){

        state.crowded="🟡 やや混雑";

    }

    else{

        state.crowded="🔴 混雑中";

    }

}
