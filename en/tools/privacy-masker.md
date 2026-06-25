---
layout: tool
lang: en
title: Privacy Masker | Hide phone, email, card, account, and ID numbers
description: Paste text and mask domestic or international phone numbers, emails, card numbers, account-like numbers, and ID-number candidates in your browser before sharing.
category: productivity
category_label: Work/Privacy Masking
thumbnail: /assets/thumbs/en/privacy-masker.svg
image:
  path: /assets/thumbs/en/privacy-masker.svg
  alt: Privacy Masker thumbnail
tool_key: privacy-masker
tool_type: utility
topic_cluster: privacy
permalink: /en/tools/privacy-masker/
canonical_url: /en/tools/privacy-masker/
alternate_urls:
  ko: /tools/privacy-masker/
  en: /en/tools/privacy-masker/
  ja: /ja/tools/privacy-masker/
keywords: [privacy masker, redact phone number, mask email, card number masking, account number masking, ID number masking, text anonymizer]
related_tools: [link-list-cleaner, text-line-break-cleaner, meeting-action-item-extractor]
faq:
  - q: Is my pasted text sent to a server?
    a: No. Masking runs in your browser only. The text is not uploaded or stored by this site.
  - q: Does it find every piece of personal information perfectly?
    a: No. It is a regex and number-pattern helper, so it can miss unusual formats, names, addresses, order IDs, or context-specific data. Review the result before sharing.
  - q: Can it catch international phone numbers?
    a: It can catch some separated international candidates such as +1 415-555-1212, but phone formats vary by country, so review important text manually.
  - q: Can it mask Korean resident-registration-style numbers?
    a: It can flag 13-digit candidates shaped like 900101-1234567 and hide the trailing digits. It is pattern-based, so review the result manually.
  - q: Can the masked result be restored?
    a: Not from the masked output alone. Keep the original safely if you need it, and share only the masked text.
---

## Why use Privacy Masker?
Support messages, bug reports, copied logs, and internal notes often contain phone numbers, emails, card numbers, or account-like numbers that should not be shared as-is. When you are in a hurry, it is easy to remove one item and miss another.

This utility-type tool lets you paste text and mask common privacy-sensitive patterns directly in your browser. You choose which categories to mask, review the detected candidates, and copy a safer sharing version after checking the result. You can keep the original shape with `*` characters or replace each match with a category label such as `[PHONE]`.

## How to use it
1. Paste the text you want to share or clean up.
2. Choose whether to keep the shape or replace matches with category labels.
3. Select phone numbers, emails, card numbers, account-like numbers, and/or ID-number candidates.
4. Press `Mask text` to see the cleaned result and detection counts.
5. Review the detection list to see what was changed.
6. Review the output, then copy only the sharing-safe version.
7. Manually check names, addresses, order IDs, or context-specific details.

## Especially useful when
### 1) Sharing customer messages with a team
Mask contact information before forwarding the message to reduce unnecessary exposure.

### 2) Pasting logs into an external tool
Quickly hide account emails or numeric identifiers that may appear inside test logs or error messages.

### 3) Preparing sample documents
Use masked examples instead of real customer or teammate details when creating guides or reports.

### 4) Cleaning messages with international contacts
Separated international phone candidates are checked alongside Korean-style mobile numbers, reducing the chance that obvious contact details remain visible.

### 5) Checking high-risk ID-number candidates
Resident-registration-style 13-digit candidates are masked as a first-pass guard before sharing copied messages or logs.

## Related tools
- Clean tracking parameters from links: [Link List Cleaner]({{ '/en/tools/link-list-cleaner/' | relative_url }})
- Fix pasted text line breaks: [Text Line Break Cleaner]({{ '/en/tools/text-line-break-cleaner/' | relative_url }})
- Extract tasks from meeting notes: [Meeting Action Item Extractor]({{ '/en/tools/meeting-action-item-extractor/' | relative_url }})

## FAQ
### How are values masked?
Phone numbers keep the rough shape while hiding the middle digits. Emails hide part of the local name and domain. Card and account-like numbers hide the middle digits. ID-number candidates keep the first seven digits and hide the rest. Card masking prioritizes separated 4-digit groups or long numbers that pass a basic checksum to reduce numeric false positives.

### Is this a compliance review tool?
No. It is a first-pass helper before sharing text. For legal or security-sensitive documents, follow your organization’s official review process.

### Does the page keep my input after refresh?
No. Input and output stay only on the current page session and disappear when refreshed.

## Summary
Privacy Masker is a **utility tool for hiding contact, email, ID-number, and numeric sensitive-data candidates and reviewing what was detected before sharing text**. It adds a privacy/document-cleanup use case after recent learning, checker, and planner tools.
