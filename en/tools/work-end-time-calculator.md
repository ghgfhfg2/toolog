---
layout: tool
title: Work End Time Calculator | Lunch breaks and overnight shifts
description: Calculate clock-out time from start time, actual work hours, and lunch or break minutes. Includes nearest-minute rounding, next-day shifts, total time on site, and a copyable summary.
lang: en
permalink: /en/tools/work-end-time-calculator/
canonical_url: https://toolog.sooyadev.com/en/tools/work-end-time-calculator/
category: productivity
category_label: Schedule/Productivity
thumbnail: /assets/thumbs/work-end-time-calculator.svg
tool_key: work-end-time-calculator
image:
  path: /assets/thumbs/work-end-time-calculator.svg
  alt: Work end time calculator preview
keywords: [work end time calculator, clock-out time calculator, work hours calculator, break time calculator]
related_tools: [time-difference-calculator, appointment-departure-buffer-simulator, pomodoro-timer]
faq:
  - q: Can I leave break time blank?
    a: No. Enter 0 if you take no unpaid break. For a 60-minute lunch and a 15-minute rest, enter 75. Blank or invalid inputs clear the previous result and disable copying.
  - q: How are decimal work hours rounded?
    a: Work hours are multiplied by 60 and rounded to the nearest minute. For example, 7.33 hours becomes 440 minutes (7 hours 20 minutes). A rounding note appears on screen and in the copyable summary.
  - q: How should I enter break time?
    a: Add your legal break and actual lunch/rest periods together, then enter the total in minutes.
  - q: Can it calculate next-day clock-out for night shifts?
    a: Yes. It can show next-day clock-out as long as total work + break time is within 24 hours.
  - q: Can I use this to manage the 52-hour weekly limit?
    a: This tool is for daily clock-out time estimation. For weekly cumulative tracking, use it with a spreadsheet or attendance system.
alternate_urls:
  ko: /tools/work-end-time-calculator/
  en: /en/tools/work-end-time-calculator/
  ja: /ja/tools/work-end-time-calculator/
---

## Find your finish time from your start time
**Start time + actual work duration + breaks not included in that duration = estimated finish time.** Starting at 09:00 with 8 actual work hours and a separate 60-minute lunch gives an 18:00 finish.

## Avoid counting lunch twice
If your target is 8 hours of actual work plus a 60-minute lunch, enter 8 hours and 60 minutes. Total time on site is 9 hours. If an 8-hour start-to-finish shift already includes that lunch, enter 7 actual work hours and 60 break minutes instead. Do not add a paid break again if it is already part of your target duration. Check the rules applying to your workplace; this tool does not assess legal compliance or overtime pay.

## Enter your schedule
1. Enter your actual start time.
2. Enter work duration excluding the separate break. Use `7.5` or the **7h 30m** button for seven and a half hours. Duration buttons preserve your existing start and break values.
3. Add separate lunch and rest periods in minutes: 45 + 15 means `60`. Enter `0` for no break; blank is not zero.
4. Read finish time, same/next day and total stay, then copy the summary.

## Three schedules to try
| Start | Actual work | Break | Finish | Total stay |
| --- | --- | --- | --- | --- |
| 09:00 | 8h | 60m | Same day 18:00 | 9h |
| 08:30 | 7h 30m | 60m | Same day 17:00 | 8h 30m |
| 22:00 | 8h | 60m | Next day 07:00 | 9h |

The schedule buttons load these cases. They are arithmetic examples, not recommended or legally prescribed shifts.

## Midnight and decimal hours
22:00 plus one work hour and a 60-minute break gives **next day 00:00**. `7.33` hours becomes 439.8 minutes, rounded to 440 minutes with a note in the result and copied text. `7.30` hours means 7h 18m, not 7h 30m.

Actual work supports 0.25–24 hours, breaks 0–600 whole minutes, and combined duration up to 24 hours. Exactly 24 hours later is the same time next day. Incomplete inputs clear the previous copyable result.

## What this does not calculate
This is clock-time addition without dates, holidays, time zones, daylight-saving transitions or workplace-specific credited hours. It does not calculate weekly totals or pay. If automatic copy is blocked, select the summary field and copy manually.

For elapsed time from actual records, use the [time difference calculator]({{ '/en/tools/time-difference-calculator/' | relative_url }}). For days until a deadline, use the [D-Day calculator]({{ '/en/tools/d-day-calculator/' | relative_url }}); for focused work blocks, use the [Pomodoro timer]({{ '/en/tools/pomodoro-timer/' | relative_url }}).
