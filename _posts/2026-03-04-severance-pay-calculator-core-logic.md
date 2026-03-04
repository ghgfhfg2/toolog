---
title: "퇴직금 계산기 핵심 로직: 재직일수·평균임금·1년 요건 판별 구현"
date: 2026-03-04 09:00:00 +0900
categories: [webtool, javascript, finance]
tags: [퇴직금 계산기, 퇴직금 계산 로직, 평균임금 계산, 재직기간 계산, JavaScript 계산기]
description: "퇴직금 계산기의 핵심 로직을 문제 정의부터 계산 원리, 핵심 코드, 예외 처리, FAQ까지 정리합니다. 입사일·퇴사일 검증, 재직일수 산출, 1일 평균임금 환산, 1년 미만 안내 분기까지 코드 중심으로 설명합니다."
---

퇴직 준비에서 가장 헷갈리는 건 **내가 받을 금액의 기준**입니다.  
이 글은 퇴직금 계산기가 어떤 순서로 숫자를 만들고, 어디서 안전장치를 두는지 핵심만 정리합니다.

- 도구 바로가기: [퇴직금 계산기]({{ '/tools/severance-pay-calculator/' | relative_url }})

## 문제: 퇴직금 계산이 체감상 어려운 이유

### 1) 재직기간 계산을 사람이 수동으로 하다 보니
입사일/퇴사일 포함 여부, 월별 일수 차이 때문에 오차가 자주 납니다.

### 2) 평균임금 개념이 익숙하지 않아서
월급만 보고 바로 계산하면 기준이 달라집니다. 연 환산 후 1일 평균임금으로 바꾸는 단계가 필요합니다.

### 3) 지급 요건(1년 이상) 판단이 누락돼서
금액만 보여주면 오해가 생깁니다. 계산 결과와 별도로 요건 안내가 있어야 합니다.

## 원리: 날짜 검증 → 재직일수 산출 → 평균임금 환산

### H3. 1단계: 안전한 날짜 파싱
- `YYYY-MM-DD`를 숫자로 분해
- `new Date(y, m-1, d, 12:00)`로 생성
- 다시 연/월/일 일치 여부를 확인해 잘못된 날짜(예: 2월 30일) 차단

### H3. 2단계: 재직일수 계산
- `Date.UTC` 기준으로 시차 영향을 줄여 일 단위 차이 계산
- 입사일/퇴사일 모두 포함하기 위해 `+1` 적용

### H3. 3단계: 평균임금과 예상 퇴직금 계산
- 연 환산임금 = `(월급 × 12) + 연 상여금`
- 1일 평균임금 = `연 환산임금 / 365`
- 계속근로연수 = `재직일수 / 365`
- 예상 퇴직금 = `1일 평균임금 × 30 × 계속근로연수`

## 핵심 코드: 계산 흐름 한눈에 보기

```js
const s = toDate(start.value);
const e = toDate(end.value);
const m = Math.max(0, Number(monthly.value || 0));
const b = Math.max(0, Number(annualBonus.value || 0));

if (!s || !e) return setIdle('입사일과 퇴사일을 선택하세요.');
if (e < s) return setIdle('퇴사일은 입사일보다 빠를 수 없습니다.');
if (!(m > 0)) return setIdle('최근 월급(세전)을 입력하세요.');

const days = dayDiff(s, e) + 1;      // 포함 일수
const years = days / 365;
const annualizedWage = (m * 12) + b;
const avgDailyWage = annualizedWage / 365;
const severance = avgDailyWage * 30 * years;
const isEligible = days >= 365;

serviceDays.textContent = `${days.toLocaleString('ko-KR')}일`;
serviceYears.textContent = `${years.toLocaleString('ko-KR', { maximumFractionDigits: 2 })}년`;
dailyWage.textContent = fmtKRW(avgDailyWage);
amount.textContent = fmtKRW(severance);
help.textContent = isEligible
  ? '법정 평균임금의 간편 추정 방식(연 환산)으로 계산한 참고값입니다.'
  : '재직기간이 1년 미만으로 보입니다. 법적 지급 요건을 확인하세요.';
```

핵심은 **날짜 유효성 검증과 요건 안내를 계산식과 같은 우선순위로 다루는 구조**입니다.

## 예외 처리: 숫자보다 중요한 신뢰성 장치

### 1) 입력 하한 고정
월급/상여금은 `Math.max(0, ...)`로 음수 입력을 막습니다.

### 2) 날짜 역전 방지
퇴사일이 입사일보다 빠르면 즉시 계산을 중단하고 안내 문구를 노출합니다.

### 3) 미입력 상태 안내
날짜 또는 월급이 비어 있으면 결과값 대신 다음 행동(무엇을 입력해야 하는지)을 알려줍니다.

### 4) 복사 기능 폴백
`navigator.clipboard` 실패 시 `textarea + execCommand('copy')`로 대체해 환경 차이를 흡수합니다.

## 내부 링크: 함께 보면 좋은 계산기

- [퇴직금 계산기]({{ '/tools/severance-pay-calculator/' | relative_url }})
- [연봉 실수령액 계산기]({{ '/tools/salary-calculator/' | relative_url }})
- [대출 이자 계산기]({{ '/tools/loan-calculator/' | relative_url }})

## 요약

퇴직금 계산기 로직은 아래 5가지에 집중합니다.

- 날짜 유효성 검증으로 잘못된 입력 차단
- UTC 기반 재직일수 계산으로 일수 오차 최소화
- 연 환산임금 → 1일 평균임금 → 퇴직금 순으로 단계 분리
- 1년 이상 재직 여부를 별도 분기로 명확히 안내
- 복사/초기화/유휴 메시지로 실사용 UX 안정화

## FAQ

### Q1. 계산 결과가 실제 퇴직금과 왜 다를 수 있나요?
이 도구는 간편 추정용입니다. 실제 지급액은 최근 3개월 임금총액, 상여 반영 방식, 회사 규정, 중간정산 이력 등에 따라 달라질 수 있습니다.

### Q2. 1년 미만인데 금액이 계산되는 이유는 무엇인가요?
수치 추정 자체는 가능하기 때문입니다. 다만 법적 지급 요건 판단은 별개라서, 계산기에서 별도 경고 문구를 함께 제공합니다.

### Q3. 상여금 입력은 왜 연 단위인가요?
이 로직이 연 환산임금(월급×12+연 상여금)을 기준으로 1일 평균임금을 계산하기 때문입니다.
