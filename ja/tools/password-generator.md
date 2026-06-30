---
layout: tool
title: パスワード生成ツール | 強力なランダムパスワードを一括作成
description: 4〜128文字のランダムパスワードをブラウザ内で生成。英大文字・小文字・数字・記号、紛らわしい文字の除外、エントロピー、強度目安、一括コピーに対応します。
lang: ja
permalink: /ja/tools/password-generator/
canonical_url: /ja/tools/password-generator/
category: security
category_label: セキュリティ
thumbnail: /assets/thumbs/password-generator.svg
image:
  path: /assets/thumbs/password-generator.svg
  alt: パスワード生成ツールの結果プレビュー
tool_key: password-generator
keywords: [パスワード生成, ランダムパスワード, 強力なパスワード, セキュアパスワード, エントロピー, 一括パスワード生成]
related_tools: [password-strength-checker, privacy-exposure-checker, filename-sanitizer]
alternate_urls:
  ko: /tools/password-generator/
  en: /en/tools/password-generator/
  ja: /ja/tools/password-generator/
faq:
  - q: 生成したパスワードはサーバーに送信されますか？
    a: いいえ。このツールはブラウザ内で動作し、入力や結果を外部サーバーへ送信しません。
  - q: 選択した文字種は必ず含まれますか？
    a: はい。英大文字・英小文字・数字・記号で選択した種別は、各パスワードに最低1文字ずつ含まれます。
  - q: 推奨の文字数は？
    a: 通常アカウントは12文字以上、金融系や管理者アカウントは16文字以上が推奨です。
  - q: 紛らわしい文字を除外すると弱くなりますか？
    a: 文字プールが少し減るためエントロピーは下がります。ただし手入力する共有・一時パスワードでは入力ミスを減らせます。除外する場合は長さを少し増やすのがおすすめです。
---

## なぜパスワード生成が必要？
同じパスワードの使い回しや短いパスワードは、アカウント乗っ取りリスクを大きく高めます。
このツールは **推測されにくい強力なランダムパスワード** をすばやく作成できます。

## 主な機能
- **長さ（4〜128）** と **生成数（1〜20）** を設定
- 英大文字・英小文字・数字・記号の組み合わせ選択
- 紛らわしい文字の除外（`O/0`, `l/I/1`, `B/8`, `S/5`, `Z/2` など）
- 強度目安・文字プール・組み合わせ数・エントロピーを表示
- 一括生成時の重複最小化と一括コピー
- 長さ・生成数・文字種選択のエラーをすぐに表示

## 使い方
1. パスワードの長さと生成数を入力
2. 含める文字種を選択
3. 必要なら紛らわしい文字の除外をON
4. 生成ボタンを押して結果をコピー

## セキュリティのコツ
- サービスごとに **別のパスワード** を使う
- 可能なら **パスワードマネージャー** を利用
- **2段階認証（2FA）** を有効化する
- 手入力が必要な場合は紛らわしい文字を除外し、その分長めに設定すると実用的です。

## 関連ツール
- 候補の強度確認: [パスワード強度チェッカー]({{ '/ja/tools/password-strength-checker/' | relative_url }})
- メモ内の個人情報チェック: [個人情報露出チェッカー]({{ '/ja/tools/privacy-exposure-checker/' | relative_url }})
- ファイル名の機微情報整理: [ファイル名整理ツール]({{ '/ja/tools/filename-sanitizer/' | relative_url }})

## FAQ
### 一括生成で重複することはありますか？
可能な範囲では重複しない候補を優先します。ただし文字プールが小さい、または長さが短い場合は組み合わせ数が限られることがあります。
