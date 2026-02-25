import { useState, useRef, useEffect, useCallback } from 'react';
import { BLOCK_TYPES, PLACEHOLDER_SUGGESTIONS } from '../types';
import type { Block, BlockType, BlockTypeInfo, CustomLayout, CustomTemplate, ContainerType } from '../types';
import { getApiKey, generateBlockLayout } from '../lib/generateBlock';
import ApiKeyModal from './ApiKeyModal';

interface Props {
  onAdd: (type: BlockType) => void;
  onAddBlocks: (types: BlockType[]) => void;
  onRemove: (type: BlockType) => void;
  existingBlocks: Block[];
  onDismiss: () => void;
  placeholderIndex: number;
  onAddCustomBlock: (label: string, layout: CustomLayout, prompt: string) => void;
  customTemplates: CustomTemplate[];
  containerType: ContainerType;
}

const TEMPLATE_KEYWORD = 'template';
const TEMPLATE_BLOCKS: BlockType[] = ['gds-header', 'service-nav', 'back-link', 'h1'];

function resolveBlockType(text: string): BlockType | null {
  const q = text.toLowerCase().trim();
  if (!q) return null;
  const exact = BLOCK_TYPES.find((b) => b.type === q);
  if (exact) return exact.type as BlockType;
  const fuzzy = fuzzyMatch(q, BLOCK_TYPES);
  return fuzzy.length > 0 ? fuzzy[0].type as BlockType : null;
}

function parseEmmet(input: string): BlockType[] {
  return input
    .split('>')
    .flatMap((seg) => {
      seg = seg.trim();
      const repeatMatch = seg.match(/^(.+?)\s*\*\s*(\d+)$/);
      const text = repeatMatch ? repeatMatch[1].trim() : seg;
      const count = repeatMatch ? Math.min(parseInt(repeatMatch[2]), 10) : 1;
      const type = resolveBlockType(text);
      if (!type) return [];
      return Array(count).fill(type) as BlockType[];
    });
}

const COMMON_NEXT: Partial<Record<BlockType, BlockType>> = {
  'gds-header':          'phase-banner',
  'phase-banner':        'h1',
  'service-nav':         'h1',
  'back-link':           'h1',
  'breadcrumbs':         'h1',
  'error-summary':       'h1',
  'notification-banner': 'h1',
  'h1':                  'body-text',
  'h2':                  'body-text',
  'h3':                  'body-text',
  'body-text':           'button',
  'inset-text':          'button',
  'warning-text':        'button',
  'text-input':          'button',
  'textarea':            'button',
  'radios':              'button',
  'checkboxes':          'button',
  'select':              'button',
  'date-input':          'button',
  'file-upload':         'button',
  'summary-list':        'button',
  'table':               'button',
  'accordion':           'button',
  'tabs':                'button',
  'task-list':           'gds-footer',
  'panel':               'gds-footer',
  'button':              'gds-footer',
  'button-secondary':    'gds-footer',
  'button-warning':      'gds-footer',
  'pagination':          'gds-footer',
};

type TabCompletion =
  | { mode: 'inline'; replacement: string; ghost: string }
  | { mode: 'emmet-complete'; replacement: string; hint: string }
  | { mode: 'emmet-next'; replacement: string; hint: string };

function computeTabCompletion(value: string): TabCompletion | null {
  if (!value.trim()) return null;

  if (value.includes('>')) {
    const lastSepIdx = value.lastIndexOf('>');
    const afterSep = value.slice(lastSepIdx + 1);
    const afterSepTrimmed = afterSep.trim();

    if (!afterSepTrimmed) {
      const resolvedSoFar = parseEmmet(value.slice(0, lastSepIdx));
      const lastType = resolvedSoFar[resolvedSoFar.length - 1];
      const next = lastType ? (COMMON_NEXT[lastType] ?? null) : null;
      if (next) {
        return { mode: 'emmet-next', replacement: value.trimEnd() + ' ' + next, hint: next };
      }
      return null;
    } else {
      const type = resolveBlockType(afterSepTrimmed);
      if (type && type !== afterSepTrimmed) {
        const prefix = value.slice(0, lastSepIdx + 1);
        const leadingSpace = afterSep.match(/^(\s*)/)?.[1] ?? ' ';
        return {
          mode: 'emmet-complete',
          replacement: prefix + (leadingSpace || ' ') + type,
          hint: type,
        };
      }
      return null;
    }
  } else {
    const q = value.toLowerCase().trim();
    if (!q) return null;
    const matches = fuzzyMatch(q, BLOCK_TYPES);
    if (matches.length > 0 && matches[0].type !== q) {
      const ghost = matches[0].type.slice(q.length);
      if (!ghost) return null;
      return { mode: 'inline', replacement: matches[0].type, ghost };
    }
    // Template keyword ghost (fallback when no block type matches)
    if (q.length >= 2 && TEMPLATE_KEYWORD.startsWith(q) && q !== TEMPLATE_KEYWORD) {
      return { mode: 'inline', replacement: TEMPLATE_KEYWORD, ghost: TEMPLATE_KEYWORD.slice(q.length) };
    }
    return null;
  }
}

