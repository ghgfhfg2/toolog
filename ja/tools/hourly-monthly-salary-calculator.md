---
layout: tool
title: 時給・月給計算機 | 週給・月給・年収（額面）を試算
description: 時給、週労働時間、勤務日数を入力すると、週休手当の反映有無まで含めて週給・月給・年収（額面）を計算します。
lang: ja
permalink: /ja/tools/hourly-monthly-salary-calculator/
canonical_url: /ja/tools/hourly-monthly-salary-calculator/
category: calculator
category_label: 金融/ビジネス
thumbnail: /assets/thumbs/ja/hourly-monthly-salary-calculator.svg
tool_key: hourly-monthly-salary-calculator
image:
  path: /assets/thumbs/ja/hourly-monthly-salary-calculator.svg
  alt: 時給・月給計算機のプレビュー
keywords: [時給計算, 月給計算, 年収計算, 週休手当, 給与試算]
related_tools: [weekly-holiday-pay-calculator, salary-calculator]
faq:
  - q: 週休手当を含めて計算できますか？
    a: はい。チェックONで、週15時間以上の条件を満たす場合に反映します。
  - q: 月換算の4.345週とは？
    a: 1年52.14週を12か月で割った平均値です。
  - q: 手取り金額ですか？
    a: いいえ。税金・社会保険控除前の額面計算です。
alternate_urls:
  ko: /tools/hourly-monthly-salary-calculator/
  en: /en/tools/hourly-monthly-salary-calculator/
  ja: /ja/tools/hourly-monthly-salary-calculator/
---

## 時給から月給・年収をすばやく計算
時給制では、週労働時間や勤務日数、週休手当の扱いで月給が大きく変わります。

このツールでは以下を即時計算できます。
- 週給（額面）
- 月給（額面）
- 年収（額面）

## 計算式
1. 基本週給 = `時給 × 週労働時間`
2. 週休手当（任意）= `時給 × 週休時間`
3. 月給 = `(基本週給 + 週休手当) × 月換算週数`
4. 年収 = `月給 × 12`

## 関連ツール
- [週休手当計算機]({{ '/ja/tools/weekly-holiday-pay-calculator/' | relative_url }})
- [年収手取り計算機]({{ '/ja/tools/salary-calculator/' | relative_url }})
