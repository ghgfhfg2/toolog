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
  - q: Does this calculator exactly match the legally payable severance?
    a: No. It is a simplified gross estimate. The actual amount can differ because of excluded periods, wage classification, interim settlements, retirement-plan rules, company policy, and taxes.
  - q: Which date should I enter as the retirement date?
    a: Enter the first date you are no longer employed, normally the day after your final workday. The calculator includes the start date and excludes this retirement date.
  - q: Are the prior three months counted by workdays?
    a: No. Use total calendar days, including weekends and holidays. This simplified calculator accepts the usual 89 to 92 days only.
  - q: What happens when ordinary daily wage is higher?
    a: If the optional ordinary daily wage exceeds the estimated average daily wage, the calculator uses the ordinary daily wage for the estimate.
  - q: Does this determine legal entitlement?
    a: No. It checks only the basic one-year and 15-hours-per-week thresholds. Excluded periods, wage classification, interim settlements, and company rules require separate review.
  - q: Can I calculate an employment period shorter than one year?
    a: Yes. The calculator displays an amount for comparison, but flags that the basic one-year threshold is not met.
alternate_urls:
  ko: /tools/severance-pay-calculator/
  en: /en/tools/severance-pay-calculator/
  ja: /ja/tools/severance-pay-calculator/
---

## Check your estimated Korean severance before leaving a job
Enter employment dates, gross wages paid during the prior three months, calendar days in that period, and average contracted weekly hours. You can also include an annual regular bonus, relevant annual-leave allowance, and ordinary daily wage.

The calculator shows service days, estimated average daily wage, the daily wage actually used, expected gross severance, and a basic eligibility check.

## Key features
- Counts service days by including the employment start date and excluding the retirement date
- Estimates average daily wage from prior 3-month wages and calendar days
- Adds 3/12 of eligible annual regular bonuses and annual-leave allowance
- Uses the greater of estimated average daily wage and the entered ordinary daily wage
- Checks the basic one-year and four-week average 15-hours-per-week thresholds
- Explains blank, invalid date, 89–92 day, whole-KRW, range, and oversized-result states
- Includes example, copy, and clear actions with a mobile-friendly single-column layout

## How to use
1. Select the employment start date and the **retirement date, meaning the day after the final workday**.
2. Enter the total calendar days in the prior three months—normally 89–92—and the gross wages paid for that period.
3. Add an annual regular bonus and eligible annual-leave allowance when they should be included in average wage.
4. Enter ordinary daily wage if you know it and want the calculator to compare the two wage bases.
5. Enter average contracted weekly hours over four weeks, then review the estimate and basic eligibility check.

The result remains blank until all required values are valid. Invalid dates, negative or fractional KRW amounts, out-of-range calendar days or weekly hours, and unusually large results produce a field-specific message; copying remains disabled until a valid result exists.

## Example
- Employment start date: September 19, 2023
- Retirement date: September 19, 2026 (final workday: September 18)
- Prior 3-month calendar days: 92
- Prior 3-month gross wages: 9,600,000 KRW
- Annual regular bonus: 4,000,000 KRW
- Ordinary daily wage: 110,000 KRW
- Average contracted weekly hours: 40

Estimated average wage is `(9,600,000 + 4,000,000 × 3/12) ÷ 92`. The estimate uses the greater of that result and ordinary daily wage, then applies `30 × service days ÷ 365`.

## Formula and basic eligibility
- Average daily wage = `(prior 3-month wages + annual regular bonus × 3/12 + relevant leave allowance × 3/12) ÷ calendar days`
- Daily wage used = the greater of estimated average daily wage and the optional ordinary daily wage
- Severance estimate = `daily wage used × 30 × service days ÷ 365`
- Basic eligibility = at least one year of continuous service and an average of at least 15 contracted hours per week over four weeks

## Exceptions and important limitations
- This simplified mode supports only the usual 89–92 day wage period. Use the [official Korean Ministry of Employment and Labor calculator](https://www.moel.go.kr/retirementpayCal.do) if maternity leave, childcare leave, occupational-injury leave, or another excluded period applies.
- Whether a bonus or performance payment legally qualifies as wages, and which annual-leave allowance should be included, depends on payment terms and workplace rules.
- Interim settlements, excluded service periods, retirement-plan rules, and taxes are not included.
- This is a gross reference estimate, not a legal determination. Confirm the final amount from payroll records and workplace rules with the Ministry or a labor professional.

## Related tools
- Check payroll deductions: [Salary Calculator]({{ '/en/tools/salary-calculator/' | relative_url }})
- Review the 15-hour threshold and weekly allowance: [Weekly Holiday Pay Calculator]({{ '/en/tools/weekly-holiday-pay-calculator/' | relative_url }})
- Compare percentages and changes: [Percent Calculator]({{ '/en/tools/percent-calculator/' | relative_url }})