const REMOVE_RE = /^remove\s*/i;

const ERROR_MESSAGES: Record<string, string> = {
  'invalid-key': 'Invalid API key — check your key in settings',
  'rate-limit': 'API overloaded — wait a moment and try again',
  'network': "Couldn't connect — check your connection and try again",
  'invalid-json': "Couldn't generate — try a more specific description",
  'empty-layout': 'No layout generated — try a more specific description',
  'no-renderable': 'No renderable layout — try describing specific components',
};

function fuzzyMatch(query: string, items: BlockTypeInfo[]): BlockTypeInfo[] {
  const q = query.toLowerCase().trim();
  if (!q) return items;
  return items.filter(
    (item) =>
      item.type.includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.defaultLabel.toLowerCase().includes(q)
  );
}

function GeneratingDots() {
  return (
    <span>
      Generating
      <span
        style={{
          display: 'inline-block',
          animation: 'pulse-dots 600ms steps(4, end) infinite',
          letterSpacing: 1,
          minWidth: 18,
        }}
      >
        •••
      </span>
      <style>{`
        @keyframes pulse-dots {
          0%   { opacity: 0.2; }
          25%  { opacity: 0.5; }
          50%  { opacity: 0.8; }
          75%  { opacity: 1;   }
          100% { opacity: 0.2; }
        }
      `}</style>
    </span>
  );
}

