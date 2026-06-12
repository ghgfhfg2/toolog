---
layout: tool
title: Text Counter | Check Characters, Lines, UTF-8 Bytes, and Limits
description: Count characters with or without spaces, words, lines, and UTF-8 bytes, then check whether an essay, post, or manuscript exceeds its submission limit.
lang: en
permalink: /en/tools/text-counter/
canonical_url: /en/tools/text-counter/
category: text
category_label: Text/Editing
thumbnail: /assets/thumbs/text-counter.svg
image:
  path: /assets/thumbs/text-counter.svg
  alt: Text counter preview
tool_key: text-counter
keywords: [text counter, character count, byte counter, character limit checker, word count, utf-8 bytes]
related_tools: ['case-converter', 'readability-checker', 'text-line-break-cleaner']
alternate_urls:
  ko: /tools/text-counter/
  en: /en/tools/text-counter/
  ja: /ja/tools/text-counter/
faq:
  - q: How are characters without spaces counted?
    a: The counter removes whitespace characters such as spaces, tabs, and line breaks before counting.
  - q: Why is the UTF-8 byte count different from the character count?
    a: Characters use different amounts of storage. Many non-Latin characters and emoji require multiple UTF-8 bytes.
  - q: Which count should I use for a 500-character limit?
    a: Check whether the form or platform specifies characters with spaces, characters without spaces, or UTF-8 bytes, then select that basis.
  - q: How are emoji counted?
    a: An emoji is counted as one character, but it usually uses multiple UTF-8 bytes.
---

## What search intent does this text counter serve?
Use this **text counter** when you need a quick character count, a count without spaces, or a UTF-8 byte counter before submitting text.

Checking the required limit while drafting helps prevent last-minute edits and rejected submissions.

## Key features
- Characters (with spaces)
- Characters (without spaces)
- Words
- Lines
- UTF-8 bytes
- Limit checks based on characters with spaces, characters without spaces, or bytes
- Example text and copyable count summary

## How to use it
### 1. Paste your text
Paste an application essay, social post, manuscript, or other draft into the text box.

### 2. Choose the correct limit basis
Check whether the destination uses characters with spaces, characters without spaces, or UTF-8 bytes. Enter the optional limit and choose the matching basis.

### 3. Edit any over-limit text
If the counter shows that you are over the limit, remove repetition and move the main point earlier.

When the text box is empty, the results remain at zero. An invalid limit shows an error until you enter a whole number from 1 to 10,000,000.

## Practical examples
### 500-character application response
If a response is 520 characters with spaces, tighten redundant phrases until it is at or below 500.

### Social post limit
Check the length before publishing to avoid a failed upload or an unexpectedly truncated post.

### Localization and system fields
When a database, API, or form has a byte limit, review the UTF-8 byte count instead of relying only on characters.

## Useful companion tools
- Case formatting: [Case Converter]({{ '/en/tools/case-converter/' | relative_url }})
- Sentence difficulty: [Readability Checker]({{ '/en/tools/readability-checker/' | relative_url }})
- Unnecessary line breaks: [Line Break Cleaner]({{ '/en/tools/text-line-break-cleaner/' | relative_url }})
- UTF-8 reference: [Unicode UTF-8](https://www.unicode.org/versions/Unicode15.0.0/ch03.pdf)

## FAQ
### How are characters without spaces counted?
Spaces, tabs, line breaks, and other whitespace characters are removed before counting.

### Why is the UTF-8 byte count different from the character count?
Characters require different amounts of storage. Many non-Latin characters and emoji use more bytes than basic Latin letters.

### Which count should I use for a 500-character limit?
Follow the destination's instructions and select characters with spaces, characters without spaces, or UTF-8 bytes accordingly.

### How are emoji counted?
This tool counts an emoji as one character. Its UTF-8 byte count may be larger depending on the emoji.

## Summary
A text counter is more than a simple tally. It helps prevent submission errors and reduces editing time.
