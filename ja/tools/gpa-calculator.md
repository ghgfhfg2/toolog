---
layout: tool
lang: ja
title: GPA計算機 | 4.5・4.3・4.0基準の加重平均GPAをすばやく計算
description: 科目ごとの単位数と成績を入力すると、4.5・4.3・4.0基準の加重平均GPAをすばやく計算できます。
permalink: /ja/tools/gpa-calculator/
canonical_url: /ja/tools/gpa-calculator/
category: calculator
category_label: 教育/学業
thumbnail: /assets/thumbs/ja/gpa-calculator.svg
image:
  path: /assets/thumbs/ja/gpa-calculator.svg
  alt: GPA計算機プレビュー
tool_key: gpa-calculator
keywords: [GPA計算機, 成績計算, 単位計算, 加重平均GPA, 大学成績]
related_tools: [average-calculator, percent-calculator, d-day-calculator]
faq:
  - q: P科目もGPAに含まれますか？
    a: 一般的にP/Pass科目はGPAから除外され、別枠の単位として扱われます。このツールでもP単位は別集計します。
  - q: 4.5、4.3、4.0スケールの違いは何ですか？
    a: 学校ごとにA+やB+などに割り当てる点数が異なるため、最終的なGPAも変わることがあります。自分の学校の基準に合うスケールを選んでください。
  - q: Fはどのように処理されますか？
    a: 多くの制度では、Fは単位不認定でもGPA計算上は0点として扱われます。このツールもその一般的な方式に沿っています。
alternate_urls:
  ko: /tools/gpa-calculator/
  en: /en/tools/gpa-calculator/
  ja: /ja/tools/gpa-calculator/
---

## 学期末のGPAをすぐ確認したいときに便利
学期末になると、**今学期のGPAがどのくらいになるのか**、
奨学金基準や成績維持条件を超えているかを早く確認したくなります。

このツールでは、科目ごとの単位数と成績を入力するだけで
**加重平均GPA**をすぐに計算できます。

## 主な機能
- 科目ごとの単位数 × 成績点による加重平均計算
- 4.5 / 4.3 / 4.0 スケールに対応
- P科目はGPA対象外単位として別集計
- GPA、総評点、反映単位、除外単位をまとめて確認

## 使い方
1. 学校の基準に合うGPAスケールを選びます。
2. 各科目の単位数を入力します。
3. 各科目の成績を選択します。
4. GPA、総評点、反映単位を確認します。

## 計算方法
GPAは通常、次のように計算します。

- 各科目の **単位数 × 成績点** を計算
- それらを合計して **総評点** を算出
- 総評点を **評価対象単位数の合計** で割ってGPAを計算

たとえば、3単位のA+科目と2単位のB+科目がある場合、
単純平均ではなく **加重平均** で反映されます。

## 関連ツール
- [平均計算機]({{ '/ja/tools/average-calculator/' | relative_url }})
- [パーセント計算機]({{ '/ja/tools/percent-calculator/' | relative_url }})
- [D-Day計算機]({{ '/ja/tools/d-day-calculator/' | relative_url }})

## FAQ
### なぜP科目はGPAから除外されるのですか？
多くの学校では、P/F科目は履修可否だけを示し、GPAには含めません。そのため、このツールでも別枠の単位として表示します。

### 学校ごとに成績点が少し違っても大丈夫ですか？
はい。4.5、4.3、4.0スケールから選べます。ただし、最終的には学校の公式な学事案内を確認するのが最も正確です。

### 再履修科目はどう入力すればよいですか？
通常は、実際の成績証明書で認定される成績だけを入力するほうが正確です。再履修の扱いは学校ごとに異なる場合があります。
