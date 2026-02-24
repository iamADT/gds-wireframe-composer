import { useState, useRef } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';

interface ShapeNodeData {
  shapeType: 'start-end' | 'decision' | 'process';
  label?: string;
  onLabelChange: (label: string) => void;
  [key: string]: unknown;
}

const SHAPE_CONFIGS: Record<
  string,
  {
    width: number;
    height: number;
    baseStroke: string;
    selectedStroke: string;
    svg: (w: number, h: number, stroke: string, strokeWidth: number) => React.ReactNode;
  }
> = {
  'start-end': {
    width: 160, height: 60,
    baseStroke: 'rgba(15,122,82,0.8)',
    selectedStroke: 'rgba(50,220,130,1)',
    svg: (w, h, stroke, sw) => (
      <ellipse cx={w / 2} cy={h / 2} rx={w / 2 - 2} ry={h / 2 - 2} fill="rgba(15,122,82,0.06)" stroke={stroke} strokeWidth={sw} />
    ),
  },
  'decision': {
    width: 140, height: 100,
    baseStroke: 'rgba(200,140,30,0.8)',
    selectedStroke: 'rgba(255,190,50,1)',
    svg: (w, h, stroke, sw) => (
      <polygon points={`${w/2},2 ${w-2},${h/2} ${w/2},${h-2} 2,${h/2}`} fill="rgba(200,140,30,0.06)" stroke={stroke} strokeWidth={sw} />
    ),
  },
  'process': {
    width: 160, height: 70,
    baseStroke: 'rgba(90,120,160,0.8)',
    selectedStroke: 'rgba(140,170,255,1)',
    svg: (w, h, stroke, sw) => (
      <rect x={2} y={2} width={w - 4} height={h - 4} rx={3} fill="rgba(90,120,160,0.06)" stroke={stroke} strokeWidth={sw} />
    ),
  },
};

const HANDLES = [
  { pos: Position.Top,    id: 'top' },
  { pos: Position.Right,  id: 'right' },
  { pos: Position.Bottom, id: 'bottom' },
  { pos: Position.Left,   id: 'left' },
];

export default function ShapeNode({ data, selected }: NodeProps) {
  const d = data as ShapeNodeData;
  const config = SHAPE_CONFIGS[d.shapeType ?? 'process'];
  const { width, height } = config;
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const stroke = selected ? config.selectedStroke : config.baseStroke;
  const strokeWidth = selected ? 2 : 1.5;

  function startEdit() {
    setEditValue(d.label ?? '');
    setEditing(true);
    setTimeout(() => inputRef.current?.select(), 0);
  }

  function commit() {
    d.onLabelChange(editValue);
    setEditing(false);
  }

  return (
    <div
      style={{
        width,
        height,
        position: 'relative',
        // Glow when selected
        filter: selected ? 'drop-shadow(0 0 6px rgba(140,170,255,0.55))' : 'none',
        transition: 'filter 0.1s',
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

      <svg
        width={width}
        height={height}
        style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
      >
        {config.svg(width, height, stroke, strokeWidth)}
      </svg>

      {/* Label — drag handle area + double-click to edit */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '4px 16px',
        }}
        onDoubleClick={startEdit}
      >
        {editing ? (
          <input
            ref={inputRef}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => {
              if (e.key === 'Enter') commit();
              if (e.key === 'Escape') setEditing(false);
            }}
            style={{
              textAlign: 'center',
              fontSize: 11,
              color: 'var(--text-primary)',
              background: 'rgba(0,0,0,0.6)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: 4,
              outline: 'none',
              width: '100%',
              padding: '2px 4px',
            }}
          />
        ) : (
          <span
            style={{
              fontSize: 11,
              color: d.label ? 'var(--text-primary)' : 'var(--text-tertiary)',
              textAlign: 'center',
              userSelect: 'none',
              cursor: 'default',
              lineHeight: 1.3,
            }}
          >
            {d.label || 'double-click to label'}
          </span>
        )}
      </div>
    </div>
  );
}
