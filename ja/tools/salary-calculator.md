---
layout: tool
title: 2026年韓国の年収手取り計算機 | 税金・4大保険を試算
description: 2026年の韓国の額面年収、非課税月額、扶養情報から、月・年の手取り、所得税、労働者負担の社会保険料を試算します。
lang: ja
permalink: /ja/tools/salary-calculator/
canonical_url: /ja/tools/salary-calculator/
category: calculator
category_label: 金融
thumbnail: /assets/thumbs/salary-calculator.svg
image:
  path: /assets/thumbs/salary-calculator.svg
  alt: 年収手取り計算機の結果カード
tool_key: salary-calculator
keywords: [韓国 手取り計算 2026, 年収計算, 給与控除, 社会保険]
faq:
  - q: 実際の給与明細と同じ金額になりますか？
    a: いいえ。2026年の労働者負担率と簡易的な年税額モデルによる目安です。簡易税額表、会社の手当、年末調整により実額は異なります。
  - q: 2026年のどの保険料率を使いますか？
    a: 国民年金4.75%、健康保険3.595%、長期療養保険0.9448%÷7.19%、雇用保険0.9%の労働者負担率を使います。
  - q: 子どもは扶養人数にも含めますか？
    a: はい。扶養人数は本人を除き、対象となる子どもを含めます。子どもの人数は税額控除の概算にも使います。
related_tools: [loan-calculator, percent-calculator, compound-interest-calculator]
alternate_urls:
  ko: /tools/salary-calculator/
  en: /en/tools/salary-calculator/
  ja: /ja/tools/salary-calculator/
---

## 使い方
年収(額面)と条件を入力すると、手取り・税金・保険料をまとめて確認できます。転職/家計計画の初期試算に便利です。

## 2026年の計算基準
- 国民年金（労働者負担）：課税対象月額の4.75%、基準所得月額の上限659万ウォン
- 健康保険（労働者負担）：課税対象月額の3.595%
- 長期療養保険：健康保険料 × `0.9448% ÷ 7.19%`
- 雇用保険（労働者負担）：課税対象月額の0.9%
- 所得税・地方所得税：年額控除による簡易モデルで、公式の月次簡易税額表そのものではありません

子どもは扶養人数と子どもの人数の両方に含めてください。空欄、負数、小数、上限超過、人数の矛盾は自動補正せずエラーを表示します。

## 関連ツール
- [退職金計算機]({{ '/ja/tools/severance-pay-calculator/' | relative_url }})
- [ローン計算機]({{ '/ja/tools/loan-calculator/' | relative_url }})
- [パーセント計算機]({{ '/ja/tools/percent-calculator/' | relative_url }})
