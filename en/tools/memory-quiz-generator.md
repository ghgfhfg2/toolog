---
layout: tool
title: Memory Quiz Generator | Turn notes into self-test flashcards
description: Turn up to 200 prompt-answer pairs into shuffled self-test cards, reveal and self-grade each answer, skip uncertain cards, retry missed items, and copy a review list in your browser.
lang: en
permalink: /en/tools/memory-quiz-generator/
canonical_url: /en/tools/memory-quiz-generator/
category: study
category_label: Study/Learning
thumbnail: /assets/thumbs/memory-quiz-generator.svg
image:
  path: /assets/thumbs/memory-quiz-generator.svg
  alt: Memory quiz generator thumbnail
tool_key: memory-quiz-generator
tool_type: learning
topic_cluster: study
keywords: [memory quiz generator, self test cards, vocabulary quiz maker, study note quiz, flashcard alternative]
related_tools: [pomodoro-timer, readability-checker, text-counter]
faq:
  - q: "What input formats work?"
    a: "One card per line works best. You can separate prompt and answer with `=`, `:`, a tab, or a comma."
  - q: "Is it only for vocabulary study?"
    a: "No. It also works for interview prep, history facts, product knowledge, and any prompt-answer style notes."
  - q: "Does it auto-grade typed answers?"
    a: "This version is designed for fast self-testing. You reveal the answer and mark each card as correct or incorrect yourself."
  - q: "What are the input and card limits?"
    a: "Input is limited to 20,000 characters and each quiz uses up to 200 valid cards. A prompt may contain up to 300 characters and an answer up to 1,000."
  - q: "Are my study notes uploaded or stored?"
    a: "No. Parsing, shuffling, scoring, and review-list creation run in your current browser and the tool does not save your cards to a server."
---

## Why use it?
Reading notes again and again is not the same as recalling them.
This tool turns a simple list of prompts and answers into a lightweight quiz flow so you can test memory instead of only rereading.

## How to use it
1. Paste one prompt-answer pair per line.
2. Use `=` or a tab as the safest separator, then click create quiz.
3. Read the prompt and try answering first.
4. Reveal the answer.
5. Mark it correct or incorrect.
6. Skip uncertain cards when needed, then review or retry missed and skipped cards.

## Input validation and limits
- Blank lines are ignored and exact duplicate prompt-answer pairs are removed.
- Lines with no separator or an empty side are reported instead of becoming broken cards.
- A quiz uses the first 200 valid cards and reports when extra cards were omitted.
- Pasted HTML is displayed as text, so tags and scripts do not run inside the review list.
- Correct and wrong controls stay disabled until you reveal the answer.

## Good use cases
- vocabulary drills
- exam review
- interview question practice
- team training and product knowledge refresh

## Related tools
- For focused study blocks: [Pomodoro Timer]({{ '/en/tools/pomodoro-timer/' | relative_url }})
- For cleaning up dense notes: [Readability Checker]({{ '/en/tools/readability-checker/' | relative_url }})
- For checking raw note length: [Text Counter]({{ '/en/tools/text-counter/' | relative_url }})

## FAQ
### Can I use commas or colons as separators?
Yes, but `=` or a tab is safer when a prompt itself contains punctuation. The tool preserves punctuation after the selected separator inside the answer.

### Can I retry only the cards I missed?
Yes. When the quiz ends, wrong and skipped cards appear in the review list and can be restarted as a smaller quiz.
