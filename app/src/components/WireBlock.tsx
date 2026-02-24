import { useState } from 'react';
import type { Block } from '../types';
import EditableText from './EditableText';

interface Props {
  block: Block;
  isSelected: boolean;
  onSelect: () => void;
  onUpdateLabel: (label: string) => void;
  onUpdateOptions?: (options: string[]) => void;
}

// ─── GOV.UK colour tokens ───────────────────────────────────────────────────
const C = {
  black:       '#0b0c0c',
  white:       '#ffffff',
  blue:        '#1d70b8',   // brand blue — header bg after June 2025 refresh
  green:       '#0f7a52',   // updated button green (was #00703c in pre-v6)
  greenDark:   '#0a5539',   // button shadow (darker shade of new green)
  red:         '#ca3535',
  redDark:     '#8c2424',
  yellow:      '#ffdd00',
  grey1:       '#f4f8fb',
  grey2:       '#b1b4b6',
  grey3:       '#484949',
  greyLine:    '#cecece',
  linkBlue:    '#1a65a6',
};

// ─── Shared lo-fi text lines (body text placeholder) ────────────────────────
function TextLines({ widths = [100, 95, 88, 70] }: { widths?: number[] }) {
  return (
    <div className="flex flex-col" style={{ gap: 6 }}>
      {widths.map((w, i) => (
        <div
          key={i}
          style={{
            width: `${w}%`,
            height: 8,
            borderRadius: 4,
            background: C.grey2,
          }}
        />
      ))}
    </div>
  );
}

// ─── GOV.UK Header ──────────────────────────────────────────────────────────
function WireGdsHeader(_: { block: Block; onUpdateLabel: (l: string) => void }) {
  return (
    <div style={{ background: C.blue, padding: '12px 20px' }}>
      <span className="font-bold" style={{ fontSize: 18, color: C.white, letterSpacing: '0.02em' }}>
        GOV<span style={{ color: 'rgba(255,255,255,0.5)' }}>•</span>UK
      </span>
    </div>
  );
}

// ─── Phase Banner ───────────────────────────────────────────────────────────
function WirePhaseBanner({ block, onUpdateLabel }: { block: Block; onUpdateLabel: (l: string) => void }) {
  return (
    <div
      style={{
        padding: '8px 20px',
        borderBottom: `1px solid ${C.greyLine}`,
        display: 'flex',
        alignItems: 'baseline',
        gap: 10,
      }}
    >
      <span
        className="text-xs font-bold"
        style={{
          padding: '2px 8px',
          background: C.blue,
          color: C.white,
          letterSpacing: '0.05em',
          flexShrink: 0,
        }}
      >
        <EditableText value={block.label} onCommit={onUpdateLabel} style={{ color: C.white }} />
      </span>
      <span className="text-sm" style={{ color: C.black }}>
        This is a new service –{' '}
        <span style={{ color: C.linkBlue, textDecoration: 'underline' }}>your feedback</span>
        {' '}will help us to improve it.
      </span>
    </div>
  );
}

// ─── Back Link ───────────────────────────────────────────────────────────────
function WireBackLink({ block, onUpdateLabel }: { block: Block; onUpdateLabel: (l: string) => void }) {
  return (
    <div style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 7 }}>
      {/* GDS chevron — border-rotated square, same as ::before pseudo-element */}
      <span style={{
        display: 'inline-block',
        width: 7,
        height: 7,
        borderLeft: `2px solid ${C.black}`,
        borderBottom: `2px solid ${C.black}`,
        transform: 'rotate(45deg)',
        flexShrink: 0,
        marginBottom: 1,
      }} />
      <EditableText
        value={block.label}
        onCommit={onUpdateLabel}
        style={{ color: C.black, textDecoration: 'underline', fontSize: 16 }}
      />
    </div>
  );
}

// ─── Breadcrumbs ─────────────────────────────────────────────────────────────
function WireBreadcrumbs({ block, onUpdateLabel }: { block: Block; onUpdateLabel: (l: string) => void }) {
  const crumbs = block.label.split('/').map((s) => s.trim()).filter(Boolean);
  const display = crumbs.length > 1 ? crumbs : ['Home', block.label];
  return (
    <div style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: 6 }}>
      {display.map((crumb, i) => (
        <span key={i} className="flex items-center" style={{ gap: 6, fontSize: 14 }}>
          {i < display.length - 1 ? (
            <>
              <span style={{ color: C.linkBlue, textDecoration: 'underline' }}>{crumb}</span>
              <span style={{ color: C.grey3 }}>›</span>
            </>
          ) : (
            <EditableText
              value={crumb}
              onCommit={(val) => {
                const updated = [...display];
                updated[i] = val;
                onUpdateLabel(updated.join(' / '));
              }}
              style={{ color: C.black, fontSize: 14 }}
            />
          )}
        </span>
      ))}
    </div>
  );
}

// ─── H1 ──────────────────────────────────────────────────────────────────────
function WireH1({ block, onUpdateLabel }: { block: Block; onUpdateLabel: (l: string) => void }) {
  return (
    <div style={{ padding: '20px 20px 10px' }}>
      <EditableText
        value={block.label}
        onCommit={onUpdateLabel}
        className="font-bold"
        style={{ fontSize: 48, lineHeight: '50px', color: C.black }}
      />
    </div>
  );
}

// ─── H2 ──────────────────────────────────────────────────────────────────────
function WireH2({ block, onUpdateLabel }: { block: Block; onUpdateLabel: (l: string) => void }) {
  return (
    <div style={{ padding: '16px 20px 8px' }}>
      <EditableText
        value={block.label}
        onCommit={onUpdateLabel}
        className="font-bold"
        style={{ fontSize: 36, lineHeight: '40px', color: C.black }}
      />
    </div>
  );
}

