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
  - q: BMIの数値だけで健康状態を判断できますか？
    a: いいえ。BMIは成人の体重状態を手軽に確認するための参考指標で、筋肉量・体脂肪率・既往歴は反映しません。個別の評価は医療専門家に相談してください。
  - q: どのBMI区分を使っていますか？
    a: アジア成人の参考値として18.5未満、18.5〜22.9、23〜24.9、25〜29.9、30〜34.9、35以上の6区分を使います。表示する体重範囲はBMI 18.5以上23未満に相当します。
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
3. BMRも確認する場合は、18〜100歳の整数年齢と性別を両方入力
4. BMI・区分・目安体重範囲・BMRを確認。サンプル入力、計算結果のコピー、入力のクリアも利用できます。

必須項目の未入力、対応範囲外の数値、小数の年齢、年齢・性別の片方だけを入力した場合は、結果欄に案内が表示されます。

## 計算例
- 身長: 170cm
- 体重: 65kg

BMIは約**22.49**で、この計算機のアジア成人参考区分では**普通体重**です。同じ身長でBMI 18.5〜22.9に相当する体重範囲は約53.5〜66.2kgです。

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

## まとめ
成人BMI計算機では、アジア成人の参考区分、BMIに基づく体重範囲、任意のBMR推定値をまとめて確認できます。診断ではなく、日々の健康管理を考える出発点として活用してください。
