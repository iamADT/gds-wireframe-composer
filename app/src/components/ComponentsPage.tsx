import { useState } from 'react';
import WireBlock from './WireBlock';
import type { Block, BlockType } from '../types';

const NOOP = () => {};

function mb(type: BlockType, label: string, options?: string[]): Block {
  return { id: `cpg-${type}`, type, label, options };
}

const CARD_H = 180;

interface CompConfig {
  block: Block;
  name: string;
  colSpan: 1 | 2 | 3;
}

const COMPONENTS: CompConfig[] = [
  // ── Full-width strips ────────────────────────────────────────────────────
  { block: mb('gds-header', ''),                                              name: 'GOV.UK Header',       colSpan: 3 },
  { block: mb('service-nav', 'My Service', ['Apply', 'Check status', 'Guidance']), name: 'Service Nav',  colSpan: 2 },
  { block: mb('phase-banner', 'BETA'),                                        name: 'Phase Banner',        colSpan: 1 },

  // ── Typography ───────────────────────────────────────────────────────────
  { block: mb('h1', 'Page heading'),                                          name: 'H1',                  colSpan: 1 },
  { block: mb('h2', 'Section heading'),                                       name: 'H2',                  colSpan: 1 },
  { block: mb('h3', 'Subsection heading'),                                    name: 'H3',                  colSpan: 1 },

  // ── Content blocks ───────────────────────────────────────────────────────
  { block: mb('body-text', 'Body text'),                                      name: 'Body Text',           colSpan: 1 },
  { block: mb('inset-text', 'Important information'),                         name: 'Inset Text',          colSpan: 1 },
  { block: mb('warning-text', 'Warning message here'),                        name: 'Warning Text',        colSpan: 1 },

  // ── Notification + tag ──────────────────────────────────────────────────
  { block: mb('notification-banner', 'Important'),                            name: 'Notification Banner', colSpan: 2 },
  { block: mb('tag', 'Active'),                                               name: 'Tag',                 colSpan: 1 },

  // ── Buttons ─────────────────────────────────────────────────────────────
  { block: mb('button', 'Continue'),                                          name: 'Button',              colSpan: 1 },
  { block: mb('button-secondary', 'Cancel'),                                  name: 'Secondary Button',    colSpan: 1 },
  { block: mb('button-warning', 'Delete account'),                            name: 'Warning Button',      colSpan: 1 },

  // ── Navigation ───────────────────────────────────────────────────────────
  { block: mb('back-link', 'Back'),                                           name: 'Back Link',           colSpan: 1 },
  { block: mb('breadcrumbs', 'Home'),                                         name: 'Breadcrumbs',         colSpan: 1 },
  { block: mb('panel', 'Application complete'),                               name: 'Panel',               colSpan: 1 },

  // ── Forms (row 1) ────────────────────────────────────────────────────────
  { block: mb('text-input', 'Full name'),                                     name: 'Text Input',          colSpan: 1 },
  { block: mb('select', 'Country of birth'),                                  name: 'Select',              colSpan: 1 },
  { block: mb('file-upload', 'Upload a file'),                                name: 'File Upload',         colSpan: 1 },

  // ── Radios + error summary ───────────────────────────────────────────────
  { block: mb('radios', 'Where do you live?', ['England', 'Scotland', 'Wales']), name: 'Radios',          colSpan: 1 },
  { block: mb('error-summary', 'There is a problem'),                         name: 'Error Summary',       colSpan: 2 },

  // ── Forms (row 2) ────────────────────────────────────────────────────────
  { block: mb('date-input', 'Date of birth'),                                 name: 'Date Input',          colSpan: 1 },
  { block: mb('checkboxes', 'Which applies to you?'),                         name: 'Checkboxes',          colSpan: 1 },
  { block: mb('textarea', 'Description'),                                     name: 'Textarea',            colSpan: 1 },

  // ── Data components ───────────────────────────────────────────────────────
  { block: mb('summary-list', 'Summary'),                                     name: 'Summary List',        colSpan: 2 },
  { block: mb('accordion', 'Accordion', ['Section 1', 'Section 2', 'Section 3']), name: 'Accordion',      colSpan: 1 },

  { block: mb('tabs', 'Tabs', ['Tab 1', 'Tab 2', 'Tab 3']),                  name: 'Tabs',                colSpan: 2 },
  { block: mb('task-list', 'Your application', [
      'Check eligibility||NOT STARTED',
      'Prepare documents||NOT STARTED',
      'Submit application||NOT STARTED',
    ]),                                                                         name: 'Task List',           colSpan: 1 },

  { block: mb('table', 'Table caption'),                                      name: 'Table',               colSpan: 2 },

  // ── Footer strips ────────────────────────────────────────────────────────
  { block: mb('pagination', ''),                                              name: 'Pagination',          colSpan: 3 },
  { block: mb('gds-footer', ''),                                              name: 'GOV.UK Footer',       colSpan: 3 },
];

