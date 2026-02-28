---
title: "[초안] 예시 글: 문자열 길이 계산기 만들기"
date: 2026-02-28 18:00:00 +0900
categories: [webtool, javascript]
tags: [javascript, tool, seo]
description: "문자열 길이 계산기를 만드는 방법과 핵심 구현 포인트"
---

## 문제
사용자가 텍스트 길이를 빠르게 확인하고 싶다.

## 설명
입력값 변화 이벤트를 감지해서 문자열 길이를 계산한다.

## 예시
```html
<input id="text" />
<p id="count">0</p>
<script>
  const input = document.getElementById('text');
  const count = document.getElementById('count');
  input.addEventListener('input', () => {
    count.textContent = input.value.length;
  });
</script>
```

## 요약
작은 웹툴은 단일 목적 + 빠른 반응성이 핵심이다.
