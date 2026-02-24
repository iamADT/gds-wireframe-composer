# Connect Canvas — Feature Spec

**Status:** Shipped
**Feature:** Third view tab — a near-infinite, pannable/zoomable flow canvas where screens can be placed and connected with arrows, and basic flowchart shapes can be added to annotate the user journey.

---

## 1. Overview

The Connect view turns the wireframe composer into a lightweight flow diagram tool. After building screens in the composer, a user switches to Connect, drags their screens onto the canvas, draws arrows between them to define the flow, and annotates with standard flowchart shapes (start, end, decision, process).

The mental model is: **screens are the pages of your service; Connect shows how a user moves between them.**

---

## 2. Navigation — Adding "Connect" View

The `'current' | 'screens'` view toggle in `ContainerCreator` gains a third option:

```
[ Current ]  [ Screens ]  [ Connect ]
```

- "Connect" only shown when at least one container exists (same rule as the existing toggle)
- Switching to Connect does not change `activeContainerId` — returning to "Current" restores wherever the user was
- The view state type widens to `'current' | 'screens' | 'connect'`

When Connect is active, the **left panel** becomes the canvas sidebar (screens list + shape palette) and the **right panel** is replaced entirely by the canvas. The live preview is hidden while in Connect.

---

## 3. Library

**`@xyflow/react`** (React Flow v12). Handles pan/zoom, draggable nodes, port-based edge creation, and custom node/edge renderers out of the box. MIT licensed. The glass aesthetic is applied via custom node and edge components.

---

## 4. Screen Renaming

Renaming is available in the Screens list and on the Connect canvas. The Composer panel header does not currently expose renaming.

### 4.1 Where renaming is available

- **Screens list view** — double-click the name in the `ContainerList` row
- **Connect canvas** — double-click the name in the screen node's header bar

### 4.2 Behaviour

- Enter confirms; Escape cancels
- Blank submit reverts to previous value
- No uniqueness constraint (screens distinguished by ID)
- Change reflects instantly across all views

### 4.3 Store addition

```ts
renameContainer: (id: string, name: string) => void;
```

---

## 5. Canvas

### 5.1 Behaviour

- **Near-infinite** — unbounded in all directions; content starts at default viewport
- **Pan** — drag the canvas background
- **Zoom** — scroll wheel or pinch; range ~25%–200%
- **Background** — dot-grid matching the existing preview canvas style (`--bg-0` base, 20px grid)
- **Viewport** — React Flow manages viewport state internally; it is not persisted to the store

### 5.2 Store state

React Flow manages its own viewport (pan/zoom) internally. The store does **not** hold a `canvasViewport` field — this was considered and intentionally omitted for MVP.

---

## 6. Canvas Nodes

Two kinds of node: **screen nodes** and **shape nodes**.

### 6.1 Screen nodes

Screen nodes show a **live read-only mini-preview** of the screen's actual wireframe blocks. The preview is rendered using the existing `Preview` component, scaled down with CSS `transform: scale()` and `pointer-events: none` so it cannot be edited on the canvas.

**Layout:**

```
┌─────────────────────────────┐
│  Confirm details       [✎]  │  ← screen name (double-click to rename) + Edit button
├─────────────────────────────┤
│ ┌─────────────────────────┐ │
│ │                         │ │
│ │   scaled-down Preview   │ │  ← pointer-events: none, scale ~0.215 (220/1024px)
│ │                         │ │
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

- **Width:** 220px fixed
- **Preview area height:** 150px
- **Edit button (✎)** in the header top-right: sets the screen as active and switches view to "Current"
- **Style:** `glass-elevated` card, `border-radius: 12px`
- **Ports:** 4 handles (top, right, bottom, left) — see section 7.3 for handle implementation
- **Selection:** blue `outline` ring + tinted header when selected (via `selected` prop from React Flow's `NodeProps`)

**Mini-preview implementation:** The Preview component renders at 1024px inside a `pointer-events: none; overflow: hidden` container, scaled with `transform: scale(0.215); transform-origin: top left`. The container is `220 × 150px`; the inner div is `1024px` wide pre-scale.

### 6.2 Shape nodes

Standalone flowchart shapes — canvas-only, not linked to any screen.

| Shape | Label | Typical use |
|-------|-------|-------------|
| ○ Oval | Start / End | Entry and exit points |
| ◇ Diamond | Decision | Branching — yes/no, eligible/not |
| □ Rectangle | Process | Off-canvas step or action |

- **Fixed size** — no resize handles
- **Editable label** — double-click to edit inline
- **4 ports** — top, right, bottom, left; visible on hover
- **Freeform connections** — no enforcement on number of outbound edges per shape type
- **Style:** SVG shape with coloured stroke accent (oval: green, diamond: amber, rectangle: blue-grey); subtle fill tint; `filter: drop-shadow` glow when selected
- **Selection feedback:** brighter SVG stroke + blue glow via `filter: drop-shadow` when `selected` prop is true

### 6.3 Store state

```ts
interface CanvasNode {
  id: string;              // screen nodes: matches Container.id; shapes: nanoid()
  kind: 'screen' | 'shape';
  shapeType?: 'start-end' | 'decision' | 'process';
  position: { x: number; y: number };
  label?: string;          // shape nodes only; screen nodes use Container.name
}

