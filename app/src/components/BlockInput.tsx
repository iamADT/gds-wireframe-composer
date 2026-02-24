import { useState, useRef, useEffect, useCallback } from 'react';
import { BLOCK_TYPES, PLACEHOLDER_SUGGESTIONS } from '../types';
import type { Block, BlockType, BlockTypeInfo } from '../types';

interface Props {
  onAdd: (type: BlockType) => void;
  onRemove: (type: BlockType) => void;
  existingBlocks: Block[];
  onDismiss: () => void;
  placeholderIndex: number;
}

const REMOVE_RE = /^remove\s*/i;

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

export default function BlockInput({ onAdd, onRemove, existingBlocks, onDismiss, placeholderIndex }: Props) {
  const [value, setValue] = useState('');
  const [highlightIndex, setHighlightIndex] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const isRemoveMode = REMOVE_RE.test(value);
  const subQuery = isRemoveMode ? value.replace(REMOVE_RE, '') : value;

  const presentTypes = new Set(existingBlocks.map((b) => b.type));
  const removableCandidates = BLOCK_TYPES.filter((b) => presentTypes.has(b.type));

  const suggestions = isRemoveMode
    ? fuzzyMatch(subQuery, removableCandidates)
    : fuzzyMatch(value, BLOCK_TYPES);

  const placeholder = PLACEHOLDER_SUGGESTIONS[placeholderIndex % PLACEHOLDER_SUGGESTIONS.length];

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    setHighlightIndex(0);
  }, [value]);

  const handleSubmit = useCallback(() => {
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
  }, [value, isRemoveMode, subQuery, removableCandidates, suggestions, highlightIndex, onAdd, onRemove]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSubmit();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        if (value) {
          setValue('');
        } else {
          onDismiss();
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setHighlightIndex((prev) => Math.min(prev + 1, suggestions.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlightIndex((prev) => Math.max(prev - 1, 0));
      }
    },
    [handleSubmit, value, onDismiss, suggestions.length]
  );

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          setShowSuggestions(true);
        }}
        onKeyDown={handleKeyDown}
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
        placeholder={placeholder}
        className="w-full rounded-xl text-sm outline-none"
        style={{
          padding: '8px 16px',
          background: isRemoveMode ? 'rgba(255,60,60,0.06)' : 'var(--glass-surface-2)',
          border: isRemoveMode ? '1px solid rgba(255,80,80,0.25)' : '1px solid var(--border-outer)',
          color: 'var(--text-primary)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          boxShadow: isRemoveMode
            ? 'inset 0 0 0 1px rgba(255,80,80,0.12)'
            : 'inset 0 0 0 1px var(--border-inner), inset 0 1px 0 0 var(--tint-blue)',
          transition: 'background 0.15s, border-color 0.15s, box-shadow 0.15s',
        }}
      />

      {/* Autocomplete dropdown */}
      {showSuggestions && value && suggestions.length > 0 && (
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
        </div>
      )}
    </div>
  );
}
