---
layout: post
title: "팁 계산기 코어 로직: 퍼센트/고정 팁·팁 기준금액·1인당 정산"
date: 2026-03-08 01:00:00 +0900
categories: [webtool, javascript, finance]
tags: [팁 계산기, 더치페이 계산, JavaScript, 입력값 검증, 정산]
description: "팁 계산기의 핵심 로직을 정리합니다. 소계/총액 기준 팁 베이스 전환, 퍼센트·고정 팁 모드 분기, 인원수 나눔 계산, 입력값 clamp 방어, 정산용 복사 텍스트까지 코드 관점으로 설명합니다."
---

팁 계산은 단순히 `금액 × 10%`로 끝나지 않습니다.
실제 사용에서는 **세금/봉사료 포함 여부**, **퍼센트 vs 고정 팁**, **1인당 정산**이 함께 필요합니다.
이번 팁 계산기는 이 세 가지를 한 화면에서 빠르게 처리하도록 설계했습니다.

- 도구 바로가기: [팁 계산기]({{ '/tools/tip-calculator/' | relative_url }})

## 핵심 로직 요약

1. **기본 청구금액 계산**: `소계 + 세금 + 봉사료`
2. **팁 기준금액 분기**: 소계 기준 / 총액 기준 선택
3. **팁 모드 분기**: 퍼센트 팁 / 고정 팁
4. **최종 합계와 1인당 금액 계산**
5. **입력값 방어 + 복사용 정산 문구 생성**

## 1) 기본 청구금액부터 고정

팁 계산 전에 청구금액의 기준선을 먼저 만듭니다.

```js
const billTotal = subtotal + tax + service;
```

이 값을 먼저 확정해두면, 이후 팁 기준을 바꾸더라도 전체 계산 흐름이 흔들리지 않습니다.

## 2) 팁 기준금액(tip base)을 분리

사용자마다 팁 기준이 다르기 때문에, 소계/총액 기준을 토글로 분기합니다.

```js
const tipBase = tipBaseMode === 'total' ? billTotal : subtotal;
```

- `subtotal`: 음식값(소계) 기준으로 팁 계산
- `total`: 세금/봉사료 포함 총액 기준으로 팁 계산

이 분리를 해두면 “왜 팁 금액이 이렇게 나왔는지”를 설명하기 쉬워집니다.

## 3) 퍼센트 모드 vs 고정 금액 모드

팁 입력은 모드별 계산식이 달라집니다.

```js
const tipAmount = tipMode === 'fixed'
  ? fixedTip
  : tipBase * (tipRate / 100);
```

- **퍼센트 모드**: 기준금액 × 비율
- **고정 모드**: 사용자가 입력한 절대 금액

UI도 모드에 맞춰 동기화해서, 퍼센트 모드일 때 고정 팁 입력칸을 숨겨 입력 실수를 줄였습니다.

## 4) 최종 합계와 1인당 정산

팁이 확정되면 전체 결제금액과 더치페이 금액을 계산합니다.

```js
const finalTotal = billTotal + tipAmount;
const perPerson = finalTotal / people;
```

여기서 핵심은 `people`을 항상 1 이상으로 유지하는 것입니다. 0명이 들어오면 NaN/Infinity가 생기므로 방어 로직이 필수입니다.

## 5) 입력값 방어(clamp)와 표시 안정성

복붙, 자동완성, 스크립트 입력 등으로 비정상 값이 들어와도 결과가 깨지지 않도록 제한합니다.

```js
const subtotal = clamp(subtotalRaw, 0, 1000000000);
const tax = clamp(taxRaw, 0, 1000000000);
const service = clamp(serviceRaw, 0, 1000000000);
const tipRate = clamp(tipRateRaw, 0, 100);
const fixedTip = clamp(fixedTipRaw, 0, 1000000000);
const people = clamp(Math.floor(peopleRaw), 1, 1000);
```

추가로, 금액 입력이 전부 0일 때는 결과 대신 안내 상태를 노출해 “오작동처럼 보이는 빈 결과”를 줄였습니다.

## 6) 정산용 복사 텍스트 생성

실사용 단계에서 중요한 건 계산보다 공유입니다.
그래서 최종값(총액·팁·1인당)을 바로 복사해 메신저에 붙일 수 있게 구성했습니다.

- 예: `총 58,000원 (팁 8,000원 포함) / 4명 = 1인당 14,500원`

이 한 줄이 있으면 자리에서 다시 계산할 필요가 거의 없어집니다.

## 내부 링크

- [팁 계산기]({{ '/tools/tip-calculator/' | relative_url }})
- [퍼센트 계산기]({{ '/tools/percent-calculator/' | relative_url }})
- [할인율 계산기]({{ '/tools/discount-calculator/' | relative_url }})
- [금융 계산기 모음]({{ '/categories/finance/' | relative_url }})

## 요약

이번 팁 계산기 로직의 핵심은 아래 3가지입니다.

- **팁 기준금액을 소계/총액으로 분리해 사용 맥락을 반영**
- **퍼센트/고정 팁 모드를 명확히 분기해 입력 혼선을 제거**
- **1인당 정산과 복사 문구까지 연결해 실전 사용성을 강화**

결국 좋은 계산기는 “정확한 수식”만이 아니라, **사람들이 결제 순간에 바로 쓸 수 있는 흐름**을 만드는 것이 포인트입니다.
