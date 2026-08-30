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
  // ステップ0 ではコンソールに結果が出るだけ。
  console.log("引いた結果:", result);
  renderApp();

  // TODO（ステップ1）: ここに DOM 操作を書いて、画面に結果を表示する。

  // id="result" の要素を取得
  const resultElement = document.getElementById("result");

  // 要素が存在しない場合は何もしない（安全対策）
  if (!resultElement) return;

  // result の状態に応じて表示テキストを切り替え
  if (result === null) {
    resultElement.textContent = "おみくじを引いてね！"; // 初期メッセージ（※画面の元テキストに合わせて調整可）
  } else {
    resultElement.textContent = result;
  }
}

// 1. omikuji.ts から getRemainingCount をインポート
import { drawOmikuji, getRemainingCount} from "./omikuji";

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


// 拡張ポイント（ステップ2以降）。必要になったら関数を足す。
//  - 履歴をリスト表示する: document.createElement で <li> を作り、<ul id="history"> に足す関数。
//  - 残りくじ枚数を表示する: omikuji.ts に残数を返す関数を足したうえで表示用の関数を足す。
