import { AnimatePresence, motion } from 'framer-motion';
import type { Container, BlockType } from '../types';
import WireBlock from './WireBlock';

// These blocks are full-bleed — they fill the full frame width
const FULL_BLEED: Set<BlockType> = new Set(['gds-header', 'service-nav', 'gds-footer']);

const wireVariants = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
};

const wireTrans = { duration: 0.12, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] };

interface Props {
  container: Container | null;
  selectedBlockId: string | null;
  onSelectBlock: (id: string | null) => void;
  onUpdateBlockLabel: (blockId: string, label: string) => void;
  onUpdateBlockOptions: (blockId: string, options: string[]) => void;
}

function BrowserChrome() {
  return (
    <div
      className="flex items-center shrink-0"
      style={{
        padding: '8px 12px',
        background: '#f3f2f1',
        borderBottom: '1px solid #b1b4b6',
        gap: 8,
      }}
    >
      {/* Traffic light dots */}
      <div className="flex items-center" style={{ gap: 5 }}>
        <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#b1b4b6' }} />
        <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#b1b4b6' }} />
        <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#b1b4b6' }} />
      </div>
      {/* URL bar */}
      <div
        className="flex-1 flex items-center"
        style={{
          padding: '3px 10px',
          background: '#ffffff',
          border: '1px solid #b1b4b6',
          borderRadius: 4,
        }}
      >
        <span style={{ fontSize: 11, color: '#505a5f', fontFamily: 'Arial, sans-serif' }}>
          service.gov.uk/...
        </span>
      </div>
    </div>
  );
}

function PageFrame({ container, selectedBlockId, onSelectBlock, onUpdateBlockLabel, onUpdateBlockOptions }: {
  container: Container;
  selectedBlockId: string | null;
  onSelectBlock: (id: string | null) => void;
  onUpdateBlockLabel: (blockId: string, label: string) => void;
  onUpdateBlockOptions: (blockId: string, options: string[]) => void;
}) {
  return (
    <div
      className="glass-panel glass-specular rounded-xl overflow-hidden flex flex-col"
      style={{ width: 1024, minHeight: 700 }}
      onClick={() => onSelectBlock(null)}
    >
      <BrowserChrome />
      <div
        className="wire-page flex-1 flex flex-col overflow-y-auto"
        style={{ minHeight: 0, fontFamily: 'Arial, sans-serif', background: '#ffffff' }}
        onClick={(e) => e.stopPropagation()}
      >
        <AnimatePresence initial={false}>
          {container.blocks.map((block) => (
            <motion.div
              key={block.id}
              variants={wireVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={wireTrans}
              layout
            >
              {FULL_BLEED.has(block.type) ? (
                <WireBlock
                  block={block}
                  isSelected={block.id === selectedBlockId}
                  onSelect={() => onSelectBlock(block.id)}
                  onUpdateLabel={(label) => onUpdateBlockLabel(block.id, label)}
                  onUpdateOptions={(options) => onUpdateBlockOptions(block.id, options)}
                />
              ) : (
                <div style={{ maxWidth: 960, margin: '0 auto' }}>
                  <WireBlock
                    block={block}
                    isSelected={block.id === selectedBlockId}
                    onSelect={() => onSelectBlock(block.id)}
                    onUpdateLabel={(label) => onUpdateBlockLabel(block.id, label)}
                    onUpdateOptions={(options) => onUpdateBlockOptions(block.id, options)}
                  />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function Preview({ container, selectedBlockId, onSelectBlock, onUpdateBlockLabel, onUpdateBlockOptions }: Props) {
  if (!container) {
    return (
      <div
        className="glass-panel glass-specular rounded-xl flex items-center justify-center"
        style={{ width: 1024, minHeight: 700 }}
      >
        <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
          Create a page to get started
        </p>
      </div>
    );
  }

  return (
    <PageFrame
      container={container}
      selectedBlockId={selectedBlockId}
      onSelectBlock={onSelectBlock}
      onUpdateBlockLabel={onUpdateBlockLabel}
      onUpdateBlockOptions={onUpdateBlockOptions}
    />
  );
}
