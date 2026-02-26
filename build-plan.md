# Wireframe Composer v1 — Build Plan

## Phase 1: Scaffold + Glass Design System ✅
- [x] Init Vite 7 + React 19 + TypeScript + Tailwind CSS 4 + Framer Motion 12
- [x] Define CSS custom properties from composer-visuals.md (all tokens in one file)
- [x] Build reusable glass CSS classes: .glass, .glass-elevated, .glass-selected, .glass-focus, .glass-specular
- [x] Set up two-panel layout shell with #070707 void background
- [x] App bar with inverted bevel

## Phase 2: Data Layer + State ✅
- [x] Define TypeScript types: BlockType, Block, Container
- [x] Build useComposerStore hook (containers, activeContainerId, selectedBlockId, blockInputVisible, blockInputValue)
- [x] Mutation callbacks: createContainer, addBlock, updateBlockLabel, deleteBlock, duplicateBlock, repeatBlock, setActiveContainer, setSelectedBlock
- [x] Macro expansion logic (form → 4 blocks, footer → 3, bottom-nav → 3)

## Phase 3: Container Creation Flow ✅
- [x] ContainerCreator — Screen/Modal segmented toggle + Create button
- [x] ContainerList — Sidebar rows with selected state, click to switch
- [x] Container auto-naming (Screen 1, Screen 2..., Modal 1, Modal 2...)
- [x] Type switching (screen ↔ modal) with re-numbering

## Phase 4: Block Input + Composer ✅
- [x] BlockInput — Auto-focused text field after container creation
- [x] Fuzzy matching against block type names
- [x] Autocomplete dropdown with arrow key navigation
- [x] Placeholder cycling (try "header", try "hero", try "text")
- [x] Enter to add block + reveal next input, Escape to clear/dismiss
- [x] BlockRow — Icon, type label, editable name
- [x] Double-click to edit label, Enter/Escape to confirm/cancel
- [x] EllipsisMenu — Duplicate, Repeat (2/3/4), Delete
- [x] NewScreenButton — "✚ New screen" button with ⌘+↵ shortcut hint; replaces text-only hint

## Phase 5: Preview + WireBlock Rendering ✅
- [x] Preview — Dot-grid canvas, centered device frame with glass bevel
- [x] Phone frame chrome: status bar (9:41, signal, battery), home indicator
- [x] Modal frame variant: smaller card with pull handle + scrim
- [x] WireBlock render switch for each block type (header, hero, heading, text, button, input, footer, bottom-nav)
- [x] Selection highlight: tint-blue-strong ring + subtle fill
- [x] Selection sync between composer and preview

## Phase 6: Inline Editing in Preview ✅
- [x] Single click selects block in preview
- [x] Double click enters contentEditable mode
- [x] Bidirectional sync: preview edits → block label → composer
- [x] Enter confirms, Escape reverts, click-outside confirms
- [x] Text block rendering mode switch: wireframe lines ↔ editable text with crossfade

## Phase 7: Polish + Keyboard UX ✅
- [x] Global keyboard shortcuts (Cmd+Enter, arrow nav, Delete)
- [x] Block input keyboard flow (Enter/Escape/arrows)
- [x] Framer Motion animations: block enter/exit, overlay appear/disappear, specular transitions
- [x] prefers-reduced-motion support
- [x] backdrop-filter fallback
- [x] Style lint check: zero hue violations

## Phase 8: Remove Block Command ✅
- [x] `remove <block-type>` prefix detection in BlockInput (case-insensitive regex)
- [x] Remove mode: suggestions filtered to block types present in active container only
- [x] Fuzzy match in remove mode (e.g. `remove but` → suggests `button`)
- [x] `removeLastBlockOfType` store action — removes the last instance of a type
- [x] Destructive visual styling: red-tinted input border/background, ✕ icon in dropdown, red highlight on hover
- [x] Enter submits removal; input clears and stays ready for next command
- [x] No-op if no matching type exists in container

