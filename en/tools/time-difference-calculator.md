---
layout: tool
title: Time Difference Calculator | Hours, Minutes, Breaks, and Overnight Time
description: Enter start time, end time, break minutes, and next-day mode to calculate elapsed time, net time, total minutes, decimal hours, and date handling instantly.
category: productivity
category_label: Schedule/Productivity
thumbnail: /assets/thumbs/en/time-difference-calculator.svg
image:
  path: /assets/thumbs/en/time-difference-calculator.svg
  alt: Time Difference Calculator thumbnail
tool_key: time-difference-calculator
keywords: [time difference calculator, elapsed time calculator, time gap calculator, hours between times, work time calculator]
related_tools: [work-end-time-calculator, d-day-calculator, pomodoro-timer]
faq:
  - q: What if the end time is earlier than the start time?
    a: Turn on the next-day option to calculate it as passing midnight. For example, 23:30 to 01:00 becomes 1 hour 30 minutes.
  - q: Can I subtract break time?
    a: Yes. Enter break time in minutes and the tool will also show net working time after subtracting it from the total elapsed time.
  - q: Can I see the result in decimal hours too?
    a: Yes. For example, 1 hour 30 minutes is also shown as 1.5 hours.
  - q: What happens if the end time is earlier and next-day mode is off?
    a: The tool does not show a negative duration. It asks you to turn on next-day mode if the time range crosses midnight.
  - q: What if break time is longer than elapsed time?
    a: Net time is capped at 0 minutes and the page shows a warning.
canonical_url: /en/tools/time-difference-calculator/
---

## When is a time difference calculator useful?
You often need to know **exactly how many hours and minutes** lie between two times.
That comes up in work logs, shift checks, study tracking, meeting duration reviews, and schedule planning.

This tool lets you enter **start time + end time** and instantly shows:
- elapsed time
- total minutes
- decimal hours
- net time after breaks
- same-day or next-day handling

It is designed for quick browser-side checks: leave the fields empty and it simply waits for input, enter an end time earlier than the start and it explains when to use next-day mode, and enter too much break time and it caps net time at 0 instead of showing a negative work duration.

## Key features
- Start time / end time input
- Next-day calculation for crossing midnight
- Elapsed hours and minutes
- Break-minute subtraction for net time
- Guardrails for empty input, earlier end times, and excessive break minutes
- Workday, past-midnight, and meeting presets
- Copy result button

## Good use cases
### Work logs with breaks
Use it to check the difference between clock-in and clock-out times, then subtract a lunch break or rest time.

### Overnight schedules
For 23:30 to 01:00, turn on next-day mode so the result becomes 1 hour 30 minutes instead of an invalid negative range.

### Meeting and study tracking
The total minutes and decimal hours are useful when pasting results into a spreadsheet, timesheet, or study log.

## How to use it
1. Enter the start time and end time.
2. Add break minutes if you want net time after breaks.
3. Turn on next-day mode only when the time range crosses midnight.
4. Review elapsed time, net time, total minutes, decimal hours, and date handling.
5. Copy the result when you need to paste it into a timesheet, note, or spreadsheet.

## Example
- Start: 09:00
- End: 18:00
- Break: 60 minutes

→ Elapsed time: **9 hours 0 minutes**
→ Net time: **8 hours 0 minutes**

Overnight example:

- Start: 23:30
- End: 01:00
- End time is on the next day: on

→ Elapsed time: **1 hour 30 minutes**

## How it works
- Elapsed time = end time − start time
- If next-day mode is on, the end time is treated as **the following day**
- Net time = elapsed time − break time
- Decimal hours = total minutes ÷ 60
- If break time is longer than elapsed time, net time is capped at 0 minutes

## Related tools
- Estimate when work ends: [Work End Time Calculator]({{ '/en/tools/work-end-time-calculator/' | relative_url }})
- Count days between dates: [D-Day Calculator]({{ '/en/tools/d-day-calculator/' | relative_url }})
- Run focused work blocks: [Pomodoro Timer]({{ '/en/tools/pomodoro-timer/' | relative_url }})

## FAQ
### What happens when start and end time are the same?
With next-day mode off, the result is 0 hours 0 minutes. With next-day mode on, the result is calculated as 24 hours.

### What if break time is longer than elapsed time?
Net time is capped at 0 minutes. The tool does not display negative working time.

### Does it automatically assume next day when the end time is earlier?
No. The earlier end time might be a typo, so the tool shows an error first. Turn on next-day mode when the range really crosses midnight.

### What does the copied result include?
It includes elapsed time, net time, total minutes, decimal hours, deducted break time, and date handling.

### Can I use it on mobile?
Yes. It runs directly in the browser and does not require installation.
