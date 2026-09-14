---
layout: tool
title: Percent Calculator | Percentage, Ratio & Change Rate
description: Calculate a percentage of a number, what percent one value is of another, and percentage increase or decrease with formulas, examples, and input checks.
lang: en
permalink: /en/tools/percent-calculator/
canonical_url: /en/tools/percent-calculator/
category: calculator
category_label: Math/Finance
thumbnail: /assets/thumbs/percent-calculator.svg
tool_key: percent-calculator
keywords: [percent calculator, percentage calculator, rate of change, discount rate, ratio]
related_tools: [discount-calculator, profit-margin-calculator, vat-calculator]
faq:
  - q: How do I calculate a discount percentage?
    a: Choose the percentage-of mode, enter the original price as the base value and the discount rate as the percentage.
  - q: Why can’t percentage change start from zero?
    a: The percentage-change formula divides by the previous value, so a zero baseline has no defined percentage change.
  - q: Why is a negative previous value rejected?
    a: Percentage change from a negative baseline is context-dependent and can be misleading, so this general calculator requires a positive previous value.
alternate_urls:
  ko: /tools/percent-calculator/
  en: /en/tools/percent-calculator/
  ja: /ja/tools/percent-calculator/
---

## Percent calculator for three common questions
Use one screen to solve three common percentage questions. Calculations run in your browser, and your values are not sent anywhere.
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
1. Choose a mode.
2. Enter your numbers.
3. Check percent result and difference.
4. Reuse for discounts, KPI changes, and report summaries.

## Formulas and input rules
- **A% of B:** `B × A ÷ 100`
- **A is what percent of B:** `A ÷ B × 100` (B cannot be zero)
- **Percentage change:** `(current - previous) ÷ previous × 100`

For an unambiguous general result, percentage change requires a previous value greater than zero. A zero baseline is undefined, while a negative baseline needs context-specific interpretation. Results display up to six decimal places.

## Common examples
- Discount amount from list price
- Product share of total sales
- Month-over-month growth rate

## Related tools
- Sale price calculation: [Discount Calculator]({{ '/en/tools/discount-calculator/' | relative_url }})
- Compare margin and markup: [Profit Margin Calculator]({{ '/en/tools/profit-margin-calculator/' | relative_url }})
- Tax split and total: [VAT Calculator]({{ '/en/tools/vat-calculator/' | relative_url }})

## FAQ
### Why can’t percentage change start from zero?
The formula divides by the previous value, so percentage change from zero is undefined. Compare the absolute difference instead.

### Why is a negative previous value rejected?
Moving between negative and positive values can reverse the intuitive sign of a percentage. Use a domain-specific method for losses, deficits, or temperatures.
