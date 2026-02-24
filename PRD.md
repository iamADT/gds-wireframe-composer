# GDS Lo-Fi Composer — Product Requirements Document

**Version:** 1.2
**Date:** 2026-02-24
**Status:** Live

---

## 1. Product Overview

GDS Lo-Fi Composer is a browser-based tool for rapidly building low-fidelity GOV.UK service wireframes. It pairs a dark, keyboard-driven block editor with a live preview canvas that renders pages inside a realistic browser frame using GOV.UK Design System components. The goal is speed: a designer or product person should be able to sketch a multi-page GDS service flow in seconds using a keyboard and mouse.

## 2. Problem Statement

Existing wireframing tools (Figma, Balsamiq, Whimsical) require mouse-heavy drag-and-drop interaction. For early-stage ideation — where fidelity matters less than velocity — this overhead slows thinking down. Teams need a way to externalize screen ideas as fast as they can type, without worrying about layout precision or visual polish.

## 3. Target Users

| Persona | Need |
|---------|------|
| Product managers | Sketch screen flows during discovery to communicate ideas to engineering |
| UX designers | Quickly explore layout alternatives before committing to a high-fidelity tool |
| Founders / solo builders | Map out an MVP's screen set without design tool expertise |
| Frontend developers | Rough out component structure before writing code |

## 4. Core Features

### 4.1 Containers

A **container** represents a single wireframe page. Two types exist:

| Type | Description | Preview Appearance |
|------|-------------|--------------------|
| **Screen** | A full GOV.UK service page | Browser chrome frame (1024px wide) with mock URL bar showing `service.gov.uk/...` |
| **Modal** | A dialog overlaying a page | Browser chrome frame (same as screen — modal distinction is semantic/planning only) |

**Creation flow:**

1. The user sees two options at the top of the composer: **Screen** and **Modal** (toggle or segmented control).
2. The user selects a type and clicks the **Create** button.
3. The container is created, auto-named sequentially (Screen 1, Screen 2 ... Modal 1, Modal 2), and becomes the active container.
4. Immediately after creation, the first **block input** appears below — an empty text field with a blinking cursor and a placeholder (e.g. `try "header"`). The user is ready to type without any extra clicks.
5. The user types a block type name (e.g. "header", "hero", "button") and presses **Enter** to add the block.
6. A new block input appears below the newly added block, cursor already blinking, ready for the next block. The placeholder cycles through suggestions (e.g. `try "hero"`, `try "text"`, `try "button"`).
7. This continues — the user keeps typing and pressing Enter to build the screen sequentially.
8. At the bottom of the composer a **"+ New screen"** button creates the next screen container. The button also shows the keyboard shortcut (`⌘+↵` / `Ctrl+↵`) for users who prefer not to reach for the mouse.

**Other behaviors:**

- Container type can be changed after creation (screen ↔ modal); the name re-numbers automatically.
- Containers are listed in a sidebar and switched with a single click.
- The block input supports **fuzzy matching** — typing "head" suggests "header" and "heading", typing "nav" suggests "bottom-nav".
- Pressing **Escape** in an empty block input dismisses it (no block added). Pressing Escape in a non-empty input clears the text.

### 4.2 Blocks

Blocks are the atomic building units placed inside containers. Each block has a **type**, an **icon**, an **editable label**, and optionally an **`options`** array (used by choice components like radios).

