---
title: "비밀번호 생성기 핵심 로직: CSPRNG 난수·문자풀 조합·엔트로피 계산"
date: 2026-03-05 17:00:00 +0900
categories: [webtool, javascript, security]
tags: [비밀번호 생성기, 랜덤 비밀번호, 엔트로피 계산, CSPRNG, JavaScript]
description: "비밀번호 생성기의 핵심 로직을 정리합니다. crypto.getRandomValues 기반 난수 생성, 문자 유형별 최소 1개 보장, 헷갈리는 문자 제외, 대량 생성 시 중복 완화, 엔트로피(비트) 계산 공식을 코드 중심으로 설명합니다."
---

강한 비밀번호를 만들 때 핵심은 감이 아니라 **난수 품질 + 조합 규칙 + 길이**입니다.  
이번에 추가한 비밀번호 생성기는 브라우저 CSPRNG(`crypto.getRandomValues`)를 사용해, 선택한 문자 유형을 반드시 포함한 비밀번호를 빠르게 대량 생성하도록 설계했습니다.

- 도구 바로가기: [비밀번호 생성기]({{ '/tools/password-generator/' | relative_url }})

## 핵심 로직 요약

1. **문자풀 구성**: 대문자/소문자/숫자/특수문자 선택 + 헷갈리는 문자 제외
2. **CSPRNG 난수 선택**: `crypto.getRandomValues`로 인덱스 추출
3. **유형별 최소 1개 보장**: 선택된 각 문자군에서 먼저 1개씩 배치
4. **셔플 + 대량 생성**: 패턴 고정 방지 및 가능한 범위 내 중복 완화
5. **강도 지표 계산**: 엔트로피(비트), 조합 수, 간단 강도 등급 표시

## 1) 문자풀 만들기

사용자가 체크한 문자 유형을 합쳐 전체 문자풀을 만들고, `헷갈리는 문자 제외` 옵션이 켜지면 `O/0`, `I/l/1`, `B/8`, `S/5`, `Z/2` 같은 문자를 필터링합니다.

핵심 포인트는 **문자풀이 비면 즉시 에러 처리**하는 것입니다.

```js
if (!pool.length) {
  throw new Error('최소 1개 이상의 문자 유형을 선택하세요.');
}
```

## 2) CSPRNG 기반 랜덤 선택

`Math.random()` 대신 Web Crypto API를 사용합니다.

```js
function secureIndex(max) {
  const arr = new Uint32Array(1);
  crypto.getRandomValues(arr);
  return arr[0] % max;
}
```

이 방식은 브라우저가 제공하는 암호학적 난수원을 사용하므로, 일반 PRNG보다 예측 가능성이 낮습니다.

## 3) 선택한 유형 최소 1개 보장

예: 대문자+소문자+숫자를 선택했는데 숫자가 하나도 안 들어가면 실사용에서 문제가 됩니다.  
그래서 먼저 선택된 각 문자군에서 1개씩 뽑고, 남은 길이를 전체 문자풀에서 채웁니다.

```js
const requiredChars = selectedGroups.map(group => group[secureIndex(group.length)]);
while (chars.length < length) chars.push(pool[secureIndex(pool.length)]);
```

## 4) 셔플 + 대량 생성 시 중복 완화

유형별 필수문자를 앞쪽에 고정하면 패턴이 생기므로 마지막에 Fisher-Yates 셔플을 적용합니다.  
또한 여러 개 생성할 때는 `Set`으로 고유값을 우선 확보합니다(요청량/조합 수 한계 내).

```js
for (let i = arr.length - 1; i > 0; i--) {
  const j = secureIndex(i + 1);
  [arr[i], arr[j]] = [arr[j], arr[i]];
}
```

## 5) 엔트로피(비트) 계산

길이 `L`, 문자풀 크기 `N`이면 엔트로피는 대략 `L * log2(N)`입니다.

- 엔트로피(비트): `bits = L * Math.log2(N)`
- 총 조합 수: `N^L`

이 값을 기반으로 약/보통/강 같은 **참고용 강도 등급**을 함께 보여줍니다.

## 예외 처리 포인트

- 길이 범위(4~128), 개수 범위(1~20) 검증
- 선택 문자군이 없는 경우 즉시 중단
- 제외 옵션으로 특정 군이 비게 되는 경우 재검증
- 복사 API 실패 시 폴백 처리

## 내부 링크

- [비밀번호 생성기]({{ '/tools/password-generator/' | relative_url }})
- [텍스트 글자수 세기]({{ '/tools/text-counter/' | relative_url }})
- [대소문자 변환기]({{ '/tools/case-converter/' | relative_url }})

## 요약

이번 비밀번호 생성기 로직의 핵심은 다음 4가지입니다.

- `crypto.getRandomValues` 기반 CSPRNG 사용
- 선택한 문자 유형 최소 1개 포함 보장
- 셔플과 고유화로 대량 생성 품질 개선
- 엔트로피/조합 수를 수치로 보여 의사결정 지원

숫자(비트)와 규칙(문자군 보장)을 함께 제공하면, 사용자는 "길고 복잡해 보여서"가 아니라 **근거 있는 강도**로 비밀번호를 선택할 수 있습니다.
