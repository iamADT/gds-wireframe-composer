export default function LeftPanel({ children }: { children: React.ReactNode }) {
  return (
    <aside
      className="glass-panel glass-specular rounded-2xl overflow-y-auto flex flex-col"
      style={{ width: 320, minWidth: 280, padding: '16px 24px', gap: 20, position: 'relative' }}
    >
      {children}
    </aside>
  );
}
