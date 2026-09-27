---
layout: tool
title: Goal Savings Timeline Calculator | Months to Reach Your Target
description: Enter current savings, a target, monthly deposits, and an annual rate to calculate the months to your goal, future contributions, and monthly-compounded interest.
lang: en
permalink: /en/tools/goal-savings-calculator/
canonical_url: /en/tools/goal-savings-calculator/
category: calculator
category_label: Finance/Business
thumbnail: /assets/thumbs/en/goal-savings-calculator.svg
image:
  path: /assets/thumbs/en/goal-savings-calculator.svg
  alt: Goal savings timeline calculator thumbnail
tool_key: goal-savings-calculator
keywords: [goal savings calculator, savings timeline calculator, monthly savings calculator, target amount calculator, saving goal planner, months to savings goal]
related_tools: [savings-interest-calculator, compound-interest-calculator, percent-calculator]
faq:
  - q: What happens if I set the interest rate to 0?
    a: The tool calculates the timeline from current savings and monthly deposits only, with no interest growth.
  - q: Is the result accurate if I save a different amount each month?
    a: This is a planning simulation that assumes the same deposit every month. The actual timeline can change when your deposits vary.
  - q: What if my current savings already meet the target?
    a: The goal is treated as already achieved and the required period is shown as 0 months.
  - q: When is each monthly deposit assumed to be made?
    a: The calculator adds the deposit at the beginning of each month, then applies that month's interest. Actual products may use different deposit dates and interest methods.
  - q: Are taxes and fees included?
    a: No. It applies a monthly rate equal to the fixed annual rate divided by 12 and excludes taxes, fees, promotional rates, and rate changes.
---

## When to use this goal savings timeline calculator
The practical question behind a savings plan is simple: **if I save this much each month, how long will it take to reach my target?**

Enter four values:
- Current savings
- Target amount
- Monthly savings
- Estimated annual interest rate (optional)

The calculator shows the **months required**, a **years-and-months summary**, **future contributions**, and **estimated interest**. It does not calculate incomplete, negative, fractional, or excessively large amount inputs; instead, it explains what needs correction.

## How the calculation works
The calculator runs a month-by-month balance simulation.

1. It starts with your current savings.
2. It adds your monthly deposit at the beginning of each month.
3. It divides the annual rate by 12 and applies that monthly compound rate to the new balance.
4. It stops when the balance reaches or exceeds the target.

At a 0% rate, the required months equal `ceil((target amount - current savings) / monthly savings)`. With interest, the same monthly process runs for up to 1,200 months (100 years). The result gives you a quick, consistent estimate of **when you may reach your savings goal** without requiring detailed financial modeling.

## Examples
### Example 1: Saving 10,000,000 KRW
- Current savings: 2,000,000 KRW
- Target amount: 10,000,000 KRW
- Monthly savings: 500,000 KRW
- Estimated annual interest: 3%

→ Time to target: **about 16 months**
→ Period summary: **1 year 4 months**
→ Future contributions: **8,000,000 KRW**
→ Estimated interest: **about 253,661 KRW**

### Example 2: Saving without interest
- Current savings: 0 KRW
- Target amount: 3,000,000 KRW
- Monthly savings: 250,000 KRW
- Estimated annual interest: 0%

→ Time to target: **12 months**
→ Future contributions: **3,000,000 KRW**

## How to interpret the result
- **Future contributions** are the total deposits you will make from now on; they do not include your current savings.
- The final balance may slightly exceed your target because the calculator assumes you make the full fixed deposit each month.
- Estimated interest is `final estimated balance - current savings - future contributions`.
- Real savings products can differ by deposit date, daily interest rules, simple or compound interest, and pre-tax or after-tax terms.

## Especially useful for
- Planning a specific target such as a trip, home deposit, or emergency fund
- Checking whether your current monthly savings pace is realistic
- Comparing a no-interest plan with an interest-bearing plan
- Building a practical recurring savings plan

## Good companion tools
- To explore maturity value and compound growth: [Compound Interest Calculator]({{ '/en/tools/compound-interest-calculator/' | relative_url }})
- To estimate interest on a deposit: [Savings Interest Calculator]({{ '/en/tools/savings-interest-calculator/' | relative_url }})
- To compare percentage changes against a goal: [Percent Calculator]({{ '/en/tools/percent-calculator/' | relative_url }})

## FAQ
### Can I use this for both recurring savings and lump-sum deposits?
Yes. It is useful for goal-based planning whenever you start with a current balance and add a fixed amount regularly.

### Does a higher interest rate shorten the timeline significantly?
It depends. Interest may have a smaller effect when monthly deposits are large, but its cumulative effect becomes more noticeable over longer timelines.

### Are taxes or promotional rates included?
No. This quick planning simulation excludes taxes, promotional rates, fees, rate changes, and early-withdrawal conditions.

### Can I enter 0 for monthly savings?
Yes. If you have a current balance and an annual rate above 0%, the calculator can estimate when interest alone reaches the target. The target is unreachable if both current savings and monthly savings are zero, or if both monthly savings and the interest rate are zero.

### What input ranges are supported?
Enter whole amount values from 0 (the target must be at least 1) through 1 quadrillion, and an annual rate from 0% to 100%. The calculator only evaluates timelines up to 100 years.

## Summary
The goal savings timeline calculator is a quick way to answer **how many months it may take to reach a target at your current savings pace**.
Enter a few numbers to check whether your goal is months or years away.
