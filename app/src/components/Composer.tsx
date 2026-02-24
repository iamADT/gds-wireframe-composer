import { AnimatePresence, motion, Reorder, useDragControls } from 'framer-motion';
import type { DragControls } from 'framer-motion';
import type { Container, Block, BlockType } from '../types';
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
  onRepeat: (count: number) => void;
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
  onRemoveBlock: (type: BlockType) => void;
  onSelectBlock: (id: string | null) => void;
  onUpdateBlockLabel: (id: string, label: string) => void;
  onDeleteBlock: (id: string) => void;
  onDuplicateBlock: (id: string) => void;
  onRepeatBlock: (id: string, count: number) => void;
  onDismissInput: () => void;
  onReorderBlocks: (newBlocks: Block[]) => void;
}

export default function Composer({
  container,
  selectedBlockId,
  blockInputVisible,
  onAddBlock,
  onRemoveBlock,
  onSelectBlock,
  onUpdateBlockLabel,
  onDeleteBlock,
  onDuplicateBlock,
  onRepeatBlock,
  onDismissInput,
  onReorderBlocks,
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
                onRepeat={(count) => onRepeatBlock(block.id, count)}
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
                onRemove={onRemoveBlock}
                existingBlocks={container.blocks}
                onDismiss={onDismissInput}
                placeholderIndex={container.blocks.length}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Next screen hint */}
      <div style={{ marginTop: 16, paddingTop: 12, borderTop: '1px solid var(--border-outer)' }}>
        <p className="text-[11px] text-center" style={{ color: 'var(--text-tertiary)' }}>
          <kbd
            className="rounded text-[10px] font-mono"
            style={{
              padding: '2px 6px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            {navigator.platform?.includes('Mac') ? '⌘' : 'Ctrl'}+Enter
          </kbd>{' '}
          to create next screen
        </p>
      </div>
    </div>
  );
}
