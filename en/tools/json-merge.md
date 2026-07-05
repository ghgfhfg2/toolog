---
layout: tool
title: JSON Merge | Combine Files, Pasted Arrays, and Objects
description: Merge JSON files or pasted API responses in your browser. Concatenate arrays, merge object keys or shared arrays, remove duplicates, review conflicts, copy results, and download merged.json.
lang: en
permalink: /en/tools/json-merge/
canonical_url: /en/tools/json-merge/
category: data
category_label: Data/Utility
thumbnail: /assets/thumbs/json-merge.svg
tool_key: json-merge
keywords: [json merge, combine json files, merge arrays, merge json objects, paste json, json array merge]
related_tools: [link-list-cleaner, text-counter, case-converter]
faq:
  - q: Are JSON files uploaded to a server before merging?
    a: No. File selection, parsing, merging, preview, and download generation all happen inside your current browser.
  - q: What happens when I upload multiple JSON arrays?
    a: In Auto mode, if every root is an array, they are concatenated in upload order.
  - q: How are JSON objects merged?
    a: In object-merge mode, keys are merged and duplicate keys are overwritten by later files.
  - q: What if file structures are mixed?
    a: Auto mode wraps roots into an array when structures differ, so source shape is preserved.
  - q: Can I merge large JSON files?
    a: Each run accepts up to 50 files with a 20 MB combined limit to protect browser memory. If the result is large, the preview is shortened but the downloaded file keeps the full output.
  - q: Can I paste JSON instead of choosing files?
    a: Yes. Paste an API response or small JSON snippet directly. Separate multiple documents with a line containing only --- and merge them with files if needed.
alternate_urls:
  ko: /tools/json-merge/
  en: /en/tools/json-merge/
  ja: /ja/tools/json-merge/
---

## When should you use JSON Merge?
Use it when split JSON files with similar schema need to be combined quickly.

Examples: paged API exports, chunked logs, and batch output files.

It is useful when you saved API responses page by page or need to turn several batch outputs into one `merged.json` without uploading private data elsewhere. For smaller snippets, paste JSON directly instead of saving temporary files.

## Key features
- Multi-file JSON upload
- Direct paste input for API responses and log snippets
- Auto mode detects array/object structure
- Manual modes: array concat, object key merge, wrap roots into array
- Shared-array concatenation for objects such as `{ "items": [...] }`
- Preview + copy result + `merged.json` download
- Optional array deduplication + object key conflict count
- Clear errors for invalid JSON, incompatible manual modes, and excessive file size
- Sample data to test the merge behavior before choosing files

## How to use
1. Upload multiple JSON files.
2. If you do not have files, paste JSON text directly. Use a line containing only `---` between multiple documents.
3. Pick a merge mode (default: Auto).
4. Click **Merge JSON**.
5. Review, copy, or download the result.

## Notes
- In object-merge mode, duplicate keys are overwritten by later files.
- Manual object-merge mode requires every file root to be a JSON object. Incompatible structures are rejected with an error.
- Array deduplication compares objects with sorted keys, so `{ "a": 1, "b": 2 }` and `{ "b": 2, "a": 1 }` count as the same item.
- To protect browser memory, each run accepts up to 50 files with a combined size of 20 MB.
- Uploaded files and pasted JSON share the same 20 MB total limit.
- Uploaded files and merged results stay in your current browser and are never sent to a server.

## Related tools
- Link cleanup: [Link List Cleaner]({{ '/en/tools/link-list-cleaner/' | relative_url }})
- Text length check: [Text Counter]({{ '/en/tools/text-counter/' | relative_url }})
- Key/style cleanup: [Case Converter]({{ '/en/tools/case-converter/' | relative_url }})