canvasNodes: CanvasNode[];
```

---

## 7. Connectors (Edges)

### 7.1 Drawing a connection

1. Hover a node — port handles appear (see section 7.3)
2. Drag from a port handle
3. Drop onto any other node to create the connection
4. Drop onto empty canvas — cancels

### 7.2 Appearance

- **Type:** `step` (orthogonal routing) — lines travel horizontally and vertically only, making right-angle turns
- **Arrow:** directed, arrowhead at target end (`markerEnd: ArrowClosed`)
- **Colour:** `rgba(255,255,255,0.35)` at rest
- **Label:** optional short text at edge midpoint (e.g. "Yes", "No", "Submit", "Error")

### 7.3 Port handles

Each node has 4 `type="source"` handles (top, right, bottom, left). `connectionMode={ConnectionMode.Loose}` is set on the `<ReactFlow>` component, which allows source-to-source connections — whichever handle the user **drags from** becomes the source end; the arrowhead always appears at the **drop target**.

**Why source-only handles:** Having both source and target handles at the same position caused React Flow to pick up the target handle on mousedown (rendered on top), resulting in the arrow pointing backwards. Source-only + loose mode fixes this.

**Hit area:** The handle DOM element is `36×36px` but transparent. A `::before` pseudo-element draws the visible `16px` dot centred inside. This gives ~10px of invisible grab area around the dot. Cursor changes to `crosshair` and a connection drag can start anywhere within the 36px zone.

**Visibility:** Handles are `opacity: 0.3` at rest and `opacity: 1` on node hover. Hovering a handle directly intensifies the glow and brightens the border.

### 7.4 Edge labels

**UX:** Double-click an edge to open a small inline text input at the midpoint. Enter confirms, Escape cancels. If the label is cleared, it is removed.

**Implementation:** Custom `StepEdge` component using React Flow's `<EdgeLabelRenderer>` and `getSmoothStepPath` with `borderRadius: 4`.

### 7.5 Store state

```ts
interface CanvasEdge {
  id: string;
  source: string;
  sourceHandle: 'top' | 'right' | 'bottom' | 'left';
  target: string;
  targetHandle: 'top' | 'right' | 'bottom' | 'left';
  label?: string;
}

canvasEdges: CanvasEdge[];
```

---

## 8. Left Panel in Connect View

Two sections, top to bottom:

### 8.1 Screens to place

- Shows all screens **not yet on the canvas** as visual rectangle cards
- Each card mimics a mini browser frame: traffic-dot title bar showing screen name + block stub bars
- **Drag** a card onto canvas → places it as a screen node; card disappears from this section

### 8.2 Screens on canvas

- Shows all screens **already placed** as a compact list with an "on canvas" badge
- Appears only when at least one screen has been placed

### 8.3 Shape palette

- Three items: **Start/End** (oval), **Decision** (diamond), **Process** (rectangle)
- **Click** → places shape at a random offset position on canvas
- **Drag** → places shape at the drop position

---

## 9. Interactions Summary

| Action | How |
|--------|-----|
| Pan canvas | Drag background |
| Zoom | Scroll wheel / pinch |
| Place screen on canvas | Drag from "Screens to place" sidebar |
| Remove screen from canvas | Select node → Delete/Backspace |
| Add shape | Click palette item (random position) or drag to position |
| Move node | Drag node |
| Connect two nodes | Drag from port handle → drop on target node |
| Delete edge | Click to select → Delete/Backspace |
| Delete shape node | Click to select → Delete/Backspace |
| Delete screen node | Click to select → Delete/Backspace — screen returns to "Screens to place" |
| Edit shape label | Double-click shape |
| Edit edge label | Double-click edge |
| Rename screen | Double-click screen name (on node or in Screens list) |
| Open screen in editor | Click ✎ button on screen node → switches to Current view |
| Fit all nodes | ⊡ button in canvas toolbar |

---

## 10. Canvas Toolbar

Small floating overlay (bottom-right of the canvas panel):

| Control | Action |
|---------|--------|
| `+` | Zoom in |
| `−` | Zoom out |
| `⊡` | Fit all nodes to viewport |

Delete is handled by keyboard (Delete/Backspace on selected node or edge).

---

## 11. Full State Additions

```ts
// New types
interface CanvasNode { ... }   // see section 6.3
interface CanvasEdge { ... }   // see section 7.5

