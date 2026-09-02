// ==============================
// 要素取得
// ==============================

const birthdayList =
    document.getElementById("birthday-list");

const form =
    document.getElementById("birthday-form");

const nameInput =
    document.getElementById("name");

const monthInput =
    document.getElementById("month");

const dayInput =
    document.getElementById("day");

const nameError =
    document.getElementById("name-error");

const monthError =
    document.getElementById("month-error");

const dayError =
    document.getElementById("day-error");

const submitButton =
    document.getElementById("submit-button");

const highlightTitle =
    document.getElementById("highlight-title");

const highlightContent =
    document.getElementById("highlight-content");

let countdownTimer = null;

let birthdays = [];


// ==============================
// 誕生日データ読み込み
// ==============================

fetch("birthday.json?time=" + Date.now())

    .then(response => {

        if (!response.ok) {

            throw new Error(
                "誕生日データを読み込めませんでした。"
            );

        }

        return response.json();

    })

    .then(data => {

        birthdays = data;

        displayBirthdayHighlight();

        displayBirthdays();

    })

    .catch(error => {

        console.error(error);

        birthdayList.innerHTML =
            "<p>誕生日データを読み込めませんでした。</p>";

    });

// ==============================
// 今日・次の誕生日表示
// ==============================

function displayBirthdayHighlight() {

    // 既存のカウントダウンを停止
    if (countdownTimer) {

        clearInterval(countdownTimer);

        countdownTimer = null;

    }


    const now = new Date();

    const currentMonth =
        now.getMonth() + 1;

    const currentDay =
        now.getDate();


    // ==============================
    // 今日の誕生日を検索
    // ==============================

    const todayBirthdays =
        birthdays.filter(person =>

            Number(person.month) === currentMonth &&
            Number(person.day) === currentDay

        );


    // ==============================
    // 今日の誕生日がいる場合
    // ==============================

    if (todayBirthdays.length > 0) {

        highlightTitle.textContent =
            "🎉 今日の誕生日";


        highlightContent.innerHTML = "";


        todayBirthdays.forEach(person => {

            const name =
                document.createElement("p");

            name.className =
                "today-birthday-name";

            name.textContent =
                `🎂 ${person.name}`;


            highlightContent.appendChild(name);

        });


        const message =
            document.createElement("p");

        message.className =
            "birthday-message";

        message.textContent =
            "🎉 お誕生日おめでとうございます！";


        highlightContent.appendChild(message);


        return;

    }


    // ==============================
    // 今日の誕生日がいない場合
    // ==============================

    const nextBirthday =
        getNextBirthday();


    // 誕生日データがない場合

    if (!nextBirthday) {

        highlightTitle.textContent =
            "🎂 次の誕生日";

        highlightContent.innerHTML =
            "<p>登録されている誕生日はありません。</p>";

        return;

    }


    highlightTitle.textContent =
        "🎂 次の誕生日";


    highlightContent.innerHTML = "";


    // ==============================
    // 次の誕生日の日付
    // ==============================

    const dateText =
        document.createElement("p");

    dateText.className =
        "next-birthday-date";

    dateText.textContent =
        `${nextBirthday.month}月${nextBirthday.day}日`;


    highlightContent.appendChild(dateText);


    // ==============================
    // 名前
    // ==============================

    nextBirthday.people.forEach(person => {

        const name =
            document.createElement("p");

        name.className =
            "next-birthday-name";

        name.textContent =
            `🎂 ${person.name}`;


        highlightContent.appendChild(name);

    });


    // ==============================
    // カウントダウン
    // ==============================

    const countdown =
        document.createElement("p");

    countdown.className =
        "birthday-countdown";


    highlightContent.appendChild(
        countdown
    );


    updateCountdown(
        countdown,
        nextBirthday.month,
        nextBirthday.day
    );


    // 1秒ごとに更新

    countdownTimer =
        setInterval(() => {

            updateCountdown(
                countdown,
                nextBirthday.month,
                nextBirthday.day
            );

        }, 1000);

}


// ==============================
// 次の誕生日を取得
// ==============================

