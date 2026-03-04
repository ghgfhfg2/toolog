---
title: "Jekyll canonical URL 일관성 유지: 중복 인덱싱을 줄이는 템플릿 패턴"
date: 2026-03-04 10:00:00 +0900
categories: [seo, jekyll, webdev]
tags: [Jekyll SEO, canonical URL, 중복 인덱싱, Liquid 템플릿, 메타 태그]
description: "Jekyll 사이트에서 canonical URL을 일관되게 생성하는 방법을 정리합니다. 슬래시/쿼리/절대경로 혼용으로 발생하는 중복 인덱싱 문제를 템플릿 레벨에서 예방하는 구현 예시를 제공합니다."
---

검색엔진이 같은 문서를 여러 URL로 인식하면 신호가 분산됩니다.  
특히 Jekyll에서는 템플릿마다 URL 조합 방식이 달라져 `canonical`이 흔들리기 쉽습니다.

## 문제

다음 상황이 겹치면 중복 인덱싱 가능성이 높아집니다.

- 페이지마다 `canonical` 생성 방식이 다름
- 상대경로/절대경로 혼용
- 끝 슬래시(`/`) 처리 기준 불일치
- 캠페인 쿼리 파라미터가 canonical에 섞임

결과적으로 같은 콘텐츠가 여러 주소로 수집될 수 있고, 검색 성과 해석도 어려워집니다.

## 설명

핵심은 **canonical 생성 규칙을 한 곳에서 고정**하는 것입니다.

1. `site.url` + 정규화된 `page.url`만 사용
2. 쿼리스트링은 canonical에서 제외
3. 슬래시 정책(붙임/미붙임)을 사이트 전체에서 동일하게 유지
4. 모든 레이아웃에서 같은 include를 사용

Jekyll에서는 `_includes/seo/canonical.html` 같은 공통 파일로 관리하면 페이지별 편차를 줄일 수 있습니다.

## 예시

아래 예시는 canonical을 절대 URL로 고정하고, `index.html` 표현을 정리하는 패턴입니다.

{% raw %}
```liquid
{%- assign canonical_path = page.url | replace:'index.html','' -%}
{%- assign canonical_url = canonical_path | absolute_url -%}
<link rel="canonical" href="{{ canonical_url }}">
```
{% endraw %}

레이아웃에서는 직접 URL을 조합하지 말고 include만 호출합니다.

{% raw %}
```liquid
{%- include seo/canonical.html -%}
```
{% endraw %}

배포 후에는 아래 두 가지를 함께 확인합니다.

- 페이지 소스의 `rel="canonical"` 값
- Search Console URL 검사에서 Google이 선택한 canonical

## 내부 링크 후보

- [대출 이자 계산기]({{ '/tools/loan-calculator/' | relative_url }})
- [연봉 실수령액 계산기]({{ '/tools/salary-calculator/' | relative_url }})

## 요약

Jekyll SEO에서 canonical은 단순 메타태그가 아니라 **중복 인덱싱 방지 기준점**입니다.

- 생성 규칙을 include 1곳으로 통합
- 절대 URL 기준으로 고정
- 슬래시/쿼리 처리 정책 일관화
- 배포 후 Search Console로 실제 선택 canonical 검증

이 네 가지를 지키면 페이지 신호 분산을 줄이고, 색인 안정성을 높일 수 있습니다.