// ─── H3 ──────────────────────────────────────────────────────────────────────
function WireH3({ block, onUpdateLabel }: { block: Block; onUpdateLabel: (l: string) => void }) {
  return (
    <div style={{ padding: '12px 20px 6px' }}>
      <EditableText
        value={block.label}
        onCommit={onUpdateLabel}
        className="font-bold"
        style={{ fontSize: 27, lineHeight: '30px', color: C.black }}
      />
    </div>
  );
}

// ─── Body Text ───────────────────────────────────────────────────────────────
function WireBodyText({ block, onUpdateLabel }: { block: Block; onUpdateLabel: (l: string) => void }) {
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return (
      <div style={{ padding: '8px 20px' }}>
        <EditableText
          value={block.label}
          onCommit={(val) => { onUpdateLabel(val); setIsEditing(false); }}
          className="text-base leading-relaxed block w-full"
          style={{ color: C.black, fontSize: 19 }}
        />
      </div>
    );
  }

  return (
    <div
      className="cursor-text"
      style={{ padding: '8px 20px' }}
      onDoubleClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
    >
      <TextLines />
    </div>
  );
}

// ─── Inset Text ──────────────────────────────────────────────────────────────
function WireInsetText({ block, onUpdateLabel }: { block: Block; onUpdateLabel: (l: string) => void }) {
  return (
    <div
      style={{
        margin: '8px 20px',
        paddingLeft: 15,
        borderLeft: `5px solid ${C.blue}`,
      }}
    >
      <EditableText
        value={block.label}
        onCommit={onUpdateLabel}
        className="text-base"
        style={{ color: C.black, fontSize: 19 }}
      />
    </div>
  );
}

