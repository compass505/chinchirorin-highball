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
    title: "一の目そろいで無料",
    body: "小さな目でも運は大きめ。同じ一が並んで、最初の一杯から店のおごりです。",
  },
  "1-2": {
    title: "一歩進んで倍量倍額",
    body: "一から二へ軽く弾む奇数合計。今日は細いグラスより大ジョッキの流れです。",
  },
  "1-3": {
    title: "綺麗に割れて半額",
    body: "一と三で合計四。割り切れる気持ちよさで、ハイボールも会計も軽やかです。",
  },
  "1-4": {
    title: "片足ジャンプで倍量倍額",
    body: "一と四のアンバランスが勢いを呼びました。今夜は大きめサイズで勝負です。",
  },
  "1-5": {
    title: "端から端まで半額",
    body: "一と五で合計六。離れた目がきれいにまとまり、半額の着地です。",
  },
  "1-6": {
    title: "最小最大で倍量倍額",
    body: "一と六の大きな振れ幅。ハイボールも気分も大きくなる奇数の一投です。",
  },
  "2-1": {
    title: "二の助走で倍量倍額",
    body: "二から一へ戻るような出目でも、合計は奇数。今日は倍量の波に乗ります。",
  },
  "2-2": {
    title: "二の目そろいで無料",
    body: "ほどよい二がぴたりと並びました。静かな当たりで、一杯分の支払いが消えます。",
  },
  "2-3": {
    title: "二三で伸びる倍量倍額",
    body: "二と三で合計五。もう一段飲み口が伸びる、強気の大ジョッキ結果です。",
  },
  "2-4": {
    title: "偶数リズムで半額",
    body: "二と四の素直な偶数コンビ。気持ちよく割れて、ハイボールは半額です。",
  },
  "2-5": {
    title: "斜めに跳ねて倍量倍額",
    body: "二と五で合計七。少し派手な出目が、倍量倍額の存在感を連れてきます。",
  },
  "2-6": {
    title: "末広がりに半額",
    body: "二と六で合計八。縁起よく割り切れて、財布にやさしい半額です。",
  },
  "3-1": {
    title: "三から一で半額",
    body: "勢いの三を一で締めて合計四。すっと整った偶数で、半額に着地します。",
  },
  "3-2": {
    title: "三二の掛け声で倍量倍額",
    body: "三、二、と数えたら合計五。カウントダウンみたいに大ジョッキへ向かいます。",
  },
  "3-3": {
    title: "三の目そろいで無料",
    body: "真ん中の三がきれいにそろいました。炭酸の泡まで祝っている無料の出目です。",
  },
  "3-4": {
    title: "三四で押し切る倍量倍額",
    body: "三と四で合計七。勢い優先の奇数が、今夜のグラスを大きくします。",
  },
  "3-5": {
    title: "奇数同士で半額",
    body: "三と五はどちらも奇数、足すと偶数。意外と整う一投で半額です。",
  },
  "3-6": {
    title: "三六の大波で倍量倍額",
    body: "三と六で合計九。大きな波が来たので、今日は倍量倍額の迫力です。",
  },
  "4-1": {
    title: "四一で決まる倍量倍額",
    body: "四の安定に一のひらめき。合計五の奇数で、大きい一杯に切り替わります。",
  },
  "4-2": {
    title: "四二でさらりと半額",
    body: "四と二で合計六。落ち着いた偶数の流れが、会計をすっきり軽くします。",
  },
  "4-3": {
    title: "四三で攻める倍量倍額",
    body: "四と三で合計七。少し攻めた出目が、大ジョッキの存在感を呼びました。",
  },
  "4-4": {
    title: "四の目そろいで無料",
    body: "四が並ぶどっしりした当たり。今夜の一杯は、落ち着いて無料です。",
  },
  "4-5": {
    title: "四五の坂道で倍量倍額",
    body: "四から五へ上がって合計九。飲みごたえも会計も、ひと回り大きくなります。",
  },
  "4-6": {
    title: "十まで届いて半額",
    body: "四と六で合計十。きれいに区切りのいい偶数で、半額の当たりです。",
  },
  "5-1": {
    title: "五一で戻して半額",
    body: "大きな五を一で受け止めて合計六。派手さを整えて、半額にまとまりました。",
  },
  "5-2": {
    title: "五二で弾ける倍量倍額",
    body: "五と二で合計七。泡の勢いそのままに、今日は倍量倍額です。",
  },
  "5-3": {
    title: "五三でしっかり半額",
    body: "五と三で合計八。強めの出目同士でも、足せばきれいな半額です。",
  },
  "5-4": {
    title: "五四で迫る倍量倍額",
    body: "五と四で合計九。あと一歩で十の惜しさが、大ジョッキの勢いに変わります。",
  },
  "5-5": {
    title: "五の目そろいで無料",
    body: "五がぴたりと並んだ強い当たり。堂々と無料のハイボールです。",
  },
  "5-6": {
    title: "五六で最大級の倍量倍額",
    body: "五と六で合計十一。かなり大きな奇数が、倍量倍額を力強く告げます。",
  },
  "6-1": {
    title: "六一で振り切る倍量倍額",
    body: "最大の六に一が加わって合計七。出だしから強い、倍量倍額の一投です。",
  },
  "6-2": {
    title: "六二で余裕の半額",
    body: "六と二で合計八。大きめの出目でもきれいに割れて、余裕の半額です。",
  },
  "6-3": {
    title: "六三で豪快に倍量倍額",
    body: "六と三で合計九。豪快な奇数が、大ジョッキの時間を連れてきます。",
  },
  "6-4": {
    title: "六四でぴたり半額",
    body: "六と四で合計十。区切りよく割り切れる、見た目にも気持ちいい半額です。",
  },
  "6-5": {
    title: "六五で大勝負の倍量倍額",
    body: "六と五で合計十一。大きい目同士の勝負感で、倍量倍額に決まりました。",
  },
  "6-6": {
    title: "六の目そろいで無料",
    body: "最大のゾロ目が出ました。文句なしの当たりで、今夜の一杯は無料です。",
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
