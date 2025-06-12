// ---- グローバル変数 ---- //
let practiceText = "";      // 練習テキスト（プレーンテキスト）
let userInput = "";         // ユーザーの入力履歴
let startTime = null;       // 開始時刻（Date オブジェクト）
let timerInterval = null;   // タイマー更新用 interval ID
let isComposing = false;    // IME変換中かどうかのフラグ
let mouseClickCount = 0;    // マウスクリック回数
let lockedLength = 0;       // ロックされた文字数（正しく入力完了した文字数）
let totalKeystrokes = 0;    // 総キーストローク数
let errorCount = 0;         // エラー回数
let soundEnabled = true;    // サウンド有効フラグ

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
  '-': ['-'], '^': ['^'], '\\': ['\\'], '@': ['@'], '[': ['['], ';': [';'], ':': [':'], ']': [']'], ',': [','], '.': ['.'], '/': ['/'],
  
  // 記号（Shiftあり）
  '!': ['Shift', '1'], '"': ['Shift', '2'], '#': ['Shift', '3'], '$': ['Shift', '4'], '%': ['Shift', '5'],
  '&': ['Shift', '6'], "'": ['Shift', '7'], '(': ['Shift', '8'], ')': ['Shift', '9'], '=': ['Shift', '-'],
  '~': ['Shift', '^'], '|': ['Shift', '\\'], '`': ['Shift', '@'], '{': ['Shift', '['], '+': ['Shift', ';'],
  '*': ['Shift', ':'], '}': ['Shift', ']'], '<': ['Shift', ','], '>': ['Shift', '.'], '?': ['Shift', '/'],
  '_': ['Shift', '\\'],
  
  // 全角記号
  '＜': ['Shift', ','], '＞': ['Shift', '.'],
  
  // 特殊文字
  ' ': ['スペース'], '\n': ['Enter'], '\t': ['Tab'],
  
  // ひらがな（ローマ字入力）
  'あ': ['a'], 'い': ['i'], 'う': ['u'], 'え': ['e'], 'お': ['o'],
  'か': ['ka'], 'き': ['ki'], 'く': ['ku'], 'け': ['ke'], 'こ': ['ko'],
  'が': ['ga'], 'ぎ': ['gi'], 'ぐ': ['gu'], 'げ': ['ge'], 'ご': ['go'],
  'さ': ['sa'], 'し': ['si'], 'す': ['su'], 'せ': ['se'], 'そ': ['so'],
  'ざ': ['za'], 'じ': ['zi'], 'ず': ['zu'], 'ぜ': ['ze'], 'ぞ': ['zo'],
  'た': ['ta'], 'ち': ['ti'], 'つ': ['tu'], 'て': ['te'], 'と': ['to'],
  'だ': ['da'], 'ぢ': ['di'], 'づ': ['du'], 'で': ['de'], 'ど': ['do'],
  'な': ['na'], 'に': ['ni'], 'ぬ': ['nu'], 'ね': ['ne'], 'の': ['no'],
  'は': ['ha'], 'ひ': ['hi'], 'ふ': ['hu'], 'へ': ['he'], 'ほ': ['ho'],
  'ば': ['ba'], 'び': ['bi'], 'ぶ': ['bu'], 'べ': ['be'], 'ぼ': ['bo'],
  'ぱ': ['pa'], 'ぴ': ['pi'], 'ぷ': ['pu'], 'ぺ': ['pe'], 'ぽ': ['po'],
  'ま': ['ma'], 'み': ['mi'], 'む': ['mu'], 'め': ['me'], 'も': ['mo'],
  'や': ['ya'], 'ゆ': ['yu'], 'よ': ['yo'],
  'ら': ['ra'], 'り': ['ri'], 'る': ['ru'], 'れ': ['re'], 'ろ': ['ro'],
  'わ': ['wa'], 'ゐ': ['wi'], 'ゑ': ['we'], 'を': ['wo'], 'ん': ['nn'],
  
  // 小さい文字
  'ぁ': ['la'], 'ぃ': ['li'], 'ぅ': ['lu'], 'ぇ': ['le'], 'ぉ': ['lo'],
  'っ': ['ltu'], 'ゃ': ['lya'], 'ゅ': ['lyu'], 'ょ': ['lyo'],
  
  // カタカナ（ローマ字入力）
  'ア': ['a'], 'イ': ['i'], 'ウ': ['u'], 'エ': ['e'], 'オ': ['o'],
  'カ': ['ka'], 'キ': ['ki'], 'ク': ['ku'], 'ケ': ['ke'], 'コ': ['ko'],
  'ガ': ['ga'], 'ギ': ['gi'], 'グ': ['gu'], 'ゲ': ['ge'], 'ゴ': ['go'],
  'サ': ['sa'], 'シ': ['si'], 'ス': ['su'], 'セ': ['se'], 'ソ': ['so'],
  'ザ': ['za'], 'ジ': ['zi'], 'ズ': ['zu'], 'ゼ': ['ze'], 'ゾ': ['zo'],
  'タ': ['ta'], 'チ': ['ti'], 'ツ': ['tu'], 'テ': ['te'], 'ト': ['to'],
  'ダ': ['da'], 'ヂ': ['di'], 'ヅ': ['du'], 'デ': ['de'], 'ド': ['do'],
  'ナ': ['na'], 'ニ': ['ni'], 'ヌ': ['nu'], 'ネ': ['ne'], 'ノ': ['no'],
  'ハ': ['ha'], 'ヒ': ['hi'], 'フ': ['hu'], 'ヘ': ['he'], 'ホ': ['ho'],
  'バ': ['ba'], 'ビ': ['bi'], 'ブ': ['bu'], 'ベ': ['be'], 'ボ': ['bo'],
  'パ': ['pa'], 'ピ': ['pi'], 'プ': ['pu'], 'ペ': ['pe'], 'ポ': ['po'],
  'マ': ['ma'], 'ミ': ['mi'], 'ム': ['mu'], 'メ': ['me'], 'モ': ['mo'],
  'ヤ': ['ya'], 'ユ': ['yu'], 'ヨ': ['yo'],
  'ラ': ['ra'], 'リ': ['ri'], 'ル': ['ru'], 'レ': ['re'], 'ロ': ['ro'],
  'ワ': ['wa'], 'ヰ': ['wi'], 'ヱ': ['we'], 'ヲ': ['wo'], 'ン': ['nn'],
  
  // 小さいカタカナ
  'ァ': ['la'], 'ィ': ['li'], 'ゥ': ['lu'], 'ェ': ['le'], 'ォ': ['lo'],
  'ッ': ['ltu'], 'ャ': ['lya'], 'ュ': ['lyu'], 'ョ': ['lyo'],
  
  
  // 日本語の句読点
  '、': ['、'], '。': ['。'], '「': ['「'], '」': ['」'], '『': ['『'], '』': ['』'],
  '（': ['（'], '）': ['）'], '【': ['【'], '】': ['】'], '〈': ['〈'], '〉': ['〉'],
  '《': ['《'], '》': ['》'], '〔': ['〔'], '〕': ['〕'], '［': ['［'], '］': ['］'],
  '｛': ['｛'], '｝': ['｝'], '〜': ['〜'], '・': ['・'], '…': ['…'], '‥': ['‥'],
  '！': ['！'], '？': ['？'], '：': ['：'], '；': ['；'], 'ー': ['ー']
};