// New store fields
canvasNodes: CanvasNode[];
canvasEdges: CanvasEdge[];

// New store actions
renameContainer:            (id: string, name: string) => void;
addCanvasNode:              (node: CanvasNode) => void;
updateCanvasNodePosition:   (id: string, position: { x: number; y: number }) => void;
removeCanvasNode:           (id: string) => void;
addCanvasEdge:              (edge: CanvasEdge) => void;
updateCanvasEdgeLabel:      (id: string, label: string) => void;
removeCanvasEdge:           (id: string) => void;
```

Note: `canvasViewport` and `setCanvasViewport` were **not** added — React Flow manages viewport internally.

State is **in-memory only** — canvas layout does not survive a page refresh.

### React Flow state approach

`ConnectCanvas` uses `useNodesState` / `useEdgesState` (React Flow's own hooks) so RF can track selection state internally. Without these, keyboard deletion does not work (RF cannot track which nodes are selected). `useEffect` syncs `canvasNodes` / `canvasEdges` from the store into RF state when the store changes, preserving RF-internal state (selection, position during drag) for existing nodes.

---

## 12. New Components

| Component | Responsibility |
|-----------|----------------|
| `ConnectCanvas` | React Flow wrapper; `useNodesState`/`useEdgesState` + store sync; drop target for sidebar drags |
| `ScreenNode` | Custom RF node — glass card with scaled-down read-only Preview, rename, Edit button, ports |
| `ShapeNode` | Custom RF node — flowchart shape (oval/diamond/rect), editable label, ports, selection glow |
| `StepEdge` | Custom RF edge — orthogonal routing, optional label via `<EdgeLabelRenderer>` |
| `ConnectSidebar` | Left panel in Connect view — "Screens to place" cards + "Screens on canvas" list + shape palette |
| `CanvasToolbar` | Floating zoom/fit controls (inline in ConnectCanvas) |

**`ContainerCreator`** gains `'connect'` in the view toggle.
**`ContainerList`** gains inline rename (double-click name → input).
**`App.tsx`** renders `ConnectSidebar` + `ConnectCanvas` when `view === 'connect'`.

---

## 13. Out of Scope

- Export canvas as PNG/SVG
- Canvas persistence (localStorage / backend)
- Swimlanes / groups
- Auto-layout
- Animated flow playback
- Shape resizing
- Connector style variants (dashed, bidirectional, thick)
- Multi-select / lasso selection
- Right-click context menus on nodes

---

## 14. Decisions Record

| # | Question | Decision |
|---|----------|----------|
| 1 | Library | `@xyflow/react` ✅ |
| 2 | Screen thumbnails | Live scaled-down Preview, read-only; Edit button navigates to Current view |
| 3 | Unplaced screens | Visual card sidebar ("Screens to place"); placed screens shown as compact list ("Screens on canvas") |
| 4 | Connector routing | Orthogonal / step (right-angle lines, `getSmoothStepPath` with `borderRadius: 4`) |
| 5 | Edge labels | Included in v1 — double-click edge to add label |
| 6 | Shape resizing | Fixed size |
| 7 | Persistence | In-memory only |
| 8 | Delete behaviour | Shape: removed permanently; Screen node: removed from canvas, screen returns to sidebar |
| 9 | Decision diamond outputs | Freeform — no enforcement |
| 10 | Open button | Switches view to "Current" and sets that screen active |
| 11 | Viewport persistence | Not persisted — React Flow manages internally, not synced to store |
| 12 | Handle type | Source-only handles + `connectionMode="loose"` — fixes backwards arrow bug from overlapping source+target handles |
| 13 | Handle hit area | 36px transparent element; 16px visible dot via `::before` pseudo-element; cursor `crosshair` and drag both activate within the larger zone |
| 14 | RF state management | `useNodesState`/`useEdgesState` required for keyboard deletion (selection tracking); store sync via `useEffect` |
| 15 | Selection feedback | `selected` prop from `NodeProps` — screen nodes get blue outline ring; shape nodes get brighter SVG stroke + drop-shadow glow |
