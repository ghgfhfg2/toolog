---
title: 단위 변환기 | 길이·무게·온도 변환, inch cm·lb kg·화씨 섭씨
description: 단위 변환기로 mm·cm·m·km·inch·mile, kg·lb·oz, ℃·℉·K를 즉시 변환하세요. 예시 입력, 단위 교환, 결과 복사, 절대영도·과대값 오류 안내를 지원합니다.
category: data
category_label: 데이터/계산
thumbnail: /assets/thumbs/unit-converter.svg
tool_key: unit-converter
keywords: [단위 변환기, 길이 변환, 무게 변환, 온도 변환, lb kg 변환, inch cm 변환, mile km 변환]
related_tools: [timezone-converter, ratio-split-calculator, average-calculator]
faq:
  - q: 어떤 단위를 지원하나요?
    a: 길이(mm, cm, m, km, inch, ft, yd, mile), 무게(kg, g, lb, oz), 온도(℃, ℉, K)를 지원합니다.
  - q: 온도 변환과 길이/무게 변환의 방식이 다른가요?
    a: 길이/무게는 비율 변환, 온도는 기준점이 있어 별도 공식으로 계산됩니다.
  - q: 소수점은 몇 자리까지 표시되나요?
    a: 결과는 최대 10자리 소수점까지 표시되며, 불필요한 끝자리 0은 생략됩니다.
  - q: 변환 결과를 바로 복사할 수 있나요?
    a: 네. 값이 정상적으로 변환되면 결과 복사 버튼으로 `12 inch = 30.48 cm` 같은 한 줄 요약을 복사할 수 있습니다.
---

## 단위 변환기, 어떤 상황에서 쓰나요?
**단위 변환기**는 `lb to kg`, `inch cm 변환`, `화씨 섭씨 변환`처럼 단위 불일치 문제를 즉시 해결하려는 검색 의도에 맞는 도구입니다.

## 오늘 개선 대상으로 고른 이유
최근 품질 개선 이력이 `privacy-exposure-checker`, `meeting-action-item-extractor`, `filename-sanitizer`, `fraction-calculator`, `body-fat-calculator`, `customer-support-message-generator` 등에 집중되어 있어 같은 툴 반복을 피했습니다.
`unit-converter`는 converter형 도구라 신규 툴 확장 없이 기존 기능 품질을 높이기 좋고, 온도 절대영도·과대 숫자·빈값·모바일 버튼 흐름 같은 오류 가능성과 사용성 개선 여지가 분명해 오늘 대상으로 골랐습니다.

## 지원 범위
- 길이: mm, cm, m, km, inch, ft, yd, mile
- 무게: kg, g, lb, oz
- 온도: ℃, ℉, K

## 사용 방법
1. 변환 타입(길이/무게/온도)을 선택합니다.
2. 기준 단위와 대상 단위를 선택합니다.
3. 값을 입력하면 즉시 변환 결과가 표시됩니다.
4. 가운데 교환 버튼으로 기준 단위와 대상 단위를 빠르게 바꿀 수 있습니다.
5. 예시 입력으로 대표 변환을 확인하고, 필요하면 결과를 복사합니다.

## 입력 오류와 경계값
값을 비워 두면 입력 안내를 보여주고, 숫자가 아니거나 `Infinity`처럼 계산할 수 없는 값은 오류로 표시합니다. 브라우저 표시 안정성을 위해 절댓값 `1e15`을 넘는 과대 숫자는 막고, 온도 변환에서는 ℃ -273.15, ℉ -459.67, K 0보다 낮은 값도 계산하지 않습니다.

## 실전 예시
- 해외 제품 스펙의 inch를 cm로 변환
- 파운드(lb) 수치를 kg로 변환해 발주 자료 작성
- 마일(mile) 이동 거리를 km로 변환
- 화씨(℉) 날씨 데이터를 섭씨(℃)로 환산
- 과학·교육 자료의 K 값을 ℃ 또는 ℉로 빠르게 확인

## 내부/외부 참고 링크
- 비율/수치 텍스트 검증: [글자수 계산기(공백 제외/바이트)]({{ '/tools/text-counter/' | relative_url }})
- 글로벌 일정 대응: [시간대 변환기(국가별 시차 계산)]({{ '/tools/timezone-converter/' | relative_url }})
- 여러 수치의 평균 확인: [평균 계산기]({{ '/tools/average-calculator/' | relative_url }})
- 단위 표준 참고: [NIST SI Units](https://www.nist.gov/pml/owm/metric-si/si-units)

## FAQ
### 어떤 단위를 지원하나요?
길이, 무게, 온도의 핵심 단위를 기본 지원합니다.

### 온도는 왜 별도 계산인가요?
온도는 0점 기준이 단위마다 달라 단순 비율 계산이 불가능합니다.

### 결과 정밀도는 어느 정도인가요?
최대 10자리까지 표기하며, 일반 실무/일상 용도로 충분한 정밀도를 제공합니다.

### 변환 결과를 바로 복사할 수 있나요?
네. 정상 변환 후 `결과 복사`를 누르면 입력값, 기준 단위, 변환값, 대상 단위가 한 줄로 복사됩니다.

## 요약
단위 변환기는 수작업 계산 실수를 줄이고,
해외 자료를 빠르게 로컬 기준으로 해석할 수 있게 해주는 필수 도구입니다.
