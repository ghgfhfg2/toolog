---
layout: tool
title: 割り勘計算機 | 1人あたり金額・丸め・最後の1人調整
description: 合計金額と人数から、正確な1人あたり金額、10/100/1000単位の丸め、最後の1人の調整額、コピー用の精算メモを確認できます。
category: calculator
category_label: 生活/精算
thumbnail: /assets/thumbs/ja/split-bill-calculator.svg
image:
  path: /assets/thumbs/ja/split-bill-calculator.svg
  alt: 割り勘計算機のサムネイル
tool_key: split-bill-calculator
tool_type: calculator
topic_cluster: finance
lang: ja
permalink: /ja/tools/split-bill-calculator/
canonical_url: /ja/tools/split-bill-calculator/
keywords: [割り勘計算機, 1人あたり計算, 精算ツール, 会計分割, 端数調整]
related_tools: [tip-calculator, unit-price-calculator, percent-calculator]
faq:
  - q: 丸め単位はどう使いますか？
    a: 1円、10円、100円、1000円単位から選ぶと、標準金額をその単位で丸めます。最後の1人が差額を調整するため、合計金額は一致します。
  - q: なぜ最後の1人の金額が違うのですか？
    a: 丸めで生じた差額を最後の1人が調整し、合計金額を正確に合わせるためです。
  - q: 最後の1人がマイナスになることはありますか？
    a: 合計金額や人数に対して丸め単位が大きすぎると発生します。このツールはその場合に警告し、小さい単位または切り捨てを案内します。
---

## 割り勘計算機が便利な場面
食事代、タクシー代、配達費、会費などを複数人で分けるときに便利です。

合計金額と人数を入れるだけで、基本の1人あたり金額、丸め後の金額、そして合計を合わせるための最後の1人の調整額まで確認できます。
小さな端数を丸めても、集めすぎ・不足が出ないように精算メモを作れます。

## 主な機能
- 合計金額を人数で割って1人あたりを計算
- 1 / 10 / 100 / 1000単位の丸め対応
- 最後の1人で差額を自動調整
- 空欄、負数、小数、大きすぎる金額、成立しない丸め条件を案内
- 共有しやすい精算メモをコピー可能

## 計算例
合計50,000を3人で分け、100単位で丸める場合、2人は16,700、最後の1人は16,600になります。
集める合計は50,000のままです。

## 入力の目安
- 合計金額は1以上1兆以下の整数で入力してください。
- 人数は1〜200人で入力してください。
- 最後の1人がマイナスになる場合は、丸め単位を下げるか切り捨てを選んでください。
- 税、配送料、チップ、サービス料を一緒に分ける場合は合計金額に含めてください。

## 関連ツール
- [チップ計算機]({{ '/ja/tools/tip-calculator/' | relative_url }})
- [単価計算機]({{ '/ja/tools/unit-price-calculator/' | relative_url }})
- [パーセント計算機]({{ '/ja/tools/percent-calculator/' | relative_url }})

## FAQ
### モバイルでも使えますか？
はい。ブラウザ上で動作し、入力内容は端末内で処理されます。

### 1人だけ入力するとどうなりますか？
合計金額がそのまま1人分として表示されます。精算前の合計確認にも使えます。
