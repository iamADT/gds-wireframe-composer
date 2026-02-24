import { useState } from 'react';
import { saveApiKey } from '../lib/generateBlock';

interface Props {
  onSave: (key: string) => void;
  onCancel: () => void;
}

export default function ApiKeyModal({ onSave, onCancel }: Props) {
  const [value, setValue] = useState('');

  const handleSave = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    saveApiKey(trimmed);
    onSave(trimmed);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.5)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
    >
      <div
        className="glass-elevated rounded-xl"
        style={{ padding: 24, width: 360, display: 'flex', flexDirection: 'column', gap: 16 }}
      >
        <div>
          <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)', marginBottom: 8 }}>
            Connect to Claude
          </p>
          <p className="text-xs" style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Custom block generation uses the Claude API. Enter your Anthropic API key to continue.
            Your key is stored locally in this browser only.
          </p>
        </div>

        <input
          type="password"
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSave();
            if (e.key === 'Escape') onCancel();
          }}
          placeholder="sk-ant-..."
          className="w-full rounded-xl text-sm outline-none"
          style={{
            padding: '8px 16px',
            background: 'var(--glass-surface-2)',
            border: '1px solid var(--border-outer)',
            color: 'var(--text-primary)',
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
            boxShadow: 'inset 0 0 0 1px var(--border-inner)',
          }}
        />

        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button
            onClick={onCancel}
            className="text-sm rounded-xl"
            style={{
              padding: '8px 16px',
              background: 'var(--glass-surface-2)',
              border: '1px solid var(--border-outer)',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!value.trim()}
            className="text-sm rounded-xl"
            style={{
              padding: '8px 16px',
              background: value.trim() ? 'var(--tint-blue-strong)' : 'var(--glass-surface-2)',
              border: '1px solid var(--border-outer)',
              color: value.trim() ? '#ffffff' : 'var(--text-tertiary)',
              cursor: value.trim() ? 'pointer' : 'default',
              transition: 'background 0.15s, color 0.15s',
            }}
          >
            Save and generate
          </button>
        </div>
      </div>
    </div>
  );
}
