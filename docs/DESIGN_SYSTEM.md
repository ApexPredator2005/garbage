# Design System
> **MYSchool ERP — JSS School**  
> *A consistent, warm editorial visual language for institutional clarity.*

---

## 01. Design Direction

A clean, modern, and timeless aesthetic that feels calm, human, and intentional.

```
┌───────────────────────────┐ ┌───────────────────────────┐ ┌───────────────────────────┐
│ 🍃 MINIMAL                │ │ 🧡 WARM                   │ │ 📐 CONSISTENT             │
├───────────────────────────┤ ├───────────────────────────┤ ├───────────────────────────┤
│ Focused and clutter-free  │ │ Inviting and human-       │ │ A unified visual          │
│ layouts optimized for high│ │ centered tones built on   │ │ experience across all     │
│ density data tables.      │ │ ivory, beige, and wine.   │ │ campuses and modules.     │
└───────────────────────────┘ └───────────────────────────┘ └───────────────────────────┘
```

---

## 02. Color Palette

A refined and versatile palette, designed for clarity, warmth, and enduring institutional appeal.

| Token Name | Hex Code | Swatch & Usage |
| :--- | :--- | :--- |
| **White** | `#FFFFFF` | Base card surfaces, modal sheets, and high-contrast containers. |
| **Ivory** | `#FAF7F2` | Primary page canvas background and subtle contrast layers. |
| **Beige / Sand** | `#E7DCCB` | Secondary panel backgrounds, subtle dividers, and hover fills. |
| **Burgundy** | `#682038` | Primary brand accent, numbered badges, primary buttons, and key callouts. |
| **Charcoal** | `#242424` | Primary high-contrast typography, icons, and strong border strokes. |
| **Success Olive** | `#2E7D32` | Verified statuses, approved leaves, paid receipts, and pass marks. |
| **Warning Red** | `#BA1A1A` | Rejection alerts, missing documents, unexcused absences, and delete barriers. |

---

## 03. Typography

`Inter` is a clean, modern typeface that balances readability with a friendly, institutional feel.

| Level | Size | Weight | Line Height | Usage |
| :--- | :--- | :--- | :--- | :--- |
| **Heading XL** | `40px` | Bold (`700`) | `48px` | Page hero titles and document headers |
| **Heading Large** | `28px` | Semibold (`600`) | `36px` | Section titles (`01`, `02` headings) |
| **Subheading** | `20px` | Medium (`500`) | `28px` | Card headers and modal titles |
| **Body Regular** | `16px` | Regular (`400`) | `24px` | Standard prose, form descriptions |
| **Small / Label** | `14px` | Regular / Medium | `20px` | Table headers, badges, metadata |
| **Mono (Code)** | `12px` | Medium (`500`) | `16px` | UTR codes, admission numbers, IDs (`JetBrains Mono`) |

---

## 04. Spacing Scale

A consistent 4px/8px modular spacing scale creates rhythmic harmony and clear visual hierarchy.

| Spacing Token | Pixels | CSS Variable | Common Usage |
| :--- | :--- | :--- | :--- |
| `space-1` | `4px` | `0.25rem` | Badge padding, icon offsets |
| `space-2` | `8px` | `0.5rem` | Form control padding, gap between pills |
| `space-3` | `12px` | `0.75rem` | Card internal cell spacing |
| `space-4` | `16px` | `1.0rem` | Default container padding, table cell padding |
| `space-6` | `24px` | `1.5rem` | Section gutters, grid gaps |
| `space-8` | `32px` | `2.0rem` | Major module separation, page margins |

---

## 05. Border Radius

Consistent corner radii create a soft, modern, and approachable silhouette.

| Token | Radius | Applied Elements |
| :--- | :--- | :--- |
| `radius-sm` | `4px` | Monospaced tags, small input badges, table selection checks |
| `radius-md` | `8px` | Standard action buttons, text input fields, dropdown menus |
| `radius-lg` | `12px` | Content cards, modal sheets, lifecycle node boxes |
| `radius-xl` | `24px` | Large hero banners, preview containers |
| `radius-full`| `9999px`| Numbered circular badges (`01`, `02`), pill status chips |

---

## 06. Core UI Components

### Buttons
* **Primary:** Burgundy background (`#682038`), White text, 8px radius, subtle scale-down on active.
* **Secondary:** Transparent background, 1px Beige border (`#E7DCCB`), Charcoal text (`#242424`).
* **Destructive:** Warning Red (`#BA1A1A`), White text, requires multi-step confirmation.

### Status Chips & Badges
* **Verified / Present:** Light Olive surface (`#E8F5E9`), Dark Green text (`#2E7D32`), 9999px radius.
* **Pending Verification:** Light Amber surface (`#FFF8E1`), Deep Amber text (`#F57F17`).
* **Rejected / Absent:** Light Red surface (`#FFEBEE`), Dark Red text (`#BA1A1A`).

### Input Fields & Controls
* **Background:** Pure White (`#FFFFFF`) with 1px Beige stroke (`#E7DCCB`).
* **Focus State:** 2px Burgundy outline (`#682038`) with zero layout shift.

---

## 07. Visual States

* **Empty States:** Gentle line-art illustration, clear descriptive subtitle, single call-to-action button.
* **Loading States:** Shimmer skeleton cards adhering to the exact grid dimensions to eliminate layout shifts.
* **Error States:** Border changes to Warning Red (`#BA1A1A`) with contextual inline error messages below the field.

---

## 08. Responsive Grid Breakpoints

* **Mobile (`375px+`):** Single column card stacks; sticky bottom action bars for attendance submit.
* **Tablet (`768px+`):** 2-column modular grid; collapsible left sidebar navigation.
* **Desktop (`1024px+`):** Fixed 280px navigation rail, fluid 12-column content area, maximum reading width `1440px`.

---

## 09. Accessibility Standards

* **Readable Contrast:** All text pairings strictly achieve WCAG AA contrast ratio ($\ge 4.5:1$).
* **Keyboard Navigation:** Full tab-index traversal with visible burgundy focus rings (`:focus-visible`).
* **Clear Labels & ARIA:** Every icon button includes an explicit `aria-label` and screen-reader helper tag.
