---
layout: tool
lang: ja
title: 平均速度計算機 | 距離と時間から km/h とペースを計算
description: 距離と時間を入力すると、平均速度(km/h)、1kmあたりのペース、予想5K・10Kタイムを計算できます。
permalink: /ja/tools/average-speed-calculator/
canonical_url: /ja/tools/average-speed-calculator/
category: calculator
category_label: 移動/生活
thumbnail: /assets/thumbs/ja/average-speed-calculator.svg
image:
  path: /assets/thumbs/ja/average-speed-calculator.svg
  alt: 平均速度計算機プレビュー
tool_key: average-speed-calculator
keywords: [平均速度計算, kmh計算, ペース計算, ランニングペース, 距離時間速度]
related_tools: [unit-converter, average-calculator, work-end-time-calculator]
faq:
  - q: km/h とペースの違いは何ですか？
    a: km/h は1時間あたりに進む距離、ペースは1km進むのにかかる時間を表します。
  - q: 分だけ入力しても計算できますか？
    a: はい。時間を0にして分だけ入力しても計算できます。ただし総時間は0より大きい必要があります。
  - q: 予想5K・10Kタイムとは何ですか？
    a: 入力した平均速度をそのまま維持したと仮定した単純換算タイムです。
alternate_urls:
  ko: /tools/average-speed-calculator/
  en: /en/tools/average-speed-calculator/
  ja: /ja/tools/average-speed-calculator/
---

## 平均速度とペースをすぐ確認したいときに便利
徒歩・ランニング・自転車・移動計画などで、
**どれくらいの速度で移動したのか** をすぐ把握したい場面があります。

このツールは距離と時間から、
**平均速度（km/h）**、**1kmペース**、さらに**予想5K・10Kタイム**までまとめて計算します。

## 主な機能
- 距離と時間から平均速度を計算
- 1kmあたりのペースを自動表示
- 同じ速度を維持した場合の5K・10K予想タイムを表示
- 結果コピー機能つき
- ランニング・徒歩・自転車・一般移動に活用可能

## 使い方
1. 距離を km 単位で入力します。
2. 所要時間を時間・分で入力します。
3. 平均速度とペースを確認します。
4. 同じ速度で走った/移動した場合の 5K・10K 予想タイムも参考にします。

## 計算方法
- 平均速度 (km/h) = **距離 ÷ 総時間(時間)**
- ペース (min/km) = **総時間(分) ÷ 距離**
- 予想タイム = **ペース × 目標距離**

たとえば 10km を 1時間で移動した場合、
平均速度は **10km/h**、ペースは **1km あたり 6分** です。

## 関連ツール
- [単位変換ツール]({{ '/ja/tools/unit-converter/' | relative_url }})
- [平均計算機]({{ '/ja/tools/average-calculator/' | relative_url }})
- [退勤時刻計算機]({{ '/ja/tools/work-end-time-calculator/' | relative_url }})

## FAQ
### km/h と min/km のどちらを見ればよいですか？
車や自転車、一般移動では km/h が直感的で、ランニングのような記録管理では min/km ペースが分かりやすいです。

### 小数の距離も入力できますか？
はい。3.5km や 42.195km のような小数距離にも対応します。

### 予想タイムは公式記録の予測として使えますか？
いいえ。入力した平均速度を単純換算した参考値です。実際の記録は体調やコース条件などで変わります。
