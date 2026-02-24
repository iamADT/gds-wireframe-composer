## PRD: Wireframe Composer — Visual Design Specification

**Style direction:** Liquid glass over monochrome dark void
**Applies to:** Both panels (composer + preview), app bar, all overlays

---

## 0) Scope

Covers every visual surface of the Wireframe Composer:

* App bar
* Containers panel (left)
* Blocks panel (left)
* Preview canvas (right)
* Overlays: Block Picker, Ellipsis Menu, tooltips, app-level modals (confirmation dialogs, destructive action prompts)

Note: "modals" in this document refers exclusively to **app UI modals** — overlays that belong to the composer interface itself. It does not refer to GOV.UK modal/dialog components rendered inside the wireframe preview canvas, which follow GOV.UK Design System conventions and are out of scope.
* Buttons, icon buttons, pills, inputs
* Typography, spacing, borders, focus, hover, selection

Out of scope:

* Interaction logic, drag and drop behaviour, data model, validation rules, error messaging copy

---

## 1) Visual goals

1. **Futuristic & striking**
   Glass surfaces produce bold specular highlights, visible beveled edges, and pronounced depth. The UI itself is visual art.

2. **True monochrome foundation**
   Every base UI element is expressed with neutral values only (white opacity on black). Colour enters exclusively through glass edge effects and specular highlights.

3. **Cool-tinted glass layer**
   Permitted tints: blue (`220-240` hue range) and violet (`260-280` hue range). No warm hues. Tints appear only in borders, box-shadows, and specular gradient overlays — never as surface fills or text colours.

4. **Pure dark void backdrop**
   App background is `#070707`. No ambient gradient orbs, animated blobs, or background effects. Glass surfaces are the sole source of depth and visual interest.

5. **Clean & smooth materiality**
   Glass surfaces are perfectly smooth — no grain, noise overlays, or texture maps.

6. **Hierarchy via value + geometry**
   Emphasis comes from brightness, border weight, surface layering, and spacing — not from hue.

7. **Accessible focus and selection**
   Focus and selection must remain obvious without relying on hue. Cool tints are decorative enhancement, not the primary signal.

---

## 2) Colour system (tokens)

### 2.1 Base

| Token | Value | Usage |
|-------|-------|-------|
| `--bg-0` | `#070707` | App background (dark void) |
| `--bg-0-bar` | `rgba(7,7,7,0.75)` | App bar background (with blur) |

### 2.2 Glass surfaces

| Token | Value | Usage |
|-------|-------|-------|
| `--glass-surface-1` | `rgba(255,255,255,0.03)` | Panels |
| `--glass-surface-2` | `rgba(255,255,255,0.04)` | Rows, controls |
| `--glass-surface-hover` | `rgba(255,255,255,0.07)` | Hover state |
| `--glass-surface-pressed` | `rgba(255,255,255,0.10)` | Active/pressed state |
| `--glass-surface-selected` | `rgba(255,255,255,0.08)` | Selected state |

### 2.3 Backdrop blur

| Token | Value | Usage |
|-------|-------|-------|
| `--glass-blur-sm` | `blur(4px)` | Pills, small overlays, rows inside panels |
| `--glass-blur-md` | `blur(6px)` | Panels, cards |
| `--glass-blur-lg` | `blur(10px)` | Block Picker, modals, elevated overlays |

Stacking rule: never layer more than two blurred surfaces. Rows inside a blurred panel use `--glass-blur-sm`; the panel uses `--glass-blur-md`.

### 2.4 Borders

| Token | Value | Usage |
|-------|-------|-------|
| `--border-outer` | `rgba(255,255,255,0.06)` | Outer dark line of glass bevel |
| `--border-inner` | `rgba(255,255,255,0.12)` | Inner bright line of glass bevel |
| `--border-inner-elevated` | `rgba(255,255,255,0.18)` | Inner bright line on elevated overlays |
| `--border-inner-selected` | `rgba(255,255,255,0.25)` | Inner bright line on selected elements |
| `--border-dashed` | `rgba(255,255,255,0.12)` | Dashed border (composer add-block row) |

