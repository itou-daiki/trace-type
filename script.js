// ---- グローバル変数 ---- //
let practiceText = "";      // 練習テキスト（プレーンテキスト）
let userInput = "";         // ユーザーの入力履歴
let startTime = null;       // 開始時刻（Date オブジェクト）
let timerInterval = null;   // タイマー更新用 interval ID
let isComposing = false;    // IME変換中かどうかのフラグ
let mouseClickCount = 0;    // マウスクリック回数

// ---- JIS配列キーマッピング ---- //
const jisKeyMap = {
  // 英字（小文字）
  'a': ['A'], 'b': ['B'], 'c': ['C'], 'd': ['D'], 'e': ['E'], 'f': ['F'], 'g': ['G'], 'h': ['H'],
  'i': ['I'], 'j': ['J'], 'k': ['K'], 'l': ['L'], 'm': ['M'], 'n': ['N'], 'o': ['O'], 'p': ['P'],
  'q': ['Q'], 'r': ['R'], 's': ['S'], 't': ['T'], 'u': ['U'], 'v': ['V'], 'w': ['W'], 'x': ['X'],
  'y': ['Y'], 'z': ['Z'],
  
  // 英字（大文字）
  'A': ['Shift', 'A'], 'B': ['Shift', 'B'], 'C': ['Shift', 'C'], 'D': ['Shift', 'D'], 'E': ['Shift', 'E'],
  'F': ['Shift', 'F'], 'G': ['Shift', 'G'], 'H': ['Shift', 'H'], 'I': ['Shift', 'I'], 'J': ['Shift', 'J'],
  'K': ['Shift', 'K'], 'L': ['Shift', 'L'], 'M': ['Shift', 'M'], 'N': ['Shift', 'N'], 'O': ['Shift', 'O'],
  'P': ['Shift', 'P'], 'Q': ['Shift', 'Q'], 'R': ['Shift', 'R'], 'S': ['Shift', 'S'], 'T': ['Shift', 'T'],
  'U': ['Shift', 'U'], 'V': ['Shift', 'V'], 'W': ['Shift', 'W'], 'X': ['Shift', 'X'], 'Y': ['Shift', 'Y'],
  'Z': ['Shift', 'Z'],
  
  // 数字
  '0': ['0'], '1': ['1'], '2': ['2'], '3': ['3'], '4': ['4'], '5': ['5'], '6': ['6'], '7': ['7'], '8': ['8'], '9': ['9'],
  
  // 記号（Shiftなし）
  '-': ['-'], '^': ['^'], '\\': ['\\'], '@': ['@'], '[': ['['], ';': [';'], ':': [':'], ']': [']'], ',': [','], '.': ['.'], '/': ['/'], '\\': ['\\'],
  
  // 記号（Shiftあり）
  '!': ['Shift', '1'], '"': ['Shift', '2'], '#': ['Shift', '3'], '$': ['Shift', '4'], '%': ['Shift', '5'],
  '&': ['Shift', '6'], "'": ['Shift', '7'], '(': ['Shift', '8'], ')': ['Shift', '9'], '=': ['Shift', '-'],
  '~': ['Shift', '^'], '|': ['Shift', '\\'], '`': ['Shift', '@'], '{': ['Shift', '['], '+': ['Shift', ';'],
  '*': ['Shift', ':'], '}': ['Shift', ']'], '<': ['Shift', ','], '>': ['Shift', '.'], '?': ['Shift', '/'],
  '_': ['Shift', '\\'],
  
  // 特殊文字
  ' ': ['Space'], '\n': ['Enter'], '\t': ['Tab'],
  
  // 日本語文字（ひらがな・カタカナ・漢字は一般的にIME入力）
  'あ': ['あ'], 'い': ['い'], 'う': ['う'], 'え': ['え'], 'お': ['お'],
  'か': ['か'], 'き': ['き'], 'く': ['く'], 'け': ['け'], 'こ': ['こ'],
  'が': ['が'], 'ぎ': ['ぎ'], 'ぐ': ['ぐ'], 'げ': ['げ'], 'ご': ['ご'],
  'さ': ['さ'], 'し': ['し'], 'す': ['す'], 'せ': ['せ'], 'そ': ['そ'],
  'ざ': ['ざ'], 'じ': ['じ'], 'ず': ['ず'], 'ぜ': ['ぜ'], 'ぞ': ['ぞ'],
  'た': ['た'], 'ち': ['ち'], 'つ': ['つ'], 'て': ['て'], 'と': ['と'],
  'だ': ['だ'], 'ぢ': ['ぢ'], 'づ': ['づ'], 'で': ['で'], 'ど': ['ど'],
  'な': ['な'], 'に': ['に'], 'ぬ': ['ぬ'], 'ね': ['ね'], 'の': ['の'],
  'は': ['は'], 'ひ': ['ひ'], 'ふ': ['ふ'], 'へ': ['へ'], 'ほ': ['ほ'],
  'ば': ['ば'], 'び': ['び'], 'ぶ': ['ぶ'], 'べ': ['べ'], 'ぼ': ['ぼ'],
  'ぱ': ['ぱ'], 'ぴ': ['ぴ'], 'ぷ': ['ぷ'], 'ぺ': ['ぺ'], 'ぽ': ['ぽ'],
  'ま': ['ま'], 'み': ['み'], 'む': ['む'], 'め': ['め'], 'も': ['も'],
  'や': ['や'], 'ゆ': ['ゆ'], 'よ': ['よ'],
  'ら': ['ら'], 'り': ['り'], 'る': ['る'], 'れ': ['れ'], 'ろ': ['ろ'],
  'わ': ['わ'], 'ゐ': ['ゐ'], 'ゑ': ['ゑ'], 'を': ['を'], 'ん': ['ん'],
  'ー': ['ー'], '、': ['、'], '。': ['。'], '「': ['「'], '」': ['」'],
  '＜': ['＜'], '＞': ['＞']
};

