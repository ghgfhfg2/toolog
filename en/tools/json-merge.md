---
layout: tool
title: JSON Merge | Combine Files, JSONL, Arrays & Objects
description: Combine JSON files, pasted API responses, and JSONL logs locally in your browser. Merge arrays and object keys, remove duplicates, check conflicts and shallow-merge rules, choose pretty or minified output, and copy or download the full result.
lang: en
permalink: /en/tools/json-merge/
canonical_url: /en/tools/json-merge/
category: data
category_label: Data/Utility
thumbnail: /assets/thumbs/json-merge.svg
tool_key: json-merge
keywords: [json merge, combine json files, merge arrays, merge json objects, paste json, json array merge, jsonl merge]
related_tools: [link-list-cleaner, text-counter, case-converter]
faq:
  - q: Are JSON files uploaded to a server before merging?
    a: No. File selection, parsing, merging, preview, and download generation all happen inside your current browser.
  - q: What happens when I upload multiple JSON arrays?
    a: In Auto mode, if every root is an array, they are concatenated in upload order.
  - q: How are JSON objects merged?
    a: Auto mode concatenates exactly one shared array key when available; otherwise it merges object keys. Conflicting keys use the last file or pasted document’s complete value, not a recursive deep merge.
  - q: What if file structures are mixed?
    a: Auto mode wraps each root into an array when structures differ, so the source shape is preserved. Switch merge modes manually if you need a specific output shape.
  - q: Can I merge large JSON files?
    a: Each run accepts up to 50 files with a 20 MB combined limit to protect browser memory. If the result is large, the preview is shortened but the downloaded file keeps the full output.
  - q: Can I paste JSON instead of choosing files?
    a: Yes. Paste an API response or small JSON snippet directly. Separate multiple documents with a line containing only --- and merge them with files if needed.
  - q: Can I remove only one selected JSON file?
    a: Yes. After selecting files, remove individual files from the on-page file list before running the merge.
  - q: Can it handle JSONL where each line is one JSON object?
    a: Yes. Enable JSONL mode to parse each non-empty line as one JSON value, with // comment lines ignored.
  - q: Can I save a minified JSON result?
    a: Yes. Choose Pretty printed or Minified before merging; the preview, copy result, and downloaded file use that output style.
  - q: Why is the merge button disabled?
    a: It stays disabled until at least one JSON file or pasted JSON input is present, so an empty merge cannot run by mistake.
  - q: Is object merging a deep merge?
    a: No. A conflicting key is replaced by the complete value from the last file or pasted document. Common-array concatenation requires exactly one shared array key.
  - q: Why did my previous result disappear after editing the input?
    a: Editing input, changing options, or clearing the tool cancels any in-progress read and invalidates the old result. Run Merge JSON again with the current input.
  - q: What should I do if JSON validation fails?
    a: Check commas and double quotes, remove trailing comments, and verify the selected mode matches every input root. Keep pasted input within 2,000,000 characters and nesting within 100 levels; store precision-sensitive large integers as strings.
alternate_urls:
  ko: /tools/json-merge/
  en: /en/tools/json-merge/
  ja: /ja/tools/json-merge/
---

## When should you use JSON Merge?
Use **JSON Merge** when split JSON files with similar schema need to be combined quickly.

Examples: paged API exports, chunked logs, and batch output files.

It is useful when you saved API responses page by page or need to turn several batch outputs into one `merged.json` without uploading private data elsewhere. For smaller snippets, paste JSON directly instead of saving temporary files, then test the same array merge or object merge behavior. JSONL logs can also be parsed line by line and merged locally, with empty lines and full-line `//` comments skipped.

## Key features
- Multi-file JSON upload
- Direct paste input for API responses and log snippets
- Auto mode detects array/object structure
- Manual modes: array concat, object key merge, wrap roots into array
- Shared-array concatenation for objects such as `{ "items": [...] }`
- JSONL paste mode for one JSON value per line
- Pretty printed or minified output style
- Preview + copy result + `merged.json` download
- Optional array deduplication count + object key conflict count
- Clear errors for invalid JSON, incompatible manual modes, and excessive file size
- Individual selected-file removal and pasted JSON size guidance
- Sample data to test the merge behavior before choosing files

## How to use
1. Upload multiple JSON files.
2. If you do not have files, paste JSON text directly. Use a line containing only `---` between multiple documents, or enable JSONL mode and paste one JSON value per line.
3. Remove any selected file you do not want to include, and check the pasted-size message if you added manual JSON.
4. Pick a merge mode (default: Auto).
5. Choose Pretty printed or Minified output.
6. Click **Merge JSON**.
7. Review duplicate-removal and key-conflict counts, then copy or download the result. A shortened preview does not shorten the saved JSON.
8. If you edit input or options, run **Merge JSON** again before copying or downloading.

## Notes
- In object-merge mode, duplicate keys are overwritten by later files.
- Manual object-merge mode requires every file root to be a JSON object. Incompatible structures are rejected with an error.
- Array deduplication compares objects with sorted keys, so `{ "a": 1, "b": 2 }` and `{ "b": 2, "a": 1 }` count as the same item.
- To protect browser memory, each run accepts up to 50 files with a combined size of 20 MB.
- Uploaded files and pasted JSON share the same 20 MB total limit.
- JSONL mode skips empty lines and lines that start with `//`, but trailing comments are not valid JSON and will be reported as parse errors.
- If no files or pasted JSON are present, the merge button stays disabled and the page shows an empty-input message.
- Uploaded files and merged results stay in your current browser and are never sent to a server.

## Related tools
- Link cleanup: [Link List Cleaner]({{ '/en/tools/link-list-cleaner/' | relative_url }})
- Text length check: [Text Counter]({{ '/en/tools/text-counter/' | relative_url }})
- Key/style cleanup: [Case Converter]({{ '/en/tools/case-converter/' | relative_url }})

## Troubleshooting JSON merge errors and preserving data
- Object-key merging is shallow: a later nested object replaces the earlier value, rather than recursively combining its fields.
- Special JSON keys such as `__proto__`, `constructor`, and `toString` are preserved as ordinary data.
- Common-array mode requires exactly one array key shared by every input object. If several shared array keys exist, Auto falls back to object-key merge; explicit common-array mode reports an error. Choose object-key merge or wrap roots rather than guessing which array to concatenate.
- UTF-8 BOM files are supported; standard JSON comma and quotation rules still apply.
- Pasted input is limited to 2,000,000 characters and nesting to 100 levels. Out-of-range numbers such as `1e400` are rejected. Store precision-sensitive large integers as strings.
- Changing input/options or clearing while files are being read cancels the old result. Merge the new input again.
- Large previews are truncated, but copying and downloading retain the complete JSON.

### Is object merging a deep merge?
No. A conflicting key is replaced by the complete value from the last file or pasted document. Common-array concatenation requires exactly one shared array key.