### 2.5 Cool tint tokens

Used exclusively in `box-shadow` and `::before` gradient stops.

| Token | Value | Usage |
|-------|-------|-------|
| `--tint-blue` | `rgba(140,170,255,0.08)` | Top-edge catch on default bevel |
| `--tint-blue-elevated` | `rgba(140,170,255,0.12)` | Top-edge catch on elevated overlays |
| `--tint-blue-strong` | `rgba(140,170,255,0.25)` | Selected state edge highlight |
| `--tint-violet-strong` | `rgba(160,140,255,0.20)` | Focus ring tint |

### 2.6 Text

| Token | Value | Usage |
|-------|-------|-------|
| `--text-primary` | `rgba(255,255,255,0.92)` | Primary content |
| `--text-secondary` | `rgba(255,255,255,0.65)` | Secondary content, icon default |
| `--text-tertiary` | `rgba(255,255,255,0.45)` | Labels, section headers, helper text |
| `--text-placeholder` | `rgba(255,255,255,0.35)` | Input placeholders |

### 2.7 Explicit bans

* No Tailwind hue utility classes (`bg-blue-*`, `text-violet-*`, etc.) on any surface fill or text colour
* No coloured glows or hue-tinted backgrounds
* Tint tokens may only appear in `box-shadow` values and `::before` pseudo-element gradient stops
* Maximum tint opacity: `0.25`
* Hue range locked to `220-280` — no cyan, magenta, warm hues

---

## 3) Layout spec

### 3.1 Grid

* **Max width:** 1152px
* **Page padding:** 16px
* **Grid:** 12 columns
* **Gap:** 16px

### 3.2 Panels

* Left panel fixed visual width approx 280–320px at desktop
* Right panel fills remaining width
* Both panels use consistent radius and glass bevel to separate from background

---

## 4) Typography

| Role | Size | Weight | Colour |
|------|------|--------|--------|
| App title | 14px | Semibold | `--text-primary` |
| App subtitle | 12px | Regular | `--text-tertiary` |
| Panel title ("Blocks") | 14px | Semibold | `--text-primary` |
| Section label ("CONTAINERS") | 11px | Semibold, wide tracking | `--text-tertiary` |
| Row primary (block/container name) | 14px | Medium | `--text-primary` |
| Row meta (block type label) | 11px | Semibold, wide tracking | `--text-tertiary` |
| Helper text | 12px | Regular | `--text-tertiary` |

---

## 5) Spacing, radii, targets

### 5.1 Spacing

4px base unit. Use: 8, 12, 16, 24.

### 5.2 Radius

| Element | Radius |
|---------|--------|
| Panels | 16px |
| Rows | 16px |
| Inputs | 12px |
| Icon buttons | 12px |
| Pills | Fully rounded |

### 5.3 Target sizes

| Element | Minimum size |
|---------|-------------|
| Icon buttons | 36x36px |
| Inputs and buttons | 40px height |
| Rows | 44px perceived tap zone |

---

## 6) Double-line bevel border system

The signature visual element. Every glass surface uses an inner bright line and an outer dark line, creating the illusion of a glass edge catching overhead light.

### 6.1 Construction

```css
.glass-bevel {
  border: 1px solid var(--border-outer);                  /* outer dark line */
  box-shadow:
    inset 0 0 0 1px var(--border-inner),                  /* inner bright line */
    inset 0 1px 0 0 var(--tint-blue);                     /* top-edge blue catch */
}
```

### 6.2 Variants