// DOM 要素を取得
const fileSelect  = document.getElementById("file-select");
const startBtn    = document.getElementById("start-btn");
const textDisplay = document.getElementById("text-display");
const textInput   = document.getElementById("text-input");
const timerSpan   = document.getElementById("timer");
const mouseClicksSpan = document.getElementById("mouse-clicks");
const keyDisplay = document.getElementById("key-display");

// ===== 初期化処理 ===== //
window.addEventListener("DOMContentLoaded", () => {
  loadFileList();
  disablePasteAndDrop();
  setupMouseClickTracking();
});

// ---- 練習ファイル一覧を読み込む ---- //
function loadFileList() {
  fetch("Practice/files.json")
    .then(res => {
      if (!res.ok) throw new Error("files.json の読み込みに失敗しました");
      return res.json();
    })
    .then(fileList => {
      fileList.forEach(filename => {
        const option = document.createElement("option");
        option.value = filename;
        option.textContent = filename;
        fileSelect.appendChild(option);
      });
      fileSelect.disabled = false;
      startBtn.disabled = false;
    })
    .catch(err => {
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

// ---- 選択した md ファイルを取得してプレーンテキスト化 ---- //
function fetchPracticeText(filename) {
  fetch(`Practice/${filename}`)
    .then(res => {
      if (!res.ok) throw new Error("md ファイルの読み込みに失敗しました");
      return res.text();
    })
    .then(markdown => {
      practiceText = markdown.replace(/\r\n/g, "\n");
      resetTypingArea();
      renderDisplay();   // 初期表示（全て灰色）
      activateTyping();
    })
    .catch(err => {
      console.error(err);
      alert("練習テキストの読み込みに失敗しました。");
    });
}

// ---- タイピングエリアを初期化 ---- //
function resetTypingArea() {
  userInput = "";
  clearInterval(timerInterval);
  timerSpan.textContent = "0.00";
  startTime = null;
  textDisplay.innerHTML = "";   // 背景テキスト領域をクリア
  textInput.value = "";
  textInput.disabled = false;
  textInput.focus();
  
  // マウスクリック回数をリセット
  mouseClickCount = 0;
  updateMouseClickDisplay();
}


// ---- 背景テキスト表示を更新 ---- //
// ここで「入力済み部分は緑／赤」「未入力部分は灰色」で描画し、
// 現在入力中の文字をハイライトし、入力文字をトレース文字の上に重ねて表示する。
function renderDisplay() {
  const fragment = document.createDocumentFragment();
  const spanElements = []; // span要素を追跡するための配列

  // 文字ごとに span を作成し、色を付けていく
  for (let i = 0; i < practiceText.length; i++) {
    const span = document.createElement("span");
    const char = practiceText[i];

    if (i < userInput.length) {
      // 入力済み文字
      if (userInput[i] === char) {
        span.className = "typed-correct";
        // 正しい入力文字をトレース文字の上に表示
        span.setAttribute('data-input', userInput[i]);
      } else {
        span.className = "typed-incorrect";
        // 間違った入力文字をトレース文字の上に表示
        span.setAttribute('data-input', userInput[i]);
        span.setAttribute('data-expected', char);
      }
    } else if (i === userInput.length) {
      // 現在入力中の文字（次に入力すべき文字）
      span.className = "current-char";
      span.style.color = "#333";
      span.style.fontWeight = "bold";
    } else {
      // 未入力文字
      span.style.color = "#999";
      span.style.opacity = "0.6";
    }

    // 改行文字の処理
    if (char === "\n") {
      span.innerHTML = "<br/>";
      // 改行文字の場合、視覚的に見えるように小さなマーカーを追加
      span.style.position = "relative";
      if (i === userInput.length) {
        // 現在入力中の改行文字の場合、改行後の位置にカーソルを表示
        span.style.display = "block";
        span.style.height = "1.6em";
        span.style.width = "2px";
        span.innerHTML = "<br/>";
      }
    } else {
      span.textContent = char;
    }

    spanElements.push(span);
    fragment.appendChild(span);
  }

  // 一度クリアしてから新しいノードを追加
  textDisplay.innerHTML = "";
  textDisplay.appendChild(fragment);

  // キー表示を更新
  updateKeyDisplay();

  // 「現在入力中の文字」を画面中央にスクロール
  // userInput.length が全文字数と等しければ、すでに完了しているのでスクロール不要
  if (userInput.length < practiceText.length) {
    // spanElements配列から正しい要素を取得
    const targetSpan = spanElements[userInput.length];
    if (targetSpan) {
      // 画面中央に表示するようにスクロール
      targetSpan.scrollIntoView({ 
        block: "center", 
        behavior: "smooth" 
      });
    }
  }
}

// ---- 貼り付け・ドロップを禁止 ---- //
function disablePasteAndDrop() {
  textInput.addEventListener("paste", e => e.preventDefault());
  textInput.addEventListener("drop", e => e.preventDefault());
}

// ---- キー入力を受け付け、タイマーを動かす ---- //
function activateTyping() {
  // 開始時刻を記録
  startTime = Date.now();
  // 100ms ごとにタイマーを更新
  timerInterval = setInterval(updateTimer, 100);

  // 入力イベントを監視
  textInput.addEventListener("input", onUserInput);
  textInput.addEventListener("keydown", onKeyDown);
  
  // IME変換イベントを監視
  textInput.addEventListener("compositionstart", onCompositionStart);
  textInput.addEventListener("compositionupdate", onCompositionUpdate);
  textInput.addEventListener("compositionend", onCompositionEnd);
}

// ---- ユーザーの入力を反映 ---- //
function onUserInput() {
  // IME変換中は処理をスキップ
  if (isComposing) {
    return;
  }

  const val = textInput.value;

  // 文字数が練習テキストを超えないよう切り詰め
  if (val.length > practiceText.length) {
    // イベントリスナーを一時的に削除してから値を設定
    textInput.removeEventListener("input", onUserInput);
    textInput.value = val.slice(0, practiceText.length);
    // イベントリスナーを再度追加
    textInput.addEventListener("input", onUserInput);
    return;
  }

  userInput = val;
  renderDisplay();

  // すべて入力し終えたら完了処理
  if (userInput.length === practiceText.length) {
    finishTyping();
  }
}

// ---- IME変換開始時の処理 ---- //
function onCompositionStart(e) {
  isComposing = true;
}

// ---- IME変換更新時の処理 ---- //
function onCompositionUpdate(e) {
  // 変換中は何もしない
}

// ---- IME変換終了時の処理 ---- //
function onCompositionEnd(e) {
  isComposing = false;
  // 変換が確定したので、入力処理を実行
  setTimeout(() => {
    onUserInput();
  }, 0);
}

// ---- キー押下時に、記号入力をサポート（「。」と「、」以外はブロック） ---- //
function onKeyDown(e) {
  const allowedPunctuations = ["、", "。"];
  const key = e.key;

  // key が一文字で英数・空白でないもの＝記号とみなす
  if (key.length === 1 && !/\w|\s/.test(key)) {
    if (!allowedPunctuations.includes(key)) {
      e.preventDefault();
      showPunctuationHelp(key);
      return;
    }
  }
}

// ---- 記号入力サポート用のポップアップ ---- //
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

// ---- タイマー表示更新 ---- //
function updateTimer() {
  const elapsed = (Date.now() - startTime) / 1000;
  timerSpan.textContent = elapsed.toFixed(2);
}

// ---- マウスクリック監視を設定 ---- //
function setupMouseClickTracking() {
  document.addEventListener("click", onMouseClick);
}

// ---- マウスクリック時の処理 ---- //
function onMouseClick(e) {
  // タイピング練習中のみカウント
  if (startTime && !textInput.disabled) {
    mouseClickCount++;
    updateMouseClickDisplay();
  }
}

// ---- マウスクリック回数表示を更新 ---- //
function updateMouseClickDisplay() {
  if (mouseClicksSpan) {
    mouseClicksSpan.textContent = mouseClickCount;
  }
}

// ---- キー表示を更新 ---- //
function updateKeyDisplay() {
  if (!keyDisplay) return;
  
  // 練習が完了している場合
  if (userInput.length >= practiceText.length) {
    keyDisplay.innerHTML = '<span style="color: #28a745; font-weight: bold;">完了！</span>';
    return;
  }
  
  // 現在入力すべき文字を取得
  const currentChar = practiceText[userInput.length];
  
  // キーマッピングを取得
  const keyMapping = jisKeyMap[currentChar];
  
  if (!keyMapping) {
    // マッピングが見つからない場合
    keyDisplay.innerHTML = `<span style="color: #dc3545;">「${currentChar}」</span>`;
    return;
  }
  
  // キーの組み合わせを表示
  const keyElements = keyMapping.map(key => {
    return `<span class="key-button">${key}</span>`;
  });
  
  if (keyElements.length === 1) {
    // 単一キーの場合
    keyDisplay.innerHTML = keyElements[0];
  } else {
    // 複数キーの組み合わせの場合（例：Shift + R）
    keyDisplay.innerHTML = keyElements.join('<span class="key-plus">+</span>');
  }
}
