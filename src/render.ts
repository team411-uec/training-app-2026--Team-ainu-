// 描画層 (render.ts)
// 状態を受け取って画面(DOM)に表示するだけを担当する。
// おみくじを引くロジックは omikuji.ts、ボタンと処理の連携は main.ts が持つ。

import type { OmikujiResult } from "./omikuji";

// ステップ1（最初の課題）: この関数を実装する。
//
// いまは「引く」ボタンを押すと開発者ツール(F12)の Console に
// 「引いた結果: 大吉」と出るが、画面の文字は変わらない。
// この関数の中身が空だからで、ここに DOM 操作を書けば画面に反映される。
//
// ヒント:
//  - 表示先は index.html の id="result" の要素。document.getElementById で取れる。
//  - 要素の中の文字は textContent で書き換えられる。
//  - result が null のとき（リセット直後など）は初期メッセージを出す。
export function renderResult(result: OmikujiResult | null): void {
  renderApp();
  const resultElement = document.getElementById("result");
  const gekiatsuAudio = document.getElementById("gekiatsu-sound") as HTMLAudioElement | null;
  const drawAudio = document.getElementById("draw-sound") as HTMLAudioElement | null;
  const daikichiAudio = document.getElementById("daikichi-sound") as HTMLAudioElement | null;
 
  if (!resultElement) return;

  // リセット時
  if (result === null) {
    resultElement.textContent = "おみくじを引いてね！";
    resultElement.classList.remove("gekiaTsu");
    return;
  }

  // 大吉の場合
  if (result === "大吉") {
    if (gekiatsuAudio) {
      gekiatsuAudio.currentTime = 0;
      gekiatsuAudio.play().catch((err) => console.log("大吉音再生エラー", err));
    }
    // 激アツ演出開始
    resultElement.classList.add("gekiaTsu");
    resultElement.textContent = "激アツ！！";

    // 1.2秒後に「大吉」に変更
    setTimeout(() => {
if (daikichiAudio) {
        daikichiAudio.currentTime = 0;
        daikichiAudio.play().catch((err: Error) => console.log("大吉確定音再生エラー:", err));
      }

// 後光オーラ（daikichi-aura）と 飛び出る大吉文字（daikichi-impact）を一緒に配置
    resultElement.innerHTML = `
      <div class="daikichi-aura"></div>
      <span class="daikichi-impact">✨大吉✨</span>
    `;
  }, 2000);
     
  } else {
    if (drawAudio) {
      drawAudio.currentTime = 0;
      drawAudio.play().catch((err: Error) => console.log("通常音再生エラー:", err));
    }
    // 大吉以外は普通に表示
    resultElement.textContent = result;
    resultElement.classList.remove("gekiaTsu");
  }
}

// 1. omikuji.ts から getRemainingCount をインポート
import { drawOmikuji, getRemainingCount } from "./omikuji";

export function renderApp(): void {
  // 例: 残り枚数を取得してコンソールや画面に表示する
  const remaining = getRemainingCount();
  console.log(`現在の残りくじ枚数: ${remaining}枚`);

  // HTML要素に出力する場合の例:
  const countEl = document.getElementById("remaining");
  if (countEl) {
    countEl.textContent = `残りくじ: ${remaining}枚`;
  }
}

const button = document.getElementById('draw-button') as HTMLButtonElement | null;
const audio = document.getElementById('draw-sound') as HTMLAudioElement | null;

if (button && audio) {
  button.addEventListener('click', () => {
    audio.currentTime = 0; // 音声を先頭に戻す（連続クリック対応）
    audio.play().catch((error) => {
      console.log('再生がブロックされました:', error);
    });
  });
}

const button2 = document.getElementById('reset-button') as HTMLButtonElement | null;
const audio2 = document.getElementById('reset-sound') as HTMLAudioElement | null;

if (button2 && audio2) {
  button2.addEventListener('click', () => {
    audio2.currentTime = 0; // 音声を先頭に戻す（連続クリック対応）
    audio2.play().catch((error) => {
      console.log('再生がブロックされました:', error);
    });
  });
}


// 拡張ポイント（ステップ2以降）。必要になったら関数を足す。
//  - 履歴をリスト表示する: document.createElement で <li> を作り、<ul id="history"> に足す関数。
//  - 残りくじ枚数を表示する: omikuji.ts に残数を返す関数を足したうえで表示用の関数を足す。
