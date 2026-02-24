import { useState } from 'react';
import type { Container } from '../types';

interface Props {
  containers: Container[];
  activeContainerId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function ContainerList({ containers, activeContainerId, onSelect, onDelete }: Props) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  if (containers.length === 0) return null;

  return (
    <div>
      <p
        className="text-[11px] font-semibold tracking-wider uppercase"
        style={{ color: 'var(--text-tertiary)', marginBottom: 20 }}
      >
        Containers
      </p>
      <div className="flex flex-col" style={{ gap: 20 }}>
        {containers.map((container) => {
          const isActive = container.id === activeContainerId;
          return (
            <button
              key={container.id}
              onClick={() => onSelect(container.id)}
              className={`flex items-center w-full rounded-2xl text-left transition-all relative ${
                isActive ? 'glass-selected' : ''
              }`}
              style={{
                padding: '8px 16px',
                gap: 12,
                background: isActive ? 'var(--glass-surface-selected)' : 'transparent',
                border: isActive ? '1px solid rgba(255,255,255,0.10)' : '1px solid transparent',
                cursor: 'pointer',
                outline: 'none',
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                zIndex: openMenuId === container.id ? 10 : 'auto',
              }}
            >
              {/* Icon tile */}
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-xs shrink-0"
                style={{
                  background: isActive ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${isActive ? 'rgba(255,255,255,0.20)' : 'var(--border-outer)'}`,
                }}
              >
                {container.type === 'screen' ? '📱' : '◻'}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{container.name}</p>
                <p className="text-[11px] tracking-wide" style={{ color: 'var(--text-tertiary)' }}>
                  {container.blocks.length} block{container.blocks.length !== 1 ? 's' : ''}
                </p>
              </div>

              {/* Ellipsis menu trigger */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenMenuId(openMenuId === container.id ? null : container.id);
                }}
                className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                style={{
                  background: 'var(--glass-surface-2)',
                  border: '1px solid var(--border-outer)',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  outline: 'none',
                  opacity: isActive || openMenuId === container.id ? 1 : 0,
                }}
              >
                ⋯
              </button>

              {/* Dropdown menu */}
              {openMenuId === container.id && (
                <div
                  className="glass-elevated rounded-xl absolute right-0 top-full z-30 min-w-[120px]"
                  style={{ marginTop: 4, padding: 4 }}
                  onMouseLeave={() => setOpenMenuId(null)}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenuId(null);
                      onDelete(container.id);
                    }}
                    className="w-full text-left text-sm"
                    style={{
                      padding: '8px 12px',
                      color: 'rgba(255,100,100,0.8)',
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
                    Delete
                  </button>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
