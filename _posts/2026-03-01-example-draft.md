---
title: "문자열 길이 계산기 만들기: JavaScript로 실시간 글자수 세기"
date: 2026-03-01 08:05:00 +0900
categories: [webtool, javascript]
tags: [javascript, 문자열길이계산기, 글자수세기, input이벤트]
description: "문자열 길이 계산기를 JavaScript input 이벤트로 구현하는 방법과 이모지·공백·바이트 처리까지 한 번에 정리합니다."
---

문자열 길이 계산기는 블로그 작성, 과제 제출, SNS 글자수 제한 확인처럼 **짧은 시간에 정확한 길이 확인**이 필요할 때 자주 쓰입니다.  
이 글에서는 HTML+JavaScript만으로 실시간 카운터를 만들고, 실무에서 자주 놓치는 포인트(공백 제외, 바이트, 이모지 길이)를 함께 정리합니다.

## 문자열 길이 계산기가 필요한 상황

- 자기소개서/지원서 글자수 제한 확인
- 게시글, 댓글, 상품 설명 문구 길이 맞추기
- DB 저장 전 입력 길이 검증(최대 길이 제한)

툴을 바로 써보고 싶다면 [텍스트 카운터 도구](/tools/text-counter/)를 먼저 사용해도 됩니다.

## 구현 목표: 무엇을 몇 가지 기준으로 셀까?

단순 `length`만 보여주면 실사용에서 부족합니다. 보통 아래 4가지를 같이 제공하면 사용성이 좋아집니다.

### 1) 글자수(공백 포함)

사용자가 입력한 문자열 전체 길이입니다.

### 2) 글자수(공백 제외)

`\s`(공백, 탭, 줄바꿈)를 제거한 뒤 길이를 계산합니다.

### 3) 단어수

공백 기준으로 분리하되, 연속 공백은 제거해서 계산합니다.

### 4) 바이트(UTF-8)

한글/이모지는 바이트 수가 더 커질 수 있어서 서버 제한(예: VARCHAR, API payload) 확인에 유용합니다.

## JavaScript 예제 코드

```html
<label for="text">텍스트 입력</label>
<textarea id="text" rows="6" placeholder="문장을 입력하세요"></textarea>

<ul>
  <li>글자수(공백 포함): <strong id="chars">0</strong></li>
  <li>글자수(공백 제외): <strong id="noSpaces">0</strong></li>
  <li>단어수: <strong id="words">0</strong></li>
  <li>바이트(UTF-8): <strong id="bytes">0</strong></li>
</ul>

<script>
  const input = document.getElementById('text');
  const chars = document.getElementById('chars');
  const noSpaces = document.getElementById('noSpaces');
  const words = document.getElementById('words');
  const bytes = document.getElementById('bytes');

  const utf8Bytes = (str) => new TextEncoder().encode(str).length;

  const update = () => {
    const value = input.value;
    chars.textContent = value.length;
    noSpaces.textContent = value.replace(/\s/g, '').length;
    words.textContent = value.trim() ? value.trim().split(/\s+/).length : 0;
    bytes.textContent = utf8Bytes(value);
  };

  input.addEventListener('input', update);
  update();
</script>
```

## 정확도를 높이는 실무 체크포인트

### 이모지 길이는 `length`와 체감 길이가 다를 수 있음

`"👍".length`가 2로 나오는 경우가 있습니다. JavaScript `length`는 사용자 눈에 보이는 글자 수가 아니라 UTF-16 코드 유닛 길이를 기준으로 계산하기 때문입니다.

- 사용자 체감 글자수 기준이 필요하면 `Intl.Segmenter` 같은 방법을 검토하세요.
- 단순 제한 검증(프론트/백엔드 일치)이 목적이라면 `length` 기준도 충분합니다.

### 모바일 가독성

모바일에서는 결과 영역을 1열로 배치하고 숫자 강조를 크게 주는 편이 읽기 쉽습니다. 입력창은 최소 5~6줄 높이를 권장합니다.

## 함께 보면 좋은 내부 링크

- [텍스트 카운터](/tools/text-counter/): 바로 실행 가능한 완성 도구
- [단위 변환기](/tools/unit-converter/): 숫자/단위 변환이 필요한 경우
- [홈으로 이동](/): 다른 도구 탐색

## FAQ

### Q1. 문자열 길이와 바이트는 왜 다른가요?
문자열 길이는 문자 단위 계산이고, 바이트는 인코딩(UTF-8) 기준 저장 용량 계산이라 값이 다를 수 있습니다.

### Q2. 공백 제외 글자수는 어떻게 계산하나요?
정규식 `value.replace(/\s/g, '')`로 공백/탭/줄바꿈을 제거한 뒤 길이를 계산합니다.

### Q3. 이모지를 1글자로 정확히 세려면 어떻게 하나요?
브라우저 지원 범위 내에서 `Intl.Segmenter`를 사용하면 사용자 체감 글자수에 더 가깝게 셀 수 있습니다.

## 참고 자료

- [MDN: String.length](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/length)
- [MDN: TextEncoder](https://developer.mozilla.org/en-US/docs/Web/API/TextEncoder)
- [MDN: Intl.Segmenter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter)

요약하면, 문자열 길이 계산기의 핵심은 **실시간 반응 + 계산 기준의 명확성**입니다. 먼저 `length`/공백 제외/단어수/바이트를 안정적으로 제공하고, 필요 시 이모지 처리 정확도를 단계적으로 높이면 됩니다.
