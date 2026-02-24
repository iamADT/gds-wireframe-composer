# GDS Lo-Fi Composer — v2 Feature Spec

**Status:** Partially shipped
**Depends on:** v1 (PRD.md) fully shipped

> **Note:** The `remove <block-type>` command was originally considered here but has been shipped as part of the core block input (Phase 8 in build-plan.md). Block reordering (Section 1) has also shipped. Section 2 (AI Block Generation using `describe`) was superseded — the `generate` keyword approach ships custom AI blocks instead (see PRD.md). Sections 3 and 4 (Emmet expansion + Tab completion) have shipped as Phase 11.

---

## 1) Block Reordering ✅ Shipped

Users can move any block up or down within its container, changing the visual order in both the composer and the live preview.

### 1.1 Interaction methods

**Keyboard:**

| Shortcut | Action | Context |
|----------|--------|---------|
| `Cmd+↑` / `Ctrl+↑` | Move selected block up one position | Block is selected, not editing |
| `Cmd+↓` / `Ctrl+↓` | Move selected block down one position | Block is selected, not editing |

**Mouse:**

- Each block row shows a **grab handle** (six-dot icon) on the left edge on hover.
- Click and drag the handle to reposition the block. A drop indicator line appears between blocks to show the target position.
- Release to confirm the new position.

**Ellipsis menu:**

- "Move up" and "Move down" options added to the per-block context menu.
- Options are disabled/hidden when the block is already at the top or bottom.

### 1.2 Constraints

- The first block in a container can only move down. The last block can only move up.
- Reordering is purely visual — it changes the block's index in the `blocks[]` array within the container.
- The preview updates instantly to reflect the new order.
- Selection stays on the moved block after reorder (it follows the block, not the position).

### 1.3 Animation

- Reordered blocks animate to their new position using `translateY` over `--duration-normal` (`120ms ease-out`).
- Displaced blocks shift smoothly in the opposite direction.
- No layout jank — use Framer Motion's `LayoutGroup` or equivalent for coordinated movement.

### 1.4 State changes

```
// No new state fields needed — reorder mutates the blocks[] array index
moveBlock(containerId: string, blockId: string, direction: 'up' | 'down'): void
```

---

## 2) AI Block Generation ⚠️ Superseded

> The `describe` keyword approach below was never implemented. The shipped version uses a `generate` keyword (appended to a description) to trigger AI custom block generation via the Claude API. See the existing `BlockInput` component and `generateBlock.ts`. The spec below is retained for historical reference only.

---

### Original spec (not implemented as written)

Users can summon an AI agent directly from the block input to generate the next block (or sequence of blocks) from a natural language description.

### 2.1 Trigger

The keyword **`describe`** activates AI mode when typed at the **beginning** or **end** of the block input text.

**Pattern:**
```
describe <natural language description>
<natural language description> describe
```

**Examples:**
```
describe a signup form with email, password, and a submit button
describe a settings screen with toggle switches for notifications and dark mode
a product card with image, title, price, and add to cart button describe
```

### 2.2 UX flow

1. User types in the block input. The system detects `describe` at the start or end of the input.
2. The input styling changes to indicate AI mode:
   - A small AI indicator icon appears (e.g. sparkle) to the left of the input.
   - The input border shifts to the `--tint-blue-strong` bevel variant.
   - Placeholder changes to `describe what you want to build...`
3. User presses **Enter** to submit the description.
4. A loading state appears — the block input shows a pulsing indicator while the agent processes.
5. The AI agent interprets the description and inserts one or more blocks:
   - Simple descriptions produce a single block (e.g. "describe a heading that says Welcome" → one `heading` block with label "Welcome").
   - Complex descriptions produce multiple blocks in sequence (e.g. "describe a signup form" → `heading` + `input` + `input` + `button`, similar to the form macro but with custom labels derived from the description).
6. The newly generated blocks appear in the composer and preview. The block input reappears below, ready for the next entry.

### 2.3 What the AI agent receives

The agent is given:

- The user's description text (with `describe` keyword stripped)
- The current container's existing blocks (type + label for each) — so it understands context
- The available block types and their descriptions (from the block type table in PRD.md)
- The container type (screen or modal) — to inform layout choices

### 2.4 What the AI agent returns

A JSON array of blocks to insert:

```json
[
  { "type": "heading", "label": "Create Account" },
  { "type": "input", "label": "Email address" },
  { "type": "input", "label": "Password" },
  { "type": "input", "label": "Confirm password" },
  { "type": "button", "label": "Sign Up" }
]
```

Each entry must use a valid block type from the v1 block type table. The agent cannot invent new block types — it composes from the existing primitives.

### 2.5 Error handling

| Scenario | Behavior |
|----------|----------|
| AI fails to respond | Input shows error text "Couldn't generate blocks — try again" for 3 seconds, then returns to normal input |
| AI returns invalid block type | Skip that block silently, insert the valid ones |
| AI returns empty array | Show "No blocks generated — try a more specific description" |
| Network error | Show "Offline — type block names manually" |