// ─── Warning Text ─────────────────────────────────────────────────────────────
function WireWarningText({ block, onUpdateLabel }: { block: Block; onUpdateLabel: (l: string) => void }) {
  return (
    <div style={{ padding: '8px 20px', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
      <span
        className="font-bold shrink-0"
        style={{
          fontSize: 22,
          lineHeight: '25px',
          color: C.black,
          width: 24,
          height: 24,
          border: `2px solid ${C.black}`,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 1,
        }}
      >
        !
      </span>
      <EditableText
        value={block.label}
        onCommit={onUpdateLabel}
        className="font-bold text-base"
        style={{ color: C.black, fontSize: 19 }}
      />
    </div>
  );
}

// ─── Button (primary) ─────────────────────────────────────────────────────────
function WireButton({ block, onUpdateLabel }: { block: Block; onUpdateLabel: (l: string) => void }) {
  return (
    <div style={{ padding: '12px 20px' }}>
      <div
        className="inline-block font-bold text-base"
        style={{
          padding: '8px 16px',
          background: C.green,
          color: C.white,
          boxShadow: `0 3px 0 ${C.greenDark}`,
          fontSize: 19,
          cursor: 'default',
        }}
      >
        <EditableText value={block.label} onCommit={onUpdateLabel} style={{ color: C.white }} />
      </div>
    </div>
  );
}

// ─── Button (secondary) ───────────────────────────────────────────────────────
function WireButtonSecondary({ block, onUpdateLabel }: { block: Block; onUpdateLabel: (l: string) => void }) {
  return (
    <div style={{ padding: '12px 20px' }}>
      <div
        className="inline-block font-bold text-base"
        style={{
          padding: '8px 16px',
          background: C.grey1,
          color: C.black,
          border: `2px solid ${C.grey1}`,
          boxShadow: `0 3px 0 ${C.grey2}`,
          fontSize: 19,
          cursor: 'default',
        }}
      >
        <EditableText value={block.label} onCommit={onUpdateLabel} style={{ color: C.black }} />
      </div>
    </div>
  );
}

// ─── Button (warning) ─────────────────────────────────────────────────────────
function WireButtonWarning({ block, onUpdateLabel }: { block: Block; onUpdateLabel: (l: string) => void }) {
  return (
    <div style={{ padding: '12px 20px' }}>
      <div
        className="inline-block font-bold text-base"
        style={{
          padding: '8px 16px',
          background: C.red,
          color: C.white,
          boxShadow: `0 3px 0 ${C.redDark}`,
          fontSize: 19,
          cursor: 'default',
        }}
      >
        <EditableText value={block.label} onCommit={onUpdateLabel} style={{ color: C.white }} />
      </div>
    </div>
  );
}

// ─── Text Input ───────────────────────────────────────────────────────────────
function WireTextInput({ block, onUpdateLabel }: { block: Block; onUpdateLabel: (l: string) => void }) {
  return (
    <div style={{ padding: '12px 20px' }}>
      <EditableText
        value={block.label}
        onCommit={onUpdateLabel}
        className="font-bold block"
        style={{ fontSize: 19, color: C.black, marginBottom: 4 }}
      />
      <div className="text-sm" style={{ color: C.grey3, marginBottom: 6, fontSize: 16 }}>
        Enter {block.label.toLowerCase()}
      </div>
      <div
        style={{
          width: '100%',
          height: 40,
          border: `2px solid ${C.black}`,
          background: C.white,
          display: 'flex',
          alignItems: 'center',
          paddingLeft: 8,
          maxWidth: 320,
        }}
      >
        <div className="w-0.5 h-4 animate-pulse" style={{ background: C.black }} />
      </div>
    </div>
  );
}

// ─── Task List ────────────────────────────────────────────────────────────────
const TASK_STATUSES = ['NOT STARTED', 'IN PROGRESS', 'COMPLETED', 'CANNOT START YET'];
const TASK_STATUS_COLOURS: Record<string, { bg: string; color: string }> = {
  'NOT STARTED':      { bg: '#f4f8fb', color: '#484949' },
  'IN PROGRESS':      { bg: '#fffbe6', color: '#594d00' },
  'COMPLETED':        { bg: '#cce2d8', color: '#10572e' },
  'CANNOT START YET': { bg: '#f4f8fb', color: '#484949' },
};

function WireTaskList({ block, onUpdateLabel, onUpdateOptions }: {
  block: Block;
  onUpdateLabel: (l: string) => void;
  onUpdateOptions?: (options: string[]) => void;
}) {
  const tasks = block.options ?? ['Check eligibility', 'Prepare documents', 'Submit application'];
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');
  // Cycle through statuses on click — stored as "Task name||STATUS"
  const parseTask = (t: string) => {
    const [name, status = 'NOT STARTED'] = t.split('||');
    return { name, status };
  };
  const cycleStatus = (i: number) => {
    const { name, status } = parseTask(tasks[i]);
    const idx = TASK_STATUSES.indexOf(status);
    const next = TASK_STATUSES[(idx + 1) % TASK_STATUSES.length];
    const updated = [...tasks];
    updated[i] = `${name}||${next}`;
    onUpdateOptions?.(updated);
  };
  const startEdit = (i: number) => { setEditingIdx(i); setEditValue(parseTask(tasks[i]).name); };
  const commitEdit = () => {
    if (editingIdx === null) return;
    const trimmed = editValue.trim();
    if (trimmed) {
      const { status } = parseTask(tasks[editingIdx]);
      const updated = [...tasks];
      updated[editingIdx] = `${trimmed}||${status}`;
      onUpdateOptions?.(updated);
    }
    setEditingIdx(null);
  };
  const addTask = () => {
    const updated = [...tasks, `Task ${tasks.length + 1}||NOT STARTED`];
    onUpdateOptions?.(updated);
    setEditingIdx(updated.length - 1);
    setEditValue(`Task ${tasks.length + 1}`);
  };
  const deleteTask = (i: number) => {
    if (tasks.length <= 1) return;
    onUpdateOptions?.(tasks.filter((_, idx) => idx !== i));
  };

  return (
    <div style={{ padding: '12px 20px' }}>
      <EditableText
        value={block.label}
        onCommit={onUpdateLabel}
        className="font-bold block"
        style={{ fontSize: 24, color: C.black, marginBottom: 16 }}
      />
      <ol style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {tasks.map((t, i) => {
          const { name, status } = parseTask(t);
          const colours = TASK_STATUS_COLOURS[status] ?? TASK_STATUS_COLOURS['NOT STARTED'];
          return (
            <li
              key={i}
              className="group flex items-center justify-between"
              style={{
                borderBottom: `1px solid ${C.greyLine}`,
                padding: '10px 0',
              }}
            >
              <div className="flex items-center" style={{ gap: 8, flex: 1 }}>
                {editingIdx === i ? (
                  <input
                    autoFocus
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={commitEdit}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') { e.preventDefault(); commitEdit(); }
                      if (e.key === 'Escape') setEditingIdx(null);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    style={{ fontSize: 19, color: C.black, border: 'none', outline: `2px solid ${C.blue}`, padding: '2px 4px', background: 'transparent', flex: 1 }}
                  />
                ) : (
                  <span
                    style={{ fontSize: 19, color: C.linkBlue, textDecoration: 'underline', flex: 1 }}
                    onDoubleClick={(e) => { e.stopPropagation(); startEdit(i); }}
                  >
                    {name}
                  </span>
                )}
                {tasks.length > 1 && (
                  <button
                    className="opacity-0 group-hover:opacity-100"
                    onClick={(e) => { e.stopPropagation(); deleteTask(i); }}
                    style={{ color: C.grey3, fontSize: 18, lineHeight: 1, cursor: 'pointer', padding: '2px 6px', background: 'none', border: 'none', transition: 'opacity 0.1s' }}
                  >
                    ×
                  </button>
                )}
              </div>
              {/* Status tag — click to cycle */}
              <div
                onClick={(e) => { e.stopPropagation(); cycleStatus(i); }}
                style={{
                  padding: '4px 10px',
                  background: colours.bg,
                  color: colours.color,
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: 'pointer',
                  flexShrink: 0,
                  marginLeft: 16,
                  userSelect: 'none',
                }}
                title="Click to cycle status"
              >
                {status}
              </div>
            </li>
          );
        })}
      </ol>
      <div
        className="flex items-center cursor-pointer"
        style={{ gap: 8, padding: '12px 0 0' }}
        onClick={(e) => { e.stopPropagation(); addTask(); }}
      >
        <span style={{ fontSize: 16, color: C.grey2 }}>+ add task</span>
      </div>
    </div>
  );
}

// ─── Tabs ─────────────────────────────────────────────────────────────────────
function WireTabs({ block, onUpdateLabel: _onUpdateLabel, onUpdateOptions }: {
  block: Block;
  onUpdateLabel: (l: string) => void;
  onUpdateOptions?: (options: string[]) => void;
}) {
  const tabs = block.options ?? ['Tab 1', 'Tab 2', 'Tab 3'];
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');

  const startEdit = (i: number) => { setEditingIdx(i); setEditValue(tabs[i]); };
  const commitEdit = () => {
    if (editingIdx === null) return;
    const trimmed = editValue.trim();
    if (trimmed) {
      const updated = [...tabs];
      updated[editingIdx] = trimmed;
      onUpdateOptions?.(updated);
    }
    setEditingIdx(null);
  };
  const addTab = () => {
    const updated = [...tabs, `Tab ${tabs.length + 1}`];
    onUpdateOptions?.(updated);
    setEditingIdx(updated.length - 1);
    setEditValue(updated[updated.length - 1]);
  };
  const deleteTab = (i: number) => {
    if (tabs.length <= 1) return;
    onUpdateOptions?.(tabs.filter((_, idx) => idx !== i));
  };

  return (
    <div style={{ padding: '12px 20px 0' }}>
      {/* Tab bar */}
      <div className="flex" style={{ borderBottom: `1px solid ${C.greyLine}` }}>
        {tabs.map((tab, i) => (
          <div
            key={i}
            className="group relative flex items-center"
            style={{
              padding: '12px 20px',
              fontSize: 19,
              color: i === 0 ? C.black : C.linkBlue,
              fontWeight: i === 0 ? 700 : 400,
              textDecoration: i === 0 ? 'none' : 'underline',
              background: i === 0 ? C.white : C.grey1,
              border: `1px solid ${C.greyLine}`,
              borderBottom: i === 0 ? `1px solid ${C.white}` : `1px solid ${C.greyLine}`,
              marginBottom: i === 0 ? -1 : 0,
              cursor: 'default',
              gap: 6,
            }}
          >
            {editingIdx === i ? (
              <input
                autoFocus
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={commitEdit}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') { e.preventDefault(); commitEdit(); }
                  if (e.key === 'Escape') setEditingIdx(null);
                }}
                onClick={(e) => e.stopPropagation()}
                style={{ fontSize: 19, color: C.black, border: 'none', outline: `2px solid ${C.blue}`, padding: '2px 4px', background: 'transparent', width: 80 }}
              />
            ) : (
              <span onDoubleClick={(e) => { e.stopPropagation(); startEdit(i); }}>{tab}</span>
            )}
            {tabs.length > 1 && (
              <button
                className="opacity-0 group-hover:opacity-100"
                onClick={(e) => { e.stopPropagation(); deleteTab(i); }}
                style={{ color: C.grey3, fontSize: 14, lineHeight: 1, cursor: 'pointer', padding: '1px 4px', background: 'none', border: 'none', transition: 'opacity 0.1s' }}
              >
                ×
              </button>
            )}
          </div>
        ))}
        {/* Add tab */}
        <div
          className="flex items-center cursor-pointer"
          style={{ padding: '12px 16px', fontSize: 16, color: C.grey2, border: `1px solid transparent` }}
          onClick={(e) => { e.stopPropagation(); addTab(); }}
        >
          + tab
        </div>
      </div>
      {/* Tab content */}
      <div style={{ padding: '20px 0 20px' }}>
        <TextLines widths={[95, 88, 70, 50]} />
      </div>
    </div>
  );
}