| Type | Icon | Default Label | Description |
|------|------|---------------|-------------|
| `gds-header` | ▬ | *(none)* | GOV.UK header — blue bar with `GOV•UK` wordmark |
| `service-nav` | ≡ | My Service | Service name bar + editable nav items (starts empty; see 4.2.2) |
| `phase-banner` | ◈ | BETA | Alpha/beta phase banner with feedback link |
| `back-link` | ← | Back | Back link for previous page navigation |
| `breadcrumbs` | / | Home | Breadcrumb navigation trail |
| `h1` | H | Page heading | govuk-heading-xl — large page title (48px) |
| `h2` | H | Section heading | govuk-heading-l — section heading (36px) |
| `h3` | H | Subsection heading | govuk-heading-m — subsection heading (24px) |
| `body-text` | ¶ | Body text | govuk-body paragraph — renders as placeholder lines, editable as real text |
| `inset-text` | \| | Important information | Inset text with blue left border |
| `warning-text` | ! | Warning message here | Warning text with exclamation icon |
| `button` | ◻ | Continue | Primary green action button |
| `button-secondary` | ◻ | Cancel | Secondary button with grey border |
| `button-warning` | ◻ | Delete account | Warning button for destructive actions (red) |
| `text-input` | ▭ | Full name | Text input with label and hint text |
| `textarea` | ▭ | Description | Multi-line textarea with label |
| `radios` | ○ | Where do you live? | Radio buttons — single selection; options are editable (see 4.2.1) |
| `checkboxes` | □ | Which applies to you? | Checkboxes — multiple selection |
| `date-input` | □ | Date of birth | Day, month, year fields |
| `error-summary` | ✕ | There is a problem | Error summary box shown at top of page |
| `summary-list` | ≡ | Summary | Key–value summary list with Change links |
| `notification-banner` | ■ | Important | Notification banner with blue top border |
| `panel` | ◼ | Application complete | Green confirmation panel for success pages |
| `select` | ▽ | Country of birth | Select dropdown with label and hint |
| `table` | ▦ | Table caption | Table with bold header row and 4 placeholder data rows |
| `tag` | ◈ | Active | Coloured status tag pill |
| `pagination` | ←→ | Pagination | Previous / page numbers / Next navigation |
| `file-upload` | ↑ | Upload a file | File upload input with label and hint |
| `accordion` | ▼ | Accordion | Expandable sections; section names are editable (see 4.2.3) |
| `tabs` | ⊟ | Tabs | Tabbed content panel; tab labels are editable (see 4.2.4) |
| `task-list` | ☑ | Your application | Task list with clickable status tags (see 4.2.5) |
| `gds-footer` | ▁ | Footer | GOV.UK footer with crown copyright |
| `form` | ⚿ | Enter your name | **Macro** — question page: h1 + text-input + button |
| `question` | ⚿ | Are you sure? | **Macro** — question page: h1 + radios + button |

#### 4.2.1 Radios — interactive options

The `radios` block stores its choices in an `options: string[]` field on the block. Default options are `['England', 'Scotland', 'Wales']`.

In the preview, users can:
- **Double-click** any option label to edit it inline (Enter confirms, Escape cancels)
- **Hover** an option to reveal a `×` delete button (only shown when ≥2 options remain)
- **Click "or add another"** at the bottom of the list to append a new option (auto-enters edit mode)

#### 4.2.2 Service Nav — editable nav items

The `service-nav` block starts with no nav items (`options: []`). The service name (block label) is always shown on the left. Nav items are stored in `options: string[]`.

In the preview, users can:
- **Double-click** any nav item to rename it inline (Enter confirms, Escape cancels)
- **Hover** a nav item to reveal a `×` delete button (items can be deleted down to zero)
- **Click "+ add nav item"** in the nav bar to append a new item (auto-enters edit mode)
- The first nav item renders with a blue bottom underline (active state); remaining items are muted

#### 4.2.3 Accordion — editable sections

The `accordion` block stores section titles in `options: string[]`. Default: `['Section 1', 'Section 2', 'Section 3']`. The first section renders as expanded (with placeholder content lines); others are collapsed.

In the preview, users can:
- **Double-click** any section title to rename it inline
- **Hover** a section to reveal a `×` delete button (minimum 1 section)
- **Click "+ add section"** below the accordion to append a new section

#### 4.2.4 Tabs — editable tab labels

The `tabs` block stores tab labels in `options: string[]`. Default: `['Tab 1', 'Tab 2', 'Tab 3']`. The first tab renders as active (white background, no underline); others are inactive (grey background, underlined links).

In the preview, users can:
- **Double-click** any tab label to rename it inline
- **Hover** a tab to reveal a `×` delete button (minimum 1 tab)
- **Click "+ tab"** in the tab bar to append a new tab

#### 4.2.5 Task List — editable tasks with status cycling

The `task-list` block stores tasks in `options: string[]` using the encoding `"Task name||STATUS"`. Default: `['Check eligibility||NOT STARTED', 'Prepare documents||NOT STARTED', 'Submit application||NOT STARTED']`.

Statuses cycle through: `NOT STARTED` → `IN PROGRESS` → `COMPLETED` → `CANNOT START YET` → (repeat).

In the preview, users can:
- **Click a status tag** to cycle to the next status
- **Double-click** a task name to rename it inline
- **Hover** a task to reveal a `×` delete button (minimum 1 task)
- **Click "+ add task"** below the list to append a new task

Block operations:

