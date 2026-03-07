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
        <a href="{{ '/' | relative_url }}">한국어</a> ·
        <a href="{{ '/en/' | relative_url }}">English</a> ·
        <a href="{{ '/ja/' | relative_url }}">日本語</a>
      </p>
    </div>
    <div class="discover__count">{{ site.data.tools | size }} tools</div>
  </header>

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

  <section class="published-posts">
    <h2>人気ツール</h2>
    <ul>
      {% for tool in site.data.tools limit: 12 %}
      <li><a href="{{ tool.url | relative_url }}">{{ tool.title }}</a></li>
      {% endfor %}
    </ul>
  </section>
</section>