// DOM 要素を取得
const fileSelect  = document.getElementById("file-select");
const startBtn    = document.getElementById("start-btn");
const textDisplay = document.getElementById("text-display");
const textInput   = document.getElementById("text-input");
const timerSpan   = document.getElementById("timer");
const mouseClicksSpan = document.getElementById("mouse-clicks");
const keyDisplay = document.getElementById("key-display");
const scoreArea = document.getElementById("score-area");
const retryBtn = document.getElementById("retry-btn");
const progressSection = document.getElementById("progress-section");
const progressBar = document.getElementById("progress-bar");
const progressText = document.getElementById("progress-text");
const realTimeWpmSpan = document.getElementById("real-time-wpm");
const darkModeToggle = document.getElementById("dark-mode-toggle");
const themeIcon = document.getElementById("theme-icon");

// ===== 初期化処理 ===== //
window.addEventListener("DOMContentLoaded", () => {
  loadFileList();
  disablePasteAndDrop();
  setupMouseClickTracking();
  initializeDarkMode();
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
  lockedLength = 0;
  totalKeystrokes = 0;
  errorCount = 0;
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
  
  // スコアエリアを非表示
  if (scoreArea) {
    scoreArea.style.display = "none";
  }
  
  // 進捗バーを非表示
  if (progressSection) {
    progressSection.style.display = "none";
  }
  
  // リアルタイムWPMをリセット
  if (realTimeWpmSpan) {
    realTimeWpmSpan.textContent = "0";
  }
}


// ---- 背景テキスト表示を更新 ---- //
function renderDisplay() {
  const fragment = document.createDocumentFragment();
  const spanElements = [];

  // 文字ごとに span を作成し、色を付けていく
  for (let i = 0; i < practiceText.length; i++) {
    const span = document.createElement("span");
    const char = practiceText[i];

    if (i < userInput.length) {
      // 入力済み文字
      if (userInput[i] === char) {
        if (i < lockedLength) {
          span.className = "typed-locked";
        } else {
          span.className = "typed-correct";
        }
        span.setAttribute('data-input', userInput[i]);
      } else {
        span.className = "typed-incorrect";
        span.setAttribute('data-input', userInput[i]);
        span.setAttribute('data-expected', char);
      }
    } else if (i === userInput.length) {
      // 現在入力中の文字 - IME使用中の特別スタイル
      if (isComposing) {
        span.className = "current-char ime-composing";
      } else {
        span.className = "current-char";
      }
    } else {
      // 未入力文字
      span.className = "untyped-char";
    }

    // 改行文字の処理
    if (char === "\n") {
      span.innerHTML = "<br/>";
      span.style.display = "block";
      span.style.height = "1.8em";
    } else {
      span.textContent = char;
    }

    spanElements.push(span);
    fragment.appendChild(span);
  }

  // 表示更新
  textDisplay.innerHTML = "";
  textDisplay.appendChild(fragment);

  // キー表示を更新
  updateKeyDisplay();

  // 現在入力中の文字をスクロール表示
  scrollToCurrentChar(spanElements);
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
  
  // 進捗バーを表示
  if (progressSection) {
    progressSection.style.display = "block";
  }

  // 入力イベントを監視
  textInput.removeEventListener("input", onUserInput); // 重複登録を防止
  textInput.removeEventListener("keydown", onKeyDown);
  textInput.addEventListener("input", onUserInput);
  textInput.addEventListener("keydown", onKeyDown);
  
  // 初期進捗更新
  updateProgressBar();
  
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
  
  // キーストローク数をカウント （入力が増えた場合のみ）
  if (val.length > userInput.length) {
    totalKeystrokes++;
    
    // エラーをカウントとサウンド再生
    const newCharIndex = userInput.length;
    if (newCharIndex < practiceText.length && val[newCharIndex] !== practiceText[newCharIndex]) {
      errorCount++;
      playSound('error');
    } else {
      playSound('correct');
    }
  }

  // 文字数が練習テキストを超えないよう切り詰め
  if (val.length > practiceText.length) {
    // イベントリスナーを一時的に削除してから値を設定
    textInput.removeEventListener("input", onUserInput);
    textInput.value = val.slice(0, practiceText.length);
    // イベントリスナーを再度追加
    textInput.addEventListener("input", onUserInput);
    return;
  }

  // ロックされた部分が変更されていないかチェック
  if (val.length < lockedLength || val.substring(0, lockedLength) !== practiceText.substring(0, lockedLength)) {
    // ロックされた部分が変更された場合、元に戻す
    textInput.removeEventListener("input", onUserInput);
    textInput.value = userInput;
    textInput.addEventListener("input", onUserInput);
    // カーソルを正しい位置に移動（ロックされた部分の直後）
    textInput.setSelectionRange(lockedLength, lockedLength);
    return;
  }

  userInput = val;

  // 正しく入力された文字をロック
  updateLockedLength();

  renderDisplay();

  // すべて入力し終えたら完了処理
  if (userInput.length === practiceText.length) {
    finishTyping();
  }
}

// ---- ロックされた文字数を更新 ---- //
function updateLockedLength() {
  let newLockedLength = lockedLength;
  
  // 現在のロック位置から順番に正しい文字をチェック
  for (let i = lockedLength; i < userInput.length; i++) {
    if (userInput[i] === practiceText[i]) {
      newLockedLength = i + 1;
    } else {
      break; // 間違った文字が見つかったら停止
    }
  }
  
  lockedLength = newLockedLength;
}

// ---- IME変換開始時の処理 ---- //
function onCompositionStart(e) {
  isComposing = true;
  showImeIndicator();
  updateImeCompositionDisplay();
}

// ---- IME変換更新時の処理 ---- //
function onCompositionUpdate(e) {
  updateImePreview(e.data || '');
  updateImeCompositionDisplay();
}

// ---- IME変換終了時の処理 ---- //
function onCompositionEnd(e) {
  isComposing = false;
  hideImeIndicator();
  hideImePreview();
  updateImeCompositionDisplay();
  // 変換が確定したので、入力処理を実行
  setTimeout(() => {
    onUserInput();
  }, 0);
}

// ---- キー押下時の制御 ---- //
function onKeyDown(e) {
  const key = e.key;
  
  // カーソル移動キーを無効化
  if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End', 'PageUp', 'PageDown'].includes(key)) {
    e.preventDefault();
    return;
  }
  
  // Backspaceの制御：ロックされた文字は削除できない
  if (key === 'Backspace') {
    const currentLength = textInput.value.length;
    if (currentLength <= lockedLength) {
      e.preventDefault();
      return;
    }
  }
  
  // Delete キーを無効化
  if (key === 'Delete') {
    e.preventDefault();
    return;
  }
  
  // Ctrl+A（全選択）を無効化
  if (e.ctrlKey && key === 'a') {
    e.preventDefault();
    return;
  }
  
  // Ctrl+Z（元に戻す）を無効化
  if (e.ctrlKey && key === 'z') {
    e.preventDefault();
    return;
  }
  
  // Ctrl+Y（やり直し）を無効化
  if (e.ctrlKey && key === 'y') {
    e.preventDefault();
    return;
  }
  
  // 記号入力のサポート
  const allowedPunctuations = ["、", "。"];
  if (key.length === 1 && !/\w|\s/.test(key)) {
    if (!allowedPunctuations.includes(key)) {
      e.preventDefault();
      showPunctuationHelp();
      return;
    }
  }
}