## Phase 9: GDS Component Additions + Radios Interactivity ✅
- [x] `service-nav` block — white bar with editable service name; nav items driven by `options[]` (starts empty on creation)
- [x] `service-nav` nav items: double-click to rename, hover to delete, `+ add nav item` to append; first item renders with blue underline (active)
- [x] `gds-header` wordmark — replaced white rectangle placeholder with `GOV•UK` bold white text, dot dimmed to 50% white
- [x] `gds-header` simplified — removed editable service name from header; header is now wordmark-only
- [x] Radios interactive options — `options?: string[]` field added to `Block` interface
- [x] `addBlock` seeds default options for `radios` (`['England', 'Scotland', 'Wales']`)
- [x] `question` macro seeds radios options (`['Yes', 'No']`)
- [x] `updateBlockOptions(blockId, options)` store action
- [x] Radios preview: double-click option to edit inline (Enter confirms, Escape cancels)
- [x] Radios preview: hover option to reveal `×` delete button (disabled when only 1 option remains)
- [x] Radios preview: "or add another" dashed row appends new option and auto-enters edit mode
- [x] Placeholder suggestions updated: index 1 is now `try "service-nav"` (shown after inserting gds-header)
- [x] Chevron dropdown size fixed in ContainerCreator (32px with `lineHeight: 1` and `top: 38%`)

## Phase 10: GDS Style Compliance + New Block Types + Layout ✅

### Style guide compliance
- [x] Colour tokens corrected to match GDS spec: `grey1` `#f4f8fb`, `grey3` `#484949`, `greyLine` `#cecece`
- [x] Heading sizes corrected: `h1` 48px/50px, `h2` 36px/40px, `h3` 27px/30px (previously 32/24/18px)
- [x] Font family set to `Arial, sans-serif` on the preview container; background set to `#ffffff`

### New block types (8)
- [x] `select` — dropdown with bold label, hint text, 2px bordered box with chevron; max-width 320px
- [x] `table` — editable caption + bold header row (3 cols, grey bars) + 4 placeholder data rows
- [x] `tag` — rounded pill with editable label; grey background, black bold text
- [x] `pagination` — Previous / page numbers (1, 2, 3 … 10) / Next; page 1 active (black bg)
- [x] `file-upload` — bold label + "PDF, JPG or PNG" hint + "Choose file" button + "No file chosen"
- [x] `accordion` — bordered sections; first expanded; `options[]` for section titles; add/edit/delete sections
- [x] `tabs` — tab bar with first tab active; `options[]` for tab labels; add/edit/delete tabs; placeholder content below
- [x] `task-list` — `options[]` stores tasks as `"name||STATUS"`; click status to cycle (NOT STARTED → IN PROGRESS → COMPLETED → CANNOT START YET); add/edit/delete tasks

### Default options seeded in store
- [x] `accordion` seeds `['Section 1', 'Section 2', 'Section 3']`
- [x] `tabs` seeds `['Tab 1', 'Tab 2', 'Tab 3']`
- [x] `task-list` seeds `['Check eligibility', 'Prepare documents', 'Submit application']` (all `NOT STARTED`)
- [x] `service-nav` seeds `[]` (empty — user adds nav items as needed)

### Preview layout
- [x] Preview frame widened from 640px to 1024px (matching desktop GOV.UK page width)
- [x] Full-bleed layout rule: `gds-header`, `service-nav`, `gds-footer` span full 1024px
- [x] All other blocks wrapped in `max-width: 960px, margin: 0 auto` (GDS `govuk-width-container` equivalent)

## Phase 11: Emmet Expansion + Tab Completion ✅

