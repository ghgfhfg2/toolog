---
layout: tool
title: Jeonse vs Wolse Calculator | Compare Korea Rental Costs
description: Compare jeonse and wolse deposits, rent, opportunity cost, stay length, and one-time costs to estimate total cost, monthly-equivalent cost, and break-even rent.
lang: en
permalink: /en/tools/jeonse-vs-wolse-calculator/
canonical_url: /en/tools/jeonse-vs-wolse-calculator/
category: calculator
category_label: Real Estate
thumbnail: /assets/thumbs/en/jeonse-vs-wolse-calculator.svg
image:
  path: /assets/thumbs/en/jeonse-vs-wolse-calculator.svg
  alt: Comparison of total housing cost and break-even rent for jeonse and wolse
tool_key: jeonse-vs-wolse-calculator
keywords: [jeonse vs wolse calculator, korea rent comparison, jeonse opportunity cost, monthly-equivalent housing cost, break-even wolse rent]
related_tools: [brokerage-fee-calculator, loan-calculator, savings-interest-calculator]
faq:
  - q: What expected return rate should I enter?
    a: Use a realistic low-risk annual return you could earn elsewhere, such as a savings-deposit or bond yield. The calculator applies it as simple interest to estimate the opportunity cost of tied-up deposits.
  - q: What does break-even wolse rent mean?
    a: It is the monthly rent level where jeonse and wolse become equal on a monthly-equivalent cost basis under your inputs.
  - q: Does this include taxes, maintenance fees, or moving costs?
    a: You can enter differing one-time costs such as brokerage and moving fees. Loan interest, deposit-return risk, maintenance-fee differences, taxes, and future rate changes remain excluded.
  - q: Why can the result show no positive break-even rent?
    a: If wolse deposit opportunity cost and wolse one-time costs already exceed the jeonse cost, wolse remains more expensive even at zero monthly rent under this model.
alternate_urls:
  ko: /tools/jeonse-vs-wolse-calculator/
  en: /en/tools/jeonse-vs-wolse-calculator/
  ja: /ja/tools/jeonse-vs-wolse-calculator/
---

## Why compare jeonse and wolse this way?
Simple deposit-vs-rent comparison can be misleading.
Jeonse ties up a large deposit, creating opportunity cost.
Wolse has explicit monthly rent but lower tied capital.

This tool compares both on the same basis: deposit opportunity cost, rent payments, and optional one-time costs.

## Key features
- Compares total and monthly-equivalent housing costs
- Spreads optional brokerage, moving, and other one-time costs across the stay
- Shows the cheaper option and monthly cost gap
- Calculates break-even wolse rent with 12-, 24-, and 36-month presets

## How to use
1. Enter jeonse deposit and expected annual return.
2. Enter wolse deposit and monthly rent.
3. Set expected stay period.
4. Add one-time costs only when they differ between the options.
5. Check total cost, monthly gap, and break-even wolse rent.

## Formula and interpretation
- Jeonse total cost = `jeonse deposit × annual return × months ÷ 12 + jeonse one-time costs`
- Wolse total cost = `wolse deposit × annual return × months ÷ 12 + monthly rent × months + wolse one-time costs`
- Break-even rent = `(jeonse deposit − wolse deposit) × annual return ÷ 12 + (jeonse costs − wolse costs) ÷ months`

Monthly rent below the break-even amount favors wolse in this simplified model; rent above it favors jeonse. Opportunity cost uses simple interest. Treat the result as a scenario, not as financial or housing advice.

## What to check before deciding
This comparison includes deposit opportunity cost, monthly rent, and the one-time costs you enter. It does not include jeonse or wolse deposit-loan interest, deposit-return risk, differences in maintenance fees, taxes, or future rate changes. Add those items separately before signing a lease; the result is a planning scenario, not a guarantee of investment returns or deposit safety.

## Related tools
- Loan planning: [Loan Calculator]({{ '/en/tools/loan-calculator/' | relative_url }})
- Deposit-return scenario: [Savings Interest Calculator]({{ '/en/tools/savings-interest-calculator/' | relative_url }})
- Moving transaction fee check: [Brokerage Fee Calculator]({{ '/en/tools/brokerage-fee-calculator/' | relative_url }})