// ─── Accordion ────────────────────────────────────────────────────────────────
function WireAccordion({ block, onUpdateLabel: _onUpdateLabel, onUpdateOptions }: {
  block: Block;
  onUpdateLabel: (l: string) => void;
  onUpdateOptions?: (options: string[]) => void;
}) {
  const sections = block.options ?? ['Section 1', 'Section 2', 'Section 3'];
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');

  const startEdit = (i: number) => { setEditingIdx(i); setEditValue(sections[i]); };
  const commitEdit = () => {
    if (editingIdx === null) return;
    const trimmed = editValue.trim();
    if (trimmed) {
      const updated = [...sections];
      updated[editingIdx] = trimmed;
      onUpdateOptions?.(updated);
    }
    setEditingIdx(null);
  };
  const addSection = () => {
    const updated = [...sections, `Section ${sections.length + 1}`];
    onUpdateOptions?.(updated);
    setEditingIdx(updated.length - 1);
    setEditValue(updated[updated.length - 1]);
  };
  const deleteSection = (i: number) => {
    if (sections.length <= 1) return;
    onUpdateOptions?.(sections.filter((_, idx) => idx !== i));
  };

  return (
    <div style={{ padding: '12px 20px' }}>
      <div
        style={{
          borderTop: `1px solid ${C.greyLine}`,
        }}
      >
        {sections.map((section, i) => (
          <div
            key={i}
            className="group"
            style={{ borderBottom: `1px solid ${C.greyLine}` }}
          >
            {/* Section header row */}
            <div
              className="flex items-center justify-between"
              style={{ padding: '15px 0', cursor: 'default' }}
            >
              <div className="flex items-center" style={{ gap: 8, flex: 1 }}>
                {editingIdx === i ? (
                  <input
                    autoFocus
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={commitEdit}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') { e.preventDefault(); commitEdit(); }
                      if (e.key === 'Escape') setEditingIdx(null);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    style={{ fontSize: 19, color: C.black, border: 'none', outline: `2px solid ${C.blue}`, padding: '2px 4px', background: 'transparent', flex: 1 }}
                  />
                ) : (
                  <span
                    className="font-bold"
                    style={{ fontSize: 19, color: C.linkBlue, textDecoration: 'underline', flex: 1 }}
                    onDoubleClick={(e) => { e.stopPropagation(); startEdit(i); }}
                  >
                    {section}
                  </span>
                )}
                {sections.length > 1 && (
                  <button
                    className="opacity-0 group-hover:opacity-100"
                    onClick={(e) => { e.stopPropagation(); deleteSection(i); }}
                    style={{ color: C.grey3, fontSize: 18, lineHeight: 1, cursor: 'pointer', padding: '2px 6px', background: 'none', border: 'none', transition: 'opacity 0.1s' }}
                  >
                    ×
                  </button>
                )}
              </div>
              {/* Chevron — first section open, rest closed */}
              <span style={{ fontSize: 14, color: C.black, marginLeft: 12 }}>
                {i === 0 ? '▲' : '▼'}
              </span>
            </div>
            {/* First section expanded */}
            {i === 0 && (
              <div style={{ paddingBottom: 15 }}>
                <TextLines widths={[95, 88, 75]} />
              </div>
            )}
          </div>
        ))}
        {/* Add section */}
        <div
          className="flex items-center cursor-pointer"
          style={{ gap: 8, padding: '12px 0' }}
          onClick={(e) => { e.stopPropagation(); addSection(); }}
        >
          <span style={{ fontSize: 16, color: C.grey2 }}>+ add section</span>
        </div>
      </div>
    </div>
  );
}

// ─── File Upload ──────────────────────────────────────────────────────────────
function WireFileUpload({ block, onUpdateLabel }: { block: Block; onUpdateLabel: (l: string) => void }) {
  return (
    <div style={{ padding: '12px 20px' }}>
      <EditableText
        value={block.label}
        onCommit={onUpdateLabel}
        className="font-bold block"
        style={{ fontSize: 19, color: C.black, marginBottom: 4 }}
      />
      <div style={{ fontSize: 16, color: C.grey3, marginBottom: 10 }}>
        PDF, JPG or PNG
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div
          style={{
            padding: '8px 14px',
            border: `2px solid ${C.black}`,
            background: C.grey1,
            fontSize: 16,
            color: C.black,
            fontWeight: 700,
            cursor: 'default',
          }}
        >
          Choose file
        </div>
        <span style={{ fontSize: 16, color: C.grey3 }}>No file chosen</span>
      </div>
    </div>
  );
}

