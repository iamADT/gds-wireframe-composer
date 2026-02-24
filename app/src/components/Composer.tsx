import { AnimatePresence, motion, Reorder, useDragControls } from 'framer-motion';
import type { DragControls } from 'framer-motion';
import type { Container, Block, BlockType, CustomLayout, CustomTemplate } from '../types';
import BlockRow from './BlockRow';
import BlockInput from './BlockInput';

const blockVariants = {
  initial: { opacity: 0, y: -8, scale: 0.97 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 8, scale: 0.97 },
};

const blockTransition = {
  duration: 0.12,
  ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
};

interface DraggableBlockProps {
  block: Block;
  isSelected: boolean;
  onSelect: () => void;
  onUpdateLabel: (label: string) => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onRegenerate?: (prompt: string) => Promise<void>;
}

function DraggableBlock({ block, ...blockRowProps }: DraggableBlockProps) {
  const controls: DragControls = useDragControls();
  return (
    <Reorder.Item
      as="div"
      value={block}
      dragControls={controls}
      dragListener={false}
      variants={blockVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={blockTransition}
      layout
    >
      <BlockRow dragControls={controls} block={block} {...blockRowProps} />
    </Reorder.Item>
  );
}

interface Props {
  container: Container;
  selectedBlockId: string | null;
  blockInputVisible: boolean;
  onAddBlock: (type: BlockType) => void;
  onAddBlocks: (types: BlockType[]) => void;
  onRemoveBlock: (type: BlockType) => void;
  onSelectBlock: (id: string | null) => void;
  onUpdateBlockLabel: (id: string, label: string) => void;
  onDeleteBlock: (id: string) => void;
  onDuplicateBlock: (id: string) => void;
  onDismissInput: () => void;
  onReorderBlocks: (newBlocks: Block[]) => void;
  onAddCustomBlock: (label: string, layout: CustomLayout, prompt: string) => void;
  customTemplates: CustomTemplate[];
  onRegenerateBlock: (blockId: string, prompt: string) => Promise<void>;
  onCreateNext: () => void;
}

export default function Composer({
  container,
  selectedBlockId,
  blockInputVisible,
  onAddBlock,
  onAddBlocks,
  onRemoveBlock,
  onSelectBlock,
  onUpdateBlockLabel,
  onDeleteBlock,
  onDuplicateBlock,
  onDismissInput,
  onReorderBlocks,
  onAddCustomBlock,
  customTemplates,
  onRegenerateBlock,
  onCreateNext,
}: Props) {
  return (
    <div className="flex-1 flex flex-col">
      <div className="flex items-center justify-between" style={{ marginBottom: 20 }}>
        <p
          className="text-[11px] font-semibold tracking-wider uppercase"
          style={{ color: 'var(--text-tertiary)' }}
        >
          Blocks
        </p>
        <span
          className="text-[11px] rounded-full"
          style={{
            padding: '2px 8px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: 'var(--text-secondary)',
          }}
        >
          {container.blocks.length}
        </span>
      </div>

      {/* Block list */}
      <div className="flex flex-col flex-1" style={{ gap: 20 }}>
        <Reorder.Group
          as="div"
          axis="y"
          values={container.blocks}
          onReorder={onReorderBlocks}
          className="flex flex-col"
          style={{ gap: 20 }}
        >
          <AnimatePresence initial={false}>
            {container.blocks.map((block) => (
              <DraggableBlock
                key={block.id}
                block={block}
                isSelected={block.id === selectedBlockId}
                onSelect={() => onSelectBlock(block.id)}
                onUpdateLabel={(label) => onUpdateBlockLabel(block.id, label)}
                onDelete={() => onDeleteBlock(block.id)}
                onDuplicate={() => onDuplicateBlock(block.id)}
                onRegenerate={block.type === 'custom' ? (prompt) => onRegenerateBlock(block.id, prompt) : undefined}
              />
            ))}
          </AnimatePresence>
        </Reorder.Group>

        {/* Block input */}
        <AnimatePresence>
          {blockInputVisible && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={blockTransition}
            >
              <BlockInput
                onAdd={onAddBlock}
                onAddBlocks={onAddBlocks}
                onRemove={onRemoveBlock}
                existingBlocks={container.blocks}
                onDismiss={onDismissInput}
                placeholderIndex={container.blocks.length}
                onAddCustomBlock={onAddCustomBlock}
                customTemplates={customTemplates}
                containerType={container.type}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* New screen button */}
      <div style={{ marginTop: 16, paddingTop: 12, borderTop: '1px solid var(--border-outer)' }}>
        <button
          onClick={onCreateNext}
          className="w-full rounded-xl text-sm"
          style={{
            padding: '8px 16px',
            background: 'var(--glass-surface-2)',
            border: '1px solid var(--border-outer)',
            boxShadow: 'inset 0 0 0 1px var(--border-inner), inset 0 1px 0 0 var(--tint-blue)',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          <span>+ New screen</span>
          <kbd
            style={{
              fontSize: 9,
              padding: '1px 5px',
              borderRadius: 3,
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'var(--text-tertiary)',
              fontFamily: 'inherit',
              lineHeight: '16px',
            }}
          >
            {navigator.platform?.includes('Mac') ? '⌘' : 'Ctrl'}+↵
          </kbd>
        </button>
      </div>
    </div>
  );
}
