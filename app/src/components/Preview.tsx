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

function AppDescription() {
  return (
    <div style={{ width: 1024, marginBottom: 20 }}>
      <p style={{ fontSize: 15, lineHeight: '24px', color: 'var(--text-primary)', margin: 0 }}>
        <span style={{ fontWeight: 600 }}>A lo-fi wireframing tool for GOV.UK service pages.</span>
        <br />
        <span style={{ color: 'var(--text-secondary)' }}>
          Create a screen, then type block names — gds-header, h1, text-input, button — to
          build a page and see an instant live preview. Add multiple screens to map a full user journey.
        </span>
      </p>
    </div>
  );
}

function GhostRow({ children, label, padding = '0 20px' }: {
  children: React.ReactNode; label: string; padding?: string;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding, gap: 16 }}>
      <div style={{ opacity: 0.42, flex: 1, minWidth: 0 }}>{children}</div>
      <div style={{ flexShrink: 0, width: 160 }}>
        <span style={{ fontSize: 10, color: 'rgba(140,170,255,0.75)', whiteSpace: 'nowrap' }}>
          ← {label}
        </span>
      </div>
    </div>
  );
}

function GhostPageContent() {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* gds-header */}
      <GhostRow label='type "gds-header"' padding="0">
        <div style={{ background: '#1d70b8', height: 50 }} />
      </GhostRow>

      {/* service-nav */}
      <GhostRow label='type "service-nav"' padding="0">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderBottom: '1px solid #b1b4b6' }}>
          <div style={{ background: '#b1b4b6', borderRadius: 20, height: 22, width: 72 }} />
          <div style={{ background: '#b1b4b6', borderRadius: 20, height: 22, width: 56 }} />
          <div style={{ background: '#b1b4b6', borderRadius: 20, height: 22, width: 64 }} />
        </div>
      </GhostRow>

      <div style={{ height: 24 }} />

      {/* h1 */}
      <GhostRow label='type "h1"'>
        <div style={{ background: '#b1b4b6', height: 28, width: '70%', borderRadius: 2 }} />
      </GhostRow>

      <div style={{ height: 16 }} />

      {/* body-text */}
      <GhostRow label='type "body-text"'>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ background: '#d8d8d8', height: 8, width: '100%', borderRadius: 2 }} />
          <div style={{ background: '#d8d8d8', height: 8, width: '95%', borderRadius: 2 }} />
          <div style={{ background: '#d8d8d8', height: 8, width: '88%', borderRadius: 2 }} />
          <div style={{ background: '#d8d8d8', height: 8, width: '65%', borderRadius: 2 }} />
        </div>
      </GhostRow>

      <div style={{ height: 20 }} />

      {/* text-input */}
      <GhostRow label='type "text-input"'>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ background: '#b1b4b6', height: 10, width: 120, borderRadius: 2 }} />
          <div style={{ border: '2px solid #0b0c0c', height: 40, width: 280, borderRadius: 0 }} />
        </div>
      </GhostRow>

      <div style={{ height: 20 }} />

      {/* button */}
      <GhostRow label='type "button"'>
        <div style={{ background: '#0f7a52', height: 40, width: 140, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'rgba(255,255,255,0.35)', height: 14, width: 80, borderRadius: 10 }} />
        </div>
      </GhostRow>

      <div style={{ height: 24 }} />
    </div>
  );
}

function GhostWireframe() {
  return (
    <div className="glass-panel glass-specular rounded-xl overflow-hidden flex flex-col" style={{ width: 1024 }}>
      <BrowserChrome />
      <div className="wire-page flex-1 flex flex-col" style={{ background: '#ffffff' }}>
        <GhostPageContent />
        <div style={{
          height: 80, marginTop: 'auto', flexShrink: 0,
          background: 'linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,1))',
          pointerEvents: 'none',
        }} />
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
      <div className="flex flex-col" style={{ gap: 0 }}>
        <AppDescription />
        <GhostWireframe />
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
