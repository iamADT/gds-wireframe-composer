import { useState, useEffect } from 'react';
import ComponentsPage from './ComponentsPage';

const FEATURES = [
  { icon: '⬜', text: 'Try typing "h1" or "radios" in the block input to instantly add a GDS component' },
  { icon: '✦', text: 'Try typing "search bar generate" to create a custom block using AI' },
  { icon: '⊞', text: 'Try typing "template" to scaffold a full page — header, service-nav, back-link and h1 in one go' },
  { icon: '↗', text: 'Try the "Connect" tab to drag screens onto a canvas and link them with arrows' },
  { icon: '✎', text: 'Try double-clicking a screen name to rename it, or dragging blocks to reorder them' },
];

function AboutModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.55)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
      }}
      onClick={onClose}
    >
      <div
        className="glass-elevated"
        style={{
          width: 420,
          borderRadius: 16,
          padding: '28px 28px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)', marginBottom: 4 }}>
              GDS Lo-Fi Composer
            </p>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              Created by Tolu Alder
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-tertiary)',
              fontSize: 16,
              lineHeight: 1,
              padding: 2,
            }}
            title="Close"
          >
            ✕
          </button>
        </div>

        {/* Divider */}
        <div style={{ borderTop: '1px solid var(--border-outer)' }} />

        {/* Feature list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {FEATURES.map(({ icon, text }) => (
            <div key={text} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <span style={{ fontSize: 13, color: 'var(--text-secondary)', flexShrink: 0, marginTop: 1 }}>
                {icon}
              </span>
              <p className="text-xs" style={{ color: 'var(--text-primary)', lineHeight: 1.5 }}>
                {text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AppBar() {
  const [showAbout, setShowAbout] = useState(false);
  const [showComponents, setShowComponents] = useState(false);

  useEffect(() => {
    const handler = () => setShowAbout(true);
    window.addEventListener('open-about', handler);
    return () => window.removeEventListener('open-about', handler);
  }, []);

  return (
    <>
      <header
        className="sticky top-0 z-50 flex items-center justify-between"
        style={{
          padding: '12px 16px',
          background: 'var(--bg-0-bar)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          borderBottom: '1px solid var(--border-outer)',
          boxShadow: 'inset 0 -1px 0 0 var(--border-inner)',
        }}
      >
        <div>
          <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            GDS Lo-Fi Composer
          </span>
          <span className="text-xs" style={{ color: 'var(--text-tertiary)', marginLeft: 8 }}>
            v1
          </span>
        </div>
        <div className="flex items-center" style={{ gap: 8 }}>
          <button
            onClick={() => setShowComponents(true)}
            style={{
              background: 'var(--glass-surface-2)',
              border: '1px solid var(--border-outer)',
              borderRadius: 6,
              color: 'var(--text-secondary)',
              fontSize: 12,
              cursor: 'pointer',
              padding: '4px 10px',
              lineHeight: 1,
            }}
          >
            Components
          </button>
          <button
            onClick={() => setShowAbout(true)}
            style={{
              background: 'var(--glass-surface-2)',
              border: '1px solid var(--border-outer)',
              borderRadius: 6,
              color: 'var(--text-secondary)',
              fontSize: 12,
              cursor: 'pointer',
              padding: '4px 10px',
              lineHeight: 1,
            }}
          >
            About
          </button>
        </div>
      </header>

      {showAbout && <AboutModal onClose={() => setShowAbout(false)} />}
      {showComponents && <ComponentsPage onClose={() => setShowComponents(false)} />}
    </>
  );
}
