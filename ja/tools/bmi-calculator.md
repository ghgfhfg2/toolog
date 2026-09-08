---
layout: tool
title: 成人BMI計算機 | アジア基準・体重範囲・BMR目安
description: 成人の身長と体重からBMIとアジア成人の参考区分、BMI 18.5〜22.9の体重範囲、任意でBMR目安を計算します。
lang: ja
permalink: /ja/tools/bmi-calculator/
canonical_url: /ja/tools/bmi-calculator/
category: calculator
category_label: 健康/フィットネス
thumbnail: /assets/thumbs/bmi-calculator.svg
image:
  path: /assets/thumbs/bmi-calculator.svg
  alt: BMI計算機の結果プレビュー
tool_key: bmi-calculator
keywords: [成人BMI計算, アジアBMI基準, 体格指数, 標準体重, BMR]
related_tools: [body-fat-calculator, tdee-calculator, age-calculator]
faq:
  - q: BMIはどのように計算しますか？
    a: 体重(kg)を身長(m)の2乗で割ります。例えば65kg、170cmなら約22.49です。
  - q: どのBMI区分を使っていますか？
    a: アジア成人の参考値として18.5未満、18.5〜22.9、23〜24.9、25〜29.9、30〜34.9、35以上の6区分を使います。
  - q: BMRはどのように推定しますか？
    a: 年齢と性別の両方を入力した場合にMifflin–St Jeor式を使います。安静時消費エネルギーの目安で、摂取カロリーの処方ではありません。
  - q: 子どもや未成年にも使えますか？
    a: いいえ。成長期は年齢・性別ごとのBMIパーセンタイルが必要で、成人基準をそのまま適用できません。
alternate_urls:
  ko: /tools/bmi-calculator/
  en: /en/tools/bmi-calculator/
  ja: /ja/tools/bmi-calculator/
---

## 成人BMIをアジア基準で確認
身長と体重からBMI、アジア成人の参考区分、BMI 18.5〜22.9に相当する体重範囲を表示します。年齢と性別を両方入力すると基礎代謝量（BMR）も推定します。

## 主な機能
- リアルタイムBMI計算
- 6段階の成人向け参考区分
- 身長別のBMI 18.5〜22.9体重範囲
- Mifflin–St Jeor式による任意のBMR推定
- 空欄・範囲外・任意入力不足のエラー案内

## 使い方
1. 身長(cm)を入力
2. 体重(kg)を入力
3. 必要なら年齢・性別を入力
4. BMIと判定結果を確認

## 注意事項
- BMIとBMRは成人向けの参考推定値で、診断・処方ではありません。
- 筋肉量が多い場合は体脂肪率などの追加指標も確認してください。
- 妊娠中や成長期にはこの成人区分を適用しないでください。

## 計算式と区分
- BMI = 体重(kg) ÷ 身長(m)²
- 区分: 18.5未満、18.5〜22.9、23〜24.9、25〜29.9、30〜34.9、35以上
- BMRは体重・身長・18〜100歳の整数年齢・性別をMifflin–St Jeor式に当てはめます。

## 関連ツール
- 体格の補足指標: [体脂肪率計算機]({{ '/ja/tools/body-fat-calculator/' | relative_url }})
- 1日の消費カロリー目安: [TDEE計算機]({{ '/ja/tools/tdee-calculator/' | relative_url }})
- 正確な満年齢: [年齢計算機]({{ '/ja/tools/age-calculator/' | relative_url }})
