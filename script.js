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
  ' ': ['Space'], '\n': ['Enter'], '\t': ['Tab'],
  
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
  
  // よく使われる漢字（例として）
  '日': ['hi'], '本': ['hon'], '人': ['jin'], '国': ['koku'], '年': ['nen'],
  '時': ['ji'], '分': ['hun'], '月': ['getsu'], '火': ['ka'], '水': ['sui'],
  '木': ['moku'], '金': ['kin'], '土': ['do'], '大': ['dai'], '小': ['shou'],
  '中': ['naka'], '高': ['kou'], '学': ['gaku'], '校': ['kou'], '生': ['sei'],
  '先': ['sen'], '今': ['ima'], '何': ['nani'], '私': ['watashi'], '君': ['kimi'],
  '彼': ['kare'], '彼女': ['kanojo'], '友': ['tomo'], '家': ['ie'], '車': ['kuruma'],
  '電': ['den'], '話': ['wa'], '手': ['te'], '足': ['ashi'], '頭': ['atama'],
  '目': ['me'], '口': ['kuchi'], '耳': ['mimi'], '鼻': ['hana'], '心': ['kokoro'],
  '愛': ['ai'], '好': ['suki'], '嫌': ['iya'], '楽': ['raku'], '苦': ['ku'],
  '新': ['shin'], '古': ['furu'], '若': ['waka'], '老': ['rou'], '美': ['bi'],
  '醜': ['shuu'], '強': ['tsuyoi'], '弱': ['yowai'], '速': ['hayai'], '遅': ['osoi'],
  '上': ['ue'], '下': ['shita'], '左': ['hidari'], '右': ['migi'], '前': ['mae'],
  '後': ['ato'], '内': ['uchi'], '外': ['soto'], '東': ['higashi'], '西': ['nishi'],
  '南': ['minami'], '北': ['kita'], '山': ['yama'], '川': ['kawa'], '海': ['umi'],
  '空': ['sora'], '雲': ['kumo'], '雨': ['ame'], '雪': ['yuki'], '風': ['kaze'],
  '花': ['hana'], '木': ['ki'], '草': ['kusa'], '鳥': ['tori'], '魚': ['sakana'],
  '犬': ['inu'], '猫': ['neko'], '馬': ['uma'], '牛': ['ushi'], '豚': ['buta'],
  '食': ['shoku'], '飲': ['nomu'], '見': ['miru'], '聞': ['kiku'], '話': ['hanasu'],
  '読': ['yomu'], '書': ['kaku'], '歩': ['aruku'], '走': ['hashiru'], '立': ['tatsu'],
  '座': ['suwaru'], '寝': ['neru'], '起': ['okiru'], '来': ['kuru'], '行': ['iku'],
  '帰': ['kaeru'], '入': ['hairu'], '出': ['deru'], '買': ['kau'], '売': ['uru'],
  '作': ['tsukuru'], '使': ['tsukau'], '持': ['motsu'], '取': ['toru'], '置': ['oku'],
  '開': ['hiraku'], '閉': ['shimeru'], '始': ['hajimaru'], '終': ['owaru'], '続': ['tsuzuku'],
  '止': ['tomaru'], '動': ['ugoku'], '休': ['yasumu'], '働': ['hataraku'], '勉': ['ben'],
  '強': ['kyou'], '研': ['ken'], '究': ['kyuu'], '発': ['hatsu'], '表': ['hyou'],
  '会': ['kai'], '社': ['sha'], '員': ['in'], '長': ['chou'], '部': ['bu'],
  '課': ['ka'], '係': ['kakari'], '主': ['shu'], '任': ['nin'], '責': ['seki'],
  '問': ['mon'], '答': ['kotae'], '質': ['shitsu'], '量': ['ryou'], '数': ['kazu'],
  '計': ['kei'], '算': ['san'], '理': ['ri'], '科': ['ka'], '技': ['gi'],
  '術': ['jutsu'], '方': ['hou'], '法': ['hou'], '式': ['shiki'], '型': ['kata'],
  '形': ['katachi'], '色': ['iro'], '音': ['oto'], '声': ['koe'], '光': ['hikari'],
  '明': ['akarui'], '暗': ['kurai'], '重': ['omoi'], '軽': ['karui'], '硬': ['katai'],
  '柔': ['yawarakai'], '熱': ['atsui'], '冷': ['tsumetai'], '甘': ['amai'], '辛': ['karai'],
  '塩': ['shio'], '砂': ['suna'], '糖': ['tou'], '油': ['abura'], '酢': ['su'],
  '醤': ['shou'], '油': ['yu'], '味': ['aji'], '噌': ['miso'], '米': ['kome'],
  '麦': ['mugi'], '豆': ['mame'], '野': ['ya'], '菜': ['sai'], '果': ['ka'],
  '物': ['mono'], '肉': ['niku'], '卵': ['tamago'], '牛': ['gyuu'], '乳': ['nyuu'],
  '茶': ['cha'], '珈': ['ka'], '琲': ['hi'], '酒': ['sake'], '酎': ['chuu'],
  '焼': ['yaki'], '煮': ['ni'], '炒': ['itame'], '揚': ['age'], '蒸': ['mushi'],
  '切': ['kiru'], '刻': ['kizamu'], '混': ['mazeru'], '和': ['wa'], '洋': ['you'],
  '中': ['chuu'], '華': ['ka'], '料': ['ryou'], '理': ['ri'], '店': ['mise'],
  '屋': ['ya'], '場': ['ba'], '所': ['tokoro'], '地': ['chi'], '域': ['iki'],
  '区': ['ku'], '市': ['shi'], '町': ['machi'], '村': ['mura'], '県': ['ken'],
  '都': ['to'], '府': ['fu'], '道': ['dou'], '州': ['shuu'], '島': ['shima'],
  '駅': ['eki'], '空': ['kuu'], '港': ['kou'], '船': ['fune'], '電': ['densha'],
  '車': ['sha'], 'バス': ['basu'], 'タクシー': ['takushii'], '自': ['ji'], '転': ['ten'],
  '歩': ['ho'], '道': ['michi'], '橋': ['hashi'], '信': ['shin'], '号': ['gou'],
  '機': ['ki'], '械': ['kai'], 'コンピュータ': ['konpyuuta'], 'パソコン': ['pasokon'], 'スマホ': ['sumaho'],
  'インターネット': ['intaanetto'], 'メール': ['meeru'], 'サイト': ['saito'], 'ページ': ['peeji'], 'ファイル': ['fairu'],
  'データ': ['deeta'], 'プログラム': ['puroguramu'], 'システム': ['shisutemu'], 'ソフト': ['sofuto'], 'ハード': ['haado'],
  'ウェア': ['wea'], 'アプリ': ['apuri'], 'ゲーム': ['geemu'], '音': ['on'], '楽': ['gaku'],
  '映': ['ei'], '画': ['ga'], 'テレビ': ['terebi'], 'ラジオ': ['rajio'], '新': ['shin'],
  '聞': ['bun'], '雑': ['zasshi'], '誌': ['shi'], '本': ['hon'], '小': ['shou'],
  '説': ['setsu'], '漫': ['man'], '画': ['ga'], 'アニメ': ['anime'], 'ドラマ': ['dorama'],
  'スポーツ': ['supootsu'], '野': ['ya'], '球': ['kyuu'], 'サッカー': ['sakkaa'], 'テニス': ['tenisu'],
  'バスケ': ['basuke'], 'ボール': ['booru'], '水': ['sui'], '泳': ['ei'], 'ゴルフ': ['gorufu'],
  'スキー': ['sukii'], 'スケート': ['sukeeto'], '登': ['to'], '山': ['zan'], 'ハイキング': ['haikingu'],
  'キャンプ': ['kyanpu'], '旅': ['tabi'], '行': ['kou'], 'ホテル': ['hoteru'], '宿': ['yado'],
  '温': ['on'], '泉': ['sen'], '観': ['kan'], '光': ['kou'], '名': ['mei'],
  '所': ['sho'], '史': ['shi'], '跡': ['seki'], '博': ['haku'], '物': ['butsu'],
  '館': ['kan'], '美': ['bi'], '術': ['jutsu'], '展': ['ten'], '示': ['ji'],
  '会': ['kai'], 'コンサート': ['konsaato'], 'ライブ': ['raibu'], 'イベント': ['ibento'], 'パーティー': ['paatii'],
  '結': ['kekkon'], '婚': ['kon'], '式': ['shiki'], '誕': ['tan'], '生': ['jou'],
  '日': ['bi'], 'クリスマス': ['kurisumasu'], '正': ['shou'], '月': ['gatsu'], '春': ['haru'],
  '夏': ['natsu'], '秋': ['aki'], '冬': ['fuyu'], '季': ['ki'], '節': ['setsu'],
  '天': ['ten'], '気': ['ki'], '晴': ['hare'], '曇': ['kumori'], '雨': ['ame'],
  '雪': ['yuki'], '台': ['tai'], '風': ['fuu'], '地': ['ji'], '震': ['shin'],
  '火': ['ka'], '事': ['ji'], '事': ['jiko'], '故': ['ko'], '病': ['byou'],
  '気': ['ki'], '風': ['kaze'], '邪': ['ja'], '熱': ['netsu'], '咳': ['seki'],
  '頭': ['zu'], '痛': ['tsuu'], '腹': ['hara'], '痛': ['itai'], '歯': ['ha'],
  '痛': ['itami'], '目': ['me'], '薬': ['kusuri'], '病': ['byou'], '院': ['in'],
  '医': ['i'], '者': ['sha'], '看': ['kan'], '護': ['go'], '師': ['shi'],
  '注': ['chuu'], '射': ['sha'], '手': ['shu'], '術': ['jutsu'], '検': ['ken'],
  '査': ['sa'], '診': ['shin'], '断': ['dan'], '治': ['chi'], '療': ['ryou'],
  '健': ['ken'], '康': ['kou'], '運': ['un'], '動': ['dou'], '体': ['tai'],
  '操': ['sou'], 'ジョギング': ['jogingu'], 'ウォーキング': ['uookingu'], 'ヨガ': ['yoga'], 'ダンス': ['dansu'],
  '筋': ['kin'], 'トレ': ['tore'], 'ジム': ['jimu'], 'プール': ['puuru'], 'サウナ': ['sauna'],
  'マッサージ': ['massaaji'], 'エステ': ['esute'], '美': ['bi'], '容': ['you'], '院': ['in'],
  '髪': ['kami'], '切': ['kiri'], 'パーマ': ['paama'], 'カラー': ['karaa'], 'シャンプー': ['shanpuu'],
  'リンス': ['rinsu'], 'トリートメント': ['toriitomento'], 'ドライヤー': ['doraiyaa'], 'ブラシ': ['burashi'], '櫛': ['kushi'],
  '化': ['ke'], '粧': ['shou'], '品': ['hin'], '口': ['kuchi'], '紅': ['beni'],
  'ファンデーション': ['fandeeshon'], 'アイシャドウ': ['aishadou'], 'マスカラ': ['masukara'], 'チーク': ['chiiku'], '香': ['kou'],
  '水': ['sui'], 'コロン': ['koron'], 'ネイル': ['neiru'], 'マニキュア': ['manikyua'], 'ペディキュア': ['pedikyua'],
  
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