function getNextBirthday() {

    const now = new Date();

    const currentYear =
        now.getFullYear();


    const today =
        new Date(
            currentYear,
            now.getMonth(),
            now.getDate()
        );


    const upcoming = [];


    birthdays.forEach(person => {

        let birthday =
            new Date(
                currentYear,
                Number(person.month) - 1,
                Number(person.day)
            );


        // 今年の誕生日が今日より前なら
        // 来年の誕生日にする

        if (birthday < today) {

            birthday =
                new Date(
                    currentYear + 1,
                    Number(person.month) - 1,
                    Number(person.day)
                );

        }


        upcoming.push({

            person: person,

            date: birthday

        });

    });


    if (upcoming.length === 0) {

        return null;

    }


    // 日付順

    upcoming.sort(
        (a, b) =>
            a.date - b.date
    );


    const firstDate =
        upcoming[0].date;


    // 同じ誕生日の人をまとめる

    const people =
        upcoming
            .filter(item =>
                item.date.getTime() ===
                firstDate.getTime()
            )
            .map(item => item.person);


    return {

        month:
            people[0].month,

        day:
            people[0].day,

        people:
            people

    };

}


// ==============================
// カウントダウン更新
// ==============================

function updateCountdown(
    element,
    month,
    day
) {

    const now = new Date();

    let target =
        new Date(
            now.getFullYear(),
            Number(month) - 1,
            Number(day),
            0,
            0,
            0
        );


    // 今年の誕生日が過ぎている場合
    if (target <= now) {

        target =
            new Date(
                now.getFullYear() + 1,
                Number(month) - 1,
                Number(day),
                0,
                0,
                0
            );

    }


    const difference =
        target - now;


    // 0になった場合

    if (difference <= 0) {

        element.textContent =
            "🎉 まもなく誕生日！";

        return;

    }


    const totalSeconds =
        Math.floor(
            difference / 1000
        );


    const days =
        Math.floor(
            totalSeconds / 86400
        );


    const hours =
        Math.floor(
            (totalSeconds % 86400) / 3600
        );


    const minutes =
        Math.floor(
            (totalSeconds % 3600) / 60
        );


    const seconds =
        totalSeconds % 60;


    element.innerHTML = `

        🎉 あと

        <span class="countdown-number">
            ${days}
        </span>
        日

        <span class="countdown-number">
            ${String(hours).padStart(2, "0")}
        </span>
        時間

        <span class="countdown-number">
            ${String(minutes).padStart(2, "0")}
        </span>
        分

        <span class="countdown-number">
            ${String(seconds).padStart(2, "0")}
        </span>
        秒

    `;

}

// ==============================
// 誕生日一覧表示
// ==============================

function displayBirthdays() {

    birthdayList.innerHTML = "";


    // データがない場合

    if (birthdays.length === 0) {

        birthdayList.innerHTML =
            "<p>登録されている誕生日はありません。</p>";

        return;

    }


    // ==============================
    // 月ごとに分類
    // ==============================

    const monthlyBirthdays = {};


    birthdays.forEach(person => {

        if (!monthlyBirthdays[person.month]) {

            monthlyBirthdays[person.month] = [];

        }

        monthlyBirthdays[person.month].push(person);

    });


    // ==============================
    // 1月～12月
    // ==============================

    for (
        let month = 1;
        month <= 12;
        month++
    ) {

        const people =
            monthlyBirthdays[month] || [];


        // 誕生日がない月は表示しない

        if (people.length === 0) {

            continue;

        }


        // ==============================
        // 日付順
        // ==============================

        people.sort(
            (a, b) => a.day - b.day
        );


        // ==============================
        // 月コンテナ
        // ==============================

        const monthContainer =
            document.createElement("div");

        monthContainer.className =
            "birthday-month";


        // ==============================
        // 月ヘッダー
        // ==============================

        const monthHeader =
            document.createElement("button");

        monthHeader.className =
            "birthday-month-header";

        monthHeader.type = "button";


        monthHeader.innerHTML = `

            <span>

                <span class="month-arrow">
                    ▶
                </span>

                ${month}月

            </span>


            <span>

                ${people.length}人

            </span>

        `;


        // ==============================
        // 月の中身
        // ==============================

        const monthList =
            document.createElement("div");

        monthList.className =
            "birthday-month-list";


        // 初期状態は閉じる

        monthList.style.display =
            "none";


        // ==============================
        // 誕生日を追加
        // ==============================

        people.forEach(person => {

            const item =
                document.createElement("div");

            item.className =
                "birthday-item";


            item.innerHTML = `

                <span class="birthday-date">

                    ${person.month}月${person.day}日

                </span>


                <span>

                    ${escapeHTML(person.name)}

                </span>

            `;


            monthList.appendChild(item);

        });


        // ==============================
        // 月クリック
        // ==============================

        monthHeader.addEventListener(
            "click",
            () => {

                const isOpen =
                    monthList.style.display !== "none";


                if (isOpen) {

                    monthList.style.display =
                        "none";


                    monthHeader
                        .querySelector(
                            ".month-arrow"
                        )
                        .textContent = "▶";

                } else {

                    monthList.style.display =
                        "block";


                    monthHeader
                        .querySelector(
                            ".month-arrow"
                        )
                        .textContent = "▼";

                }

            }
        );


        monthContainer.appendChild(
            monthHeader
        );

        monthContainer.appendChild(
            monthList
        );


        birthdayList.appendChild(
            monthContainer
        );

    }

}


