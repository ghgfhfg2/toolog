---
layout: tool
title: Time Zone Converter | Repeated DST Times & Seoul–New York Meetings
description: Convert Seoul, New York, London and LA meeting times. Choose the first or second occurrence of repeated DST times, preserve the instant when swapping zones, and copy both IANA zones and UTC offsets.
lang: en
permalink: /en/tools/timezone-converter/
canonical_url: /en/tools/timezone-converter/
category: data
category_label: Data/Utilities
thumbnail: /assets/thumbs/timezone-converter.svg
image:
  path: /assets/thumbs/timezone-converter.svg
  alt: Timezone converter preview
tool_key: timezone-converter
keywords:
- timezone converter
- time difference calculator
- meeting time converter
- kst to est
- seoul new york time difference
- global meeting planner
related_tools:
- d-day-calculator
- pomodoro-timer
- unit-converter
faq:
- q: Does this timezone converter handle daylight saving time?
  a: Yes. It uses browser IANA timezone data. It rejects local times that do not exist when DST starts and lets you choose the first or second occurrence when a local time repeats as DST ends.
- q: What does the source time zone mean?
  a: The date and time you enter are interpreted as local time in the selected source zone.
- q: Can I copy the converted meeting time?
  a: Yes. Copy result includes both local dates and times, IANA time zone names and UTC offsets. Include the city or time zone when sharing an invitation to avoid ambiguity.
- q: Can I quickly convert Seoul to New York meeting times?
  a: Yes. Use the Seoul to New York preset to convert a Seoul reference time into New York local time immediately.
- q: Does swapping zones preserve a repeated DST time?
  a: Yes. On November 1, 2026, 06:30 UTC is the second 01:30 in New York (UTC-05:00). Swapping zones keeps that instant, rather than changing it to the first occurrence at 05:30 UTC. Copied results include both IANA zone names and UTC offsets.
- q: What dates and time precision are supported?
  a: Enter dates from January 1, 1970 through December 31, 2100 with minute precision. Empty input waits for a date; invalid dates, out-of-range years and seconds produce an error. Times skipped when DST starts are rejected. Updated browser timezone data is needed to reflect recent rule changes.
alternate_urls:
  ko: /tools/timezone-converter/
  en: /en/tools/timezone-converter/
  ja: /ja/tools/timezone-converter/
---

## Why use a timezone converter?
Plan cross-border calls with this **time zone converter**: check the Korea–US time difference, convert KST to Pacific Time, or find a Seoul–New York meeting time for a specific date.

The tool uses browser timezone data for DST-aware conversion. The result shows both local times, the target UTC offset (with both offsets in the copy-ready result), the difference between the two zones, and whether the target date stays the same, moves to the previous day, or moves to the next day.

## How to use
1. Choose the source time zone or tap a common pair.
2. Enter the source date and time.
3. Choose the target time zone. For a repeated DST time, select the first or second occurrence.
4. Check the converted local time and zone difference.
5. Copy the result for a calendar invite, chat message, or release note.

`Use current time` enters the current local time in the selected **source time zone**, not your device's time zone. The converter rejects local times skipped when DST starts. When a local time occurs twice as DST ends, you can choose the first or second occurrence. `Swap zones` reverses the source and target while preserving the same instant shown in the current result.

## Practical examples
- Confirm a weekly meeting time between a Seoul headquarters and a North American branch
- Check a partner meeting invite before sending it overseas
- Standardize launch or deadline announcements across regions
- Avoid confusion when early-morning or late-night meetings cross into another date

## Scheduling tips
- Include the timezone abbreviation or city name with the time in announcements.
- Recheck key meetings during DST transition weeks.
- For repeated local times when DST ends, verify the UTC offset in the calendar invite.
- Copy both local times and the zone difference to reduce AM/PM and date-change mistakes.
- When sharing a schedule, write both dates when needed, such as "May 31, 9:00 PM Korea time / May 31, 8:00 AM New York time."

## Related tools
- Text length for announcements: [Text Counter]({{ '/en/tools/text-counter/' | relative_url }})
- Date countdown: [D-Day Calculator]({{ '/en/tools/d-day-calculator/' | relative_url }})
- Focus session planning: [Pomodoro Timer]({{ '/en/tools/pomodoro-timer/' | relative_url }})
- Timezone data reference: [IANA Time Zone Database](https://www.iana.org/time-zones)

## Supported dates and precision
Enter dates from January 1, 1970 through December 31, 2100 with minute precision. Empty input waits for a date; invalid dates, out-of-range years and seconds produce an error. Times skipped when DST starts are rejected. Updated browser timezone data is needed to reflect recent rule changes.

### Empty input or an error?
Clear removes the previous result and disables copying until a valid time is entered. For an invalid date, enter a real date within 1970–2100 and omit seconds. If DST skips the source local time, choose another time; if it repeats, select the intended occurrence. Use current time fills the selected source zone, not your device zone.

## FAQ
### Does this timezone converter handle daylight saving time?
Yes. It uses browser IANA timezone data. A nonexistent local time is rejected, while a repeated local time lets you choose its first or second occurrence.

### What does the source time zone mean?
The date and time you enter are interpreted as local time in the selected source zone.

### Can I copy the converted meeting time?
Yes. Copy result includes both local dates and times, IANA time zone names and UTC offsets. Include the city or time zone when sharing an invitation to avoid ambiguity.

### Can I quickly convert Seoul to New York meeting times?
Yes. Use the Seoul to New York preset to convert a Seoul reference time into New York local time immediately.

### Does swapping zones preserve a repeated DST time?
Yes. On November 1, 2026, 06:30 UTC is the second 01:30 in New York (UTC-05:00). Swapping zones keeps that instant, rather than changing it to the first occurrence at 05:30 UTC. Copied results include both IANA zone names and UTC offsets.

## Summary
This timezone converter helps reduce one of the most common scheduling mistakes in global communication: mixing up time zones, DST, or date changes.