### 2.6 AI mode constraints

- The `describe` keyword must be the literal word "describe" — no abbreviations.
- If the user types a valid block type name that happens to start with "describe" (none currently do), the block type match takes precedence.
- AI-generated blocks are immediately editable — they are standard blocks with no special status after insertion.
- The user can undo AI-generated blocks by deleting them individually (v1 behavior). Batch undo of an AI generation is a future consideration.

### 2.7 Visual spec (extends composer-visuals.md)

**AI mode input:**
```
Border:        Selected bevel (--tint-blue-strong)
Background:    --glass-surface-2 + --glass-blur-sm
Icon:          Sparkle icon, --tint-blue-strong, 14px, left of input text
Placeholder:   "describe what you want to build..."
```

**Loading state:**
```
Input:         Non-editable, text shows user's description in --text-tertiary
Indicator:     Pulsing dot sequence (3 dots) in --tint-blue, 600ms cycle
Border:        Selected bevel maintained
```

**Success insertion:**
```
New blocks animate in from opacity 0 + translateY(8px) → settled position
Stagger:       Each block delays 50ms after the previous
Duration:      --duration-normal (120ms) per block
```

---

## 3) Emmet-style Block Expansion ✅ Shipped

Users can add multiple blocks in a single Enter press using a `>`-separated shorthand expression.

### 3.1 Syntax

```
<block> > <block> > <block> *N > <block>
```

- `>` separates blocks (sequence, not nesting)
- `*N` repeats the preceding block N times (max 10)
- Block names are fuzzy-matched (same logic as the autocomplete dropdown)
- Spaces within a name are fine: `body text` → `body-text`
- Space around `*` is optional: `radios*2` or `radios *2`
- Macro blocks expand as usual: `form` inside an Emmet sequence → h1 + text-input + button
- Unresolvable segment names are silently skipped; a sequence with zero resolvable segments is a no-op

**Trigger:** input contains `>`. Checked before generate/remove modes.

### 3.2 UX

- A hint appears below the input as the user types, showing the resolved sequence: `→ h1 · body-text · radios · radios · button`
- Autocomplete dropdown and "no match" hint are suppressed while in Emmet mode
- Press Enter → all blocks added, last block selected, input clears
- If no segments resolve → nothing happens, input stays

### 3.3 Store change

`addBlocks(types: BlockType[]) => void` — added to `useComposerStore`. Appends all resolved blocks to the active container and selects the last one.

---

## 4) Tab Completion ✅ Shipped

Tab provides fast keyboard-driven completion in both normal and Emmet modes.

### 4.1 Normal mode (no `>`)

As the user types a partial block name, a ghost text suffix appears inline after the cursor showing the top fuzzy match completion (e.g. typing `gds-he` shows `gds-he` + `ader` in muted colour). Pressing Tab accepts the suggestion, setting the input value to the full block name.

**Ghost text rendering:** The input's text colour is set to `transparent`; an absolutely-positioned overlay div (same font/padding) renders the typed text in solid colour followed by the ghost suffix at 50% opacity. The caret remains visible via `caretColor`.

### 4.2 Emmet mode (has `>`)

| Cursor position | Tab action | Hint shown |
|-----------------|-----------|------------|
| Partial last segment: `h1 > bod` | Completes segment → `h1 > body-text` | `Tab → body-text` |
| Empty last segment: `h1 > ` | Appends contextual next block → `h1 > body-text` | `Tab add body-text` |

The contextual "next" suggestion is driven by a `COMMON_NEXT` map encoding typical GOV.UK page structure:

```
gds-header → phase-banner → h1 → body-text → button → gds-footer
service-nav / back-link / breadcrumbs / error-summary / notification-banner → h1
text inputs / radios / checkboxes / select / date-input / file-upload / summary-list / table / accordion / tabs → button
task-list / panel / pagination → gds-footer
```

### 4.3 Keyboard shortcut added

| Shortcut | Action | Context |
|----------|--------|---------|
| `Tab` | Accept ghost completion / complete partial segment / append next block | Block input field |

---

## 5) Updated keyboard shortcuts (v2 additions)

| Shortcut | Action | Context |
|----------|--------|---------|
| `Cmd+↑` / `Ctrl+↑` | Move selected block up | Block selected, not editing |
| `Cmd+↓` / `Ctrl+↓` | Move selected block down | Block selected, not editing |
| `Tab` | Accept completion / complete Emmet segment / append next block | Block input field |
| `Enter` | Submit Emmet sequence or AI generation | Block input |
| `Escape` | Cancel AI generation | Block input in AI mode |

---

## 6) Future considerations (beyond v2)

- **Batch undo** — Cmd+Z after AI generation reverts all generated blocks in one step
- **AI refinement** — select existing blocks and type "describe" to have the AI modify or replace them
- **Drag-and-drop reordering** — complement keyboard reorder with full drag-and-drop (grab handle already designed for this)
- **AI block type invention** — allow the agent to propose new block types not in the primitive set, rendered as generic placeholder blocks
