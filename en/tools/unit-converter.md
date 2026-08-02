---
layout: tool
title: Unit Converter | Length, Weight, Temperature, Inches to CM, LB to KG
description: Instantly convert mm, cm, m, km, inches, miles, kg, lb, oz, °C, °F, and K with examples, unit swapping, result copy, and clear absolute-zero or oversized-value errors.
lang: en
permalink: /en/tools/unit-converter/
canonical_url: /en/tools/unit-converter/
category: data
category_label: Data/Utilities
thumbnail: /assets/thumbs/unit-converter.svg
image:
  path: /assets/thumbs/unit-converter.svg
  alt: Unit converter preview
tool_key: unit-converter
keywords: [unit converter, length converter, weight converter, temperature converter, lb to kg, inches to cm, miles to km]
related_tools: ['timezone-converter', 'ratio-split-calculator', 'average-calculator']
faq:
  - q: Which units does the converter support?
    a: It supports length units (mm, cm, m, km, inch, ft, yd, mile), weight units (kg, g, lb, oz), and temperature units (°C, °F, K).
  - q: Are temperature conversions calculated differently from length and weight?
    a: Yes. Length and weight use proportional conversion factors, while temperatures use separate formulas because their zero points differ.
  - q: How many decimal places are shown?
    a: Results are displayed to a maximum of 10 decimal places, with unnecessary trailing zeros removed.
  - q: Can I copy the conversion result?
    a: Yes. After a valid conversion, the copy button copies a one-line summary such as `12 inch = 30.48 cm`.
alternate_urls:
  ko: /tools/unit-converter/
  en: /en/tools/unit-converter/
  ja: /ja/tools/unit-converter/
---

## When should you use a unit converter?
This **unit converter** is built for searches and everyday tasks such as `lb to kg`, `inches to cm`, `miles to km`, and `Fahrenheit to Celsius`. It helps resolve unit mismatches immediately without manual formulas.

## Why this tool was selected today
Recent quality passes focused on tools such as `privacy-exposure-checker`, `meeting-action-item-extractor`, `filename-sanitizer`, `fraction-calculator`, `body-fat-calculator`, and `customer-support-message-generator`, so this pass avoided repeating them.
`unit-converter` was selected because conversion tools have visible failure points around empty values, oversized numbers, absolute-zero temperature limits, and mobile button flow.

## Supported units
- Length: mm, cm, m, km, inch, ft, yd, mile
- Weight: kg, g, lb, oz
- Temperature: °C, °F, K

## How to use
1. Select a conversion category: length, weight, or temperature.
2. Choose the source and target units.
3. Enter a value to see the converted result instantly.
4. Use the swap button between the units to reverse the conversion quickly.
5. Load a sample conversion or copy the final one-line result when needed.

## Validation and precision
Leave the value field empty and the tool will prompt you to enter a value. Invalid numbers, non-finite values such as `Infinity`, and values above `1e15` are rejected to keep the page responsive. Temperatures below absolute zero are also rejected. Results are rounded to a maximum of 10 decimal places, and unnecessary trailing zeros are omitted.

## Practical examples
- Convert product dimensions from inches to centimeters
- Convert pounds to kilograms for fitness or purchasing records
- Convert travel distances from miles to kilometers
- Convert a Fahrenheit weather forecast to Celsius
- Convert Kelvin values in science or study notes to Celsius or Fahrenheit

## Related tools
- Global schedule planning: [Timezone Converter]({{ '/en/tools/timezone-converter/' | relative_url }})
- Split values by a ratio: [Ratio Split Calculator]({{ '/en/tools/ratio-split-calculator/' | relative_url }})
- Find the mean of multiple values: [Average Calculator]({{ '/en/tools/average-calculator/' | relative_url }})
- Unit standard reference: [NIST SI Units](https://www.nist.gov/pml/owm/metric-si/si-units)

## FAQ
### Which units does the converter support?
It supports the most commonly used length, weight, and temperature units, including millimeters, yards, miles, pounds, ounces, Celsius, Fahrenheit, and Kelvin.

### Why are temperature conversions calculated separately?
Temperature scales have different zero points, so they cannot be converted with a simple proportional factor like length or weight.

### How precise are the results?
Results are displayed to a maximum of 10 decimal places, which is sufficient for most everyday and practical work.

### Can I copy the conversion result?
Yes. After a valid conversion, **Copy result** copies the source value, source unit, converted value, and target unit as one line.

## Summary
This unit converter reduces manual calculation errors and makes it easier to interpret measurements from international products, documents, travel information, and weather data.
