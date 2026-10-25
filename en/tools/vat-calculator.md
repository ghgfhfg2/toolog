---
layout: tool
title: "VAT Calculator | Custom Rate, Net-to-Gross & Reverse VAT"
description: Calculate or reverse VAT at 0–100% with exact integer-based whole-unit rounding. Compare net price, VAT and gross total, then copy the breakdown and rounding method.
lang: en
permalink: /en/tools/vat-calculator/
canonical_url: /en/tools/vat-calculator/
category: data
category_label: Data/Finance
thumbnail: /assets/thumbs/vat-calculator.svg
tool_key: vat-calculator
keywords: [vat calculator, net to gross, gross to net, tax calculator, invoice vat, custom vat rate, reverse vat calculator, vat rounding]
related_tools: [percent-calculator, profit-margin-calculator, discount-calculator]
alternate_urls:
  ko: /tools/vat-calculator/
  en: /en/tools/vat-calculator/
  ja: /ja/tools/vat-calculator/
faq:
  - q: What is the difference between net-based and gross-based calculation?
    a: Net-based calculation adds VAT to the pre-tax amount, while gross-based calculation splits a VAT-inclusive total into net price and VAT.
  - q: Can this calculator use a VAT rate other than 10%?
    a: Yes. The default is 10%, and you can enter a rate from 0% to 100% with up to three decimal places.
  - q: How are fractional amounts handled?
    a: Choose round, floor, or ceil to match your settlement policy. In gross-based mode, the net price is rounded first and VAT is calculated as the remaining difference.
  - q: What amount limits and rounding rules apply?
    a: Use whole-unit amounts from 0 to 1,000,000,000,000,000 without commas, decimals or exponent notation. Rates allow three decimal places. Integer-based arithmetic handles rounding boundaries exactly; nearest rounding sends halves upward.
  - q: Why are the results blank or the copy button disabled?
    a: Enter a valid amount and rate first. Empty or invalid inputs clear the results and disable copying. Zero amounts and a 0% rate are valid. If automatic copying fails, copy the displayed breakdown manually.
---

## VAT calculator for net-to-gross and gross-to-net checks
This free **VAT calculator** calculates VAT and gross total from a net price, or reverse-calculates net price and VAT from a VAT-inclusive gross total. Use the default 10% or enter a custom 0–100% rate, then select round, floor, or ceil for whole-unit handling.

## Supported modes
- **Net-based**: net price → VAT + gross total
- **Gross-based**: gross total → net price + VAT
- **Custom VAT rate**: 10% by default, or 0–100% with up to three decimal places
- **Whole-unit handling**: round, floor, or ceil
- **Copy results**: copy a summary of net price, VAT, and gross total

## How to use
### 1. Choose the calculation basis
Select net-based mode when you know the pre-tax amount, or gross-based mode when you know the VAT-inclusive total.

### 2. Enter the amount
Enter a whole-unit amount from 0 to 1,000,000,000,000,000 without commas, decimal points, or exponent notation. In gross-based mode, enter the VAT-inclusive total. Results update automatically; an amount of 0 and a VAT rate of 0% are both supported.

### 3. Choose rounding and review the result
Enter the applicable VAT rate, choose round, floor, or ceil to match your settlement policy, then review the net price, VAT, and gross total. In gross-based mode, the calculator handles the net price first and assigns the remaining difference to VAT so the entered total stays unchanged.

### 4. Copy the breakdown or reset
**Copy result** includes the calculation basis, rounding method, net price, VAT, and gross total. **Load 110,000 example** sets gross-based mode, 10%, and rounding to nearest. **Clear** empties the amount and restores net-based mode, 10%, and rounding to nearest.

## Empty results and input errors
- A blank amount shows dashes rather than a calculated zero; enter an amount to begin.
- Invalid or out-of-range inputs clear the previous results and disable copying. Check the status message, remove commas or decimal points from the amount, and keep the rate within 0–100% with no more than three decimal places.
- If automatic copying is unavailable, select and copy the displayed breakdown manually. Do not treat a failed copy as a saved result.

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

### Can this calculator use a VAT rate other than 10%?
Yes. The default is 10%, and you can enter a rate from 0% to 100% with up to three decimal places. Check the applicable rules and documents separately for zero-rated, exempt, or different-rate transactions.

### How are fractional amounts handled?
Choose round, floor, or ceil to match your settlement policy. Before issuing an invoice or signing a contract, confirm the counterparty's rounding rule and final amount.

### Why are the results blank or the copy button disabled?
Empty or invalid inputs clear the result and disable copying until both amount and rate are valid. Zero is a valid amount, and 0% is a valid rate. Check the status message for the field to correct. If automatic copying fails, copy the displayed breakdown manually.

## Summary
Use the VAT calculator to split net price, VAT, and gross total quickly, compare whole-unit rounding methods, and reduce amount errors in invoices and settlements.

## Formulas and rounding examples
Net-based VAT = net price × rate ÷ 100, rounded to whole units. Gross-based net price = gross total × 100 ÷ (100 + rate), rounded first; VAT is the gross total minus that net price.

**625 × 36.16% is exactly 226**, including when rounding down. At 10%, an amount of 5 produces VAT of 0.5; nearest and upward rounding give 1, while downward rounding gives 0. A gross total of 110,000 at 10% gives net price 100,000 and VAT 10,000.

Scaled integer arithmetic avoids binary floating-point one-unit errors. The example button sets gross mode, 10% and nearest rounding; Clear restores net mode, 10% and nearest rounding. Copied results include the calculation basis and rounding method.

### What amount limits and rounding rules apply?
Enter whole units from 0 to 1,000,000,000,000,000 without commas, decimals or exponent notation. Rates range from 0 to 100% with up to three decimal places. Nearest rounding sends exact halves upward. Calculations run in your browser. This is a single-amount, whole-unit checker, not a currency-cent calculator or an official tax filing tool; line-item aggregation policies may differ.
