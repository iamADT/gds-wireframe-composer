# GDS Lo-Fi Composer — Custom Block Generation

**Status:** Planned
**Feature type:** New capability
**Depends on:** v1 core + service-nav (Phase 9 in build-plan.md)

---

## 1. Overview

Users can generate a custom lo-fi block for any GDS-adjacent component or pattern that does not exist in the standard block set — for example, a data table, a panel dashboard, a card grid, a timeline, or a filterable list. Generation is powered by Claude Sonnet, which interprets the user's natural language request and returns a structured lo-fi layout rendered inside the wireframe preview.

This is distinct from the `describe` AI feature in v2-features.md, which composes *existing* block types. Custom block generation creates a *new* block with its own unique wireframe rendering.

Custom blocks generated in a session are saved to a session-level template registry and can be reused across any container in the same session. Persistent storage across sessions is future work.

---

## 2. User flow

1. User types a description in the block input — e.g. `filter sidebar with date range`.
2. The autocomplete finds no matching block type.
3. A hint appears below the input: **`No match — append "generate" to create with AI`**
4. User appends `generate` to their input: `filter sidebar with date range generate`
5. The input enters **generate mode** — visually distinct styling (see Section 7).
6. User presses **Enter** to submit.
7. A loading/generating animation plays while Claude Sonnet processes the request.
8. A new **custom block** appears in the composer and preview with a lo-fi wireframe rendering.
9. The custom block behaves like any standard block: selectable, deletable, duplicatable, reorderable.
10. The block is saved to the session template registry and can be re-inserted into other containers by name.

---

## 3. Trigger

The keyword **`generate`** at the **end** of the block input activates generate mode.

```
<natural language description> generate
```

**Rationale:** The user types what they want first. If the autocomplete shows no match, the hint prompts them to append `generate`. This ensures the user has already confirmed their intent and seen that no standard block fits — avoiding accidental AI generation for things that do exist.

**Rules:**

- Case-insensitive — `Generate`, `GENERATE` all valid.
- `generate` must be the last word in the input (ignoring trailing whitespace).
- The description sent to the LLM is everything before the final `generate` keyword, trimmed.
- If the input is exactly `generate` with no preceding description, generate mode does not activate.
- `Escape` clears the input and returns to normal mode. During generation (loading state), `Escape` cancels the request and returns the input to its pre-submission value.

**No-match hint:**

The hint `No match — append "generate" to create with AI` appears below the block input whenever:
- The input has text, AND
- The autocomplete returns zero results

The hint disappears as soon as a match is found or the input is cleared.

---

## 4. LLM integration

### 4.1 Provider

**Claude Sonnet** (`claude-sonnet-4-6`) via the Anthropic API.

Sonnet is used over Haiku for its stronger spatial reasoning and layout generation quality. The cost per generation is acceptable for an infrequent, high-value action.

### 4.2 API key setup

A **one-time modal** appears the first time the user triggers generate mode (i.e. the first time `generate` is appended and Enter is pressed with no key stored).

```
Modal title:   "Connect to Claude"
Body:          "Custom block generation uses the Claude API.
                Enter your Anthropic API key to continue.
                Your key is stored locally in this browser only."
Input:         Password-type field, placeholder "sk-ant-..."
CTA:           "Save and generate" (primary)
Cancel:        "Cancel" (secondary — closes modal, does not proceed)
```

The key is stored in `localStorage` under a namespaced key (`gds-composer:anthropic-key`). After saving, generation proceeds immediately without a second Enter press.

A **"Disconnect"** option in a future settings panel will allow clearing the key. For v1 this is not needed.

### 4.3 What Claude receives

