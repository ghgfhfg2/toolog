---
layout: tool
title: Case Converter | camelCase, PascalCase, snake_case
description: "Convert text to UPPERCASE, lowercase, Title Case, camelCase, PascalCase, snake_case, CONSTANT_CASE, or kebab-case with line-by-line conversion and one-click copy."
lang: en
permalink: /en/tools/case-converter/
canonical_url: /en/tools/case-converter/
category: text
category_label: Text/Editing
thumbnail: /assets/thumbs/case-converter.svg
image:
  path: /assets/thumbs/case-converter.svg
  alt: Case converter preview
tool_key: case-converter
keywords: [case converter, camelcase converter, pascal case converter, snake case converter, constant case converter, kebab case converter, text formatter, uppercase lowercase]
related_tools: ['text-counter', 'text-line-break-cleaner', 'json-merge']
faq:
  - q: When should I use camelCase or snake_case?
    a: Follow your project convention. camelCase is common for JavaScript variables, while snake_case is often used for database columns and backend fields.
  - q: Can it convert Korean text?
    a: Korean has no uppercase or lowercase distinction, so case conversion mainly applies to English words.
  - q: What happens to spaces and special characters?
    a: Most spaces and symbols are treated as separators before the words are rebuilt in the selected format.
  - q: Can the converter split existing camelCase or APIResponse text?
    a: Yes. It detects common lowercase-to-uppercase and acronym boundaries before rebuilding the selected format.
  - q: Can I convert multiple field names line by line?
    a: Yes. Turn on line-by-line conversion to keep each source line as a separate converted name.
  - q: Does conversion happen on a server?
    a: No. The text is converted only in your browser.
alternate_urls:
  ko: /tools/case-converter/
  en: /en/tools/case-converter/
  ja: /ja/tools/case-converter/
---

## Standardize naming in seconds
This **case converter** is designed for searches such as "camelCase converter," "PascalCase converter," and "snake_case converter." Quickly normalize variable names, headers, JSON keys, and labels while editing code, documentation, or data fields.

## Supported formats
- UPPERCASE
- lowercase
- Title Case
- camelCase
- PascalCase
- snake_case
- CONSTANT_CASE
- kebab-case

Existing compound words such as `customerOrder` and `APIResponse` are split before conversion. Use the input summary to check detected words, keep multi-line lists separate when needed, then copy the finished result with one click.

## How to use it
### 1. Enter the source text
Paste or type up to 50,000 characters. Joined names, underscores, spaces, and punctuation are treated as word boundaries where possible.

### 2. Choose a naming style
Select the format you need. Turn on line-by-line conversion when each row should become its own variable or key.

### 3. Copy the result
Review the output, then use the copy button to paste it into code, documentation, or a spreadsheet.

## Practical examples
### Standardize API field names
Convert plain-language labels into camelCase or snake_case to keep API specifications and field names consistent.

### Prepare environment variable keys
Convert setting names to CONSTANT_CASE for `.env` examples and deployment documentation.

### Clean up titles and headings
Quickly normalize documents that mix uppercase, lowercase, and title-style capitalization.

## Related tools
- Length checks: [Text Counter]({{ '/en/tools/text-counter/' | relative_url }})
- Multi-line cleanup: [Line Break Cleaner]({{ '/en/tools/text-line-break-cleaner/' | relative_url }})
- JSON key workflow: [JSON Merge]({{ '/en/tools/json-merge/' | relative_url }})
- Case-style reference: [MDN - Lexical grammar](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Lexical_grammar)

## FAQ
### When should I use camelCase or snake_case?
Follow your project convention. camelCase is common for frontend and JavaScript variables, while snake_case is widely used for database columns and backend fields.

### Can it convert Korean text?
Korean has no uppercase or lowercase distinction, so the selected case rules mainly affect English words.

### Are special characters supported?
Most special characters are treated as word separators. Review the result when a symbol carries important meaning.

### When should I use line-by-line conversion?
Use it for lists of field names, menu labels, tags, or headings when each line should stay separate after conversion.

## Summary
The case converter reduces repetitive editing and helps keep code, documentation, and data fields consistent.
