---
layout: tool
lang: en
title: Average Speed Calculator | Calculate km/h and pace from distance and time
description: Enter distance, hours, or total minutes to calculate average speed in km/h, pace per kilometer, total time, and estimated 5K/10K finish times with safer input checks.
permalink: /en/tools/average-speed-calculator/
canonical_url: /en/tools/average-speed-calculator/
category: calculator
category_label: Travel/Lifestyle
thumbnail: /assets/thumbs/en/average-speed-calculator.svg
image:
  path: /assets/thumbs/en/average-speed-calculator.svg
  alt: Average speed calculator preview
tool_key: average-speed-calculator
keywords: [average speed calculator, kmh calculator, pace calculator, running pace, distance time speed]
related_tools: [unit-converter, average-calculator, work-end-time-calculator]
faq:
  - q: What is the difference between km/h and pace?
    a: km/h shows how far you move in one hour, while pace shows how long it takes to cover one kilometer.
  - q: Can I enter minutes only?
    a: Yes. You can leave hours blank and enter values such as 90 minutes. The tool treats them as total minutes.
  - q: What do the estimated 5K and 10K times mean?
    a: They are simple projections based on keeping the same average speed throughout the whole distance.
  - q: Which inputs show an error?
    a: Distance must be greater than 0 and no more than 100,000 km. Hours and minutes must be non-negative whole numbers, and total time must be greater than 0.
alternate_urls:
  ko: /tools/average-speed-calculator/
  en: /en/tools/average-speed-calculator/
  ja: /ja/tools/average-speed-calculator/
---

## Quickly calculate your average speed and pace
When you walk, run, cycle, or travel,
it is useful to know **how fast you actually moved**.

This tool converts distance and time into
**average speed (km/h)**, **pace per kilometer**, **total time**, and even **estimated 5K and 10K times**.
If you only know total minutes, you can enter 90 minutes directly without converting it to 1 hour 30 minutes first.

## Key features
- Calculate average speed from distance and time
- Automatically show pace per kilometer
- Support total-minute entries greater than 59
- Flag empty, negative, decimal time, and zero-duration inputs
- Estimate 5K and 10K times from the same speed
- Load an example, clear inputs, and copy valid results
- Useful for running, walking, cycling, and trip planning

## How to use it
1. Enter the travel distance in kilometers.
2. Enter the total time in hours and minutes. For 90 minutes, you can leave hours blank and enter `90` in minutes.
3. Check average speed and pace.
4. Use the projected 5K and 10K times as quick references.

## Formula
- Average speed (km/h) = **distance ÷ total time in hours**
- Pace (min/km) = **total time in minutes ÷ distance**
- Estimated finish time = **pace × target distance**

For example, if you travel 10 km in 1 hour,
your average speed is **10 km/h** and your pace is **6:00 per km**.

If you run 10 km in 52 minutes, the result is about **11.54 km/h** with a **5:12/km** pace. The 5K and 10K estimates are simple conversions from that same pace.

## Input checks
- Distance must be greater than 0 and no more than 100,000 km.
- Hours and minutes must be non-negative whole numbers.
- Minutes can be greater than 59, so `90` minutes is valid.
- Total time must be greater than 0 because speed and pace cannot be calculated from zero time.

## Related tools
- [Unit Converter]({{ '/en/tools/unit-converter/' | relative_url }})
- [Average Calculator]({{ '/en/tools/average-calculator/' | relative_url }})
- [Work End Time Calculator]({{ '/en/tools/work-end-time-calculator/' | relative_url }})

## FAQ
### Which value is more useful: km/h or min/km?
km/h is often easier for vehicles and general travel, while min/km is more intuitive for running and pace-based training.

### Can I enter decimal distances?
Yes. Distances such as 3.5 km or 42.195 km work fine.

### Does 90 minutes become 1 hour 30 minutes?
Yes. Minute values are treated as total minutes, so 90 minutes is calculated as 1 hour 30 minutes.

### Are the estimated times official race predictions?
No. They are simple projections based on your entered average speed and should be used as rough references only.