// ─── Pagination ───────────────────────────────────────────────────────────────
function WirePagination({ block: _block }: { block: Block; onUpdateLabel: (l: string) => void }) {
  return (
    <div style={{ padding: '20px 20px', borderTop: `1px solid ${C.greyLine}` }}>
      <div className="flex items-center justify-between">
        {/* Previous */}
        <div>
          <div style={{ fontSize: 14, color: C.grey3, marginBottom: 2 }}>Previous</div>
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width="10" height="17" viewBox="0 0 10 17" fill="none" aria-hidden="true">
              <path d="M9 1L1 8.5L9 16" stroke={C.linkBlue} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span style={{ color: C.linkBlue, textDecoration: 'underline', fontSize: 19 }}>Previous page</span>
          </span>
        </div>
        {/* Page numbers */}
        <div className="flex items-center" style={{ gap: 4 }}>
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              style={{
                width: 36,
                height: 36,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 19,
                fontWeight: n === 1 ? 700 : 400,
                color: n === 1 ? C.white : C.linkBlue,
                background: n === 1 ? C.black : 'transparent',
                textDecoration: n === 1 ? 'none' : 'underline',
              }}
            >
              {n}
            </div>
          ))}
          <span style={{ fontSize: 19, color: C.black, padding: '0 4px' }}>…</span>
          {[10].map((n) => (
            <div
              key={n}
              style={{
                width: 36, height: 36,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 19, color: C.linkBlue, textDecoration: 'underline',
              }}
            >
              {n}
            </div>
          ))}
        </div>
        {/* Next */}
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 14, color: C.grey3, marginBottom: 2 }}>Next</div>
          <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: C.linkBlue, textDecoration: 'underline', fontSize: 19 }}>Next page</span>
            <svg width="10" height="17" viewBox="0 0 10 17" fill="none" aria-hidden="true">
              <path d="M1 1L9 8.5L1 16" stroke={C.linkBlue} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Tag ──────────────────────────────────────────────────────────────────────
function WireTag({ block, onUpdateLabel }: { block: Block; onUpdateLabel: (l: string) => void }) {
  return (
    <div style={{ padding: '8px 20px' }}>
      <div
        className="inline-block font-bold"
        style={{
          padding: '2px 8px',
          background: C.grey1,
          color: C.black,
          fontSize: 14,
          letterSpacing: '0.02em',
        }}
      >
        <EditableText value={block.label} onCommit={onUpdateLabel} style={{ color: C.black }} />
      </div>
    </div>
  );
}