- **Add** — Type a block name into the block input and press Enter. A new empty input appears below, ready for the next block. Supports fuzzy matching. The placeholder cycles contextually — the first input shows `try "gds-header"`, the second shows `try "service-nav"`, then cycles through other GDS types.
- **Emmet expansion** — Type a `>`-separated sequence and press Enter to add multiple blocks at once. `*N` repeats a block N times (capped at 10). Macro blocks expand as normal. Unresolvable segment names are silently skipped. A preview hint below the input shows the resolved block sequence as you type (e.g. `→ h1 · body-text · radios · radios · button`). Example: `h1 > body text > radios *2 > button`.
- **Tab completion** — Press Tab to accept the top autocomplete suggestion. In normal mode an inline ghost text suffix appears after the cursor showing the predicted completion; Tab accepts it. In Emmet mode, Tab either completes a partial last segment (e.g. `h1 > bod` → `h1 > body-text`) or appends the contextual next block when the cursor is after a bare `>` (e.g. `h1 >` → `h1 > body-text`). A `Tab` hint is shown below the input indicating what will be appended.
- **Remove** — Type `remove <block-type>` (e.g. `remove header`) and press Enter. Removes the last block of that type in the active container. The dropdown filters to only block types currently present, with red destructive styling. If the type isn't present, no action is taken.
- **Select** — Click or arrow-key to a block; selection syncs between composer and preview.
- **Edit label** — Double-click the label text in the composer or double-click text in the preview; confirm with Enter, cancel with Escape.
- **Duplicate** — Creates an identical copy immediately after the original.
- **Delete** — Remove the selected block with Backspace/Delete.

### 4.3 Macros

A macro is a block type that, on insertion, expands into multiple primitive blocks. Macros are tagged with a label in the Block Picker so users know they produce multiple blocks.

**Form macro** (default: "Enter your name") expands into:

1. h1 — "Enter your name"
2. text-input — "Full name"
3. button — "Continue"

**Question macro** (default: "Are you sure?") expands into:

1. h1 — "Are you sure?"
2. radios — "Are you sure?" with options `['Yes', 'No']`
3. button — "Continue"

### 4.4 Live Preview

The right panel renders a real-time wireframe of the active container. Changes in the composer are reflected instantly — there is no save or refresh step.

- Screen and modal containers both render inside a browser chrome frame (1024px wide, min-height 700px) with a mock URL bar showing `service.gov.uk/...`.
- The selected block is highlighted with an accent-colored ring and fill.
- The canvas uses a subtle dot-grid background (20 px spacing).
- **Full-bleed blocks** (`gds-header`, `service-nav`, `gds-footer`) span the full 1024px frame width.
- **All other blocks** are constrained to a max-width of 960px, centred — matching the GDS `govuk-width-container`.

**Block rendering in preview:**

