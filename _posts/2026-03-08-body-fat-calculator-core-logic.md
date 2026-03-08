---
layout: post
title: "체지방률 계산기 코어 로직: US Navy 공식·입력 검증·성별 분기 구현"
date: 2026-03-08 17:00:00 +0900
categories: [webtool, javascript, health]
tags: [체지방률 계산기, body fat calculator, us navy 공식, 체지방량 계산, 입력 검증]
description: "체지방률 계산기의 핵심 로직을 코드 관점으로 정리했습니다. US Navy 공식(남/여 분기), 범위 검증, 분류 기준, 체지방량·제지방량 계산, 복사/리셋 UX까지 한 번에 설명합니다."
---

체중만 보면 몸의 변화를 오해하기 쉽습니다.
같은 70kg이어도 **지방량과 제지방량 비율**이 다르면 컨디션과 체형은 완전히 달라지기 때문입니다.

- 도구 바로가기: [체지방률 계산기]({{ '/tools/body-fat-calculator/' | relative_url }})

## 핵심 로직 요약

1. 입력값 존재 여부 + 범위(키/목/허리/힙/체중) 검증
2. 남/여 모드에 따라 US Navy 공식 분기
3. 로그 계산의 정의역(허리>목 등) 선검증
4. 체지방률(%) 산출 후 비정상 값 필터링
5. 체지방량·제지방량 계산 + 범주 라벨링
6. 성별 전환 UX(남성 모드 힙 비활성화) + 복사/리셋

## 1) 입력값 정규화: 숫자보다 먼저 "유효한 치수" 확인

체지방률은 로그(log10) 기반 공식이라 입력값이 조금만 틀려도 계산이 깨집니다.
그래서 계산 전에 먼저 범위를 확인합니다.

```js
if (!within(h, 120, 230) || !within(n, 20, 70) || !within(w, 40, 180) || !within(kg, 30, 250) || (isFemale && !within(hp, 50, 200))) {
  setIdle(t.invalid);
  return;
}
```

- 키: 120~230cm
- 목: 20~70cm
- 허리: 40~180cm
- 힙(여성): 50~200cm
- 체중: 30~250kg

## 2) US Navy 공식 적용: 남/여 분기

센티미터 입력은 인치로 환산한 뒤 공식을 적용합니다.

```js
const inch = 0.3937007874;
const hi = h * inch;
const ni = n * inch;
const wi = w * inch;
const hpi = hp * inch;
```

여성은 `허리 + 힙 - 목`, 남성은 `허리 - 목`을 사용해 분기합니다.

```js
if (isFemale) {
  denominator = 1.29579 - 0.35004 * Math.log10(wi + hpi - ni) + 0.22100 * Math.log10(hi);
} else {
  denominator = 1.0324 - 0.19077 * Math.log10(wi - ni) + 0.15456 * Math.log10(hi);
}

const bf = 495 / denominator - 450;
```

## 3) 로그 정의역 방어: 계산 오류를 미리 차단

로그 함수는 0 이하를 받을 수 없어서, 아래 조건을 먼저 막아야 합니다.

```js
if (isFemale) {
  if ((wi + hpi) <= ni) { setIdle(t.invalid); return; }
} else {
  if (wi <= ni) { setIdle(t.invalid); return; }
}
if (!(denominator > 0)) { setIdle(t.invalid); return; }
```

추가로 계산 결과 자체도 필터링해 비정상 출력을 차단합니다.

```js
if (!Number.isFinite(bf) || bf <= 0 || bf >= 70) {
  setIdle(t.invalid);
  return;
}
```

## 4) 체지방량·제지방량 계산

체지방률이 확정되면 구성 성분은 단순 계산으로 바로 나옵니다.

```js
const fatMass = kg * (bf / 100);
const leanMass = kg - fatMass;
```

출력은 소수점 1자리로 정리해 가독성을 맞춥니다.

## 5) 범주 분류: 숫자를 해석 가능한 상태로 변환

퍼센트만 보여주면 사용자가 판단하기 어렵기 때문에 범주 라벨을 함께 제공합니다.

- 남성 기준: `<6 필수지방`, `<14 운동선수`, `<18 피트니스`, `<25 평균`, 그 이상 높음
- 여성 기준: `<14 필수지방`, `<21 운동선수`, `<25 피트니스`, `<32 평균`, 그 이상 높음

즉, **수치 + 해석**을 같이 보여 "지금 상태"를 바로 이해할 수 있게 했습니다.

## 6) UX 포인트: 성별 전환과 입력 혼동 제거

남성 모드에서는 힙 입력이 불필요하므로 즉시 비활성화합니다.

```js
const toggleHipField = () => {
  const isFemale = sex.value === 'female';
  hip.disabled = !isFemale;
  hip.setAttribute('aria-disabled', String(!isFemale));
  if (!isFemale) hip.value = '';
};
```

이렇게 하면 모드 전환 시 잘못된 입력 잔존값으로 인한 혼동을 줄일 수 있습니다.

## 내부 링크

- [체지방률 계산기]({{ '/tools/body-fat-calculator/' | relative_url }})
- [BMI 계산기]({{ '/tools/bmi-calculator/' | relative_url }})
- [칼로리 계산기(TDEE)]({{ '/tools/tdee-calculator/' | relative_url }})
- [건강/피트니스 카테고리]({{ '/categories/health/' | relative_url }})

## 요약

이번 체지방률 계산기 로직의 핵심은 아래 3가지입니다.

- **공식 정확도:** US Navy 공식 남/여 분기 적용
- **안정성:** 로그 정의역 + 입력 범위 + 결과값 필터 3중 방어
- **실사용성:** 체지방량/제지방량/범주를 함께 제공해 해석까지 완료

단순 계산기보다, 실제 몸 상태 추세를 확인하는 데 바로 쓰기 좋은 구조를 목표로 구현했습니다.
