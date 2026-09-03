---
layout: default
title: Toolog (English)
permalink: /en/
lang: en
---

<section class="discover">
  <header class="discover__head">
    <div class="discover__copy">
      <p class="eyebrow"><span></span> Everyday utilities, thoughtfully made</p>
      <h1>The tool you need,<br><strong>right now.</strong></h1>
      <p class="discover__lead">Finish image, text, and calculation tasks quickly in your browser—no install or sign-up required.</p>
      <div class="discover__proof"><span>✓ Free to use</span><span>✓ Browser-based</span><span>✓ {{ site.data.tools | size }} tools</span></div>
    </div>
    <div class="discover__visual" aria-hidden="true">
      <div class="visual-card visual-card--main"><span>What do you need?</span><strong>Get it done faster</strong><i>⌘ K</i></div>
      <div class="visual-card visual-card--float visual-card--one">Aa <small>Text</small></div>
      <div class="visual-card visual-card--float visual-card--two">42 <small>Calculate</small></div>
      <div class="visual-card visual-card--float visual-card--three">◫ <small>Image</small></div>
    </div>
  </header>

  <section class="discover__controls">
    <label class="search-box" for="toolSearch"><span aria-hidden="true">⌕</span><input id="toolSearch" type="search" placeholder="What do you need? Try image compressor or text counter" autocomplete="off" /><kbd>/</kbd></label>
    <div class="chip-row" id="chipBar">
      <button type="button" class="chip is-active" data-filter="all">All</button>
      {% assign en_labels = site.data.tools | map: 'category_label_en' | uniq | sort %}
      {% for label in en_labels %}
      {% if label and label != '' %}
      <button type="button" class="chip" data-filter="{{ label }}">{{ label }}</button>
      {% endif %}
      {% endfor %}
    </div>
  </section>

  <div class="section-heading section-heading--catalog"><div><p class="section-kicker">ALL TOOLS</p><h2>Explore every tool</h2></div><p>Search or browse by category.</p></div>
  <section class="tool-grid" id="toolGrid">
    {% for tool in site.data.tools %}
    {% assign localized_title = tool.title_en | default: tool.title %}
    {% assign localized_description = tool.description_en | default: tool.description %}
    {% assign localized_url = tool.url_en | default: tool.url %}
    {% assign localized_category_label = tool.category_label_en | default: tool.category_label %}
    <article class="tool-card" data-category="{{ localized_category_label }}" data-title="{{ localized_title | downcase }}" data-description="{{ localized_description | downcase }}">
      <a class="tool-thumb-wrap" href="{{ localized_url | relative_url }}" aria-label="{{ localized_title }}">
        <img class="tool-thumbnail" src="{{ '/assets/thumbs/en/' | append: tool.id | append: '.svg' | relative_url }}" alt="{{ localized_title }} thumbnail" loading="lazy" />
        <span class="tool-badge">{{ localized_category_label }}</span>
      </a>

      <div class="tool-meta">
        <a class="tool-title" href="{{ localized_url | relative_url }}">{{ localized_title }}</a>
        <p class="tool-desc">{{ localized_description }}</p>
        <span class="tool-card__action">Open tool <i aria-hidden="true">→</i></span>
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
    <div class="section-heading"><div><p class="section-kicker">JOURNAL</p><h2>Use tools better</h2></div><p>Practical guides and implementation notes.</p></div>
    {% assign en_posts = site.posts | where: "lang", "en" %}
    {% if en_posts.size > 0 %}
    <ul id="publishedPostsList">
      {% for post in en_posts %}
      <li>
        <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
        <small>{{ post.date | date: "%Y-%m-%d" }}</small>
      </li>
      {% endfor %}
    </ul>
    <div id="postPagination" class="tool-pagination" hidden>
      <button id="postPrev" type="button">Prev</button>
      <span id="postInfo">1 / 1</span>
      <button id="postNext" type="button">Next</button>
    </div>
    {% else %}
    <p>English posts are being prepared. Please check back soon.</p>
    {% endif %}
  </section>
</section>

<script src="{{ '/assets/js/ui.js' | relative_url }}" defer></script>
<script src="{{ '/assets/js/home.js' | relative_url }}" defer></script>
