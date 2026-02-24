import { AnimatePresence, motion } from 'framer-motion';

interface Props {
  containerName: string;
  blockCount: number;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({ containerName, blockCount, onConfirm, onCancel }: Props) {
  return (
    <AnimatePresence>
      <motion.div
        key="overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onCancel}
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 50,
          background: 'rgba(0,0,0,0.2)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 16,
        }}
      >
        <motion.div
          key="dialog"
          initial={{ opacity: 0, scale: 0.95, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 8 }}
          transition={{ duration: 0.15 }}
          onClick={(e) => e.stopPropagation()}
          className="glass-elevated glass-specular rounded-2xl"
          style={{
            padding: '24px',
            width: 260,
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              Delete {containerName}?
            </p>
            <p className="text-xs" style={{ color: 'var(--text-tertiary)', lineHeight: 1.5 }}>
              This container has {blockCount} block{blockCount !== 1 ? 's' : ''}. This action can't be undone.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button
              onClick={onCancel}
              className="text-xs font-medium rounded-xl"
              style={{
                padding: '8px 16px',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="text-xs font-medium rounded-xl"
              style={{
                padding: '8px 16px',
                background: 'rgba(220,60,60,0.25)',
                border: '1px solid rgba(220,60,60,0.35)',
                color: '#ff8080',
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              Delete
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
