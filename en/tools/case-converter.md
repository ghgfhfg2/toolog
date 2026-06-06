---
layout: tool
title: Case Converter | camelCase, snake_case, kebab-case
description: "Convert text to UPPERCASE, lowercase, Title Case, camelCase, snake_case, or kebab-case with compound-word splitting and one-click copy."
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
keywords: [case converter, camelcase converter, snake case converter, kebab case converter, text formatter, uppercase lowercase]
related_tools: ['text-counter', 'unit-converter']
faq:
  - q: When should I use camelCase or snake_case?
    a: Follow your project convention. camelCase is common for JavaScript variables, while snake_case is often used for database columns and backend fields.
  - q: Can it convert Korean text?
    a: Korean has no uppercase or lowercase distinction, so case conversion mainly applies to English words.
  - q: What happens to spaces and special characters?
    a: Most spaces and symbols are treated as separators before the words are rebuilt in the selected format.
  - q: Can the converter split existing camelCase or APIResponse text?
    a: Yes. It detects common lowercase-to-uppercase and acronym boundaries before rebuilding the selected format.
  - q: Does conversion happen on a server?
    a: No. The text is converted only in your browser.
alternate_urls:
  ko: /tools/case-converter/
  en: /en/tools/case-converter/
  ja: /ja/tools/case-converter/
---

## Standardize naming in seconds
This **case converter** is designed for searches such as "camelCase converter" and "snake_case converter." Quickly normalize variable names, headers, and labels while editing code, documentation, or data fields.

## Supported formats
- UPPERCASE
- lowercase
- Title Case
- camelCase
- snake_case
- kebab-case

Existing compound words such as `customerOrder` and `APIResponse` are split before conversion. Use the input summary to check detected words, then copy the finished result with one click.

## How to use it
### 1. Enter the source text
Paste or type up to 50,000 characters.

### 2. Choose a naming style
Select the format you need. The converter recognizes word boundaries in joined English terms such as `camelCase` and `APIResponse`.

### 3. Copy the result
Review the output, then use the copy button to paste it into code, documentation, or a spreadsheet.

## Practical examples
### Standardize API field names
Convert plain-language labels into camelCase or snake_case to keep API specifications and field names consistent.

### Clean up titles and headings
Quickly normalize documents that mix uppercase, lowercase, and title-style capitalization.

## Related tools
- Length checks: [Text Counter]({{ '/en/tools/text-counter/' | relative_url }})
- Numeric conversion helper: [Unit Converter]({{ '/en/tools/unit-converter/' | relative_url }})
- Case-style reference: [MDN - Lexical grammar](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Lexical_grammar)

## FAQ
### When should I use camelCase or snake_case?
Follow your project convention. camelCase is common for frontend and JavaScript variables, while snake_case is widely used for database columns and backend fields.

### Can it convert Korean text?
Korean has no uppercase or lowercase distinction, so the selected case rules mainly affect English words.

### Are special characters supported?
Most special characters are treated as word separators. Review the result when a symbol carries important meaning.

## Summary
The case converter reduces repetitive editing and helps keep code, documentation, and data fields consistent.
