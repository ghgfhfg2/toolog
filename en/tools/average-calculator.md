---
layout: tool
title: Average Calculator | Mean, Median, Standard Deviation & Comma Modes
description: Calculate mean, median, sum, population standard deviation and quartiles. Choose comma or line separators, review ignored entries and validate number limits in your browser.
lang: en
permalink: /en/tools/average-calculator/
canonical_url: /en/tools/average-calculator/
category: data
category_label: Data/Math
thumbnail: /assets/thumbs/en/average-calculator.svg
image:
  path: /assets/thumbs/en/average-calculator.svg
  alt: Average calculator preview
tool_key: average-calculator
keywords: [average calculator, mean calculator, median calculator, standard deviation calculator, quartile calculator, number list stats]
related_tools: [percent-calculator, average-speed-calculator, unit-converter, text-counter]
faq:
  - q: Why are the results blank or unavailable to copy?
    a: Empty input leaves the results as dashes. If no valid numbers remain or an input limit is exceeded, results are cleared and copying is disabled. Check the status message, correct the list, or load an example.
  - q: How should I input numbers?
    a: You can separate numbers by commas, spaces, or line breaks. Values like 1,000 and $2,500 are also recognized as numbers.
  - q: Are decimals and negative values supported?
    a: Yes. The calculator supports decimals and negative numbers.
  - q: How is median calculated?
    a: Values are sorted first. For even counts, the median is the average of the two middle values.
  - q: Can I check standard deviation and quartiles?
    a: Yes. The tool shows population standard deviation plus Q1 and Q3 from the sorted values.
  - q: What happens if text is mixed with numbers?
    a: Invalid entries are rejected as whole entries and counted as ignored. Empty entries are skipped without increasing the ignored count. Valid numbers are still calculated.
  - q: Does 1,234 mean two values?
    a: Auto mode treats it as 1234. Select every comma to calculate 1 and 234 as separate values.
  - q: What limits and standard deviation method are used?
    a: Up to 5,000 nonempty entries and 100,000 characters are allowed. Each value must be between -1 quadrillion and 1 quadrillion. Invalid entries count toward the entry limit. Standard deviation uses the population formula. For odd-sized lists, Q1 and Q3 are medians of the lower and upper halves excluding the overall median. For one value, both quartiles equal that value and deviation is zero. Results are rounded to eight decimal places; tiny nonzero results use scientific notation.
alternate_urls:
  ko: /tools/average-calculator/
  en: /en/tools/average-calculator/
  ja: /ja/tools/average-calculator/

---

## Quick stats from a number list
Paste or type scores, expenses, survey values, or measurements and get core statistics immediately:
- Count
- Sum
- Mean
- Median
- Minimum / Maximum / Range
- Q1 / Q3
- Population standard deviation

An average can hide outliers: compare it with the median, range, quartiles, and population standard deviation. Values are processed locally in your browser. Currency prefixes are accepted as formatting only; they do not convert currencies or make mixed currencies comparable.

## Key features
- Choose **Auto (keep thousands commas)**, **Every comma separates values**, or **One number per line** to avoid ambiguous input
- Mean, median, sum, minimum, maximum, range, quartiles, standard deviation, and count in one result panel
- Decimal and negative number support for grades, balances, measurements, and survey responses
- Thousands separators and simple currency-formatted values such as `$1,200`
- Whole-entry validation for text, dates, percentages, malformed numbers, and non-finite values; empty entries are skipped without increasing the ignored count
- Copyable result summary for reports, class records, expense checks, and quick data reviews

## How to use
1. Paste or type your number list, or select **Load example** to try a sample.
2. Choose the separator before interpreting the results. Auto treats `1,234` as one value; **Every comma separates values** treats it as two. Use **One number per line** for a spreadsheet column.
3. Check the live statistics and ignored-entry count. Remove labels or invalid entries and confirm that the valid count matches your intended dataset.
4. Use **Copy result** to share a valid summary. **Reset** clears the list and restores Auto mode.

## Related tools
- Compare ratios or changes: [Percent Calculator]({{ '/en/tools/percent-calculator/' | relative_url }})
- Average pace or travel records: [Average Speed Calculator]({{ '/en/tools/average-speed-calculator/' | relative_url }})
- Normalize values first: [Unit Converter]({{ '/en/tools/unit-converter/' | relative_url }})
- Count text length before pasting labels: [Text Counter]({{ '/en/tools/text-counter/' | relative_url }})

## FAQ
### How should I input numbers?
Use commas, spaces, tabs, or line breaks. For example, both `12, 18, 30` and one number per line work. Values such as `1,000` and `$2,500` are treated as numbers.

### Are decimals and negative values supported?
Yes. Values such as `-2.5` and `3.14` are included in the average, median, sum, and range calculations.

### How is median calculated?
The calculator sorts the values first. If there is an even number of values, it averages the two middle values.

### Can I check standard deviation and quartiles?
Yes. Standard deviation is calculated as population standard deviation, and Q1/Q3 are the medians of the lower and upper halves of the sorted list.

### What happens if text is mixed with numbers?
Invalid entries are rejected in full and included in the ignored-entry count; blank entries are simply skipped. For example, `12kg` is not converted to `12`. As long as valid numbers remain and the limits are met, the calculation continues.

## Comma separators and invalid entries
Auto mode reads 1,234 as the single number 1234. Select every comma to calculate 1 and 234 separately. Use one number per line for spreadsheet columns. Dates, 12kg, 10%, and 1.2.3 are ignored as whole entries, never partially extracted. Currency prefixes ₩, $, ¥, €, and £ are supported.

### Does 1,234 mean two values?
Auto mode treats it as `1234` (mean `1234`, count `1`). **Every comma separates values** treats it as `1` and `234` (mean `117.5`, count `2`). Spaces and line breaks also separate values in the comma mode.

### What limits and standard deviation method are used?
Up to 5,000 nonempty entries and 100,000 characters are allowed. Each value must be between -1 quadrillion and 1 quadrillion. Invalid entries count toward the entry limit.

Standard deviation uses the population formula. For odd-sized lists, Q1 and Q3 are medians of the lower and upper halves excluding the overall median. For one value, both quartiles equal that value and deviation is zero. Results are rounded to eight decimal places; tiny nonzero results use scientific notation.

## Empty input, errors, and copying
An empty list shows dashes rather than a zero average. If every entry is invalid, the status explains that there are no calculable numbers. Exceeding the character or nonempty-entry limit, or entering a numeric value outside ±1 quadrillion, clears the results rather than calculating a partial list. **Copy result** stays disabled until a valid result is available. Correct the input or use **Load example** to start again.

### Why are the results blank or unavailable to copy?
Check the status message for empty input, an all-invalid list, or an exceeded limit. Remove invalid entries, reduce the list, or correct out-of-range values. If automatic copying fails, select and copy the displayed values manually.
