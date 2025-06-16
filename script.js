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
  'か': ['k', 'a'], 'き': ['k', 'i'], 'く': ['k', 'u'], 'け': ['k', 'e'], 'こ': ['k', 'o'],
  'が': ['g', 'a'], 'ぎ': ['g', 'i'], 'ぐ': ['g', 'u'], 'げ': ['g', 'e'], 'ご': ['g', 'o'],
  'さ': ['s', 'a'], 'し': ['s', 'i'], 'す': ['s', 'u'], 'せ': ['s', 'e'], 'そ': ['s', 'o'],
  'ざ': ['z', 'a'], 'じ': ['z', 'i'], 'ず': ['z', 'u'], 'ぜ': ['z', 'e'], 'ぞ': ['z', 'o'],
  'た': ['t', 'a'], 'ち': ['t', 'i'], 'つ': ['t', 'u'], 'て': ['t', 'e'], 'と': ['t', 'o'],
  'だ': ['d', 'a'], 'ぢ': ['d', 'i'], 'づ': ['d', 'u'], 'で': ['d', 'e'], 'ど': ['d', 'o'],
  'な': ['n', 'a'], 'に': ['n', 'i'], 'ぬ': ['n', 'u'], 'ね': ['n', 'e'], 'の': ['n', 'o'],
  'は': ['h', 'a'], 'ひ': ['h', 'i'], 'ふ': ['h', 'u'], 'へ': ['h', 'e'], 'ほ': ['h', 'o'],
  'ば': ['b', 'a'], 'び': ['b', 'i'], 'ぶ': ['b', 'u'], 'べ': ['b', 'e'], 'ぼ': ['b', 'o'],
  'ぱ': ['p', 'a'], 'ぴ': ['p', 'i'], 'ぷ': ['p', 'u'], 'ぺ': ['p', 'e'], 'ぽ': ['p', 'o'],
  'ま': ['m', 'a'], 'み': ['m', 'i'], 'む': ['m', 'u'], 'め': ['m', 'e'], 'も': ['m', 'o'],
  'や': ['y', 'a'], 'ゆ': ['y', 'u'], 'よ': ['y', 'o'],
  'ら': ['r', 'a'], 'り': ['r', 'i'], 'る': ['r', 'u'], 'れ': ['r', 'e'], 'ろ': ['r', 'o'],
  'わ': ['w', 'a'], 'ゐ': ['w', 'i'], 'ゑ': ['w', 'e'], 'を': ['w', 'o'], 'ん': ['n', 'n'],
  
  // 小さい文字
  'ぁ': ['l', 'a'], 'ぃ': ['l', 'i'], 'ぅ': ['l', 'u'], 'ぇ': ['l', 'e'], 'ぉ': ['l', 'o'],
  'っ': ['l', 't', 'u'], 'ゃ': ['l', 'y', 'a'], 'ゅ': ['l', 'y', 'u'], 'ょ': ['l', 'y', 'o'],
  
  // カタカナ（ローマ字入力）
  'ア': ['a'], 'イ': ['i'], 'ウ': ['u'], 'エ': ['e'], 'オ': ['o'],
  'カ': ['k', 'a'], 'キ': ['k', 'i'], 'ク': ['k', 'u'], 'ケ': ['k', 'e'], 'コ': ['k', 'o'],
  'ガ': ['g', 'a'], 'ギ': ['g', 'i'], 'グ': ['g', 'u'], 'ゲ': ['g', 'e'], 'ゴ': ['g', 'o'],
  'サ': ['s', 'a'], 'シ': ['s', 'i'], 'ス': ['s', 'u'], 'セ': ['s', 'e'], 'ソ': ['s', 'o'],
  'ザ': ['z', 'a'], 'ジ': ['z', 'i'], 'ズ': ['z', 'u'], 'ゼ': ['z', 'e'], 'ゾ': ['z', 'o'],
  'タ': ['t', 'a'], 'チ': ['t', 'i'], 'ツ': ['t', 'u'], 'テ': ['t', 'e'], 'ト': ['t', 'o'],
  'ダ': ['d', 'a'], 'ヂ': ['d', 'i'], 'ヅ': ['d', 'u'], 'デ': ['d', 'e'], 'ド': ['d', 'o'],
  'ナ': ['n', 'a'], 'ニ': ['n', 'i'], 'ヌ': ['n', 'u'], 'ネ': ['n', 'e'], 'ノ': ['n', 'o'],
  'ハ': ['h', 'a'], 'ヒ': ['h', 'i'], 'フ': ['h', 'u'], 'ヘ': ['h', 'e'], 'ホ': ['h', 'o'],
  'バ': ['b', 'a'], 'ビ': ['b', 'i'], 'ブ': ['b', 'u'], 'ベ': ['b', 'e'], 'ボ': ['b', 'o'],
  'パ': ['p', 'a'], 'ピ': ['p', 'i'], 'プ': ['p', 'u'], 'ペ': ['p', 'e'], 'ポ': ['p', 'o'],
  'マ': ['m', 'a'], 'ミ': ['m', 'i'], 'ム': ['m', 'u'], 'メ': ['m', 'e'], 'モ': ['m', 'o'],
  'ヤ': ['y', 'a'], 'ユ': ['y', 'u'], 'ヨ': ['y', 'o'],
  'ラ': ['r', 'a'], 'リ': ['r', 'i'], 'ル': ['r', 'u'], 'レ': ['r', 'e'], 'ロ': ['r', 'o'],
  'ワ': ['w', 'a'], 'ヰ': ['w', 'i'], 'ヱ': ['w', 'e'], 'ヲ': ['w', 'o'], 'ン': ['n', 'n'],
  
  // 小さいカタカナ
  'ァ': ['l', 'a'], 'ィ': ['l', 'i'], 'ゥ': ['l', 'u'], 'ェ': ['l', 'e'], 'ォ': ['l', 'o'],
  'ッ': ['l', 't', 'u'], 'ャ': ['l', 'y', 'a'], 'ュ': ['l', 'y', 'u'], 'ョ': ['l', 'y', 'o'],
  
  
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
const inputCharsSpan = document.getElementById("input-chars");
const keyDisplay = document.getElementById("key-display");
const inputModeIndicator = document.getElementById("input-mode-indicator");
const scoreArea = document.getElementById("score-area");
const retryBtn = document.getElementById("retry-btn");
const progressSection = document.getElementById("progress-section");
const progressBar = document.getElementById("progress-bar");
const progressText = document.getElementById("progress-text");
const realTimeWpmSpan = document.getElementById("real-time-wpm");
const darkModeToggle = document.getElementById("dark-mode-toggle");
const themeIcon = document.getElementById("theme-icon");
const imeCompositionDisplay = document.getElementById("ime-composition-display");

