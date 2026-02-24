import { useState, useRef, useEffect, useCallback } from 'react';

interface Props {
  value: string;
  onCommit: (value: string) => void;
  className?: string;
  style?: React.CSSProperties;
}

export default function EditableText({ value, onCommit, className = '', style }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && ref.current) {
      ref.current.focus();
      // Select all text
      const range = document.createRange();
      range.selectNodeContents(ref.current);
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
  }, [isEditing]);

  const confirm = useCallback(() => {
    const text = ref.current?.textContent?.trim() || value;
    onCommit(text);
    setIsEditing(false);
  }, [value, onCommit]);

  const cancel = useCallback(() => {
    if (ref.current) ref.current.textContent = value;
    setIsEditing(false);
  }, [value]);

  if (!isEditing) {
    return (
      <span
        className={className}
        style={{ ...style, cursor: 'text' }}
        onDoubleClick={(e) => {
          e.stopPropagation();
          setIsEditing(true);
        }}
      >
        {value}
      </span>
    );
  }

  return (
    <span
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      className={className}
      style={{
        ...style,
        outline: 'none',
        borderBottom: '1px dashed rgba(255,255,255,0.15)',
        background: 'rgba(255,255,255,0.02)',
        cursor: 'text',
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          confirm();
        }
        if (e.key === 'Escape') {
          e.preventDefault();
          cancel();
        }
      }}
      onBlur={confirm}
      onClick={(e) => e.stopPropagation()}
    >
      {editValue}
    </span>
  );
}
