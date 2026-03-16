---
layout: tool
title: ランダム抽選ツール | 当選者を無作為に選ぶ
description: 参加者リストと当選人数を入力すると、重複なしで当選者を即時抽選できます。プレゼント企画、チーム分け、発表順決めに便利です。
lang: ja
permalink: /ja/tools/lucky-draw-picker/
canonical_url: /ja/tools/lucky-draw-picker/
category: productivity
category_label: 予定/生産性
thumbnail: /assets/thumbs/lucky-draw-picker.svg
tool_key: lucky-draw-picker
image:
  path: /assets/thumbs/lucky-draw-picker.svg
  alt: ランダム抽選ツールのプレビュー
keywords: [ランダム抽選, 当選者抽選, 無作為抽選, くじ引き, チーム分け]
related_tools: [d-day-calculator, pomodoro-timer]
faq:
  - q: 同じ名前が複数ある場合は？
    a: 前後の空白を整理した後、重複名を削除して抽選します。同名を複数回入力しても1名として扱われます。
  - q: 当選人数が参加者数より多い場合は？
    a: 当選人数は参加者数を上限に自動調整されます。
  - q: 抽選結果は毎回変わりますか？
    a: はい。ブラウザの暗号学的乱数（crypto）を使って毎回ランダムに抽選します。
alternate_urls:
  ko: /tools/lucky-draw-picker/
  en: /en/tools/lucky-draw-picker/
  ja: /ja/tools/lucky-draw-picker/
---

## こんな場面ですぐ使えます
- コメントや応募者から**当選者を抽選**
- 勉強会・ミーティングの**発表順をランダム決定**
- プロジェクトの**チームを無作為に割り当て**

名簿を貼り付けて当選人数を設定するだけで、すぐ結果が出ます。

## 使い方
1. 参加者名を1行に1名ずつ入力
2. 当選人数を入力
3. **抽選する**ボタンをクリック

結果は番号順で表示され、**結果をコピー**ボタンですぐ共有できます。

## 抽選ルール
- 前後の空白を削除
- 空行は除外
- 重複名を削除
- 当選人数は `1〜参加者数` の範囲に自動補正

## 一緒に使うと便利なツール
- 日付カウント: [D-Day計算機]({{ '/ja/tools/d-day-calculator/' | relative_url }})
- 集中時間管理: [ポモドーロタイマー]({{ '/ja/tools/pomodoro-timer/' | relative_url }})

## FAQ
### 入力順は当選確率に影響しますか？
いいえ。入力順に関係なく同じ確率で抽選されます。

### モバイルでも使えますか？
はい。ブラウザで動作するため、モバイル/PCのどちらでも使えます。

### データはサーバーに送信されますか？
いいえ。抽選処理はブラウザ内で完結し、名簿データは外部送信されません。
