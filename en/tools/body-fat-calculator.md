---
layout: tool
title: Body Fat Calculator | US Navy Formula Estimate
description: Estimate body fat percentage, fat mass, and lean mass from height, neck, waist, weight, and female hip measurement with safer range checks.
lang: en
permalink: /en/tools/body-fat-calculator/
canonical_url: /en/tools/body-fat-calculator/
category: calculator
category_label: Health/Fitness
thumbnail: /assets/thumbs/en/body-fat-calculator.svg
image:
  path: /assets/thumbs/en/body-fat-calculator.svg
  alt: Body fat calculator preview
tool_key: body-fat-calculator
keywords: [body fat calculator, us navy body fat, body fat percentage, fat mass calculator, lean mass calculator]
related_tools: [bmi-calculator, tdee-calculator, age-calculator]
faq:
  - q: Why is hip circumference required in female mode?
    a: The U.S. Navy formula for females uses waist + hip - neck values.
  - q: Is this a medical diagnosis?
    a: No. It is a practical estimate tool for tracking trends.
  - q: When should I measure for consistency?
    a: Measure at a similar time and condition (e.g., morning, before meals) for better comparability.
  - q: What happens when measurements are invalid?
    a: Values outside the supported range or measurement combinations that do not fit the formula are rejected instead of producing a misleading result.
alternate_urls:
  ko: /tools/body-fat-calculator/
  en: /en/tools/body-fat-calculator/
  ja: /ja/tools/body-fat-calculator/
---

## Estimate body fat in seconds
Body weight alone does not show how much is fat vs lean mass.
This tool uses the U.S. Navy method to estimate:
- Body fat percentage
- Fat mass (kg)
- Lean mass (kg)

Use it when you need a quick body fat calculator, U.S. Navy body fat estimate, or fat mass and lean mass reference before comparing diet or training changes.

## Key features
- Sex-specific U.S. Navy formula
- Instant body composition estimate
- Category label for quick interpretation
- Empty-state, range, and formula-validity checks
- Example input, result copying, and mobile-friendly controls

## How to Use
1. Choose sex.
2. Enter height, neck, waist, and weight.
3. In female mode, enter hip circumference too.
4. Use the example button to preview the flow, or copy your own result after calculating.

## When Input Is Rejected
- Height outside 120-230cm, neck outside 20-70cm, waist outside 40-180cm, hip outside 50-200cm, or weight outside 30-250kg
- Male mode where waist is not larger than neck
- Female mode where waist + hip is not larger than neck
- Empty, non-number, or abnormally large pasted values

The tool blocks these cases because the U.S. Navy formula uses logarithms and needs valid measurement relationships.

## Reading the Result
The body fat percentage is a practical estimate, not a medical diagnosis. For trend tracking, measure at the same time of day and with the tape in the same position.

## Related tools
- [BMI Calculator]({{ '/en/tools/bmi-calculator/' | relative_url }})
- [TDEE Calculator]({{ '/en/tools/tdee-calculator/' | relative_url }})
- [Age Calculator]({{ '/en/tools/age-calculator/' | relative_url }})

## FAQ
### Why is hip circumference required in female mode?
The U.S. Navy formula for females uses waist + hip - neck measurements.

### Can body fat percentage go up while body weight goes down?
Yes. If lean mass drops faster than fat mass, the percentage can rise even when body weight decreases.

### Why do I see an input error?
The formula needs valid measurement relationships. In male mode, waist must be larger than neck. In female mode, waist + hip must be larger than neck.