// ---- 記号入力サポート用のポップアップ ---- //
function showPunctuationHelp() {
  // 不要な表示を削除
}

// ---- タイピング完了時の処理 ---- //
function finishTyping() {
  clearInterval(timerInterval);
  textInput.disabled = true;
  const elapsed = (Date.now() - startTime) / 1000;
  timerSpan.textContent = elapsed.toFixed(2);
  
  // スコアを計算・表示
  calculateAndDisplayScore(elapsed);
}

// ---- タイマー表示更新 ---- //
function updateTimer() {
  const elapsed = (Date.now() - startTime) / 1000;
  timerSpan.textContent = elapsed.toFixed(2);
  
  // リアルタイムWPMを更新
  updateRealTimeWPM(elapsed);
  
  // 進捗バーを更新
  updateProgressBar();
}

// ---- マウスクリック監視を設定 ---- //
function setupMouseClickTracking() {
  document.addEventListener("click", onMouseClick);
}

// ---- マウスクリック時の処理 ---- //
function onMouseClick() {
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

// ---- IME状態インジケーター表示 ---- //
function showImeIndicator() {
  const indicator = document.getElementById('ime-indicator');
  if (indicator) {
    indicator.classList.add('active');
  }
}

// ---- IME状態インジケーター非表示 ---- //
function hideImeIndicator() {
  const indicator = document.getElementById('ime-indicator');
  if (indicator) {
    indicator.classList.remove('active');
  }
}

// ---- IME変換プレビュー更新 ---- //
function updateImePreview(compositionText) {
  const preview = document.getElementById('ime-preview');
  if (preview && compositionText) {
    preview.textContent = compositionText;
    preview.classList.add('visible');
    
    // プレビューの位置を現在の文字位置に調整
    const currentCharSpan = textDisplay.querySelector('.current-char');
    if (currentCharSpan) {
      const rect = currentCharSpan.getBoundingClientRect();
      const containerRect = textDisplay.getBoundingClientRect();
      preview.style.left = (rect.left - containerRect.left) + 'px';
    }
  }
}

// ---- IME変換プレビュー非表示 ---- //
function hideImePreview() {
  const preview = document.getElementById('ime-preview');
  if (preview) {
    preview.classList.remove('visible');
    preview.textContent = '';
  }
}

// ---- IME変換中の文字表示更新 ---- //
function updateImeCompositionDisplay() {
  // renderDisplayを再実行してIME状態を反映
  if (practiceText) {
    renderDisplay();
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
  
  // 既存のキーマッピングを取得
  const keyMapping = jisKeyMap[currentChar];
  
  if (!keyMapping) {
    // マッピングが見つからない場合
    keyDisplay.innerHTML = `<span style="color: #dc3545;">「${currentChar}」</span>`;
    return;
  }
  
  // 複数の読み方がある場合の処理
  if (Array.isArray(keyMapping) && keyMapping.length > 1 && keyMapping.every(item => typeof item === 'string' && item.length <= 4)) {
    // 複数の読み方（ローマ字）がある場合
    const primaryReading = keyMapping[0];
    const keyElements = [`<span class="key-button">${primaryReading}</span>`];
    
    // 複数の読みがある場合は選択肢として表示
    if (keyMapping.length > 1) {
      const alternativeReadings = keyMapping.slice(1, 3); // 最大3つまで表示
      const altElements = alternativeReadings.map(reading => 
        `<span class="key-button alternative">${reading}</span>`
      );
      keyDisplay.innerHTML = keyElements.concat(altElements).join('<span class="key-or"> or </span>');
    } else {
      keyDisplay.innerHTML = keyElements[0];
    }
    return;
  }
  
  // 通常のキーマッピング（キーの組み合わせ）の場合
  const keyElements = keyMapping.map(key => {
    return `<span class="key-button">${key}</span>`;
  });
  
  if (keyElements.length === 1) {
    // 単一キーの場合
    keyDisplay.innerHTML = keyElements[0];
  } else {
    // 複数キーの組み合わせの場合（例：Shift + R）
    keyDisplay.innerHTML = keyElements.join('<span class="key-plus"> + </span>');
  }
}

// ---- 現在の文字へスクロール ---- //
function scrollToCurrentChar(spanElements) {
  if (userInput.length < practiceText.length && spanElements[userInput.length]) {
    const targetElement = spanElements[userInput.length];
    const container = textDisplay.parentElement; // typing-area
    
    // 要素の位置を取得
    const elementRect = targetElement.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    
    // コンテナの中央に要素が来るようにスクロール位置を計算
    const scrollTop = container.scrollTop + (elementRect.top - containerRect.top) - (container.clientHeight / 2) + (elementRect.height / 2);
    
    // スムーズスクロール
    container.scrollTo({
      top: Math.max(0, scrollTop),
      behavior: 'smooth'
    });
  }
}

// ---- スコア計算・表示関数 ---- //
function calculateAndDisplayScore(elapsedSeconds) {
  const totalChars = practiceText.length;
  const correctChars = lockedLength;
  const incorrectChars = totalChars - correctChars;
  
  // WPM (Words Per Minute) - 日本語では1単語 = 5文字として計算
  const wpm = Math.round((correctChars / 5) / (elapsedSeconds / 60));
  
  // CPM (Characters Per Minute)
  const cpm = Math.round(correctChars / (elapsedSeconds / 60));
  
  // 正確率
  const accuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 0;
  
  // DOM要素を取得して値を設定
  document.getElementById("wpm-score").textContent = wpm;
  document.getElementById("cpm-score").textContent = cpm;
  document.getElementById("accuracy-score").textContent = accuracy + "%";
  document.getElementById("total-chars").textContent = totalChars;
  document.getElementById("correct-chars").textContent = correctChars;
  document.getElementById("error-chars").textContent = incorrectChars;
  
  // スコアエリアを表示
  if (scoreArea) {
    scoreArea.style.display = "block";
    scoreArea.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}

// ---- リトライボタンのイベントリスナー ---- //
if (retryBtn) {
  retryBtn.addEventListener("click", () => {
    if (practiceText) {
      resetTypingArea();
      renderDisplay();
      activateTyping();
    }
  });
}

// ---- リアルタイムWPM更新 ---- //
function updateRealTimeWPM(elapsedSeconds) {
  if (elapsedSeconds > 0 && lockedLength > 0) {
    const wpm = Math.round((lockedLength / 5) / (elapsedSeconds / 60));
    if (realTimeWpmSpan) {
      realTimeWpmSpan.textContent = wpm;
    }
  }
}

// ---- 進捗バー更新 ---- //
function updateProgressBar() {
  if (practiceText && progressBar && progressText) {
    const progress = (userInput.length / practiceText.length) * 100;
    progressBar.style.width = progress + "%";
    progressText.textContent = Math.round(progress) + "%";
  }
}

// ---- グローバルキーボードショートカット ---- //
document.addEventListener("keydown", function(e) {
  // ESCキーでリセット
  if (e.key === "Escape" && practiceText) {
    resetTypingArea();
    renderDisplay();
    activateTyping();
  }
  
  // F5キーでリロード（デフォルト動作を禁止してリセット）
  if (e.key === "F5" && practiceText) {
    e.preventDefault();
    resetTypingArea();
    renderDisplay();
    activateTyping();
  }
});

// ---- ダークモード初期化 ---- //
function initializeDarkMode() {
  // ローカルストレージからテーマを読み込み
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.body.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);
  
  // ダークモードトグルボタンのイベントリスナー
  if (darkModeToggle) {
    darkModeToggle.addEventListener('click', toggleDarkMode);
  }
}

// ---- ダークモード切り替え ---- //
function toggleDarkMode() {
  const currentTheme = document.body.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  document.body.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  updateThemeIcon(newTheme);
}

// ---- テーマアイコン更新 ---- //
function updateThemeIcon(theme) {
  if (themeIcon) {
    themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
  }
}

// ---- タイピングサウンド再生 ---- //
function playSound(type) {
  if (!soundEnabled) return;
  
  // Web Audio APIを使用して簡単なビープ音を生成
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    if (type === 'correct') {
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    } else if (type === 'error') {
      oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
      gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
    }
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  } catch (error) {
    // サウンド再生に失敗してもエラーを表示しない
  }
}
