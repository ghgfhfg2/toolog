---
layout: tool
title: Lucky Draw Picker | Random Winner Generator
description: Enter a participant list and winner count to instantly draw random winners without duplicates. Great for giveaways, team assignment, and speaker order.
lang: en
permalink: /en/tools/lucky-draw-picker/
canonical_url: /en/tools/lucky-draw-picker/
category: productivity
category_label: Schedule/Productivity
thumbnail: /assets/thumbs/lucky-draw-picker.svg
tool_key: lucky-draw-picker
image:
  path: /assets/thumbs/lucky-draw-picker.svg
  alt: Lucky draw picker preview
keywords: [lucky draw picker, random winner generator, raffle picker, random selector, team randomizer]
related_tools: [d-day-calculator, pomodoro-timer]
faq:
  - q: What if the same name appears multiple times?
    a: It trims spaces and removes duplicate names before drawing. Even if a name appears more than once, it is treated as one person.
  - q: What if winner count is larger than participant count?
    a: The winner count is automatically capped at the number of participants.
  - q: Is each draw result different?
    a: Yes. It uses browser crypto randomness, so each draw is random.
alternate_urls:
  ko: /tools/lucky-draw-picker/
  en: /en/tools/lucky-draw-picker/
  ja: /ja/tools/lucky-draw-picker/
---

## Try the Lucky Draw Picker in these situations
- **Pick giveaway winners** from comments or applicants
- **Randomize speaking order** in study groups or meetings
- **Assign teams randomly** for projects or activities

Just paste names and set winner count. You get results instantly.

## How to use
1. Enter one participant name per line
2. Enter winner count
3. Click **Draw Winners**

Results are shown in numbered order, and you can quickly share them with **Copy Results**.

## Draw rules
- Trim leading/trailing spaces
- Ignore empty lines
- Remove duplicate names
- Auto-adjust winner count to the range `1 ~ number of participants`

## Good tools to use together
- Date countdown: [D-Day Calculator]({{ '/en/tools/d-day-calculator/' | relative_url }})
- Focus timer: [Pomodoro Timer]({{ '/en/tools/pomodoro-timer/' | relative_url }})

## FAQ
### Does input order affect winning probability?
No. Everyone has the same probability regardless of input order.

### Does it work on mobile?
Yes. It runs in the browser, so it works on both mobile and desktop.

### Is participant data sent to a server?
No. The draw runs entirely in your browser and does not send the list externally.
