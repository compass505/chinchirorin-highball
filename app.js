const rollButton = document.querySelector("#rollButton");
const dieOne = document.querySelector("#dieOne");
const dieTwo = document.querySelector("#dieTwo");
const sumValue = document.querySelector("#sumValue");
const resultImage = document.querySelector("#resultImage");
const resultKicker = document.querySelector("#resultKicker");
const resultTitle = document.querySelector("#resultTitle");
const resultBody = document.querySelector("#resultBody");
const historyList = document.querySelector("#historyList");
const randomBuffer = new Uint32Array(1);
const uint32Range = 0x100000000;

const resultMap = {
  free: {
    kicker: "ゾロ目なら無料",
    image: "./assets/free.png",
    alt: "ゾロ目のサイコロとハイボールが輝く居酒屋の幸運イラスト",
    history: "無料",
  },
  half: {
    kicker: "合計が偶数なら半額",
    image: "./assets/half.png",
    alt: "偶数のサイコロと半分にきらめくハイボールのイラスト",
    history: "半額",
  },
  double: {
    kicker: "合計が奇数なら倍量倍額",
    image: "./assets/double.png",
    alt: "大きなハイボールと奇数のサイコロが迫力よく並ぶイラスト",
    history: "倍量倍額",
  },
};

const outcomeCopy = {
  "1-1": {
    title: "ピンピン無料、財布も元気",
    body: "一がピンと二本立ちました。小さい目なのに景気は大きく、今夜の一杯は無料です。",
  },
  "1-2": {
    title: "ワンツー倍量、会計もツー倍",
    body: "ワンツーの軽快な出目で合計三。テンポよく大ジョッキへ進む倍量倍額です。",
  },
  "1-3": {
    title: "一味三味で、四割れ半額",
    body: "一と三が混ざって合計四。味は濃いのに会計はすっきり、きれいに半額です。",
  },
  "1-4": {
    title: "イチヨンで、いい酔ん倍量",
    body: "一と四で合計五。読みは軽いのに結果は重め、グラスも会計も倍で来ます。",
  },
  "1-5": {
    title: "イチゴ味ならぬ、半額味",
    body: "一五でイチゴっぽい甘い並び。合計六で割り切れて、後味は半額です。",
  },
  "1-6": {
    title: "一路ロックで倍量倍額",
    body: "一六で一直線にロックな奇数。氷も鳴って、大ジョッキの出番です。",
  },
  "2-1": {
    title: "ニイチ兄ちゃん、倍で行く",
    body: "二一の兄貴風な並びで合計三。頼みっぷりも大きく、倍量倍額です。",
  },
  "2-2": {
    title: "ニコニコ無料",
    body: "二が二つでニコニコ顔。支払いも軽くなって、ハイボールは無料です。",
  },
  "2-3": {
    title: "兄さん、倍ジョッキです",
    body: "二三で兄さんと読める出目。今日は兄さんらしく、どんと倍量倍額です。",
  },
  "2-4": {
    title: "西へ逃げずに半額",
    body: "二四でニシ。逃げるどころか当たりに寄って、会計はきれいに半額です。",
  },
  "2-5": {
    title: "ニコッと来たら倍量倍額",
    body: "二五でニコ。笑顔の裏に合計七の奇数がいて、結果は強気の倍量倍額です。",
  },
  "2-6": {
    title: "風呂上がりの半額",
    body: "二六でフロ。湯上がり気分のさっぱり偶数、ハイボールも半額で爽快です。",
  },
  "3-1": {
    title: "サイ先よく半額",
    body: "三一でサイ。サイコロ占いにぴったりの語呂で、合計四の半額です。",
  },
  "3-2": {
    title: "サンニーで倍にー",
    body: "三二のリズムで合計五。語尾まで伸びて、グラスも倍に伸びました。",
  },
  "3-3": {
    title: "さんさん無料日和",
    body: "三がさんさんと並んで、まるで晴れ間の当たり。今夜の一杯は無料です。",
  },
  "3-4": {
    title: "差しで勝負の倍量倍額",
    body: "三四でサシ。差し飲み気分が濃くなって、結果は大ジョッキ勝負です。",
  },
  "3-5": {
    title: "サンゴ礁より半額",
    body: "三五でサンゴ。きらっとした語呂に乗って、合計八の半額へ着地です。",
  },
  "3-6": {
    title: "サブロー級の倍量倍額",
    body: "三六でサブロー。名前みたいな出目が堂々登場、合計九で倍量倍額です。",
  },
  "4-1": {
    title: "酔い始めの倍量倍額",
    body: "四一でヨイ。よい酔いの入り口ですが、合計五でサイズは倍へ進みます。",
  },
  "4-2": {
    title: "よいツマミで半額",
    body: "四二でヨイツー。つまみも欲しくなる偶数で、ハイボールは半額です。",
  },
  "4-3": {
    title: "黄泉じゃなくて倍量行き",
    body: "四三でヨミ。読みが当たっても外れても、合計七で大ジョッキ行きです。",
  },
  "4-4": {
    title: "よしよし無料",
    body: "四四でヨシヨシ。店からなでられるような当たりで、今夜の一杯は無料です。",
  },
  "4-5": {
    title: "よい子は倍量倍額",
    body: "四五でヨイコ。よい子にも容赦なく、合計九の倍量倍額が来ました。",
  },
  "4-6": {
    title: "よろしく半額",
    body: "四六でヨロ。よろしくお願いします、という顔で合計十の半額です。",
  },
  "5-1": {
    title: "恋の予感で半額",
    body: "五一でコイ。恋より財布にやさしい展開、合計六で半額です。",
  },
  "5-2": {
    title: "ゴツい倍量倍額",
    body: "五二でゴツ。名前どおり重めの結果、合計七で大ジョッキが来ます。",
  },
  "5-3": {
    title: "ゴミじゃなくて半額",
    body: "五三でゴミなんて言わせません。合計八で、むしろありがたい半額です。",
  },
  "5-4": {
    title: "腰を据えて倍量倍額",
    body: "五四でコシ。腰を据えて飲むしかない、合計九の倍量倍額です。",
  },
  "5-5": {
    title: "ゴーゴー無料",
    body: "五五でゴーゴー。勢いよく当たりへ直行して、ハイボールは無料です。",
  },
  "5-6": {
    title: "ごろっと倍量倍額",
    body: "五六でゴロ。サイコロがごろっと転がって、合計十一の大きな結果です。",
  },
  "6-1": {
    title: "ロイチでロング倍量",
    body: "六一でロイチ。短い語呂から長いグラスへ、合計七の倍量倍額です。",
  },
  "6-2": {
    title: "ロックに割れて半額",
    body: "六二でロツー、氷のロックも鳴る偶数。合計八で半額です。",
  },
  "6-3": {
    title: "ロミオも驚く倍量倍額",
    body: "六三でロミ。芝居がかった奇数が出て、今夜は大ジョッキの幕開けです。",
  },
  "6-4": {
    title: "ロシでよろしく半額",
    body: "六四でロシ。語呂は渋めでも合計十、会計はきれいに半額です。",
  },
  "6-5": {
    title: "老後じゃなくて倍後",
    body: "六五でロウゴ。先のことより今夜の一杯、倍量倍額で倍後味です。",
  },
  "6-6": {
    title: "ロクロク無料でご機嫌",
    body: "六六でロクロク。最大ゾロ目がきれいに並び、文句なしの無料です。",
  },
};

