// ---- グローバル変数 ---- //
let practiceText = "";      // 練習テキスト（プレーンテキスト）
let userInput = "";         // ユーザーの入力履歴
let composingText = "";     // IME入力中の未確定文字列
let startTime = null;       // 開始時刻（Date オブジェクト）
let timerInterval = null;   // タイマー更新用 interval ID
let isComposing = false;    // IME変換中かどうかのフラグ
let mouseClickCount = 0;    // マウスクリック回数
let lockedLength = 0;       // ロックされた文字数（正しく入力完了した文字数）
let totalKeystrokes = 0;    // 総キーストローク数
let errorCount = 0;         // エラー回数
let soundEnabled = true;    // サウンド有効フラグ

// Input Guide Elements
let guideNextCharElement = null;
let guideKeyHintElement = null;

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

  // 全角数字
  '０': ['０'], '１': ['１'], '２': ['２'], '３': ['３'], '４': ['４'],
  '５': ['５'], '６': ['６'], '７': ['７'], '８': ['８'], '９': ['９'],

  // 特殊文字
  ' ': ['スペース'], '　': ['全角スペース'], '\n': ['Enter'], '\t': ['Tab'],

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
  '、': ['、'], '。': ['。'], '，': ['，'], '．': ['．'], '「': ['「'], '」': ['」'], '『': ['『'], '』': ['』'],
  '（': ['（'], '）': ['）'], '【': ['【'], '】': ['】'], '〈': ['〈'], '〉': ['〉'],
  '《': ['《'], '》': ['》'], '〔': ['〔'], '〕': ['〕'], '［': ['［'], '］': ['］'],
  '｛': ['｛'], '｝': ['｝'], '〜': ['〜'], '・': ['・'], '…': ['…'], '‥': ['‥'],
  '！': ['！'], '？': ['！'], '：': ['：'], '；': ['；'], 'ー': ['ー'],
  '○': ['○'], '△': ['△']
};

// DOM 要素を取得
// DOM 要素 (初期化時に設定)
let fileSelect = null;
let startBtn = null;
let typingContainer = null;
let textInput = null;
let timerSpan = null;
let mouseClicksSpan = null;
let inputCharsSpan = null;
let scoreArea = null;
let retryBtn = null;

let progressSection = null;
let progressBar = null;
let progressText = null;
let realTimeWpmSpan = null;
let darkModeToggle = null;
let themeIcon = null;
// No separate IME composition display needed as it is inline
let imeCompositionDisplay = null; // Defined for compatibility if needed
// No separate IME composition display needed as it is inline
// const imeCompositionDisplay = document.getElementById("ime-composition-display");

// ---- DOM要素初期化 ---- //
function initializeDOM() {
  fileSelect = document.getElementById("file-select");
  startBtn = document.getElementById("start-btn");
  typingContainer = document.getElementById("typing-container");
  textInput = document.getElementById("text-input");
  timerSpan = document.getElementById("timer");
  mouseClicksSpan = document.getElementById("mouse-clicks");
  inputCharsSpan = document.getElementById("input-chars");
  scoreArea = document.getElementById("score-area");
  retryBtn = document.getElementById("retry-btn");
  progressSection = document.getElementById("progress-section");
  progressBar = document.getElementById("progress-bar");
  progressText = document.getElementById("progress-text");
  realTimeWpmSpan = document.getElementById("real-time-wpm");
  darkModeToggle = document.getElementById("dark-mode-toggle");
  themeIcon = document.getElementById("theme-icon");
  imeCompositionDisplay = null; // No longer used

  // Input Guide Elements
  guideNextCharElement = document.getElementById("guide-next-char");
  guideKeyHintElement = document.getElementById("guide-key-hint");
}

