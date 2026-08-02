---
layout: tool
title: 単位変換ツール | 長さ・重さ・温度、inch cm・lb kg・華氏摂氏
description: mm・cm・m・km・inch・mile、kg・lb・oz、℃・℉・Kをすぐに換算。例入力、単位入れ替え、結果コピー、絶対零度・過大値エラー案内に対応します。
lang: ja
permalink: /ja/tools/unit-converter/
canonical_url: /ja/tools/unit-converter/
category: data
category_label: データ/計算
thumbnail: /assets/thumbs/unit-converter.svg
image:
  path: /assets/thumbs/unit-converter.svg
  alt: 単位変換ツールのプレビュー
tool_key: unit-converter
keywords: [単位変換, 長さ変換, 重さ変換, 温度変換, lb kg 変換, inch cm 変換, mile km 変換]
related_tools: ['timezone-converter', 'ratio-split-calculator', 'average-calculator']
faq:
  - q: どの単位に対応していますか？
    a: 長さ（mm、cm、m、km、inch、ft、yd、mile）、重さ（kg、g、lb、oz）、温度（℃、℉、K）に対応しています。
  - q: 温度と長さ・重さでは換算方法が異なりますか？
    a: はい。長さと重さは比率で換算しますが、温度は基準となるゼロ点が異なるため、個別の計算式を使います。
  - q: 小数点以下は何桁まで表示されますか？
    a: 結果は小数点以下最大10桁まで表示し、不要な末尾の0は省略します。
  - q: 変換結果をそのままコピーできますか？
    a: はい。正常に変換できると、`12 inch = 30.48 cm`のような1行の結果をコピーできます。
alternate_urls:
  ko: /tools/unit-converter/
  en: /en/tools/unit-converter/
  ja: /ja/tools/unit-converter/
---

## 単位変換ツールが役立つ場面
この**単位変換ツール**は、`lb kg 変換`、`inch cm 変換`、`mile km 変換`、`華氏 摂氏 変換`など、異なる単位をすぐに換算したい検索意図や日常作業に対応します。

## 今日の改善対象に選んだ理由
最近の品質改善は `privacy-exposure-checker`、`meeting-action-item-extractor`、`filename-sanitizer`、`fraction-calculator`、`body-fat-calculator`、`customer-support-message-generator` などに集中していたため、同じツールの繰り返しを避けました。
`unit-converter` は変換ツールとして、空入力、過大な数値、絶対零度未満の温度、モバイルでのボタン操作など、失敗しやすい箇所と使いやすさの改善余地が明確だったため選びました。

## 対応単位
- 長さ: mm、cm、m、km、inch、ft、yd、mile
- 重さ: kg、g、lb、oz
- 温度: ℃、℉、K

## 使い方
1. 長さ・重さ・温度から変換タイプを選びます。
2. 変換元と変換先の単位を選びます。
3. 数値を入力すると、換算結果がすぐに表示されます。
4. 中央の入れ替えボタンで、変換元と変換先をすばやく交換できます。
5. 例入力で代表的な換算を確認し、必要に応じて結果をコピーします。

## 入力エラーと表示精度
入力欄が空の場合は入力案内を表示し、無効な数値、`Infinity`のような計算できない値、`1e15`を超える過大値はページの安定性のため拒否します。絶対零度未満の温度も明確なメッセージで知らせます。結果は小数点以下最大10桁に丸め、不要な末尾の0は省略します。

## 活用例
- 海外製品のinch表記をcmに換算する
- 体重や発注資料のlbをkgに換算する
- mile表記の移動距離をkmに換算する
- 華氏の天気予報を摂氏に換算する
- 科学・学習メモのKを℃または℉に換算する

## 関連ツール
- 海外スケジュールの調整: [時間帯変換ツール]({{ '/ja/tools/timezone-converter/' | relative_url }})
- 比率に応じた数値の分配: [比率分配計算機]({{ '/ja/tools/ratio-split-calculator/' | relative_url }})
- 複数の値の平均計算: [平均計算機]({{ '/ja/tools/average-calculator/' | relative_url }})
- 単位規格の参考: [NIST SI Units](https://www.nist.gov/pml/owm/metric-si/si-units)

## FAQ
### どの単位に対応していますか？
ミリメートル、ヤード、マイル、ポンド、オンス、摂氏、華氏、ケルビンなど、よく使う長さ・重さ・温度の単位に対応しています。

### 温度はなぜ別の計算式を使うのですか？
温度は単位ごとにゼロ点が異なるため、長さや重さのような単純な比率では換算できません。

### 結果の精度はどの程度ですか？
小数点以下最大10桁まで表示するため、日常用途や一般的な業務に十分な精度で確認できます。

### 変換結果をそのままコピーできますか？
はい。正常に変換した後、**結果をコピー**を押すと入力値、変換元単位、換算値、変換先単位を1行でコピーできます。

## まとめ
単位変換ツールは手計算によるミスを減らし、海外製品、資料、旅行情報、天気データなどの数値をすばやく理解するためのツールです。
