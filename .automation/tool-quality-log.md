# Tool Quality Log

## 2026-07-21 21:00 KST
- Tool: `parking-fee-calculator`
- Selection reason: recent quality commits improved split-bill-calculator, loan-calculator, appointment-departure-buffer-simulator, and lunch-menu-picker; this older fee calculator still had high-risk numeric edge cases, auto-filled input that hid the empty state, weak long-stay daily-cap handling, and limited SEO around discounts/overnight parking.
- Scope: improved existing page copy, home metadata, mobile input layout, accessibility status labels, blank/error/success states, range validation, example/reset/copy flow, daily-cap mode, optional discount handling, and multilingual FAQ/internal links. No new tool was added.

## 2026-07-19 21:00 KST
- Tool: `loan-calculator`
- Selection reason: recent quality commits improved appointment-departure-buffer-simulator, lunch-menu-picker, message-tone-checker, filename-sanitizer, average-calculator, grocery-budget-checker, and date-format-normalizer; this older finance calculator still had high-risk numeric edge cases, auto-filled inputs that weakened the empty state, and room for clearer mobile comparison/copy flow.
- Scope: improved existing page copy, home metadata, accessibility labels, mobile layout classes, blank/error/success states, range validation, example/clear actions, copy failure handling, and multilingual FAQ SEO. No new tool was added.

## 2026-07-17 21:00 KST
- Tool: `lunch-menu-picker`
- Selection reason: recent quality commits focused on other tools, while this older picker still had localized pages producing Korean-only UI/results, weak copy-button state, and unclear fallback behavior when filters were too narrow.
- Scope: improved existing page copy, layout labels, accessibility status, localized result generation, fallback messaging, and mobile result readability. No new tool was added.
