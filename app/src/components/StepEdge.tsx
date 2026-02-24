import { useState } from 'react';
import {
  getSmoothStepPath,
  EdgeLabelRenderer,
  BaseEdge,
  type EdgeProps,
} from '@xyflow/react';

interface StepEdgeData {
  label?: string;
  onLabelChange: (label: string) => void;
  [key: string]: unknown;
}

export default function StepEdge({
  id,
  sourceX, sourceY, sourcePosition,
  targetX, targetY, targetPosition,
  markerEnd,
  data,
}: EdgeProps) {
  const d = data as StepEdgeData;
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState('');

  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX, sourceY, sourcePosition,
    targetX, targetY, targetPosition,
    borderRadius: 4,
  });

  function startEdit() {
    setEditValue(d?.label ?? '');
    setEditing(true);
  }

  function commit() {
    d?.onLabelChange(editValue);
    setEditing(false);
  }

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={{ stroke: 'rgba(255,255,255,0.35)', strokeWidth: 1.5 }}
      />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%,-50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
            zIndex: 10,
          }}
          onDoubleClick={startEdit}
        >
          {editing ? (
            <input
              autoFocus
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={commit}
              onKeyDown={(e) => {
                if (e.key === 'Enter') commit();
                if (e.key === 'Escape') setEditing(false);
              }}
              style={{
                fontSize: 10,
                padding: '2px 6px',
                background: 'rgba(15,15,15,0.9)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: 4,
                color: 'var(--text-primary)',
                outline: 'none',
                minWidth: 60,
              }}
            />
          ) : (
            d?.label ? (
              <span
                style={{
                  fontSize: 10,
                  padding: '2px 6px',
                  background: 'rgba(15,15,15,0.7)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 4,
                  color: 'var(--text-secondary)',
                  cursor: 'default',
                  display: 'block',
                }}
              >
                {d.label}
              </span>
            ) : (
              <span
                style={{
                  display: 'block',
                  width: 24,
                  height: 16,
                  cursor: 'text',
                }}
                title="Double-click to add label"
              />
            )
          )}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
