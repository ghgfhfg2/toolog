#!/usr/bin/env python3
import json
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PENDING_DIR = ROOT / ".automation" / "i18n-pending"
DUE_FILE = ROOT / ".automation" / "i18n-due.json"
THRESHOLD_SECONDS = 3600


def parse_iso(s: str):
    if s.endswith("Z"):
        s = s[:-1] + "+00:00"
    return datetime.fromisoformat(s)


def main():
    due = []
    now = datetime.now(timezone.utc)

    if PENDING_DIR.exists():
        for path in sorted(PENDING_DIR.glob("*.json")):
            data = json.loads(path.read_text(encoding="utf-8"))
            detected = parse_iso(data["detectedAt"])
            age = (now - detected).total_seconds()
            if age >= THRESHOLD_SECONDS:
                due.append(data)

    DUE_FILE.parent.mkdir(parents=True, exist_ok=True)
    DUE_FILE.write_text(json.dumps(due, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"due_count={len(due)}")


if __name__ == "__main__":
    main()
