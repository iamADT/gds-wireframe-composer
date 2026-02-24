export default function RightPanel({ children }: { children: React.ReactNode }) {
  return (
    <main
      className="flex-1 overflow-y-auto flex items-start justify-center"
      style={{
        padding: 16,
        backgroundImage:
          'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)',
        backgroundSize: '20px 20px',
      }}
    >
      {children}
    </main>
  );
}
