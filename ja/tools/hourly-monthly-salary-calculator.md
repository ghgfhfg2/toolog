---
layout: tool
title: 韓国の時給・月給計算機 | 2026年最低賃金・週休手当
description: 韓国の時給と週の所定労働時間から、週休手当を含む週給・月給・年収を計算。皆勤条件、月換算週数、2026年最低賃金の警告にも対応します。
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
keywords: [韓国 時給 月給 計算, 2026年 韓国 最低賃金, 年収計算, 週休手当, 給与試算]
related_tools: [weekly-holiday-pay-calculator, salary-calculator, work-end-time-calculator]
faq:
  - q: 週休手当を含めて計算できますか？
    a: はい。4週平均が週15時間以上で所定労働日を皆勤した場合、週40時間に比例した週休時間（上限8時間）を反映します。
  - q: 月換算の4.345週とは？
    a: 365日を7日と12か月で割った平均値の近似です。給与計算の基準に合わせて4〜5の範囲で調整できます。
  - q: 手取り金額ですか？
    a: いいえ。税金・社会保険控除前の額面計算です。
  - q: 韓国の2026年最低賃金はいくらですか？
    a: 2026年の時間給最低賃金は10,320ウォンです。これ未満の入力には確認警告を表示しますが、個別の適用除外は公式案内で確認してください。
alternate_urls:
  ko: /tools/hourly-monthly-salary-calculator/
  en: /en/tools/hourly-monthly-salary-calculator/
  ja: /ja/tools/hourly-monthly-salary-calculator/
---

## 韓国の時給から月給・年収を計算
週の所定労働時間、週休手当の条件、月換算週数から週給・月給・年収（額面）を試算します。負数、過大な値、不正な入力は自動補正せずエラーを表示します。

2026年の例では韓国の最低賃金10,320ウォンを入力できます。これ未満の時給には確認警告を表示します。

## 計算式
1. 基本週給 = `時給 × 週労働時間`
2. 週休手当（任意）= `時給 × 週休時間`
   - 簡易週休時間 = `週の所定労働時間 ÷ 40 × 8`（上限8時間）
   - 4週平均が週15時間以上で、所定労働日を皆勤した場合のみ反映
3. 月給 = `(基本週給 + 週休手当) × 月換算週数`
4. 年収 = `月給 × 12`

## 前提と注意点
- 実際の時間外労働ではなく、契約上の所定労働時間を入力してください。
- 比例方式は概算です。通常労働者の勤務形態や実際の勤務パターンによって法的な算定結果は異なる場合があります。
- 時間外割増、税金、社会保険、有給休暇、その他の手当は含みません。
- 契約書や給与明細を確認するための目安であり、確定給与や法的判断ではありません。

[韓国雇用労働部の2026年最低賃金案内](https://www.moel.go.kr/news/enews/report/enewsView.do?news_seq=18144)と[勤労基準法施行令の週休規定](https://law.go.kr/LSW/lsLinkCommonInfo.do?lspttninfSeq=148916)も確認してください。

## 関連ツール
- [週休手当計算機]({{ '/ja/tools/weekly-holiday-pay-calculator/' | relative_url }})
- [年収手取り計算機]({{ '/ja/tools/salary-calculator/' | relative_url }})
- [退勤時刻計算機]({{ '/ja/tools/work-end-time-calculator/' | relative_url }})

入力はサーバーへ送信されず、ブラウザ内だけで計算されます。
