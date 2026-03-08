---
layout: tool
title: JSON Merge | Combine Multiple JSON Files at Once
description: Upload multiple JSON files and merge them into a single downloadable JSON output in your browser.
lang: en
permalink: /en/tools/json-merge/
canonical_url: /en/tools/json-merge/
category: data
category_label: Data/Utility
thumbnail: /assets/thumbs/json-merge.svg
tool_key: json-merge
keywords: [json merge, combine json files, merge arrays, merge json objects]
related_tools: [text-counter, case-converter]
faq:
  - q: What happens when I upload multiple JSON arrays?
    a: In Auto mode, if every root is an array, they are concatenated in upload order.
  - q: How are JSON objects merged?
    a: In object-merge mode, keys are merged and duplicate keys are overwritten by later files.
  - q: What if file structures are mixed?
    a: Auto mode wraps roots into an array when structures differ, so source shape is preserved.
alternate_urls:
  ko: /tools/json-merge/
  en: /en/tools/json-merge/
  ja: /ja/tools/json-merge/
---

## When should you use JSON Merge?
Use it when split JSON files with similar schema need to be combined quickly.

Examples: paged API exports, chunked logs, and batch output files.

## Key features
- Multi-file JSON upload
- Auto mode detects array/object structure
- Manual modes: array concat, object key merge, wrap roots into array
- Preview + `merged.json` download

## How to use
1. Upload multiple JSON files.
2. Pick a merge mode (default: Auto).
3. Click **Merge JSON**.
4. Review and download the result.

## Notes
- In object-merge mode, duplicate keys are overwritten by later files.
- Very large files can increase browser memory usage.

## Related tools
- Text length check: [Text Counter]({{ '/en/tools/text-counter/' | relative_url }})
- Key/style cleanup: [Case Converter]({{ '/en/tools/case-converter/' | relative_url }})
