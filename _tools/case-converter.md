---
title: 대소문자 변환기 | 케이스 변환
description: 대소문자 변환기로 UPPERCASE, lowercase, Title Case, camelCase, PascalCase, snake_case, CONSTANT_CASE, kebab-case를 줄별로 변환하고 코드·문서 필드명을 빠르게 통일하세요.
category: text
category_label: 텍스트/편집
thumbnail: /assets/thumbs/case-converter.svg
tool_key: case-converter
keywords: [대소문자 변환기, camelCase 변환, PascalCase 변환, snake_case 변환, CONSTANT_CASE 변환, kebab-case 변환, 텍스트 포맷 정리]
related_tools: [text-counter, text-line-break-cleaner, json-merge]
faq:
  - q: camelCase와 snake_case는 언제 쓰나요?
    a: camelCase는 자바스크립트 변수명, snake_case는 DB 컬럼/백엔드 필드에서 자주 사용됩니다.
  - q: 한글도 변환되나요?
    a: 한글은 대소문자 개념이 없어 영문 중심 케이스 규칙만 변환됩니다.
  - q: 변환 후 붙어 있는 기호는 어떻게 처리되나요?
    a: 공백/특수문자는 구분자로 인식해 단어를 분리한 뒤 규칙에 맞춰 재조합합니다.
  - q: camelCase로 붙어 있는 단어도 다시 분리되나요?
    a: 네. customerOrder 같은 camelCase와 APIResponse 같은 결합어 경계를 인식해 다른 형식으로 바꿀 수 있습니다.
  - q: 여러 줄을 각각 다른 변수명으로 바꿀 수 있나요?
    a: 네. 줄마다 따로 변환 옵션을 켜면 각 줄을 독립된 이름으로 변환해 목록 작업에 편합니다.
---

## 대소문자 변환기, 왜 필요한가요?
**대소문자 변환기**는 `camelCase 변환`, `PascalCase 변환`, `snake_case 변환`처럼 반복적인 포맷 정리를 빠르게 끝내려는 검색 의도에 맞는 도구입니다. API 필드명, CSV 헤더, JSON 키, 문서 제목처럼 같은 단어를 여러 명명 규칙으로 맞출 때 브라우저에서 바로 처리합니다.

## 지원 케이스
- UPPERCASE
- lowercase
- Title Case
- camelCase
- PascalCase
- snake_case
- CONSTANT_CASE
- kebab-case

## 사용 방법
### 1) 원문 입력
변환할 텍스트를 붙여넣습니다. `customerOrder`, `APIResponse`, `user_id`처럼 이미 붙어 있거나 구분자가 섞인 텍스트도 단어 후보로 분리합니다.

### 2) 규칙 선택
원하는 케이스 버튼을 클릭해 즉시 결과를 확인합니다. 여러 줄의 필드명을 한 번에 정리할 때는 `줄마다 따로 변환`을 켜면 각 줄의 구조를 유지합니다.

### 3) 결과 복사
`결과 복사` 버튼으로 문서, 코드, 스프레드시트에 붙여넣어 사용합니다.

## 실전 예시
### API 필드명 통일
자연어 문장을 camelCase/snake_case로 정리해 스펙 문서 품질을 높일 수 있습니다.

### 환경 변수명 정리
설정 키 목록을 CONSTANT_CASE로 바꿔 `.env` 문서나 배포 설정 표기를 맞출 수 있습니다.

### 제목/헤더 표기 정리
upper/lower/title 규칙이 섞인 문서를 빠르게 일관화할 수 있습니다.

## 내부/외부 참고 링크
- 분량/바이트 점검: [글자수 계산기(공백 제외/바이트)]({{ '/tools/text-counter/' | relative_url }})
- 여러 줄 정리: [줄바꿈 정리 도구]({{ '/tools/text-line-break-cleaner/' | relative_url }})
- JSON 키 작업: [JSON 합치기]({{ '/tools/json-merge/' | relative_url }})
- 케이스 스타일 참고: [MDN - Lexical grammar](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Lexical_grammar)

## FAQ
### camelCase와 snake_case는 언제 쓰나요?
프로젝트 컨벤션을 따르되, 프론트엔드는 camelCase, DB/백엔드는 snake_case가 일반적입니다.

### 한글도 변환되나요?
한글은 대소문자 개념이 없어 영문 중심 규칙으로 동작합니다.

### 특수문자가 섞여 있어도 괜찮나요?
대부분 구분자로 처리되어 변환됩니다. 다만 의미가 중요한 기호는 결과를 한 번 검토하세요.

### 줄별 변환은 언제 쓰나요?
필드명, 메뉴명, 태그 목록처럼 한 줄에 하나씩 있는 텍스트를 각각 camelCase나 snake_case로 바꿀 때 사용합니다.

## 요약
대소문자 변환기는 반복 입력을 줄이고, 문서·코드·데이터의 일관성을 높이는 기본 자동화 도구입니다.
