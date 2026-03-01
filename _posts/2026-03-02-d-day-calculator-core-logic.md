---
title: "디데이 계산기 핵심 로직: 달력일·업무일 D-day 계산 구현"
date: 2026-03-02 01:00:00 +0900
categories: [webtool, javascript, date]
tags: [디데이계산기, 날짜차이계산, 업무일계산, dday, javascript]
description: "디데이 계산기의 핵심 로직을 문제 정의부터 날짜 차이 계산 원리, 업무일(주말 제외) 알고리즘, 복사/예외 처리까지 코드 중심으로 정리합니다."
---

시험일, 계약 만료일, 프로젝트 마감일처럼 날짜 기반 일정은 단순히 `D-몇`만 알면 끝나지 않습니다.  
이번 글은 직전 추가한 **디데이 계산기** 웹툴의 핵심 로직을 실제 코드 기준으로 정리한 구현 노트입니다.

- 바로 사용: [디데이 계산기]({{ '/tools/d-day-calculator/' | relative_url }})

## 문제: D-day 하나로는 일정 판단이 부족한 이유

### 1) 달력일과 업무일이 다름
토·일이 포함된 기간은 체감 일정과 실제 작업 가능 일정이 다릅니다.

### 2) 포함 일수 요구가 자주 등장
"3월 1일부터 3월 1일까지는 0일인가 1일인가?" 같은 포함 기준이 필요합니다.

### 3) 과거 날짜 처리 필요
목표일이 지났을 때도 오류 없이 `D+`로 해석돼야 실무에서 쓸 수 있습니다.

## 원리: 날짜를 로컬 Date로 고정하고 차이를 정수 일수로 계산

핵심은 입력 문자열(`YYYY-MM-DD`)을 로컬 기준 `Date(y, m-1, d)`로 변환한 뒤, 밀리초 차이를 하루 단위로 반올림해 정수 일수로 다루는 것입니다.

```js
const toLocalDateOnly = (v) => {
  if (!v) return null;
  const [y, m, d] = v.split('-').map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
};

const dayDiff = (a, b) => Math.round((b.getTime() - a.getTime()) / 86400000);
```

### 표시 규칙
- 미래: `D-n`
- 당일: `D-day`
- 과거: `D+n`

이 규칙은 `diff` 부호(양수/0/음수)로 결정됩니다.

## 핵심 코드: 업무일(주말 제외) 계산 알고리즘

업무일은 단순 루프 대신, **전체 일수 = (완전한 주 수) + (나머지 일 수)**로 분해해서 계산합니다.

```js
const countBusinessDaysInclusive = (a, b) => {
  const startDate = a <= b ? a : b;
  const endDate = a <= b ? b : a;
  const totalDays = dayDiff(startDate, endDate) + 1;
  const fullWeeks = Math.floor(totalDays / 7);
  const remainder = totalDays % 7;

  let count = fullWeeks * 5;
  const startDay = startDate.getDay();
  for (let i = 0; i < remainder; i++) {
    const day = (startDay + i) % 7;
    if (day !== 0 && day !== 6) count++;
  }
  return count;
};
```

이렇게 하면 기간이 길어져도 빠르게 계산됩니다.

## 예외 처리: 실제 사용 시 깨지기 쉬운 지점 방어

### 1) 입력 누락
시작일/목표일 중 하나라도 비어 있으면 결과를 `-`로 초기화하고 안내 문구를 출력합니다.

### 2) 역순 입력
시작일이 종료일보다 늦어도 내부에서 `startDate/endDate`를 정렬해 동일 로직으로 처리합니다.

### 3) 클립보드 권한 실패
`navigator.clipboard`가 실패하면 `textarea + execCommand('copy')` 폴백으로 복사를 유지합니다.

```js
const copyText = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
  } catch (_) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  }
};
```

## 내부 링크: 함께 쓰면 좋은 도구

- [디데이 계산기]({{ '/tools/d-day-calculator/' | relative_url }})
- [시간대 변환기]({{ '/tools/timezone-converter/' | relative_url }})
- [퍼센트 계산기]({{ '/tools/percent-calculator/' | relative_url }})

## 요약

디데이 계산기 구현의 핵심은 다음 4가지입니다.

- 문제: 달력일/업무일/포함 일수 요구를 동시에 충족해야 함
- 원리: 로컬 날짜 정규화 + 정수 일수 계산
- 핵심 코드: `fullWeeks + remainder` 기반 업무일 계산
- 안정성: 입력 누락, 역순 날짜, 복사 권한 실패 폴백 처리

덕분에 단순 카운트다운을 넘어, 실제 일정 관리에 바로 쓸 수 있는 D-day 계산기를 만들 수 있습니다.

## FAQ

### Q1. 같은 날짜를 선택하면 결과는 어떻게 나오나요?
달력일 차이는 0일, 포함 일수는 1일이며 라벨은 `D-day`로 표시됩니다.

### Q2. 주말 제외 옵션을 켜면 D-label도 업무일 기준으로 바뀌나요?
네. `업무일 차이`가 기준이 되어 `D-n / D+n`이 계산됩니다.

### Q3. 목표일이 지난 날짜여도 계산되나요?
오류 없이 계산되며 `D+` 형태로 경과일이 표시됩니다.
