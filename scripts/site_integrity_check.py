#!/usr/bin/env python3
"""Basic integrity checks for multilingual tool pages/thumbnails.

Fails fast when:
- a tool listed in _data/tools.yml is missing KO/EN/JA page markdown
- shared thumbnail is missing
- a front-matter thumbnail path points to a missing file
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


def parse_front_matter_thumbnail(path: Path) -> str | None:
    text = path.read_text(encoding="utf-8")
    if not text.startswith("---\n"):
        return None
    parts = text.split("\n---\n", 1)
    if len(parts) < 2:
        return None
    fm = parts[0]
    m = re.search(r"^thumbnail:\s*(\S+)\s*$", fm, flags=re.MULTILINE)
    return m.group(1).strip() if m else None


def exists_rel(web_path: str) -> bool:
    rel = web_path.lstrip("/")
    return (ROOT / rel).exists()


def main() -> int:
    missing: list[str] = []

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

    # Validate front-matter thumbnail paths in localized pages.
    for page in list((ROOT / "en" / "tools").glob("*.md")) + list((ROOT / "ja" / "tools").glob("*.md")):
        thumb = parse_front_matter_thumbnail(page)
        if thumb and thumb.startswith("/") and not exists_rel(thumb):
            missing.append(f"{page.relative_to(ROOT)} -> {thumb}")

    if missing:
        print("❌ Site integrity check failed. Missing paths:")
        for item in sorted(set(missing)):
            print(f" - {item}")
        return 1

    print(f"✅ Site integrity check passed ({len(tool_ids)} tools)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
