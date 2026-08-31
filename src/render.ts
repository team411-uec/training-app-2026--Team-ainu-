// 描画層 (render.ts)
// 状態を受け取って画面(DOM)に表示するだけを担当する。
// おみくじを引くロジックは omikuji.ts、ボタンと処理の連携は main.ts が持つ。

import type { OmikujiResult, OmikujiData} from "./omikuji";
import { drawOmikuji, getRemainingCount } from "./omikuji";

// ミュート状態を管理するフラグ（初期値は音あり）
let isMuted: boolean = false;
let isAnimating: boolean = false;

export function getIsAnimating(): boolean {
  return isAnimating;
}

// すべての音を即座に停止する関数
function stopAllSounds(): void {
  const audios = document.querySelectorAll("audio");
  audios.forEach((audio) => {
    audio.pause();
    audio.currentTime = 0;
  });
}

// 音を安全に再生するヘルパー関数
function playSound(audioElement: HTMLAudioElement | null): void {
  // 消音モード時、または要素がない場合は鳴らさない
  if (isMuted || !audioElement) return;

  audioElement.currentTime = 0;
  audioElement.play().catch((err: Error) => console.log("音再生エラー:", err));
}

// 消音（ミュート）ボタンの切り替え処理
const muteButton = document.getElementById("mute-button") as HTMLButtonElement | null;

if (muteButton) {
  muteButton.addEventListener("click", () => {
    isMuted = !isMuted; // ON/OFF 反転

    if (isMuted) {
      stopAllSounds(); // ★ミュートにした瞬間だけ音を止める
      muteButton.textContent = "🔇 OFF";
      muteButton.classList.add("is-muted");
    } else {
      muteButton.textContent = "🔊 ON";
      muteButton.classList.remove("is-muted");
    }
  });
}

export function renderResult(result: OmikujiResult | null): void {
  renderApp();
  const resultElement = document.getElementById("result");
  const gekiatsuAudio = document.getElementById("gekiatsu-sound") as HTMLAudioElement | null;
  const drawAudio = document.getElementById("draw-sound") as HTMLAudioElement | null;
  const daikichiAudio = document.getElementById("daikichi-sound") as HTMLAudioElement | null;
  const resetAudio = document.getElementById("reset-sound") as HTMLAudioElement | null;

  if (!resultElement) return;

  // リセット時（result === null）
  if (result === null) {
    // 他の鳴っている音（激アツ音など）は止めて、リセット音を鳴らす
    stopAllSounds();
    playSound(resetAudio); // ★ここでリセット音を鳴らす
    isAnimating = false;

    resultElement.textContent = "おみくじを引いてね！";
    resultElement.classList.remove("gekiaTsu");
    return;
  }

  // 大吉の場合
  if (result === "大吉") {
    isAnimating = true;
    playSound(gekiatsuAudio);
    // 激アツ演出開始
    resultElement.classList.add("gekiaTsu");
    resultElement.textContent = "激アツ！！";

    // 2秒後に「大吉」に変更
    setTimeout(() => {
      playSound(daikichiAudio);
      // 後光オーラ（daikichi-aura）と 飛び出る大吉文字（daikichi-impact）を一緒に配置
      resultElement.innerHTML = `
        <div class="daikichi-aura"></div>
        <div class="result-card">
          <img src="atari1.jpg" alt="大吉" class="result-image daikichi-image" />
        <span class="daikichi-impact">✨大吉✨</span>
        <p class="result-comment"></p>
        </div>
      `;
      isAnimating = false;
    }, 2000);
      
  } else {
    // 大吉以外
    isAnimating = false;
    playSound(drawAudio);

    resultElement.textContent = result;
    resultElement.classList.remove("gekiaTsu");
  }
}



export function renderApp(): void {
  const remaining = getRemainingCount();
  console.log(`現在の残りくじ枚数: ${remaining}枚`);

  const countEl = document.getElementById("remaining");
  if (countEl) {
    countEl.textContent = `残りくじ: ${remaining}枚`;
  }
}

const container = document.getElementById('image-container')


// ※ 一番下にあった button / button2 の個別イベント登録は、
//   renderResult の中で全種類の音（引く音・大吉音・リセット音）を完璧に制御するため削除しました。

// 拡張ポイント（ステップ2以降）。必要になったら関数を足す。
//  - 履歴をリスト表示する: document.createElement で <li> を作り、<ul id="history"> に足す関数。
//  - 残りくじ枚数を表示する: omikuji.ts に残数を返す関数を足したうえで表示用の関数を足す。
