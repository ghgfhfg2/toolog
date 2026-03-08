---
layout: post
title: "할인 계산기 코어 로직: 할인율·쿠폰·수량·배송비를 한 번에 계산하는 방법"
date: 2026-03-08 09:00:00 +0900
categories: [webtool, javascript, shopping]
tags: [할인 계산기, 쿠폰 계산, 최종 결제금액, 실질 할인율, 역산 할인율]
description: "할인 계산기의 핵심 계산 흐름을 코드 관점으로 정리했습니다. 할인율 적용, 쿠폰 차감, 수량/배송비 반영, 실질 할인율 계산, 목표가 역산까지 실사용 로직을 한 번에 설명합니다."
---

세일 계산에서 중요한 건 **표시 할인율**이 아니라 **최종 결제금액**입니다.
할인율이 같아도 쿠폰, 수량, 배송비에 따라 체감 가격은 크게 달라집니다.

- 도구 바로가기: [할인 계산기]({{ '/tools/discount-calculator/' | relative_url }})

## 핵심 로직 요약

1. 입력값 정규화(음수 방지, 수량 최소 1)
2. 할인율 적용으로 1차 할인 단가 계산
3. 쿠폰 차감 후 단가 하한(0원) 보정
4. 수량/배송비 반영해 최종 결제금액 계산
5. 실질 할인율 계산 + 목표가 역산 모드 분기

## 1) 입력값 정규화: 계산이 깨지지 않는 기반

복붙/자동완성으로 비정상 값이 들어와도 결과가 흔들리지 않게 먼저 보정합니다.

```js
const price = Math.max(0, n(listPrice));
const quantity = Math.max(1, Math.floor(n(qty, 1)));
const shipping = Math.max(0, n(shippingFee));
```

- 정가/배송비는 음수 불가
- 수량은 최소 1개 보장

## 2) 할인율 + 쿠폰: 순서가 결과를 바꾼다

할인율을 먼저 적용하고, 그다음 쿠폰을 차감합니다.

```js
const discounted = price * (1 - rate / 100);
const unitAfterCoupon = Math.max(0, discounted - coupon);
```

이 순서가 일반 쇼핑몰 결제 구조와 가장 유사합니다.

## 3) 최종 결제금액 계산

단가가 확정되면 수량과 배송비를 반영해 총액을 계산합니다.

```js
const totalBeforeShipping = unitAfterCoupon * quantity;
const finalTotal = Math.max(0, totalBeforeShipping + shipping);
```

쿠폰이 과도해도 `Math.max(0, ...)`로 음수 결제금액을 방지합니다.

## 4) 실질 할인율 계산

사용자 입장에서는 “원래 총액 대비 얼마나 절약했는지”가 핵심입니다.

```js
const listTotal = price * quantity + shipping;
const effectiveRate = listTotal > 0
  ? ((listTotal - finalTotal) / listTotal) * 100
  : 0;
```

즉, 실질 할인율은 **배송비 포함 총지출 기준**으로 계산해야 체감값과 맞아떨어집니다.

## 5) 목표가 역산 모드

판매/구매 목표가가 정해져 있다면 필요한 할인율을 역산합니다.

```js
const needRate = price === 0 ? 0 : ((price - targetPrice) / price) * 100;
```

- 목표가가 정가보다 높으면 0%로 처리
- 역산 모드는 빠른 의사결정(프로모션 기준선 설정)에 유용

## 내부 링크

- [할인 계산기]({{ '/tools/discount-calculator/' | relative_url }})
- [퍼센트 계산기]({{ '/tools/percent-calculator/' | relative_url }})
- [부가세 계산기]({{ '/tools/vat-calculator/' | relative_url }})
- [대출 계산기]({{ '/tools/loan-calculator/' | relative_url }})
- [쇼핑 계산기 카테고리]({{ '/categories/shopping/' | relative_url }})

## 요약

이번 할인 계산기 로직의 포인트는 명확합니다.

- **정규화**로 입력 예외를 먼저 제거
- **할인율 → 쿠폰 → 수량/배송비** 순서로 실무 결제 흐름을 반영
- **실질 할인율 + 목표가 역산**까지 지원해 계산기를 의사결정 도구로 확장

단순 퍼센트 계산기를 넘어, 결제 직전 판단에 바로 쓸 수 있는 구조가 핵심입니다.
