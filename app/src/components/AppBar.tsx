export default function AppBar() {
  return (
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
        {/* CTA cluster — populated in later phases */}
      </div>
    </header>
  );
}
