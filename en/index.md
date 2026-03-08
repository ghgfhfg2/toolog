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
        <a href="{{ '/' | relative_url }}">Korean</a> ·
        <a href="{{ '/en/' | relative_url }}">English</a> ·
        <a href="{{ '/ja/' | relative_url }}">日本語</a>
      </p>
    </div>
    <div class="discover__count">{{ site.data.tools | size }} tools</div>
  </header>

  <section class="discover__controls">
    <input id="toolSearch" type="search" placeholder="Search tools (e.g., PNG compressor, text counter)" autocomplete="off" />
    <div class="chip-row" id="chipBar">
      <button type="button" class="chip is-active" data-filter="all">All</button>
      <button type="button" class="chip" data-filter="image">Image/Graphics</button>
      <button type="button" class="chip" data-filter="text">Text/Editing</button>
      <button type="button" class="chip" data-filter="data">Data/Calculator</button>
    </div>
  </section>

  <section class="tool-grid" id="toolGrid">
    {% for tool in site.data.tools %}
    {% assign localized_title = tool.title_en | default: tool.title %}
    {% assign localized_description = tool.description_en | default: tool.description %}
    {% assign localized_badge = tool.badge_en | default: tool.badge %}
    {% assign localized_url = tool.url_en | default: tool.url %}
    <article class="tool-card" data-category="{{ tool.category }}" data-title="{{ localized_title | downcase }}" data-description="{{ localized_description | downcase }}">
      <a class="tool-thumb-wrap" href="{{ localized_url | relative_url }}" aria-label="{{ localized_title }}">
        <img class="tool-thumbnail" src="{{ '/assets/thumbs/en/' | append: tool.id | append: '.svg' | relative_url }}" alt="{{ localized_title }} thumbnail" loading="lazy" />
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
    <button id="pgPrev" type="button">Prev</button>
    <span id="pgInfo">1 / 1</span>
    <button id="pgNext" type="button">Next</button>
  </div>

  <p id="emptyState" class="empty-state" hidden>No tools match your filter.</p>

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
</section>

<script src="{{ '/assets/js/ui.js' | relative_url }}" defer></script>
<script src="{{ '/assets/js/home.js' | relative_url }}" defer></script>