// ==============================
// HTMLエスケープ
// ==============================

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}


// ==============================
// 名前チェック
// ==============================

function validateName() {

    const name =
        nameInput.value.trim();


    nameError.textContent = "";


    // 空欄

    if (name === "") {

        nameError.textContent =
            "名前を入力してください。";

        return false;

    }


    // 30文字以上

    if (name.length > 30) {

        nameError.textContent =
            "名前は30文字以内で入力してください。";

        return false;

    }


    // 数字だけ

    if (/^[0-9]+$/.test(name)) {

        nameError.textContent =
            "この名前は登録できません。";

        return false;

    }


    // 記号だけ

    if (
        /^[^ぁ-んァ-ヶ一-龠a-zA-Z0-9]+$/.test(name)
    ) {

        nameError.textContent =
            "この名前は登録できません。";

        return false;

    }


    // 同じ文字が10回以上連続

    if (/(.)\1{9,}/u.test(name)) {

        nameError.textContent =
            "不自然な文字列は登録できません。";

        return false;

    }


    // ==============================
    // 長い英数字の不自然な羅列
    // ==============================

    const isAlphanumericOnly =
        /^[a-zA-Z0-9]+$/.test(name);

    const hasLetters =
        /[a-zA-Z]/.test(name);

    const hasNumbers =
        /[0-9]/.test(name);


    if (
        isAlphanumericOnly &&
        name.length >= 15 &&
        hasLetters &&
        hasNumbers
    ) {

        nameError.textContent =
            "不自然な文字列は登録できません。";

        return false;

    }


    return true;

}


// ==============================
// 月チェック
// ==============================

function validateMonth() {

    const month =
        monthInput.value.trim();


    monthError.textContent = "";


    // 空欄

    if (month === "") {

        monthError.textContent =
            "月を入力してください。";

        return false;

    }


    // 数字以外

    if (!/^[0-9]+$/.test(month)) {

        monthError.textContent =
            "月は数字のみ入力できます。";

        return false;

    }


    const value =
        Number(month);


    // 1～12以外

    if (
        value < 1 ||
        value > 12
    ) {

        monthError.textContent =
            "月は1～12で入力してください。";

        return false;

    }


    return true;

}


// ==============================
// 日チェック
// ==============================

function validateDay() {

    const day =
        dayInput.value.trim();


    dayError.textContent = "";


    // 空欄

    if (day === "") {

        dayError.textContent =
            "日を入力してください。";

        return false;

    }


    // 数字以外

    if (!/^[0-9]+$/.test(day)) {

        dayError.textContent =
            "日は数字のみ入力できます。";

        return false;

    }


    const value =
        Number(day);


    // 1～31以外

    if (
        value < 1 ||
        value > 31
    ) {

        dayError.textContent =
            "日は1～31で入力してください。";

        return false;

    }


    return true;

}


