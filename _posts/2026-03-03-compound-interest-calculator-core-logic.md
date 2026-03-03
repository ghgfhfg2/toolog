---
title: "복리 계산기 핵심 로직: 적립식 투자·복리 주기·실질가치 계산 구현"
date: 2026-03-03 17:00:00 +0900
categories: [webtool, javascript, finance]
tags: [복리 계산기, 적립식 투자 계산, 복리 주기 계산, 실질가치 계산, JavaScript 금융 계산기]
description: "복리 계산기의 핵심 로직을 문제 정의, 계산 원리, 핵심 코드, 예외 처리, FAQ까지 한 번에 정리합니다. 초기 투자금·매월 적립금·복리 주기·인플레이션 반영 방식을 코드 기준으로 설명합니다."
---

복리 계산기는 단순히 `원금 × (1+r)^n`으로 끝나지 않습니다.  
실무/실사용 관점에서는 **초기 투자금 + 매월 적립금 + 복리 주기 + 인플레이션(실질가치)**를 함께 다뤄야 의미 있는 결과가 나옵니다.

- 도구 바로가기: [복리 계산기]({{ '/tools/compound-interest-calculator/' | relative_url }})

## 문제: 왜 복리 계산이 자주 엇나갈까?

### 1) 적립식 투자 흐름을 누락한 계산
일시금 공식만 쓰면 매월 추가 적립금의 누적 효과가 빠져 실제와 차이가 커집니다.

### 2) 복리 주기(월/분기/반기/연) 반영 누락
연 수익률이 같아도 복리 주기에 따라 결과가 달라집니다. 이를 코드에서 주기별 이자 반영으로 분리해야 합니다.

### 3) 입력값 검증 부족
투자 기간 0년, 수익률 음수/비정상값, 비어 있는 입력값 등은 결과 왜곡의 원인이 됩니다.

### 4) 명목가치만 보여주는 한계
숫자상 만기 자산만 보면 과대평가하기 쉽습니다. 인플레이션을 반영한 실질가치가 함께 필요합니다.

## 원리: 월 단위 시뮬레이션 + 주기별 이자 반영

### H3. 입력값 정규화
- 금액 입력: `Math.max(0, Number(...))`
- 기간: 정수 년(`Math.floor`)
- 수익률 범위: `0~100%`
- 복리 횟수: 최소 1회/년

### H3. 월 루프에서 적립/이자 순서를 명시
이 구현은 **월말 적립** 가정을 둡니다.

1. 월이 복리 반영 시점이면 잔액에 이자 적용
2. 그다음 해당 월 적립금 추가
3. 이를 `총 개월 수 = 연수 × 12` 동안 반복

### H3. 실질가치 계산
인플레이션이 있다면 다음으로 현재가치를 할인합니다.

`실질가치 = 만기자산 / (1 + 인플레이션)^투자연수`

## 핵심 코드: 계산 루프와 출력 포맷

```js
const p0 = Math.max(0, Number(initial.value || 0));
const mAdd = Math.max(0, Number(monthly.value || 0));
const rAnnual = Number(rate.value || 0);
const y = Math.floor(Number(years.value || 0));
const n = Math.max(1, Number(compound.value || 12));
const inf = Math.max(0, Number(inflation.value || 0));

if (!(y > 0) || !Number.isFinite(rAnnual) || rAnnual < 0 || rAnnual > 100) {
  setIdle('투자 기간(1년 이상)과 연 수익률(0~100%)을 입력하세요.');
  return;
}

let balance = p0;
const periodicRate = rAnnual / 100 / n;
const totalMonths = y * 12;
const monthsPerPeriod = 12 / n;

for (let month = 1; month <= totalMonths; month++) {
  if (month % monthsPerPeriod === 0) {
    balance *= (1 + periodicRate);
  }
  balance += mAdd;
}

const totalContrib = p0 + (mAdd * totalMonths);
const earned = balance - totalContrib;
const realValue = balance / Math.pow(1 + inf / 100, y);
```

핵심 포인트는 **수학 공식 1회 계산이 아니라, 월별 상태 변화 시뮬레이션**으로 구현해 사용자 기대와 일치시키는 것입니다.

## 예외 처리: 결과 신뢰도를 올리는 방어 로직

### 1) 기간/수익률 유효성 검사
기간 1년 미만, 수익률 범위 벗어남은 계산 중단 + 안내문 표시.

### 2) 음수 입력 방지
초기금·월적립금·인플레이션은 0 미만이면 0으로 보정.

### 3) 복사 기능 폴백
`navigator.clipboard` 실패 시 `textarea + execCommand('copy')`로 대응.

### 4) 초기값 보장
입력이 비어 있을 때 예시값을 자동 채워 첫 화면에서 즉시 결과를 확인 가능.

## 내부 링크: 함께 보면 좋은 계산 도구

- [복리 계산기]({{ '/tools/compound-interest-calculator/' | relative_url }})
- [대출 계산기]({{ '/tools/loan-calculator/' | relative_url }})
- [퍼센트 계산기]({{ '/tools/percent-calculator/' | relative_url }})

## 요약

복리 계산기 로직의 핵심은 아래 5가지입니다.

- 적립식 투자 흐름(초기금 + 월적립금)을 월 단위로 시뮬레이션
- 복리 주기를 분리해 이자 반영 시점을 정확히 제어
- 입력값 유효성 검증으로 비정상 결과 차단
- 명목 수익뿐 아니라 인플레이션 반영 실질가치 제공
- 복사/초기화/기본값 등 UX 예외 처리로 실사용 안정성 강화

## FAQ

### Q1. 이 계산기는 월초 적립인가요, 월말 적립인가요?
현재 구현은 **월말 적립** 기준입니다. 월 단위 루프에서 이자 반영 후 적립금을 더합니다.

### Q2. 복리 주기를 바꾸면 왜 결과가 달라지나요?
연 수익률이 같아도 이자를 적용하는 빈도(월/분기/반기/연)에 따라 누적 효과가 달라집니다.

### Q3. 실질가치는 어떤 의미인가요?
인플레이션을 반영해 만기 금액을 현재 구매력 기준으로 환산한 값입니다.

### Q4. 실제 투자 수익과 다를 수 있나요?
네. 세금, 수수료, 변동 수익률, 매수 시점 분산 등 현실 변수는 별도입니다.
