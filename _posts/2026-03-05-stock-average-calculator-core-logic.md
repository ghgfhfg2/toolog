---
title: "물타기 계산기 핵심 로직: 주식 평단가 계산과 목표 평단 필요수량 역산"
date: 2026-03-05 01:00:00 +0900
categories: [webtool, javascript, finance]
tags: [물타기 계산기, 주식 평단가 계산기, 목표 평단, 추가매수 계산, JavaScript]
description: "물타기 계산기의 핵심 로직을 정리합니다. 새 평단가 계산식, 목표 평단 필요수량 역산 공식, 달성 불가 조건, 입력 검증과 복사/초기화 UX까지 코드 중심으로 설명합니다."
---

추가 매수를 할 때 가장 흔한 실수는 **감으로 수량을 정하는 것**입니다.  
물타기 계산기는 현재 보유 상태와 추가 매수 계획을 합쳐서 새 평단가를 즉시 보여주고, 목표 평단까지 필요한 수량을 역산합니다.

- 도구 바로가기: [물타기 계산기]({{ '/tools/stock-average-calculator/' | relative_url }})

## 문제: 왜 물타기 계산이 생각보다 자주 틀릴까?

### 1) 평단 계산은 금액 가중 평균인데, 단순 평균으로 착각한다
가격 두 개를 평균내는 게 아니라, **수량이 반영된 총매수금액 기준**으로 계산해야 정확합니다.

### 2) 목표 평단 역산에서 기준 상태를 빼먹는다
현재 보유만 기준으로 역산하면 오차가 큽니다.  
이미 입력한 추가 매수 계획이 있다면, 그 계획까지 반영한 상태에서 남은 수량을 계산해야 합니다.

### 3) 달성 불가 구간을 미리 걸러내지 않으면 오해가 생긴다
추가 매수가가 목표 평단 이상이면, 같은 가격으로 아무리 더 사도 목표 평단을 만들 수 없습니다.

## 원리: 가중 평균 + 부등식 정리 + 예외 분기

### 1단계: 새 평단가(가중 평균)

- 기존 총매수금액: `currentQty * currentPrice`
- 추가 매수금액: `addQty * addPrice`
- 총 보유수량: `currentQty + addQty`
- 새 평단가: `(기존 총매수금액 + 추가 매수금액) / 총 보유수량`

### 2단계: 목표 평단 필요수량 역산

추가 매수 계획까지 반영된 현재 상태를 `(totalCost, totalQty)`라고 두고,  
같은 매수가 `addPrice(ap)`로 `x`주를 더 산 뒤 목표 평단 `tp`를 맞추려면:

`(totalCost + ap*x) / (totalQty + x) <= tp`

이를 정리하면:

`x >= (totalCost - tp*totalQty) / (tp - ap)`

최소 정수 수량이 필요하므로 `ceil`을 적용합니다.

### 3단계: 달성 가능성 판단

- `tp - ap <= 0`이면 분모가 0 이하 → **달성 불가**
- 이미 `totalCost <= tp*totalQty`면 현재 상태에서 이미 목표 충족 → **0주**

## 핵심 코드

```js
const baseCost = cq * cp;
const addCost = aq * ap;
const totalQty = cq + aq;
const totalCost = baseCost + addCost;
const avg = totalQty > 0 ? totalCost / totalQty : 0;

const denominator = tp - ap;
const numerator = totalCost - (tp * totalQty);

if (numerator <= 0) {
  needQtyOut.textContent = '0주';
} else if (denominator <= 0) {
  needQtyOut.textContent = '달성 불가';
} else {
  const need = Math.ceil(numerator / denominator);
  needQtyOut.textContent = `${need.toLocaleString('ko-KR')}주`;
}
```

핵심은 **필요수량 역산의 기준을 현재+계획 상태로 잡는 것**입니다.

## 예외 처리 포인트

- 현재 보유 수량/평단가 미입력: 계산 중단 + 안내 메시지
- 목표 평단 미입력: 새 평단/총수량/총매수금액만 표시
- 목표 이미 달성: 필요수량 `0주`
- 목표 달성 불가: `달성 불가`와 사유 안내
- 복사 API 실패: `textarea + execCommand('copy')` 폴백

## 내부 링크

- [물타기 계산기]({{ '/tools/stock-average-calculator/' | relative_url }})
- [퍼센트 계산기]({{ '/tools/percent-calculator/' | relative_url }})
- [복리 계산기]({{ '/tools/compound-interest-calculator/' | relative_url }})

## 요약

물타기 계산기 로직의 핵심은 4가지입니다.

- 평단 계산은 수량 가중 평균으로 처리
- 목표 평단 필요수량은 부등식으로 역산
- `목표 평단 <= 추가 매수가` 구간은 즉시 달성 불가 처리
- 입력 검증/복사/초기화로 실사용 UX 안정화

## FAQ

### Q1. 물타기 후 평단가는 어떤 공식인가요?
`(기존 총매수금액 + 추가 매수금액) ÷ (기존 수량 + 추가 수량)`입니다.

### Q2. 목표 평단 계산에 왜 ceil(올림)을 쓰나요?
주식 수량은 정수이므로, 조건을 만족하는 최소 정수 주수를 구하려면 올림이 필요합니다.

### Q3. 목표 평단이 추가 매수가보다 낮으면 정말 불가능한가요?
같은 매수가로만 추가 매수한다면 불가능합니다. 더 낮은 가격 체결이나 다른 포지션 조정이 필요합니다.
