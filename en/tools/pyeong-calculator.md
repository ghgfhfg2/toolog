---
layout: tool
title: Pyeong Calculator | Convert m² ↔ Pyeong + Price per Pyeong
description: Convert square meters (m²) to pyeong and pyeong to m² instantly, then calculate price per pyeong. Compare property sizes and listing prices with an 84m² example and clear input validation.
lang: en
permalink: /en/tools/pyeong-calculator/
canonical_url: /en/tools/pyeong-calculator/
category: calculator
category_label: Real Estate
thumbnail: /assets/thumbs/pyeong-calculator.svg
image:
  path: /assets/thumbs/pyeong-calculator.svg
  alt: Pyeong calculator conversion preview
tool_key: pyeong-calculator
keywords: [pyeong calculator, m2 to pyeong, pyeong to m2, square meter conversion, price per pyeong, Korean property area calculator]
related_tools: [brokerage-fee-calculator, loan-calculator, percent-calculator]
faq:
  - q: How many square meters are in one pyeong?
    a: This tool uses 1 pyeong = 3.305785 m².
  - q: Should I enter exclusive-use area or gross floor area?
    a: It depends on the comparison. Exclusive-use area is generally better for comparing usable space, while gross floor area is often used for presale information and maintenance-fee comparisons.
  - q: How is price per pyeong calculated?
    a: The total price in KRW is divided by the area in pyeong. The result also includes 10k KRW and 100M KRW units for easier reading.
alternate_urls:
  ko: /tools/pyeong-calculator/
  en: /en/tools/pyeong-calculator/
  ja: /ja/tools/pyeong-calculator/
---

## Why use a pyeong calculator?
Korean property listings usually show area in m², while everyday conversations often use pyeong.
This calculator handles both **m² ↔ pyeong conversion** and **price per pyeong**, making it faster to compare property listings.

## Why this tool was improved today
While recent quality updates focused on tools such as the electricity cost, severance pay, weekly holiday pay, discount, and TDEE calculators, the pyeong calculator had not received a dedicated update since March 2026. Negative or excessively large prices could be treated like an empty price, the copy button was enabled with no result, and the input rules and error location were unclear. That made **stronger error handling and a smoother mobile input flow** the priorities for this update.

## Key features
- **Two-way conversion**: Enter m² to calculate pyeong, or enter pyeong to calculate m²
- **Price per pyeong**: Enter a sale or jeonse price to calculate the unit price instantly
- **Readable price units**: See KRW, 10k KRW, and 100M KRW values together
- **Input validation**: Get a clear message for zero, negative, malformed, or excessive values
- **Example and copy flow**: Load the 84m² / 900M KRW example and copy only a valid result
- **Mobile friendly**: Compare area and price quickly while viewing a property

## How to use
### 1) Enter the area
Enter either `m²` or `pyeong`. The other unit updates automatically.

### 2) Enter the total price (optional)
Enter the property price as a **whole KRW amount** to see price per pyeong. For example, enter `900000000` for KRW 900 million.

### 3) Read the result
Compare listings using:
- converted area in m² and pyeong
- price per pyeong based on the total price
- supporting units in 10k KRW and 100M KRW

## Practical examples
### Compare apartment sizes
84m² converts to about 25.41 pyeong, so listings that use different area units can be compared on the same basis.

### Check price per pyeong
For a property priced at KRW 900 million with an 84m² exclusive-use area (about 25.41 pyeong), the price is approximately KRW 35.41 million per pyeong.

### Catch invalid input
The calculator does not run for an area of 0 or less, an area over 1 billion m², a negative or decimal price, or a price over KRW 1 quadrillion. It highlights the affected field and explains the issue in the status message.

### Interpret presale information
Convert the gross floor area in a presale notice from m² to pyeong to understand the size more intuitively.

## Related tools
- [Loan Calculator]({{ '/en/tools/loan-calculator/' | relative_url }})
- [Brokerage Fee Calculator]({{ '/en/tools/brokerage-fee-calculator/' | relative_url }})
- [Percent Calculator]({{ '/en/tools/percent-calculator/' | relative_url }})

## FAQ
### How many square meters are in one pyeong?
The calculator uses **1 pyeong = 3.305785m²**.

### Should I enter exclusive-use area or gross floor area?
Use exclusive-use area to compare usable space. Gross floor area is more commonly used for presale information or official comparison contexts.

### How do I calculate price per pyeong?
Divide the total price in KRW by the area in pyeong.

## Summary
This pyeong calculator goes beyond unit conversion. It is a practical Korean real-estate tool for **comparing property area and checking price per pyeong at the same time**.
