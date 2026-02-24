import { Fragment, useRef, useState } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import Preview from './Preview';
import type { Container } from '../types';

interface ScreenNodeData {
  container: Container;
  onOpen: (id: string) => void;
  onRename: (id: string, name: string) => void;
  [key: string]: unknown;
}

const HANDLES = [
  { pos: Position.Top,    id: 'top' },
  { pos: Position.Right,  id: 'right' },
  { pos: Position.Bottom, id: 'bottom' },
  { pos: Position.Left,   id: 'left' },
];

export default function ScreenNode({ id, data, selected }: NodeProps) {
  const d = data as ScreenNodeData;
  const [editingName, setEditingName] = useState(false);
  const [nameValue, setNameValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  if (!d.container) return null;

  function startRename() {
    setNameValue(d.container.name);
    setEditingName(true);
    setTimeout(() => inputRef.current?.select(), 0);
  }

  function commitRename() {
    d.onRename(id, nameValue);
    setEditingName(false);
  }

  return (
    <div
      className="glass-elevated"
      style={{
        width: 220,
        borderRadius: 12,
        overflow: 'visible',
        position: 'relative',
        // Selection ring
        outline: selected ? '2px solid rgba(140,170,255,0.85)' : '2px solid transparent',
        outlineOffset: 2,
        transition: 'outline-color 0.1s',
      }}
    >
      {HANDLES.map(({ pos, id: hid }) => (
        <Handle
          key={hid}
          type="source"
          position={pos}
          id={hid}
          style={{}}
        />
      ))}

      {/* Header */}
      <div
        className="flex items-center"
        style={{
          padding: '6px 10px',
          borderBottom: '1px solid var(--border-outer)',
          gap: 6,
          // Tint the header when selected
          background: selected ? 'rgba(140,170,255,0.08)' : 'transparent',
          borderRadius: '12px 12px 0 0',
          transition: 'background 0.1s',
        }}
      >
        <div className="flex-1 min-w-0">
          {editingName ? (
            <input
              ref={inputRef}
              value={nameValue}
              onChange={(e) => setNameValue(e.target.value)}
              onBlur={commitRename}
              onKeyDown={(e) => {
                if (e.key === 'Enter') commitRename();
                if (e.key === 'Escape') setEditingName(false);
              }}
              className="text-xs font-medium w-full"
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: 4,
                padding: '1px 4px',
                color: 'var(--text-primary)',
                outline: 'none',
              }}
            />
          ) : (
            <p
              className="text-xs font-medium truncate"
              style={{ color: 'var(--text-primary)', cursor: 'text' }}
              onDoubleClick={startRename}
            >
              {d.container.name}
            </p>
          )}
        </div>
        <button
          onClick={() => d.onOpen(id)}
          title="Edit screen"
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid var(--border-outer)',
            borderRadius: 4,
            color: 'var(--text-secondary)',
            fontSize: 10,
            cursor: 'pointer',
            padding: '2px 5px',
            lineHeight: 1,
            flexShrink: 0,
          }}
        >
          ✎
        </button>
      </div>

      {/* Mini preview */}
      <div
        style={{
          width: 220,
          height: 150,
          overflow: 'hidden',
          position: 'relative',
          pointerEvents: 'none',
          borderRadius: '0 0 12px 12px',
          background: '#ffffff',
        }}
      >
        <div
          style={{
            width: 1024,
            transformOrigin: 'top left',
            transform: 'scale(0.215)',
          }}
        >
          <Preview
            container={d.container}
            selectedBlockId={null}
            onSelectBlock={() => {}}
            onUpdateBlockLabel={() => {}}
            onUpdateBlockOptions={() => {}}
          />
        </div>
      </div>
    </div>
  );
}
