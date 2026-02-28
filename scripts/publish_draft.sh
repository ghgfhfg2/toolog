#!/usr/bin/env bash
set -euo pipefail

if [[ $# -ne 2 ]]; then
  echo "Usage: $0 <draft_filename.md> <yyyy-mm-dd>"
  exit 1
fi

DRAFT_FILE="$1"
PUBLISH_DATE="$2"

if [[ ! -f "_drafts/$DRAFT_FILE" ]]; then
  echo "Draft not found: _drafts/$DRAFT_FILE"
  exit 1
fi

POST_FILE="_posts/${PUBLISH_DATE}-${DRAFT_FILE}"
mv "_drafts/$DRAFT_FILE" "$POST_FILE"
echo "Published: $POST_FILE"
