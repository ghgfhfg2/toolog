# TOOLOG Cron Runbook (웹툴 1일 1개 + 30분 후 i18n)

이 문서는 **나중에 동일한 크론잡을 재등록/재실행**하기 위한 명령 가이드입니다.

기준 플로우:
- 21:00 (KST): 한국어 웹툴 1개 제작 + 배포
- 21:30 (KST): 같은 툴의 영어/일본어 버전 추가 + 배포

---

## 1) 현재 등록 잡 확인

```bash
openclaw cron list --json
```

이름만 간단히 보고 싶으면:

```bash
openclaw cron list --json | jq -r '.jobs[] | [.id,.name,.enabled,.schedule.expr,.schedule.tz] | @tsv'
```

---

## 2) 신규 등록 명령 (권장 이름 포함)

> 시간대는 `Asia/Seoul` 고정.

### A. 21:00 한국어 웹툴 생성/배포

```bash
openclaw cron add \
  --name "toolog-tool-ko-2100" \
  --cron "0 21 * * *" \
  --tz "Asia/Seoul" \
  --session isolated \
  --no-deliver \
  --message "toolog 저장소에서 오늘의 신규 웹툴 1개를 가이드 기준으로 제작하고 배포해줘.
순서:
1) /home/sooya/.openclaw/workspace/toolog/OPERATIONS.md, /home/sooya/.openclaw/workspace/toolog/TOOL_SELECTION_POLICY.md 및 현재 도구 구조(_tools, _data/tools.yml, _layouts/tool.html, assets/js/tools.js) 기준 준수
2) 먼저 최근 발행 툴과 _data/tools.yml을 확인해 최근 5개/10개의 tool 성향을 요약
3) 후보를 최소 8개 발산하되, 계산기형만 내지 말고 converter/checker/generator/planner/utility/picker/simulator/learning 유형을 섞기
4) 최근 5개 중 계산기형이 2개 이상이면 비계산기형 우선 선택, 같은 tool_type 2연속 금지
5) 한국어 원본 툴 1개 작성/연결 (메타, FAQ, related_tools, 썸네일, 홈 노출 정합)
6) _data/tools.yml에 가능하면 tool_type, topic_cluster 메타를 함께 기록
7) 기능 동작 점검 및 YAML/front matter 오류 점검
8) git add -A && git commit -m \"feat: add new ko tool (auto 21:00)\" && git push origin main
9) GitHub Pages 배포 성공 여부까지 확인
10) 실패 시 원인/재시도 방안 요약"
```

### B. 21:30 영어/일본어 확장 + 배포

```bash
openclaw cron add \
  --name "toolog-tool-i18n-2130" \
  --cron "30 21 * * *" \
  --tz "Asia/Seoul" \
  --session isolated \
  --no-deliver \
  --message "toolog 저장소에서 방금 추가된 한국어 웹툴을 기준으로 영어/일본어 버전을 추가하고 배포해줘.
순서:
1) en/tools/<slug>.md, ja/tools/<slug>.md 작성 (ko 기준 의미 보존 번역)
2) _data/tools.yml의 title/description/category_label 다국어 정합 점검
3) 깨진 링크/메타/YAML 오류 점검
4) git add -A && git commit -m \"feat: add i18n pages for new tool (auto 21:30)\" && git push origin main
5) GitHub Pages 배포 성공 여부 확인
6) 실패 시 원인/재시도 방안 요약
주의: 당일 21:00 한국어 신규 툴이 없으면 작업하지 말고 no-op으로 종료"
```

---

## 3) 이미 있는 잡 재실행(수동 트리거)

```bash
openclaw cron list --json | jq -r '.jobs[] | [.id,.name] | @tsv'
# 원하는 id 확인 후
openclaw cron run <JOB_ID>
```

예시:

```bash
openclaw cron run 12345678-abcd-1234-abcd-1234567890ab
```

---

## 4) 수정 / 비활성화 / 삭제

### 스케줄 수정
```bash
openclaw cron edit <JOB_ID> --cron "0 21 * * *" --tz "Asia/Seoul"
```

### 비활성화 / 활성화
```bash
openclaw cron disable <JOB_ID>
openclaw cron enable <JOB_ID>
```

### 삭제
```bash
openclaw cron rm <JOB_ID>
```

---

## 5) 실패 추적

최근 실행 이력 확인:

```bash
openclaw cron runs --json | jq '.'
```

특정 잡 상태 확인(목록의 state 참고):

```bash
openclaw cron list --json | jq '.jobs[] | {id,name,state}'
```

---

## 6) 운영 권장사항

- 잡 이름은 고정: `toolog-tool-ko-2100`, `toolog-tool-i18n-2130`
- i18n(21:30) 메시지에 반드시 **"KO 신규 툴 없으면 no-op"** 조건 유지
- 툴 선정 시 `TOOL_SELECTION_POLICY.md`를 먼저 확인하고 계산기 편향을 피할 것
- 최근 발행 툴의 유형 중복(특히 calculator 연속 발행)을 점검할 것
- 커밋 메시지 패턴 고정으로 추적성 확보
- push 후 배포 성공 확인(워크플로우 green)까지 작업 정의에 포함

---

## 7) 빠른 복구 시나리오

1. 잡이 꼬였을 때:
```bash
openclaw cron list --json
openclaw cron disable <old_job_id>
```

2. 위 2번의 `cron add` 명령으로 새로 등록

3. 즉시 테스트:
```bash
openclaw cron run <new_job_id>
```

4. 문제 없으면 old 잡 삭제:
```bash
openclaw cron rm <old_job_id>
```
