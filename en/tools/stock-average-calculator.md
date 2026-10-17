---
layout: tool
title: Stock Average Calculator | Average Down & Target Shares
description: Calculate a new stock average, total cost, and the minimum extra whole shares for a target after your planned buy. Exact decimal-price arithmetic; excludes fees and taxes.
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
  - q: How are decimal prices and target shares handled?
    a: Enter KRW prices with up to 2 decimal places, without commas or exponents. Amounts use integer arithmetic and required shares round up. The displayed average rounds to 2 places, while target checks use unrounded amounts.
  - q: How is the new stock average cost calculated?
    a: The calculator adds current cost and planned purchase cost, then divides by the combined whole-share quantity.
  - q: Why can a target average be impossible?
    a: If the target is not already met, a buy price at or above the target cannot reach it with a finite additional purchase.
  - q: Are fees, taxes, and currency conversion included?
    a: No. This is a simple scenario estimate; add broker fees, taxes, spreads, and foreign-exchange costs separately.
  - q: Does the target calculation include my planned purchase?
    a: Yes. It applies the planned purchase first, then shows only the further whole shares needed at the same price. An already-met target needs 0 more shares.
alternate_urls:
  ko: /tools/stock-average-calculator/
  en: /en/tools/stock-average-calculator/
  ja: /ja/tools/stock-average-calculator/
---

## Calculate your average stock price before buying more
Use this **stock average calculator** to combine current holdings with a planned purchase, preview the new average cost, and estimate the minimum additional whole shares needed for a target average. All prices are in **KRW**, not USD; changing the page language does not convert currencies.

## What the calculator shows
- New average cost after the planned buy, total shares, and total invested amount.
- Minimum further whole shares at the same buy price, after applying your planned purchase.
- Clear guidance for missing inputs, invalid prices, oversized amounts, and unreachable targets.
- Results calculated in your browser without sending your inputs to a server.

## How to use it
### 1. Enter your current holdings
Enter a whole-share quantity of at least 1 and your current average cost in KRW. With no planned purchase, the results describe your current holdings.

### 2. Add a planned purchase (optional)
Enter the planned whole-share quantity and expected buy price. Results update immediately. To estimate target shares without committing to a planned quantity, leave that quantity blank and enter only the expected buy price.

### 3. Set a target average (optional)
Enter your target average price. The calculator applies any planned purchase first, then shows only the further shares needed at the same expected buy price. An already-met target needs 0 more shares.

### 4. Review or copy the results
Use **Load example** to try sample values, **Copy results** to save the summary, or **Clear** to reset. Copying is unavailable when inputs are invalid or target conditions are incomplete. If automatic copying fails, check your browser's clipboard permission.

## Input rules and empty-state guidance
- Start by entering both current holdings and average cost; empty fields show a prompt rather than a zero-cost result.
- Share quantities must be whole numbers. Current holdings must be 1–1,000,000,000; a planned quantity may be 0–1,000,000,000.
- Prices must be greater than 0 and no more than 1,000,000,000,000 KRW, with at most 2 decimal places. Do not use commas, exponent notation, or negative numbers.
- A planned quantity requires an expected buy price. A target also requires an expected buy price, even when no planned quantity is entered.
- Total invested amount must not exceed 1,000,000,000,000,000 KRW. Targets requiring more than 1,000,000,000 further shares show a limit warning.
- Fractional shares, commissions, taxes, spreads, and currency-conversion costs are not included. A cost basis is not a fee-inclusive break-even price.

## Worked example: average down from 50,000 KRW
Holding 100 shares at 50,000 KRW and buying 100 more at 40,000 KRW gives **200 shares, 9,000,000 KRW invested, and a 45,000 KRW average**.

For a target of 43,000 KRW, you need **134 further shares** at 40,000 KRW after that plan. The required quantity rounds up to a whole share; it is not the total planned purchase quantity.

## Frequently asked questions
### How is the new average cost calculated?
(Current invested amount + planned purchase cost) ÷ (current shares + planned shares). The result is a weighted average, not the simple average of two prices.

### How are decimal prices and target shares handled?
Enter KRW prices with up to 2 decimal places, without commas or exponents. Amounts use integer arithmetic and required shares round up. The displayed average rounds to 2 places, while target checks use unrounded amounts.

### Why is my target marked not achievable?
If the target is not already met, an expected buy price at or above that target cannot bring the average down to it with a finite additional purchase. Buying at one price moves the average toward that price, not below it.

### Does the target calculation include my planned purchase?
Yes. It first applies the entered planned purchase, then shows only the further quantity needed at the same expected price. If the current holdings or planned purchase already meet the target, the result is 0 further shares.

### Can I enter fractional shares?
No. This version calculates whole shares. For fractional-share trading, use your broker's order preview and its precision rules.

### Are fees, taxes, and currency conversion included?
No. Add broker fees, taxes, spreads, and foreign-exchange costs separately before placing an order. The calculator is a scenario estimate, not an investment recommendation.

## Related tools
- Check percentage changes: [Percent Calculator]({{ '/en/tools/percent-calculator/' | relative_url }})
- Compare purchase and selling margins: [Profit Margin Calculator]({{ '/en/tools/profit-margin-calculator/' | relative_url }})
- Estimate long-term growth: [Compound Interest Calculator]({{ '/en/tools/compound-interest-calculator/' | relative_url }})

## Summary
Compare your new average cost, total shares, total investment, and minimum target shares before buying more. Verify executable prices and actual transaction costs with your broker.
