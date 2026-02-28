---
title: 대소문자 변환기 | UPPER/lower/Title/camel/snake 자동 변환
description: 대소문자 변환기로 UPPER/lower/Title/camelCase/snake_case를 즉시 변환하세요. 코드·문서 필드명을 빠르게 통일하고 반복 작업을 줄일 수 있습니다.
category: text
category_label: 텍스트/편집
thumbnail: /assets/thumbs/case-converter.svg
tool_key: case-converter
keywords: [대소문자 변환기, camelCase 변환, snake_case 변환, 텍스트 포맷 정리]
faq:
  - q: camelCase와 snake_case는 언제 쓰나요?
    a: camelCase는 자바스크립트 변수명, snake_case는 DB 컬럼/백엔드 필드에서 자주 사용됩니다.
  - q: 한글도 변환되나요?
    a: 한글은 대소문자 개념이 없어 영문 중심 케이스 규칙만 변환됩니다.
  - q: 변환 후 붙어 있는 기호는 어떻게 처리되나요?
    a: 공백/특수문자는 구분자로 인식해 단어를 분리한 뒤 규칙에 맞춰 재조합합니다.
---

## 대소문자 변환기, 왜 필요한가요?
`camelCase 변환`, `snake_case 변환`, `대소문자 변환기` 검색 사용자는
대부분 **반복적인 포맷 정리 시간을 줄이려는 의도**가 있습니다.

## 지원 케이스
- UPPER
- lower
- Title Case
- camelCase
- snake_case

## 사용 방법
### 1) 원문 입력
변환할 텍스트를 붙여넣습니다.

### 2) 규칙 선택
원하는 케이스 버튼을 클릭해 즉시 결과를 확인합니다.

### 3) 결과 복사
문서/코드/스프레드시트에 그대로 붙여넣어 사용합니다.

## 실전 예시
### API 필드명 통일
자연어 문장을 camelCase/snake_case로 정리해 스펙 문서 품질을 높일 수 있습니다.

### 제목/헤더 표기 정리
upper/lower/title 규칙이 섞인 문서를 빠르게 일관화할 수 있습니다.

## 내부/외부 참고 링크
- 분량/바이트 점검: [글자수 계산기]({{ '/tools/text-counter/' | relative_url }})
- 수치/단위 문서 정리: [단위 변환기]({{ '/tools/unit-converter/' | relative_url }})
- 케이스 스타일 참고: [MDN - Lexical grammar](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Lexical_grammar)

## FAQ
### camelCase와 snake_case는 언제 쓰나요?
프로젝트 컨벤션을 따르되, 프론트엔드는 camelCase, DB/백엔드는 snake_case가 일반적입니다.

### 한글도 변환되나요?
한글은 대소문자 개념이 없어 영문 중심 규칙으로 동작합니다.

### 특수문자가 섞여 있어도 괜찮나요?
대부분 구분자로 처리되어 변환됩니다. 다만 의미가 중요한 기호는 결과를 한 번 검토하세요.

## 요약
대소문자 변환기는 반복 입력을 줄이고, 문서·코드·데이터의 일관성을 높이는 기본 자동화 도구입니다.
