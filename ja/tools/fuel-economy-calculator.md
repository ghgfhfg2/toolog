---
layout: tool
title: 燃費計算機 | km/L・L/100km・燃料費をまとめて計算
description: 走行距離と給油量から km/L の燃費を計算し、100kmあたり消費量、総燃料費、1kmあたり燃料費までまとめて確認できます。
lang: ja
permalink: /ja/tools/fuel-economy-calculator/
canonical_url: /ja/tools/fuel-economy-calculator/
category: calculator
category_label: 自動車/費用
thumbnail: /assets/thumbs/ja/fuel-economy-calculator.svg
image:
  path: /assets/thumbs/ja/fuel-economy-calculator.svg
  alt: 燃費計算機のサムネイル
tool_key: fuel-economy-calculator
keywords: [燃費計算機, km/L 計算, ガソリン代計算, 1kmあたり燃料費, L/100km]
related_tools: [average-speed-calculator, unit-converter, percent-calculator]
faq:
  - q: km/L と L/100km の違いは何ですか？
    a: km/L は燃料1Lで何km走れるか、L/100km は100km走るのに何L必要かを示します。同じ効率を別の見方で表したものです。
  - q: 燃料単価は必須ですか？
    a: いいえ。走行距離と給油量だけでも燃費は計算できます。単価を入れると、総燃料費と1kmあたり燃料費も表示されます。
  - q: EVにも使えますか？
    a: このツールはリットル基準の燃料消費向けです。EVのkWh効率計算にはそのまま適していません。---

## この燃費計算機が便利な場面
給油後やドライブの後に、**実際の燃費がどれくらいだったか**、そして **その走行にいくらかかったか** をすぐ確認したいことがあります。

このツールでは次の値を入れるだけです。
- 走行距離 (km)
- 給油量 (L)
- 1Lあたり単価（任意）

入力すると **km/L**, **L/100km**, **総燃料費**, **1kmあたり燃料費** をすぐ表示します。

## 計算方法
1. `走行距離 ÷ 給油量 = km/L`
2. `100 ÷ km/L = L/100km`
3. `給油量 × 1Lあたり単価 = 総燃料費`
4. `総燃料費 ÷ 走行距離 = 1kmあたり燃料費`

## 使用例
- 走行距離: 420km
- 給油量: 28L
- 1Lあたり単価: 1,720ウォン

→ 燃費: **15.00 km/L**  
→ 100kmあたり消費量: **6.67 L**  
→ 総燃料費: **48,160ウォン**  
→ 1kmあたり燃料費: **約115ウォン**

## 一緒に使うと便利なツール
- 走行ペースも確認したいとき: [平均速度計算機]({{ '/ja/tools/average-speed-calculator/' | relative_url }})
- 単位を変換したいとき: [単位変換ツール]({{ '/ja/tools/unit-converter/' | relative_url }})
- 費用差を割合で見たいとき: [パーセント計算機]({{ '/ja/tools/percent-calculator/' | relative_url }})

## FAQ
### km/L は高いほど良いですか？
はい。同じ燃料量でより遠くまで走れるので、一般的には高いほど効率が良いです。

### L/100km は低いほど良いですか？
はい。100km走るために必要な燃料が少ないほど効率が良いことを意味します。

### 単価を入れるメリットは何ですか？
単価を入力すると、燃費だけでなく実際の走行コストまで把握しやすくなります。
