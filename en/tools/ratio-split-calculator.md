---
layout: tool
title: Ratio Split Calculator | Split a total amount by custom ratios
description: Enter a total amount and custom ratios to calculate each allocation, percentage share, and final rounding adjustment in one place.
lang: en
permalink: /en/tools/ratio-split-calculator/
category: calculator
category_label: Life/Settlement
thumbnail: /assets/thumbs/en/ratio-split-calculator.svg
image:
  path: /assets/thumbs/en/ratio-split-calculator.svg
  alt: Ratio split calculator thumbnail
tool_key: ratio-split-calculator
keywords: [ratio split calculator, amount allocation calculator, budget split by ratio, proportional split calculator, percentage allocation tool]
related_tools: [percent-calculator, split-bill-calculator, unit-price-calculator]
faq:
  - q: Do my ratios need to add up to 100?
    a: No. Relative ratios like 2:3:5 work fine. The tool automatically normalizes the total.
  - q: Can rounding make the total inaccurate?
    a: The tool applies the selected rounding unit and then adjusts the last item so the final total still matches exactly.
  - q: Can I enter percentages instead of ratios?
    a: Yes. Values like 50, 30, 20 work exactly the same because only the relative size matters.
---

## What this tool does
When you need to split a budget, profit share, or shared cost by a predefined ratio, the annoying part is converting the ratio into actual money.

This tool helps you quickly calculate:
- each allocation amount
- each item’s percentage share
- rounding by unit
- the final last-item adjustment

## How it works
1. Add up all ratio values.
2. Convert each item into a share of the total.
3. Multiply the total amount by each share.
4. Apply the selected rounding unit.
5. Adjust the last item so the final sum still matches the original total.

That makes it useful for budget planning, settlement, revenue sharing, and cost allocation.

## Example
- Total amount: 1,000,000 KRW
- Ratios: 5, 3, 2
- Rounding unit: 100 KRW

→ Item A: **500,000 KRW**
→ Item B: **300,000 KRW**
→ Item C: **200,000 KRW**

## Good companion tools
- For percentage and change calculations: [Percent Calculator]({{ '/en/tools/percent-calculator/' | relative_url }})
- For equal split by people: [Split Bill Calculator]({{ '/en/tools/split-bill-calculator/' | relative_url }})
- For unit value comparison: [Unit Price Calculator]({{ '/en/tools/unit-price-calculator/' | relative_url }})

## FAQ
### Do I need item names?
No. Names are optional, but using them makes the copied result easier to read.

### Is this useful for budget planning?
Yes. It is especially practical when a total budget must be allocated across departments, channels, or partners.

### Why is the last item adjusted?
Because rounding can create a small difference. The final item absorbs that difference so the total remains exact.
