---
layout: tool
title: 預金利息計算機 | 単利・毎月複利の税引後満期額
description: 預入額、年利、期間、課税条件を入力し、単利・毎月複利の税引前利息、税額、税引後利息、満期見込額を計算します。
lang: ja
permalink: /ja/tools/savings-interest-calculator/
canonical_url: /ja/tools/savings-interest-calculator/
category: calculator
category_label: 金融/ビジネス
thumbnail: /assets/thumbs/savings-interest-calculator.svg
image:
  path: /assets/thumbs/savings-interest-calculator.svg
  alt: 預金利息計算機サムネイル
tool_key: savings-interest-calculator
keywords: [預金利息計算, 税引後利息, 単利, 毎月複利, 満期金額]
related_tools: [compound-interest-calculator, loan-calculator, percent-calculator]
faq:
  - q: 単利と毎月複利の違いは？
    a: 単利は元本のみに利息がつき、毎月複利は月ごとの利息が元本に加算されて次月の利息が計算されます。
  - q: 課税 15.4% とは？
    a: 韓国の一般的な利子所得課税（所得税14% + 地方税1.4%）です。
  - q: 非課税商品にも使えますか？
    a: はい。課税区分を非課税(0%)にすると比較できます。
  - q: 銀行の実際の満期金額と同じになりますか？
    a: 表示年利が一定で利息を満期時に受け取ると仮定した概算です。日数計算、利払い頻度、端数処理、優遇金利条件、商品ごとの税制により実額は異なります。
alternate_urls:
  ko: /tools/savings-interest-calculator/
  en: /en/tools/savings-interest-calculator/
  ja: /ja/tools/savings-interest-calculator/
---

## 預金の実質受取額をすばやく確認
定期預金などを単利または毎月複利で比較し、課税後の満期見込額を確認できます。6・12・24か月のクイック設定にも対応しています。

## 計算条件と注意点
- 単利は「預入額 × 年利 × 月数 ÷ 12」で計算します。
- 毎月複利は年利を12で割った月利が毎月元本に加算されると仮定します。
- 税額は見込み利息の合計に選択税率を一度適用します。
- 銀行の日数計算、端数処理、利払い、優遇金利、商品固有の税制により実額は異なる場合があります。

## 関連ツール
- [複利計算機]({{ '/ja/tools/compound-interest-calculator/' | relative_url }})
- [ローン返済計算機]({{ '/ja/tools/loan-calculator/' | relative_url }})
- [パーセント計算機]({{ '/ja/tools/percent-calculator/' | relative_url }})