| Variant | Outer | Inner | Top-edge tint | Usage |
|---------|-------|-------|---------------|-------|
| **Default** | `white/6` | `white/12` | `--tint-blue` | Panels, rows, inputs |
| **Elevated** | `white/8` | `white/18` | `--tint-blue-elevated` | Block Picker, menus, modals |
| **Selected** | `white/10` | `white/25` | `--tint-blue-strong` | Selected rows, active containers |
| **Focus** | `white/10` | `white/20` | `--tint-violet-strong` | Focus ring on interactive elements |

### 6.3 Rules

* Inner line is always brighter than outer — never inverted
* Top-edge tint simulates overhead light: applied to `inset 0 1px 0 0` only
* Bottom and side edges receive no tint
* Bevel is implemented via `box-shadow` (inset), not multiple `border` declarations
* Focus ring appears as additive outer `box-shadow` (`0 0 0 2px`), never replacing the bevel

---

## 7) Specular highlights

Applied as a `::before` pseudo-element on glass surfaces larger than 80x40px.

### 7.1 Implementation

```css
.glass-specular {
  position: relative;
}
.glass-specular::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  z-index: 1;
  background: linear-gradient(
    168deg,
    rgba(255,255,255,0.06) 0%,
    rgba(140,170,255,0.03) 20%,
    transparent 50%
  );
}
```

### 7.2 Rules

* Gradient angle: `165-175deg` (top-left overhead light source)
* Maximum bright point: `white/6` — never exceed `white/10`
* Cool tint band at 15-25% gradient stop
* Skip on surfaces smaller than 80x40px (pills, icon buttons)
* Pseudo-element: `pointer-events: none`, `z-index: 1` (above surface, below content)

---

## 8) Interaction states

All states are driven by **opacity transitions** — surfaces become more or less transparent on interaction.

### 8.1 State matrix

| State | Surface | Bevel | Specular | Transition |
|-------|---------|-------|----------|------------|
| **Default** | `--glass-surface-2` | Default | Yes | — |
| **Hover** | `--glass-surface-hover` | Default | +2% bright | `120ms ease-out` |
| **Hover exit** | — | — | — | `80ms ease-out` |
| **Pressed** | `--glass-surface-pressed` | Default | Dimmed 50% | `60ms ease-out` |
| **Selected** | `--glass-surface-selected` | Selected | Yes, tint-blue-strong | `150ms ease-out` |
| **Selected + Hover** | `white/10` | Selected | No change | `120ms ease-out` |
| **Focus** | No surface change | Focus | No change | `100ms ease-out` |
| **Disabled** | `white/2` | `white/4` border only | No | — |

### 8.2 Rules

* All transitions use `ease-out` timing — crisp entry, soft settle
* No transition may exceed `150ms`
* Hover exit is always faster than hover enter
* Selection must be recognisable by border weight and surface brightness alone — tints are enhancement only

---

## 9) Animation specs

### 9.1 Timing tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--duration-instant` | `60ms` | Press/active states |
| `--duration-fast` | `100ms` | Focus ring, border transitions |
| `--duration-normal` | `120ms` | Hover enter, surface opacity |
| `--duration-hover-exit` | `80ms` | Hover exit |
| `--duration-select` | `150ms` | Selection state changes |

### 9.2 Easing

```css
--ease-glass: cubic-bezier(0.16, 1, 0.3, 1);   /* sharp ease-out */
```

All transitions use `--ease-glass`. No spring physics, no bounce, no elastic curves.

### 9.3 Rules

* No ambient or idle animations — surfaces are static until interacted with
* Specular changes transition via `opacity` on the pseudo-element, not gradient interpolation
* Overlay appear/disappear: `opacity` + `translateY(4px)` over `--duration-normal`

---

## 10) Component specs

### 10.1 App bar

```
Background:    --bg-0-bar (rgba(7,7,7,0.75)) + --glass-blur-lg
Border-bottom: 1px solid white/6, inset 0 -1px 0 0 white/12 (inverted bevel: bright on bottom)
Specular:      No (too narrow)
Position:      Sticky, z-index above panels
CTA cluster:   Aligned right
```

