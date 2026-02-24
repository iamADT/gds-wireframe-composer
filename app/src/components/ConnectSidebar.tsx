import { nanoid } from 'nanoid';
import type { Container, CanvasNode } from '../types';

interface Props {
  containers: Container[];
  placedNodeIds: Set<string>;
  onAddNode: (node: CanvasNode) => void;
  onRename: (id: string, name: string) => void;
}

const SHAPES: { kind: 'shape'; shapeType: 'start-end' | 'decision' | 'process'; label: string; icon: string }[] = [
  { kind: 'shape', shapeType: 'start-end', label: 'Start / End', icon: '⬭' },
  { kind: 'shape', shapeType: 'decision',  label: 'Decision',    icon: '◇' },
  { kind: 'shape', shapeType: 'process',   label: 'Process',     icon: '▭' },
];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-[11px] font-semibold tracking-wider uppercase"
      style={{ color: 'var(--text-tertiary)', marginBottom: 8 }}
    >
      {children}
    </p>
  );
}

export default function ConnectSidebar({ containers, placedNodeIds, onAddNode }: Props) {
  const unplaced = containers.filter((c) => !placedNodeIds.has(c.id));
  const placed = containers.filter((c) => placedNodeIds.has(c.id));

  function handleScreenDragStart(e: React.DragEvent, container: Container) {
    e.dataTransfer.setData(
      'application/rfnode',
      JSON.stringify({ kind: 'screen', id: container.id })
    );
    e.dataTransfer.effectAllowed = 'move';
  }

  function handleShapeDragStart(e: React.DragEvent, shapeType: string) {
    e.dataTransfer.setData(
      'application/rfnode',
      JSON.stringify({ kind: 'shape', shapeType })
    );
    e.dataTransfer.effectAllowed = 'copy';
  }

  function addShapeAtDefault(shapeType: 'start-end' | 'decision' | 'process') {
    onAddNode({
      id: nanoid(),
      kind: 'shape',
      shapeType,
      position: { x: 80 + Math.random() * 200, y: 80 + Math.random() * 200 },
    });
  }

  return (
    <div className="flex flex-col" style={{ gap: 24 }}>

      {/* Screens to place — visual rectangle cards */}
      <div>
        <SectionLabel>Screens to place</SectionLabel>
        {unplaced.length === 0 ? (
          <p style={{ fontSize: 11, color: 'var(--text-tertiary)', fontStyle: 'italic' }}>
            All screens on canvas
          </p>
        ) : (
          <div className="flex flex-col" style={{ gap: 8 }}>
            {unplaced.map((c) => (
              <div
                key={c.id}
                draggable
                onDragStart={(e) => handleScreenDragStart(e, c)}
                style={{ cursor: 'grab', userSelect: 'none' }}
              >
                {/* Rectangle card mimicking a mini browser frame */}
                <div
                  className="rounded-xl overflow-hidden"
                  style={{
                    border: '1px solid var(--border-outer)',
                    background: 'var(--glass-surface-1)',
                  }}
                >
                  {/* Title bar */}
                  <div
                    className="flex items-center"
                    style={{
                      padding: '6px 10px',
                      borderBottom: '1px solid var(--border-outer)',
                      gap: 6,
                      background: 'var(--glass-surface-2)',
                    }}
                  >
                    <div className="flex items-center" style={{ gap: 3 }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(255,255,255,0.12)' }} />
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(255,255,255,0.12)' }} />
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(255,255,255,0.12)' }} />
                    </div>
                    <p className="text-xs font-medium truncate flex-1" style={{ color: 'var(--text-primary)' }}>
                      {c.name}
                    </p>
                    <span style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>⠿</span>
                  </div>

                  {/* Body — block stubs */}
                  <div style={{ padding: '8px 10px 10px', minHeight: 48 }}>
                    {c.blocks.length === 0 ? (
                      <div style={{ height: 8, background: 'rgba(255,255,255,0.05)', borderRadius: 2 }} />
                    ) : (
                      <div className="flex flex-col" style={{ gap: 4 }}>
                        {c.blocks.slice(0, 4).map((b) => (
                          <div
                            key={b.id}
                            style={{
                              height: 6,
                              borderRadius: 2,
                              background: 'rgba(255,255,255,0.08)',
                              width: b.type === 'button' || b.type === 'button-secondary' ? '40%'
                                : b.type === 'gds-header' || b.type === 'service-nav' || b.type === 'gds-footer' ? '100%'
                                : `${55 + Math.abs(b.id.charCodeAt(0) % 35)}%`,
                            }}
                          />
                        ))}
                        {c.blocks.length > 4 && (
                          <p style={{ fontSize: 9, color: 'var(--text-tertiary)', marginTop: 2 }}>
                            +{c.blocks.length - 4} more
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Screens on canvas — compact list */}
      {placed.length > 0 && (
        <div>
          <SectionLabel>Screens on canvas</SectionLabel>
          <div className="flex flex-col" style={{ gap: 4 }}>
            {placed.map((c) => (
              <div
                key={c.id}
                className="flex items-center rounded-lg"
                style={{
                  padding: '5px 8px',
                  gap: 8,
                  background: 'var(--glass-surface-1)',
                  border: '1px solid var(--border-outer)',
                }}
              >
                <span style={{ fontSize: 12 }}>📱</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>{c.name}</p>
                </div>
                <span
                  style={{
                    fontSize: 9,
                    color: 'var(--text-tertiary)',
                    background: 'rgba(255,255,255,0.06)',
                    borderRadius: 4,
                    padding: '1px 5px',
                  }}
                >
                  on canvas
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Shapes */}
      <div>
        <SectionLabel>Shapes</SectionLabel>
        <div className="flex flex-col" style={{ gap: 6 }}>
          {SHAPES.map((s) => (
            <div
              key={s.shapeType}
              draggable
              onDragStart={(e) => handleShapeDragStart(e, s.shapeType)}
              onClick={() => addShapeAtDefault(s.shapeType)}
              className="flex items-center rounded-xl"
              style={{
                padding: '7px 12px',
                gap: 10,
                background: 'var(--glass-surface-1)',
                border: '1px solid var(--border-outer)',
                cursor: 'grab',
                userSelect: 'none',
              }}
            >
              <span style={{ fontSize: 16, lineHeight: 1, color: 'var(--text-secondary)' }}>{s.icon}</span>
              <p className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
