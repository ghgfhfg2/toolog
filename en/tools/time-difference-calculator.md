---
layout: tool
lang: en
permalink: /en/tools/time-difference-calculator/
alternate_urls:
  ko: /tools/time-difference-calculator/
  en: /en/tools/time-difference-calculator/
  ja: /ja/tools/time-difference-calculator/
title: Time Difference Calculator | Next Day, Breaks & Net Decimal Hours
description: Calculate elapsed time and net working hours between two clock times. Add 24 hours for next-day endings, deduct breaks, and copy total minutes and net decimal hours.
category: productivity
category_label: Schedule/Productivity
thumbnail: /assets/thumbs/en/time-difference-calculator.svg
image:
  path: /assets/thumbs/en/time-difference-calculator.svg
  alt: Time Difference Calculator thumbnail
tool_key: time-difference-calculator
keywords: [time difference calculator, elapsed time calculator, hours between times, work hours calculator with breaks, net decimal hours]
related_tools: [work-end-time-calculator, d-day-calculator, pomodoro-timer]
faq:
- q: When does next-day mode add 24 hours?
  a: It always adds 24 hours to the end time. 09:00 to 18:00 tomorrow is 33 hours. An earlier end time without next-day mode produces an error.
- q: What if the start and end times match?
  a: The same day gives 0 hours; next day gives 24 hours. The maximum span is 47 hours 59 minutes, from 00:00 to 23:59 tomorrow.
- q: Can a break exceed elapsed time?
  a: No. The tool shows an error and clears previous results and disables copying instead of silently forcing net time to zero. A break equal to elapsed time gives zero net hours.
- q: Which decimal value excludes breaks?
  a: Use net decimal hours. For 9 elapsed hours and a 30-minute break, this is 8.5 hours. Elapsed decimal hours are shown separately.
- q: What if automatic copying fails?
  a: A copy error is shown. Select the results and copy manually. The summary includes start/end times, date handling, breaks, and both decimal-hours values.
canonical_url: /en/tools/time-difference-calculator/
---

## Calculate hours between times, minus breaks

Enter two clock times to see elapsed time, total minutes, elapsed decimal hours, and net time after breaks. Useful for work logs, meetings, and study sessions. Calculations stay in your browser.

## How to use

1. Enter start and end times in hours and minutes (00:00–23:59).
2. Select **End time is on the next day** whenever the end belongs to tomorrow, even if its clock time is later.
3. Enter whole break minutes from 0 to 1,440. Blank means zero; a break longer than elapsed time is an error.
4. Copy the result, load a workday/overnight/meeting example, or use **Clear all** to empty the inputs and results.

## Empty inputs and error messages

Enter both times to get a result. Missing or invalid inputs clear previous results and disable **Copy result**, so you cannot accidentally copy an outdated calculation. **Clear all** returns the tool to this empty state.

If the end time is earlier than the start, select **End time is on the next day** only when the interval really crosses midnight. Breaks must be whole minutes from 0 to 1,440 and cannot exceed elapsed time. Correct the input to calculate again; the tool does not silently shorten an excessive break.

## Examples

09:00 → 18:00 with a 60-minute break: 9 elapsed hours, 8 net hours, 8 net decimal hours.

23:30 → 01:00 next day: 1 hour 30 minutes. **09:00 → 18:00 next day is 33 hours**.

## Formula and limits

Elapsed minutes = end minutes − start minutes + 1,440 if next day is selected. Net minutes = elapsed minutes − break minutes. Each decimal-hours value is its minutes ÷ 60, rounded to 4 decimal places.

This tool calculates clock-time differences without selecting calendar dates. It does not account for time zones or daylight saving time and is not a legal payroll calculator for breaks, allowances, or overtime. For timezones use the [timezone converter](/en/tools/timezone-converter/).

## FAQ

### When does next-day mode add 24 hours?

It always adds 24 hours to the end time. 09:00 to 18:00 tomorrow is 33 hours. An earlier end time without next-day mode produces an error.

### What if the start and end times match?

The same day gives 0 hours; next day gives 24 hours. The maximum span is 47 hours 59 minutes, from 00:00 to 23:59 tomorrow.

### Can a break exceed elapsed time?

No. The tool shows an error and clears previous results and disables copying instead of silently forcing net time to zero. A break equal to elapsed time gives zero net hours.

### Which decimal value excludes breaks?

Use net decimal hours. For 9 elapsed hours and a 30-minute break, this is 8.5 hours. Elapsed decimal hours are shown separately.

### What if automatic copying fails?

A copy error is shown. Select the results and copy manually. The summary includes start/end times, date handling, breaks, and both decimal-hours values.

## Related tools

- [Work end time calculator]({{ '/en/tools/work-end-time-calculator/' | relative_url }})
- [D-day calculator]({{ '/en/tools/d-day-calculator/' | relative_url }})
- [Pomodoro timer]({{ '/en/tools/pomodoro-timer/' | relative_url }})
