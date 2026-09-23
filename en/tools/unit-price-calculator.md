---
layout: tool
title: Unit Price Calculator | Compare Bundles and Package Sizes
description: Compare bundles and package sizes by price per item, 100g, 1kg, 100ml, or 1L, including the unit-price gap and savings rate.
lang: en
permalink: /en/tools/unit-price-calculator/
category: calculator
category_label: Shopping/Comparison
thumbnail: /assets/thumbs/en/unit-price-calculator.svg
image:
  path: /assets/thumbs/en/unit-price-calculator.svg
  alt: Unit Price Calculator thumbnail
tool_key: unit-price-calculator
tool_type: calculator
topic_cluster: shopping
keywords: [unit price calculator, price per item calculator, price per 100g, price per kg, price per liter, bundle price comparison, compare package sizes]
related_tools: [discount-calculator, percent-calculator, split-bill-calculator]
faq:
  - q: Can I compare products with different sizes?
    a: Yes. As long as they can be converted to the same base unit, you can compare them directly.
  - q: Does it show per 100g, per 1kg, per 100ml, and per 1L prices too?
    a: Yes. The calculator shows common unit-price conversions along with the main comparison result.
  - q: Can I compare a discounted product with a regular one?
    a: Yes. Enter product A and B to see which has the lower unit price and how much you save.
  - q: Can I calculate only one product's unit price?
    a: Yes. Complete product A and leave product B blank. Add both price and quantity for product B when you want a comparison.
  - q: How do I compare 500g with 1kg?
    a: Use one shared unit for both products, such as entering both quantities in grams or both in kilograms.
canonical_url: /en/tools/unit-price-calculator/
alternate_urls:
  ko: /tools/unit-price-calculator/
  en: /en/tools/unit-price-calculator/
  ja: /ja/tools/unit-price-calculator/
---

## Why use a unit price calculator?
A bundle deal or large-size package does not always mean a better deal.
What matters is the **price per unit**.

This tool helps you compare:
- price per item
- price per 100g / 1kg
- price per 100ml / 1L
- product A vs. product B
- savings amount and savings rate

## Key features
- Calculate a unit price from total price and item count
- Convert weight and volume prices across g, kg, ml, and L
- Compare two products by one shared unit, including the price gap and savings rate
- Calculate product A by itself when no comparison is needed
- Keep invalid or incomplete input out of the result with clear empty and error messages

## How to use it
1. Choose a comparison basis: count, weight, or volume.
2. Select one shared quantity unit for both products. Convert package totals first when their labels use different units.
3. Enter product A's total price and total quantity.
4. Optionally enter both the price and quantity for product B.
5. Check the main unit price, common conversions, cheaper option, price gap, and savings rate.

Product B is optional. Once you start entering a product, both its total price and total quantity are required. Item counts must be whole numbers; weight and volume may use decimals. Invalid, zero-quantity, and oversized values show a field-specific error instead of a result.

## Formula and comparison assumptions
- Base unit price = total price ÷ total quantity
- Price per 100g (100ml) = price per g (ml) × 100
- Price per 1kg (1L) = price per g (ml) × 1,000
- Savings rate = unit-price gap ÷ the higher unit price × 100

Apply coupons, shipping, or reward credits to the entered total price first. Quality, contents, and expiration dates are not represented in the numeric comparison.

## Example
### Comparing snack multipacks
- Product A: 4 packs for 5,980 KRW
- Product B: 6 packs for 8,400 KRW

→ Product A: 1,495 KRW per pack
→ Product B: 1,400 KRW per pack
→ **Product B is cheaper per unit.**

### Comparing milk sizes
- Product A: 900ml for 2,480 KRW
- Product B: 1.8L for 4,690 KRW

Enter both quantities in the same unit, such as 900ml and 1800ml. Product A costs about 276 KRW per 100ml, while product B costs about 261 KRW per 100ml, so the larger product has the lower unit price.

## Related tools
- [Discount Calculator]({{ '/en/tools/discount-calculator/' | relative_url }})
- [Percent Calculator]({{ '/en/tools/percent-calculator/' | relative_url }})
- [Split Bill Calculator]({{ '/en/tools/split-bill-calculator/' | relative_url }})

## FAQ
### Can I compare products with different sizes?
Yes. Convert both package totals to one shared unit first. For example, compare 500g with 1kg by entering 500g and 1000g.

### Does it show prices per 100g, 1kg, 100ml, and 1L?
Yes. Weight and volume modes show the common converted unit prices alongside the main result.

### Can I compare a discounted product with a regular one?
Yes. Apply coupons, shipping, and credits to each total price first, then enter both products to compare their effective unit prices.

### Can I calculate only one product?
Yes. Complete product A and leave product B blank.

### How do I compare 500g with 1kg?
Choose weight and enter both quantities in the same unit—for example, 500g and 1000g.

### Does a bundle automatically mean better value?
No. Compare the unit prices after applying any discount to the total price.
