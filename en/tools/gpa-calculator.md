---
layout: tool
lang: en
title: GPA Calculator | 4.5, 4.3 & 4.0 Scales, P/F Grades
description: Calculate a credit-weighted GPA for up to 6 courses using example 4.5, 4.3 or 4.0 scales. Check how P and F affect GPA, fix incomplete entries and copy your results.
permalink: /en/tools/gpa-calculator/
canonical_url: /en/tools/gpa-calculator/
category: calculator
category_label: Education/Study
thumbnail: /assets/thumbs/en/gpa-calculator.svg
image:
  path: /assets/thumbs/en/gpa-calculator.svg
  alt: GPA calculator preview
tool_key: gpa-calculator
keywords:
- gpa calculator
- grade point average calculator
- weighted GPA
- college GPA
- course grade calculator
- 4.5 GPA calculator
- 4.3 GPA calculator
- 4.0 GPA calculator
related_tools:
- required-gpa-calculator
- average-calculator
- percent-calculator
faq:
- q: Are pass courses included in GPA?
  a: Usually P/Pass courses are excluded from GPA and counted separately. This tool also tracks pass credits separately.
- q: How is an F handled?
  a: In many grading systems, F counts as 0 points in GPA even though the course is not passed. This tool follows that common rule.
- q: How do P and F differ?
  a: P is excluded from both GPA points and graded credits, and is counted separately. F contributes zero points but its credits stay in the denominator. Do not enter F as P merely because a course uses pass/fail grading.
- q: Does selecting a scale match every school?
  a: No. The grade-point table on this page is an example mapping used by this tool. Minus grades are not supported. Different grade points, retake rules or credit policies can produce a different official GPA.
alternate_urls:
  ko: /tools/gpa-calculator/
  en: /en/tools/gpa-calculator/
  ja: /ja/tools/gpa-calculator/
---

## A quick way to check your semester GPA
At the end of a semester, you often want to know **what GPA you are heading toward**
and whether you are above a scholarship cutoff or grade requirement.

This tool lets you enter course credits and grades to instantly calculate your
**weighted GPA, graded credits, total grade points, and pass/ignored credits**.
You can switch between 4.5, 4.3, and 4.0 scales on the same page instead of using separate GPA calculators.

## Key features
- Weighted GPA calculation based on course credits × grade points
- Support for 4.5 / 4.3 / 4.0 scales
- Pass courses counted separately from GPA credits
- View GPA, total grade points, graded credits, and excluded credits at once
- Warnings for incomplete rows or credit values outside the expected range
- Sample input, clear, and copy-result actions for faster checking

## How to use it
1. Choose a GPA scale and check that the example grade-point table below matches your school’s rules.
2. Enter the credits for each course.
3. Select the grade for each course.
4. Select `P` only for a P grade; enter `F` as F so its zero points are counted.
5. Check your GPA, total grade points, graded credits, and pass/ignored credits.
6. Copy the result if you want to paste it into a grade plan or note.

## How the calculation works
GPA is usually calculated like this:

- Multiply each course's **credits × grade points**
- Add all of those values to get **total grade points**
- Divide total grade points by **total graded credits**

For example, if you have a 3-credit A+ course and a 2-credit B+ course,
the average is calculated as a **weighted average**, not a simple average.

## Related tools
- [Required GPA Calculator]({{ '/en/tools/required-gpa-calculator/' | relative_url }})
- [Average Calculator]({{ '/en/tools/average-calculator/' | relative_url }})
- [Percent Calculator]({{ '/en/tools/percent-calculator/' | relative_url }})

## FAQ
### Why are pass courses excluded from GPA?
This tool excludes only P from GPA. F contributes zero points and its credits count in the denominator. Check your school’s own pass/fail policy.

### My school uses slightly different grade points. Is that okay?
Check both the scale and every grade point in the example table below against your school’s rules. Selecting the same maximum scale does not guarantee the same grade mapping. Minus grades are not supported, so this tool cannot reproduce systems that require them.

### How should I enter a repeated course?
In most cases, it is more accurate to enter only the grade that is officially recognized on your transcript. Policies for repeated courses vary by school.

### What credit range does the calculator accept?
Each course accepts 0.01–30 credits with at most 2 decimal places. Invalid or incomplete rows block results and copying.

### Can I calculate what GPA I need for a target cumulative GPA?
Use this calculator for course-by-course semester GPA. To reverse-calculate the average GPA needed in remaining credits, use the [Required GPA Calculator]({{ '/en/tools/required-gpa-calculator/' | relative_url }}).

## Empty inputs, incomplete rows and copying
- With no courses entered, no GPA is shown. Start with credits and a grade, or select **Fill sample** to try the calculator.
- Leave unused rows entirely empty. A course name alone counts as a started row; complete its credits and grade or clear it.
- Invalid credits or any unfinished row hide all calculated results and disable **Copy result** until corrected.
- With only P courses, pass credits are shown separately, but GPA remains blank and copying is disabled because there are no graded credits. F-only courses produce a GPA of 0.00, not a blank result.
- **Clear** removes every course and restores the 4.5 scale. If automatic copying is unavailable, select and copy the visible results manually.

## Credit input and example grade-point tables
Enter 0.01–30 credits per course with up to 2 decimal places. Course names are optional, but a name-only row must be completed or cleared. Empty rows are ignored; unfinished rows block all results and copying. Up to 6 courses are supported. GPA and grade points round to 2 decimal places.

| Grade | 4.5 | 4.3 | 4.0 |
| --- | --- | --- | --- |
| A+ | 4.5 | 4.3 | 4.0 |
| A0 | 4.0 | 4.0 | 4.0 |
| B+ | 3.5 | 3.3 | 3.3 |
| B0 | 3.0 | 3.0 | 3.0 |
| C+ | 2.5 | 2.3 | 2.3 |
| C0 | 2.0 | 2.0 | 2.0 |
| D+ | 1.5 | 1.3 | 1.3 |
| D0 | 1.0 | 1.0 | 1.0 |
| F | 0 | 0 | 0 |

### How do P and F differ?
P is excluded from both GPA points and graded credits, and is counted separately. F contributes zero points but its credits stay in the denominator. Do not enter F as P merely because a course uses pass/fail grading.

### Does selecting a scale match every school?
No. The grade-point table on this page is an example mapping used by this tool. Minus grades are not supported. Different grade points, retake rules or credit policies can produce a different official GPA.
