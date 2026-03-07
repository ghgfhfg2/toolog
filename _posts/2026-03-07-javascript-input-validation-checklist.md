---
layout: post
title: "JavaScript 입력값 검증 체크리스트: Number.isFinite, 범위 제한, 에러 메시지"
date: 2026-03-07 10:00:00 +0900
categories: [development, javascript, web]
tags: [JavaScript 입력 검증, Number.isFinite, clamp, 폼 유효성 검사, 프론트엔드 안정성]
description: "폼 계산기와 데이터 입력 화면에서 자주 발생하는 숫자 입력 오류를 줄이기 위해, Number.isFinite 검사·범위 제한(clamp)·명확한 에러 메시지 설계를 코드 예시와 함께 정리합니다."
---

숫자 입력을 받는 기능(계산기, 견적 폼, 통계 대시보드)은 작은 검증 누락만 있어도 잘못된 결과를 보여주기 쉽습니다.
특히 `NaN`, `Infinity`, 빈 문자열, 비정상적으로 큰 수는 UI에서는 정상처럼 보이는데 계산 단계에서 문제를 만들곤 합니다.

이 글은 입력 검증을 **복잡한 라이브러리 없이도 재현 가능하게** 만드는 기본 체크리스트를 정리합니다.

## 문제

현장에서 자주 보이는 패턴은 아래와 같습니다.

- `Number(value)` 변환만 하고 유효성 검사를 생략
- UI `min/max` 속성만 믿고 로직 방어를 하지 않음
- 에러 메시지를 한 줄로 뭉뚱그려 사용자가 무엇을 고쳐야 할지 모름

이 상태에서는 아래 이슈가 반복됩니다.

1. 결과 숫자가 갑자기 `NaN`으로 깨짐
2. 모바일 자동완성/붙여넣기로 의도하지 않은 값이 들어옴
3. 운영 중 데이터 품질이 낮아져 신뢰도가 떨어짐

## 설명

입력 검증은 보통 다음 3단계로 설계하면 안정적입니다.

1. **형식 검사**: 숫자로 변환 가능한지 확인
2. **범위 검사**: 허용 구간을 벗어나는지 확인
3. **피드백 분리**: 어떤 필드가 왜 잘못됐는지 명확히 표시

핵심은 `isNaN` 대신 `Number.isFinite`를 우선 사용하는 것입니다.

- `Number.isFinite(n)`은 실제 숫자이면서 유한한 값만 `true`
- `NaN`, `Infinity`, `-Infinity`를 모두 걸러냄

또한, UI의 `min/max`는 보조 장치로 보고, 계산 직전 로직에서 한 번 더 `clamp`(상하한 보정)하는 편이 안전합니다.

## 예시

아래는 월 납입금 계산 전에 입력값을 검증/보정하는 간단한 예시입니다.

```js
function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function parseMoney(raw) {
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

function validateLoanInput({ principal, annualRate, months }) {
  const p = parseMoney(principal);
  const r = parseMoney(annualRate);
  const m = parseMoney(months);

  const errors = [];

  if (p === null || p <= 0) errors.push('대출원금은 0보다 큰 숫자여야 합니다.');
  if (r === null) errors.push('연이율은 숫자로 입력해야 합니다.');
  if (m === null || !Number.isInteger(m)) errors.push('기간은 정수(개월)여야 합니다.');

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    value: {
      principal: clamp(p, 10000, 10000000000),
      annualRate: clamp(r, 0, 100),
      months: clamp(m, 1, 600)
    }
  };
}
```

이 구조의 장점은 다음과 같습니다.

- 계산 함수는 "검증 완료 데이터"만 받으므로 단순해짐
- 필드별 메시지 분리로 사용자가 즉시 수정 가능
- 붙여넣기/자동완성 등 비정상 입력에도 결과 일관성 유지

## 요약

입력 검증의 기본은 복잡하지 않습니다.

- `Number.isFinite`로 숫자 유효성 확인
- 계산 직전 `clamp`로 범위 보정
- 필드별 에러 메시지로 수정 경로 제공

이 세 가지를 지키면 폼/계산기 기능의 안정성과 신뢰도를 동시에 높일 수 있습니다.

## 내부 링크 후보

- [JavaScript 부동소수점 반올림 가이드]({{ '/2026/03/05/javascript-floating-point-rounding-guide.html' | relative_url }})
- [JavaScript debounce/throttle 가이드]({{ '/2026/03/06/javascript-debounce-throttle-guide.html' | relative_url }})
