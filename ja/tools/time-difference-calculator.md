---
layout: tool
title: 時間差計算機 | 2つの時刻の差を時間・分で即時計算
description: 開始時刻、終了時刻、休憩時間を入力すると、経過時間、総分数、小数時間、実作業時間をすぐ計算できます。
category: productivity
category_label: 予定/生産性
thumbnail: /assets/thumbs/ja/time-difference-calculator.svg
image:
  path: /assets/thumbs/ja/time-difference-calculator.svg
  alt: 時間差計算機のサムネイル
tool_key: time-difference-calculator
keywords: [時間差計算機, 経過時間計算, 時刻差計算, 勤務時間計算, 2つの時刻の差]
related_tools: [work-end-time-calculator, d-day-calculator, pomodoro-timer]
faq:
  - q: 終了時刻が開始時刻より早い場合はどうなりますか？
    a: 翌日オプションをオンにすると、日付をまたいだ計算として扱います。たとえば23:30から01:00は1時間30分として計算されます。
  - q: 休憩時間を差し引けますか？
    a: はい。休憩時間を分単位で入力すると、総経過時間から差し引いた実作業時間も表示されます。
  - q: 小数時間でも確認できますか？
    a: できます。たとえば1時間30分は1.5時間としても表示されます。
canonical_url: /ja/tools/time-difference-calculator/---

## 時間差計算機はどんなときに便利？
2つの時刻の間が**正確に何時間何分か**をすぐ知りたい場面は意外と多いです。
勤務時間の整理、勉強時間の記録、会議時間の確認、予定の間隔チェックなどで役立ちます。

このツールでは **開始時刻 + 終了時刻** を入れるだけで、
- 経過時間
- 総分数
- 小数時間
- 休憩差引後の実作業時間
- 日付またぎ対応
をまとめて確認できます。

## 主な機能
- 開始時刻/終了時刻入力
- 深夜をまたぐ翌日計算
- 経過時間の自動計算
- 休憩時間差し引き後の実作業時間表示
- 結果コピー対応

## 使用例
- 開始: 09:00
- 終了: 18:30
- 休憩: 60分

→ 経過時間: **9時間30分**
→ 実作業時間: **8時間30分**

## 計算方法
- 経過時間 = 終了時刻 − 開始時刻
- 翌日モードでは終了時刻を**翌日**として計算
- 実作業時間 = 経過時間 − 休憩時間
- 小数時間 = 総分数 ÷ 60

## 関連ツール
- [退勤時間計算機]({{ '/tools/work-end-time-calculator/' | relative_url }})
- [D-Day計算機]({{ '/tools/d-day-calculator/' | relative_url }})
- [ポモドーロタイマー]({{ '/tools/pomodoro-timer/' | relative_url }})
