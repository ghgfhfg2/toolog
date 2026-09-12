# Tool Quality Log

## 2026-09-12 21:00 KST
- Tool: `stock-average-calculator`
- Selection reason: recent quality runs covered other tools; this older investment calculator had not received a full quality pass, silently converted negative values to zero, accepted fractional share quantities and incomplete buy plans, could produce unsafe oversized totals, prefilled sample values instead of showing a true empty state, and had thin localized SEO content.
- Scope: improved only the existing multilingual stock-average tool, home metadata, layout, styles, and script with strict whole-share/price/total validation, paired buy-plan checks, overflow and unreachable-target guards, true blank/error/warning/success states, example/clear/copy feedback, decimal price display, accessible descriptions/live status, one-column mobile inputs/actions, expanded SEO copy and FAQ, and related links. No new tool was added.
- Validation: YAML/front matter parsing, the 98-tool multilingual integrity check, `node --check`, `git diff --check`, tool-count preservation, mobile CSS rules, and targeted sample/already-met/unreachable/zero/negative/fractional/incomplete-pair/oversized cases passed. Local `bundle exec jekyll build` could not run because Bundler 4.0.9 from `Gemfile.lock` is not installed in the system Ruby 2.6 environment.

## 2026-09-11 21:00 KST
- Tool: `salary-calculator`
- Selection reason: the recent quality runs covered other tools; this high-risk financial calculator still used outdated income-tax brackets and 2024 insurance rates, counted children twice in the personal deduction, included non-taxable pay in insurance bases, silently clamped inconsistent values, and auto-filled results instead of providing a true empty state.
- Scope: updated only the existing multilingual salary tool, home metadata, layout, styles, and script with September 2026 employee insurance rates and tax brackets, corrected dependent handling and non-taxable insurance bases, strict whole-number/range/relationship validation, blank/error/success states, presets, example/clear/copy feedback, accessible descriptions/live status, one-column mobile inputs/actions, SEO titles/descriptions, calculation assumptions, FAQ, and related links. No new tool was added.
- Validation: YAML/front matter parsing, the 98-tool multilingual integrity check, `node --check`, `git diff --check`, tool-count preservation, mobile CSS rules, and targeted normal/blank/zero/negative/fractional/oversized/non-tax-over/children-over/tax-bracket/pension-cap cases passed. Local build status is recorded in the deployment report.

## 2026-09-10 21:00 KST
- Tool: `jeonse-vs-wolse-calculator`
- Selection reason: the previous eight quality runs covered other tools; this older housing-cost calculator had not been improved since its March launch and silently clamped negative, fractional, and oversized inputs, auto-filled results instead of showing a true empty state, and ignored differing one-time costs even though stay length was a core input.
- Scope: improved the existing multilingual page, home metadata, three-column desktop and single-column mobile input flow, accessible descriptions/live status, true blank/error/success states, strict money/rate/integer-term validation, overflow protection, optional one-time cost comparison, 12/24/36-month presets, example/clear/copy feedback, negative break-even explanation, formulas, FAQ, related links, and search-intent copy. No new tool was added.
- Validation: YAML/front matter parsing, the 98-tool multilingual integrity check, `node --check`, `git diff --check`, tool-count preservation, localized page/thumbnail checks, and targeted normal/zero-rate/negative-break-even/boundary/negative/fractional/oversized/overflow cases passed. Mobile rules collapse inputs/actions to one column and results to two columns. Local `bundle exec jekyll build` could not run because Bundler 4.0.9 from `Gemfile.lock` is not installed in the system Ruby 2.6 environment.

## 2026-09-09 21:00 KST
- Tool: `work-end-time-calculator`
- Selection reason: recent quality runs covered BMI, compound interest, age, tip, D-day, profit margin, and savings interest; this older time tool had not been improved since March and silently converted negative breaks to zero, allowed total stays beyond its documented 24-hour limit, auto-filled a result instead of exposing a true empty state, and gave weak mobile/error/copy feedback.
- Scope: improved the existing multilingual page, home metadata, mobile input/actions/results, accessible descriptions and live status, true blank/error/success states, strict work/break/24-hour validation, daytime/decimal/night-shift presets, example/clear/copy feedback, localized duration labels, calculation assumptions, FAQ, related links, and search-intent copy. No new tool was added.
- Validation: YAML/front matter parsing, the 98-tool multilingual integrity check, `node --check`, `git diff --check`, tool-count preservation, localized URL/thumbnail checks, mobile CSS rules, and targeted daytime/overnight/decimal/zero-break/24-hour-boundary/negative/fractional/oversized cases passed. Local `bundle exec jekyll build` could not run because Bundler 4.0.9 from `Gemfile.lock` is not installed in the system Ruby 2.6 environment.