### 10.2 Panel containers (left + right)

```
Background:    --glass-surface-1 + --glass-blur-md
Border:        Double-line bevel (Default)
Specular:      Yes
Radius:        16px
```

### 10.3 Container rows (sidebar)

**Default**
```
Background:    transparent (no glass at rest)
Icon tile:     white/5, border --border-outer
```

**Hover**
```
Background:    --glass-surface-hover + --glass-blur-sm
Bevel:         Fades in over --duration-normal
```

**Selected**
```
Background:    --glass-surface-selected
Border:        Selected bevel
Indicator bar: white/60
Specular:      Yes (only when selected)
Text:          --text-primary
```

Editable name appearance:
* Input reads as text — no visible input border, no background fill
* Caret and focus must not cause row jitter

### 10.4 Blocks panel header

* Title, count pill, helper line
* Search input and Add block CTA aligned right

### 10.5 Search input

```
Background:    --glass-surface-2 + --glass-blur-sm
Border:        Double-line bevel (Default)
Placeholder:   --text-placeholder
Radius:        12px
Focus:         Focus bevel, transition --duration-fast
```

### 10.6 Block rows (composer)

**Default**
```
Background:    --glass-surface-2 + --glass-blur-sm
Border:        Double-line bevel (Default)
Specular:      Yes
Radius:        16px
```

**Hover**
```
Surface:       --glass-surface-hover
Bevel:         Inner line increases to white/16
Transition:    --duration-normal ease-out
```

**Selected**
```
Surface:       --glass-surface-selected
Border:        Selected bevel
```

**Row actions:** Grab handle and overflow menu appear on hover only, following icon button styling.

### 10.7 Add block composer row

```
Border:        1px dashed --border-dashed (no bevel — dashed pattern takes precedence)
Background:    white/2
Hover:         white/4, dashed border to white/18
Right pill:    Shows shortcut "Tab"
Specular:      No
Blur:          None
```

### 10.8 Icon buttons (Search, More, row actions)

```
Background:    --glass-surface-2 + --glass-blur-sm
Border:        Double-line bevel (Default)
Icon:          --text-secondary
Hover:         --glass-surface-hover, inner line to white/16, icon to --text-primary
Focus:         Focus bevel (outer ring, no layout shift)
Specular:      No (surface too small)
Radius:        12px
```

### 10.9 Primary CTA

One per action cluster. Used for the single strongest action.

```
Background:    white/12 + --glass-blur-sm
Border:        Double-line bevel, inner line at white/20
Specular:      Yes (compact gradient, 0-30% range)
Hover:         white/18, inner line to white/25
Active:        white/22, specular dimmed
Text:          --text-primary
Focus:         Focus bevel
```

### 10.10 Secondary CTA

```
Background:    --glass-surface-2 + --glass-blur-sm
Border:        Double-line bevel (Default)
Hover:         --glass-surface-hover
Active:        --glass-surface-pressed
Text:          --text-secondary
Specular:      No
```

### 10.11 Tertiary CTA (optional)

```
Background:    transparent
Hover:         --glass-surface-hover
Text:          --text-secondary
```

### 10.12 Pills (counts, shortcuts)

```
Background:    white/4
Border:        1px solid white/8 (single line — no bevel on pills)
Text:          --text-secondary, 11px medium
Blur:          None
Specular:      None
```

### 10.13 Block Picker / Ellipsis Menu (elevated overlays)

```
Background:    rgba(15,15,15,0.85) + --glass-blur-lg
Border:        Double-line bevel (Elevated)
Specular:      Yes (bright point at white/8)
Radius:        16px
Shadow:        0 8px 32px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.3)
Appear:        opacity + translateY(4px) over --duration-normal
```

### 10.14 App-level dialog modals (confirmation, destructive actions)

