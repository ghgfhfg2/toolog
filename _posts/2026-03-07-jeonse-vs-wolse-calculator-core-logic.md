---
layout: post
title: "전세 vs 월세 계산기 코어 로직: 보증금 기회비용·월 환산·손익분기 월세"
date: 2026-03-07 01:00:00 +0900
categories: [webtool, javascript, real-estate]
tags: [전세 월세 계산기, 전세 월세 비교, 기회비용 계산, 손익분기 월세, JavaScript]
description: "전세·월세 비교 계산기의 핵심 로직을 정리합니다. 보증금 기회비용 반영, 월 환산 비용 비교, 손익분기 월세 공식, 입력값 clamp 방어까지 코드 관점으로 설명합니다."
---

전세/월세를 비교할 때 가장 많이 놓치는 포인트는 **보증금도 비용**이라는 점입니다.  
월세는 매달 현금이 빠져나가 체감이 쉬운데, 전세 보증금은 눈에 보이는 월지출이 없다 보니 비용 인식이 약해지기 쉽습니다.

이번 계산기는 두 선택지를 같은 기준으로 맞추기 위해 아래 흐름으로 설계했습니다.

- 도구 바로가기: [전세 vs 월세 계산기]({{ '/tools/jeonse-vs-wolse-calculator/' | relative_url }})

## 핵심 로직 요약

1. **보증금 기회비용 계산**: 전세/월세 모두 보증금에 대한 기대수익 손실 반영
2. **총 주거비 계산**: 월세는 실지출(월세 × 거주개월)까지 합산
3. **월 환산 비교**: 거주기간이 달라도 월 기준으로 유불리 비교 가능
4. **손익분기 월세 계산**: 두 옵션이 같아지는 기준 월세 제공
5. **입력값 방어(clamp)**: UI 범위를 벗어난 값 자동 보정

## 1) 보증금 기회비용을 양쪽 모두에 반영

기회비용은 "해당 돈을 다른 곳에 운용했다면 얻었을 수익"입니다.  
연수익률을 `r`, 거주개월을 `m`이라 두면,

- 전세 기회비용: `전세보증금 × r × (m / 12)`
- 월세 보증금 기회비용: `월세보증금 × r × (m / 12)`

```js
const yearlyRate = annualReturnRate / 100;
const years = stayMonths / 12;

const jeonseOppCost = jeonseDeposit * yearlyRate * years;
const wolseDepositOppCost = wolseDeposit * yearlyRate * years;
```

## 2) 월세 총비용은 "보증금 기회비용 + 실제 월세"

월세는 보증금 기회비용만으로 끝나지 않고, 거주기간 동안 납부한 월세 누적이 들어갑니다.

```js
const totalJeonseCost = jeonseOppCost;
const totalWolseCost = wolseDepositOppCost + monthlyRent * stayMonths;
```

이렇게 하면 전세/월세 모두 **총 주거비 기준**으로 비교할 수 있습니다.

## 3) 월 환산 비용 차이로 유리한 선택지 표시

총비용만 보면 거주기간이 길수록 숫자가 커져 직관이 떨어집니다.  
그래서 `총비용 / 거주개월`로 월 환산값을 만든 뒤 차이를 보여줍니다.

```js
const monthlyJeonseCost = totalJeonseCost / stayMonths;
const monthlyWolseCost = totalWolseCost / stayMonths;
const monthlyDiff = monthlyWolseCost - monthlyJeonseCost;
```

- `monthlyDiff > 0`이면 전세가 더 유리
- `monthlyDiff < 0`이면 월세가 더 유리

## 4) 손익분기 월세 공식

손익분기 월세는 "전세 총비용 = 월세 총비용"이 되는 월세입니다.

`손익분기 월세 = (전세보증금 - 월세보증금) × (연수익률 / 12)`

```js
const breakEvenMonthlyRent =
  (jeonseDeposit - wolseDeposit) * (yearlyRate / 12);
```

실제 월세가 이 값보다 낮으면 월세 쪽이 유리해지고, 높으면 전세 쪽이 유리해집니다.

## 5) 예외 입력 방어: clamp로 계산 일관성 유지

30분 개선 단계에서, 붙여넣기나 스크립트 입력으로 UI 제한을 벗어나는 값을 자동 보정하도록 방어를 추가했습니다.

- 연수익률: `0~30%`
- 거주기간: `1~120개월`
- 거주기간 미입력 시 계산 대신 안내 문구 유지

```js
const safeRate = clamp(inputRate, 0, 30);
const safeMonths = clamp(inputMonths, 1, 120);
```

덕분에 비정상 입력에서도 결과가 흔들리지 않고, 사용자는 항상 같은 규칙으로 비교값을 받습니다.

## 내부 링크

- [전세 vs 월세 계산기]({{ '/tools/jeonse-vs-wolse-calculator/' | relative_url }})
- [대출 이자 계산기]({{ '/tools/loan-calculator/' | relative_url }})
- [복리 계산기]({{ '/tools/compound-interest-calculator/' | relative_url }})

## 요약

이번 코어 로직의 핵심은 아래 3가지입니다.

- **보증금 기회비용을 전세/월세 모두에 반영**
- **총비용 + 월 환산 비용을 함께 제공**
- **손익분기 월세와 입력값 방어로 의사결정 신뢰도 강화**

전세/월세 판단을 감으로 하지 않고, 숫자 기준으로 빠르게 비교하려는 사용자에게 맞춘 구조입니다.
