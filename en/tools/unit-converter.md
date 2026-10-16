---
layout: tool
title: Unit Converter | Inches to CM, LB to KG & Tiny Values
description: Convert inches to cm, lb to kg and Fahrenheit to Celsius. Keep tiny values visible with scientific notation, check absolute-zero limits and copy results.
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
  - q: How are small values and precision displayed?
    a: Use a decimal point or exponent (e.g. 1e-8), without commas or unit text. Enter zero or a magnitude from 1e-100 to 1e15, within 100 characters. Results are rounded to at most 12 significant digits; magnitudes below 0.000001 or at least 1e15 use scientific notation. 1E-8 means 0.00000001, not zero. Floating-point results are approximations, not certified measurement or settlement values.
  - q: Can I copy the conversion result?
    a: Yes. After a valid conversion, the copy button copies a one-line summary such as `12 inch = 30.48 cm`.
  - q: What input limits and unit-swap behavior should I expect?
    a: Use a decimal point or exponent (e.g. 1e-8), without commas or unit text. Enter zero or a magnitude from 1e-100 to 1e15, within 100 characters. Results are rounded to at most 12 significant digits; magnitudes below 0.000001 or at least 1e15 use scientific notation. 1E-8 means 0.00000001, not zero. Floating-point results are approximations, not certified measurement or settlement values. Swapping units keeps the input number and only reverses the units. Enter the result number for a reverse conversion. Identical units preserve the original value. Absolute zero is allowed at -273.15 °C, -459.67 °F and 0 K; lower temperatures are rejected.
alternate_urls:
  ko: /tools/unit-converter/
  en: /en/tools/unit-converter/
  ja: /ja/tools/unit-converter/
---

## When should you use a unit converter?
This **unit converter** is built for searches and everyday tasks such as `lb to kg`, `inches to cm`, `miles to km`, and `Fahrenheit to Celsius`. It helps resolve unit mismatches immediately without manual formulas.

## Supported units
- Length: mm, cm, m, km, inch, ft, yd, mile
- Weight: kg, g, lb, oz
- Temperature: °C, °F, K

## How to use
1. Select a conversion category: length, weight, or temperature.
2. Choose the source and target units.
3. Enter a value to see the converted result instantly.
4. Use the swap button to exchange the source and target units. The input number stays unchanged; to convert a result back, enter that result as the new input.
5. Load a sample conversion or copy the final one-line result when needed.

## Validation and precision
An empty field shows an input prompt, not a zero result. Enter a number within 100 characters, using a decimal point or exponent such as `1e-8`; omit commas and unit labels. Zero is allowed. Nonzero inputs must have an absolute value from `1e-100` through `1e15`, inclusive. Invalid numbers, `Infinity`, and out-of-range values show an error and disable result copying.

Absolute zero is valid at -273.15 °C, -459.67 °F, or 0 K; lower temperatures are rejected. Results use up to 12 significant digits. A nonzero magnitude below `0.000001` or at least `1e15` is displayed in scientific notation: `1E-8` means `0.00000001`, not zero.

## Practical conversion examples
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
Use a decimal point or exponent (e.g. 1e-8), without commas or unit text. Enter zero or a magnitude from 1e-100 to 1e15, within 100 characters. Results are rounded to at most 12 significant digits; magnitudes below 0.000001 or at least 1e15 use scientific notation. 1E-8 means 0.00000001, not zero. Floating-point results are approximations, not certified measurement or settlement values.

### Can I copy the conversion result?
Yes. After a valid conversion, **Copy result** copies the source value, source unit, converted value, and target unit as one line.

### What happens when I swap units or choose the same unit?
Swapping changes only the units, not the input number. Enter the converted number first if you want a reverse conversion. Selecting the same source and target unit preserves the value, subject to display rounding. Absolute-zero validation still applies to temperatures.

## Summary
This unit converter reduces manual calculation errors and makes it easier to interpret measurements from international products, documents, travel information, and weather data.

## Precision and input limits
Use a decimal point or exponent (e.g. 1e-8), without commas or unit text. Enter zero or a magnitude from 1e-100 to 1e15, within 100 characters. Results are rounded to at most 12 significant digits; magnitudes below 0.000001 or at least 1e15 use scientific notation. 1E-8 means 0.00000001, not zero. Floating-point results are approximations, not certified measurement or settlement values.

Swapping units keeps the input number and only reverses the units. Enter the result number for a reverse conversion. Identical units preserve the original value. Absolute zero is allowed at -273.15 °C, -459.67 °F and 0 K; lower temperatures are rejected.
