---
layout: tool
title: VAT Calculator | Reverse-Calculate Net, Gross, and 10% VAT
description: Calculate 10% VAT from net price or reverse-calculate it from gross total, with selectable whole-unit rounding for invoices and settlements.
lang: en
permalink: /en/tools/vat-calculator/
canonical_url: /en/tools/vat-calculator/
category: data
category_label: Data/Finance
thumbnail: /assets/thumbs/vat-calculator.svg
tool_key: vat-calculator
keywords: [vat calculator, net to gross, gross to net, tax calculator, invoice vat]
related_tools: [percent-calculator, profit-margin-calculator, discount-calculator]
alternate_urls:
  ko: /tools/vat-calculator/
  en: /en/tools/vat-calculator/
  ja: /ja/tools/vat-calculator/
faq:
  - q: What is the difference between net-based and gross-based calculation?
    a: Net-based calculation adds VAT to the pre-tax amount, while gross-based calculation splits a VAT-inclusive total into net price and VAT.
  - q: Can this calculator use a VAT rate other than 10%?
    a: This calculator currently supports a fixed 10% VAT rate. Check the applicable tax rules separately for zero-rated, exempt, or different-rate transactions.
  - q: How are fractional amounts handled?
    a: Choose round, floor, or ceil to match your settlement policy. In gross-based mode, the net price is rounded first and VAT is calculated as the remaining difference.
---

## VAT calculator for net-to-gross and gross-to-net checks
This free **VAT calculator** calculates VAT and gross total from a net price, or reverse-calculates net price and VAT from a VAT-inclusive gross total. Select round, floor, or ceil for whole-unit handling when checking invoices, quotes, and settlement amounts.

## Supported modes
- **Net-based**: net price → VAT + gross total
- **Gross-based**: gross total → net price + VAT
- **Whole-unit handling**: round, floor, or ceil
- **Copy results**: copy a summary of net price, VAT, and gross total

## How to use
### 1. Choose the calculation basis
Select net-based mode when you know the pre-tax amount, or gross-based mode when you know the VAT-inclusive total.

### 2. Enter the amount
Enter a whole number of zero or more. Results update automatically.

### 3. Choose rounding and review the result
Choose round, floor, or ceil to match your settlement policy, then review the net price, VAT, and gross total. In gross-based mode, the calculator handles the net price first and assigns the remaining difference to VAT so the entered total stays unchanged.

## Typical use cases
- Invoice and quotation drafting
- Payment reconciliation
- Sharing clear tax breakdown with partners

## Related tools
- Check the percentage itself: [Percent Calculator]({{ '/en/tools/percent-calculator/' | relative_url }})
- Compare selling price and margin: [Profit Margin Calculator]({{ '/en/tools/profit-margin-calculator/' | relative_url }})
- Verify a discounted price: [Discount Calculator]({{ '/en/tools/discount-calculator/' | relative_url }})

## FAQ
### What is the difference between net-based and gross-based calculation?
The starting amount is different. Confirm whether you are entering a pre-tax net price or a VAT-inclusive gross total.

### Can I calculate a VAT rate other than 10%?
This page calculates only the fixed 10% rate commonly used for standard taxable transactions. Check the applicable tax rules and documents separately for zero-rated, exempt, or different-rate transactions.

### How are fractional amounts handled?
Choose round, floor, or ceil to match your settlement policy. Before issuing an invoice or signing a contract, confirm the counterparty's rounding rule and final amount.

## Summary
Use the VAT calculator to split net price, VAT, and gross total quickly, compare whole-unit rounding methods, and reduce amount errors in invoices and settlements.
