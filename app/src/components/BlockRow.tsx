import { useState, useRef, useEffect } from 'react';
import type { DragControls } from 'framer-motion';
import type { Block } from '../types';
import { BLOCK_TYPES } from '../types';

interface Props {
  block: Block;
  isSelected: boolean;
  dragControls?: DragControls;
  onSelect: () => void;
  onUpdateLabel: (label: string) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onRepeat: (count: number) => void;
}

export default function BlockRow({
  block,
  isSelected,
  dragControls,
  onSelect,
  onUpdateLabel,
  onDelete,
  onDuplicate,
  onRepeat,
}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(block.label);
  const [showMenu, setShowMenu] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const info = BLOCK_TYPES.find((b) => b.type === block.type);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const confirmEdit = () => {
    if (editValue.trim()) {
      onUpdateLabel(editValue.trim());
    }
    setIsEditing(false);
  };

  const cancelEdit = () => {
    setEditValue(block.label);
    setIsEditing(false);
  };

  return (
    <div
      className={`glass glass-specular rounded-2xl flex items-center cursor-pointer relative ${
        isSelected ? 'glass-selected' : ''
      }`}
      onClick={onSelect}
      onDoubleClick={() => {
        setEditValue(block.label);
        setIsEditing(true);
      }}
      style={{
        padding: '8px 16px',
        gap: 12,
        zIndex: showMenu ? 10 : 'auto',
        ...(isSelected ? {
          background: 'var(--glass-surface-selected)',
          borderColor: 'rgba(255,255,255,0.10)',
          boxShadow: 'inset 0 0 0 1px var(--border-inner-selected), inset 0 1px 0 0 var(--tint-blue-strong)',
        } : {}),
      }}
    >
      {/* Drag handle */}
      <div
        onPointerDown={(e) => dragControls?.start(e)}
        className="cursor-grab active:cursor-grabbing shrink-0 touch-none select-none"
        style={{ opacity: 0.4, fontSize: 14, lineHeight: 1, padding: '0 2px' }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = '0.8'; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = '0.4'; }}
      >
        ⠿
      </div>

      {/* Icon */}
      <span className="w-5 text-center shrink-0 text-xs" style={{ color: 'var(--text-secondary)' }}>
        {info?.icon ?? '?'}
      </span>

      {/* Label / Edit */}
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') confirmEdit();
              if (e.key === 'Escape') cancelEdit();
            }}
            onBlur={confirmEdit}
            className="w-full bg-transparent border-none outline-none text-sm"
            style={{ color: 'var(--text-primary)' }}
          />
        ) : (
          <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
            {block.label}
          </p>
        )}
        <p className="text-[11px] font-semibold tracking-wider uppercase" style={{ color: 'var(--text-tertiary)' }}>
          {block.type}
        </p>
      </div>

      {/* Ellipsis menu trigger */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setShowMenu(!showMenu);
        }}
        className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
        style={{
          background: 'var(--glass-surface-2)',
          border: '1px solid var(--border-outer)',
          color: 'var(--text-secondary)',
          cursor: 'pointer',
          outline: 'none',
          opacity: isSelected || showMenu ? 1 : 0,
        }}
      >
        ⋯
      </button>

      {/* Dropdown menu */}
      {showMenu && (
        <div
          className="glass-elevated rounded-xl absolute right-0 top-full z-30 min-w-[140px]"
          style={{ marginTop: 4, padding: 4 }}
          onMouseLeave={() => setShowMenu(false)}
        >
          {[
            { label: 'Duplicate', action: () => { onDuplicate(); setShowMenu(false); } },
            { label: 'Repeat ×2', action: () => { onRepeat(2); setShowMenu(false); } },
            { label: 'Repeat ×3', action: () => { onRepeat(3); setShowMenu(false); } },
            { label: 'Repeat ×4', action: () => { onRepeat(4); setShowMenu(false); } },
            { label: 'Delete', action: () => { onDelete(); setShowMenu(false); } },
          ].map((item) => (
            <button
              key={item.label}
              onClick={(e) => {
                e.stopPropagation();
                item.action();
              }}
              className="w-full text-left text-sm"
              style={{
                padding: '8px 12px',
                color: item.label === 'Delete' ? 'rgba(255,100,100,0.8)' : 'var(--text-secondary)',
                cursor: 'pointer',
                background: 'transparent',
                border: 'none',
                outline: 'none',
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.background = 'var(--glass-surface-hover)';
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.background = 'transparent';
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
