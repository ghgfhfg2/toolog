---
layout: tool
title: リスト形式変換ツール | 行リストをCSV・Markdown表・JSONへ変換
description: 行ごとのリストを貼り付けて、CSV、Markdown表、JSON配列、番号付きリストへすばやく変換できます。
lang: ja
permalink: /ja/tools/list-format-converter/
canonical_url: /ja/tools/list-format-converter/
alternate_urls:
  ko: /tools/list-format-converter/
  en: /en/tools/list-format-converter/
  ja: /ja/tools/list-format-converter/
category: productivity
category_label: 仕事/リスト形式変換
thumbnail: /assets/thumbs/ja/list-format-converter.svg
image:
  path: /assets/thumbs/ja/list-format-converter.svg
  alt: リスト形式変換ツールのサムネイル
tool_key: list-format-converter
tool_type: converter
topic_cluster: text
keywords: [リスト変換, CSV変換, Markdown表変換, JSON配列変換, リスト整理]
related_tools: [text-line-break-cleaner, link-list-cleaner, case-converter]
faq:
  - q: どのような形式で入力すればよいですか？
    a: 1行に1項目ずつ入力してください。カンマ、タブ、不要な空白はオプションに応じて整理できます。
  - q: 表の列名を変えられますか？
    a: はい。ヘッダー入力欄に好きな列名を入れると、CSVとMarkdown表の先頭行に反映されます。
  - q: 入力したリストはサーバーに保存されますか？
    a: いいえ。変換は現在のブラウザ内だけで実行され、サーバーへ送信・保存されません。
---

## なぜリスト形式変換ツールが必要ですか？
メッセンジャーやメモアプリに書いた行リストを、仕事の文書、ブログ記事、スプレッドシート、開発ドキュメントへ貼り付けるには、形式を整える時間が意外とかかります。項目ごとに番号を付けたり、CSV用にカンマをエスケープしたり、Markdown表の区切り行を入れたりする作業は単純ですが、繰り返し発生しやすいものです。

このツールは、1行に1項目ずつ書かれたリストを**CSV、Markdown表、JSON配列、番号付きリスト**へすぐに変換します。ブラウザ内だけで処理されるため、仕事のリスト、会議の議題、ブログ素材、チェックリストの下書きをすばやく整理したい時に便利です。

## 使い方
1. 変換したいリストを、1行に1項目ずつ貼り付けます。
2. 結果形式をCSV、Markdown表、JSON配列、番号付きリストから選びます。
3. 必要に応じて、空行削除、前後の空白削除、重複項目削除のオプションをオンにします。
4. `リストを変換`を押して結果を確認します。
5. コピーボタンで文書、スプレッドシート、Notion、READMEなどに貼り付けます。

## 特に便利な場面
### 1) メモのリストをスプレッドシートに入れる時
行リストをCSVに変換してコピーすると、スプレッドシートや表エディターに貼り付けやすくなります。

### 2) READMEやブログに表を作る時
項目リストをMarkdown表に変換すれば、区切り行や行の形式を毎回手で作る必要がありません。

### 3) 開発ドキュメントや自動化の入力値を作る時
リストをJSON配列に変換すると、簡単な設定値、テストデータ、サンプル入力をすばやく準備できます。

## 関連ツール
- コピーしたテキストの改行を先に整える: [テキスト改行整理ツール]({{ '/ja/tools/text-line-break-cleaner/' | relative_url }})
- 複数のリンクリストを先に整理する: [リンクリスト整理ツール]({{ '/ja/tools/link-list-cleaner/' | relative_url }})
- 英字の大文字小文字形式も変える: [大文字小文字変換ツール]({{ '/ja/tools/case-converter/' | relative_url }})

## FAQ
### カンマを含む項目もCSVに変換されますか？
はい。カンマ、引用符、改行を含む項目はCSVのルールに従って引用符で囲み、内部の引用符をエスケープします。

### 重複項目はどのように処理されますか？
`重複を削除`オプションをオンにすると、整理後の文字列を基準に同じ項目を1つだけ残します。元の順序はできるだけ維持します。

### 機密性の高いリストを入れてもよいですか？
ツールは入力内容をサーバーへ送信しませんが、アカウント情報や個人情報のような機密性の高い内容は、できるだけ入力しない方が安全です。

## まとめ
リスト形式変換ツールは、**行リストをCSV・Markdown表・JSON・番号付きリストへ変えるconverter型ツール**です。
直前の公開がgenerator型、その前がchecker型だったため、今回は計算機ではなくテキスト変換型のインタラクションを追加し、最近のツール公開フローに多様性を持たせています。
