---
layout: default
title: Toolog (English)
permalink: /en/
---

<section class="discover">
  <header class="discover__head">
    <div>
      <h1>Toolog | Practical Web Tools</h1>
      <p>Find useful image, text, and calculator tools and run them instantly.</p>
      <p style="margin-top:8px;font-size:14px;">
        Language:
        <a href="{{ '/' | relative_url }}">한국어</a> ·
        <a href="{{ '/en/' | relative_url }}">English</a> ·
        <a href="{{ '/ja/' | relative_url }}">日本語</a>
      </p>
    </div>
    <div class="discover__count">{{ site.data.tools | size }} tools</div>
  </header>

  <section class="published-posts">
    <h2>Recent Posts (EN)</h2>
    {% assign en_posts = site.posts | where: "lang", "en" %}
    {% if en_posts.size > 0 %}
    <ul>
      {% for post in en_posts limit: 12 %}
      <li>
        <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
        <small>{{ post.date | date: "%Y-%m-%d" }}</small>
      </li>
      {% endfor %}
    </ul>
    {% else %}
    <p>English posts are being prepared. Please check back soon.</p>
    {% endif %}
  </section>

  <section class="published-posts">
    <h2>Popular Tools</h2>
    <ul>
      {% for tool in site.data.tools limit: 12 %}
      <li><a href="{{ tool.url | relative_url }}">{{ tool.title }}</a></li>
      {% endfor %}
    </ul>
  </section>
</section>
