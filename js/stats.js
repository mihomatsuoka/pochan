/* ==========================================
   Project ぽちゃん
   stats.js
========================================== */


/* ==========================================
   統計画面
========================================== */

function drawStats(){

    currentPage = "stats";


    app.innerHTML = `

<header class="header">

<h1>📊 統計</h1>

<p>今日のお風呂データ</p>

</header>



<section class="card">

<h2>📜 入浴回数</h2>

<h1>

${getTodayBathCount()}回

</h1>

</section>



<section class="card">

<h2>⌛ 合計入浴時間</h2>

<h1>

${getTotalTime()}

</h1>

</section>



<section class="card">

<h2>⏱ 平均入浴時間</h2>

<h1>

${getAverageTime()}

</h1>

</section>



<section class="card">

<h2>👨‍👩‍👧 家族別利用状況</h2>

${drawFamilyStats()}

</section>



<section class="card">

<h2>📈 直近7日間の入浴時間の推移</h2>

<canvas id="bath-chart"></canvas>

</section>



${drawBottomMenu()}

`;

drawBathChart();

}


/* ==========================================
   今日の日付
========================================== */

function getTodayString(){

    const today = new Date();

    return `${today.getFullYear()}/${String(today.getMonth()+1).padStart(2,"0")}/${String(today.getDate()).padStart(2,"0")}`;

}


/* ==========================================
   今日のrecords取得
========================================== */

function getTodayRecords(){

    const today = getTodayString();


    return state.records.filter(record =>

        record.date === today

    );

}


/* ==========================================
   今日の入浴回数
========================================== */

function getTodayBathCount(){

    return getTodayRecords().length;

}


/* ==========================================
   今日の合計時間
========================================== */

function getTotalTime(){

    const records = getTodayRecords();


    const total = records.reduce(

        (sum,record)=>sum + record.minutes,

        0

    );


    const hour = Math.floor(total / 60);

    const min = total % 60;


    if(hour === 0){

        return `${min}分`;

    }


    return `${hour}時間${min}分`;

}


/* ==========================================
   今日の平均時間
========================================== */

function getAverageTime(){

    const records = getTodayRecords();


    if(records.length === 0){

        return "--";

    }


    const total = records.reduce(

        (sum,record)=>sum + record.minutes,

        0

    );


    return Math.round(

        total / records.length

    ) + "分";

}


/* ==========================================
   今日の最長時間
========================================== */

function getLongestTime(){

    const records = getTodayRecords();


    if(records.length === 0){

        return "--";

    }


    return Math.max(

        ...records.map(record=>record.minutes)

    ) + "分";

}


/* ==========================================
   家族別統計
========================================== */

function drawFamilyStats(){

    const records = getTodayRecords();


    if(records.length === 0){

        return "まだ記録がありません";

    }


    const users = {};


    records.forEach(record=>{

        if(!users[record.name]){

            users[record.name] = [];

        }


        users[record.name].push(

            record.minutes

        );

    });


const familyOrder = [
    "雄一",
    "彰子",
    "美穂",
    "駿佑",
    "知里"
];

return familyOrder
    .filter(name => users[name])
    .map(name => {

        const times = users[name];


        const avg = Math.round(

            times.reduce((a,b)=>a+b,0)

            /

            times.length

        );


        return `
<p>

${name}

<br>

入浴回数：${times.length}回

合計：${times.reduce((a,b)=>a+b,0)}分

平均：${avg}分

</p>
`;

    }).join("");

}


