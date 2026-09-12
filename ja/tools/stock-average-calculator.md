---
layout: tool
title: ナンピン計算機 | 平均取得単価・目標単価の必要株数
description: 現在の保有株数・平均単価と追加購入の株数・価格から、新しい平均取得単価、総投資額、目標単価までに必要な株数を計算します。
lang: ja
permalink: /ja/tools/stock-average-calculator/
canonical_url: /ja/tools/stock-average-calculator/
category: calculator
category_label: 投資
thumbnail: /assets/thumbs/stock-average-calculator.svg
image:
  path: /assets/thumbs/stock-average-calculator.svg
  alt: ナンピン計算機の結果プレビュー
tool_key: stock-average-calculator
keywords: [ナンピン計算, 平均取得単価, 追加購入, 目標単価, 株 平均単価 計算]
related_tools: [percent-calculator, profit-margin-calculator, compound-interest-calculator]
faq:
  - q: 追加購入後の平均取得単価はどう計算しますか？
    a: 現在の取得金額と追加購入金額を合計し、合計株数で割って計算します。
  - q: 目標平均単価を達成できないのはなぜですか？
    a: 同じ価格で買い続けても平均単価はその購入価格に近づくだけで下回らないため、目標は追加購入単価より高い必要があります。
  - q: 手数料・税金・為替費用は含まれますか？
    a: 含まれません。証券会社の手数料、税金、スプレッド、為替費用は別途考慮してください。
alternate_urls:
  ko: /tools/stock-average-calculator/
  en: /en/tools/stock-average-calculator/
  ja: /ja/tools/stock-average-calculator/
---

## 追加購入前に新しい平均取得単価を計算
この**ナンピン計算機**は、現在の保有株数・平均取得単価と追加購入予定を合算し、新しい平均単価、総保有株数、総投資額を表示します。同じ追加購入単価で目標平均まで下げるために必要な株数も逆算できます。

## 使い方
1. 現在の保有株数と平均取得単価を入力します。
2. 必要に応じて追加購入予定の株数と単価を入力します。
3. 目標平均単価を入力すると、さらに必要な株数を確認できます。

株数は整数に限定し、空欄の組み合わせ、負数、過大な金額、達成不可能な目標を明確に案内します。計算はブラウザ内で行い、手数料・税金・為替費用は含みません。

## 計算例
100株を平均50,000ウォンで保有し、40,000ウォンで100株を追加購入すると、新しい平均は45,000ウォンです。目標43,000ウォンを入力すると、この購入計画の後に40,000ウォンでさらに必要な株数を表示します。

## よくある質問
### 「達成不可」と表示される理由は？
平均単価は追加購入単価に近づきますが、それを下回りません。目標が追加購入単価以下の場合、同じ価格での購入だけでは達成できません。

### 入力した追加購入予定も目標計算に含まれますか？
はい。まず追加購入予定を反映し、その後に同じ価格でさらに必要な株数だけを表示します。

### 単元未満株・小数株に対応していますか？
この計算機は整数株のみです。小数株取引は証券会社の注文画面で精度と費用を確認してください。

## 関連ツール
- [複利計算機]({{ '/ja/tools/compound-interest-calculator/' | relative_url }})
- [パーセント計算機]({{ '/ja/tools/percent-calculator/' | relative_url }})
- [利益率計算機]({{ '/ja/tools/profit-margin-calculator/' | relative_url }})
