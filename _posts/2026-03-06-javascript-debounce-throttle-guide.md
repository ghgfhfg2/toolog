---
title: "JavaScript Debounce와 Throttle 차이: 입력 이벤트를 안정적으로 제어하는 기준"
date: 2026-03-06 20:00:00 +0900
categories: [webdev, javascript, performance]
tags: [JavaScript, Debounce, Throttle, 이벤트 최적화, 성능]
description: "검색 입력, 스크롤, 리사이즈 같은 고빈도 이벤트에서 Debounce와 Throttle을 언제 써야 하는지 문제-설명-예시-요약 구조로 정리합니다."
---

검색창, 무한 스크롤, 창 크기 변경 같은 UI에서는 이벤트가 짧은 시간에 매우 많이 발생합니다.
이때 아무 제어 없이 API 요청이나 무거운 연산을 연결하면 응답 지연, 중복 요청, 렌더링 끊김이 생기기 쉽습니다.

이 글은 고빈도 이벤트를 다룰 때 자주 쓰는 **Debounce**와 **Throttle**의 차이와 선택 기준을 정리합니다.

## 문제

예를 들어 사용자가 검색창에 `react`를 입력하는 동안 `input` 이벤트는 글자마다 발생합니다.
글자마다 즉시 API를 호출하면 다음 문제가 생길 수 있습니다.

- 불필요한 네트워크 요청 증가
- 이전 요청 응답이 늦게 도착해 최신 결과를 덮어쓰는 문제
- 브라우저 메인 스레드 부하 증가

스크롤/리사이즈도 비슷합니다.
이벤트가 초당 수십~수백 번 발생할 수 있어, 매 이벤트마다 레이아웃 계산이나 DOM 갱신을 수행하면 프레임 드랍이 생깁니다.

## 설명

핵심은 "이벤트를 언제 실행할지"를 제어하는 것입니다.

- **Debounce**: 마지막 이벤트 이후 일정 시간이 지나야 1회 실행
  - 입력 완료 뒤 한 번만 처리하고 싶을 때 적합
  - 예: 검색 자동완성 API 호출, 폼 유효성 검사

- **Throttle**: 일정 간격마다 최대 1회 실행
  - 이벤트 흐름을 주기적으로 처리하고 싶을 때 적합
  - 예: 스크롤 위치 기반 UI 업데이트, 리사이즈 중 레이아웃 계산

실무에서는 "사용자 의도" 기준으로 고르는 것이 안전합니다.

- "입력이 멈춘 뒤 최종값만 필요" → Debounce
- "연속 동작 중에도 중간 상태를 계속 반영" → Throttle

## 예시

아래는 기본적인 Debounce/Throttle 구현 예시입니다.

```js
function debounce(fn, delay = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

function throttle(fn, interval = 200) {
  let lastCall = 0;
  return (...args) => {
    const now = Date.now();
    if (now - lastCall >= interval) {
      lastCall = now;
      fn(...args);
    }
  };
}

const onSearchInput = debounce((keyword) => {
  // 입력이 멈춘 뒤 API 1회 호출
  fetch(`/api/search?q=${encodeURIComponent(keyword)}`);
}, 300);

const onScroll = throttle(() => {
  // 스크롤 중 200ms 간격으로만 실행
  console.log(window.scrollY);
}, 200);
```

추가로 검색 API처럼 응답 순서가 중요한 경우, Debounce만으로 충분하지 않을 수 있습니다.
이때는 `AbortController`로 이전 요청을 취소하거나, 요청 시퀀스 번호를 비교해 최신 응답만 반영하는 패턴을 같이 쓰는 편이 안전합니다.

## 내부 링크 후보

- [JavaScript 소수점 오차 줄이기: 금액 계산에서 반올림 규칙을 고정하는 방법]({% post_url 2026-03-05-javascript-floating-point-rounding-guide %})
- [Jekyll canonical URL 일관성 체크: 중복 URL 인덱싱을 줄이는 기본 점검]({% post_url 2026-03-04-jekyll-canonical-url-consistency %})

## 요약

- Debounce는 "마지막 입력 이후 1회 실행"에 적합합니다.
- Throttle은 "연속 이벤트를 일정 주기로 샘플링"할 때 적합합니다.
- 선택 기준은 구현 취향이 아니라 사용자 경험과 데이터 일관성입니다.
- API 호출이 포함되면 취소/경합 처리까지 함께 설계해야 안정적으로 동작합니다.