function randomInt(maxExclusive) {
  if (globalThis.crypto?.getRandomValues) {
    const fairLimit = Math.floor(uint32Range / maxExclusive) * maxExclusive;
    let value;

    // Rejection sampling avoids modulo bias, keeping each die face equally likely.
    do {
      globalThis.crypto.getRandomValues(randomBuffer);
      value = randomBuffer[0];
    } while (value >= fairLimit);

    return value % maxExclusive;
  }

  return Math.floor(Math.random() * maxExclusive);
}

function randomDie() {
  return randomInt(6) + 1;
}

function rollDice() {
  return [randomDie(), randomDie()];
}

function getResult(first, second) {
  if (first === second) {
    return resultMap.free;
  }

  return (first + second) % 2 === 0 ? resultMap.half : resultMap.double;
}

function getOutcomeCopy(first, second) {
  return outcomeCopy[`${first}-${second}`];
}

function setDie(element, value) {
  element.dataset.value = String(value);
  element.setAttribute("aria-label", String(value));
}

function addHistory(first, second, result, copy) {
  const item = document.createElement("li");
  item.innerHTML = `
    <span class="history-dice">${first}-${second}</span>
    <span class="history-name">${result.history}: ${copy.title}</span>
    <span class="history-sum">計${first + second}</span>
  `;
  historyList.prepend(item);

  while (historyList.children.length > 6) {
    historyList.lastElementChild.remove();
  }
}

function applyResult(first, second, options = {}) {
  const result = getResult(first, second);
  const copy = getOutcomeCopy(first, second);
  setDie(dieOne, first);
  setDie(dieTwo, second);
  sumValue.textContent = String(first + second);
  resultImage.src = result.image;
  resultImage.alt = result.alt;
  resultKicker.textContent = result.kicker;
  resultTitle.textContent = copy.title;
  resultBody.textContent = copy.body;

  if (options.recordHistory !== false) {
    addHistory(first, second, result, copy);
  }
}

function roll() {
  rollButton.disabled = true;
  dieOne.classList.add("rolling");
  dieTwo.classList.add("rolling");

  let ticks = 0;
  const shuffle = window.setInterval(() => {
    setDie(dieOne, randomDie());
    setDie(dieTwo, randomDie());
    ticks += 1;

    if (ticks >= 8) {
      window.clearInterval(shuffle);
      const [first, second] = rollDice();
      applyResult(first, second);
      dieOne.classList.remove("rolling");
      dieTwo.classList.remove("rolling");
      rollButton.disabled = false;
    }
  }, 72);
}

rollButton.addEventListener("click", roll);
applyResult(1, 1, { recordHistory: false });
