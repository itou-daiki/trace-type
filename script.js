// ---- グローバル変数 ---- //
let practiceText = "";      // 練習テキスト（プレーンテキスト）
let userInput = "";         // ユーザーの入力履歴
let startTime = null;       // 開始時刻（Date オブジェクト）
let timerInterval = null;   // タイマー更新用 interval ID

// DOM 要素を取得
const fileSelect = document.getElementById("file-select");
const startBtn = document.getElementById("start-btn");
const inputPreview = document.getElementById("input-preview");
const textDisplay = document.getElementById("text-display");
const textInput = document.getElementById("text-input");
const timerSpan = document.getElementById("timer");

// ===== 初期化処理 ===== //
window.addEventListener("DOMContentLoaded", () => {
  loadFileList();
});

// ---- 練習ファイル一覧を読み込む ---- //
function loadFileList() {
  fetch("Practice/files.json")
    .then((res) => {
      if (!res.ok) throw new Error("files.json の読み込みに失敗しました");
      return res.json();
    })
    .then((fileList) => {
      fileList.forEach((filename) => {
        const option = document.createElement("option");
        option.value = filename;
        option.textContent = filename;
        fileSelect.appendChild(option);
      });
      fileSelect.disabled = false;
      startBtn.disabled = false;
    })
    .catch((err) => {
      console.error(err);
      alert("練習ファイル一覧の読み込みに失敗しました。");
    });
}

// ---- スタートボタン クリック時 ---- //
startBtn.addEventListener("click", () => {
  const selectedFile = fileSelect.value;
  if (!selectedFile) {
    alert("練習ファイルを選択してください。");
    return;
  }
  fetchPracticeText(selectedFile);
});

// ---- 選択された md ファイルをフェッチしてプレーンテキストを取得 ---- //
function fetchPracticeText(filename) {
  fetch(`Practice/${filename}`)
    .then((res) => {
      if (!res.ok) throw new Error("md ファイルの読み込みに失敗しました");
      return res.text();
    })
    .then((markdown) => {
      practiceText = markdown.replace(/\r\n/g, "\n");
      resetTypingArea();
      renderDisplay();
      activateTyping();
    })
    .catch((err) => {
      console.error(err);
      alert("練習テキストの読み込みに失敗しました。");
    });
}

// ---- タイピングエリアを初期状態に戻す ---- //
function resetTypingArea() {
  userInput = "";
  clearInterval(timerInterval);
  timerSpan.textContent = "0.00";
  startTime = null;
  inputPreview.innerHTML = ""; 
  textDisplay.innerHTML = "";
  textInput.value = "";
  textInput.disabled = false;
  textInput.focus();
}

// ---- 練習テキストの表示を更新する ---- //
function renderDisplay() {
  // 1) userInput（入力済み文字）をプレビュー領域に描画
  const previewFragment = document.createDocumentFragment();
  for (let i = 0; i < userInput.length; i++) {
    const span = document.createElement("span");
    const char = practiceText[i];
    if (userInput[i] === char) {
      span.style.color = "#333"; // 正しく入力
    } else {
      span.style.color = "#e74c3c"; // 間違って入力
    }
    if (userInput[i] === "\n") {
      span.innerHTML = "<br/>";
    } else {
      span.textContent = userInput[i];
    }
    previewFragment.appendChild(span);
  }
  inputPreview.innerHTML = "";
  inputPreview.appendChild(previewFragment);

  // 2) practiceText の残り部分（未入力分）を text-display に灰色で表示
  const remainingText = practiceText.slice(userInput.length);
  const displayFragment = document.createDocumentFragment();
  for (let i = 0; i < remainingText.length; i++) {
    const span = document.createElement("span");
    const char = remainingText[i];
    span.style.color = "#999"; // 未入力は灰色
    if (char === "\n") {
      span.innerHTML = "<br/>";
    } else {
      span.textContent = char;
    }
    displayFragment.appendChild(span);
  }
  textDisplay.innerHTML = "";
  textDisplay.appendChild(displayFragment);
}

// ---- タイピング可能にし、キー入力をハンドル ---- //
function activateTyping() {
  // スタート時刻を記録
  startTime = Date.now();
  // 100ms ごとにタイマー更新
  timerInterval = setInterval(updateTimer, 100);

  // テキストボックス（透明）に入力があるたびに処理
  textInput.addEventListener("input", onUserInput);
  // 記号入力サポートのため keydown も監視
  textInput.addEventListener("keydown", onKeyDown);
}

// ---- ユーザーの入力を受け取る ---- //
function onUserInput(e) {
  const val = textInput.value;
  // 最大文字数を超えないように調整
  if (val.length > practiceText.length) {
    textInput.value = val.slice(0, practiceText.length);
    return;
  }
  userInput = val;
  renderDisplay();

  // 完了判定
  if (userInput.length === practiceText.length) {
    finishTyping();
  }
}

// ---- キー押下時（記号入力サポート） ---- //
function onKeyDown(e) {
  const allowedPunctuations = ["、", "。"];
  const key = e.key;
  if (key.length === 1 && !/\w|\s/.test(key)) {
    if (!allowedPunctuations.includes(key)) {
      e.preventDefault();
      showPunctuationHelp(key);
      return;
    }
  }
}

// ---- 記号入力サポート用のポップアップ表示 ---- //
function showPunctuationHelp(char) {
  let message = `「${char}」を入力するには、JIS 配列上で対応するキーを利用してください。\n`;
  message += `例：Shift + 数字キー 等。`;
  alert(message);
}

// ---- タイピング完了時の処理 ---- //
function finishTyping() {
  clearInterval(timerInterval);
  textInput.disabled = true;
  const elapsed = (Date.now() - startTime) / 1000;
  timerSpan.textContent = elapsed.toFixed(2);
}

// ---- タイマー表示を更新 ---- //
function updateTimer() {
  const elapsed = (Date.now() - startTime) / 1000;
  timerSpan.textContent = elapsed.toFixed(2);
}