App-level modals are UI overlays rendered within a panel — not full-screen. They consist of two layers:

**Overlay (scrim)**
```
Position:      absolute, inset 0 within the containing panel
Background:    rgba(0,0,0,0.2)
Backdrop blur: blur(6px) — frosts the panel content behind it
Border-radius: inherits panel radius (16px)
z-index:       50
```

**Dialog card**
```
Glass class:   glass-elevated + glass-specular
Width:         ~260px (fits comfortably within the left panel)
Radius:        16px
Padding:       24px
Shadow:        Inherits from glass-elevated
Appear:        opacity + scale(0.95) + translateY(8px) → scale(1) + translateY(0) over 150ms ease-out
```

**Buttons inside dialog**
* Cancel: Secondary CTA styling (see 10.10)
* Destructive confirm (Delete, Remove, etc.): `rgba(220,60,60,0.25)` background, `rgba(220,60,60,0.35)` border, `rgba(255,128,128,1)` text — the only permitted warm-hue exception, used exclusively for destructive actions

**Rules**
* Clicking the scrim dismisses the dialog (same as Cancel)
* Dialog must never render full-screen — always scoped to its parent panel
* Maximum one app-level modal visible at a time
* No modal for empty-container deletion — only prompt when content would be lost

---

## 11) Preview canvas

### 11.1 Canvas background

```
Background:    #070707
Dot grid:      white/4, 20px spacing
```

### 11.2 Browser chrome frame

```
Frame border:  Double-line bevel (Default)
Frame fill:    white/3 + --glass-blur-sm
Frame width:   640px, min-height 700px
Radius:        16px

Chrome bar:
  Background:  #f3f2f1
  Border-bottom: 1px solid #b1b4b6
  Traffic dots: 3× grey circles (decorative, no function)
  URL bar:     White pill, border #b1b4b6, text "service.gov.uk/..." at 11px
```

### 11.3 Hero block (preview)

```
Container:     Full-width, padding 32px 16px
Title:         24px semibold, --text-primary, centered
Subtitle:      14px regular, --text-secondary, centered, 8px below title
CTA button:    Primary CTA styling (see 10.9), centered, 16px below subtitle
Background:    --glass-surface-1 + --glass-blur-sm (subtle lift from device background)
Border-bottom: 1px solid --border-outer
```

### 11.4 Selected block highlight (preview)

```
Ring:          2px solid --tint-blue-strong
Fill:          rgba(140,170,255,0.04)
Transition:    --duration-select ease-out
```

### 11.5 Inline editing state (preview)

```
Editable text: contenteditable region, inherits block typography
Cursor:        --text-primary, standard text cursor
Edit border:   1px dashed white/15 around the editable region
Edit bg:       rgba(255,255,255,0.02) (barely visible, signals edit mode)
Transition:    --duration-fast ease-out on enter/exit
```

When a `text` block switches from wireframe-line rendering to editable text, the transition uses `opacity` crossfade over `--duration-normal`.

---

## 12) CSS implementation reference

### 12.1 Base glass

```css
.glass {
  background: rgba(255,255,255,0.04);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  border: 1px solid rgba(255,255,255,0.06);
  box-shadow:
    inset 0 0 0 1px rgba(255,255,255,0.12),
    inset 0 1px 0 0 rgba(140,170,255,0.08);
}
```

### 12.2 Elevated glass

```css
.glass-elevated {
  background: rgba(15,15,15,0.85);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.08);
  box-shadow:
    inset 0 0 0 1px rgba(255,255,255,0.18),
    inset 0 1px 0 0 rgba(140,170,255,0.12),
    0 8px 32px rgba(0,0,0,0.5),
    0 2px 8px rgba(0,0,0,0.3);
}
```

### 12.3 Selected glass

```css
.glass-selected {
  background: rgba(255,255,255,0.08);
  border-color: rgba(255,255,255,0.10);
  box-shadow:
    inset 0 0 0 1px rgba(255,255,255,0.25),
    inset 0 1px 0 0 rgba(140,170,255,0.25);
}
```

