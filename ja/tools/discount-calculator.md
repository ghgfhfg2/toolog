---
layout: tool
title: 割引計算機 | 割引率・クーポン・数量・最終価格
description: 定価と割引率に商品ごとのクーポン、数量、送料を反映し、割引後価格・最終支払額・実質割引率・目標価格の必要割引率を計算します。
lang: ja
permalink: /ja/tools/discount-calculator/
canonical_url: /ja/tools/discount-calculator/
category: calculator
category_label: 計算/ショッピング
thumbnail: /assets/thumbs/discount-calculator.svg
image:
  path: /assets/thumbs/discount-calculator.svg
  alt: 割引計算機のプレビュー
tool_key: discount-calculator
keywords: [割引計算, クーポン計算, 最終価格, セール計算, 実質割引率]
related_tools: [percent-calculator, vat-calculator, loan-calculator]
alternate_urls:
  ko: /tools/discount-calculator/
  en: /en/tools/discount-calculator/
  ja: /ja/tools/discount-calculator/
faq:
  - q: クーポンは率引きの前と後のどちらに適用しますか？
    a: この計算機では率引き後、商品1個ごとに固定額クーポンを差し引きます。実際の店舗の適用条件も確認してください。
  - q: 実質割引率に送料は含まれますか？
    a: いいえ。送料は最終支払額に1回加算し、商品実質割引率は定価と割引後単価だけで比較します。
  - q: 目標価格に必要な割引率を逆算できますか？
    a: はい。目標価格モードを選び、定価と商品1個あたりの目標販売価格を入力してください。
---

## セール価格と最終支払額の割引計算
このツールでは次をまとめて確認できます。
- 割引率適用後の価格
- 商品ごとのクーポン適用後の単価
- 数量・送料を含む最終金額
- 目標価格に必要な割引率

## 主な機能
- 通常計算と目標価格逆算の2モード
- 入力と同時に結果を更新
- 実質割引率を表示
- 空欄、マイナス、数量の小数、上限超過を項目別にチェック

## 使い方
1. モードを選ぶ
2. 定価・割引率・クーポンを入力
3. 必要なら数量と送料を入力
4. 最終支払額と割引内訳を確認

任意項目の空欄はクーポン0、数量1、送料0として扱います。クーポンは率引き後の**商品1個ごと**に差し引きます。

## 計算式と前提
- 割引後単価 = `定価 × (1 - 割引率) - 商品ごとのクーポン`
- 最終支払額 = `割引後単価 × 数量 + 送料`
- 商品実質割引率 = `(定価 - 割引後単価) ÷ 定価 × 100`

最低注文額、クーポン上限、併用制限、税金、店舗独自の端数処理は反映しません。購入前に実際の決済条件を確認してください。

## FAQ
### クーポンは率引きの前と後のどちらに適用しますか？
率引き後、商品1個ごとに固定額クーポンを差し引きます。

### 実質割引率に送料は含まれますか？
いいえ。送料は最終支払額にだけ含めます。

### 目標価格に必要な割引率を逆算できますか？
はい。目標価格モードで定価と商品1個あたりの目標価格を入力します。

## 関連ツール
- 比率計算: [パーセント計算機]({{ '/ja/tools/percent-calculator/' | relative_url }})
- 税込み金額: [VAT計算機]({{ '/ja/tools/vat-calculator/' | relative_url }})
- 分割支払の比較: [ローン計算機]({{ '/ja/tools/loan-calculator/' | relative_url }})