| Block | Preview Appearance |
|-------|--------------------|
| `gds-header` | Blue (#1d70b8) bar, full-bleed — `GOV•UK` bold white wordmark |
| `service-nav` | White bar, full-bleed — editable service name on left; nav items (from `options[]`) on right; first item active with blue underline; `+ add nav item` always visible |
| `phase-banner` | White bar with coloured phase tag + feedback link text |
| `back-link` | Blue underlined `← Back` link |
| `breadcrumbs` | Inline `Home › [label]` trail with linked crumbs |
| `h1` | 48px / 50px line-height bold black heading |
| `h2` | 36px / 40px line-height bold black heading |
| `h3` | 27px / 30px line-height bold black heading |
| `body-text` | Stacked grey placeholder lines; switches to real editable text on double-click |
| `inset-text` | Left-bordered blue inset with editable text |
| `warning-text` | Circled `!` icon + bold warning text |
| `button` | Green (#0f7a52) filled button with bottom shadow |
| `button-secondary` | Grey-filled button with shadow |
| `button-warning` | Red (#ca3535) filled button with shadow |
| `text-input` | Bold label + hint text + 2px black bordered input box with blinking cursor |
| `textarea` | Bold label + hint text + tall 2px bordered box |
| `radios` | Bold legend + radio circles + editable option labels + "or add another" dashed row |
| `checkboxes` | Bold legend + square checkboxes + option labels |
| `date-input` | Bold label + Day / Month / Year input boxes |
| `error-summary` | Red 4px bordered box with heading + linked error list |
| `summary-list` | Key–value rows with Change links and grey dividers |
| `notification-banner` | Blue 5px bordered box with heading + placeholder lines |
| `panel` | Green (#0f7a52) filled panel with large bold heading |
| `select` | Bold label + hint + 2px bordered dropdown box with chevron |
| `table` | Optional caption + bold header row + 4 placeholder data rows, grey cell bars |
| `tag` | Small rounded pill — grey background, bold black label |
| `pagination` | Previous / page numbers (1, 2, 3 … 10) / Next row; page 1 active (black bg) |
| `file-upload` | Bold label + hint ("PDF, JPG or PNG") + "Choose file" button + "No file chosen" |
| `accordion` | Bordered sections; first section expanded with placeholder lines; others collapsed; `+ add section` below |
| `tabs` | Tab bar with first tab active (white bg, no underline), others inactive (grey bg, underlined); `+ tab` button; placeholder content below |
| `task-list` | Editable heading + task rows; each row has task name (link style) + clickable status tag; `+ add task` below |
| `gds-footer` | Light grey bar, full-bleed — blue 10px top border, crown copyright, support links |
| `form` / `question` | Not rendered directly — expand into primitive blocks (see 4.3) |

### 4.5 Inline Editing in Preview

All text displayed in the preview is **directly editable**. Instead of showing static placeholder text ("Heading", "Body text goes here", etc.), the preview renders the block's actual label as live text that the user can click into and edit in place.

**Behavior:**

- **Single click** on a block in the preview selects it (syncs `selectedBlockId` with the composer).
- **Double click** on any text within a preview block enters inline edit mode. A text cursor appears at the click position and the text becomes editable.
- Edits in the preview update the block's label in real time — the composer panel reflects changes immediately (bidirectional sync).
- **Enter** confirms the edit and exits inline edit mode.
- **Escape** cancels the edit, reverting to the previous label value.
- **Click outside** the editing block confirms the edit.

**Editable regions per block type:**

| Block | Editable regions |
|-------|-----------------|
| `gds-header` | *(no editable label — wordmark is fixed)* |
| `service-nav` | Service name (label); each nav item label (double-click); nav items can be added or deleted |
| `phase-banner` | Phase tag text |
| `back-link` | Link text |
| `breadcrumbs` | Last crumb label |
| `h1` / `h2` / `h3` | Heading text |
| `body-text` | Full paragraph (switches from placeholder lines to real text when editing) |
| `inset-text` / `warning-text` | Message text |
| `button` / `button-secondary` / `button-warning` | Button label |
| `text-input` / `textarea` | Field label |
| `radios` | Legend text; each option label individually (double-click); options can be added or deleted |
| `checkboxes` | Legend text |
| `date-input` | Field label |
| `error-summary` | Heading text |
| `summary-list` | Heading text |
| `notification-banner` | Banner heading |
| `panel` | Panel heading |
| `select` | Field label |
| `table` | Caption text |
| `tag` | Tag label |
| `pagination` | *(no editable label — page numbers are fixed)* |
| `file-upload` | Field label |
| `accordion` | Each section title (double-click); sections can be added or deleted |
| `tabs` | Each tab label (double-click); tabs can be added or deleted |
| `task-list` | Heading text; each task name (double-click); tasks can be added or deleted; status tag clickable to cycle |
| `gds-footer` | *(no editable label — links are fixed)* |

**Rendering mode switch:** When a `text` block is not being edited, it renders as the stylized horizontal lines (varying width) to maintain the wireframe aesthetic. When the user double-clicks to edit, it transitions to real editable text. On confirm, it returns to the stylized line rendering using the new text length to inform line widths.

### 4.6 Keyboard UX

The application is designed to be operated primarily from the keyboard.

| Shortcut | Action | Context |
|----------|--------|---------|
| `Enter` | Add the typed block (or Emmet sequence, or remove in remove mode) | Block input field |
| `Tab` | Accept inline ghost completion (normal mode) or complete/append next block (Emmet mode) | Block input field |
| `Escape` | Clear text or dismiss empty input | Block input field |
| `↑` / `↓` | Navigate autocomplete suggestions | Block input with suggestions visible |
| `Cmd+Enter` / `Ctrl+Enter` | Create a new screen container (same as "+ New screen" button) | Global |
| `↑` / `↓` | Navigate between blocks | When blocks exist (not in input) |
| `Backspace` / `Delete` | Delete the selected block | When a block is selected (not in input) |
| Double-click label | Begin editing the label | Composer block row |
| Double-click text | Begin inline editing | Preview block text |
| `Enter` | Confirm edit | While editing a label (composer or preview) |
| `Escape` | Cancel edit | While editing a label (composer or preview) |

A **"+ New screen"** button is always visible at the bottom of the block list. It includes a `⌘+↵` / `Ctrl+↵` shortcut hint so keyboard users can create the next container without reaching for the mouse.

## 5. Technical Architecture

### 5.1 Stack

| Layer | Technology |
|-------|------------|
| UI framework | React 19 |
| Language | TypeScript (strict mode, ES2020 target) |
| Build tool | Vite 7 |
| Styling | Tailwind CSS 4 + CSS custom properties |
| Animation | Framer Motion 12 |
| ID generation | nanoid |

### 5.2 State Management

State lives in a custom React hook (`useComposerStore`) backed by `useState` and `useCallback`. No external state library is used. The state shape:

```
containers: Container[]
activeContainerId: string
selectedBlockId: string | null
blockInputVisible: boolean         // whether the block input field is showing
blockInputValue: string            // current text in the block input
```

Derived values (e.g. `activeContainer`, filtered autocomplete suggestions) are computed inline. All mutations flow through callback functions returned by the hook.

The `Block` interface includes an optional `options` field for blocks that hold multiple choices:

```
Block {
  id: string
  type: BlockType
  label: string
  options?: string[]   // used by: radios, accordion, tabs, task-list, service-nav
}
```

Additional store mutation: `updateBlockOptions(blockId, options)` — replaces the options array on a block.

### 5.3 Component Tree

```
App
├── Left Panel (dark)
│   ├── AppBar             — title + shortcut hints
│   ├── ContainerCreator   — Screen/Modal toggle + Create button + view switcher
│   ├── ContainerList      — sidebar of screens/modals (view = "screens")
│   └── Composer           — block editor (view = "current")
│       ├── BlockRow[]     — existing blocks with inline label editing (drag-reorderable)
│       ├── BlockInput     — auto-focused text field with placeholder + autocomplete
│       ├── EllipsisMenu   — per-block context menu (duplicate, repeat, delete)
│       └── NewScreenButton — "+ New screen" button with ⌘+↵ shortcut hint
└── Right Panel (dark)
    └── Preview            — live wireframe canvas with inline text editing
        ├── BrowserChrome  — mock browser URL bar (service.gov.uk/...)
        └── WireBlock      — renders individual GDS block types
```

### 5.4 Data Flow

All state originates in the store hook at the App level and flows down as props. Child components call store callbacks to request mutations. The preview and composer share the same `selectedBlockId`, keeping selection in sync.

## 6. UI/UX Specifications

### 6.1 Layout

A fixed two-panel split:

- **Left panel (composer)** — Fixed-width dark panel. Contains the app bar, container creator, optional container list, and block composer.
- **Right panel (preview)** — Flexible-width dark canvas. Centers a 1024px browser-chrome frame. Supports inline text editing on all blocks.

**Full-bleed vs. constrained layout:**

Inside the 1024px frame, blocks follow the GDS page template layout rules:

- **Full-bleed** (`gds-header`, `service-nav`, `gds-footer`) — span the full 1024px frame width, matching the real GOV.UK layout.
- **All other blocks** — wrapped in a `govuk-width-container` equivalent: `max-width: 960px`, `margin: 0 auto`. This matches the GDS layout specification and prevents content from stretching across the full frame.

Both panels scroll independently.

### 6.2 Visual design documents

Visual specifications (color tokens, spacing, radii, typography scales, animation values, states, and style-lint rules) are maintained in dedicated documents per panel:

- **Visual design:** See [`composer-visuals.md`](./composer-visuals.md) — covers both panels: liquid glass surfaces, double-line bevel borders, specular highlights, interaction states, animation specs, component specs, preview canvas, and the style-lint checklist.

## 7. Non-Functional Requirements

### 7.1 Performance

- The preview must update within a single animation frame of any state change (< 16 ms).
- Adding or removing a block should never cause a visible layout jank.
- Initial page load (production build) should complete in under 2 seconds on a modern broadband connection.

### 7.2 Browser Support

- Latest two versions of Chrome, Firefox, Safari, and Edge.
- No mobile/touch support required in v1 (desktop keyboard/mouse only).

### 7.3 Accessibility

- All interactive elements must be reachable via keyboard.
- Focus states must be visible.
- Color contrast in both panels must meet WCAG AA for normal text.

## 8. Future Considerations

These items are out of scope for the current version but represent likely next steps:

- **Screen linking / flow arrows** to connect containers into a user flow diagram.
- **Export** — PNG, SVG, or shareable URL.
- **Additional block types** — image placeholder, icon, divider, list item, card, toggle, checkbox, radio.
- **Additional macros** — signup form, settings page, onboarding carousel.
- **Light mode for preview canvas** (currently both panels are dark).
- **Collaboration** — real-time multi-user editing via CRDT or OT.
- **Persistent storage** — save/load projects to local storage or a backend.
- **Undo/redo** with `Cmd+Z` / `Cmd+Shift+Z`.
- **Custom theming** — user-defined color palettes for wireframe tokens.
- **Responsive preview** — toggle between phone, tablet, and desktop frames.

---

*This document describes the wireframe-composer project as built. It serves as the reference specification for ongoing development.*