### 12.4 Focus ring (additive)

```css
.glass-focus {
  box-shadow:
    inset 0 0 0 1px rgba(255,255,255,0.20),
    inset 0 1px 0 0 rgba(160,140,255,0.20),
    0 0 0 2px rgba(160,140,255,0.20);
}
```

### 12.5 Specular pseudo-element

```css
.glass-specular { position: relative; }
.glass-specular::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  z-index: 1;
  background: linear-gradient(
    168deg,
    rgba(255,255,255,0.06) 0%,
    rgba(140,170,255,0.03) 20%,
    transparent 50%
  );
}
```

---

## 13) Accessibility

* Selection must not rely on colour — border weight + surface brightness are the primary signals
* Focus ring must be visible on all surfaces (`#070707` through `white/10`)
* Minimum hit targets: 36x36 icon buttons, 40px button/input height, 44px row tap zone
* Text contrast must meet WCAG AA on their respective backgrounds
* Blur must not obscure critical content — no text behind a blurred surface without opaque fallback
* **`prefers-reduced-motion: reduce`:** Disable all glass transitions (instant state changes), disable specular pseudo-elements, reduce blur to `blur(2px)` globally

---

## 14) Performance constraints

* Maximum two overlapping `backdrop-filter` surfaces at any DOM point
* Use `will-change: opacity` only during active transitions, remove after settle
* No `filter: blur()` on foreground elements — only `backdrop-filter` permitted
* Glass transitions must complete within one animation frame (< 16ms) on mid-range hardware
* **Fallback:** If `backdrop-filter` is unsupported, degrade to opaque surfaces using `--bg-0` and `white/4-5` fills

---

## 15) Style lint checklist

### 15.1 Banned colour keywords

Any Tailwind class containing the following colour names is disallowed:

`violet` `indigo` `purple` `blue` `sky` `cyan` `teal` `emerald` `green` `lime` `yellow` `amber` `orange` `red` `pink` `rose` `fuchsia`

Examples: `bg-violet-500`, `text-blue-400`, `border-purple-600`, `ring-indigo-300`

### 15.2 Allowed colour classes

* `white` — `bg-white`, `bg-white/10`, `text-white`, `border-white/20`
* `black` — `bg-black`, `text-black`
* `gray` / `grey` / `neutral` / `zinc` / `stone` / `slate`
* `transparent`

### 15.3 Cool tint exception

Tints using `rgba()` with hue `220-280` are permitted **only** in:

* `box-shadow` values (bevel construction, focus rings)
* `::before` pseudo-element `background` gradient stops (specular highlights)

They are **never** permitted in `background`, `color`, `border-color`, `fill`, `stroke`, or any Tailwind utility class.

### 15.4 Grep patterns for CI

```
# Banned Tailwind hue classes
(bg|text|border|ring|shadow|outline|from|via|to|accent|caret|fill|stroke|decoration)-(violet|indigo|purple|blue|sky|cyan|teal|emerald|green|lime|yellow|amber|orange|red|pink|rose|fuchsia)

# Banned hue keywords in CSS variable declarations
--(.*)(violet|indigo|purple|blue|sky|cyan|accent)

# Non-zero hue in hsl/oklch
hsl\(\s*[1-9]
oklch\([^)]*\s+[0-9]*\.?[0-9]+\s*\)

# Tint opacity exceeding 0.25 threshold (flag for manual review)
rgba\(\s*1[4-6]0\s*,\s*1[4-7]0\s*,\s*255\s*,\s*0\.[3-9]
```

### 15.5 Enforcement

* Run patterns as a pre-commit hook or CI lint step
* Any PR introducing a banned class must be rejected
* If a future PRD introduces semantic colour (error states, etc.), it must explicitly override specific bans and document the exception
