---
layout: tool
title: 大文字/小文字変換ツール | camelCase・snake_case・kebab-case
description: UPPERCASE、lowercase、Title Case、camelCase、snake_case、kebab-caseへ変換し、結合語の分割と結果コピーも行えます。
lang: ja
permalink: /ja/tools/case-converter/
canonical_url: /ja/tools/case-converter/
category: text
category_label: テキスト/編集
thumbnail: /assets/thumbs/case-converter.svg
image:
  path: /assets/thumbs/case-converter.svg
  alt: 大文字/小文字変換ツールのプレビュー
tool_key: case-converter
keywords: [大文字 小文字 変換, camelCase 変換, snake_case 変換, kebab-case 変換, テキスト整形, 命名規則]
related_tools: ['text-counter', 'unit-converter']
faq:
  - q: camelCaseとsnake_caseはどのように使い分けますか？
    a: プロジェクトの規約に従うのが基本です。camelCaseはJavaScriptの変数名、snake_caseはデータベース列やバックエンドのフィールド名でよく使われます。
  - q: 韓国語のテキストも変換できますか？
    a: 韓国語には大文字・小文字の区別がないため、ケース変換は主に英単語に適用されます。
  - q: 空白や記号はどのように処理されますか？
    a: 多くの空白や記号を区切りとして単語を分割し、選択した形式で組み直します。
  - q: 既存のcamelCaseやAPIResponseも単語に分割できますか？
    a: はい。小文字から大文字への境界や一般的な略語境界を検出してから、選択した形式へ変換します。
  - q: 入力したテキストはサーバーに送信されますか？
    a: いいえ。変換処理はブラウザ内だけで行われます。
alternate_urls:
  ko: /tools/case-converter/
  en: /en/tools/case-converter/
  ja: /ja/tools/case-converter/
---

## 命名規則をすばやく統一
この**大文字/小文字変換ツール**は、「camelCase 変換」や「snake_case 変換」といった検索意図に対応しています。コード、ドキュメント、データ項目の変数名・見出し・ラベルを手早く統一できます。

## 対応フォーマット
- UPPERCASE
- lowercase
- Title Case
- camelCase
- snake_case
- kebab-case

`customerOrder`や`APIResponse`のような結合語も変換前に分割します。検出単語数を確認し、完成した結果をワンクリックでコピーできます。

## 使い方
### 1. 元のテキストを入力
最大50,000文字まで入力または貼り付けます。

### 2. 命名形式を選択
必要な形式を選びます。`camelCase`や`APIResponse`のようにつながった英単語の境界も認識します。

### 3. 結果をコピー
変換結果を確認し、コピーボタンからコード、ドキュメント、スプレッドシートへ貼り付けます。

## 活用例
### APIフィールド名の統一
自然文のラベルをcamelCaseやsnake_caseへ変換し、API仕様書とフィールド名の表記を統一できます。

### タイトルや見出しの整理
大文字・小文字・タイトル形式が混在したドキュメントをすばやく整えられます。

## 関連ツール
- 文字数チェック: [文字数カウンター]({{ '/ja/tools/text-counter/' | relative_url }})
- 単位換算: [単位変換ツール]({{ '/ja/tools/unit-converter/' | relative_url }})
- ケーススタイルの参考: [MDN - 字句文法](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Lexical_grammar)

## FAQ
### camelCaseとsnake_caseはどのように使い分けますか？
プロジェクト規約に従うのが基本です。camelCaseはフロントエンドやJavaScriptの変数名、snake_caseはデータベース列やバックエンドのフィールド名でよく使われます。

### 韓国語のテキストも変換できますか？
韓国語には大文字・小文字の区別がないため、選択したケース規則は主に英単語へ適用されます。

### 特殊記号が含まれていても変換できますか？
多くの特殊記号は単語の区切りとして処理されます。記号自体に意味がある場合は、変換結果を確認してください。

## まとめ
大文字/小文字変換ツールは繰り返し編集を減らし、コード、ドキュメント、データ項目の表記を統一するための基本ツールです。
