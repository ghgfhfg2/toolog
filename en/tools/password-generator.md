---
layout: tool
title: Password Generator | Create, Hide, and Copy Strong Random Passwords
description: Generate 4-128 character random passwords in your browser with uppercase, lowercase, numbers, website-friendly symbols, similar-character exclusion, screen hiding, entropy bits, strength estimates, and one-by-one or copy-all support.
lang: en
permalink: /en/tools/password-generator/
canonical_url: /en/tools/password-generator/
category: security
category_label: Security & Accounts
thumbnail: /assets/thumbs/password-generator.svg
image:
  path: /assets/thumbs/password-generator.svg
  alt: Password generator result preview
tool_key: password-generator
keywords: [password generator, random password, strong password, secure password, entropy calculator, bulk password generator]
related_tools: [password-strength-checker, privacy-exposure-checker, filename-sanitizer]
alternate_urls:
  ko: /tools/password-generator/
  en: /en/tools/password-generator/
  ja: /ja/tools/password-generator/
faq:
  - q: Are generated passwords sent to a server?
    a: No. This tool runs in your browser and does not send input or output to an external server.
  - q: Will each password include all selected character types?
    a: Yes. If you enable uppercase, lowercase, numbers, or symbols, each generated password includes at least one from every selected set.
  - q: What length is recommended?
    a: Use at least 12 characters for regular accounts and 16 or more for financial, work, or admin accounts. For very important accounts, 24 characters is a safer baseline.
  - q: What if a website rejects symbols?
    a: Try the website-friendly symbol option first. If the site still rejects symbols, turn symbols off and increase the length to at least 16 characters.
  - q: Does excluding similar characters make passwords weaker?
    a: It slightly reduces the character pool and entropy, but it can prevent typing mistakes for shared, temporary, or manually entered passwords. Increase length if you enable it.
---

## Why use a password generator?
Reusing passwords or using short passwords greatly increases account takeover risk.
This tool helps you create **strong, hard-to-predict random passwords** quickly for signups and password updates.

## Key features
- Set **length (4–128)** and **amount (1–20)**, with quick 12, 16, and 24 character presets
- Choose uppercase, lowercase, numbers, and symbols
- Choose website-friendly symbols or a wider symbol set
- Exclude confusing characters (`O/0`, `l/I/1`, `B/8`, `S/5`, `Z/2`, etc.)
- View estimated strength, pool size, combinations, and entropy bits
- Generate in bulk with duplicate minimization plus single-password and copy-all support
- Hide generated results on screen when you are in a shared or public space
- Get immediate validation for invalid length, count, or character-set choices

## How to use
1. Enter password length and count.
2. Select character types and the symbol range.
3. Enable confusing-character exclusion or screen hiding if needed.
4. Click generate, then copy one password or the full list.

## Security tips
- Use a **different password** for every service.
- Store passwords in a **password manager**.
- Enable **2FA** whenever available.
- If people must type the password manually, exclude confusing characters and use a longer length.

## Related tools
- Check a candidate password: [Password Strength Checker]({{ '/en/tools/password-strength-checker/' | relative_url }})
- Scan shared notes for exposed personal data: [Privacy Exposure Checker]({{ '/en/tools/privacy-exposure-checker/' | relative_url }})
- Clean sensitive names from filenames: [Filename Sanitizer]({{ '/en/tools/filename-sanitizer/' | relative_url }})

## FAQ
### Are generated passwords secure?
They are generated with the browser's cryptographic random API (`crypto.getRandomValues`).

### Can I hide passwords on screen?
Yes. Turn off `Show generated passwords on screen` to mask the textarea and result list while keeping copy buttons available.

### Can I generate passwords without symbols?
Yes, but removing symbols reduces the character pool and can lower the difficulty of guessing.

### Is the strength estimate absolute?
No. It is a reference score based on length and character pool size. Real account security also depends heavily on password reuse and whether 2FA is enabled.

### Can bulk generation create duplicates?
The generator prioritizes unique results where possible. If the character pool is very small or the length is short, the available combination space can still be limited.

## Summary
The password generator is a practical baseline tool for account security.
Adjust **length, character sets, and readability options** to quickly create passwords that are safer and still usable.
