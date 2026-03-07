---
layout: tool
title: JSON結合 | 複数のJSONファイルを一括マージ
description: 同じ形式のJSONファイルを複数アップロードし、1つのJSONに結合してダウンロードできます。
lang: ja
permalink: /ja/tools/json-merge/
canonical_url: /ja/tools/json-merge/
category: data
category_label: データ・ユーティリティ
thumbnail: /assets/thumbs/json-merge.svg
tool_key: json-merge
keywords: [json 結合, json マージ, 複数 json 1つ, json merge]
related_tools: [text-counter, case-converter]
alternate_urls:
  ko: /tools/json-merge/
  en: /en/tools/json-merge/
  ja: /ja/tools/json-merge/
---

## JSON結合はどんな時に便利？
同じスキーマのJSONが複数に分かれているとき、素早く1つにまとめたい場合に便利です。

例: 分割ログ、バッチ結果、ページ分割された収集データ。

## 主な機能
- JSON複数ファイルアップロード
- 自動モード（配列/オブジェクトを自動判定）
- 手動モード（配列連結・オブジェクトキー結合・ルート配列化）
- 結果プレビュー + `merged.json` ダウンロード

## 使い方
1. JSONファイルを複数アップロード
2. 結合モードを選択（初期値: 自動）
3. **JSON結合** ボタンをクリック
4. 結果を確認して保存

## 注意
- オブジェクト結合では同じキーがある場合、後に読み込んだ値が優先されます。
- 大容量ファイルはブラウザメモリ使用量が増える場合があります。

## 関連ツール
- 文字数確認: [文字数カウンター]({{ '/tools/text-counter/' | relative_url }})
- キー形式整理: [大文字小文字変換]({{ '/tools/case-converter/' | relative_url }})