// ─── Table ────────────────────────────────────────────────────────────────────
function WireTable({ block, onUpdateLabel }: { block: Block; onUpdateLabel: (l: string) => void }) {
  const cols = [55, 25, 20];
  const rows = 4;
  return (
    <div style={{ padding: '12px 20px' }}>
      {block.label && (
        <EditableText
          value={block.label}
          onCommit={onUpdateLabel}
          className="block"
          style={{ fontSize: 16, color: C.grey3, marginBottom: 8 }}
        />
      )}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: `3px solid ${C.black}` }}>
            {cols.map((w, i) => (
              <th
                key={i}
                style={{
                  padding: '10px 10px 10px 0',
                  textAlign: 'left',
                  width: `${w}%`,
                }}
              >
                <div style={{ height: 10, width: '70%', borderRadius: 4, background: C.black, opacity: 0.75 }} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, r) => (
            <tr key={r} style={{ borderBottom: `1px solid ${C.greyLine}` }}>
              {cols.map((w, i) => (
                <td key={i} style={{ padding: '10px 10px 10px 0', width: `${w}%` }}>
                  <div
                    style={{
                      height: 8,
                      width: i === 0 ? '80%' : '60%',
                      borderRadius: 4,
                      background: C.grey2,
                    }}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Select ───────────────────────────────────────────────────────────────────
function WireSelect({ block, onUpdateLabel }: { block: Block; onUpdateLabel: (l: string) => void }) {
  return (
    <div style={{ padding: '12px 20px' }}>
      <EditableText
        value={block.label}
        onCommit={onUpdateLabel}
        className="font-bold block"
        style={{ fontSize: 19, color: C.black, marginBottom: 4 }}
      />
      <div className="text-sm" style={{ color: C.grey3, marginBottom: 6, fontSize: 16 }}>
        Select {block.label.toLowerCase()}
      </div>
      <div
        className="relative"
        style={{ maxWidth: 320 }}
      >
        <div
          style={{
            width: '100%',
            height: 40,
            border: `2px solid ${C.black}`,
            background: C.white,
            display: 'flex',
            alignItems: 'center',
            paddingLeft: 8,
            paddingRight: 36,
          }}
        >
          <div style={{ width: '60%', height: 8, borderRadius: 4, background: C.grey2 }} />
        </div>
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            bottom: 0,
            width: 36,
            borderLeft: `2px solid ${C.black}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
          }}
        >
          <span style={{ fontSize: 12, color: C.black }}>▾</span>
        </div>
      </div>
    </div>
  );
}

// ─── Textarea ─────────────────────────────────────────────────────────────────
function WireTextarea({ block, onUpdateLabel }: { block: Block; onUpdateLabel: (l: string) => void }) {
  return (
    <div style={{ padding: '12px 20px' }}>
      <EditableText
        value={block.label}
        onCommit={onUpdateLabel}
        className="font-bold block"
        style={{ fontSize: 19, color: C.black, marginBottom: 4 }}
      />
      <div className="text-sm" style={{ color: C.grey3, marginBottom: 6, fontSize: 16 }}>
        Describe in detail
      </div>
      <div
        style={{
          width: '100%',
          height: 100,
          border: `2px solid ${C.black}`,
          background: C.white,
          maxWidth: 480,
        }}
      />
    </div>
  );
}

// ─── Radios ───────────────────────────────────────────────────────────────────
function WireRadios({ block, onUpdateLabel, onUpdateOptions }: {
  block: Block;
  onUpdateLabel: (l: string) => void;
  onUpdateOptions?: (options: string[]) => void;
}) {
  const options = block.options ?? ['England', 'Scotland', 'Wales'];
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');

  const startEdit = (i: number) => { setEditingIdx(i); setEditValue(options[i]); };

  const commitEdit = () => {
    if (editingIdx === null) return;
    const trimmed = editValue.trim();
    if (trimmed) {
      const updated = [...options];
      updated[editingIdx] = trimmed;
      onUpdateOptions?.(updated);
    }
    setEditingIdx(null);
  };

  const deleteOption = (i: number) => {
    if (options.length <= 1) return;
    onUpdateOptions?.(options.filter((_, idx) => idx !== i));
  };

  const addOption = () => {
    const newLabel = `Option ${options.length + 1}`;
    const updated = [...options, newLabel];
    onUpdateOptions?.(updated);
    setEditingIdx(updated.length - 1);
    setEditValue(newLabel);
  };

  return (
    <div style={{ padding: '12px 20px' }}>
      <EditableText
        value={block.label}
        onCommit={onUpdateLabel}
        className="font-bold block"
        style={{ fontSize: 24, color: C.black, marginBottom: 12 }}
      />
      <div className="flex flex-col" style={{ gap: 8 }}>
        {options.map((opt, i) => (
          <div key={i} className="group flex items-center" style={{ gap: 12 }}>
            <div style={{ width: 38, height: 38, border: `2px solid ${C.black}`, borderRadius: '50%', flexShrink: 0 }} />
            {editingIdx === i ? (
              <input
                autoFocus
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={commitEdit}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') { e.preventDefault(); commitEdit(); }
                  if (e.key === 'Escape') setEditingIdx(null);
                }}
                onClick={(e) => e.stopPropagation()}
                style={{ flex: 1, fontSize: 19, color: C.black, border: 'none', outline: `2px solid ${C.blue}`, padding: '2px 4px', background: 'transparent' }}
              />
            ) : (
              <span
                style={{ fontSize: 19, color: C.black, flex: 1 }}
                onDoubleClick={(e) => { e.stopPropagation(); startEdit(i); }}
              >
                {opt}
              </span>
            )}
            {options.length > 1 && (
              <button
                className="opacity-0 group-hover:opacity-100"
                onClick={(e) => { e.stopPropagation(); deleteOption(i); }}
                style={{ color: C.grey3, fontSize: 18, lineHeight: 1, cursor: 'pointer', padding: '2px 6px', transition: 'opacity 0.1s', background: 'none', border: 'none' }}
              >
                ×
              </button>
            )}
          </div>
        ))}
        {/* Add option */}
        <div
          className="flex items-center cursor-pointer"
          style={{ gap: 12, marginTop: 4 }}
          onClick={(e) => { e.stopPropagation(); addOption(); }}
        >
          <div style={{ width: 38, height: 38, border: `2px dashed ${C.grey2}`, borderRadius: '50%', flexShrink: 0 }} />
          <span style={{ fontSize: 16, color: C.grey2 }}>or add another</span>
        </div>
      </div>
    </div>
  );
}

// ─── Checkboxes ───────────────────────────────────────────────────────────────
function WireCheckboxes({ block, onUpdateLabel }: { block: Block; onUpdateLabel: (l: string) => void }) {
  const options = ['Option 1', 'Option 2', 'Option 3'];
  return (
    <div style={{ padding: '12px 20px' }}>
      <EditableText
        value={block.label}
        onCommit={onUpdateLabel}
        className="font-bold block"
        style={{ fontSize: 24, color: C.black, marginBottom: 12 }}
      />
      <div className="flex flex-col" style={{ gap: 8 }}>
        {options.map((opt, i) => (
          <div key={i} className="flex items-center" style={{ gap: 12 }}>
            <div
              style={{
                width: 38,
                height: 38,
                border: `2px solid ${C.black}`,
                flexShrink: 0,
              }}
            />
            <span style={{ fontSize: 19, color: C.black }}>{opt}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Date Input ───────────────────────────────────────────────────────────────
function WireDateInput({ block, onUpdateLabel }: { block: Block; onUpdateLabel: (l: string) => void }) {
  const parts = [
    { label: 'Day',   width: 64 },
    { label: 'Month', width: 64 },
    { label: 'Year',  width: 80 },
  ];
  return (
    <div style={{ padding: '12px 20px' }}>
      <EditableText
        value={block.label}
        onCommit={onUpdateLabel}
        className="font-bold block"
        style={{ fontSize: 19, color: C.black, marginBottom: 4 }}
      />
      <div className="text-sm" style={{ color: C.grey3, marginBottom: 8, fontSize: 16 }}>
        For example, 31 3 1980
      </div>
      <div className="flex" style={{ gap: 16 }}>
        {parts.map(({ label, width }) => (
          <div key={label} className="flex flex-col" style={{ gap: 4 }}>
            <span style={{ fontSize: 16, color: C.black }}>{label}</span>
            <div
              style={{
                width,
                height: 40,
                border: `2px solid ${C.black}`,
                background: C.white,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Error Summary ────────────────────────────────────────────────────────────
function WireErrorSummary({ block, onUpdateLabel }: { block: Block; onUpdateLabel: (l: string) => void }) {
  return (
    <div
      style={{
        margin: '12px 20px',
        padding: '20px 20px',
        border: `4px solid ${C.red}`,
      }}
    >
      <EditableText
        value={block.label}
        onCommit={onUpdateLabel}
        className="font-bold block"
        style={{ fontSize: 22, color: C.black, marginBottom: 12 }}
      />
      <ul style={{ paddingLeft: 20 }}>
        {['Enter your full name', 'Enter a valid date of birth'].map((err, i) => (
          <li key={i} style={{ fontSize: 19 }}>
            <span style={{ color: C.red, textDecoration: 'underline' }}>{err}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── Summary List ─────────────────────────────────────────────────────────────
function WireSummaryList({ block, onUpdateLabel }: { block: Block; onUpdateLabel: (l: string) => void }) {
  const rows = [
    { key: 'Name',         value: 'Sarah Philips' },
    { key: 'Date of birth', value: '5 January 1978' },
    { key: 'Address',      value: '72 Guild Street, London' },
  ];
  return (
    <div style={{ padding: '12px 20px' }}>
      {block.label && (
        <div className="font-bold" style={{ fontSize: 19, color: C.black, marginBottom: 8 }}>
          <EditableText value={block.label} onCommit={onUpdateLabel} style={{ color: C.black }} />
        </div>
      )}
      <dl>
        {rows.map(({ key, value }, i) => (
          <div
            key={i}
            className="flex items-start"
            style={{
              borderBottom: `1px solid ${C.greyLine}`,
              padding: '10px 0',
              gap: 20,
            }}
          >
            <dt className="font-bold" style={{ fontSize: 19, color: C.black, minWidth: 160 }}>{key}</dt>
            <dd style={{ fontSize: 19, color: C.black, flex: 1 }}>{value}</dd>
            <dd><span style={{ color: C.linkBlue, textDecoration: 'underline', fontSize: 19 }}>Change</span></dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

// ─── Notification Banner ──────────────────────────────────────────────────────
function WireNotificationBanner({ block, onUpdateLabel }: { block: Block; onUpdateLabel: (l: string) => void }) {
  return (
    <div
      style={{
        margin: '12px 20px',
        padding: '16px 20px',
        border: `5px solid ${C.blue}`,
        background: C.white,
      }}
    >
      <p className="font-bold" style={{ fontSize: 19, color: C.black, marginBottom: 4 }}>
        <EditableText value={block.label} onCommit={onUpdateLabel} style={{ color: C.black }} />
      </p>
      <TextLines widths={[90, 75]} />
    </div>
  );
}

// ─── Panel ────────────────────────────────────────────────────────────────────
function WirePanel({ block, onUpdateLabel }: { block: Block; onUpdateLabel: (l: string) => void }) {
  return (
    <div
      style={{
        margin: '12px 20px',
        padding: '28px 24px',
        background: C.green,
      }}
    >
      <EditableText
        value={block.label}
        onCommit={onUpdateLabel}
        className="font-bold block"
        style={{ fontSize: 32, lineHeight: '35px', color: C.white, marginBottom: 12 }}
      />
      <TextLines widths={[60, 45]} />
    </div>
  );
}

// ─── Service Navigation ───────────────────────────────────────────────────────
function WireServiceNav({ block, onUpdateLabel, onUpdateOptions }: {
  block: Block;
  onUpdateLabel: (l: string) => void;
  onUpdateOptions?: (options: string[]) => void;
}) {
  const navItems = block.options ?? [];
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');

  const startEdit = (i: number) => { setEditingIdx(i); setEditValue(navItems[i]); };
  const commitEdit = () => {
    if (editingIdx === null) return;
    const trimmed = editValue.trim();
    if (trimmed) {
      const updated = [...navItems];
      updated[editingIdx] = trimmed;
      onUpdateOptions?.(updated);
    }
    setEditingIdx(null);
  };
  const addItem = () => {
    const updated = [...navItems, `Nav item ${navItems.length + 1}`];
    onUpdateOptions?.(updated);
    setEditingIdx(updated.length - 1);
    setEditValue(updated[updated.length - 1]);
  };
  const deleteItem = (i: number) => {
    onUpdateOptions?.(navItems.filter((_, idx) => idx !== i));
  };

  return (
    <div
      style={{
        background: C.white,
        borderBottom: `1px solid ${C.greyLine}`,
        padding: '0 20px',
        display: 'flex',
        alignItems: 'stretch',
        minHeight: 50,
      }}
    >
      {/* Service name */}
      <div
        className="font-bold flex items-center"
        style={{ fontSize: 18, color: C.black, marginRight: 28, flexShrink: 0 }}
      >
        <EditableText value={block.label} onCommit={onUpdateLabel} style={{ color: C.black }} />
      </div>
      {/* Nav items */}
      <div className="flex items-stretch" style={{ gap: 0 }}>
        {navItems.map((item, i) => (
          <div
            key={i}
            className="group flex items-center"
            style={{
              fontSize: 16,
              padding: '0 14px',
              color: i === 0 ? C.black : C.grey3,
              borderBottom: i === 0 ? `4px solid ${C.blue}` : '4px solid transparent',
              fontWeight: i === 0 ? 700 : 400,
              gap: 6,
            }}
          >
            {editingIdx === i ? (
              <input
                autoFocus
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={commitEdit}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') { e.preventDefault(); commitEdit(); }
                  if (e.key === 'Escape') setEditingIdx(null);
                }}
                onClick={(e) => e.stopPropagation()}
                style={{ fontSize: 16, color: C.black, border: 'none', outline: `2px solid ${C.blue}`, padding: '2px 4px', background: 'transparent', width: 80 }}
              />
            ) : (
              <span onDoubleClick={(e) => { e.stopPropagation(); startEdit(i); }}>{item}</span>
            )}
            <button
              className="opacity-0 group-hover:opacity-100"
              onClick={(e) => { e.stopPropagation(); deleteItem(i); }}
              style={{ color: C.grey3, fontSize: 14, lineHeight: 1, cursor: 'pointer', padding: '1px 4px', background: 'none', border: 'none', transition: 'opacity 0.1s' }}
            >
              ×
            </button>
          </div>
        ))}
        {/* Add nav item */}
        <div
          className="flex items-center cursor-pointer"
          style={{ padding: '0 14px', fontSize: 14, color: C.grey2 }}
          onClick={(e) => { e.stopPropagation(); addItem(); }}
        >
          + add nav item
        </div>
      </div>
    </div>
  );
}

// ─── GOV.UK Footer ────────────────────────────────────────────────────────────
function WireGdsFooter({ block: _block }: { block: Block; onUpdateLabel: (l: string) => void }) {
  return (
    <div
      style={{
        borderTop: `10px solid ${C.blue}`,
        padding: '28px 20px',
        background: C.grey1,
        marginTop: 'auto',
      }}
    >
      {/* Crown logo + copyright (v6 refresh: crown added to footer) */}
      <div className="flex items-center" style={{ gap: 8, marginBottom: 16 }}>
        <div style={{ width: 28, height: 30, background: C.black, borderRadius: 2, flexShrink: 0, opacity: 0.7 }} />
        <div>
          <div style={{ fontSize: 14, color: C.black, fontWeight: 'bold' }}>© Crown copyright</div>
          <div style={{ fontSize: 12, color: C.grey3 }}>Open Government Licence v3.0</div>
        </div>
      </div>
      {/* Support links */}
      <div className="flex" style={{ gap: 20, flexWrap: 'wrap' }}>
        {['Help', 'Privacy', 'Cookies', 'Accessibility', 'Contact'].map((link) => (
          <span key={link} style={{ color: C.linkBlue, textDecoration: 'underline', fontSize: 14 }}>
            {link}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────
export default function WireBlock({ block, isSelected, onSelect, onUpdateLabel, onUpdateOptions }: Props) {
  const renderBlock = () => {
    switch (block.type) {
      case 'gds-header':          return <WireGdsHeader block={block} onUpdateLabel={onUpdateLabel} />;
      case 'phase-banner':        return <WirePhaseBanner block={block} onUpdateLabel={onUpdateLabel} />;
      case 'back-link':           return <WireBackLink block={block} onUpdateLabel={onUpdateLabel} />;
      case 'breadcrumbs':         return <WireBreadcrumbs block={block} onUpdateLabel={onUpdateLabel} />;
      case 'h1':                  return <WireH1 block={block} onUpdateLabel={onUpdateLabel} />;
      case 'h2':                  return <WireH2 block={block} onUpdateLabel={onUpdateLabel} />;
      case 'h3':                  return <WireH3 block={block} onUpdateLabel={onUpdateLabel} />;
      case 'body-text':           return <WireBodyText block={block} onUpdateLabel={onUpdateLabel} />;
      case 'inset-text':          return <WireInsetText block={block} onUpdateLabel={onUpdateLabel} />;
      case 'warning-text':        return <WireWarningText block={block} onUpdateLabel={onUpdateLabel} />;
      case 'button':              return <WireButton block={block} onUpdateLabel={onUpdateLabel} />;
      case 'button-secondary':    return <WireButtonSecondary block={block} onUpdateLabel={onUpdateLabel} />;
      case 'button-warning':      return <WireButtonWarning block={block} onUpdateLabel={onUpdateLabel} />;
      case 'task-list':           return <WireTaskList block={block} onUpdateLabel={onUpdateLabel} onUpdateOptions={onUpdateOptions} />;
      case 'tabs':                return <WireTabs block={block} onUpdateLabel={onUpdateLabel} onUpdateOptions={onUpdateOptions} />;
      case 'accordion':           return <WireAccordion block={block} onUpdateLabel={onUpdateLabel} onUpdateOptions={onUpdateOptions} />;
      case 'file-upload':         return <WireFileUpload block={block} onUpdateLabel={onUpdateLabel} />;
      case 'pagination':          return <WirePagination block={block} onUpdateLabel={onUpdateLabel} />;
      case 'tag':                 return <WireTag block={block} onUpdateLabel={onUpdateLabel} />;
      case 'table':               return <WireTable block={block} onUpdateLabel={onUpdateLabel} />;
      case 'select':              return <WireSelect block={block} onUpdateLabel={onUpdateLabel} />;
      case 'text-input':          return <WireTextInput block={block} onUpdateLabel={onUpdateLabel} />;
      case 'textarea':            return <WireTextarea block={block} onUpdateLabel={onUpdateLabel} />;
      case 'radios':              return <WireRadios block={block} onUpdateLabel={onUpdateLabel} onUpdateOptions={onUpdateOptions} />;
      case 'checkboxes':          return <WireCheckboxes block={block} onUpdateLabel={onUpdateLabel} />;
      case 'date-input':          return <WireDateInput block={block} onUpdateLabel={onUpdateLabel} />;
      case 'error-summary':       return <WireErrorSummary block={block} onUpdateLabel={onUpdateLabel} />;
      case 'summary-list':        return <WireSummaryList block={block} onUpdateLabel={onUpdateLabel} />;
      case 'notification-banner': return <WireNotificationBanner block={block} onUpdateLabel={onUpdateLabel} />;
      case 'panel':               return <WirePanel block={block} onUpdateLabel={onUpdateLabel} />;
      case 'service-nav':         return <WireServiceNav block={block} onUpdateLabel={onUpdateLabel} onUpdateOptions={onUpdateOptions} />;
      case 'gds-footer':          return <WireGdsFooter block={block} onUpdateLabel={onUpdateLabel} />;
      default:                    return null;
    }
  };

  return (
    <div
      onClick={(e) => { e.stopPropagation(); onSelect(); }}
      className="relative cursor-pointer"
      style={{
        outline: isSelected ? `2px solid ${C.blue}` : '2px solid transparent',
        outlineOffset: -1,
        background: isSelected ? 'rgba(29,112,184,0.06)' : 'transparent',
        transition: 'outline var(--duration-select) var(--ease-glass), background var(--duration-select) var(--ease-glass)',
      }}
    >
      {renderBlock()}
    </div>
  );
}
