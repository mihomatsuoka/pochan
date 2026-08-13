/* ==========================================
   Project ぽちゃん
   settings.js
========================================== */

/* ==========================================
   設定画面
========================================== */

function drawSettings(){

    currentPage = "settings";

    app.innerHTML = `

<header class="header">

    <h1>⚙️ 設定</h1>

    <p>ぽちゃんの設定</p>

</header>

<section class="card">

    <h2>👤 この端末</h2>

   <p id="current-user">
   </p>

  <p id="current-icon">
   </p>

    <button
        class="main-button"
        onclick="selectUser()">

        利用者を変更

    </button>

　　<button
  
    class="main-button"
    onclick="selectIcon()">

    　🖌️ アイコンを変更 

</button>

</section>

<section class="card">

    <h2>👨‍👩‍👧 家族</h2>

    <p>${family.length}人登録済み</p>

</section>

<section class="card">

    <h2>🗑 データ</h2>

    <button
        class="main-button danger"
        onclick="resetData()">

        データを初期化

    </button>

</section>

${drawBottomMenu()}

`;

    updateCurrentUser();

}


/* ==========================================
   利用者表示
========================================== */
function updateCurrentUser(){

    const area =
        document.getElementById("current-user");

    if(!area){
        return;
    }

    if(currentUser === ""){

        area.textContent = "未設定";

        return;

    }

    const user = family.find(
        person => person.name === currentUser
    );

    if(user){

        area.textContent =
            `${user.name}`;

        const iconArea =
            document.getElementById("current-icon");

        if(iconArea){

            iconArea.textContent =
                `アイコン：${currentIcon}`;

        }

    }else{

        area.textContent = "未設定";

    }

}
  
/* ==========================================
   利用者選択
========================================== */

function selectUser(){

    const members = family.map(person => `

<button
class="member-button"
onclick="setCurrentUser('${person.name}')">

${person.name}

</button>

`).join("");

    document.body.insertAdjacentHTML(

        "beforeend",

        `

<div id="modal">

<div class="sheet">

<h2>

👤 この端末を使う人

</h2>

<p>

この端末の利用者を選択してください

</p>

${members}

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
   利用者設定
========================================== */

function setCurrentUser(name){

    currentUser = name;

    // app.js の関数
    saveCurrentUser();

    closeModal();

    updateCurrentUser();

}


/* ==========================================
   データ初期化
========================================== */

function resetData(){

    const ok = confirm(
        "本当にすべてのデータを初期化しますか？"
    );

    if(!ok){
        return;
    }

    // localStorageを削除
    localStorage.removeItem("pochan-data");

    // 利用者を削除
    localStorage.removeItem("pochan-user");

    // Firebaseを削除
    if(window.firebaseDB){

        const dataRef = window.firebaseRef(
            window.firebaseDB,
            "pochan"
        );

        window.firebaseSet(
            dataRef,
            null
        )
        .then(() => {

            console.log(
                "Firebaseのデータを初期化しました"
            );

            alert("データを初期化しました。");

            location.reload();

        })
        .catch((error) => {

            console.error(
                "Firebase初期化エラー:",
                error
            );

            alert(
                "Firebaseの初期化に失敗しました。"
            );

        });

        return;

    }

    // Firebaseが使えない場合
    alert("データを初期化しました。");

    location.reload();

}

function selectIcon(){

    document.body.insertAdjacentHTML(

        "beforeend",

        `

<div id="modal">

<div class="sheet">

<h2>
🎨 アイコンを変更
</h2>

<p>
好きな絵文字を入力してください
</p>

<input
    id="icon-input"
    type="text"
    value="${currentIcon}"
    maxlength="2"
    placeholder="　"
    style="
        font-size:40px;
        width:80px;
        text-align:center;
        margin:15px auto;
        display:block;
    "
>

<button
class="main-button"
onclick="saveIconInput()">

保存

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

function saveIconInput(){

    const input =
        document.getElementById("icon-input");

    if(!input){
        return;
    }

    const icon =
        input.value.trim();

    if(icon === ""){

        alert("絵文字を入力してください。");

        return;

    }

    currentIcon = icon;

    saveCurrentIcon();

    closeModal();

    updateCurrentUser();

}
