---
layout: tool
title: 画像リサイズツール | サイズ変更・切り抜き・余白調整
description: 画像を指定ピクセルへすばやくリサイズ。Instagram、ブログ、OG用プリセット、比率固定、全体表示・切り抜き・引き伸ばし方式とサイズチェックに対応します。
lang: ja
permalink: /ja/tools/image-resizer/
canonical_url: /ja/tools/image-resizer/
category: image
category_label: 画像・グラフィック
thumbnail: /assets/thumbs/image-resizer.svg
image:
  path: /assets/thumbs/image-resizer.svg
  alt: 画像リサイズツールの出力プレビュー
tool_key: image-resizer
keywords: [画像リサイズ, 写真サイズ変更, 画像サイズ調整, 画像切り抜き, Instagram サイズ, OG画像サイズ]
related_tools: [png-compressor, youtube-image-kit, text-counter]
alternate_urls:
  ko: /tools/image-resizer/
  en: /en/tools/image-resizer/
  ja: /ja/tools/image-resizer/
faq:
  - q: リサイズすると必ず画質は落ちますか？
    a: 解像度を下げると一部ディテールは減りますが、用途に合ったサイズへ調整すれば劣化を最小限にできます。
  - q: アスペクト比固定はいつ使う？
    a: 歪みを防ぐため、幅か高さの片方だけ変更する場合は固定ONがおすすめです。
  - q: 全体表示と切り抜きはどう違いますか？
    a: 全体表示は画像全体を残して必要に応じて余白を入れ、切り抜きは指定サイズを埋めるように端をトリミングします。
  - q: OG画像の推奨サイズは？
    a: 一般的には1200×630がよく使われます。
---

## 画像リサイズが必要な場面
アップロード時にサイズ不一致で切れたり、ぼやけたりすることがよくあります。
このツールなら、投稿前に目的の規格へすばやく合わせられます。
画像はサーバーへ送らずブラウザ内で処理するため、サムネイル、SNS共有画像、ブログ代表画像の調整に向いています。

## 主な機能
- Instagram正方形（1080×1080）、OG（1200×630）などのプリセット
- 幅・高さを自由に指定できる手動入力
- アスペクト比固定で歪みを防止
- 全体表示（余白）、切り抜き、指定サイズへの引き伸ばしを選択
- 空ファイル、画像以外のファイル、過大サイズ入力への案内
- 元画像、目標サイズ、出力容量、フィット方式を確認

## 使い方
1. 画像をアップロード
2. プリセット選択またはピクセルを直接入力
3. 全体表示、切り抜き、引き伸ばしから方式を選択
4. リサイズ実行後にダウンロード

## 実践ポイント
- ブログ代表画像は16:9（例: 800×450）が扱いやすいです。
- SNS共有カードは1200×630から作ると互換性が高いです。
- 商品写真やスクリーンショットなど端を切りたくない画像は全体表示を使うと安全です。
- リサイズ後に [PNG圧縮ツール]({{ '/ja/tools/png-compressor/' | relative_url }}) を使うとさらに軽量化できます。
- YouTube用サムネイル、バナー、アイコンが必要な場合は [YouTube画像セットメーカー]({{ '/ja/tools/youtube-image-kit/' | relative_url }}) も使えます。

## 関連ツール
- 容量最適化: [PNG圧縮ツール]({{ '/ja/tools/png-compressor/' | relative_url }})
- YouTube用画像セット: [YouTube画像セットメーカー]({{ '/ja/tools/youtube-image-kit/' | relative_url }})
- キャプション文字数確認: [文字数カウンター]({{ '/ja/tools/text-counter/' | relative_url }})