/* ==========================================
   入浴時間グラフ
========================================== */

 function drawBathChart(){

    const canvas = document.getElementById("bath-chart");

    if(!canvas){
        return;
    }

    const ctx = canvas.getContext("2d");


    canvas.width = 300;
    canvas.height = 250;

    canvas.style.width = "300px";
    canvas.style.height = "250px";


    // =========================
    // 過去7日間
    // =========================

    const days = getLast7Days();


    // 記録がない場合

    if(state.records.length === 0){
        return;
    }


    // =========================
    // 入浴したことがある家族を取得
    // =========================

    const names = [

        ...new Set(

            state.records.map(
                record => record.name
            )

        )

    ];


    // =========================
    // 全員分のデータから最大値を求める
    // =========================

    const allValues = [];


    names.forEach(name => {

        days.forEach(day => {

            allValues.push(

                getDailyFamilyTime(
                    day,
                    name
                )

            );

        });

    });


    const rawMax =
        Math.max(...allValues, 10);


    const maxValue =
        Math.ceil(rawMax / 10) * 10;


    // =========================
    // 家族ごとの色
    // =========================

    const colors = [

        "#6B4F3A",
        "#4A7C59",
        "#C47A44",
        "#5B6FA6",
        "#A85C7A"

    ];


    // =========================
    // 家族ごとに線を描く
    // =========================

    names.forEach(name => {


        const values = days.map(day =>

            getDailyFamilyTime(
                day,
                name
            )

        );


        const colorIndex =
            names.indexOf(name);


        ctx.strokeStyle =
            colors[
                colorIndex % colors.length
            ];


        ctx.lineWidth = 2;


        ctx.beginPath();


        values.forEach((value,index) => {


            const x =
                45 + index * 50;


            const y =
                170 -
                (value / maxValue) * 130;


            if(index === 0){

                ctx.moveTo(x,y);

            }else{

                ctx.lineTo(x,y);

            }

        });


        ctx.stroke();


        // 折れ線の各地点に●を描く

        values.forEach((value,index) => {

            const x =
                45 + index * 50;

            const y =
                170 -
                (value / maxValue) * 130;


            ctx.fillStyle =
                colors[
                    colorIndex % colors.length
                ];


            ctx.beginPath();

            ctx.arc(
                x,
                y,
                4,
                0,
                Math.PI * 2
            );

            ctx.fill();

        });

    });


    // =========================
    // 縦軸（入浴時間）＋グリッド線
    // =========================

    const yStep = 5;


    for(
        let value = 0;
        value <= maxValue;
        value += yStep
    ){


        const y =
            170 -
            (value / maxValue) * 130;


        // グリッド線

        ctx.strokeStyle =
            "#E5E5E5";

        ctx.lineWidth = 1;


        ctx.beginPath();


        ctx.moveTo(30,y);

        ctx.lineTo(350,y);


        ctx.stroke();


        // 目盛りの数字

        ctx.fillStyle =
            "#666";


        ctx.font =
            "10px sans-serif";


        ctx.fillText(

            `${value}`,

            5,

            y + 3

        );

    }


    // =========================
    // 横軸（日付）を描く
    // =========================

    days.forEach((day,index) => {


        const x =
            45 + index * 50;


        ctx.fillStyle =
            "#666";


        ctx.font =
            "10px sans-serif";


        const parts =
            day.split("/");


        const label =
            `${Number(parts[1])}/${Number(parts[2])}`;


        ctx.fillText(

            label,

            x - 8,

            185

        );

    });


    // =========================
    // 凡例を描く
    // =========================

    names.forEach((name,index) => {


        const color =
            colors[
                index % colors.length
            ];


        const x =
            30 + index * 80;


        // 色の四角

        ctx.fillStyle =
            color;


        ctx.fillRect(

            x,

            210,

            10,

            10

        );


        // 家族の名前

        ctx.fillStyle =
            "#333";


        ctx.font =
            "12px sans-serif";


        ctx.fillText(

            name,

            x + 15,

            219

        );

    });

}


/* ==========================================
   過去7日間の日付
========================================== */

function getLast7Days(){

    const days = [];


    for(let i = 6; i >= 0; i--){

        const date = new Date();


        date.setDate(

            date.getDate() - i

        );


        const y =
            date.getFullYear();


        const m =
            String(
                date.getMonth() + 1
            ).padStart(2,"0");


        const d =
            String(
                date.getDate()
            ).padStart(2,"0");


        days.push(

            `${y}/${m}/${d}`

        );

    }


    return days;

}


/* ==========================================
   家族・日別の入浴時間
========================================== */

function getDailyFamilyTime(date,name){

    return state.records

        .filter(record =>

            record.date === date &&
            record.name === name

        )

        .reduce(

            (total,record) =>

                total + record.minutes,

            0

        );

}
