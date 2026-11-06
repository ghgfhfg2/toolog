---
layout: tool
title: Tip Calculator | Restaurant Tips, Bill Split & Exact Settlement
description: Calculate restaurant tips and totals with cent-accurate rounding. Compare the per-person average with an exact-total settlement split, include fees, and copy results.
lang: en
permalink: /en/tools/tip-calculator/
canonical_url: /en/tools/tip-calculator/
category: calculator
category_label: Calculator/Lifestyle
thumbnail: /assets/thumbs/tip-calculator.svg
image:
  path: /assets/thumbs/tip-calculator.svg
  alt: Tip calculator preview
tool_key: tip-calculator
keywords:
- tip calculator
- US restaurant tip calculator
- exact bill split
- gratuity calculator
- split bill
- per person bill
- restaurant tip
related_tools:
- percent-calculator
- discount-calculator
- vat-calculator
faq:
- q: Should I use percentage mode or fixed-tip mode?
  a: Use percentage mode when the tip rate is known, and fixed mode when you already decided an exact tip amount.
- q: Can I include tax and service fee in the tip base?
  a: Yes. You can choose whether tip is calculated from subtotal only or from subtotal+tax+service.
- q: What tip percentage should I use?
  a: Practices vary by place and service. Check the receipt for an included service charge and confirm local expectations; preset rates are conveniences, not recommendations.
- q: How can I split a bill without a rounding mismatch?
  a: 'Round the tip half up to 2 decimal places before adding it to the bill. The rounded per-person average may not sum to the bill. Settlement distributes the remaining 0.01 units among some people: 126.25 split between 2 people is 63.12 and 63.13. Amounts and rates allow 2 decimal places, without commas or exponents. No currency conversion or currency-specific payment increments are applied.'
alternate_urls:
  ko: /tools/tip-calculator/
  en: /en/tools/tip-calculator/
  ja: /ja/tools/tip-calculator/
---

## Restaurant tip calculator and exact bill split
Calculate the tip, final bill, rounded per-person average, and a settlement split that adds up to the total. Use it for restaurant bills while traveling or for shared payments with an optional tip.

## Key features
- **Percentage or fixed-tip mode**, with 10%, 15%, 18%, and 20% quick presets.
- **Choose the tip base**: subtotal only, or subtotal plus tax and service fees.
- **Two-decimal rounding** for the tip and an exact-total settlement distribution.
- **Real-time validation** for missing values, invalid formats, and out-of-range entries.
- **Copy the result**, including the settlement split and calculation assumptions.

## How to calculate and split a restaurant bill
1. Enter the subtotal. Add tax and service fees if applicable; leave those optional fields blank to treat them as zero.
2. Choose a percentage or a fixed tip. For percentage mode, choose whether tax and service fees belong in the tip base.
3. Enter a whole-number party size from 1 to 1,000.
4. Compare the tip, total, and rounded per-person average. Use the **settlement split**, not the average multiplied by the party size, to collect the exact total.
5. Copy the summary for your group. Check the receipt for service charges before adding another tip.

## Rounding and settlement example
With a subtotal of 100, tax of 8.25, no service fee, and an 18% tip on the subtotal, the tip is 18 and the total is 126.25. The rounded average for two people is 63.13, but collecting that amount twice would collect 126.26. The settlement split instead assigns **63.12 to one person and 63.13 to the other**.

The tip is rounded half up to two decimal places before it is added to the bill. Settlement distributes remaining 0.01 units among some people so the shares add up to the displayed total.

> Use one currency consistently for all entries. This tool does not convert currencies or apply currency-specific cash increments. A 0.01-unit split may not be payable in currencies such as JPY or KRW; check the receipt and local payment rules.

## Empty results and input errors
A blank subtotal shows an input prompt rather than a calculated result. Invalid inputs clear the results and disable copying; correct the highlighted field to recalculate. Use ordinary numbers with at most two decimal places, without thousands separators or scientific notation. Amounts must be from 0 to 1 trillion, tip rates from 0% to 100%, and party size a whole number from 1 to 1,000. Blank optional tax and service fees count as zero.

## FAQ
### Should I use percentage mode or fixed-tip mode?
Use percentage mode when you know the tip rate, or fixed-tip mode when you have already decided the exact tip amount.

### Can tax and service fees be included in the tip base?
Yes. Choose the subtotal-only option or the option that includes tax and service fees. These charges still form part of the final bill even if you exclude them from the percentage tip base.

### What tip percentage should I use at a US restaurant?
Practices vary by location and service. Check whether the receipt already includes a service charge and confirm local expectations. The 10%, 15%, 18%, and 20% presets are calculation shortcuts, not recommendations.

### How can I split a bill without a rounding mismatch?
Round the tip half up to two decimal places before adding it to the bill. The displayed per-person average is rounded, so multiplying it may not reproduce the total. Use the settlement distribution: 126.25 split between two people is 63.12 and 63.13. Amounts and rates accept up to two decimal places, without commas or exponents. Currency conversion and currency-specific payment increments are not applied.

## Related tools
- Percentage calculations: [Percent Calculator]({{ '/en/tools/percent-calculator/' | relative_url }})
- Discounted bills: [Discount Calculator]({{ '/en/tools/discount-calculator/' | relative_url }})
- Tax calculations: [VAT Calculator]({{ '/en/tools/vat-calculator/' | relative_url }})
