---
layout: tool
title: 2026 Korea Salary Calculator | Net Pay After Tax
description: Estimate 2026 monthly and yearly take-home pay in Korea from gross salary, non-taxable pay, dependents, income tax, and employee social insurance.
lang: en
permalink: /en/tools/salary-calculator/
canonical_url: /en/tools/salary-calculator/
category: calculator
category_label: Finance
thumbnail: /assets/thumbs/salary-calculator.svg
image:
  path: /assets/thumbs/salary-calculator.svg
  alt: Salary calculator take-home pay card
tool_key: salary-calculator
keywords: [Korea salary calculator 2026, take home pay, net salary, Korean payroll deductions]
faq:
  - q: Is this an exact Korean payroll withholding calculation?
    a: No. It is a planning estimate using simplified annual deductions and 2026 employee insurance rates. Payroll tables, employer benefits, and year-end settlement can change the actual amount.
  - q: Which 2026 insurance rates are included?
    a: It uses a 4.75% employee pension rate, 3.595% health rate, long-term care based on 0.9448% divided by 7.19%, and a 0.9% employee employment-insurance rate.
  - q: Should children be included in dependents?
    a: Yes. Dependents exclude yourself but include eligible children. The separate children field estimates the child tax credit.
related_tools: [loan-calculator, percent-calculator, compound-interest-calculator]
alternate_urls:
  ko: /tools/salary-calculator/
  en: /en/tools/salary-calculator/
  ja: /ja/tools/salary-calculator/
---

## Why use it?
A higher gross salary does not always mean a large increase in real cash flow. This tool gives a quick net-pay estimate for planning and negotiation.

## Includes
- Monthly/yearly net income estimate
- Income tax + local income tax estimate
- Pension, health, long-term care, employment insurance
- Optional non-taxable monthly amount

## 2026 calculation basis
- Employee pension: 4.75% of monthly taxable pay, capped at a KRW 6.59 million monthly base
- Employee health insurance: 3.595% of monthly taxable pay
- Long-term care: health premium multiplied by `0.9448% / 7.19%`
- Employee employment insurance: 0.9% of monthly taxable pay
- Income and local tax: simplified annual deduction model, not the official monthly payroll withholding table

Enter children in both the total dependents count and the children count. Invalid, fractional, oversized, and internally inconsistent values are rejected instead of silently adjusted.

## Related tools
- [Severance Pay Calculator]({{ '/en/tools/severance-pay-calculator/' | relative_url }})
- [Loan Calculator]({{ '/en/tools/loan-calculator/' | relative_url }})
- [Percent Calculator]({{ '/en/tools/percent-calculator/' | relative_url }})