export default function ComponentsPage({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState('');
  const [hoveredType, setHoveredType] = useState<string | null>(null);

  const filtered = query.trim()
    ? COMPONENTS.filter((c) =>
        c.name.toLowerCase().includes(query.trim().toLowerCase())
      )
    : COMPONENTS;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 150,
        background: 'var(--bg-0)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* ── Header bar ── */}
      <header
        style={{
          padding: '12px 24px',
          background: 'var(--bg-0-bar)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          borderBottom: '1px solid var(--border-outer)',
          boxShadow: 'inset 0 -1px 0 0 var(--border-inner)',
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          flexShrink: 0,
        }}
      >
        <button
          onClick={onClose}
          style={{
            background: 'var(--glass-surface-2)',
            border: '1px solid var(--border-outer)',
            boxShadow: 'inset 0 0 0 1px var(--border-inner)',
            borderRadius: 6,
            color: 'var(--text-secondary)',
            fontSize: 12,
            cursor: 'pointer',
            padding: '4px 10px',
            lineHeight: 1,
          }}
        >
          ← Back
        </button>

        <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>
          Components
        </span>

        <span
          style={{
            fontSize: 11,
            color: 'var(--text-tertiary)',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 999,
            padding: '2px 8px',
            lineHeight: 1.4,
          }}
        >
          {filtered.length}
        </span>
      </header>

      {/* ── Scrollable content ── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '40px 48px 80px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>

          {/* ── Search bar ── */}
          <div style={{ position: 'relative', marginBottom: 36 }}>
            <span
              style={{
                position: 'absolute',
                left: 13,
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-tertiary)',
                fontSize: 15,
                lineHeight: 1,
                pointerEvents: 'none',
              }}
            >
              ⌕
            </span>
            <input
              type="text"
              placeholder="Search components…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{
                width: '100%',
                background: 'var(--glass-surface-2)',
                backdropFilter: 'blur(6px)',
                WebkitBackdropFilter: 'blur(6px)',
                border: '1px solid var(--border-outer)',
                boxShadow:
                  'inset 0 0 0 1px var(--border-inner), inset 0 1px 0 0 rgba(140,170,255,0.08)',
                borderRadius: 10,
                color: 'var(--text-primary)',
                fontSize: 13,
                padding: '10px 36px 10px 36px',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                style={{
                  position: 'absolute',
                  right: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-tertiary)',
                  fontSize: 14,
                  cursor: 'pointer',
                  lineHeight: 1,
                  padding: 2,
                }}
              >
                ✕
              </button>
            )}
          </div>

          {/* ── Bento grid ── */}
          {filtered.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                color: 'var(--text-tertiary)',
                fontSize: 13,
                paddingTop: 80,
              }}
            >
              No components match "{query}"
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gridAutoFlow: 'dense',
                gap: 12,
              }}
            >
              {filtered.map((item) => (
                <div
                  key={item.block.type}
                  onMouseEnter={() => setHoveredType(item.block.type)}
                  onMouseLeave={() => setHoveredType(null)}
                  style={{
                    gridColumn: `span ${item.colSpan}`,
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: 'default',
                  }}
                >
                  {/* Outer border frame */}
                  <div
                    style={{
                      borderRadius: 12,
                      border: '1px solid var(--border-outer)',
                      boxShadow: hoveredType === item.block.type
                        ? 'inset 0 0 0 1px var(--border-inner), inset 0 1px 0 0 rgba(140,170,255,0.12), 0 16px 48px rgba(0,0,0,0.5), 0 4px 12px rgba(0,0,0,0.35)'
                        : 'inset 0 0 0 1px var(--border-inner), inset 0 1px 0 0 rgba(140,170,255,0.08), 0 1px 2px rgba(0,0,0,0.25), 0 4px 16px rgba(0,0,0,0.2)',
                      height: CARD_H,
                      flexShrink: 0,
                      padding: 8,
                      pointerEvents: 'none',
                      userSelect: 'none',
                      transition: 'transform 140ms ease-out, box-shadow 140ms ease-out',
                      transform: hoveredType === item.block.type
                        ? 'translateY(-3px) scale(1.012)'
                        : 'translateY(0) scale(1)',
                    }}
                  >
                    {/* Inner white content box */}
                    <div
                      style={{
                        background: '#ffffff',
                        borderRadius: 6,
                        overflow: 'hidden',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      {/* Name — top left */}
                      <div
                        style={{
                          padding: '8px 10px 3px',
                          fontSize: 10,
                          fontWeight: 600,
                          letterSpacing: '0.03em',
                          color: 'rgba(0,0,0,0.35)',
                          flexShrink: 0,
                          lineHeight: 1,
                        }}
                      >
                        {item.name}
                      </div>

                      {/* Component preview */}
                      <div style={{ flex: 1, overflow: 'hidden' }}>
                        <WireBlock
                          block={item.block}
                          isSelected={false}
                          onSelect={NOOP}
                          onUpdateLabel={NOOP}
                          onUpdateOptions={NOOP}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
