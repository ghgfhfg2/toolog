---
layout: tool
title: Meeting Action Item Extractor | Pull owners, due dates, decisions, and questions
description: Paste meeting notes or chat logs to extract owner hints, due-date hints, decisions, open questions, and review points into a checklist, compact share note, or Markdown table in your browser.
lang: en
permalink: /en/tools/meeting-action-item-extractor/
canonical_url: /en/tools/meeting-action-item-extractor/
alternate_urls:
  ko: /tools/meeting-action-item-extractor/
  en: /en/tools/meeting-action-item-extractor/
  ja: /ja/tools/meeting-action-item-extractor/
category: productivity
category_label: Work/Meeting Notes
thumbnail: /assets/thumbs/en/meeting-action-item-extractor.svg
image:
  path: /assets/thumbs/en/meeting-action-item-extractor.svg
  alt: Meeting Action Item Extractor thumbnail
tool_key: meeting-action-item-extractor
tool_type: utility
topic_cluster: work
keywords: [meeting action items, meeting notes checklist, meeting minutes action item extractor, task extractor, follow-up checklist]
related_tools: [priority-decision-matrix-planner, deadline-backward-planner, schedule-coordination-message-generator]
faq:
  - q: Does this understand notes like an AI minutes tool?
    a: No. It is a browser-side utility that uses keywords and line patterns to organize follow-up candidates. Review important minutes manually.
  - q: Are my meeting notes sent to a server?
    a: No. The text is processed in your current browser only and is not stored or uploaded.
  - q: What note style works best?
    a: Lines that include owner names, TODO, decision, question, by Friday, or due-date words are easier to extract.
  - q: Can I turn meeting notes into a table?
    a: Yes. Choose the Markdown table format to organize each action item with item, owner, and due-date columns for Notion, docs, or team notes.
  - q: What happens if no clear item is found?
    a: The result shows an empty-state message and suggests adding clearer owner, due-date, decision, or question wording.
---

## Why use the Meeting Action Item Extractor?
After a meeting, the most common gap is simple: who will do what, and by when? Rough notes often mix decisions, questions, and follow-up work, so action items can be missed.

This tool turns pasted notes or meeting chat logs into a **browser-side follow-up checklist with owner hints, due-date hints, decisions, open questions, and review points**. It is not a full AI minutes system; it is a lightweight action item extractor for quick cleanup right after a meeting.

## How to use it
1. Paste rough meeting notes, chat logs, or bullet-style minutes.
2. Add known owner names, one per line, if you want better owner detection.
3. Choose whether to include decisions and open questions in the output.
4. Choose a detailed checklist, compact share note, or Markdown table result.
5. Click Extract action items and review no-owner, no-due-date, and weak-candidate labels.
6. Copy the result into Slack, Notion, email, or your team messenger.

## Especially useful when
### 1) Sharing follow-up work right after a meeting
Lines with owners and due dates are highlighted first, making it easier to share the next steps while the context is still fresh.

### 2) Cleaning up chat-based meeting logs
TODO, decision, question, and due-date words are grouped into a checklist so you do not have to reread a long thread.

### 3) Finding missing owners or deadlines
Items marked as no owner or no due date show where extra clarification is needed.

### 4) Turning rough minutes into a copy-ready checklist
If you search for a meeting notes checklist or meeting minutes action item extractor, this page is meant for the small step between raw notes and a shareable follow-up list.

### 5) Pasting action items into Notion or a document
The Markdown table format creates item, owner, and due-date columns so rough notes can become a simple meeting follow-up table.

## Example input
The extractor works best when each line contains one task, decision, or question:

```text
- Mina: revise onboarding copy by Friday
- Alex to draft the support FAQ by next Monday
- Decision: do not send the beta announcement this week
- Question: how many days before trial end should we notify users?
```

Long paragraphs are split into reviewable sentences when possible, but you should still confirm owners and deadlines before sharing the result.

## Related tools
- Need to rank several follow-up tasks? [Priority Decision Matrix Planner]({{ '/en/tools/priority-decision-matrix-planner/' | relative_url }})
- Need to work backward from a deadline? [Deadline Backward Planner]({{ '/en/tools/deadline-backward-planner/' | relative_url }})
- Need to send a scheduling follow-up? [Schedule Coordination Message Generator]({{ '/en/tools/schedule-coordination-message-generator/' | relative_url }})

## FAQ
### Does it support every meeting note format?
It works best when each line contains one idea, such as a bullet, a TODO, a decision, or a question.

### How does owner detection work?
It checks clear patterns such as `Mina:`, `@Alex`, and names from the optional owner list. Ambiguous lines stay unassigned.

### Can I share the result as-is?
Review owners, dates, and decisions before sharing. Remove sensitive information if the notes will leave your team.

### Why does it show no owner or no due date?
The extractor keeps ambiguous lines in the checklist but labels missing details so you can confirm them before sending the follow-up.

## Summary
Meeting Action Item Extractor is a **utility-style tool that turns rough meeting notes into a follow-up checklist**.
