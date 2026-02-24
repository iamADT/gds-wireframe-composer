import { useState } from 'react';
import type { ContainerType } from '../types';

interface Props {
  onCreate: (type: ContainerType) => void;
  showStart?: boolean;
  view?: 'current' | 'screens';
  onViewChange?: (view: 'current' | 'screens') => void;
}

export default function ContainerCreator({ onCreate, showStart = true, view, onViewChange }: Props) {
  const [selectedType, setSelectedType] = useState<ContainerType>('screen');
  const hasContainers = !showStart;

  return (
    <div className="flex flex-col" style={{ gap: 8 }}>
      {/* View toggle — only when containers exist */}
      {hasContainers && onViewChange && view && (
        <div
          className="flex rounded-xl overflow-hidden"
          style={{
            border: '1px solid var(--border-outer)',
            background: 'var(--glass-surface-1)',
          }}
        >
          {(['current', 'screens'] as const).map((v) => (
            <button
              key={v}
              onClick={() => onViewChange(v)}
              className="flex-1 text-xs font-medium transition-colors"
              style={{
                padding: '8px 16px',
                background: view === v ? 'var(--glass-surface-selected)' : 'transparent',
                color: view === v ? 'var(--text-primary)' : 'var(--text-tertiary)',
                cursor: 'pointer',
                border: 'none',
                outline: 'none',
                whiteSpace: 'nowrap',
              }}
            >
              {v === 'current' ? 'Current Screen' : 'Screens'}
            </button>
          ))}
        </div>
      )}

      <div className="flex items-center" style={{ gap: 8 }}>
        {/* Type dropdown */}
        <div className="relative" style={{ flex: 1 }}>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as ContainerType)}
            className="rounded-xl text-xs font-medium w-full"
            style={{
              padding: '8px 28px 8px 12px',
              background: 'var(--glass-surface-1)',
              border: '1px solid var(--border-outer)',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              outline: 'none',
              appearance: 'none',
              WebkitAppearance: 'none',
            }}
          >
            <option value="screen">Screen</option>
            <option value="modal">Modal</option>
          </select>
          <span
            className="pointer-events-none absolute right-2"
            style={{ color: 'var(--text-tertiary)', fontSize: 32, lineHeight: 1, top: '38%', transform: 'translateY(-50%)' }}
          >
            ▾
          </span>
        </div>

        {/* Create button */}
        {showStart && (
          <button
            onClick={() => onCreate(selectedType)}
            className="glass glass-specular rounded-xl text-xs font-medium"
            style={{
              padding: '8px 32px',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              background: 'rgba(255,255,255,0.12)',
            }}
          >
            Start
          </button>
        )}
      </div>
    </div>
  );
}
