---
name: VinPrint
description: In tem nhãn theo yêu cầu tại TP.HCM (Conversion-first Brand Site)
colors:
  primary: "#FF4D00"
  primary-gradient-end: "#FF0055"
  ink: "#171310"
  paper: "#f5f0e7"
  violet: "#6545ed"
  indigo-500: "#6366f1"
  gray-900: "#111827"
  gray-500: "#6b7280"
  gray-50: "#f9fafb"
  white: "#ffffff"
typography:
  display:
    fontFamily: '"Inter", Arial, sans-serif'
    fontWeight: 800
    lineHeight: 1.1
  title:
    fontFamily: '"Inter", Arial, sans-serif'
    fontWeight: 700
  body:
    fontFamily: '"Inter", Arial, sans-serif'
    fontWeight: 500
rounded:
  sm: "8px"
  md: "16px"
  lg: "20px"
  xl: "24px"
  pill: "9999px"
spacing:
  section-y: "py-12"
  gap-sm: "4px"
  gap-md: "16px"
  gap-lg: "24px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.white}"
    rounded: "{rounded.pill}"
    padding: "16px 40px"
  card-default:
    backgroundColor: "{colors.white}"
    rounded: "{rounded.lg}"
    padding: "24px"
---

## Overview

The VinPrint brand identity balances conversion-focused urgency with a premium, trustworthy visual hierarchy. The design language avoids the typical "cheap printing shop" aesthetic by leaning on high-contrast typography, generous negative space, and a bold gradient primary color. The layout prioritizes product imagery and direct user action (Zalo CTAs) above all else.

## Colors

- **Primary Action (Coral/Pink Gradient):** A vibrant gradient from `#FF4D00` to `#FF0055` used to command attention for primary Call-to-Action buttons and hero sections.
- **Trust & Process (Indigo/Violet):** Cool, professional purples (`#6366f1`, `#6545ed`) anchor the step-by-step processes and AI mockup interactions.
- **Ink & Typography:** High-contrast `#111827` (gray-900) for primary headings.
- **Surface & Backgrounds:** Pure white (`#ffffff`) for cards, set against ultra-light cool grays (`#f9fafb` / `gray-50`) to create depth without relying on heavy borders.

## Typography

- **Primary Typeface:** `Inter` is used exclusively across the entire site for maximum legibility and a modern, technical feel.
- **Display Headings:** Ultra-bold (`font-extrabold`) and tightly spaced (`tracking-tight`) to create impactful, structural anchors at the top of each section.
- **Body & Metadata:** Medium weight (`font-medium`) is favored over regular weight for body text, ensuring it punches through on light gray backgrounds.
- **Case & Styling:** Uppercase with wide tracking is used deliberately for small eyebrow kickers (e.g., `uppercase tracking-widest text-[11px]`) to establish clear hierarchy before reading the main headline.

## Elevation

Elevation is achieved through very soft, diffused shadows and subtle 1px borders, avoiding harsh or dark drop shadows:
- **Level 1 (Cards):** `shadow-sm border border-gray-100` – Used universally on product cards, FAQ items, and process steps.
- **Level 2 (Floating Badges/Buttons):** `shadow-lg border border-gray-100` – Used for floating interactive elements and sticky CTAs.
- **Level 3 (Hero Depth):** `drop-shadow-2xl` – Applied directly to product cutouts in the hero section to create a 3D parallax feel against the flat background.

## Components

- **The Primary CTA:** Large, pill-shaped (`rounded-full`), utilizing the brand gradient. It almost always includes a right-pointing arrow or Zalo icon to imply forward momentum.
- **Floating Badges:** White pills with a soft shadow, a green checkmark (`#16a34a`), and bold text. Used to sprinkle trust signals (e.g., "Giao toàn quốc") around hero imagery without cluttering the main text stack.
- **Process Cards:** Clean white containers with large, highly legible numbering. The cards favor 1:1 image aspect ratios and avoid unnecessary decorative borders.
- **FAQ Accordions:** Minimalist rows with a subtle bottom border and a purple `+` icon. They expand cleanly without changing the background color of the row.

## Do's and Don'ts

- **Do** use large, high-quality product cutouts over solid or soft-gradient backgrounds.
- **Do** use `rounded-full` for all primary buttons to distinguish them from structural UI elements (which use `rounded-2xl` or `rounded-[32px]`).
- **Do** use `py-12` as the standard vertical padding between major sections to maintain a tight, readable rhythm.
- **Don't** use multiple font families. Stick entirely to Inter and use weight/size to create contrast.
- **Don't** use generic stock photography for the hero. Always show the physical printed products (bottles, boxes, pouches).
- **Don't** use thick colored borders on cards. Rely on `border-gray-100` and soft shadows for separation.
