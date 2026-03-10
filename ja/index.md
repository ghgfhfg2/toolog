---
layout: default
title: Toolog（日本語）
permalink: /ja/
---

<section class="discover">
  <header class="discover__head">
    <div>
      <h1>Toolog | 実用Webツール集</h1>
      <p>画像・テキスト・計算ツールをすぐに見つけて使えます。</p>
      <p style="margin-top:8px;font-size:14px;">
        言語:
        <a href="{{ '/' | relative_url }}">韓国語</a> ·
        <a href="{{ '/en/' | relative_url }}">English</a> ·
        <a href="{{ '/ja/' | relative_url }}">日本語</a>
      </p>
    </div>
    <div class="discover__count">{{ site.data.tools | size }} tools</div>
  </header>

  <section class="discover__controls">
    <input id="toolSearch" type="search" placeholder="ツール検索 (例: PNG 圧縮, 文字数カウンター)" autocomplete="off" />
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

  <section class="tool-grid" id="toolGrid">
    {% for tool in site.data.tools %}
    {% assign localized_title = tool.title_ja | default: tool.title %}
    {% assign localized_description = tool.description_ja | default: tool.description %}
    {% assign localized_badge = tool.badge_ja | default: tool.badge %}
    {% assign localized_url = tool.url_ja | default: tool.url %}
    {% assign localized_category_label = tool.category_label_ja | default: tool.category_label %}
    <article class="tool-card" data-category="{{ localized_category_label }}" data-title="{{ localized_title | downcase }}" data-description="{{ localized_description | downcase }}">
      <a class="tool-thumb-wrap" href="{{ localized_url | relative_url }}" aria-label="{{ localized_title }}">
        <img class="tool-thumbnail" src="{{ '/assets/thumbs/ja/' | append: tool.id | append: '.svg' | relative_url }}" alt="{{ localized_title }} thumbnail" loading="lazy" />
        <span class="tool-badge">{{ localized_badge }}</span>
      </a>

      <div class="tool-meta">
        <a class="tool-title" href="{{ localized_url | relative_url }}">{{ localized_title }}</a>
        <p class="tool-desc">{{ localized_description }}</p>
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
    <h2>最新記事（JA）</h2>
    {% assign ja_posts = site.posts | where: "lang", "ja" %}
    {% if ja_posts.size > 0 %}
    <ul>
      {% for post in ja_posts limit: 12 %}
      <li>
        <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
        <small>{{ post.date | date: "%Y-%m-%d" }}</small>
      </li>
      {% endfor %}
    </ul>
    {% else %}
    <p>日本語の記事は準備中です。もうしばらくお待ちください。</p>
    {% endif %}
  </section>
</section>

<script src="{{ '/assets/js/ui.js' | relative_url }}" defer></script>
<script src="{{ '/assets/js/home.js' | relative_url }}" defer></script>
