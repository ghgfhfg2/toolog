---
layout: tool
title: 韓国の退職金計算機 | 退職前3か月の平均賃金で試算
description: 入社日・退職日、退職前3か月の賃金総額と暦日数、定期賞与・年休手当・通常賃金・週所定労働時間から韓国の退職金見込みを計算します。
lang: ja
permalink: /ja/tools/severance-pay-calculator/
canonical_url: /ja/tools/severance-pay-calculator/
category: calculator
category_label: 金融
thumbnail: /assets/thumbs/severance-pay-calculator.svg
image:
  path: /assets/thumbs/severance-pay-calculator.svg
  alt: 退職金計算機プレビュー
tool_key: severance-pay-calculator
tool_type: calculator
topic_cluster: labor
keywords: [韓国 退職金計算, 退職前3か月, 平均賃金, 通常賃金, 在職期間]
related_tools: [salary-calculator, weekly-holiday-pay-calculator, percent-calculator]
faq:
  - q: 退職日にはどの日を入力しますか？
    a: 在籍しない最初の日、通常は最終勤務日の翌日を入力します。入社日は含み、退職日は勤続日数に含めません。
  - q: 退職前3か月の日数は勤務日だけですか？
    a: いいえ。休日を含む暦日数です。この簡易計算機は通常の89〜92日に対応します。
  - q: 1日通常賃金のほうが高い場合はどうなりますか？
    a: 任意入力した1日通常賃金が推定平均賃金より高ければ、通常賃金を試算の基準にします。
  - q: 法的な支給対象か確定できますか？
    a: いいえ。1年以上と週15時間以上の基本条件だけを確認します。除外期間、賃金性、中間精算、会社規程は別途確認が必要です。
alternate_urls:
  ko: /tools/severance-pay-calculator/
  en: /en/tools/severance-pay-calculator/
  ja: /ja/tools/severance-pay-calculator/
---

## 退職前3か月の賃金から韓国の退職金を試算
入社日・退職日、退職前3か月の賃金総額と暦日数、週平均所定労働時間を入力すると、勤続日数、推定1日平均賃金、計算に使う1日賃金、退職金見込み、基本支給要件を確認できます。

## 計算式
- 推定1日平均賃金 = `(3か月の賃金総額 + 年間定期賞与 × 3/12 + 対象年休手当 × 3/12) ÷ 暦日数`
- 計算に使う1日賃金 = 推定平均賃金と任意入力の通常賃金の高いほう
- 退職金見込み = `1日賃金 × 30 × 勤続日数 ÷ 365`

退職日は最終勤務日の翌日を入力します。3か月の総日数は勤務日数ではなく休日を含む暦日数です。出産・育児休業などの除外期間がある場合は[韓国雇用労働部の公式計算機](https://www.moel.go.kr/retirementpayCal.do)で確認してください。

## 注意事項
本ツールは税引前の参考試算です。平均賃金の除外期間、中間精算、退職年金、税金、賞与の賃金性、会社規程は反映しません。正式な金額は給与台帳と会社規程をもとに専門窓口へ確認してください。

## 関連ツール
- [年収手取り計算機]({{ '/ja/tools/salary-calculator/' | relative_url }})
- [週休手当計算機]({{ '/ja/tools/weekly-holiday-pay-calculator/' | relative_url }})
- [パーセント計算機]({{ '/ja/tools/percent-calculator/' | relative_url }})
