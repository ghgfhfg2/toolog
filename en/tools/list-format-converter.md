---
layout: tool
title: List Format Converter | Turn line, comma, or tab lists into CSV, Markdown, or JSON
description: Paste a line list or comma/tab-separated items and convert them into CSV, a Markdown table, a JSON array, or a numbered list with blank, space, and duplicate cleanup.
lang: en
permalink: /en/tools/list-format-converter/
canonical_url: /en/tools/list-format-converter/
alternate_urls:
  ko: /tools/list-format-converter/
  en: /en/tools/list-format-converter/
  ja: /ja/tools/list-format-converter/
category: productivity
category_label: Work/List Formatting
thumbnail: /assets/thumbs/en/list-format-converter.svg
image:
  path: /assets/thumbs/en/list-format-converter.svg
  alt: List Format Converter thumbnail
tool_key: list-format-converter
tool_type: converter
topic_cluster: text
keywords: [list converter, CSV converter, markdown table converter, JSON array converter, comma list converter, list cleanup]
related_tools: [text-line-break-cleaner, link-list-cleaner, case-converter]
faq:
  - q: What input format works best?
    a: One item per line is the default. You can also choose comma or tab splitting, then trim spaces and remove blank values with the cleanup options.
  - q: Can I change the table column name?
    a: Yes. Enter the header you want, and it will be used as the first row of the CSV and Markdown table output.
  - q: Is my list saved on a server?
    a: No. Conversion runs only in your current browser and is not sent to or stored on a server.
---

## Why use the List Format Converter?
When you want to paste a plain line list from a messenger or notes app into a work document, blog post, spreadsheet, or developer document, small formatting work can take more time than expected. Adding numbers to each item, escaping commas for CSV, and writing the separator row for a Markdown table are simple tasks, but they are easy to repeat again and again.

This tool turns one-item-per-line lists, comma-separated lists, and tab-separated lists directly into **CSV, Markdown tables, JSON arrays, and numbered lists**. Because everything runs inside your browser, it is useful for quickly organizing work lists, meeting agendas, blog ideas, and checklist drafts.

## How to use it
1. Paste the list you want to convert, with one item per line or items separated by commas or tabs.
2. Choose the input separator and output format: CSV, Markdown table, JSON array, or numbered list.
3. Turn on cleanup options if needed, such as removing blank lines, trimming spaces, or removing duplicate items.
4. Press `Convert list` and review the result.
5. Use the copy button to paste it into a document, spreadsheet, Notion page, README, or another workspace.

## Especially useful when
### 1) Moving a notes list into a spreadsheet
Convert a plain line list to CSV and copy it into a spreadsheet or table editor more easily.

### 2) Making a table for a README or blog post
Turn a list of items into a Markdown table without manually writing every row and separator line.

### 3) Preparing developer docs or automation inputs
Convert a list into a JSON array to quickly prepare simple configuration values, test data, or sample input.

### 4) Reworking comma-separated candidate lists
When someone sends `A, B, C` in chat, split it by comma and turn it into a numbered list or JSON array without manual cleanup.

## Related tools
- Clean pasted line breaks first: [Text Line Break Cleaner]({{ '/en/tools/text-line-break-cleaner/' | relative_url }})
- Organize multiple links before converting: [Link List Cleaner]({{ '/en/tools/link-list-cleaner/' | relative_url }})
- Change English letter case formats too: [Case Converter]({{ '/en/tools/case-converter/' | relative_url }})

## FAQ
### Are items with commas converted correctly to CSV?
Yes. Items containing commas, quotes, or line breaks are wrapped in quotes and internal quotes are escaped according to CSV rules.

### How are duplicate items handled?
When you turn on `Remove duplicates`, the tool keeps only one copy of items that match after cleanup. It preserves the original order as much as possible.

### Can I convert a very long list?
Input is limited to 30,000 characters, and the browser converts the first 1,000 items at a time to avoid freezing. Split longer lists into batches.

### Is it safe to paste sensitive lists?
The tool does not send your input to a server, but it is still safer not to paste highly sensitive information such as account details or personal data unless necessary.

## Summary
The List Format Converter is a **converter-style tool that turns plain line lists into CSV, Markdown tables, JSON, and numbered lists**.
Because the previous release was generator-style and the one before that was checker-style, this adds a text conversion interaction rather than another calculator, keeping the recent publishing flow varied.