// ===== 初期化処理 ===== //
window.addEventListener("DOMContentLoaded", () => {
  try {
    console.log("🚀 Trace Type アプリケーションを初期化中...");
    
    // DOM要素の存在確認
    const requiredElements = [
      'file-select', 'start-btn', 'text-display', 'text-input', 
      'timer', 'mouse-clicks', 'input-chars', 'key-display'
    ];
    
    const missingElements = requiredElements.filter(id => !document.getElementById(id));
    if (missingElements.length > 0) {
      console.error('必要なDOM要素が見つかりません:', missingElements);
      alert('アプリケーションの初期化に失敗しました。ページをリロードしてください。');
      return;
    }
    
    loadFileList();
    disablePasteAndDrop();
    setupMouseClickTracking();
    initializeDarkMode();
    setupErrorHandling();
    
    console.log("✅ 初期化が完了しました");
  } catch (error) {
    console.error('初期化エラー:', error);
    alert('アプリケーションの初期化中にエラーが発生しました。ページをリロードしてください。');
  }
});

// ---- 練習ファイル一覧を読み込む ---- //
function loadFileList() {
  fetch("Practice/files.json")
    .then(res => {
      if (!res.ok) throw new Error(`files.json の読み込みに失敗しました (${res.status})`);
      return res.json();
    })
    .then(fileList => {
      if (!Array.isArray(fileList)) {
        throw new Error('ファイルリストの形式が正しくありません');
      }
      
      fileList.forEach(filename => {
        if (filename && typeof filename === 'string') {
          const option = document.createElement("option");
          option.value = filename;
          option.textContent = filename;
          fileSelect.appendChild(option);
        }
      });
      
      if (fileSelect.options.length > 1) { // デフォルトオプション以外があるか
        fileSelect.disabled = false;
        startBtn.disabled = false;
      } else {
        throw new Error('利用可能な練習ファイルが見つかりません');
      }
    })
    .catch(err => {
      console.error('ファイルリスト読み込みエラー:', err);
      alert(`練習ファイル一覧の読み込みに失敗しました。\n詳細: ${err.message}`);
      
      // フォールバック: デフォルトファイルを追加
      const defaultOption = document.createElement("option");
      defaultOption.value = "sample.md";
      defaultOption.textContent = "サンプルテキスト";
      fileSelect.appendChild(defaultOption);
      fileSelect.disabled = false;
      startBtn.disabled = false;
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
  if (!filename || typeof filename !== 'string') {
    alert('ファイル名が正しくありません。');
    return;
  }
  
  fetch(`Practice/${encodeURIComponent(filename)}`)
    .then(res => {
      if (!res.ok) throw new Error(`md ファイルの読み込みに失敗しました (${res.status})`);
      return res.text();
    })
    .then(markdown => {
      if (!markdown || markdown.trim().length === 0) {
        throw new Error('ファイルが空です');
      }
      
      practiceText = markdown.replace(/\r\n/g, "\n").trim();
      
      if (practiceText.length === 0) {
        throw new Error('有効なテキストが見つかりません');
      }
      
      resetTypingArea();
      renderDisplay();   // 初期表示（全て灰色）
      activateTyping();
    })
    .catch(err => {
      console.error('練習テキスト読み込みエラー:', err);
      alert(`練習テキストの読み込みに失敗しました。\n詳細: ${err.message}`);
      
      // フォールバック: デフォルトテキストを使用
      practiceText = "これはサンプルテキストです。\n実際の練習ファイルが読み込めませんでした。";
      resetTypingArea();
      renderDisplay();
      activateTyping();
    });
}

// ---- タイピングエリアを初期化 ---- //
function resetTypingArea() {
  try {
    userInput = "";
    lockedLength = 0;
    totalKeystrokes = 0;
    errorCount = 0;
    
    // タイマーをクリア
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
    
    if (timerSpan) {
      timerSpan.textContent = "0.00";
    }
    
    startTime = null;
    
    // テキスト表示をクリア
    if (textDisplay) {
      textDisplay.innerHTML = "";
      textDisplay.classList.remove('loading');
    }
    
    // 入力エリアをリセット
    if (textInput) {
      textInput.value = "";
      textInput.disabled = false;
      // フォーカスは非同期で実行してDOMの更新を待つ
      setTimeout(() => {
        if (textInput && !textInput.disabled) {
          textInput.focus();
        }
      }, 100);
    }
    
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
    
    // スクロール位置をリセット
    resetScrollPosition();
    
    // IME状態をリセット
    isComposing = false;
    hideImeIndicator();
    hideImePreview();
    hideImeCompositionKeyDisplay();
    
  } catch (error) {
    console.error('タイピングエリアリセットエラー:', error);
  }
}


// ---- 背景テキスト表示を更新 ---- //
function renderDisplay() {
  try {
    if (!practiceText || practiceText.length === 0) {
      console.warn('練習テキストが設定されていません');
      return;
    }
    
    if (!textDisplay) {
      console.error('テキスト表示要素が見つかりません');
      return;
    }
    
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
  } catch (error) {
    console.error('表示更新でエラーが発生しました:', error);
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
  
  // 初期入力文字数表示
  updateInputCharsDisplay();
  
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
  
  // 入力文字数表示を更新
  updateInputCharsDisplay();

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
  updateImeCompositionKeyDisplay(e.data || '');
}

// ---- IME変換終了時の処理 ---- //
function onCompositionEnd(e) {
  isComposing = false;
  hideImeIndicator();
  hideImePreview();
  hideImeCompositionKeyDisplay();
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
  
  // 入力文字数を更新
  updateInputCharsDisplay();
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

// ---- 入力文字数表示を更新 ---- //
function updateInputCharsDisplay() {
  const inputCharsElement = document.getElementById("input-chars");
  if (inputCharsElement) {
    inputCharsElement.textContent = userInput.length;
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
  try {
    const preview = document.getElementById('ime-preview');
    if (!preview) {
      console.warn('IMEプレビュー要素が見つかりません');
      return;
    }
    
    if (compositionText && compositionText.trim()) {
      preview.textContent = compositionText;
      preview.classList.add('visible');
      
      // プレビューの位置を現在の文字位置に調整（キー表示エリアと被らないように）
      const currentCharSpan = textDisplay ? textDisplay.querySelector('.current-char') : null;
      const keyDisplayArea = document.querySelector('.key-display-area');
      
      if (currentCharSpan && keyDisplayArea) {
        const rect = currentCharSpan.getBoundingClientRect();
        const containerRect = textDisplay.getBoundingClientRect();
        const keyDisplayRect = keyDisplayArea.getBoundingClientRect();
        
        // 基本位置を設定
        let left = Math.max(0, rect.left - containerRect.left);
        let top = -80; // デフォルトは上に表示
        
        // キー表示エリアと重なる場合は下に表示
        if (rect.top - 80 < keyDisplayRect.bottom + 20) {
          top = 40; // 下に表示
          preview.classList.add('position-bottom');
          preview.classList.remove('position-top');
        } else {
          preview.classList.add('position-top');
          preview.classList.remove('position-bottom');
        }
        
        // 画面端でのはみ出しを防ぐ
        const maxLeft = containerRect.width - preview.offsetWidth;
        left = Math.min(left, Math.max(0, maxLeft));
        
        preview.style.left = left + 'px';
        preview.style.top = top + 'px';
      }
    } else {
      preview.classList.remove('visible');
    }
  } catch (error) {
    console.error('IMEプレビュー更新でエラーが発生しました:', error);
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

// ---- IME変換中の文字をキー表示エリアに表示 ---- //
function updateImeCompositionKeyDisplay(compositionText) {
  if (!imeCompositionDisplay) return;
  
  if (compositionText && compositionText.trim() !== '') {
    imeCompositionDisplay.textContent = `入力中: ${compositionText}`;
    imeCompositionDisplay.style.display = 'block';
  } else {
    imeCompositionDisplay.style.display = 'none';
  }
}

// ---- IME変換中の文字表示を非表示 ---- //
function hideImeCompositionKeyDisplay() {
  if (imeCompositionDisplay) {
    imeCompositionDisplay.style.display = 'none';
    imeCompositionDisplay.textContent = '';
  }
}


// ---- 入力モード表示を更新 ---- //
function updateInputModeDisplay(currentChar) {
  if (!inputModeIndicator) return;
  
  // 文字種別を判定
  let mode = '';
  if (/[a-zA-Z0-9\s\[\]{}();:'",.!?@#$%^&*\-=_+\\|`~<>/]/.test(currentChar)) {
    mode = '<span style="color: #0ea5e9; font-weight: 600;">[半角]</span>';
  } else if (/[あ-んア-ンー々〇〻]/.test(currentChar)) {
    mode = '<span style="color: #c955f0; font-weight: 600;">[全角]</span>';
  } else if (/[、。「」『』（）【】〈〉《》〔〕［］｛｝〜・…‥！？：；]/.test(currentChar)) {
    mode = '<span style="color: #22c55e; font-weight: 600;">[記号]</span>';
  } else {
    mode = '<span style="color: #ef4444; font-weight: 600;">[その他]</span>';
  }
  
  inputModeIndicator.innerHTML = mode;
}

// ---- キー表示を更新 ---- //
function updateKeyDisplay() {
  try {
    if (!keyDisplay) {
      console.warn('キー表示要素が見つかりません');
      return;
    }
    
    if (!practiceText) {
      keyDisplay.innerHTML = '<span style="color: #dc3545;">テキストが読み込まれていません</span>';
      return;
    }
    
    // 練習が完了している場合
    if (userInput.length >= practiceText.length) {
      keyDisplay.innerHTML = '<span style="color: #28a745; font-weight: bold;">完了！</span>';
      if (inputModeIndicator) {
        inputModeIndicator.innerHTML = '';
      }
      return;
    }
    
    // 現在入力すべき文字を取得
    const currentChar = practiceText[userInput.length];
    if (currentChar === undefined) {
      keyDisplay.innerHTML = '<span style="color: #dc3545;">文字が見つかりません</span>';
      return;
    }
    
    // 入力モード表示を更新
    updateInputModeDisplay(currentChar);
    
    // 既存のキーマッピングを取得
    const keyMapping = jisKeyMap[currentChar];
    
    if (!keyMapping) {
      // マッピングが見つからない場合
      const escapedChar = currentChar.replace(/</g, '&lt;').replace(/>/g, '&gt;');
      keyDisplay.innerHTML = `<span style="color: #dc3545;">「${escapedChar}」</span>`;
      return;
    }
    
    // 複数の読み方がある場合の処理（例：しゃ → ['sha', 'sya']）
    if (Array.isArray(keyMapping) && keyMapping.length > 1 && keyMapping.every(item => typeof item === 'string' && item.length > 1)) {
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
      const escapedKey = key.replace(/</g, '&lt;').replace(/>/g, '&gt;');
      return `<span class="key-button">${escapedKey}</span>`;
    });
    
    if (keyElements.length === 1) {
      // 単一キーの場合
      keyDisplay.innerHTML = keyElements[0];
    } else {
      // 複数キーの組み合わせの場合（例：Shift + R）
      keyDisplay.innerHTML = keyElements.join('<span class="key-plus"> + </span>');
    }
  } catch (error) {
    console.error('キー表示更新でエラーが発生しました:', error);
    if (keyDisplay) {
      keyDisplay.innerHTML = '<span style="color: #dc3545;">エラーが発生しました</span>';
    }
  }
}

// ---- 現在の文字へスクロール ---- //
function scrollToCurrentChar(spanElements) {
  try {
    if (!spanElements || userInput.length >= practiceText.length) {
      return;
    }
    
    const targetElement = spanElements[userInput.length];
    if (!targetElement) {
      return;
    }
    
    const container = textDisplay.parentElement; // typing-area
    if (!container) {
      console.warn('スクロールコンテナが見つかりません');
      return;
    }
    
    // 要素の位置を取得
    const elementRect = targetElement.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    
    // 要素がコンテナの表示範囲内にあるかチェック
    const isElementVisible = (
      elementRect.top >= containerRect.top &&
      elementRect.bottom <= containerRect.bottom
    );
    
    // 要素が見えない場合のみスクロール
    if (!isElementVisible) {
      // コンテナの中央に要素が来るようにスクロール位置を計算
      const scrollTop = container.scrollTop + (elementRect.top - containerRect.top) - (container.clientHeight / 2) + (elementRect.height / 2);
      
      // スムーズスクロール
      container.scrollTo({
        top: Math.max(0, scrollTop),
        behavior: 'smooth'
      });
    }
  } catch (error) {
    console.error('スクロール処理でエラーが発生しました:', error);
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
    
    // AudioContextが無効な場合は早期リターン
    if (audioContext.state === 'suspended') {
      audioContext.resume().catch(() => {
        // AudioContext の resume に失敗した場合は静かに失敗
      });
    }
    
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
    
    // AudioContextを適切にクリーンアップ
    setTimeout(() => {
      try {
        audioContext.close();
      } catch (e) {
        // クリーンアップエラーは無視
      }
    }, 200);
  } catch (error) {
    // サウンド再生に失敗してもエラーを表示しない
    console.debug('サウンド再生に失敗:', error.message);
  }
}

// ---- 低解像度レイアウト初期化 ---- //
function initializeLowResolutionLayout() {
  const statsToggle = document.getElementById('stats-toggle');
  const statsGrid = document.getElementById('stats-grid');
  
  // 低解像度でのみトグルボタンを表示
  if (window.innerWidth <= 1366 && window.innerHeight <= 768) {
    if (statsToggle) {
      statsToggle.style.display = 'flex';
      statsToggle.addEventListener('click', toggleStatsVisibility);
    }
  }
  
  // リサイズ時のハンドラ
  window.addEventListener('resize', () => {
    if (window.innerWidth <= 1366 && window.innerHeight <= 768) {
      if (statsToggle) statsToggle.style.display = 'flex';
    } else {
      if (statsToggle) statsToggle.style.display = 'none';
      if (statsGrid) statsGrid.classList.remove('hidden');
    }
  });
}

// ---- 統計表示切り替え ---- //
function toggleStatsVisibility() {
  const statsGrid = document.getElementById('stats-grid');
  const statsToggle = document.getElementById('stats-toggle');
  
  if (statsGrid) {
    if (statsGrid.classList.contains('hidden')) {
      statsGrid.classList.remove('hidden');
      if (statsToggle) statsToggle.textContent = '❌';
    } else {
      statsGrid.classList.add('hidden');
      if (statsToggle) statsToggle.textContent = '📊';
    }
  }
}

// ---- エラーハンドリング設定 ---- //
function setupErrorHandling() {
  // グローバルエラーハンドラー
  window.addEventListener('error', (event) => {
    console.error('グローバルエラー:', {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      error: event.error
    });
    
    // ユーザーにエラーを通知（重大なエラーのみ）
    if (event.error && event.error.name !== 'TypeError') {
      console.warn('アプリケーションでエラーが発生しました。ファンクションの一部が動作しない可能性があります。');
    }
  });
  
  // Promiseのリジェクションハンドラー
  window.addEventListener('unhandledrejection', (event) => {
    console.error('未処理のPromiseリジェクション:', event.reason);
    
    // ネットワークエラーの場合はユーザーに通知
    if (event.reason && event.reason.message && event.reason.message.includes('fetch')) {
      console.warn('ネットワークエラーが発生しました。インターネット接続を確認してください。');
    }
    
    // エラーを処理済みとしてマーク（コンソールに表示されないように）
    event.preventDefault();
  });
}

// ---- タイピングエリアのスクロール位置をリセット ---- //
function resetScrollPosition() {
  try {
    const typingArea = document.querySelector('.typing-area');
    if (typingArea) {
      typingArea.scrollTop = 0;
      typingArea.scrollLeft = 0;
    }
  } catch (error) {
    console.error('スクロールリセットエラー:', error);
  }
}

// ---- アプリ初期化 ---- //
window.addEventListener("DOMContentLoaded", function() {
  console.log("🚀 Trace Type アプリケーションを読み込み中...");
  
  try {
    loadFileList();
    initializeDarkMode();
    initializeLowResolutionLayout();
    setupMouseClickTracking();
    
    console.log("✅ アプリケーションの初期化が完了しました！");
  } catch (error) {
    console.error('アプリ初期化エラー:', error);
  }
});