// ---- イベントリスナー設定 ---- //
function setupEventListeners() {
  // スタートボタン
  if (startBtn) {
    startBtn.addEventListener("click", () => {
      const selectedFile = fileSelect.value;
      if (!selectedFile) {
        alert("練習ファイルを選択してください。");
        return;
      }
      fetchPracticeText(selectedFile);
    });
  }

  // リトライボタン
  if (retryBtn) {
    retryBtn.addEventListener("click", () => {
      if (practiceText) {
        resetTypingArea();
        renderDisplay();
        activateTyping();
      }
    });
  }

  // グローバルキーボードショートカット
  document.addEventListener("keydown", function (e) {
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

// ===== 初期化処理 ===== //
window.addEventListener("DOMContentLoaded", () => {
  try {
    console.log("🚀 Trace Type アプリケーションを初期化中...");

    // DOM要素を初期化
    initializeDOM();

    // DOM要素の存在確認 (initializeDOM内で取得失敗していないか)
    const requiredElements = [
      fileSelect, startBtn, typingContainer,
      textInput, timerSpan, mouseClicksSpan,
      inputCharsSpan
    ];

    if (requiredElements.some(el => !el)) {
      console.error('必要なDOM要素が見つかりません');
      // どの要素がないか特定
      if (!fileSelect) console.error('Missing: file-select');
      if (!startBtn) console.error('Missing: start-btn');
      if (!typingContainer) console.error('Missing: typing-container');
      if (!textInput) console.error('Missing: text-input');
      if (!timerSpan) console.error('Missing: timer');
      if (!mouseClicksSpan) console.error('Missing: mouse-clicks');
      if (!inputCharsSpan) console.error('Missing: input-chars');

      alert('アプリケーションの初期化に失敗しました。ページをリロードしてください。');
      return;
    }

    setupEventListeners();
    loadFileList();
    disablePasteAndDrop();
    setupMouseClickTracking();
    initializeDarkMode();
    initializeLowResolutionLayout();
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

    // コンテナをクリア
    if (typingContainer) {
      typingContainer.innerHTML = "";
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
      // 即座にもフォーカスを試みる
      textInput.focus();
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

    // IME状態をリセット
    isComposing = false;
    composingText = "";
    hideImeIndicator();


  } catch (error) {
    console.error('タイピングエリアリセットエラー:', error);
  }
}

// ---- テキストを行に分割するヘルパー ----
function splitTextIntoLines(text) {
  // 単純に改行で分割
  return text.split('\n');
}

// ---- 表示を更新（見本テキストのハイライト） ---- //
function renderDisplay() {
  try {
    if (!practiceText || practiceText.length === 0) {
      if (typingContainer) typingContainer.innerHTML = "";
      return;
    }

    if (!typingContainer) return;

    // パフォーマンスのため、既存のDOMがあれば更新、なければ生成としたいが
    // ここではシンプルに再生成する（行数が多い場合は要注意）
    typingContainer.innerHTML = "";

    const lines = splitTextIntoLines(practiceText);

    let currentInputHeader = 0; // ユーザー入力の現在位置
    let activeLineIndex = -1; // カーソルがある行

    lines.forEach((lineText, index) => {
      // この行の範囲
      const isLastLine = index === lines.length - 1;
      const lineLength = lineText.length + (isLastLine ? 0 : 1); // +1 for \n

      // カーソル位置判定
      // ユーザー入力がこの行の範囲内にある、または
      // ユーザー入力がまだここまで達していない最初の行
      const isLineActive = (userInput.length >= currentInputHeader && userInput.length < currentInputHeader + lineLength);
      if (isLineActive) {
        activeLineIndex = index;
      }
      // もしくは、入力が完了していて、かつ最後の行まで入力済みの場合の考慮は別途不要（activeLineIndexは更新されないだけ）
      // ただし完了時は activeLineIndex = lines.length - 1 としたい場合もあるが、要件による

      // 行コンテナ作成
      const rowDiv = document.createElement('div');
      rowDiv.className = `line-row ${isLineActive ? 'active' : ''}`;
      rowDiv.id = `line-${index}`;

      // 各文字をスパンで生成
      for (let i = 0; i < lineText.length; i++) {
        const refChar = lineText[i];
        const span = document.createElement('span');
        span.textContent = refChar;
        span.className = 'untyped-char'; // デフォルト

        // 文字の絶対インデックス
        const charGlobalIndex = currentInputHeader + i;

        if (charGlobalIndex < userInput.length) {
          // 入力済み
          const inputChar = userInput[charGlobalIndex];
          if (inputChar === refChar) {
            span.className = 'typed-correct';
          } else {
            span.className = 'typed-incorrect';
          }
        } else if (charGlobalIndex === userInput.length) {
          // カーソル位置（次の入力位置）
          span.className = 'current-char';
        }

        rowDiv.appendChild(span);
      }

      // 改行文字の扱い (表示のみ)
      if (!isLastLine) {
        const returnSpan = document.createElement('span');
        returnSpan.textContent = '↵';
        returnSpan.className = 'return-mark untyped';

        const returnGlobalIndex = currentInputHeader + lineText.length;
        if (returnGlobalIndex < userInput.length) {
          // 入力済み（改行済み）
          // ユーザー入力の該当箇所が \n かどうかチェック
          if (userInput[returnGlobalIndex] === '\n') {
            returnSpan.className = 'return-mark correct';
          } else {
            returnSpan.className = 'return-mark incorrect';
          }
        } else if (returnGlobalIndex === userInput.length) {
          returnSpan.className = 'current-char return-mark'; // カーソルが改行にある場合
        }
        rowDiv.appendChild(returnSpan);
      }

      typingContainer.appendChild(rowDiv);
      currentInputHeader += lineLength;
    });

    // 自動スクロール
    if (activeLineIndex !== -1) {
      const activeRow = document.getElementById(`line-${activeLineIndex}`);
      if (activeRow) {
        activeRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }

    // 入力ガイドを更新
    updateInputGuide();

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

  // 確実にフォーカスを当てる
  setTimeout(() => {
    if (textInput && !textInput.disabled) {
      textInput.focus();
      console.log('Input focused in activateTyping');
    }
  }, 150);
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
  composingText = ""; // 開始時にリセット
  showImeIndicator();
}

// ---- IME変換更新時の処理 ---- //
function onCompositionUpdate(e) {
  composingText = e.data || '';
  // Removed custom preview updates as textarea handles it natively


  // インライン表示のために再描画（見本側にも何らかのアクションが必要ならここ）
  // 分離モードでは、IME入力中の文字は textarea 側に自然に表示されるため、
  // 見本側には特に何も表示しなくて良い（あるいはカーソル位置を強調するなど）
  renderDisplay();
}

// ---- IME変換終了時の処理 ---- //
function onCompositionEnd(e) {
  isComposing = false;
  composingText = ""; // 確定したのでリセット
  hideImeIndicator();

  // hideImeCompositionKeyDisplay(); // Removed
  // updateImeCompositionDisplay(); // Removed

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

  // 記号入力は全て許可（IME経由での入力を含む）
  // jisKeyMapに定義されている記号は全て入力可能
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
    // クリック時にinputにフォーカスを当てる
    if (textInput && !textInput.disabled) {
      textInput.focus();
    }
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

// ---- IMEインジケータ表示 ---- //
function showImeIndicator() {
  const indicator = document.getElementById("ime-indicator");
  if (indicator) {
    indicator.classList.add("active");
  }
}

// ---- IMEインジケータ非表示 ---- //
function hideImeIndicator() {
  const indicator = document.getElementById("ime-indicator");
  if (indicator) {
    indicator.classList.remove("active");
  }
}

// ---- 入力ガイド更新 ---- //
function updateInputGuide() {
  if (!guideNextCharElement || !guideKeyHintElement) return;

  // テキストがない、または完了している場合
  if (!practiceText || userInput.length >= practiceText.length) {
    guideNextCharElement.textContent = "-";
    guideKeyHintElement.innerHTML = '<span class="text-sm text-gray-500 dark:text-gray-400">完了！</span>';
    return;
  }

  const nextCharIndex = userInput.length;
  const nextChar = practiceText[nextCharIndex];

  // 次の文字を表示
  // 改行文字の場合は表示を変える
  if (nextChar === '\n') {
    guideNextCharElement.textContent = '↵';
  } else {
    guideNextCharElement.textContent = nextChar;
  }

  // キーヒントを表示
  guideKeyHintElement.innerHTML = ''; // クリア

  // jisKeyMapから検索
  let keys = jisKeyMap[nextChar];

  // 見つからない場合は文字そのものを表示（漢字など）
  if (!keys) {
    // もし改行ならEnter
    if (nextChar === '\n') {
      keys = ['Enter'];
    } else {
      keys = [nextChar];
    }
  }

  // キーを表示用HTMLに変換して追加
  keys.forEach(key => {
    const keySpan = document.createElement('span');
    keySpan.className = 'key-button'; // styles.cssで定義済み

    // Shiftなどの修飾キーを含む場合の表示調整（例: ['Shift', 'A']）は
    // jisKeyMapの構造上、配列の要素として渡ってくるわけではなく、要素自体が配列になるわけではない
    // jisKeyMapの定義を見ると: 'A': ['Shift', 'A'] となっている
    // つまり keys は ['Shift', 'A'] のような配列になる可能性がある

    // このループは keys配列（文字の構成要素）を回しているつもりだが、JISマップの定義は
    // 1つの文字に対して「キーの配列」を返している。
    // 例: 'か' -> ['k', 'a'] （2文字打つ）
    // 例: 'A' -> ['Shift', 'A'] （Shift押しながらA）

    // なので、これは「一連のキーストローク」なのか「同時押し」なのかを区別する必要があるが、
    // 現在のマップ定義は混在している。
    // 英大文字: ['Shift', 'A'] -> ShiftとAの同時押し（あるいは順押し）
    // ひらがな: ['k', 'a'] -> kのあとにa

    // 簡易的にすべて「キー」として並べる
    keySpan.textContent = key;
    guideKeyHintElement.appendChild(keySpan);

    // キーの間にプラス記号などは入れない（ローマ字入力 k a などがあるため）
    // ただし、Shiftの場合は + があったほうがわかりやすいかも？
    // 現状は単純に並べる
  });
}

// ---- ダークモード初期化 ---- //
function initializeDarkMode() {
  const isDark = localStorage.getItem('theme') === 'dark' ||
    (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);

  if (isDark) {
    document.documentElement.classList.add('dark');
    themeIcon.textContent = '☀️';
  } else {
    document.documentElement.classList.remove('dark');
    themeIcon.textContent = '🌙';
  }

  if (darkModeToggle) {
    darkModeToggle.addEventListener('click', () => {
      document.documentElement.classList.toggle('dark');
      if (document.documentElement.classList.contains('dark')) {
        localStorage.setItem('theme', 'dark');
        themeIcon.textContent = '☀️';
      } else {
        localStorage.setItem('theme', 'light');
        themeIcon.textContent = '🌙';
      }
    });
  }
}

// ---- 低解像度レイアウト初期化 ---- //
function initializeLowResolutionLayout() {
  // 必要に応じて実装
}

// ---- エラーハンドリング設定 ---- //
function setupErrorHandling() {
  window.addEventListener('error', (event) => {
    console.error('Global error caught:', event.error);
  });
}

// ---- サウンド再生 ---- //
function playSound(type) {
  // 簡易サウンド実装 (Web Audio API or HTML5 Audio)
  // 今回は省略、または必要に応じて追加
}
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

      // 現在の文字表示エリアの中央に配置
      if (currentCharDisplay) {
        const rect = currentCharDisplay.getBoundingClientRect();
        const containerRect = currentCharDisplay.parentElement.getBoundingClientRect();

        // 中央に配置
        const left = (containerRect.width - preview.offsetWidth) / 2;
        preview.style.left = Math.max(20, left) + 'px';
        preview.style.top = '-60px';
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
    imeCompositionDisplay.classList.remove('hidden');
    imeCompositionDisplay.classList.add('flex');
  } else {
    imeCompositionDisplay.classList.add('hidden');
    imeCompositionDisplay.classList.remove('flex');
  }
}

// ---- IME変換中の文字表示を非表示 ---- //
function hideImeCompositionKeyDisplay() {
  if (imeCompositionDisplay) {
    imeCompositionDisplay.classList.add('hidden');
    imeCompositionDisplay.classList.remove('flex');
    imeCompositionDisplay.textContent = '';
  }
}


// ---- 入力モード表示を更新 (削除済み) ---- //
function updateInputModeDisplay(currentChar) {
  // UI簡素化のため削除
}

// ---- キー表示を更新 ---- //
function updateKeyDisplay() {
  // キーガイド機能は削除されたため、何もしない
}



// スクロール関数は不要（新しいレイアウトでは使用しない）

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

// スクロールリセット関数は不要（新しいレイアウトでは使用しない）