The request is split into a **system prompt** (static, defines Claude's role and rules) and a **user message** (dynamic, contains the specific request and page context).

#### 4.3.1 System prompt

```
You are a GOV.UK service wireframe assistant. Your job is to generate lo-fi wireframe
layouts for GOV.UK service pages and internal government tools.

Follow these rules strictly:

──────────────────────────────────────────
OUTPUT
──────────────────────────────────────────
Return ONLY valid JSON matching the schema provided. No explanation, no markdown, no
code blocks — just the raw JSON object.

──────────────────────────────────────────
LO-FI WIREFRAME RULES
──────────────────────────────────────────
You are creating a wireframe sketch, not a real UI. This means:
- Use grey placeholder bars (text-line, text-block) to represent text content.
  Do not write real sentences or paragraph text inside layouts.
- Use placeholder rectangles (image-placeholder, chart-placeholder) for any visual area.
- Labels on primitives (stat-card labels, table column headers, section headings) may
  use short real words — these are structural signposts, not body content.
- Never generate HTML, CSS, or JavaScript.
- Never add decorative elements: no shadows, gradients, illustrations, or icons beyond
  the badge dot.

──────────────────────────────────────────
GOV.UK DESIGN CONVENTIONS
──────────────────────────────────────────
All layouts must follow GOV.UK Design System conventions:
- Left-aligned content. Never centre-align body content or form elements.
- Linear vertical flow. Avoid complex grids; prefer stacked sections.
- Maximum 2 columns in a row for content layouts; 3 columns only for stat-card rows.
- Use generous whitespace — do not pack primitives tightly.
- Follow GDS form structure: label → hint text (text-line) → input area → button.
- Follow GDS question page structure: h1 heading → component → continue button.
- Navigation patterns: service nav sits at the top full-width; step-by-step navigation
  renders as a numbered sidebar list beside the main content column.
- Search results: search bar at top → result count (label) → result rows (divider-separated).
- Filter sidebars: narrow left column with filter groups; wider right column for results.
- Status dashboards: row of stat-cards at top; table or list below.
- Task and case list pages: table or structured rows with status badge on the right.
- Confirmation/success pages: green panel at top; summary-style rows below.
- Reference the GDS component library when deciding layout structure — the user is
  designing a real government service.

──────────────────────────────────────────
COLOUR PALETTE
──────────────────────────────────────────
Use only these values. Do not invent colours.

  Black (text, borders):     #0b0c0c
  White (backgrounds):       #ffffff
  Blue (active, links):      #1d70b8
  Grey fill (placeholders):  #f4f8fb
  Grey border (dividers):    #cecece
  Grey bar (text lines):     #b1b4b6

Badge colour values (muted tones — badge primitives only):
  grey:   #f4f8fb  text #484949
  blue:   #d2e4f4  text #0b0c0c
  green:  #cce2d8  text #10572e
  red:    #f4d3d3  text #8c2424

──────────────────────────────────────────
TYPOGRAPHY
──────────────────────────────────────────
Font: Arial, sans-serif (do not specify other fonts).
Bold: labels, column headers, stat-card labels, section headings within a layout.
Regular: hint text, secondary labels, link-style text.

──────────────────────────────────────────
PRIMITIVE VOCABULARY
──────────────────────────────────────────
Use ONLY the primitives defined in the schema. Unknown primitive types are silently
ignored by the renderer — your layout will appear broken if you use types not in the list.
When in doubt, use simpler primitives. A text-line is always valid.

──────────────────────────────────────────
SCHEMA
──────────────────────────────────────────
{
  "label": string,          // Display name for the block header (e.g. "Search Results")
  "layout": Primitive[]     // Top-level array of primitives
}

Primitive types:

  { "type": "row", "items": Primitive[] }
    Horizontal flex row. Children share width equally unless "width" (0–100, percent) is set.

  { "type": "column", "items": Primitive[] }
    Vertical stack with consistent gap.

  { "type": "stat-card", "label": string, "value": string }
    Small bordered card. label is bold black. value is a grey bar (use "—" as placeholder).

  { "type": "chart-placeholder", "label": string, "height": number }
    Grey filled rectangle with label. height in px (recommend 120–240).

  { "type": "table", "columns": string[], "rows"?: number }
    Bold header row + placeholder data rows. rows defaults to 3.

  { "type": "text-line", "width"?: number }
    Single grey bar representing one line of text. width 0–100 (percent), default 100.

  { "type": "text-block" }
    3–4 grey bars of varying width simulating a paragraph.

  { "type": "image-placeholder", "height": number }
    Grey rectangle with diagonal cross. height in px.

  { "type": "tag", "label": string }
    Small rounded pill, grey background, black text.

  { "type": "badge", "label": string, "color": "grey"|"blue"|"green"|"red" }
    Small coloured dot + label text.

  { "type": "divider" }
    Full-width 1px horizontal rule.

  { "type": "label", "text": string }
    Small bold section heading in GOV.UK black.

  { "type": "button", "label": string }
    GOV.UK primary green button. Use for the main call-to-action (e.g. "Search", "Continue", "Submit").

  { "type": "button-secondary", "label": string }
    GOV.UK secondary button (grey). Use for cancel or alternative actions.

  { "type": "button-warning", "label": string }
    GOV.UK warning button (red). Use only for destructive actions (e.g. "Delete").
```

#### 4.3.2 User message

The user message is constructed dynamically at generation time:

```
Generate a lo-fi wireframe block for: {description}

Container: {screen | modal}

Existing blocks on this page:
{type}: {label}
{type}: {label}
...

Return JSON only.
```

- `{description}` — the user's input with the trailing `generate` keyword stripped and trimmed
- `{screen | modal}` — the active container type
- Existing blocks — provides layout context so Claude can calibrate complexity and avoid duplicating what's already on the page. If the container is empty, this line is omitted.

### 4.4 LLM output schema

Claude returns a JSON object:

```json
{
  "label": "Panel Dashboard",
  "layout": [
    {
      "type": "row",
      "items": [
        { "type": "stat-card", "label": "Applications", "value": "—" },
        { "type": "stat-card", "label": "Approved", "value": "—" },
        { "type": "stat-card", "label": "Rejected", "value": "—" },
        { "type": "stat-card", "label": "Pending", "value": "—" }
      ]
    },
    {
      "type": "chart-placeholder",
      "label": "Applications over time",
      "height": 160
    }
  ]
}
```

- `label` — the block's display name, shown as a bold header above the layout
- `layout` — array of lo-fi primitives (see Section 5), may be nested via `row` / `column`

Claude is explicitly constrained to the primitive vocabulary in Section 5. Unknown primitive types are silently skipped by the renderer.

---

## 5. Lo-fi layout primitives

The renderer supports a fixed vocabulary. This keeps rendering deterministic — no AI-generated code is ever executed.

| Primitive | Description |
|-----------|-------------|
| `row` | Horizontal flex container; children share width equally unless `width` is specified |
| `column` | Vertical stack of children with consistent gap |
| `stat-card` | Small bordered card with a `label` (bold, black) and a `value` (grey bar or dash) |
| `chart-placeholder` | Grey filled rectangle with a `label` and optional axis tick lines; `height` in px |
| `table` | Bold header row + 3 placeholder data rows; column headers taken from `columns` array |
| `text-line` | Single grey placeholder bar; `width` as percentage (default 100%) |
| `text-block` | Stack of 3–4 grey placeholder bars of varying width, simulating a paragraph |
| `image-placeholder` | Grey rectangle with diagonal cross lines; `height` in px |
| `tag` | Small rounded pill with a `label`; grey background, black text |
| `badge` | Small coloured dot + `label`; `color` property accepts `grey`, `blue`, `green`, `red` |
| `divider` | Full-width 1px horizontal rule in `#cecece` |
| `label` | Small bold text label in GOV.UK black; used for section headings within a layout |
| `button` | GOV.UK primary green button (`#0f7a52` fill, 3px bottom shadow); `label` is the button text |
| `button-secondary` | GOV.UK secondary button (grey fill, grey shadow); `label` is the button text |
| `button-warning` | GOV.UK warning button (`#ca3535` fill, red shadow); `label` is the button text |

---

## 6. Custom block in the data model

A custom block uses the existing `Block` interface with type `'custom'` and an additional `customLayout` field:

```ts
// types.ts additions
type BlockType = ... | 'custom'

interface CustomPrimitive {
  type: string
  label?: string
  value?: string
  height?: number
  width?: number
  color?: string
  columns?: string[]
  items?: CustomPrimitive[]
}

type CustomLayout = CustomPrimitive[]

interface Block {
  id: string
  type: BlockType
  label: string
  options?: string[]
  customLayout?: CustomLayout      // present when type === 'custom'
  customPrompt?: string            // original generation description, used for regenerate
}
```

### 6.1 Session template registry

When a custom block is successfully generated, it is also saved to a session-level registry in the store:

```ts
// useComposerStore additions
customTemplates: CustomTemplate[]   // grows as blocks are generated

interface CustomTemplate {
  id: string
  label: string
  layout: CustomLayout
  prompt: string
}
```

Templates appear in the block autocomplete under a **"Custom"** section when the user types text that matches a template label. Selecting one inserts a new block with that `customLayout` — identical to the original. The inserted copy is independent (regenerating one does not affect others).

**Auto-save behaviour:** Templates are saved automatically on generation — there is no manual "save" step. The registry uses an upsert-by-label strategy: if a template with the same label already exists it is replaced. This means generating the same description twice, or regenerating a block, always keeps the registry at one entry per label reflecting the most recent result. Templates are session-only (no localStorage persistence).

---

## 7. Visual spec — generate mode

### 7.1 No-match hint

Shown below the block input when the user has typed text but autocomplete finds no results:

```
Text:     "No match — append "generate" to create with AI"
Style:    --text-tertiary, 11px, italic
Position: Below the input, same width, left-aligned
Appear:   opacity fade-in over --duration-normal (120ms)
```

### 7.2 Generate mode input (user has appended `generate`)

```
Border:        Selected bevel (--tint-blue-strong)
Background:    --glass-surface-2 + --glass-blur-sm
Right badge:   Small pill reading "AI" in --tint-blue-strong, white/5 background
Placeholder:   N/A — the user's description is already in the input
```

### 7.3 Loading / generating state

```
Input:         Non-editable; description text fades to --text-tertiary
Animation:     "Generating" text + 3-dot animated pulse in --tint-blue, 600ms cycle
Border:        Selected bevel maintained
Escape hint:   Small text below input — "Esc to cancel", --text-tertiary, 11px
```

### 7.4 Error state

```
Border:        rgba(220,60,60,0.35)
Input text:    Error message in rgba(255,128,128,1)
Duration:      3s, then input resets to normal mode ready for re-entry
```

---

## 8. Custom block preview rendering

Custom blocks render inside a white container using the lo-fi primitives from Section 5.

```
Container:    Full-width, padding 16px 20px, background white
              border-bottom: 1px solid #cecece

Header row:   flex row, space-between, align-center
  Left:       block.label — 15px bold, #0b0c0c
  Right:      "custom" badge — 10px, rounded pill, #f4f8fb background,
              #484949 text, 1px solid #cecece border

Layout:       Rendered below header, gap 12px between top-level primitives
```

All primitives use the GOV.UK grey palette (`#f4f8fb` fill, `#b1b4b6` bars, `#cecece` borders) and `#0b0c0c` black for all text labels. The only permitted colour exceptions are `badge` primitives using the muted colour values defined in section 4.3.1.

---

## 9. Regeneration

Custom blocks expose two additional options in their ellipsis menu:

- **"Regenerate"** — re-sends the original `customPrompt` to Claude and replaces the block's `customLayout` with the new result. The block label is preserved. The session template is automatically updated (upsert by label) so the registry reflects the latest layout.
- **"Edit and regenerate"** — opens a small inline input pre-populated with `customPrompt`. User edits the description and presses Enter to re-generate. Also upserts the session template.

There is **no per-primitive editing in v1**. The user can only delete or regenerate the block as a whole.

---

## 10. Error handling

| Scenario | Behaviour |
|----------|-----------|
| No API key stored | One-time key modal appears before generation proceeds |
| Invalid or rejected API key | Error state: "Invalid API key — check your key in settings" |
| Claude returns invalid JSON | Error state: "Couldn't generate — try a more specific description" |
| Claude returns unknown primitives only | Error state: "No renderable layout — try describing specific components" |
| Claude returns empty layout array | Error state: "No layout generated — try a more specific description" |
| Network / timeout | Error state: "Couldn't connect — check your connection and try again" |
| Rate limit | Error state: "Too many requests — wait a moment and try again" |

All error states display for 3 seconds then return the input to normal mode.

---

## 11. State additions

```ts
// useComposerStore additions
customTemplates: CustomTemplate[]

addCustomBlock: (label: string, layout: CustomLayout, prompt: string) => void
  // adds block to active container + upserts session template

regenerateBlock: (blockId: string, layout: CustomLayout, prompt: string) => void
  // atomically updates block's customLayout + customPrompt + upserts session template
```

`isGenerating` is local state in `BlockInput`, not in the store. `saveCustomTemplate` is internal to the store (not exposed publicly).

---

## 12. Out of scope for v1 of this feature

- Persistent custom templates across browser sessions (localStorage/backend)
- Per-primitive label editing in the preview
- Multi-turn refinement (chat-style back-and-forth)
- Custom blocks appearing in the placeholder suggestion cycle
- Exporting or sharing custom block definitions
- Custom template management UI (rename, delete from registry)
