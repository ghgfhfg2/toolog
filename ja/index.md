---
layout: default
title: Toolog（日本語）
permalink: /ja/
lang: ja
---

<section class="discover">
  <header class="discover__head">
    <div class="discover__copy">
      <p class="eyebrow"><span></span> Everyday utilities, thoughtfully made</p>
      <h1>必要なツールを、<br><strong>すぐに。</strong></h1>
      <p class="discover__lead">インストールも登録も不要。画像・テキスト・計算作業をブラウザですばやく安全に。</p>
      <div class="discover__proof"><span>✓ 無料</span><span>✓ ブラウザ内処理</span><span>✓ {{ site.data.tools | size }}ツール</span></div>
    </div>
    <div class="discover__visual" aria-hidden="true">
      <div class="visual-card visual-card--main"><span>今日必要な作業</span><strong>もっとすばやく</strong><i>⌘ K</i></div>
      <div class="visual-card visual-card--float visual-card--one">Aa <small>テキスト</small></div>
      <div class="visual-card visual-card--float visual-card--two">42 <small>計算</small></div>
      <div class="visual-card visual-card--float visual-card--three">◫ <small>画像</small></div>
    </div>
  </header>

  <section class="discover__controls">
    <label class="search-box" for="toolSearch"><span aria-hidden="true">⌕</span><input id="toolSearch" type="search" placeholder="必要なツールを検索（例：画像圧縮、文字数、割引計算）" autocomplete="off" /><kbd>/</kbd></label>
    <div class="chip-row" id="chipBar">
      <button type="button" class="chip is-active" data-filter="all">すべて</button>
      {% assign ja_labels = site.data.tools | map: 'category_label_ja' | uniq | sort %}
      {% for label in ja_labels %}
      {% if label and label != '' %}
      <button type="button" class="chip" data-filter="{{ label }}">{{ label }}</button>
      {% endif %}
      {% endfor %}
    </div>
  </section>

  <div class="section-heading section-heading--catalog"><div><p class="section-kicker">ALL TOOLS</p><h2>すべてのツール</h2></div><p>検索またはカテゴリから選べます。</p></div>
  <section class="tool-grid" id="toolGrid">
    {% for tool in site.data.tools %}
    {% assign localized_title = tool.title_ja | default: tool.title %}
    {% assign localized_description = tool.description_ja | default: tool.description %}
    {% assign localized_url = tool.url_ja | default: tool.url %}
    {% assign localized_category_label = tool.category_label_ja | default: tool.category_label %}
    <article class="tool-card" data-category="{{ localized_category_label }}" data-title="{{ localized_title | downcase }}" data-description="{{ localized_description | downcase }}">
      <a class="tool-thumb-wrap" href="{{ localized_url | relative_url }}" aria-label="{{ localized_title }}">
        <img class="tool-thumbnail" src="{{ '/assets/thumbs/ja/' | append: tool.id | append: '.svg' | relative_url }}" alt="{{ localized_title }} thumbnail" loading="lazy" />
        <span class="tool-badge">{{ localized_category_label }}</span>
      </a>

      <div class="tool-meta">
        <a class="tool-title" href="{{ localized_url | relative_url }}">{{ localized_title }}</a>
        <p class="tool-desc">{{ localized_description }}</p>
        <span class="tool-card__action">ツールを開く <i aria-hidden="true">→</i></span>
      </div>
    </article>
    {% endfor %}
  </section>

  <div id="toolPagination" class="tool-pagination" hidden>
    <button id="pgPrev" type="button">前へ</button>
    <span id="pgInfo">1 / 1</span>
    <button id="pgNext" type="button">次へ</button>
  </div>

  <p id="emptyState" class="empty-state" hidden>条件に一致するツールがありません。</p>

  <section class="published-posts">
    <div class="section-heading"><div><p class="section-kicker">JOURNAL</p><h2>ツール活用ガイド</h2></div><p>機能の仕組みと実践的な使い方。</p></div>
    {% assign ja_posts = site.posts | where: "lang", "ja" %}
    {% if ja_posts.size > 0 %}
    <ul id="publishedPostsList">
      {% for post in ja_posts %}
      <li>
        <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
        <small>{{ post.date | date: "%Y-%m-%d" }}</small>
      </li>
      {% endfor %}
    </ul>
    <div id="postPagination" class="tool-pagination" hidden>
      <button id="postPrev" type="button">前へ</button>
      <span id="postInfo">1 / 1</span>
      <button id="postNext" type="button">次へ</button>
    </div>
    {% else %}
    <p>日本語の記事は準備中です。もうしばらくお待ちください。</p>
    {% endif %}
  </section>
</section>

<script src="{{ '/assets/js/ui.js' | relative_url }}" defer></script>
<script src="{{ '/assets/js/home.js' | relative_url }}" defer></script>
