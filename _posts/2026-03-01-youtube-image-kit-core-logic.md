---
title: "유튜브 썸네일 만들기 핵심 로직: 이미지 1장으로 썸네일·쇼츠·배너 자동 생성 구현"
date: 2026-03-01 17:00:00 +0900
categories: [webtool, javascript, canvas]
tags: [유튜브썸네일만들기, youtube-image-kit, canvas, 이미지리사이즈, cover-contain]
description: "유튜브 이미지 세트 메이커의 핵심 로직을 문제 정의부터 Canvas 스케일링 원리, 예외 처리, 일괄 다운로드 구현까지 코드 중심으로 정리합니다."
---

유튜브 작업을 하다 보면 같은 원본 이미지로 **썸네일(16:9), 쇼츠(9:16), 채널 배너(초가로형), 아이콘(정사각형)**을 각각 다시 만들어야 합니다.
이번 글은 직전 추가한 웹툴인 **유튜브 이미지 세트 메이커**를 기준으로, 실제 구현에 들어간 핵심 로직을 정리한 글입니다.

- 바로 사용: [유튜브 이미지 세트 메이커]({{ '/tools/youtube-image-kit/' | relative_url }})

## 문제 정의: 왜 자동 세트 생성이 필요한가?

### 반복 작업 비용
- 비율이 다른 출력물을 매번 수동으로 맞추면 시간이 오래 걸립니다.
- 디자인 툴을 켜고 저장 포맷을 여러 번 반복해야 합니다.

### 품질 일관성
- 작업자마다 크롭 기준이 달라 채널 톤이 흔들릴 수 있습니다.
- 같은 소스에서도 결과물이 들쭉날쭉해집니다.

### 해결 목표
원본 1장을 받아, 미리 정의된 유튜브 규격 목록으로 **동일한 프레이밍 원칙**을 적용해 PNG를 일괄 생성합니다.

## 원리: cover/contain 스케일링을 공통 함수로 처리

핵심은 `drawFrame()` 한 함수로 모든 타깃 비율을 처리하는 것입니다.

```js
const drawFrame = (ctx, image, w, h, mode, bgColor) => {
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, w, h);

  const scale = mode === 'cover'
    ? Math.max(w / image.width, h / image.height)
    : Math.min(w / image.width, h / image.height);

  const dw = image.width * scale;
  const dh = image.height * scale;
  const dx = (w - dw) / 2;
  const dy = (h - dh) / 2;

  ctx.drawImage(image, dx, dy, dw, dh);
};
```

### H3. cover와 contain 차이
- `cover`: 캔버스를 꽉 채움(일부 잘릴 수 있음)
- `contain`: 원본 전체 유지(여백 생길 수 있음)

이 선택지만으로 썸네일 중심/로고 중심 같은 서로 다른 요구를 대부분 커버할 수 있습니다.

## 핵심 코드: 타깃 규격 루프 + 렌더 저장

툴에서는 유튜브 업로드에 자주 쓰는 규격을 배열로 관리합니다.

```js
const targets = [
  { key: 'thumbnail', label: '유튜브 썸네일', w: 1280, h: 720 },
  { key: 'shorts-cover', label: '쇼츠 커버', w: 1080, h: 1920 },
  { key: 'channel-banner', label: '채널 배너', w: 2560, h: 1440 },
  { key: 'channel-icon', label: '채널 아이콘', w: 800, h: 800 },
  { key: 'watermark', label: '워터마크', w: 150, h: 150 }
];

targets.forEach((t) => {
  const canvas = document.createElement('canvas');
  canvas.width = t.w;
  canvas.height = t.h;

  const ctx = canvas.getContext('2d');
  drawFrame(ctx, img, t.w, t.h, fit.value || 'cover', bg?.value || '#0f172a');

  const dataUrl = canvas.toDataURL('image/png');
  // 카드/다운로드 링크 생성 및 DOM 추가
});
```

구조를 이렇게 잡아두면, 이후 플랫폼 규격이 늘어도 `targets`만 추가하면 됩니다.

## 예외 처리: 실제 사용자 입력에서 자주 터지는 지점

### 1) 파일 미선택 상태
`if (!img || !wrap) return;` 형태로 빠르게 종료해 null 접근을 막습니다.

### 2) 비정상 모드/색상 값
`fit.value || 'cover'`, `bg?.value || '#0f172a'`처럼 기본값을 줘서 UI 입력 이상에도 동작을 유지합니다.

### 3) 다운로드 연타 이슈
전체 다운로드는 브라우저 정책/렌더 타이밍 영향을 줄이기 위해 180ms 간격으로 순차 클릭합니다.

```js
for (const a of renders) {
  a.click();
  await new Promise((r) => setTimeout(r, 180));
}
```

### 4) 미리보기 왜곡 방지
미리보기도 원본과 같은 캔버스 렌더링 로직을 사용해 본 저장 이미지와 시각 불일치를 줄였습니다.

## 함께 쓰면 좋은 내부 도구

- [유튜브 이미지 세트 메이커]({{ '/tools/youtube-image-kit/' | relative_url }})
- [이미지 리사이저]({{ '/tools/image-resizer/' | relative_url }})
- [PNG 압축기]({{ '/tools/png-compressor/' | relative_url }})

## 요약

이 툴의 핵심은 복잡한 필터가 아니라, **비율이 다른 캔버스들에 동일한 스케일링 원칙을 적용하는 구조화**입니다.

- 문제: 플랫폼별 이미지 규격 반복 작업
- 원리: `cover/contain` + 중앙 정렬 스케일링
- 구현: `targets` 루프 기반 다중 캔버스 생성
- 안정성: 기본값/조기 종료/순차 다운로드 예외 처리

결과적으로, 이미지 1장으로 유튜브 업로드 준비물을 빠르게 일괄 생성할 수 있습니다.

## FAQ

### Q1. cover와 contain 중 무엇을 써야 하나요?
인물/제품을 화면 가득 보이게 하려면 `cover`, 로고/텍스트 잘림이 민감하면 `contain`이 안전합니다.

### Q2. 왜 JPG가 아니라 PNG로 저장하나요?
여러 규격을 한 번에 만들 때 품질 손실 없는 기본 포맷이 관리가 쉬워 PNG를 기본값으로 두었습니다.

### Q3. 서버 업로드 없이 처리되나요?
네. 브라우저의 Canvas에서 로컬 처리 후 바로 다운로드합니다.
