---
layout: tool
title: JSON Merge | Combine Files, Pasted JSON, Arrays, Objects, and Remove Duplicates
description: Merge JSON files or pasted API responses in your browser. Concatenate arrays, merge object keys and shared arrays, remove duplicates, remove selected files, check pasted size, review key conflicts, copy results, and download merged.json.
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
    a: In Auto mode, JSON objects are merged by key, and duplicate keys are overwritten by later files.
  - q: What if file structures are mixed?
    a: Auto mode wraps each root into an array when structures differ, so the source shape is preserved. Switch merge modes manually if you need a specific output shape.
  - q: Can I merge large JSON files?
    a: Each run accepts up to 50 files with a 20 MB combined limit to protect browser memory. If the result is large, the preview is shortened but the downloaded file keeps the full output.
  - q: Can I paste JSON instead of choosing files?
    a: Yes. Paste an API response or small JSON snippet directly. Separate multiple documents with a line containing only --- and merge them with files if needed.
  - q: Can I remove only one selected JSON file?
    a: Yes. After selecting files, remove individual files from the on-page file list before running the merge.
alternate_urls:
  ko: /tools/json-merge/
  en: /en/tools/json-merge/
  ja: /ja/tools/json-merge/
---

## When should you use JSON Merge?
Use it when split JSON files with similar schema need to be combined quickly.

Examples: paged API exports, chunked logs, and batch output files.

It is useful when you saved API responses page by page or need to turn several batch outputs into one `merged.json` without uploading private data elsewhere. For smaller snippets, paste JSON directly instead of saving temporary files, then test the same array merge or object merge behavior.

## Why this tool was refreshed today
Recent quality passes had already focused on tools such as unit conversion, privacy checks, action-item extraction, password strength checks, customer support message generation, scam-signal checks, and filename cleanup, so this update avoids repeating the same tool.

`json-merge` was selected because it has several failure-prone input paths: file upload, direct paste, JSON parsing, large-size limits, and object-key conflicts. It also matches a clear data-work search intent for people trying to combine JSON files, merge arrays, or test pasted API responses locally.

## Key features
- Multi-file JSON upload
- Direct paste input for API responses and log snippets
- Auto mode detects array/object structure
- Manual modes: array concat, object key merge, wrap roots into array
- Shared-array concatenation for objects such as `{ "items": [...] }`
- Preview + copy result + `merged.json` download
- Optional array deduplication + object key conflict count
- Clear errors for invalid JSON, incompatible manual modes, and excessive file size
- Individual selected-file removal and pasted JSON size guidance
- Sample data to test the merge behavior before choosing files

## How to use
1. Upload multiple JSON files.
2. If you do not have files, paste JSON text directly. Use a line containing only `---` between multiple documents.
3. Remove any selected file you do not want to include, and check the pasted-size message if you added manual JSON.
4. Pick a merge mode (default: Auto).
5. Click **Merge JSON**.
6. Review, copy, or download the result.

## Notes
- In object-merge mode, duplicate keys are overwritten by later files.
- Manual object-merge mode requires every file root to be a JSON object. Incompatible structures are rejected with an error.
- Array deduplication compares objects with sorted keys, so `{ "a": 1, "b": 2 }` and `{ "b": 2, "a": 1 }` count as the same item.
- To protect browser memory, each run accepts up to 50 files with a combined size of 20 MB.
- Uploaded files and pasted JSON share the same 20 MB total limit.
- If no files or pasted JSON are present, the merge button stays disabled and the page shows an empty-input message.
- Uploaded files and merged results stay in your current browser and are never sent to a server.

## Related tools
- Link cleanup: [Link List Cleaner]({{ '/en/tools/link-list-cleaner/' | relative_url }})
- Text length check: [Text Counter]({{ '/en/tools/text-counter/' | relative_url }})
- Key/style cleanup: [Case Converter]({{ '/en/tools/case-converter/' | relative_url }})
