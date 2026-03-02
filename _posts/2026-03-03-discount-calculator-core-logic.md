---
title: "할인 계산기 핵심 로직: 할인율·쿠폰·수량·배송비·목표가 역산 구현"
date: 2026-03-03 01:00:00 +0900
categories: [webtool, javascript, finance]
tags: [할인 계산기, 할인율 계산, 쿠폰 계산기, 최종 결제금액, 목표가 역산]
description: "할인 계산기 핵심 로직을 문제 정의부터 계산 원리, 모드 분기, 핵심 코드, 예외 처리, SEO FAQ까지 코드 중심으로 정리합니다."
---

쇼핑/견적 상황에서 중요한 건 단순 할인율이 아니라 **실제 결제금액**입니다.  
이번 글은 직전 추가한 **할인 계산기** 웹툴의 구현을 문제→원리→핵심 코드→예외 처리 순서로 정리한 개발 노트입니다.

- 바로 사용: [할인 계산기]({{ '/tools/discount-calculator/' | relative_url }})

## 문제: 왜 단순 퍼센트 계산으로는 부족한가

### 1) 할인율만으로는 체감 금액이 안 보임
실사용에서는 `정가 × (1-할인율)`만으로 끝나지 않고, 쿠폰·수량·배송비가 함께 반영됩니다.

### 2) 계산 목적이 두 가지로 갈림
- 일반 모드: 최종 결제금액을 알고 싶음
- 역산 모드: 목표 판매가를 맞추기 위한 할인율이 필요함

### 3) 경계값 오류가 자주 발생
0원 정가, 100% 초과 할인율, 목표가 > 정가 같은 입력은 별도 방어가 없으면 잘못된 결과를 만들기 쉽습니다.

## 원리: 입력 정규화 + 모드별 수식 분기

### H3. 공통 정규화
- `price = max(0, 정가)`
- `q = max(1, floor(수량))`
- `ship = max(0, 배송비)`

즉, 수량은 최소 1개로 보정하고 음수 금액은 0으로 클램프합니다.

### H3. 일반 할인 모드(forward)
1. `discounted = price * (1 - rate/100)`
2. `unit = max(0, discounted - coupon)`
3. `total = max(0, unit * q + ship)`
4. 실질 할인율:  
   `effRate = ((price*q + ship) - total) / (price*q + ship) * 100`

### H3. 목표가 역산 모드(reverse)
- 필요 할인율: `needRate = (price - target) / price * 100`
- 단, `target > price`면 할인율 0% 처리

## 핵심 코드: 렌더 함수에서 forward/reverse 통합 처리

```js
const render = () => {
  setModeUI();
  const price = Math.max(0, n(listPrice));
  const q = Math.max(1, Math.floor(n(quantity, 1)));
  const ship = Math.max(0, n(shipping));

  if (price <= 0) {
    setOutput({ message: '정가를 0원보다 크게 입력하세요.' });
    return;
  }

  if ((mode.value || 'forward') === 'forward') {
    const rate = n(discountRate);
    if (rate < 0 || rate > 100) {
      setOutput({ message: '할인율은 0%~100% 범위에서 입력하세요.' });
      return;
    }

    const couponAmount = Math.max(0, n(coupon));
    const discounted = price * (1 - rate / 100);
    const unit = Math.max(0, discounted - couponAmount);
    const totalBeforeShipping = unit * q;
    const total = Math.max(0, totalBeforeShipping + ship);

    const totalList = price * q + ship;
    const effRate = totalList > 0 ? ((totalList - total) / totalList) * 100 : 0;

    discountAmount.textContent = fmtKRW(price - discounted);
    unitPrice.textContent = fmtKRW(unit);
    finalTotal.textContent = fmtKRW(total);
    effectiveRate.textContent = fmtPct(Math.max(0, effRate));
  } else {
    const target = Math.max(0, n(targetPrice));
    if (target > price) {
      effectiveRate.textContent = fmtPct(0);
      return;
    }

    const needRate = price === 0 ? 0 : ((price - target) / price) * 100;
    effectiveRate.textContent = fmtPct(Math.max(0, needRate));
  }
};
```

핵심 포인트는 **두 모드를 하나의 렌더 루프에서 관리**한다는 점입니다. 입력 이벤트를 공통으로 바인딩해 UX와 유지보수 모두 단순화했습니다.

## 예외 처리: 결과 신뢰도를 만드는 방어 로직

### 1) 정가 0원 차단
정가가 0 이하이면 계산 대신 안내 문구를 노출합니다.

### 2) 할인율 범위 제한
할인율은 `0~100%`를 벗어나면 계산 중단 + 메시지 처리합니다.

### 3) 단가/총액 음수 방지
쿠폰이 과도해도 `unit`, `total`을 `max(0, ...)`로 보정해 음수 결제값을 방지합니다.

### 4) 목표가가 정가보다 큰 경우
역산 모드에서 `target > price`면 할인 필요가 없으므로 0%로 처리해 의미를 명확히 전달합니다.

### 5) 클립보드 폴백
`navigator.clipboard` 실패 시 `textarea + execCommand('copy')`로 복사 기능을 유지합니다.

## 내부 링크: 같이 보면 전환율 분석에 유용한 도구

- [할인 계산기]({{ '/tools/discount-calculator/' | relative_url }})
- [퍼센트 계산기]({{ '/tools/percent-calculator/' | relative_url }})
- [부가세 계산기]({{ '/tools/vat-calculator/' | relative_url }})

## 요약

할인 계산기 구현의 핵심은 아래 5가지입니다.

- 문제: 할인율 단독 계산으론 실결제 금액 판단이 어려움
- 원리: 정규화(`price/q/ship`) 후 모드별 수식 분기
- 핵심 코드: 단일 `render()`로 forward/reverse 통합
- 예외 처리: 입력 범위 검증 + 음수 방지 + 역산 경계 처리
- UX 안정성: 복사 폴백/모드 UI 토글로 실사용 완성도 확보

## FAQ

### Q1. 할인율과 쿠폰은 어떤 순서로 계산되나요?
정가에 할인율을 먼저 적용하고, 그 다음 쿠폰 금액을 차감합니다.

### Q2. 쿠폰 때문에 결제금액이 음수가 되면 어떻게 되나요?
음수로 내려가지 않도록 최소 0원으로 자동 보정됩니다.

### Q3. 목표가 역산은 수량/배송비도 반영하나요?
역산 모드는 1개 기준 목표 판매가에 필요한 할인율 계산에 집중합니다.

### Q4. 실질 할인율은 왜 배송비를 포함해 계산하나요?
사용자가 실제로 지불하는 총액 기준으로 체감 할인율을 보여주기 위해서입니다.
