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
    title: "今日は一杯、店のおごり",
    body: "同じ目がそろいました。氷の音まで景気よく聞こえる、いちばん気前のいい結果です。",
    image: "./assets/free.png",
    alt: "ゾロ目のサイコロとハイボールが輝く居酒屋の幸運イラスト",
    history: "無料",
  },
  half: {
    kicker: "合計が偶数なら半額",
    title: "きれいに割れて半額",
    body: "偶数の出目。今夜のハイボールは軽やかに半額で、もう一品頼む余裕が生まれます。",
    image: "./assets/half.png",
    alt: "偶数のサイコロと半分にきらめくハイボールのイラスト",
    history: "半額",
  },
  double: {
    kicker: "合計が奇数なら倍量倍額",
    title: "強気の倍量倍額",
    body: "奇数の出目。グラスも気分も大きくなる、勝負感のあるチンチロリン結果です。",
    image: "./assets/double.png",
    alt: "大きなハイボールと奇数のサイコロが迫力よく並ぶイラスト",
    history: "倍量倍額",
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

function setDie(element, value) {
  element.dataset.value = String(value);
  element.setAttribute("aria-label", String(value));
}

function addHistory(first, second, result) {
  const item = document.createElement("li");
  item.innerHTML = `
    <span class="history-dice">${first}-${second}</span>
    <span class="history-name">${result.history}</span>
    <span class="history-sum">計${first + second}</span>
  `;
  historyList.prepend(item);

  while (historyList.children.length > 6) {
    historyList.lastElementChild.remove();
  }
}

function applyResult(first, second, options = {}) {
  const result = getResult(first, second);
  setDie(dieOne, first);
  setDie(dieTwo, second);
  sumValue.textContent = String(first + second);
  resultImage.src = result.image;
  resultImage.alt = result.alt;
  resultKicker.textContent = result.kicker;
  resultTitle.textContent = result.title;
  resultBody.textContent = result.body;

  if (options.recordHistory !== false) {
    addHistory(first, second, result);
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
