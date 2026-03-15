---
layout: tool
title: 駐車料金計算機 | 基本料金・追加料金・1日上限を自動計算
description: 駐車時間と料金条件（基本時間/基本料金、追加単位/追加料金、1日上限）を入力して駐車料金を試算します。
lang: ja
permalink: /ja/tools/parking-fee-calculator/
canonical_url: /ja/tools/parking-fee-calculator/
category: calculator
category_label: 生活/料金
thumbnail: /assets/thumbs/parking-fee-calculator.svg
tool_key: parking-fee-calculator
image:
  path: /assets/thumbs/parking-fee-calculator.svg
  alt: 駐車料金計算機プレビュー
keywords: [駐車料金計算機, 駐車料金 計算, 公営駐車場 料金, 1日上限 料金]
related_tools: [work-end-time-calculator, percent-calculator]
faq:
  - q: 10分ごとに500ウォンのような料金も計算できますか？
    a: はい。追加単位を10分、追加料金を500ウォンに設定してください。
  - q: 1日最大料金はどう反映されますか？
    a: 1日上限を入力すると、計算額が上限を超える場合に自動で上限額に制限されます。
  - q: 無料駐車時間はどう入力しますか？
    a: 無料時間を基本時間として入力し、基本料金を0に設定してください。
alternate_urls:
  ko: /tools/parking-fee-calculator/
  en: /en/tools/parking-fee-calculator/
  ja: /ja/tools/parking-fee-calculator/
---

## どんなときに便利？
駐車場ごとに料金体系が違うため、事前に金額を見積もるのが難しいことがあります。

このツールは、料金表の主要項目を入力するだけで予想駐車料金をすぐ計算できます。

## 入力項目
- 駐車時間（分）
- 基本時間 / 基本料金
- 追加単位 / 追加料金
- 1日最大料金（任意）

## 計算方法
1. 駐車時間が基本時間以内なら基本料金を適用
2. 超過時は **ceil(超過時間 ÷ 追加単位)** で課金回数を計算
3. 1日上限を設定した場合、結果が上限を超えると上限額を適用
