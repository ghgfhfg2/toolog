---
layout: tool
title: Korea Hourly to Monthly Salary Calculator | 2026 Minimum Wage
description: Convert a Korean hourly wage to gross weekly, monthly, and annual pay with prorated weekly holiday pay, attendance eligibility, and a 2026 minimum-wage warning.
lang: en
permalink: /en/tools/hourly-monthly-salary-calculator/
canonical_url: /en/tools/hourly-monthly-salary-calculator/
category: calculator
category_label: Finance/Business
thumbnail: /assets/thumbs/en/hourly-monthly-salary-calculator.svg
tool_key: hourly-monthly-salary-calculator
image:
  path: /assets/thumbs/en/hourly-monthly-salary-calculator.svg
  alt: Hourly to monthly salary calculator preview
keywords: [Korea hourly to monthly salary calculator, 2026 Korea minimum wage, hourly wage calculator, weekly holiday pay calculator]
related_tools: [weekly-holiday-pay-calculator, salary-calculator, work-end-time-calculator]
faq:
  - q: Does this include weekly holiday pay?
    a: Yes when enabled, the 4-week average is at least 15 contracted hours a week, and all contracted workdays were completed. The estimate prorates weekly holiday hours against a 40-hour week, capped at 8 hours.
  - q: Why is the default weeks-per-month 4.345?
    a: It is a rounded average from 365 days divided by 7 days and 12 months. You can adjust it from 4 to 5 to match a payroll convention.
  - q: Is this net take-home pay?
    a: No. This tool estimates gross pay before tax and insurance deductions.
  - q: What is Korea's 2026 minimum wage?
    a: The 2026 hourly minimum wage is KRW 10,320. The tool flags lower entries for review, but individual exceptions still require official guidance.
alternate_urls:
  ko: /tools/hourly-monthly-salary-calculator/
  en: /en/tools/hourly-monthly-salary-calculator/
  ja: /ja/tools/hourly-monthly-salary-calculator/
---

## Convert a Korean hourly wage to monthly salary
Estimate gross weekly, monthly, and annual pay from contracted weekly hours, weekly holiday pay eligibility, and weeks per month. Invalid, negative, and oversized values are rejected instead of silently corrected.

Use the 2026 example to load Korea's KRW 10,320 hourly minimum wage. A lower wage triggers a review warning.

## Formula
1. Base weekly pay = `hourly wage × weekly hours`
2. Weekly holiday pay (optional) = `hourly wage × weekly holiday hours`
   - Simplified holiday hours = `contracted weekly hours ÷ 40 × 8`, capped at 8
   - Included only when the 4-week average is at least 15 hours and contracted workdays were completed
3. Monthly pay = `(base weekly + holiday pay) × weeks per month`
4. Yearly pay = `monthly pay × 12`

## Assumptions and limits
- Enter contracted hours, not overtime actually worked.
- The prorated method is an estimate; the applicable normal-worker schedule and actual work pattern can change the legal result.
- Overtime premiums, tax, social insurance, paid leave, and other allowances are excluded.
- The result is for reviewing a contract or payslip, not a final payroll or legal determination.

See the [Korean Ministry of Employment and Labor's 2026 minimum-wage release](https://www.moel.go.kr/news/enews/report/enewsView.do?news_seq=18144) and the [weekly-holiday rule in the Enforcement Decree](https://law.go.kr/LSW/lsLinkCommonInfo.do?lspttninfSeq=148916).

## Related tools
- [Weekly Holiday Pay Calculator]({{ '/en/tools/weekly-holiday-pay-calculator/' | relative_url }})
- [Salary Calculator]({{ '/en/tools/salary-calculator/' | relative_url }})
- [Work End Time Calculator]({{ '/en/tools/work-end-time-calculator/' | relative_url }})

All calculations run in your browser; input is not sent to a server.
