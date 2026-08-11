/* ==========================================
   Project ぽちゃん
   splash.js
========================================== */

function showSplash(){

    app.innerHTML = `

<div id="splash">

 <div class="drop">
    💧
</div>

<div class="water"></div>

    <div class="logo">

        ぽちゃん

    </div>

    <p class="loading">

        湯をためています...

    </p>

</div>

`;

    setTimeout(() => {

        drawHome();

    }, 3000);

}
