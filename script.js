// ---- グローバル変数 ---- //
let practiceText = "";      // 練習テキスト（プレーンテキスト）
let userInput = "";         // ユーザーの入力履歴
let startTime = null;       // 開始時刻（Date オブジェクト）
let timerInterval = null;   // タイマー更新用 interval ID

// DOM 要素を取得
const fileSelect = document.getElementById("file-select");
const startBtn = document.getElementById("start-btn");
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
      // fileList は ["sample1.md", "sample2.md", ...] のような形式を想定
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
      // Markdown の見た目を変換せず、プレーンテキストとして扱う
      // (必要なら Markdown-it 等で整形してもよいが、本サンプルでは生テキスト)
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
  textDisplay.scrollTop = 0;
  textInput.value = "";
  textInput.disabled = false;
  textInput.focus();
}

// ---- 練習テキストの表示を更新する ---- //
function renderDisplay() {
  // practiceText と userInput を比較しながら span を生成
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < practiceText.length; i++) {
    const span = document.createElement("span");
    const char = practiceText[i];
    if (i < userInput.length) {
      if (userInput[i] === char) {
        // 正しく入力済み：黒
        span.style.color = "#333";
      } else {
        // 間違って入力済み：赤
        span.style.color = "#e74c3c";
      }
    } else {
      // 未入力：グレー
      span.style.color = "#999";
    }

    // 改行文字は可視化せず、そのまま反映
    if (char === "\n") {
      span.innerHTML = "<br/>";
    } else {
      // HTML エスケープ
      span.textContent = char;
    }
    fragment.appendChild(span);
  }

  // すでに存在する子要素をすべてクリアしてから追加
  textDisplay.innerHTML = "";
  textDisplay.appendChild(fragment);
}

// ---- タイピング可能にし、キー入力をハンドル ---- //
function activateTyping() {
  // スタート時刻を記録
  startTime = Date.now();
  // 500ms ごとにタイマー更新
  timerInterval = setInterval(updateTimer, 100);

  // テキストボックス（透明）に入力があるたびに処理
  textInput.addEventListener("input", onUserInput);
  // バックスペース等も含めたキー押下を検知（記号入力のサポート表示用）
  textInput.addEventListener("keydown", onKeyDown);
}

// ---- ユーザーの入力を受け取る ---- //
function onUserInput(e) {
  const val = textInput.value;
  // 入力は常に先頭からのみ受け付け。テキスト選択や中間挿入は不可とする前提で簡易化
  // 末尾の余分な入力は削除
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
  // 記号が入力されようとした場合（「。」と「、」以外の記号）、ポップアップを出す
  // ここでは、入力される文字が「jis 配列外の記号」に該当するかを簡易チェック
  const allowedPunctuations = ["、", "。"];
  const key = e.key;

  // key が長さ 1 の文字で、空白文字でもない場合にチェック
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
  // どのキー操作かを簡易的に示す
  // ここでは JIS 配列一般論として例を出す。実際にはユーザーの環境で異なる可能性あり旨を注記。
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
