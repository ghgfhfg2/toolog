---
layout: tool
title: Discount Calculator | Sale Price, Coupon, Quantity & Total
description: Calculate sale price, per-item coupon savings, quantity total, shipping, effective item discount, and the rate needed to reach a target price.
lang: en
permalink: /en/tools/discount-calculator/
canonical_url: /en/tools/discount-calculator/
category: calculator
category_label: Shopping/Finance
thumbnail: /assets/thumbs/discount-calculator.svg
image:
  path: /assets/thumbs/discount-calculator.svg
  alt: Discount calculator preview
tool_key: discount-calculator
keywords: [discount calculator, final price, coupon calculator, sale price, effective discount]
related_tools: [percent-calculator, vat-calculator, loan-calculator]
alternate_urls:
  ko: /tools/discount-calculator/
  en: /en/tools/discount-calculator/
  ja: /ja/tools/discount-calculator/
faq:
  - q: Is the coupon applied before or after the percentage discount?
    a: This calculator applies the percentage discount first, then deducts the fixed coupon from each item. Check the store because coupon rules can differ.
  - q: Is shipping included in the effective discount rate?
    a: No. Shipping is added once to the checkout total, while the effective item discount compares the list price with the discounted item price.
  - q: Can I reverse-calculate the discount needed for a target price?
    a: Yes. Select target-price mode and enter the list price and desired per-item selling price.
---

## Discount calculator for sale price and checkout total
Use this percentage-off calculator when a sale also includes a fixed coupon, multiple items, or shipping. It shows:
- Base discount rate
- Per-item coupon savings
- Quantity total and one-time shipping
- Effective item discount excluding shipping

It also reverse-calculates the discount rate required for a target selling price.

## Key features
- Standard discount mode and target-price reverse mode
- Instant update for final payable amount
- Effective discount rate output
- Field-specific checks for blanks, negatives, fractional quantity, oversized values, and out-of-range rates

## How to use
1. Choose calculation mode.
2. Enter list price and discount/coupon values.
3. Add quantity and shipping if needed.
4. Review final amount and discount summary.

Blank optional fields use coupon 0, quantity 1, and shipping 0. The coupon is deducted from **each item** after the percentage discount.

## Formula and assumptions
- Discounted unit price = `list price × (1 - discount rate) - per-item coupon`
- Final checkout total = `discounted unit price × quantity + shipping`
- Effective item discount = `(list price - discounted unit price) ÷ list price × 100`

Coupon stacking, minimum order requirements, maximum coupon savings, taxes, and store-specific rounding are not modeled. Confirm the actual checkout conditions before purchasing.

## FAQ
### Is the coupon applied before or after the percentage discount?
The percentage discount is applied first, then the fixed coupon is deducted from every item.

### Is shipping included in the effective discount rate?
No. Shipping is included only in the final checkout total.

### Can I reverse-calculate the discount needed for a target price?
Yes. Choose target-price mode and enter a list price and target per-item price.

## Related tools
- Percentage math: [Percent Calculator]({{ '/en/tools/percent-calculator/' | relative_url }})
- Tax-included totals: [VAT Calculator]({{ '/en/tools/vat-calculator/' | relative_url }})
- Payment planning: [Loan Calculator]({{ '/en/tools/loan-calculator/' | relative_url }})
