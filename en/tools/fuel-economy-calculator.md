---
layout: tool
title: Fuel Economy Calculator | km/L, L/100km, and fuel cost at once
description: Calculate fuel economy in km/L from distance and fuel used, then check L/100km, total fuel cost, and cost per km in one place.
lang: en
permalink: /en/tools/fuel-economy-calculator/
canonical_url: /en/tools/fuel-economy-calculator/
category: calculator
category_label: Auto/Cost
thumbnail: /assets/thumbs/en/fuel-economy-calculator.svg
image:
  path: /assets/thumbs/en/fuel-economy-calculator.svg
  alt: Fuel economy calculator thumbnail
tool_key: fuel-economy-calculator
tool_type: calculator
topic_cluster: auto
keywords: [fuel economy calculator, km per liter calculator, fuel cost per km, gas mileage calculator, liters per 100km]
related_tools: [average-speed-calculator, unit-converter, unit-price-calculator, percent-calculator]
faq:
  - q: What is the difference between km/L and L/100km?
    a: km/L tells you how far the car goes with 1 liter of fuel, while L/100km shows how many liters are needed to drive 100km. They express the same efficiency from different angles.
  - q: Do I need to enter fuel price?
    a: No. Fuel economy can be calculated with distance and fuel used only. If you add price per liter, the tool also calculates total fuel cost and cost per km.
  - q: Can I use this for EV efficiency?
    a: This tool is designed for liquid fuel and liters. It is not meant for EV efficiency in kWh.
  - q: What should I check if the result looks too low or too high?
    a: First confirm that distance is entered in km and fuel is entered in liters. The tool shows a warning for unusual results such as under 3km/L or over 40km/L.
---

## When this fuel economy calculator is useful
After a trip or a refill, you may want to know **your real fuel economy** and **how much that drive actually cost**.

This tool lets you enter:
- Distance traveled (km)
- Fuel used (L)
- Fuel price per liter (optional)

Then it instantly shows **km/L**, **L/100km**, **total fuel cost**, and **fuel cost per km**.
It is useful both for logging real refuel records and for estimating fuel cost before a longer drive.

## Why this tool was selected today
Recent quality work focused on tools such as `image-resizer`, `lucky-draw-picker`, `pomodoro-timer`, `readability-checker`, `time-difference-calculator`, `korean-name-romanizer`, `png-compressor`, `json-merge`, `link-list-cleaner`, and `average-speed-calculator`, so this pass avoids repeating the same tools.
`fuel-economy-calculator` had little major work since its March 2026 launch, and fuel-cost calculations need clearer handling for empty values, zero values, negative price input, extreme values, and missing optional price.

## How it works
1. `Distance ÷ Fuel used = km/L`
2. `100 ÷ km/L = L/100km`
3. `Fuel used × Price per liter = Total fuel cost`
4. `Total fuel cost ÷ Distance = Cost per km`

All calculations run in your browser. If fuel price is blank, the calculator still shows km/L and L/100km first.

## Example
- Distance: 420km
- Fuel used: 28L
- Price per liter: 1,720 KRW

→ Fuel economy: **15.00 km/L**  
→ Fuel use per 100km: **6.67 L**  
→ Total fuel cost: **48,160 KRW**  
→ Fuel cost per km: **about 115 KRW**

## Good companion tools
- Compare travel pace: [Average Speed Calculator]({{ '/en/tools/average-speed-calculator/' | relative_url }})
- Convert units: [Unit Converter]({{ '/en/tools/unit-converter/' | relative_url }})
- Compare per-unit prices: [Unit Price Calculator]({{ '/en/tools/unit-price-calculator/' | relative_url }})
- Compare cost differences by rate: [Percent Calculator]({{ '/en/tools/percent-calculator/' | relative_url }})

## FAQ
### Is a higher km/L better?
Yes. A higher km/L means your car travels farther with the same amount of fuel.

### Is a lower L/100km better?
Yes. A lower L/100km means less fuel is needed to travel the same distance.

### Why should I enter fuel price?
Adding fuel price helps you translate efficiency into real driving cost, including total fill cost and cost per km.

### What should I check when the result looks odd?
If fuel economy looks too low or too high, check whether distance and fuel were swapped, and confirm that the distance is in km rather than meters or miles.
