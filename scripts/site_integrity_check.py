#!/usr/bin/env python3
"""Basic integrity checks for multilingual tool pages/thumbnails.

Fails fast when:
- a tool listed in _data/tools.yml is missing KO/EN/JA page markdown
- shared thumbnail is missing
- a tool page has malformed front matter
- a tool page canonical_url points at the wrong locale path
- a front-matter thumbnail path points to a missing file
- EN/JA localized thumbnails still contain Hangul text
"""

from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TOOLS_YML = ROOT / "_data" / "tools.yml"


def parse_tool_ids(path: Path) -> list[str]:
    ids: list[str] = []
    for line in path.read_text(encoding="utf-8").splitlines():
        m = re.match(r"^-\s+id:\s*([a-z0-9-]+)\s*$", line.strip())
        if m:
            ids.append(m.group(1))
    return ids


def parse_front_matter(path: Path) -> dict[str, str] | None:
    text = path.read_text(encoding="utf-8")
    if not text.startswith("---\n"):
        return None
    parts = text.split("\n---\n", 1)
    if len(parts) < 2:
        return None
    fm = parts[0]
    fields: dict[str, str] = {}
    for line in fm.splitlines()[1:]:
        m = re.match(r"^([a-zA-Z0-9_-]+):\s*(.*?)\s*$", line)
        if m:
            fields[m.group(1)] = m.group(2)
    return fields


def expected_canonical(path: Path) -> str | None:
    rel = path.relative_to(ROOT)
    slug = path.stem
    if rel.parts[:1] == ("_tools",):
        return f"/tools/{slug}/"
    if rel.parts[:2] == ("en", "tools"):
        return f"/en/tools/{slug}/"
    if rel.parts[:2] == ("ja", "tools"):
        return f"/ja/tools/{slug}/"
    return None


def exists_rel(web_path: str) -> bool:
    rel = web_path.lstrip("/")
    return (ROOT / rel).exists()


def contains_hangul(text: str) -> bool:
    return re.search(r"[가-힣]", text) is not None


def main() -> int:
    missing: list[str] = []
    front_matter_issues: list[str] = []
    lang_text_issues: list[str] = []

    tool_ids = parse_tool_ids(TOOLS_YML)
    if not tool_ids:
        print("No tool ids found in _data/tools.yml", file=sys.stderr)
        return 1

    for tool_id in tool_ids:
        for rel in [
            f"_tools/{tool_id}.md",
            f"en/tools/{tool_id}.md",
            f"ja/tools/{tool_id}.md",
            f"assets/thumbs/{tool_id}.svg",
            f"assets/thumbs/en/{tool_id}.svg",
            f"assets/thumbs/ja/{tool_id}.svg",
        ]:
            if not (ROOT / rel).exists():
                missing.append(rel)

    # Validate front matter, canonical paths, and thumbnail paths.
    tool_pages = (
        list((ROOT / "_tools").glob("*.md"))
        + list((ROOT / "en" / "tools").glob("*.md"))
        + list((ROOT / "ja" / "tools").glob("*.md"))
    )
    for page in tool_pages:
        fm = parse_front_matter(page)
        rel_page = page.relative_to(ROOT)
        if fm is None:
            front_matter_issues.append(f"{rel_page} -> malformed or missing front matter")
            continue

        canonical = fm.get("canonical_url")
        expected = expected_canonical(page)
        if canonical and expected and canonical != expected:
            front_matter_issues.append(f"{rel_page} -> canonical_url {canonical} should be {expected}")

        thumb = fm.get("thumbnail")
        if thumb and thumb.startswith("/") and not exists_rel(thumb):
            missing.append(f"{page.relative_to(ROOT)} -> {thumb}")

    # EN/JA thumbnails must not contain Hangul text.
    for lang in ["en", "ja"]:
        thumb_dir = ROOT / "assets" / "thumbs" / lang
        for svg in thumb_dir.glob("*.svg"):
            body = svg.read_text(encoding="utf-8")
            if contains_hangul(body):
                lang_text_issues.append(str(svg.relative_to(ROOT)))

    if missing or front_matter_issues or lang_text_issues:
        print("❌ Site integrity check failed.")
        if missing:
            print("Missing paths:")
            for item in sorted(set(missing)):
                print(f" - {item}")
        if front_matter_issues:
            print("Front matter issues:")
            for item in sorted(set(front_matter_issues)):
                print(f" - {item}")
        if lang_text_issues:
            print("Localized thumbnail language issues (Hangul found in EN/JA):")
            for item in sorted(set(lang_text_issues)):
                print(f" - {item}")
        return 1

    print(f"✅ Site integrity check passed ({len(tool_ids)} tools)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
