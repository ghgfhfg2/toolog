---
layout: tool
title: Fuel Economy Calculator | Real km/L, L/100km & KRW Costs
description: Calculate real fuel economy in km/L and L/100km from distance and fuel consumed. Optional KRW/L pricing supports zero prices, exact whole-won rounding, and copied results.
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
keywords: [fuel economy calculator, km per liter calculator, fuel cost calculator, fuel cost per km, gas mileage calculator, liters per 100km]
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
  - q: "Can I use any refill amount to measure real fuel economy?"
    a: "Use the refill volume after driving between two comparable full-tank fills. A partial refill may not equal the fuel consumed over the measured distance."
  - q: "What are the input limits and rounding rules?"
    a: "Distance and fuel range from 0.001 to 1,000,000 with up to 3 decimals. Price ranges from 0 to 10,000,000 KRW/L with up to 2 decimals. Efficiency rounds to 2 decimals; costs round half up to whole KRW. Positive efficiency below 0.005 shows <0.01; positive costs below half a won show <1 KRW."
  - q: "How does a zero price differ from a blank price?"
    a: "Blank leaves cost results unavailable; zero means free fuel and displays zero costs. Every language uses KRW, without conversion to USD or JPY."
---

## Use this fuel economy calculator after a drive or refill
After a trip or a refill, you may want to know **your real fuel economy** and **how much that drive actually cost**.

This tool lets you enter:
- Distance traveled (km)
- Fuel used (L)
- Fuel price per liter (optional)

Then it instantly shows **fuel economy in km/L**, **fuel used per 100km (L/100km)**, **total fuel cost**, and **fuel cost per km** on one screen.
Use it to keep a real-world mileage log after refueling, or to estimate fuel cost before a longer drive.

## How it works
1. `Distance ÷ Fuel used = km/L`
2. `100 ÷ km/L = L/100km`
3. `Fuel used × Price per liter = Total fuel cost`
4. `Total fuel cost ÷ Distance = Cost per km`

All calculations run in your browser. If fuel price is blank, the calculator still shows km/L and L/100km first.

## Examples
### Example 1) Check trip fuel economy
- Distance: 420km
- Fuel used: 28L
- Price per liter: 1,720 KRW

→ Fuel economy: **15.00 km/L**  
→ Fuel use per 100km: **6.67 L**  
→ Total fuel cost: **48,160 KRW**  
→ Fuel cost per km: **about 115 KRW**

### Example 2) Compare vehicle running cost
For the same 100km drive:
- Vehicle A: 12km/L
- Vehicle B: 16km/L

Vehicle B uses less fuel for the same distance, so the fuel-cost gap becomes more noticeable if you often take long trips.

## Especially useful for
- Checking how your real-world fuel economy compares with official mileage
- Estimating fuel cost before a long drive
- Logging cost per trip in a car expense tracker
- Comparing running costs between two vehicles
- Rechecking whether fuel receipt liters and price per liter match the total paid

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
If fuel economy looks too low or too high, check whether distance and fuel were swapped, and confirm that the distance is in km rather than meters or miles. The calculator also warns when the result is unusual for a typical passenger car.

## Summary
This fuel economy calculator quickly turns distance and fuel volume into a realistic driving-cost view.
Enter the numbers from your latest refill to check both mileage and fuel cost in one place.


## Real-world fuel measurement and input rules
Distance and fuel consumed must cover the same trip interval. Fill the tank, record distance driven, then fill to the same level again and use that refill volume. A partial refill receipt may not reflect the fuel actually consumed. Future trip estimates require both estimated distance and estimated fuel consumed. The linked unit converter currently covers length, weight and temperature, not fuel volume.

### Can I use any refill amount to measure real fuel economy?
Use the refill volume after driving between two comparable full-tank fills. A partial refill may not equal the fuel consumed over the measured distance.

### What are the input limits and rounding rules?
Distance and fuel range from 0.001 to 1,000,000 with up to 3 decimals. Price ranges from 0 to 10,000,000 KRW/L with up to 2 decimals. Efficiency rounds to 2 decimals; costs round half up to whole KRW. Positive efficiency below 0.005 shows &lt;0.01; positive costs below half a won show &lt;1 KRW.

### How does a zero price differ from a blank price?
Blank leaves cost results unavailable; zero means free fuel and displays zero costs. Every language uses KRW, without conversion to USD or JPY.