export default function BlockInput({
  onAdd,
  onAddBlocks,
  onRemove,
  existingBlocks,
  onDismiss,
  placeholderIndex,
  onAddCustomBlock,
  customTemplates,
  containerType,
}: Props) {
  const [value, setValue] = useState('');
  const [highlightIndex, setHighlightIndex] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [pendingDescription, setPendingDescription] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const isEmmetMode = value.includes('>');
  const isRemoveMode = !isEmmetMode && REMOVE_RE.test(value);
  const isTemplateMode = !isEmmetMode && !isRemoveMode && value.trim().toLowerCase() === TEMPLATE_KEYWORD;
  const tabCompletion = !generating ? computeTabCompletion(value) : null;
  const subQuery = isRemoveMode ? value.replace(REMOVE_RE, '') : value;

  const isGenerateMode = !isEmmetMode && /\bgenerate\s*$/i.test(value) && value.trim().replace(/generate\s*$/i, '').trim().length > 0;
  const description = value.trim().replace(/\bgenerate\s*$/i, '').trim();

  const presentTypes = new Set(existingBlocks.map((b) => b.type));
  const removableCandidates = BLOCK_TYPES.filter((b) => presentTypes.has(b.type));

  const suggestions: BlockTypeInfo[] = isRemoveMode
    ? fuzzyMatch(subQuery, removableCandidates)
    : fuzzyMatch(value, BLOCK_TYPES);

  const matchedCustomTemplates = (!isRemoveMode && !generating && value.trim())
    ? customTemplates.filter((t) => t.label.toLowerCase().includes(value.toLowerCase().trim()))
    : [];

  const totalSuggestions = suggestions.length + matchedCustomTemplates.length;

  const showNoMatchHint =
    value.trim().length > 0 &&
    suggestions.length === 0 &&
    matchedCustomTemplates.length === 0 &&
    !isGenerateMode &&
    !isEmmetMode &&
    !isTemplateMode &&
    !generating;

  const placeholder = PLACEHOLDER_SUGGESTIONS[placeholderIndex % PLACEHOLDER_SUGGESTIONS.length];

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    setHighlightIndex(0);
  }, [value]);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  const showError = useCallback((msg: string) => {
    setGenError(msg);
    setGenerating(false);
  }, []);

  const runGeneration = useCallback(async (desc: string, _apiKey: string) => {
    console.log('[runGeneration] called with desc:', desc);
    setGenerating(true);
    setGenError(null);
    const abort = new AbortController();
    abortRef.current = abort;

    try {
      const result = await generateBlockLayout(desc, containerType, existingBlocks, abort.signal);
      onAddCustomBlock(result.label, result.layout, desc);
      console.log('[runGeneration] block added successfully:', result.label);
      setValue('');
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        setValue('');
        return;
      }
      console.error('[runGeneration] error:', err);
      const code = err instanceof Error ? err.message.split(':')[0] : 'network';
      showError(ERROR_MESSAGES[code] ?? ERROR_MESSAGES['network']);
    } finally {
      setGenerating(false);
      abortRef.current = null;
    }
  }, [containerType, existingBlocks, onAddCustomBlock, showError]);

  const handleSubmit = useCallback(() => {
    if (generating) return;

    if (isEmmetMode) {
      const types = parseEmmet(value);
      if (types.length > 0) {
        onAddBlocks(types);
        setValue('');
      }
      return;
    }

    if (isTemplateMode) {
      onAddBlocks(TEMPLATE_BLOCKS);
      setValue('');
      return;
    }

    if (isGenerateMode) {
      const key = getApiKey();
      if (!key) {
        setPendingDescription(description);
        setShowApiKeyModal(true);
      } else {
        runGeneration(description, key);
      }
      return;
    }

    if (isRemoveMode) {
      const q = subQuery.toLowerCase().trim();
      const exact = removableCandidates.find((b) => b.type === q);
      const selected = exact ?? suggestions[highlightIndex] ?? suggestions[0];
      if (selected) {
        onRemove(selected.type);
        setValue('');
      }
      return;
    }

    const q = value.toLowerCase().trim();
    if (!q) return;

    // Check if highlighted item is a custom template
    if (highlightIndex >= suggestions.length && matchedCustomTemplates.length > 0) {
      const tmpl = matchedCustomTemplates[highlightIndex - suggestions.length];
      if (tmpl) {
        onAddCustomBlock(tmpl.label, tmpl.layout, tmpl.prompt);
        setValue('');
        return;
      }
    }

    // Exact match first
    const exact = BLOCK_TYPES.find((b) => b.type === q);
    if (exact) {
      onAdd(exact.type);
      setValue('');
      return;
    }

    // Use highlighted suggestion
    if (suggestions.length > 0) {
      const selected = suggestions[highlightIndex] ?? suggestions[0];
      onAdd(selected.type);
      setValue('');
    }
  }, [
    value, isEmmetMode, isRemoveMode, isTemplateMode, isGenerateMode, description, generating, subQuery,
    removableCandidates, suggestions, matchedCustomTemplates, highlightIndex,
    onAdd, onAddBlocks, onRemove, onAddCustomBlock, runGeneration,
  ]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        if (tabCompletion) {
          setValue(tabCompletion.replacement);
        }
      } else if (e.key === 'Enter') {
        e.preventDefault();
        handleSubmit();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        if (generating) {
          abortRef.current?.abort();
          setGenerating(false);
          setValue('');
        } else if (genError) {
          setGenError(null);
        } else if (value) {
          setValue('');
        } else {
          onDismiss();
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setHighlightIndex((prev) => Math.min(prev + 1, totalSuggestions - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlightIndex((prev) => Math.max(prev - 1, 0));
      }
    },
    [handleSubmit, value, onDismiss, generating, genError, totalSuggestions, tabCompletion]
  );

  const handleKeySaved = useCallback((key: string) => {
    setShowApiKeyModal(false);
    if (pendingDescription) {
      runGeneration(pendingDescription, key);
      setPendingDescription(null);
    }
  }, [pendingDescription, runGeneration]);

  const inputBorder = isGenerateMode
    ? '1px solid var(--tint-blue-strong)'
    : isRemoveMode
      ? '1px solid rgba(255,80,80,0.25)'
      : '1px solid var(--border-outer)';

  const inputBackground = isRemoveMode
    ? 'rgba(255,60,60,0.06)'
    : 'var(--glass-surface-2)';

  const inputBoxShadow = isGenerateMode
    ? 'inset 0 0 0 1px var(--tint-blue-strong), inset 0 1px 0 0 var(--tint-blue)'
    : isRemoveMode
      ? 'inset 0 0 0 1px rgba(255,80,80,0.12)'
      : 'inset 0 0 0 1px var(--border-inner), inset 0 1px 0 0 var(--tint-blue)';

  const showGhost = tabCompletion?.mode === 'inline' && !generating;

  const inputColor = generating
    ? 'var(--text-tertiary)'
    : showGhost
      ? 'transparent'
      : 'var(--text-primary)';

  // What to show in the input field
  const displayValue = generating ? (description || value) : value;

  return (
    <>
      {showApiKeyModal && (
        <ApiKeyModal
          onSave={handleKeySaved}
          onCancel={() => { setShowApiKeyModal(false); setPendingDescription(null); }}
        />
      )}

      <div className="relative">
        <div style={{ position: 'relative' }}>
          <input
            ref={inputRef}
            type="text"
            value={displayValue}
            onChange={(e) => {
              if (generating) return;
              if (genError) setGenError(null);
              setValue(e.target.value);
              setShowSuggestions(true);
            }}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            placeholder={placeholder}
            readOnly={generating}
            className="w-full rounded-xl text-sm outline-none"
            style={{
              padding: '8px 16px',
              paddingRight: isGenerateMode && !generating && !genError ? 48 : 16,
              background: inputBackground,
              border: inputBorder,
              color: inputColor,
              caretColor: 'var(--text-primary)',
              backdropFilter: 'blur(4px)',
              WebkitBackdropFilter: 'blur(4px)',
              boxShadow: inputBoxShadow,
              transition: 'background 0.15s, border-color 0.15s, box-shadow 0.15s',
            }}
          />
          {showGhost && tabCompletion?.mode === 'inline' && (
            <div
              aria-hidden
              style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                padding: '8px 16px',
                fontSize: '0.875rem',
                lineHeight: 'normal',
                fontFamily: 'inherit',
                pointerEvents: 'none',
                overflow: 'hidden',
                whiteSpace: 'pre',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <span style={{ color: 'var(--text-primary)' }}>{value}</span>
              <span style={{ color: 'var(--text-tertiary)', opacity: 0.5 }}>{tabCompletion.ghost}</span>
            </div>
          )}
          {isGenerateMode && !generating && !genError && (
            <span
              style={{
                position: 'absolute',
                right: 10,
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: 9,
                padding: '2px 5px',
                borderRadius: 4,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--tint-blue-strong)',
                color: 'var(--tint-blue-strong)',
                fontWeight: 700,
                letterSpacing: '0.03em',
                pointerEvents: 'none',
              }}
            >
              AI
            </span>
          )}
        </div>

        {/* Emmet hint */}
        {isEmmetMode && (() => {
          const types = parseEmmet(value);
          if (types.length === 0) return null;
          return (
            <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 4, paddingLeft: 2 }}>
              → {types.join(' · ')}
            </div>
          );
        })()}
        {/* Emmet Tab hint */}
        {isEmmetMode && tabCompletion && tabCompletion.mode !== 'inline' && (
          <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 2, paddingLeft: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
            <kbd style={{ fontSize: 9, padding: '1px 5px', borderRadius: 3, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', fontFamily: 'inherit', lineHeight: '16px' }}>Tab</kbd>
            {tabCompletion.mode === 'emmet-next' ? `add ${tabCompletion.hint}` : `→ ${tabCompletion.hint}`}
          </div>
        )}

        {/* Template expansion hint */}
        {isTemplateMode && (
          <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 4, paddingLeft: 2 }}>
            → {TEMPLATE_BLOCKS.join(' · ')}
          </div>
        )}

        {/* No-match hint */}
        {showNoMatchHint && (
          <div style={{ fontSize: 11, color: 'var(--text-tertiary)', fontStyle: 'italic', marginTop: 4, paddingLeft: 2 }}>
            No match — append "generate" to create with AI
          </div>
        )}

        {/* Loading state */}
        {generating && (
          <div style={{ marginTop: 4, paddingLeft: 2 }}>
            <div style={{ fontSize: 11, color: 'var(--text-primary)', fontStyle: 'italic' }}>
              <GeneratingDots />
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 2 }}>
              Esc to cancel
            </div>
          </div>
        )}

        {/* Error banner */}
        {genError && (
          <div
            style={{
              marginTop: 6,
              padding: '7px 10px 7px 12px',
              borderRadius: 8,
              background: 'rgba(220,60,60,0.10)',
              border: '1px solid rgba(220,60,60,0.25)',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <span style={{ fontSize: 11, color: 'rgba(255,110,110,1)', flex: 1 }}>
              {genError}
            </span>
            <button
              onMouseDown={(e) => { e.preventDefault(); setGenError(null); }}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'rgba(255,110,110,0.6)',
                fontSize: 13,
                lineHeight: 1,
                padding: '0 2px',
                flexShrink: 0,
              }}
              title="Dismiss"
            >
              ✕
            </button>
          </div>
        )}

        {/* Autocomplete dropdown */}
        {showSuggestions && value && !generating && !genError && !isEmmetMode && (suggestions.length > 0 || matchedCustomTemplates.length > 0) && (
          <div
            className="glass-elevated rounded-xl absolute left-0 right-0 z-20 overflow-hidden"
            style={{ marginTop: 4, padding: 4, maxHeight: 240, overflowY: 'auto' }}
          >
            {suggestions.map((item, idx) => (
              <button
                key={item.type}
                onMouseDown={(e) => {
                  e.preventDefault();
                  if (isRemoveMode) {
                    onRemove(item.type);
                  } else {
                    onAdd(item.type);
                  }
                  setValue('');
                }}
                onMouseEnter={() => setHighlightIndex(idx)}
                className="w-full flex items-center text-left text-sm"
                style={{
                  padding: '8px 12px',
                  gap: 12,
                  background:
                    idx === highlightIndex
                      ? isRemoveMode
                        ? 'rgba(255,60,60,0.12)'
                        : 'var(--glass-surface-hover)'
                      : 'transparent',
                  color:
                    idx === highlightIndex
                      ? isRemoveMode
                        ? 'rgba(255,120,120,1)'
                        : 'var(--text-primary)'
                      : 'var(--text-secondary)',
                  cursor: 'pointer',
                  border: 'none',
                  outline: 'none',
                }}
              >
                <span className="w-5 text-center shrink-0 text-xs">
                  {isRemoveMode ? '✕' : item.icon}
                </span>
                <span className="flex-1">
                  {item.type}
                  {!isRemoveMode && item.isMacro && (
                    <span
                      className="text-[10px] rounded-full"
                      style={{
                        marginLeft: 8,
                        padding: '2px 6px',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        color: 'var(--text-tertiary)',
                      }}
                    >
                      macro
                    </span>
                  )}
                </span>
                <span className="text-xs" style={{ color: isRemoveMode ? 'rgba(255,100,100,0.6)' : 'var(--text-tertiary)' }}>
                  {isRemoveMode ? 'remove' : item.defaultLabel}
                </span>
              </button>
            ))}

            {/* Custom templates section */}
            {matchedCustomTemplates.length > 0 && (
              <>
                {suggestions.length > 0 && (
                  <div style={{ padding: '4px 12px', fontSize: 10, fontWeight: 600, color: 'var(--text-tertiary)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    Custom
                  </div>
                )}
                {matchedCustomTemplates.map((tmpl, idx) => {
                  const globalIdx = suggestions.length + idx;
                  return (
                    <button
                      key={tmpl.id}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        onAddCustomBlock(tmpl.label, tmpl.layout, tmpl.prompt);
                        setValue('');
                      }}
                      onMouseEnter={() => setHighlightIndex(globalIdx)}
                      className="w-full flex items-center text-left text-sm"
                      style={{
                        padding: '8px 12px',
                        gap: 12,
                        background: globalIdx === highlightIndex ? 'var(--glass-surface-hover)' : 'transparent',
                        color: globalIdx === highlightIndex ? 'var(--text-primary)' : 'var(--text-secondary)',
                        cursor: 'pointer',
                        border: 'none',
                        outline: 'none',
                      }}
                    >
                      <span className="w-5 text-center shrink-0 text-xs">✦</span>
                      <span className="flex-1">{tmpl.label}</span>
                      <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>custom</span>
                    </button>
                  );
                })}
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
}
