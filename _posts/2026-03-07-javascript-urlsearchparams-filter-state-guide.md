---
layout: post
title: "JavaScript URLSearchParams 실전 가이드: 필터 상태를 URL에 안전하게 유지하는 방법"
date: 2026-03-07 20:00:00 +0900
categories: [development, javascript, web]
tags: [URLSearchParams, 검색 필터 상태 유지, 쿼리스트링, 프론트엔드 UX, SEO]
description: "목록 페이지에서 검색·정렬·페이지 상태를 URLSearchParams로 관리하면 새로고침과 공유 링크에서 동일한 결과를 재현할 수 있습니다. 구현 순서와 예외 처리 포인트를 코드 예시로 정리합니다."
---

목록형 페이지(상품, 글, 툴 디렉토리)에서 필터를 적용했는데 새로고침 후 상태가 사라지면 사용자는 같은 동작을 반복해야 합니다.
링크를 공유해도 상대방이 같은 결과를 보지 못하면 신뢰도도 떨어집니다.

이 문제를 줄이는 가장 단순한 방법이 `URLSearchParams` 기반 상태 관리입니다.

## 문제

프론트엔드에서 필터 상태를 메모리 변수만으로 관리하면 아래 문제가 자주 생깁니다.

- 새로고침 시 상태 초기화
- 뒤로 가기/앞으로 가기에서 UI와 데이터가 어긋남
- 공유 URL이 재현 가능한 상태를 담지 못함

특히 검색 유입 사용자는 페이지에 다시 들어왔을 때 이전 설정이 유지되길 기대합니다.
이 기대를 충족하지 못하면 "작동은 하지만 불편한 서비스"로 인식되기 쉽습니다.

## 설명

핵심 원칙은 간단합니다.

1. **초기 렌더링 시 URL에서 상태를 읽는다**
2. **사용자 입력이 바뀔 때 URL을 갱신한다**
3. **URL 변경 후 렌더링을 단일 함수로 통합한다**

`URLSearchParams`를 쓰면 `?q=loan&sort=popular&page=2` 같은 쿼리를 안정적으로 다룰 수 있습니다.

추가로 아래 규칙을 같이 적용하면 운영 안정성이 올라갑니다.

- 빈 값은 쿼리에서 제거(`params.delete`)해 URL을 짧게 유지
- 페이지 번호/정렬 값은 허용 목록으로 제한
- `history.replaceState`와 `pushState`를 목적에 맞게 구분
  - 입력 중 실시간 반영: `replaceState`
  - 사용자가 명시적으로 검색 실행: `pushState`

## 예시

아래 예시는 검색어(`q`), 정렬(`sort`), 페이지(`page`)를 URL과 동기화하는 최소 구현입니다.

```js
const ALLOWED_SORT = new Set(['latest', 'popular']);

function readStateFromUrl() {
  const params = new URLSearchParams(window.location.search);

  const q = (params.get('q') || '').trim();
  const sortRaw = params.get('sort') || 'latest';
  const pageRaw = Number(params.get('page') || 1);

  return {
    q,
    sort: ALLOWED_SORT.has(sortRaw) ? sortRaw : 'latest',
    page: Number.isInteger(pageRaw) && pageRaw > 0 ? pageRaw : 1
  };
}

function writeStateToUrl(state, { push = false } = {}) {
  const params = new URLSearchParams(window.location.search);

  if (state.q) params.set('q', state.q);
  else params.delete('q');

  if (state.sort && state.sort !== 'latest') params.set('sort', state.sort);
  else params.delete('sort');

  if (state.page > 1) params.set('page', String(state.page));
  else params.delete('page');

  const qs = params.toString();
  const nextUrl = qs ? `?${qs}` : window.location.pathname;

  if (push) history.pushState(null, '', nextUrl);
  else history.replaceState(null, '', nextUrl);
}

function render() {
  const state = readStateFromUrl();
  // state 기반으로 API 요청/리스트 렌더링
  console.log('render state', state);
}

window.addEventListener('popstate', render);
```

이 구조를 쓰면 브라우저 히스토리 이동 시에도 `popstate`에서 같은 상태를 다시 렌더링할 수 있어 UI 불일치가 줄어듭니다.

## 요약

`URLSearchParams`는 단순한 쿼리 문자열 도구가 아니라, 목록형 페이지의 재현성과 신뢰도를 높이는 기본 장치입니다.

- 초기 상태를 URL에서 읽고
- 상태 변경을 URL에 쓰고
- 렌더링 경로를 하나로 통합하면

새로고침, 공유, 히스토리 이동에서 같은 결과를 유지할 수 있습니다.

## 내부 링크 후보

- [JavaScript debounce/throttle 가이드]({{ '/2026/03/06/javascript-debounce-throttle-guide.html' | relative_url }})
- [JavaScript 입력값 검증 체크리스트]({{ '/2026/03/07/javascript-input-validation-checklist.html' | relative_url }})
