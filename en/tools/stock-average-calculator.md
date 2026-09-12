---
layout: tool
title: Stock Average Calculator | Average Down & Target Price
description: Enter current shares, average cost, and a planned buy to calculate your new average price, total investment, and whole shares needed for a target average.
lang: en
permalink: /en/tools/stock-average-calculator/
canonical_url: /en/tools/stock-average-calculator/
category: calculator
category_label: Finance
thumbnail: /assets/thumbs/stock-average-calculator.svg
image:
  path: /assets/thumbs/stock-average-calculator.svg
  alt: Stock average calculator result preview
tool_key: stock-average-calculator
keywords: [stock average calculator, average down calculator, average cost, buy the dip calculator, target average price]
related_tools: [percent-calculator, profit-margin-calculator, compound-interest-calculator]
faq:
  - q: How is the new stock average cost calculated?
    a: The calculator adds current cost and planned purchase cost, then divides by the combined whole-share quantity.
  - q: Why can a target average be impossible?
    a: Buying repeatedly at one price moves the average toward that buy price but never below it, so the target must be above the expected buy price.
  - q: Are fees, taxes, and currency conversion included?
    a: No. This is a simple scenario estimate; add broker fees, taxes, spreads, and foreign-exchange costs separately.
alternate_urls:
  ko: /tools/stock-average-calculator/
  en: /en/tools/stock-average-calculator/
  ja: /ja/tools/stock-average-calculator/
---

## Calculate your average stock price before buying more
Use this **stock average calculator** to combine current shares and average cost with a planned purchase. It shows the new average cost, total shares, total invested amount, and the extra whole shares needed to reach a target average at the same expected buy price.

## How to use it
1. Enter current whole shares and average cost.
2. Optionally enter a planned buy quantity and expected price.
3. Add a target average to estimate how many more shares are required.

The calculator rejects blank pairs, negative values, fractional share quantities, oversized totals, and unreachable targets. It runs in your browser and does not include commissions, taxes, spreads, or FX costs.

## Example: averaging down from 50,000
If you hold 100 shares at 50,000 KRW and buy 100 more at 40,000 KRW, the new average is 45,000 KRW. Enter a 43,000 KRW target to see how many additional shares at 40,000 KRW would still be needed after that plan.

## Frequently asked questions
### Why is my target marked not achievable?
An average approaches the expected buy price but cannot cross it. A target at or below that buy price cannot be reached by buying more at the same price.

### Does the target calculation include my planned purchase?
Yes. It first applies the entered planned purchase, then shows only the further quantity needed at the same expected price.

### Can I enter fractional shares?
No. This version calculates whole shares. For fractional-share trading, use your broker's order preview and account for its precision rules.

## Related tools
- [Compound Interest Calculator]({{ '/en/tools/compound-interest-calculator/' | relative_url }})
- [Percent Calculator]({{ '/en/tools/percent-calculator/' | relative_url }})
- [Profit Margin Calculator]({{ '/en/tools/profit-margin-calculator/' | relative_url }})
