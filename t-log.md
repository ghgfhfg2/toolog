---
layout: page
title: T-Log
permalink: /t-log/
---

툴 제작 과정과 업데이트 노트를 기록하는 공간입니다.

{% if site.posts.size > 0 %}
<ul>
  {% for post in site.posts %}
  <li><a href="{{ post.url | relative_url }}">{{ post.title }}</a> <small>({{ post.date | date: "%Y-%m-%d" }})</small></li>
  {% endfor %}
</ul>
{% else %}
아직 작성된 로그가 없습니다.
{% endif %}
