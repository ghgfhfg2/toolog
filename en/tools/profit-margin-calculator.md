---
layout: tool
title: Profit Margin Calculator | Exact Target Price & Markup
description: Calculate cost ratio, profit margin, profit and markup in KRW. Preserve decimal amount differences and round target selling prices upward exactly to whole KRW. Includes input limits, loss warnings and zero-cost handling.
lang: en
permalink: /en/tools/profit-margin-calculator/
canonical_url: /en/tools/profit-margin-calculator/
category: calculator
category_label: Finance/Business
thumbnail: /assets/thumbs/profit-margin-calculator.svg
image:
  path: /assets/thumbs/profit-margin-calculator.svg
  alt: Profit margin calculator thumbnail
tool_key: profit-margin-calculator
keywords:
- profit margin calculator
- cost ratio calculator
- markup calculator
- pricing calculator
- target margin price
- gross margin
related_tools:
- percent-calculator
- discount-calculator
- vat-calculator
faq:
- q: What's the difference between cost ratio and margin ratio?
  a: Cost ratio is cost divided by revenue, while margin ratio is profit divided by revenue. They add up to 100%.
- q: How do I calculate selling price for a 30% target margin?
  a: Use selling price = cost ÷ (1 - target margin). If cost is 7,000 KRW and target margin is 30%, the minimum selling price is 10,000 KRW.
- q: Can I use VAT-included values?
  a: Yes, as long as both revenue and cost use the same tax basis (both VAT-included or both VAT-excluded).
- q: Why are profit margin and markup different?
  a: Margin divides profit by sales, while markup divides profit by cost. With sales of 10,000 KRW and cost of 7,000 KRW, margin is 30% and markup is about 42.86%.
- q: What are the input limits and target price rounding rules?
  a: Sales must be positive; cost may be zero. Each amount supports up to 1 quadrillion KRW and 2 decimal places. Optional target margin supports 0–99.9% and 4 decimal places; leave it blank to skip the target price. Use plain numbers without commas or exponents. Integer-based arithmetic preserves amount differences and computes exact upward rounding even for large prices. Only displayed percentages round to 2 decimals.
- q: What is the target price when cost is zero?
  a: A zero selling price has undefined margin, so the minimum positive price of 1 KRW is suggested. The margin is then 100%; markup is not calculated because cost is zero. This estimate does not include platform minimum payments, fees, tax or labor unless you include them in cost.
alternate_urls:
  ko: /tools/profit-margin-calculator/
  en: /en/tools/profit-margin-calculator/
  ja: /ja/tools/profit-margin-calculator/
---

## Profit margin and cost ratio calculator
Use this calculator when setting a product, menu, or service price or reviewing a sale. Enter sales and cost to see **profit, cost ratio, profit margin, and markup on cost**. Add an optional target margin to calculate the minimum selling price, and get a clear warning when the current price produces a loss.

## Key features
- Real-time **profit, cost ratio, profit margin, and markup** calculations
- A minimum selling price rounded up to the next whole KRW for a 0% to 99.9% target margin
- Clear guidance for missing values, negative values, out-of-range targets, and excessively large amounts
- Retail and loss examples, clear-all action, and a copyable result summary

## Formulas and input assumptions
- **Profit** = sales - cost
- **Cost ratio** = cost ÷ sales × 100
- **Profit margin** = profit ÷ sales × 100
- **Markup** = profit ÷ cost × 100 (not calculated when cost is zero)
- **Target price** = cost ÷ (1 - target margin)

Include any variable costs that matter to your pricing decision, such as packaging or marketplace fees. Keep sales and cost on the same VAT basis. The target price is rounded up to a whole KRW so the resulting margin meets or exceeds the selected target; it remains an estimate rather than accounting or tax advice.

## How to use it
1. Enter the current selling price and total cost in Korean won (KRW), using plain numbers without commas. You can also load a retail or loss example.
2. Optionally enter a target margin from 0% to 99.9%, with up to four decimal places. Leave it blank if you do not need a target selling price.
3. Review profit or loss, ratios, markup, and the minimum target price. Copy the summary, which includes your inputs, into a pricing note. Clear all inputs to start again.

## Missing inputs, errors, and result messages
- Enter both sales and cost before copying a result. Missing or invalid inputs show guidance instead of leaving an old calculation available to copy.
- Sales must be greater than zero; cost can be zero. Use at most two decimal places and no more than 1,000,000,000,000,000 KRW per amount. Negative amounts, commas, exponents, and excess decimal places are not accepted.
- A negative profit is a loss, not a calculation error. Equal sales and cost mean break-even. When cost is zero, markup shows N/A because division by zero is undefined; the minimum target price is 1 KRW.
- If automatic copying is unavailable, select and copy the displayed result text manually.

## Related tools
- [Percent Calculator]({{ '/en/tools/percent-calculator/' | relative_url }})
- [Discount Calculator]({{ '/en/tools/discount-calculator/' | relative_url }})
- [VAT Calculator]({{ '/en/tools/vat-calculator/' | relative_url }})

## Frequently asked questions
### What's the difference between cost ratio and margin ratio?
Cost ratio divides cost by sales; margin divides profit by sales. When cost is the only deduction, the two percentages add up to 100%.

### How do I calculate a selling price for a 30% target margin?
Use `selling price = cost ÷ (1 - 0.30)`. For example, a cost of 7,000 KRW requires a minimum selling price of 10,000 KRW.

### Why are profit margin and markup different?
Their denominators differ. With sales of 10,000 KRW and cost of 7,000 KRW, profit is 3,000 KRW, margin is 30%, and markup is about 42.86%.

### Can I enter VAT-included prices?
Yes. Use the same basis for both sales and cost—either both VAT-included or both VAT-excluded.

## Input limits and exact target prices
Sales must be positive; cost may be zero. Each amount supports up to 1 quadrillion KRW and 2 decimal places. Optional target margin supports 0–99.9% and 4 decimal places; leave it blank to skip the target price. Use plain numbers without commas or exponents. Integer-based arithmetic preserves amount differences and computes exact upward rounding even for large prices. Only displayed percentages round to 2 decimals.

Sales of 1,000,000,000,000,000 KRW minus cost of 999,999,999,999,999.99 KRW leaves 0.01 KRW, not zero. Cost of 7,000 KRW and a 30% target margin gives a 10,000 KRW target; zero cost gives a minimum 1 KRW. All amounts use KRW, not currency conversion. This is gross profit, not net income after all fixed expenses.

### What is the target price when cost is zero?
A zero selling price has undefined margin, so the minimum positive price of 1 KRW is suggested. The margin is then 100%; markup is not calculated because cost is zero. This estimate does not include platform minimum payments, fees, tax or labor unless you include them in cost.
