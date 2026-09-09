---
layout: tool
title: 退勤時刻計算機 | 出勤・実勤務・休憩時間から自動計算
description: 出勤時刻、実勤務時間、昼休み・休憩時間から、当日または翌日の退勤予定時刻と総滞在時間を計算できます。
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
related_tools: [time-difference-calculator, appointment-departure-buffer-simulator, pomodoro-timer]
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

**出勤時刻 + 実勤務時間 + 無給休憩時間**を入力すると、退勤予定時刻と総滞在時間を表示します。7時間30分は`7.5`時間として入力でき、夜勤では翌日表示も確認できます。

## 主な機能
- 出勤時刻（時:分）入力
- 目標勤務時間（時間）+ 休憩時間（分）の合算計算
- 退勤予定時刻を自動算出
- 総滞在時間（勤務+休憩）と翌日判定を表示
- 日勤・夜勤のクイック入力と結果コピー
- 負の休憩、休憩の小数、24時間超の日程をエラー表示

## 使用例
- 出勤 09:00
- 勤務時間 8時間
- 休憩時間 60分

→ 退勤予定時刻: **18:00**

夜勤の例では、出勤`22:00`、実勤務`8時間`、休憩`60分`なら、結果は**翌日07:00**です。

## 計算基準と注意点
計算式は`出勤時刻 + 実勤務時間 + 無給休憩時間`です。有給休憩が勤務時間に含まれる場合は重ねて加算しないでください。残業、早退、法令、勤務先の規定は自動判定されないため、実際の勤怠記録と合わせて確認してください。

## 一緒に使うと便利なツール
- 勤務区間の確認: [時間差計算機]({{ '/ja/tools/time-difference-calculator/' | relative_url }})
- 出発時刻の準備: [約束の出発余裕シミュレーター]({{ '/ja/tools/appointment-departure-buffer-simulator/' | relative_url }})
- 集中ブロック運用: [ポモドーロタイマー]({{ '/ja/tools/pomodoro-timer/' | relative_url }})

## FAQ
### 休憩が複数回ある場合は？
昼休み+短い休憩のように分かれていても、合計分数で入力すればOKです。

### 実際の退勤時刻と差が出ることは？
残業、会議の延長、追加休憩などの要因があると、結果と差が出る場合があります。

### モバイルでも使えますか？
はい。ブラウザですぐ使え、別途インストールは不要です。

### 7時間30分はどう入力しますか？
実勤務時間に`7.5`と入力してください。総滞在時間は時間と分で表示されます。