// ==============================
// 実在する月日かチェック
// ==============================

function validateRealDate() {

    if (
        !validateMonth() ||
        !validateDay()
    ) {

        return false;

    }


    const month =
        Number(monthInput.value);

    const day =
        Number(dayInput.value);


    const daysInMonth = {

        1: 31,
        2: 29,
        3: 31,
        4: 30,
        5: 31,
        6: 30,
        7: 31,
        8: 31,
        9: 30,
        10: 31,
        11: 30,
        12: 31

    };


    if (
        day > daysInMonth[month]
    ) {

        dayError.textContent =
            "その日付は存在しません。";

        return false;

    }


    return true;

}


// ==============================
// 入力時チェック
// ==============================

nameInput.addEventListener(
    "input",
    validateName
);


monthInput.addEventListener(
    "input",
    () => {

        if (
            !/^[0-9]*$/.test(
                monthInput.value
            )
        ) {

            monthError.textContent =
                "月は数字のみ入力できます。";

            return;

        }


        if (validateMonth()) {

            validateRealDate();

        }

    }
);


dayInput.addEventListener(
    "input",
    () => {

        if (
            !/^[0-9]*$/.test(
                dayInput.value
            )
        ) {

            dayError.textContent =
                "日は数字のみ入力できます。";

            return;

        }


        if (validateDay()) {

            validateRealDate();

        }

    }
);


// ==============================
// 登録
// ==============================

form.addEventListener(
    "submit",
    event => {

        event.preventDefault();


        // ==============================
        // 入力チェック
        // ==============================

        const nameOK =
            validateName();

        const monthOK =
            validateMonth();

        const dayOK =
            validateDay();

        const dateOK =
            validateRealDate();


        if (
            !nameOK ||
            !monthOK ||
            !dayOK ||
            !dateOK
        ) {

            alert(
                "入力内容に問題があります。\n" +
                "内容を確認してください。"
            );

            return;

        }


        // ==============================
        // 登録データ
        // ==============================

        const newBirthday = {

            name:
                nameInput.value.trim(),

            month:
                Number(monthInput.value),

            day:
                Number(dayInput.value)

        };


        // ==============================
        // 登録中
        // ==============================

        submitButton.disabled =
            true;

        submitButton.textContent =
            "登録中...";


        // ==============================
        // Cloudflare Worker
        // ==============================

        fetch(
            "https://birthday-api-2.kyusai-eruchi.workers.dev/",
            {

                method: "POST",

                headers: {

                    "Content-Type":
                        "application/json"

                },

                body:
                    JSON.stringify(
                        newBirthday
                    )

            }
        )


        // ==============================
        // Workerレスポンス
        // ==============================

        .then(response => {

            if (!response.ok) {

                throw new Error(
                    "サーバーとの通信に失敗しました。"
                );

            }

            return response.json();

        })


        .then(result => {

            if (!result.success) {

                alert(
                    result.message ||
                    "登録できませんでした。"
                );

                return;

            }


            // ==============================
            // 登録成功
            // ==============================

            alert(

                "誕生日を登録しました！\n\n" +

                `${newBirthday.name}\n` +

                `${newBirthday.month}月` +

                `${newBirthday.day}日`

            );


            // フォームをリセット

            form.reset();


            nameError.textContent = "";

            monthError.textContent = "";

            dayError.textContent = "";


            // ==============================
            // 最新データ取得
            // ==============================

            return fetch(
                "birthday.json?time=" +
                Date.now()
            );

        })


        .then(response => {

            if (!response) {

                return null;

            }

            return response.json();

        })


        .then(data => {

            if (!data) {
                return;
            }

            birthdays = data;

            displayBirthdayHighlight();

            displayBirthdays();

        })


        // ==============================
        // エラー
        // ==============================

        .catch(error => {

            console.error(error);


            alert(

                "登録処理中にエラーが発生しました。\n" +
                "もう一度お試しください。"

            );

        })


        // ==============================
        // 登録終了
        // ==============================

        .finally(() => {

            submitButton.disabled =
                false;

            submitButton.textContent =
                "登録する";

        });

    }
);
