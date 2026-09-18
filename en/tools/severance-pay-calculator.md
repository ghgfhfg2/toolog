---
layout: tool
title: Korean Severance Pay Calculator | 3-Month Average Wage Estimate
description: Estimate Korean severance pay from service dates, prior 3-month wages and calendar days, regular bonus, leave allowance, ordinary daily wage, and weekly hours.
lang: en
permalink: /en/tools/severance-pay-calculator/
canonical_url: /en/tools/severance-pay-calculator/
category: calculator
category_label: Finance
thumbnail: /assets/thumbs/severance-pay-calculator.svg
image:
  path: /assets/thumbs/severance-pay-calculator.svg
  alt: Severance pay calculator preview
tool_key: severance-pay-calculator
tool_type: calculator
topic_cluster: labor
keywords: [Korean severance pay calculator, retirement allowance, three month average wage, ordinary wage, employment period]
related_tools: [salary-calculator, weekly-holiday-pay-calculator, percent-calculator]
faq:
  - q: Which date should I enter as the retirement date?
    a: Enter the first date you are no longer employed, normally the day after your final workday. The calculator includes the start date and excludes this retirement date.
  - q: Are the prior three months counted by workdays?
    a: No. Use total calendar days, including weekends and holidays. This simplified calculator accepts the usual 89 to 92 days only.
  - q: What happens when ordinary daily wage is higher?
    a: If the optional ordinary daily wage exceeds the estimated average daily wage, the calculator uses the ordinary daily wage for the estimate.
  - q: Does this determine legal entitlement?
    a: No. It checks only the basic one-year and 15-hours-per-week thresholds. Excluded periods, wage classification, interim settlements, and company rules require separate review.
alternate_urls:
  ko: /tools/severance-pay-calculator/
  en: /en/tools/severance-pay-calculator/
  ja: /ja/tools/severance-pay-calculator/
---

## Estimate Korean severance from the relevant wage period
Enter employment dates, gross wages paid during the prior three months, calendar days in that period, and average contracted weekly hours. You can also include an annual regular bonus, relevant annual-leave allowance, and ordinary daily wage.

The calculator shows service days, estimated average daily wage, the daily wage actually used, expected gross severance, and a basic eligibility check.

## Formula used
- Average daily wage = `(prior 3-month wages + annual regular bonus × 3/12 + relevant leave allowance × 3/12) ÷ calendar days`
- Daily wage used = the greater of estimated average daily wage and the optional ordinary daily wage
- Severance estimate = `daily wage used × 30 × service days ÷ 365`

Enter the retirement date as the first day no longer employed. The 3-month denominator is calendar days, not workdays. This simple mode accepts the usual 89–92 days; use the [official Ministry of Employment and Labor calculator](https://www.moel.go.kr/retirementpayCal.do) when excluded periods apply.

## Important limitations
This is a gross reference estimate, not a legal determination. It does not handle maternity or childcare leave exclusions, occupational-injury leave, interim settlements, retirement-plan rules, taxes, or whether a bonus legally qualifies as wages.

## Related tools
- [Salary Calculator]({{ '/en/tools/salary-calculator/' | relative_url }})
- [Weekly Holiday Pay Calculator]({{ '/en/tools/weekly-holiday-pay-calculator/' | relative_url }})
- [Percent Calculator]({{ '/en/tools/percent-calculator/' | relative_url }})
