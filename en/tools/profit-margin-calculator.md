---
layout: tool
title: Profit Margin Calculator | Exact Target Price & Markup
description: Calculate cost ratio, profit margin, markup and target selling price in KRW. Try retail, menu-cost and loss examples, and see why a 30% markup is not a 30% margin.
lang: en
permalink: /en/tools/profit-margin-calculator/
canonical_url: https://toolog.sooyadev.com/en/tools/profit-margin-calculator/
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

## Compare margin, cost ratio and markup on the same sale
A selling price of 10,000 KRW and a cost of 7,000 KRW leave 3,000 KRW: **70% cost ratio, 30% margin and approximately 42.86% markup**. Enter sales and cost above; an optional target margin also calculates the minimum whole-KRW selling price.

## Choose a consistent cost basis
Compare one product's price with that product's cost, or sales for a period with the cost of the goods sold in the same period. Do not mix one item's price with a month's purchases. Keep discounts, returns and the tax basis consistent. Adding packaging or transaction fees produces a margin after those included costs, not the same measure as gross margin based only on cost of goods sold. Rent, wages and taxes are not deducted automatically; the result is not net income.

## Three examples you can load above
The Retail, Menu and Loss buttons load these fictional KRW examples. They are not industry margin benchmarks.

| Example | Sales / cost (KRW) | Difference | Cost ratio / margin | Target → minimum price (KRW) |
| --- | --- | --- | --- | --- |
| Retail item | 10,000 / 7,000 | 3,000 | 70% / 30% | 30% → 10,000 |
| Menu ingredient comparison | 10,000 / 3,000 | 7,000 | 30% / 70% | 60% → 7,500 |
| Selling below cost | 8,000 / 10,000 | -2,000 | 125% / -25% | 20% → 12,500 |

The menu example has not deducted wages or rent. A low ingredient-cost ratio alone does not establish business profitability.

## A 30% markup is not a 30% margin
Adding 30% to a 7,000 KRW cost gives a 9,100 KRW price. Its margin is `2,100 / 9,100 × 100 ≈ 23.08%`. For a **30% margin**, use `7,000 / (1 - 0.30) = 10,000 KRW`.

- Difference = sales - cost
- Cost ratio = cost / sales × 100
- Margin = (sales - cost) / sales × 100
- Markup = (sales - cost) / cost × 100
- Target price = cost / (1 - target margin), rounded upward to whole KRW

At a 7,000 KRW cost and 35% target margin, the unrounded price is approximately 10,769.23 KRW, so the minimum whole-KRW price is **10,770 KRW**. This target is separate from the current selling price.

## Units and calculation limits
This is a KRW calculator, not a currency converter. Sales must be positive; cost can be zero. Enter plain amounts without commas, with up to two decimal places. The target margin is optional (0–99.9%); leave it blank to calculate current ratios only. Zero cost has no defined markup. Detailed maximum inputs appear beside the calculator.

Percentages display two decimals; target-price rounding uses the original inputs, not the displayed ratios. Processing stays in the browser. See [BDC's gross profit margin explanation](https://www.bdc.ca/en/articles-tools/entrepreneur-toolkit/templates-business-guides/glossary/gross-profit-margin-ratio) for the revenue/cost definition. The reverse-pricing calculation follows the formula above.

## Related calculations
Use the [VAT calculator]({{ '/en/tools/vat-calculator/' | relative_url }}) to separate the tax basis, the [discount calculator]({{ '/en/tools/discount-calculator/' | relative_url }}) for a discounted price, or the [percentage calculator]({{ '/en/tools/percent-calculator/' | relative_url }}) for changes in sales.
