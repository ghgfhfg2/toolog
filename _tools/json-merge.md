---
title: JSON 합치기 | 여러 JSON 파일 한 번에 병합
description: 같은 형식의 JSON 파일 여러 개를 업로드하면 하나의 JSON으로 합쳐 다운로드할 수 있는 JSON 합치기 툴입니다.
category: data
category_label: 데이터/계산
thumbnail: /assets/thumbs/json-merge.svg
tool_key: json-merge
keywords: [json 합치기, json 병합, 여러 json 파일 하나로, json merge]
related_tools: [text-counter, case-converter]
faq:
  - q: 배열 JSON 파일 여러 개를 업로드하면 어떻게 합쳐지나요?
    a: 자동 모드에서 모든 루트가 배열이면 순서대로 이어붙여 하나의 배열로 병합합니다.
  - q: 객체(JSON object) 파일은 어떻게 합쳐지나요?
    a: 자동 모드에서 객체끼리는 키를 병합하며, 같은 키가 있으면 뒤에 업로드된 파일 값으로 덮어씁니다.
  - q: 파일 구조가 서로 다르면?
    a: 자동 모드에서 파일별 루트를 배열로 감싸 보존합니다. 필요하면 병합 모드를 수동으로 바꿔 사용하세요.
---

## JSON 합치기, 언제 쓰면 좋나요?
**JSON 합치기 툴**은 같은 스키마로 분할 저장된 파일들을 빠르게 하나로 묶어야 할 때 유용합니다.

예: 로그 분할 파일, 배치 결과 파일, 페이지 단위 수집 JSON 등.

## 핵심 기능
- JSON 파일 다중 업로드
- 자동 병합 모드(배열/객체 구조 자동 감지)
- 배열 이어붙이기/객체 키 병합/루트 배열 감싸기 수동 선택
- 결과 미리보기 + `merged.json` 다운로드

## 사용 방법
1. JSON 파일 여러 개를 업로드합니다.
2. 병합 방식을 선택합니다(기본: 자동).
3. **JSON 합치기** 버튼을 누릅니다.
4. 결과를 확인한 뒤 다운로드합니다.

## 주의사항
- 객체 병합 모드에서 동일 키 충돌 시 뒤 파일 값이 우선합니다.
- 매우 큰 파일은 브라우저 메모리 사용량이 커질 수 있습니다.

## 함께 쓰면 좋은 도구
- 텍스트 길이 확인: [글자수 계산기]({{ '/tools/text-counter/' | relative_url }})
- 키 표기 정리: [대소문자 변환기]({{ '/tools/case-converter/' | relative_url }})
