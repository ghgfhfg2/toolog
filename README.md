# Toolog

Jekyll + GitHub Pages 기반 개발 블로그.

## 로컬 실행

```bash
bundle install
bundle exec jekyll serve
```

## 운영 플로우

1. 초안 작성: `_drafts/*.md`
2. 검수 요청
3. 승인 후 발행:

```bash
./scripts/publish_draft.sh <draft_filename.md> <yyyy-mm-dd>
```

4. 커밋/푸시 (GitHub Pages 자동 반영)

자세한 운영 정책은 `OPERATIONS.md` 참고.
