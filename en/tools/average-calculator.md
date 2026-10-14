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
  - q: How should I input numbers?
    a: You can separate numbers by commas, spaces, or line breaks. Values like 1,000 and $2,500 are also recognized as numbers.
  - q: Are decimals and negative values supported?
    a: Yes. The calculator supports decimals and negative numbers.
  - q: How is median calculated?
    a: Values are sorted first. For even counts, the median is the average of the two middle values.
  - q: Can I check standard deviation and quartiles?
    a: Yes. The tool shows population standard deviation plus Q1 and Q3 from the sorted values.
  - q: What happens if text is mixed with numbers?
    a: Non-number entries are ignored and the ignored count is shown with the result.
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

If labels, currency symbols, thousands separators, or stray text are mixed in, the calculator keeps the valid numbers, skips non-number entries, and shows how many were ignored.

## Key features
- Automatic number parsing with comma, space, tab, and line-break separators
- Mean, median, sum, minimum, maximum, range, quartiles, standard deviation, and count in one result panel
- Decimal and negative number support for grades, balances, measurements, and survey responses
- Thousands separators and simple currency-formatted values such as `$1,200`
- Ignored-entry count when text, blanks, or non-finite values are mixed into the list
- Copyable result summary for reports, class records, expense checks, and quick data reviews

## How to use
1. Paste or type your number list.
2. Check the live count, sum, mean, median, minimum, maximum, range, quartiles, and standard deviation.
3. If the ignored-entry count is not zero, review the original list for labels or extra text.
4. Use **Copy result** when you need to share the summary.

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
Text and blank entries are excluded from the calculation, and the ignored-entry count is shown in the result. As long as valid numbers remain, mean, median, and range are still calculated.


## Comma separators and invalid entries
Auto mode reads 1,234 as the single number 1234. Select every comma to calculate 1 and 234 separately. Use one number per line for spreadsheet columns. Dates, 12kg, 10%, and 1.2.3 are ignored as whole entries, never partially extracted. Currency prefixes ₩, $, ¥, €, and £ are supported.

### Does 1,234 mean two values?
Auto mode treats it as 1234. Select every comma to calculate 1 and 234 as separate values.

### What limits and standard deviation method are used?
Up to 5,000 nonempty entries and 100,000 characters are allowed. Each value must be between -1 quadrillion and 1 quadrillion. Invalid entries count toward the entry limit.

Standard deviation uses the population formula. For odd-sized lists, Q1 and Q3 are medians of the lower and upper halves excluding the overall median. For one value, both quartiles equal that value and deviation is zero. Results are rounded to eight decimal places; tiny nonzero results use scientific notation.
