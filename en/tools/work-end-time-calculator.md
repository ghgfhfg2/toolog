---
layout: tool
title: Work End Time Calculator | Lunch breaks and overnight shifts
description: Calculate clock-out time from start time, actual work hours, and lunch or break minutes. Includes nearest-minute rounding, next-day shifts, total time on site, and a copyable summary.
lang: en
permalink: /en/tools/work-end-time-calculator/
canonical_url: /en/tools/work-end-time-calculator/
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

## When is a work end time calculator useful?
You started work, but it’s often unclear **what time you can actually leave**.
It gets harder to estimate by feel when flexible schedules, shifts, and off-site work are mixed.

Enter **start time + actual work hours + unpaid break time** to see the estimated clock-out time and total stay. You can enter 7 hours 30 minutes as `7.5`, and overnight shifts show a next-day indicator.

## Key features
- Enter start time (HH:MM)
- Combined calculation of target work hours (hours) + break time (minutes)
- Automatic estimated clock-out time
- Displays total stay time (work + break) and next-day indicator
- Quick examples for daytime and night shifts, plus result copy
- Clear errors for negative breaks, fractional break minutes, and stays over 24 hours

## Example
- Start time: 09:00
- Work hours: 8
- Break time: 60 minutes

→ Estimated clock-out time: **18:00**

For an overnight example, start at `22:00`, work `8` hours, and enter a `60`-minute break. The result is **07:00 the next day**.

## Calculation assumptions
The formula is `start time + actual work time + unpaid break time`. Do not add a paid break again if it is already included in work hours. Overtime, early leave, local labor rules, and workplace policies are not applied automatically; confirm the result against your attendance record.

## Good tools to use together
- Check a worked interval: [Time Difference Calculator]({{ '/en/tools/time-difference-calculator/' | relative_url }})
- Plan when to leave: [Appointment Departure Buffer Simulator]({{ '/en/tools/appointment-departure-buffer-simulator/' | relative_url }})
- Focus block routine: [Pomodoro Timer]({{ '/en/tools/pomodoro-timer/' | relative_url }})

## FAQ
### What if I take multiple breaks?
Even if breaks are split (like lunch + short rests), enter the total number of minutes.

### Why can my actual end time differ?
Overtime, delayed meetings, or extra breaks can make real clock-out time different from the estimate.

### Can I use it on mobile?
Yes. It runs directly in your browser with no installation required.

### How do I enter 7 hours 30 minutes?
Enter `7.5` in actual work hours. Total stay is displayed again in hours and minutes.

## How to calculate clock-out time with a lunch break
1. Enter your start time and actual work hours, excluding unpaid breaks.
2. Add up unpaid lunch and rest periods in whole minutes; enter `0` if there are none.
3. Read the clock-out time, total time on site, and same-day or next-day indicator. Copy the summary if needed.

For example, starting at **09:00** with **7.5 hours** of work and a **45-minute** lunch gives **17:15**, with **8 hours 15 minutes** on site. Do not add paid breaks again if they are already counted as work time.

### Can I leave break time blank?
No. A blank field is not treated as zero. Enter `0` for no break. If any required field is empty or invalid, the previous result and summary are cleared and copying is disabled, so an outdated result is not reused.

### How are decimal work hours rounded?
`7.33` hours equals 439.8 minutes, rounded to **440 minutes (7 hours 20 minutes)**. When rounding is needed, the applied minutes appear both on screen and in the copyable result. Work hours must be **0.25–24**, breaks must be **0–600 whole minutes**, and rounded work time plus breaks must not exceed **24 hours**. Correct invalid entries to calculate again.

### What happens at midnight or exactly 24 hours later?
Starting at `22:00` with `1` hour of work and a `60`-minute break gives **00:00 the next day**. Starting at `09:00` with `24` work hours and `0` break minutes gives **09:00 the next day**. This is clock-time arithmetic; calendar dates, time zones, and daylight saving changes are not applied.

### What if automatic copying is unavailable?
Select the result summary field and copy it manually. Reset clears both the inputs and the summary.