## 2026-09-08 21:00 KST
- Tool: `bmi-calculator`
- Selection reason: the most recent quality runs covered compound interest, age, tip, D-day, profit margin, and savings interest; this older health calculator had not been improved since March and carried higher error/interpretation risk because it silently prefilled values, accepted fractional BMR ages, grouped all BMI values above 30 into one label, and did not clearly identify its Asian adult thresholds.
- Scope: improved the existing multilingual page, home metadata, mobile inputs/actions/results, accessible descriptions and live status, true empty/error/success states, strict adult ranges and integer-age validation, paired BMR inputs, six BMI categories, sample/clear/copy feedback, stated calculation assumptions, FAQ, related links, and search-intent copy. No new tool was added.
- Validation: YAML/front matter parsing, the 98-tool multilingual integrity check, `node --check`, `git diff --check`, tool-count preservation, mobile CSS rules, and targeted underweight/normal/overweight/three obesity classes/range/BMR/age-boundary cases passed. Local `bundle exec jekyll build` could not run because Bundler 4.0.9 from `Gemfile.lock` is not installed in the system Ruby 2.6 environment.

## 2026-09-07 21:00 KST
- Tool: `compound-interest-calculator`
- Selection reason: recent quality work covered `age-calculator`, `tip-calculator`, `d-day-calculator`, `profit-margin-calculator`, and `savings-interest-calculator`; this popular finance tool had not been improved since March and silently clamped negative, fractional-term, and oversized inputs while auto-filled defaults hid the empty state.
- Scope: improved the existing multilingual page, home metadata, accessible descriptions/status, mobile actions and results, true blank/error/success states, strict range and integer-term validation, overflow protection, example/clear/copy flow, calculation assumptions, FAQ, related links, and search-intent copy. No new tool was added.
- Validation: YAML/front matter parsing, the 98-tool multilingual integrity check, `node --check`, `git diff --check`, tool-count preservation, localized thumbnail existence, and targeted sample/0%/monthly-vs-quarterly/large-value cases passed. Mobile rules collapse input and action grids to one column. Local `bundle exec jekyll build` could not run because Bundler 4.0.9 from `Gemfile.lock` is not installed in the system Ruby 2.6 environment.

## 2026-09-06 21:00 KST
- Tool: `age-calculator`
- Selection reason: recent quality work covered `tip-calculator`, `d-day-calculator`, `profit-margin-calculator`, `savings-interest-calculator`, and `list-format-converter`; this tool had not been improved since March and calculated a Feb 29 birth inconsistently in non-leap years, while blank/invalid/copy states and mobile input actions were still weak.
- Scope: improved the existing multilingual page, home metadata, accessible field descriptions/status, explicit blank/error/success states, example/today/clear/copy flow, robust year parsing, DST-safe day differences, consistent leap-day age/month/birthday handling, FAQ, related search-intent copy, and copy-failure feedback. No new tool was added.
- Validation: YAML/front matter parsing, the 98-tool multilingual integrity check, `node --check`, `git diff --check`, tool-count preservation, mobile CSS rules, and targeted normal/leap-day/same-day/early-year/invalid/future-birth cases passed. Local `bundle exec jekyll build` could not run because Bundler 4.0.9 from `Gemfile.lock` is not installed in the system Ruby 2.6 environment.

## 2026-09-05 21:00 KST
- Tool: `tip-calculator`
- Selection reason: recent quality work covered `d-day-calculator`, `profit-margin-calculator`, `savings-interest-calculator`, `list-format-converter`, and `volumetric-weight-calculator`; this older payment calculator silently clamped negative/out-of-range values and fractional/zero people, auto-filled a result instead of showing an empty state, and had weak copy-error and mobile action feedback.
- Scope: improved the existing multilingual page, home metadata, accessible labels/status, mobile input and result layout, true blank/error/success states, strict amount/rate/people validation, overflow protection, rate presets, example/clear/copy flow, calculation assumptions, FAQ, related links, and search-intent copy. No new tool was added.
- Validation: YAML/front matter parsing, the 98-tool multilingual integrity check, `node --check`, `git diff --check`, tool-count preservation, and targeted blank/normal/zero/negative/fractional-people/rate/fixed-tip/overflow cases passed. Local `bundle exec jekyll build` could not run because Bundler 4.0.9 from `Gemfile.lock` is not installed in the system Ruby 2.6 environment.

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
