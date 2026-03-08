#!/usr/bin/env python3
import json
import os
import re
import subprocess
from datetime import datetime, timezone
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[1]
TOOLS_DATA = ROOT / "_data" / "tools.yml"
PENDING_DIR = ROOT / ".automation" / "i18n-pending"


def git_changed_files(before: str, after: str):
    cmd = ["git", "diff", "--name-only", before, after]
    out = subprocess.check_output(cmd, cwd=ROOT, text=True)
    return [line.strip() for line in out.splitlines() if line.strip()]


def split_frontmatter(text: str):
    if not text.startswith("---\n"):
        return None, text
    end = text.find("\n---\n", 4)
    if end == -1:
        return None, text
    front = text[4:end]
    body = text[end + 5 :]
    return front, body


def dump_frontmatter(data: dict):
    return yaml.safe_dump(data, sort_keys=False, allow_unicode=True).strip()


def load_tool_catalog():
    with open(TOOLS_DATA, "r", encoding="utf-8") as f:
        rows = yaml.safe_load(f) or []
    return {row.get("id"): row for row in rows if row.get("id")}


def make_draft(front: dict, body: str, slug: str, lang: str, meta: dict):
    f = dict(front)
    f["lang"] = lang
    f["permalink"] = f"/{lang}/tools/{slug}/"
    f["canonical_url"] = f"/{lang}/tools/{slug}/"
    f["alternate_urls"] = {
        "ko": f"/tools/{slug}/",
        "en": f"/en/tools/{slug}/",
        "ja": f"/ja/tools/{slug}/",
    }

    if lang == "en":
        f["title"] = meta.get("title_en") or f"{front.get('title', slug)} (Draft EN)"
        if meta.get("description_en"):
            f["description"] = meta["description_en"]
    else:
        f["title"] = meta.get("title_ja") or f"{front.get('title', slug)}（下書きJA）"
        if meta.get("description_ja"):
            f["description"] = meta["description_ja"]

    f["auto_draft"] = True

    notice = (
        "> ⚠️ Auto-generated draft from Korean source. Language polishing pending.\n\n"
        if lang == "en"
        else "> ⚠️ 韓国語版から自動生成した下書きです。最終翻訳チェック待ちです。\n\n"
    )

    return f"---\n{dump_frontmatter(f)}\n---\n\n{notice}{body.lstrip()}"


def main():
    before = os.getenv("BEFORE_SHA")
    after = os.getenv("AFTER_SHA")
    if not before or not after:
        raise SystemExit("BEFORE_SHA and AFTER_SHA are required")

    changed = git_changed_files(before, after)
    ko_tools = [p for p in changed if re.match(r"^_tools/[^/]+\.md$", p)]
    if not ko_tools:
        print("No changed KO tools")
        return

    catalog = load_tool_catalog()
    PENDING_DIR.mkdir(parents=True, exist_ok=True)

    drafted = []
    for rel in ko_tools:
        slug = Path(rel).stem
        src = ROOT / rel
        text = src.read_text(encoding="utf-8")
        front_raw, body = split_frontmatter(text)
        if not front_raw:
            continue
        front = yaml.safe_load(front_raw) or {}
        meta = catalog.get(slug, {})

        for lang in ("en", "ja"):
            out = ROOT / lang / "tools" / f"{slug}.md"
            if out.exists():
                continue
            out.parent.mkdir(parents=True, exist_ok=True)
            out.write_text(make_draft(front, body, slug, lang, meta), encoding="utf-8")
            drafted.append(str(out.relative_to(ROOT)))

        pending = {
            "slug": slug,
            "ko_source": rel,
            "detectedAt": datetime.now(timezone.utc).isoformat(),
            "status": "pending_review",
        }
        (PENDING_DIR / f"{slug}.json").write_text(json.dumps(pending, ensure_ascii=False, indent=2), encoding="utf-8")

    print("Drafted files:")
    for d in drafted:
        print(" -", d)


if __name__ == "__main__":
    main()
