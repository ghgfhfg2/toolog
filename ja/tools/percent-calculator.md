---
layout: tool
title: パーセント計算機 | 割合・比率・増減率を計算
description: 数値の何%、全体に対する割合、前の値からの増加率・減少率を、計算式・入力例・エラー案内付きですぐ計算できます。
lang: ja
permalink: /ja/tools/percent-calculator/
canonical_url: /ja/tools/percent-calculator/
category: calculator
category_label: 計算/金融
thumbnail: /assets/thumbs/percent-calculator.svg
tool_key: percent-calculator
keywords: [パーセント計算, 割合計算, 増減率, 割引率, 比率計算]
related_tools: [discount-calculator, profit-margin-calculator, vat-calculator]
faq:
  - q: 割引率から割引額を計算するには？
    a: 「AのB%」を選び、基準値に元の価格、割合に割引率を入力します。
  - q: 前の値が0だと増減率を計算できないのはなぜですか？
    a: 増減率の式は前の値で割るため、0を基準にしたパーセント変化は定義できません。
  - q: 前の値が負の場合に計算しないのはなぜですか？
    a: 負の基準値からの増減率は用途によって解釈が異なり誤解を招くため、この一般計算機では正の前の値を必要とします。
alternate_urls:
  ko: /tools/percent-calculator/
  en: /en/tools/percent-calculator/
  ja: /ja/tools/percent-calculator/
---

## 3つの疑問に答えるパーセント計算機
1つの画面で次の3パターンを計算できます。計算はブラウザ内で行われ、入力値は送信されません。
- **AのB%** を求める
- **AはBの何%か** を求める
- **増加率/減少率** を求める

## 主な機能
- 実務で使う3つの計算モード
- 入力と同時に結果を表示
- 空欄、不正・過大な数値、0除算、解釈が曖昧な0以下の基準値をチェック
- モード別の入力例、クリア、有効な結果だけをコピー
- パーセントと差分を見やすく表示

## 使い方
1. 計算モードを選択
2. 数値を入力
3. 結果を確認
4. 割引計算やKPI比較に活用

## 計算式と入力ルール
- **AのB%:** `A × B ÷ 100`
- **AはBの何%:** `A ÷ B × 100`（全体値Bは0不可）
- **増減率:** `(現在値 - 前の値) ÷ 前の値 × 100`

一般的で明確な結果にするため、増減率は前の値が0より大きい場合だけ計算します。0を基準にした変化率は定義できず、負の基準値は用途別の解釈が必要です。小数は最大6桁まで表示します。

## 利用シーン
- セール割引額の確認
- 全体に対する売上構成比
- 前月比・前年同月比の確認

## 関連ツール
- セール価格を計算: [割引計算機]({{ '/ja/tools/discount-calculator/' | relative_url }})
- 利益率とマークアップを比較: [利益率計算機]({{ '/ja/tools/profit-margin-calculator/' | relative_url }})
- 税込み/税抜き計算: [VAT計算機]({{ '/ja/tools/vat-calculator/' | relative_url }})

## FAQ
### 前の値が0だと増減率を計算できないのはなぜですか？
式で前の値を分母にするためです。0からの変化は絶対差で比較してください。

### 前の値が負の場合に計算しないのはなぜですか？
赤字から黒字への変化などは通常の増減率と意味が異なります。損失や温度など、用途に合った計算基準を使ってください。
