---
layout: tool
title: Meeting Agenda Generator | Build a timed meeting agenda
description: Enter a duration, goal, and topics to build a timed meeting agenda whose opening, discussion blocks, and closing add up exactly. Copy a 15, 30, 45, or 60-minute agenda.
lang: en
permalink: /en/tools/meeting-agenda-generator/
canonical_url: /en/tools/meeting-agenda-generator/
category: productivity
category_label: Work/Productivity
thumbnail: /assets/thumbs/en/meeting-agenda-generator.svg
image:
  path: /assets/thumbs/en/meeting-agenda-generator.svg
  alt: Meeting agenda generator thumbnail
tool_key: meeting-agenda-generator
keywords: [meeting agenda generator, timed meeting agenda, agenda maker, meeting time allocation, meeting outline tool, team meeting agenda]
related_tools: [meeting-action-item-extractor, meeting-action-item-organizer, schedule-coordination-message-generator, text-counter]
faq:
  - q: Does this tool create meeting minutes too?
    a: No. It is designed for pre-meeting agenda drafting. Meeting minutes should still be written after the meeting based on decisions and action items.
  - q: How is time allocated across agenda items?
    a: It reserves about 15% each for opening and closing, capped at 1 to 5 minutes, then distributes the remaining whole minutes evenly. Every block always adds up to the duration entered.
  - q: Is it only for team meetings?
    a: No. It also works well for project updates, client calls, retrospectives, 1:1s, and interviews.
  - q: Is my meeting information stored?
    a: No. Inputs and agenda generation stay in your browser and are not sent to or stored on a server.
---

## Why use a meeting agenda generator?
Meetings usually run long when the structure is vague.
If the goal is unclear, topics are scattered in chat, and no one knows how much time each item deserves, even a short meeting can easily drift.

This tool helps you build a practical agenda draft from just a few inputs:
- meeting type
- duration
- participants
- goal
- key topics

## How it works
1. Choose a meeting type.
2. Enter the total meeting duration.
3. Add participants or teams if needed.
4. Write the meeting goal in one line.
5. Enter one key topic per line.

Use a whole-number duration from 5 to 480 minutes and enter up to 20 unique topics. Blank lines and case-only duplicates are removed automatically. The generator then creates an opening, timed topic blocks, a closing section, and—if selected—owner and follow-up fields.

## What it creates
The generated output includes:
- a simple meeting title
- purpose and attendees
- opening section
- time blocks for each topic
- closing / next action section
- optional owner / follow-up block

That makes it easy to paste into chat, calendar descriptions, or meeting notes.

## Good use cases
### Weekly syncs
Create a repeatable structure for short recurring meetings.

### Project updates
Organize status, decisions, blockers, and next steps in a cleaner flow.

### Client meetings
List your questions and priorities before the meeting starts.

### 1:1s and interviews
Keep the conversation focused without sounding too rigid.

## Examples
### 30-minute weekly sync
- Meeting type: Weekly sync
- Duration: 30 minutes
- Goal: Align next sprint priorities and blockers
- Topics:
  - Progress update
  - Decisions needed
  - Risks / blockers

The result uses exact elapsed-time ranges: **4 minutes to open + 8, 7, and 7 minutes for the topics + 4 minutes to close = 30 minutes**.

### 45-minute project update
- Meeting type: Project kickoff / update
- Duration: 45 minutes
- Goal: Resolve the remaining decisions before launch
- Topics:
  - Schedule changes
  - QA issue priorities
  - Pre-deployment checklist

The generated draft is formatted for easy pasting into team chat, a calendar description, or meeting notes.

## Related tools
- Extract follow-ups after the meeting: [Meeting Action Item Extractor]({{ '/en/tools/meeting-action-item-extractor/' | relative_url }})
- Organize owners and due dates: [Meeting Action Item Organizer]({{ '/en/tools/meeting-action-item-organizer/' | relative_url }})
- Draft an attendance request: [Schedule Coordination Message Generator]({{ '/en/tools/schedule-coordination-message-generator/' | relative_url }})
- Check the agenda length: [Text Counter]({{ '/en/tools/text-counter/' | relative_url }})

## FAQ
### Can I use the output as-is?
Yes, for a draft. But it is still best to adjust wording and priorities for the actual meeting context.

### Does it work for short meetings too?
Yes. The opening, closing, and every topic need at least one minute. The tool rejects a duration that cannot fit those blocks and warns when any topic gets under three minutes.

### Why does a follow-up section matter?
Because meetings feel much more useful when the next owner and action are visible at the end.

### Is my meeting information stored?
No. Everything is processed in your browser and disappears when you leave or refresh the page.

## Summary
This meeting agenda generator is a quick way to clarify the purpose of a meeting and keep every discussion within the planned time. Use it before a short team sync, client call, interview, or project meeting to create a structured, shareable agenda.
