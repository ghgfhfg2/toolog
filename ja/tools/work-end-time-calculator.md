---
layout: tool
title: 退勤時刻計算機 | 出勤・休憩時間から自動計算
description: 出勤時刻、勤務時間、休憩時間を入力すると、退勤予定時刻と総滞在時間を計算できます。
lang: ja
permalink: /ja/tools/work-end-time-calculator/
canonical_url: /ja/tools/work-end-time-calculator/
category: productivity
category_label: 予定/生産性
thumbnail: /assets/thumbs/work-end-time-calculator.svg
tool_key: work-end-time-calculator
image:
  path: /assets/thumbs/work-end-time-calculator.svg
  alt: 退勤時刻計算機プレビュー
keywords: [退勤時刻計算機, 勤務時間計算, 出勤 退勤 計算, 休憩時間 計算]
related_tools: [d-day-calculator, pomodoro-timer]
faq:
  - q: 休憩時間はどう入力すればいいですか？
    a: 法定休憩や実際の昼休み・小休憩を分単位で合算して入力してください。
  - q: 夜勤のように翌日退勤になる場合も計算できますか？
    a: はい。勤務時間+休憩時間の合計が24時間を超えない範囲で、翌日の退勤時刻まで表示します。
  - q: 週52時間の管理にも使えますか？
    a: このツールは1日単位の退勤時刻計算用です。週次の累積管理は別途スプレッドシートや勤怠システムと併用してください。
alternate_urls:
  ko: /tools/work-end-time-calculator/
  en: /en/tools/work-end-time-calculator/
  ja: /ja/tools/work-end-time-calculator/
---

## 退勤時刻計算機、どんなときに便利？
出勤はしたけれど、**正確に何時に退勤できるか**迷うことはよくあります。
特にフレックス勤務・交代勤務・外勤が混ざると、感覚だけでの計算は難しくなります。

このツールは **出勤時刻 + 実勤務時間 + 休憩時間** を入力するだけで、
退勤予定時刻と総滞在時間をすぐに表示します。

## 主な機能
- 出勤時刻（時:分）入力
- 目標勤務時間（時間）+ 休憩時間（分）の合算計算
- 退勤予定時刻を自動算出
- 総滞在時間（勤務+休憩）と翌日判定を表示

## 使用例
- 出勤 09:00
- 勤務時間 8時間
- 休憩時間 60分

→ 退勤予定時刻: **18:00**

## 一緒に使うと便利なツール
- 締切逆算: [D-Day計算機]({{ '/ja/tools/d-day-calculator/' | relative_url }})
- 集中ブロック運用: [ポモドーロタイマー]({{ '/ja/tools/pomodoro-timer/' | relative_url }})

## FAQ
### 休憩が複数回ある場合は？
昼休み+短い休憩のように分かれていても、合計分数で入力すればOKです。

### 実際の退勤時刻と差が出ることは？
残業、会議の延長、追加休憩などの要因があると、結果と差が出る場合があります。

### モバイルでも使えますか？
はい。ブラウザですぐ使え、別途インストールは不要です。
