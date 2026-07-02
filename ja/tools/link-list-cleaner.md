---
layout: tool
title: リンク抽出整理ツール | URL抽出・UTM削除・リンク一覧変換
description: テキスト内の http、https、www、Markdownリンクをブラウザ内で抽出し、重複削除、UTM・クリック追跡パラメータ削除、ドメイン別整理、Markdown・HTML出力まで行います。
lang: ja
permalink: /ja/tools/link-list-cleaner/
canonical_url: /ja/tools/link-list-cleaner/
alternate_urls:
  ko: /tools/link-list-cleaner/
  en: /en/tools/link-list-cleaner/
  ja: /ja/tools/link-list-cleaner/
category: text
category_label: テキスト/リンク整理
thumbnail: /assets/thumbs/ja/link-list-cleaner.svg
image:
  path: /assets/thumbs/ja/link-list-cleaner.svg
  alt: リンク抽出整理ツールのサムネイル
tool_key: link-list-cleaner
tool_type: utility
topic_cluster: text
keywords: [リンク抽出, URL整理, UTM削除, リンク重複削除, ドメイン別整理, Markdownリンク一覧]
related_tools: [privacy-exposure-checker, text-line-break-cleaner, filename-sanitizer]
faq:
  - q: どんなリンクを抽出できますか?
    a: http:// と https:// で始まるURL、www. リンク、Markdownリンク内のURLを抽出します。文末のカンマ、ピリオド、余分な閉じ括弧なども整理します。
  - q: どの追跡パラメータを削除しますか?
    a: utm_source, utm_medium, utm_campaign, fbclid, gclid, msclkid, twclid, yclid など代表的なUTM・広告クリック系のキーを削除します。
  - q: 元の順番を保ったまま使えますか?
    a: はい。ドメイン別ソートをオフにすれば、入力順をできるだけ保ったまま整理できます。
  - q: 結果を文書に貼りやすい形式にできますか?
    a: はい。URLのみの一覧、Markdownの箇条書き、HTMLリンク一覧としてコピーできます。
  - q: 入力したテキストはサーバーに送信されますか?
    a: いいえ。貼り付けたテキストと整理結果はブラウザ内だけで処理されます。
---

## なぜリンク抽出整理ツールが必要ですか?
会議メモ、チャットログ、お知らせ文、リサーチ文書を扱っていると、リンクが本文のあちこちに混ざってしまい、必要なURLだけを抜き出しにくいことがよくあります。

たとえば次のような場面です。

- 参考リンクが複数段落に散らばっている
- メッセンジャーのやり取りで同じURLが何度も出てくる
- `utm_source`、`fbclid`、`msclkid` 付きの共有リンクが見づらい
- `www.example.com` のようにプロトコルがないリンクもまとめたい
- `[資料](https://example.com)` のようなMarkdown文書内のリンクも整理したい
- 文書に貼る前にドメインごとに整理したい

このツールは本文からURLだけを素早く抽出し、重複を減らし、よくある追跡パラメータを外して、共有しやすい一覧に整える utility 系ツールです。URLのみ、Markdown箇条書き、HTMLリンク一覧の形式でコピーでき、入力内容はサーバーへ送らず、ブラウザ内だけで処理します。

## 使い方
1. リンクが混ざったテキストをそのまま貼り付けます。
2. 重複削除、追跡パラメータ削除、ドメイン別整理のオプションを必要に応じてオンにします。
3. コピー用の出力形式をURL一覧、Markdown箇条書き、HTMLリンク一覧から選びます。
4. 整理された一覧とドメイン要約を確認します。
5. 結果をコピーして Notion、文書、チャット、参考資料一覧に貼り付けます。

## こんな場面で特に便利です
### 1) 会議メモやリサーチノートを整理したい時
本文全体を読み直さなくても、参考リンク欄をすばやく作れます。

### 2) チャット内で共有されたリンクをまとめたい時
同じリンクが何度も出てきても、重複を削ってすっきりした一覧にできます。

### 3) 外部共有前に追跡パラメータを減らしたい時
`utm_*`、`fbclid`、`gclid`、`msclkid` などを外して、見た目の整った共有URLにしやすくなります。

### 4) Markdown・HTMLの参考リンク一覧を作りたい時
整理したリンクを `- <https://...>` のMarkdown箇条書きや `<a href="...">...</a>` のHTMLリンク一覧としてコピーできます。

## 関連ツール
- まず個人情報が混ざっていないか確認したいなら: [個人情報露出チェックツール]({{ '/ja/tools/privacy-exposure-checker/' | relative_url }})
- コピーした本文の改行も一緒に整えたいなら: [テキスト改行クリーナー]({{ '/ja/tools/text-line-break-cleaner/' | relative_url }})
- 抽出したタイトルをファイル名風に整えたいなら: [ファイル名整理ツール]({{ '/ja/tools/filename-sanitizer/' | relative_url }})

## FAQ
### 1行に複数のリンクがあっても使えますか?
はい。1行の中に複数のURLがあっても、順番どおりに見つけて一覧化します。`www.` で始まるリンクは共有しやすいように `https://` 形式へ整え、Markdownリンク内のURLも対象にします。

### 追跡パラメータを消すとリンクは壊れませんか?
通常の共有URLならほとんど問題ありません。ただし一部サービスでは特定パラメータが必要な場合もあるため、大事なリンクは整理後に一度開いて確認するのが安全です。

### ドメイン別にまとめる利点は何ですか?
出典をざっと確認しやすく、同じサイトのリンクがどれくらいあるかもすぐ分かります。リサーチ整理や参考資料整理に特に向いています。

## まとめ
リンク抽出整理ツールは、**文章中のURL、wwwリンク、Markdownリンクを抽出し、重複削除・追跡パラメータ削除・ドメイン別整理・文書用の出力形式変換までまとめて行える utility 型ツール**です。
