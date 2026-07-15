---
layout: tool
title: Filename Sanitizer | Remove symbols, keep extensions, and fix duplicates
description: Paste titles or file names to normalize spaces, special characters, repeated separators, extensions, date prefixes, sequence numbers, and duplicate candidates into safer copy-ready file names.
lang: en
permalink: /en/tools/filename-sanitizer/
canonical_url: /en/tools/filename-sanitizer/
category: text
category_label: Text/File Naming
thumbnail: /assets/thumbs/en/filename-sanitizer.svg
image:
  path: /assets/thumbs/en/filename-sanitizer.svg
  alt: Filename sanitizer thumbnail
tool_key: filename-sanitizer
tool_type: utility
topic_cluster: work
keywords: [filename sanitizer, file name cleaner, remove special characters from filenames, batch filename formatting, add numbers to file names, safe file names]
related_tools: [text-line-break-cleaner, case-converter, privacy-exposure-checker]
faq:
  - q: Does it rename files automatically?
    a: No. It prepares cleaner file-name suggestions in your browser so you can copy them before uploading or renaming files elsewhere.
  - q: Can it keep Korean or non-English names?
    a: Yes. It mainly removes risky punctuation and normalizes separators. Existing Hangul, Latin letters, and numbers can stay.
  - q: Can I process multiple lines at once?
    a: Yes. Add one title or file name per line, then apply numbering and date rules to the whole batch.
  - q: How are duplicate file names handled?
    a: When duplicate adjustment is turned on, the tool appends a number to repeated results to reduce naming conflicts. Before applying the names, still check whether the destination folder already contains the same names.
---

## Why use a filename sanitizer?
When you handle documents, screenshots, thumbnails, and attachments, messy file names often become a small but constant source of friction.
In shared folders, blog uploads, and submission packages, **consistent naming rules make files easier to sort, search, and reuse**.

This tool helps you:
- normalize spaces and special characters
- unify separator style
- add a date prefix and sequence numbers
- keep common extensions such as `.png`, `.pdf`, and `.xlsx`
- make duplicate filename candidates unique
- copy a cleaner output list for the next step

## How to use it
1. Paste titles or file names, one per line.
2. Choose hyphen, underscore, or no separator.
3. Optionally force English letters to lower/upper case.
4. Turn on date prefix, sequence numbering, extension keeping, and duplicate adjustment as needed.
5. Review the cleaned list, then copy it for folder cleanup, uploads, or batch rename preparation.

## Especially useful for
### 1) Blog or CMS asset uploads
Clean image names before uploading thumbnails and post assets.

### 2) Assignment and submission files
Keep report, version, and submission-date naming rules more consistent.

### 3) Shared team folders
Reduce naming chaos before a folder grows too large to manage comfortably.

## Related tools
- To clean pasted title lists first: [Text Line Break Cleaner]({{ '/en/tools/text-line-break-cleaner/' | relative_url }})
- To adjust English case rules separately: [Case Converter]({{ '/en/tools/case-converter/' | relative_url }})
- To check drafts for personal data before sharing: [Privacy Exposure Checker]({{ '/en/tools/privacy-exposure-checker/' | relative_url }})

## FAQ
### Does it add extensions automatically?
If an extension like `.png` or `.pdf` is already present, the tool keeps it. If there is no extension, it only cleans the name itself.

### Can I use my own date instead of today?
Yes. You can leave the date off, use today, or choose a custom date to prepend.

### Do I have to remove all special characters?
Not always, but replacing risky punctuation with safer separators usually reduces upload and compatibility problems.

### Are duplicate names changed automatically?
If duplicate adjustment is enabled, repeated results get suffixes such as `-2` and `-3`. The tool does not scan your actual folder, so confirm the final names before applying them.

## Rules and limits
- Characters that often cause filename problems, including `/ \ : * ? " < > |`, are treated like separators.
- With extension keeping enabled, common final extensions such as `.png`, `.pdf`, and `.xlsx` are preserved as much as possible.
- To avoid browser slowdowns, the first 200 non-empty lines are processed.
- This tool does not rename real files. Copy the cleaned names and apply them in your upload or batch-renaming workflow.

## Summary
The Filename Sanitizer is a **browser-based utility for turning messy titles or inconsistent file names into safer, rule-based names for uploads, sharing, and batch rename preparation**.
