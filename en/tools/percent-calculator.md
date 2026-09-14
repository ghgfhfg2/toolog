---
layout: tool
title: Percent Calculator | Percentage, Ratio & Change Rate
description: Calculate a percentage of a number, what percent one value is of another, and percentage increase or decrease with formulas, examples, and input checks.
lang: en
permalink: /en/tools/percent-calculator/
canonical_url: /en/tools/percent-calculator/
category: calculator
category_label: Math/Percentages
thumbnail: /assets/thumbs/percent-calculator.svg
tool_key: percent-calculator
keywords: [percent calculator, percentage calculator, rate of change, discount rate, ratio]
related_tools: [discount-calculator, profit-margin-calculator, vat-calculator]
faq:
  - q: How do I calculate a discount percentage?
    a: Choose the percentage-of mode, enter the original price as the base value and the discount rate as the percentage.
  - q: How do I calculate month-over-month sales growth?
    a: Choose Percentage change, then enter the previous month as the previous value and the current month as the current value.
  - q: Why can’t percentage change start from zero?
    a: The percentage-change formula divides by the previous value, so a zero baseline has no defined percentage change.
  - q: Why is a negative previous value rejected?
    a: Percentage change from a negative baseline is context-dependent and can be misleading, so this general calculator requires a positive previous value.
alternate_urls:
  ko: /tools/percent-calculator/
  en: /en/tools/percent-calculator/
  ja: /ja/tools/percent-calculator/
---

## Percent calculator for percentages, ratios, and change rates
Calculate a discount amount, a part-to-whole percentage, or month-over-month growth on one screen. Calculations run locally in your browser, and your values are not sent anywhere.
- Calculate **A% of B**
- Calculate **A is what percent of B**
- Calculate **increase/decrease rate** from old value to new value

## Key features
- Three calculation modes for practical use
- Fast results as soon as values are entered
- Validation for blanks, invalid or oversized numbers, zero division, and ambiguous non-positive change baselines
- Mode-specific example, clear action, and copy button enabled only for valid results
- Clear output with percentage and difference values

## How to use
1. Choose the calculation that matches your question.
2. Enter the base and percentage, the part and whole, or the previous and current values.
3. Review the main percentage, supporting value, difference, and increase/decrease status.
4. Use the example button to check the flow, copy a valid result, or clear all values to start again.

## Formulas and input rules
- **A% of B:** `B × A ÷ 100`
- **A is what percent of B:** `A ÷ B × 100` (B cannot be zero)
- **Percentage change:** `(current - previous) ÷ previous × 100`

For an unambiguous general result, percentage change requires a previous value greater than zero. A zero baseline is undefined, while a negative baseline needs context-specific interpretation. Results display up to six decimal places.

## Common examples
### Calculate a discount amount
For a list price of 129,000 and a 15% discount, the discount amount is 19,350.

### Calculate share of total sales
If one product generates 420 out of 1,200 in total sales, its share is 35%.

### Calculate month-over-month growth
If the previous month was 80 and the current month is 100, the change rate is +25%.

## Related tools
- Sale price calculation: [Discount Calculator]({{ '/en/tools/discount-calculator/' | relative_url }})
- Compare margin and markup: [Profit Margin Calculator]({{ '/en/tools/profit-margin-calculator/' | relative_url }})
- Tax split and total: [VAT Calculator]({{ '/en/tools/vat-calculator/' | relative_url }})

## FAQ
### How do I calculate a discount percentage?
Choose `A% of B`, enter the original price as the base value and the discount rate as the percentage. The main result is the discount amount.

### How do I calculate month-over-month sales growth?
Choose `Rate of change`, enter the previous month as the previous value and the current month as the current value. The calculator shows the percentage increase or decrease and the absolute difference.

### Why can’t percentage change start from zero?
The formula divides by the previous value, so percentage change from zero is undefined. Compare the absolute difference instead.

### Why is a negative previous value rejected?
Moving between negative and positive values can reverse the intuitive sign of a percentage. Use a domain-specific method for losses, deficits, or temperatures.

## Summary
Use this percent calculator for discount amounts, part-to-whole ratios, and percentage increase or decrease, with formulas, examples, validation, and clear result states.
