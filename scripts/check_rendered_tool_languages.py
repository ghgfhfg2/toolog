#!/usr/bin/env python3
"""Check actual tool HTML for reciprocal language links and self canonicals.

Usage: python3 scripts/check_rendered_tool_languages.py [build_directory]
"""

import json
import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urljoin
from xml.etree import ElementTree

from site_integrity_check import ROOT, parse_tool_ids


ORIGIN = "https://toolog.sooyadev.com"


class Metadata(HTMLParser):
    def __init__(self):
        super().__init__()
        self.canonicals = []
        self.alternates = []
        self.navigation = []
        self.robots = []
        self.schemas = []
        self.nav_depth = 0
        self.schema = None

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == "link" and a.get("rel") == "canonical":
            self.canonicals.append(a.get("href", ""))
        if tag == "link" and "hreflang" in a:
            self.alternates.append((a["hreflang"], a.get("href", "")))
        if tag == "div":
            if self.nav_depth:
                self.nav_depth += 1
            elif "language-nav" in a.get("class", "").split():
                self.nav_depth = 1
        if tag == "a" and self.nav_depth:
            self.navigation.append((a.get("href", ""), a.get("aria-current")))
        if tag == "meta" and a.get("name", "").lower() in ("robots", "googlebot"):
            self.robots.append(a.get("content", "").lower())
        if tag == "script" and a.get("type") == "application/ld+json":
            self.schema = ""

    def handle_endtag(self, tag):
        if tag == "div" and self.nav_depth:
            self.nav_depth -= 1
        if tag == "script" and self.schema is not None:
            self.schemas.append(json.loads(self.schema))
            self.schema = None

    def handle_data(self, data):
        if self.schema is not None:
            self.schema += data


def check_tool(html, slug, language):
    meta = Metadata()
    meta.feed(html)
    paths = {lang: f"/{lang + '/' if lang != 'ko' else ''}tools/{slug}/"
             for lang in ("ko", "en", "ja")}
    expected = {lang: ORIGIN + path for lang, path in paths.items()}
    expected["x-default"] = expected["ko"]
    assert len(meta.canonicals) == 1, "missing or duplicate canonical"
    assert meta.canonicals[0] == expected[language], "canonical must be absolute and self-referencing"
    assert len(meta.alternates) == 4 and dict(meta.alternates) == expected, "wrong hreflang set"
    assert [urljoin(ORIGIN, href) for href, _ in meta.navigation] == [
        expected[lang] for lang in ("ko", "en", "ja")], "wrong language navigation"
    assert [urljoin(ORIGIN, href) for href, current in meta.navigation if current == "page"] == [
        expected[language]], "wrong current language"
    assert not any("noindex" in value or "none" in value for value in meta.robots), "noindex"


def main():
    build = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / "_site"
    ids = parse_tool_ids(ROOT / "_data/tools.yml")
    assert len(ids) == len(set(ids)) > 0, "empty or duplicate tool catalog"
    sitemap = ElementTree.parse(build / "sitemap.xml")
    urls = {node.text for node in sitemap.findall(".//{*}loc")}
    checked = 0
    for slug in ids:
        for lang in ("ko", "en", "ja"):
            path = f"/{lang + '/' if lang != 'ko' else ''}tools/{slug}/"
            check_tool((build / path.lstrip("/") / "index.html").read_text(), slug, lang)
            assert ORIGIN + path in urls, f"missing sitemap entry: {path}"
            checked += 1
    for path in ("", "en", "ja", "about"):
        meta = Metadata()
        meta.feed((build / path / "index.html").read_text())
        assert [href for href, _ in meta.navigation] == ["/", "/en/", "/ja/"], path
    print(f"PASS: {checked} tool pages: reciprocal hreflang, same-tool navigation, "
          "self canonical, indexability, JSON-LD, sitemap; non-tool navigation preserved")


if __name__ == "__main__":
    main()