### Emmet-style multi-block expansion
- [x] `>` separator triggers Emmet mode (checked before generate/remove modes)
- [x] `parseEmmet(input)` splits on `>`, resolves each segment via fuzzy match, returns `BlockType[]`
- [x] `*N` repeat syntax (e.g. `radios *2`) — capped at 10; space around `*` is optional
- [x] Unresolvable segments silently skipped; empty result is a no-op (input stays)
- [x] Macro blocks expand as usual within an Emmet sequence
- [x] `addBlocks(types: BlockType[])` store action — appends all resolved blocks, selects last
- [x] Resolved sequence hint shown below input: `→ h1 · body-text · radios · radios · button`
- [x] Autocomplete dropdown suppressed in Emmet mode
- [x] "No match" hint suppressed in Emmet mode

### Tab completion
- [x] `computeTabCompletion(value)` returns one of three modes:
  - `inline` — normal mode: ghost suffix of top fuzzy match
  - `emmet-complete` — partial last segment completed to top match
  - `emmet-next` — empty last segment: appends contextual next block from `COMMON_NEXT` map
- [x] `COMMON_NEXT` map encodes GOV.UK page structure (gds-header → phase-banner → h1 → body-text → button → gds-footer etc.)
- [x] Ghost text overlay in normal mode: input text transparent + absolutely-positioned div shows typed text + ghost suffix at 50% opacity
- [x] Tab hint (`Tab add <block>` / `Tab → <block>`) shown below Emmet hint
- [x] Tab key in `handleKeyDown` prevents default and sets value to `tabCompletion.replacement`

## Phase 12: Template Keyword + About Modal ✅

### Template keyword expansion
- [x] `template` keyword detected in `BlockInput` (`isTemplateMode` flag)
- [x] Typing `template` + Enter expands to `gds-header > service-nav > back-link > h1` via `onAddBlocks`
- [x] Expansion hint (`→ gds-header · service-nav · back-link · h1`) shown below input when keyword is fully typed
- [x] Ghost-text completion from `"tem"` onwards as a fallback after the block-type ghost check
- [x] "No match — append generate" hint suppressed when in template mode

### About modal
- [x] `AppBar` — "About" button top-right opens a glass modal
- [x] Modal content: app name, "Created by Tolu Alder", 5 actionable "Try…" tips with quoted keywords
- [x] Modal closes on backdrop click or ✕ button
- [x] `AppBar` listens for `CustomEvent('open-about')` on `window` so the modal can be triggered from anywhere
- [x] Empty-state `AppDescription` in `Preview` shows a "Learn more →" link below the ghost wireframe; dispatches `open-about` event on click

## Phase 13: Components Gallery ✅

- [x] `AppBar` — "Components" button added to the left of "About"; manages `showComponents` local state; renders `<ComponentsPage />` when active
- [x] `ComponentsPage` — fixed full-viewport overlay (`position: fixed; inset: 0; z-index: 150`); `position: fixed` overlay covers the full viewport
- [x] Header bar — "← Back" button closes the page; "Components" title; count pill updates live to reflect filtered results
- [x] Search bar — glass-styled input (matches app design tokens); filters all 32 components by name in real time; ✕ clear button; "No components match" empty state
- [x] Bento grid — `grid-template-columns: repeat(3, 1fr); grid-auto-flow: dense; gap: 12px`; colSpan 1/2/3 per component; uniform `CARD_H = 180px` row height
- [x] Card structure — outer glass-bevel frame (8px padding, `--border-outer` + `--border-inner` inset box-shadow) wrapping inner white box (border-radius 6px, overflow hidden)
- [x] Component name — rendered inside the cell, top-left, 10px semibold at `rgba(0,0,0,0.35)`
- [x] WireBlock preview — actual live GOV.UK component rendered inside the white box; `pointer-events: none; user-select: none` (display only)
- [x] Hover effect — outer frame lifts `translateY(-3px) scale(1.012)`, shadow deepens, bevel brightens; `140ms ease-out` transition
- [x] Mock blocks — 32 components with correct default labels and `options[]` (radios, accordion, tabs, task-list, service-nav); macros (`form`, `question`) and `custom` excluded
