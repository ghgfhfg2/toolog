---
layout: tool
title: 燃費計算機 | km/L・L/100km・燃料費・1km単価を計算
description: 走行距離、給油量、任意の1Lあたり単価を入力して、km/L燃費、L/100km、総燃料費、1kmあたり燃料費を確認できます。
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
tool_type: calculator
topic_cluster: auto
keywords: [燃費計算機, km/L 計算, ガソリン代計算, 燃料費計算, 1kmあたり燃料費, L/100km]
related_tools: [average-speed-calculator, unit-converter, unit-price-calculator, percent-calculator]
faq:
  - q: km/L と L/100km の違いは何ですか？
    a: km/L は燃料1Lで何km走れるか、L/100km は100km走るのに何L必要かを示します。同じ効率を別の見方で表したものです。
  - q: 燃料単価は必須ですか？
    a: いいえ。走行距離と給油量だけでも燃費は計算できます。単価を入れると、総燃料費と1kmあたり燃料費も表示されます。
  - q: EVにも使えますか？
    a: このツールはリットル基準の燃料消費向けです。EVのkWh効率計算にはそのまま適していません。
  - q: 値が低すぎたり高すぎたりするときは何を確認しますか？
    a: 走行距離がkm、給油量がLで入力されているか確認してください。3km/L未満や40km/L超のように一般的に珍しい結果では確認案内を表示します。
---

## 給油後やドライブ後に使える燃費計算機
給油後やドライブの後に、**実際の燃費がどれくらいだったか**、そして **その走行にいくらかかったか** をすぐ確認したいことがあります。

このツールでは次の値を入れるだけです。
- 走行距離 (km)
- 給油量 (L)
- 1Lあたり単価（任意）

入力すると **km/L燃費**, **100kmあたり燃料消費量 (L/100km)**, **総燃料費**, **1kmあたり燃料費** を1画面で確認できます。
給油後の実燃費記録だけでなく、長距離移動前にガソリン代の目安を素早く見積もる用途にも使えます。

## 今日このツールを選んだ理由
直近30日の品質改善は `image-resizer`, `lucky-draw-picker`, `pomodoro-timer`, `readability-checker`, `time-difference-calculator`, `korean-name-romanizer`, `png-compressor`, `json-merge`, `link-list-cleaner`, `average-speed-calculator` などに集中していたため、同じツールの反復を避けました。
`fuel-economy-calculator` は2026年3月の追加後、大きな改善履歴が少なく、自動車費用の計算では空欄・0・負の単価・大きすぎる値・単価未入力時の表示が使いやすさに直結するため、今回の改善対象にしました。

## 計算方法
1. `走行距離 ÷ 給油量 = km/L`
2. `100 ÷ km/L = L/100km`
3. `給油量 × 1Lあたり単価 = 総燃料費`
4. `総燃料費 ÷ 走行距離 = 1kmあたり燃料費`

計算はブラウザ内だけで行われます。単価を空欄にした場合でも、燃費と100kmあたり消費量は先に確認できます。

## 使用例
### 例1) 走行燃費を確認する
- 走行距離: 420km
- 給油量: 28L
- 1Lあたり単価: 1,720ウォン

→ 燃費: **15.00 km/L**  
→ 100kmあたり消費量: **6.67 L**  
→ 総燃料費: **48,160ウォン**  
→ 1kmあたり燃料費: **約115ウォン**

### 例2) 車の維持費を比較する
同じ100kmを走る場合:
- 車A: 12km/L
- 車B: 16km/L

車Bのほうが少ない燃料で走れるため、長距離運転が多いほど燃料費の差が大きくなります。

## 特に便利な場面
- 実燃費がカタログ燃費とどれくらい違うか確認したいとき
- 長距離運転前に燃料費を見積もりたいとき
- 車計簿や家計簿に1回の走行コストを残したいとき
- 2台の車の維持費を比較したいとき
- 給油レシートのリットル数と単価、支払額をすばやく確認したいとき

## 一緒に使うと便利なツール
- 走行ペースも確認したいとき: [平均速度計算機]({{ '/ja/tools/average-speed-calculator/' | relative_url }})
- 単位を変換したいとき: [単位変換ツール]({{ '/ja/tools/unit-converter/' | relative_url }})
- 単位あたり価格を比べたいとき: [単価計算ツール]({{ '/ja/tools/unit-price-calculator/' | relative_url }})
- 費用差を割合で見たいとき: [パーセント計算機]({{ '/ja/tools/percent-calculator/' | relative_url }})

## FAQ
### km/L は高いほど良いですか？
はい。同じ燃料量でより遠くまで走れるので、一般的には高いほど効率が良いです。

### L/100km は低いほど良いですか？
はい。100km走るために必要な燃料が少ないほど効率が良いことを意味します。

### 単価を入れるメリットは何ですか？
単価を入力すると、燃費だけでなく実際の走行コストまで把握しやすくなります。

### 結果が不自然に見えるときは何を確認しますか？
燃費が低すぎる、または高すぎる場合は、走行距離と給油量を入れ替えていないか、距離をmやmileではなくkmで入れているか確認してください。一般的な乗用車として珍しい結果では、計算画面にも確認案内が表示されます。

## まとめ
燃費計算機は、走行距離と給油量を実際の運転コストとして見直すための手早いツールです。
給油後の数字を入力して、燃費とガソリン代をまとめて確認できます。
