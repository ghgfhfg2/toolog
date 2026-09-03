# Tool Quality Log

## 2026-09-03 21:00 KST
- Tool: `profit-margin-calculator`
- Selection reason: recent quality work covered `savings-interest-calculator`, `list-format-converter`, `volumetric-weight-calculator`, `recycling-sorting-checker`, and `movie-seat-choice-simulator`; this older calculator still auto-filled inputs instead of showing an empty state, accepted negative/out-of-range target margins through script paths, lacked robust large-number and copy-error handling, and did not distinguish margin from markup.
- Scope: improved the existing multilingual page, home metadata, accessible labels/status, mobile layout, blank/error/profit/loss states, strict amount and target-margin validation, safe target-price rounding, overflow protection, presets, example/clear/copy flow, markup calculation, formulas, FAQ, related links, and search-intent copy. No new tool was added.
- Validation: YAML/front matter parsing, the 98-tool multilingual integrity check, `node --check`, `git diff --check`, tool-count preservation, mobile CSS rules, and targeted blank/normal/loss/zero-cost/99.9%/invalid/overflow/clear cases passed. Local `bundle exec jekyll build` could not run because Bundler 4.0.9 from `Gemfile.lock` is not installed in the system Ruby 2.6 environment.

## 2026-09-02 21:00 KST
- Tool: `savings-interest-calculator`
- Selection reason: recent quality work covered `list-format-converter`, `volumetric-weight-calculator`, `recycling-sorting-checker`, `movie-seat-choice-simulator`, `fuel-economy-calculator`, and `image-resizer`; this older finance calculator had higher error risk because out-of-range and fractional values were silently clamped, copy state lacked failure feedback, and auto-filled values hid the empty state.
- Scope: improved the existing multilingual page, home metadata, accessible labels/status, mobile layout, blank/error/success states, strict range validation, term presets, example/clear/copy flow, integer-consistent result rounding, calculation assumptions, FAQ, and search-intent copy. No new tool was added.
- Validation: YAML/front matter parsing, the 98-tool multilingual integrity check, `node --check`, `git diff --check`, tool-count preservation, and targeted normal/boundary calculation cases passed. Local `bundle exec jekyll build` could not run because the Ruby 2.6 environment has no Jekyll executable installed.

## 2026-08-25 21:00 KST
- Tool: `lucky-draw-picker`
- Selection reason: recent quality commits improved `pomodoro-timer`, `readability-checker`, `time-difference-calculator`, `korean-name-romanizer`, `png-compressor`, `json-merge`, and `link-list-cleaner`; `lucky-draw-picker` had higher live-use risk around empty participant lists, duplicate names, too-large winner counts, mobile copy flow, and clear fairness guidance.
- Scope: improved existing layout, script, Sass/CSS, page metadata, localized pages, home data, participant parsing, duplicate stats, example/clear buttons, copy summary, invalid-state messaging, unbiased crypto draw indexing, mobile layout, FAQ/search-intent copy, and selection log. No new tool was added.
- Validation: `YAML.load_file('_data/tools.yml')`, targeted front matter YAML parse, `node --check assets/js/tools.js`, `git diff --check`, and a targeted Node parser edge-case check passed. `bundle exec jekyll build` could not run because Jekyll is not installed locally; `bundle install` failed under Ruby 2.6.10 because current nokogiri constraints require Ruby >= 3.0/3.1.

## 2026-08-24 21:00 KST
- Tool: `pomodoro-timer`
- Selection reason: recent quality commits improved `readability-checker`, `time-difference-calculator`, `korean-name-romanizer`, `png-compressor`, `json-merge`, and `link-list-cleaner`; `pomodoro-timer` was an older productivity planner with UX risk around skipping before start, mobile status density, hidden-tab timing clarity, and limited SEO copy for task labels/alerts.
- Scope: improved existing layout, script, CSS, page metadata, localized pages, home data, task-label flow, optional phase-end alert, next-phase status, copy summary, visibility-time recalculation, mobile stats layout, FAQ/search-intent copy, and selection log. No new tool was added.
- Validation: `YAML.load_file('_data/tools.yml')`, targeted front matter YAML parse, `node --check assets/js/tools.js`, and `git diff --check` passed. `bundle exec jekyll build` could not run locally because Jekyll was not installed, and `bundle install` failed under Ruby 2.6.10 due current dependency Ruby >= 3.0/3.1 constraints.

## 2026-08-23 21:00 KST
- Tool: `readability-checker`
- Selection reason: recent quality commits improved `time-difference-calculator`, `korean-name-romanizer`, `png-compressor`, `json-merge`, and `link-list-cleaner`; `readability-checker` still had higher-risk text handling around long input, sentence splitting, repeated terms, mobile paragraph density, and Korean-only UI labels on localized pages.
- Scope: improved existing page copy, home metadata, localized UI labels, threshold validation, empty/short-text/copy states, HTML-safe result rendering, clear flow, mobile stats layout, and multilingual SEO coverage. No new tool was added.

## 2026-08-22 21:00 KST
- Tool: `time-difference-calculator`
- Selection reason: recent quality commits improved korean-name-romanizer, png-compressor, json-merge, and link-list-cleaner; this older time calculator still had high-risk edge cases around earlier end times, midnight crossing, same-time input, excessive break minutes, weak empty state, and mobile preset/result clarity.
- Scope: improved existing page copy, home metadata, localized pages, accessible labels/status, preset buttons, copy state, break/date summary stats, validation guardrails, and mobile layout. No new tool was added.

## 2026-08-21 21:00 KST
- Tool: `korean-name-romanizer`
- Selection reason: recent quality commits improved png-compressor, json-merge, link-list-cleaner, average-speed-calculator, cafe-work-seat-simulator, blog-banned-word-checker, image-upscaler, and case-converter; this older language converter still had official-spelling confusion risk, single-result UX, weak registered-name comparison, and mobile candidate readability gaps.
- Scope: improved existing page copy, home metadata, candidate spelling UI, registered spelling comparison, copy/error states, surname-variant suggestions, mobile candidate chips, and multilingual FAQ/search-intent coverage. No new tool was added.

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
