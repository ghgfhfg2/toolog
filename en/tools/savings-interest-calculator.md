---
layout: tool
title: Savings Interest Calculator | Simple & Monthly Compound in KRW
description: Estimate pre-tax interest, tax and after-tax maturity for a lump-sum deposit in KRW. Compare simple or monthly compound interest, 0–50% annual rates and 1–120 months with whole-won rounding.
lang: en
permalink: /en/tools/savings-interest-calculator/
canonical_url: /en/tools/savings-interest-calculator/
category: calculator
category_label: Finance/Business
thumbnail: /assets/thumbs/savings-interest-calculator.svg
image:
  path: /assets/thumbs/savings-interest-calculator.svg
  alt: Savings interest calculator thumbnail
tool_key: savings-interest-calculator
keywords: [savings interest calculator, fixed deposit interest calculator, after tax interest KRW, simple interest, monthly compound interest, deposit maturity amount]
related_tools: [compound-interest-calculator, loan-calculator, percent-calculator]
faq:
  - q: What is the difference between simple interest and monthly compound interest?
    a: Simple interest is calculated on principal only, while monthly compound interest adds monthly interest to principal before calculating the next month.
  - q: Why 15.4% tax?
    a: It represents Korea's common interest-income tax rate (14% income tax + 1.4% local tax).
  - q: Can I simulate tax-exempt products?
    a: Yes. Select tax-exempt mode (0%) to compare after-tax outcomes.
  - q: Will the result exactly match my bank's maturity amount?
    a: This is an estimate assuming a fixed displayed annual rate and interest paid at maturity. Day-count rules, payment frequency, rounding, promotional-rate requirements, and product-specific tax rules can change the actual amount.
  - q: Can I use this for monthly savings contributions or other currencies?
    a: No. This calculator models one lump-sum deposit in Korean won (KRW), not recurring contributions. It does not convert currencies; the 15.4% option represents Korean interest-income tax, not a universal tax rate.
  - q: What are the input limits and rounding rules?
    a: "KRW only; no currency conversion. Deposit: whole units 1–1,000,000,000,000; annual rate: 0–50% (up to 4 decimals); term: 1–120 whole months. Plain numbers only, no commas or exponents. Gross interest rounds half up to whole KRW, then tax rounds half up; net interest = gross − tax. Monthly compounding is an estimate. This models one lump-sum deposit, not recurring savings."
alternate_urls:
  ko: /tools/savings-interest-calculator/
  en: /en/tools/savings-interest-calculator/
  ja: /ja/tools/savings-interest-calculator/
---

## Compare lump-sum fixed deposit interest after tax
When comparing fixed-term or short-term lump-sum deposits, the headline rate alone does not show how much interest you will actually keep after tax. Enter one deposit amount in **Korean won (KRW)**, a fixed annual rate, the term and tax treatment to estimate pre-tax interest and the after-tax maturity amount. This is not a recurring savings calculator and does not convert currencies.

## Key features
- Choose **simple interest or monthly compound interest**
- Compare **15.4% Korean interest-income tax or 0% tax-exempt treatment**
- See **pre-tax interest, tax, after-tax interest, and maturity amount** together
- Use quick **6-, 12-, or 24-month term presets** and a sample input
- Copy the result for a deposit comparison sheet

## How to use it
1. Enter a whole-KRW deposit from 1 to 1,000,000,000,000, an annual rate from 0% to 50% (up to four decimal places), and a whole-number term from 1 to 120 months. Do not include commas or exponent notation.
2. Select simple interest or monthly compounding.
3. Choose the tax mode: 15.4% taxable or 0% tax-exempt.
4. Results update automatically when all entries are valid. Review pre-tax interest, tax, after-tax interest and maturity amount, then use **Copy result** for your comparison sheet.
5. Use **Load example** to try sample inputs, a 6-, 12- or 24-month preset to change the term, or **Clear** to start again.

## Blank results and input errors
- A dash means there is no valid result yet, not zero interest. Complete all three numeric fields; **0% is a valid annual rate**.
- If an input is out of range, fractional where a whole number is required, or uses unsupported notation, correct it using the message beneath the fields. Result copying stays disabled until the entries are valid.
- If automatic copying is unavailable, select and copy the displayed amounts manually.

## Calculation assumptions
- Let `P` be the deposit, `r` the annual percentage divided by 100, and `m` the term in months. Simple interest is `P × r × m ÷ 12`; monthly compound interest is `P × ((1 + r ÷ 12)^m − 1)`.
- Pre-tax interest is rounded half up to a whole won first. Tax is then calculated from that rounded interest at 15.4% or 0% and rounded half up to a whole won.
- After-tax interest = rounded pre-tax interest − rounded tax. Maturity amount = original deposit + after-tax interest. Tax is applied once to total interest, not deducted each month.
- Actual bank results may differ because of day-count conventions, interest payment schedules, promotional-rate requirements, rounding, and product-specific tax rules. Confirm the final amount in the product disclosure.

## Related tools
- [Compound Interest Calculator]({{ '/en/tools/compound-interest-calculator/' | relative_url }})
- [Loan Repayment Calculator]({{ '/en/tools/loan-calculator/' | relative_url }})
- [Percent Calculator]({{ '/en/tools/percent-calculator/' | relative_url }})


## FAQ
### What are the input limits and rounding rules?
KRW only; no currency conversion. Deposit: whole units 1–1,000,000,000,000; annual rate: 0–50% (up to 4 decimals); term: 1–120 whole months. Plain numbers only, no commas or exponents. Gross interest rounds half up to whole KRW, then tax rounds half up; net interest = gross − tax. Monthly compounding is an estimate. This models one lump-sum deposit, not recurring savings.
