---
title: "대출 이자 계산기 핵심 로직: 원리금균등·원금균등 계산과 비교 구현"
date: 2026-03-02 09:00:00 +0900
categories: [webtool, javascript, finance]
tags: [대출이자계산기, 원리금균등, 원금균등, 월상환금, 금융계산기]
description: "대출 이자 계산기의 핵심 로직을 문제 정의부터 상환방식별 계산 원리, 핵심 코드, 예외 처리, 비교 표시 로직까지 코드 중심으로 정리합니다."
---

대출 계산에서 실제로 궁금한 건 단순 금리값이 아니라, **매달 얼마를 내는지**와 **결국 총 이자를 얼마나 내는지**입니다.  
이번 글은 직전 추가한 **대출 이자 계산기** 웹툴의 구현 로직을 문제→원리→코드→예외 처리 순서로 정리한 개발 노트입니다.

- 바로 사용: [대출 이자 계산기]({{ '/tools/loan-calculator/' | relative_url }})

## 문제: 대출 계산에서 사용자가 바로 알고 싶은 값

### 1) 상환방식별 체감이 다름
같은 원금·같은 금리라도 원리금균등/원금균등에 따라 첫 달 납입액과 총 이자가 달라집니다.

### 2) 비교가 한 화면에서 필요함
한 방식만 보여주면 다시 계산해야 해서 의사결정이 느려집니다.

### 3) 0%·잘못된 입력도 안전하게 처리해야 함
실사용에서는 0% 테스트, 빈 값, 음수 입력 같은 경계 케이스가 자주 발생합니다.

## 원리: 월 이자율로 정규화한 뒤 상환방식별 총액 계산

핵심 변수는 아래 3개입니다.

- `principal`: 대출 원금
- `n`: 전체 상환 횟수(개월)
- `r`: 월 이자율(`연이율 / 100 / 12`)

그리고 상환방식별 계산 함수를 분기합니다.

### 원리금균등 (equal-payment)
- `r = 0`이면 단순히 `principal / n`
- `r > 0`이면 원리금균등 공식 사용

### 원금균등 (equal-principal)
- 매월 원금을 동일 분할
- 잔액에 대한 이자를 더해 월 납입액을 산출
- 시간이 갈수록 이자 감소 → 월 납입액 감소

## 핵심 코드: 상환 플랜 계산 함수

```js
const calcPlan = ({ principal, n, r, mode }) => {
  let firstMonthly = 0;
  let total = 0;

  if (mode === 'equal-principal') {
    const principalPerMonth = principal / n;
    let remaining = principal;
    for (let i = 0; i < n; i++) {
      const interest = remaining * r;
      const pay = principalPerMonth + interest;
      if (i === 0) firstMonthly = pay;
      total += pay;
      remaining -= principalPerMonth;
    }
  } else {
    if (r === 0) {
      firstMonthly = principal / n;
    } else {
      firstMonthly = principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    }
    total = firstMonthly * n;
  }

  return {
    firstMonthly,
    total,
    interest: Math.max(0, total - principal)
  };
};
```

이 함수 하나로 두 상환방식을 동일 인터페이스로 계산하고, 화면에는 선택 방식 결과 + 비교 정보를 동시에 표시합니다.

## 예외 처리: 계산기 신뢰도를 좌우하는 방어 로직

### 1) 입력 검증 실패 시 안전 초기화
원금/기간이 0 이하이거나 금리가 음수면 결과를 `-`로 초기화하고 안내 문구를 노출합니다.

```js
if (!(principal > 0) || !(yearTerm > 0) || n <= 0 || annualRate < 0) {
  setInvalid();
  return;
}
```

### 2) 0% 금리 분기
원리금균등 공식은 `r=0`에서 분모가 0이 되므로 반드시 별도 분기로 처리합니다.

### 3) 복사 기능 폴백
결과 복사 버튼은 공통 `copyText()` 유틸을 사용해 클립보드 권한 실패 시에도 복사가 되도록 폴백을 유지합니다.

## 내부 링크: 계산 결과 해석에 같이 쓰기 좋은 도구

- [대출 이자 계산기]({{ '/tools/loan-calculator/' | relative_url }})
- [퍼센트 계산기]({{ '/tools/percent-calculator/' | relative_url }})
- [부가세 계산기]({{ '/tools/vat-calculator/' | relative_url }})

## 요약

대출 이자 계산기 구현의 핵심은 아래 4가지입니다.

- 문제: 상환방식별 체감 차이를 한 번에 보여줘야 함
- 원리: `principal`, `n`, `r`로 정규화해 방식별 계산
- 핵심 코드: `calcPlan()` 단일 함수로 원리금균등/원금균등 통합 처리
- 예외 처리: 입력 검증, 0% 분기, 복사 폴백으로 안정성 확보

이 구조 덕분에 사용자는 입력 즉시 **월 납입액(첫 달), 총 이자, 총 상환액, 방식 간 차이**를 동시에 확인할 수 있습니다.

## FAQ

### Q1. 원리금균등과 원금균등 중 어떤 방식이 총 이자가 적나요?
일반적으로 원금균등이 총 이자가 더 적은 편입니다. 다만 초기 월 납입액은 더 크게 시작합니다.

### Q2. 왜 월 납입액은 첫 달 기준으로 표시하나요?
원금균등은 월 납입액이 매달 감소하기 때문에 비교 기준을 맞추기 위해 첫 달 값을 대표값으로 사용합니다.

### Q3. 실제 금융사 상환표와 값이 다를 수 있나요?
가능합니다. 실제 상품은 우대금리, 수수료, 납입일 기준, 중도상환 조건 등이 반영됩니다.
