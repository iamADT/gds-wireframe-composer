import { useState, useCallback } from 'react';
import { nanoid } from 'nanoid';
import type { Container, ContainerType, Block, BlockType } from '../types';
import { BLOCK_TYPES } from '../types';

function expandMacro(macroType: BlockType): Block[] {
  switch (macroType) {
    case 'form':
      return [
        { id: nanoid(), type: 'h1',        label: 'Enter your name' },
        { id: nanoid(), type: 'text-input', label: 'Full name' },
        { id: nanoid(), type: 'button',     label: 'Continue' },
      ];
    case 'question':
      return [
        { id: nanoid(), type: 'h1',     label: 'Are you sure?' },
        { id: nanoid(), type: 'radios', label: 'Are you sure?', options: ['Yes', 'No'] },
        { id: nanoid(), type: 'button', label: 'Continue' },
      ];
    default:
      return [];
  }
}

function getNextContainerName(containers: Container[], type: ContainerType): string {
  const count = containers.filter((c) => c.type === type).length + 1;
  return type === 'screen' ? `Screen ${count}` : `Modal ${count}`;
}

function renumberContainers(containers: Container[]): Container[] {
  const screenCount = { current: 0 };
  const modalCount = { current: 0 };

  return containers.map((c) => {
    if (c.type === 'screen') {
      screenCount.current++;
      return { ...c, name: `Screen ${screenCount.current}` };
    } else {
      modalCount.current++;
      return { ...c, name: `Modal ${modalCount.current}` };
    }
  });
}

export interface ComposerStore {
  containers: Container[];
  activeContainerId: string | null;
  selectedBlockId: string | null;
  blockInputVisible: boolean;
  blockInputValue: string;

  activeContainer: Container | null;

  createContainer: (type: ContainerType) => void;
  deleteContainer: (id: string) => void;
  setActiveContainer: (id: string) => void;
  switchContainerType: (id: string) => void;

  addBlock: (blockType: BlockType) => void;
  removeLastBlockOfType: (blockType: BlockType) => void;
  updateBlockLabel: (blockId: string, label: string) => void;
  updateBlockOptions: (blockId: string, options: string[]) => void;
  deleteBlock: (blockId: string) => void;
  duplicateBlock: (blockId: string) => void;
  repeatBlock: (blockId: string, count: number) => void;
  setSelectedBlock: (blockId: string | null) => void;

  reorderBlocks: (containerId: string, newBlocks: Block[]) => void;

  setBlockInputVisible: (visible: boolean) => void;
  setBlockInputValue: (value: string) => void;
}

export function useComposerStore(): ComposerStore {
  const [containers, setContainers] = useState<Container[]>([]);
  const [activeContainerId, setActiveContainerId] = useState<string | null>(null);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [blockInputVisible, setBlockInputVisible] = useState(false);
  const [blockInputValue, setBlockInputValue] = useState('');

  const activeContainer = containers.find((c) => c.id === activeContainerId) ?? null;

  const createContainer = useCallback((type: ContainerType) => {
    const id = nanoid();
    setContainers((prev) => {
      const name = getNextContainerName(prev, type);
      return [...prev, { id, type, name, blocks: [] }];
    });
    setActiveContainerId(id);
    setSelectedBlockId(null);
    setBlockInputVisible(true);
    setBlockInputValue('');
  }, []);

  const deleteContainer = useCallback((id: string) => {
    setContainers((prev) => {
      const next = renumberContainers(prev.filter((c) => c.id !== id));
      return next;
    });
    setActiveContainerId((prev) => {
      if (prev === id) {
        const remaining = containers.filter((c) => c.id !== id);
        return remaining.length > 0 ? remaining[0].id : null;
      }
      return prev;
    });
  }, [containers]);

  const setActiveContainerCb = useCallback((id: string) => {
    setActiveContainerId(id);
    setSelectedBlockId(null);
    setBlockInputVisible(true);
    setBlockInputValue('');
  }, []);

  const switchContainerType = useCallback((id: string) => {
    setContainers((prev) => {
      const updated = prev.map((c) =>
        c.id === id ? { ...c, type: (c.type === 'screen' ? 'modal' : 'screen') as ContainerType } : c
      );
      return renumberContainers(updated);
    });
  }, []);

  const addBlock = useCallback((blockType: BlockType) => {
    const info = BLOCK_TYPES.find((b) => b.type === blockType);
    if (!info) return;

    const newBlocks: Block[] = info.isMacro
      ? expandMacro(blockType)
      : [{
          id: nanoid(),
          type: blockType,
          label: info.defaultLabel,
          ...(blockType === 'radios' ? { options: ['England', 'Scotland', 'Wales'] } : {}),
          ...(blockType === 'accordion' ? { options: ['Section 1', 'Section 2', 'Section 3'] } : {}),
          ...(blockType === 'tabs' ? { options: ['Tab 1', 'Tab 2', 'Tab 3'] } : {}),
          ...(blockType === 'task-list' ? { options: ['Check eligibility', 'Prepare documents', 'Submit application'] } : {}),
          ...(blockType === 'service-nav' ? { options: [] } : {}),
        }];

    setContainers((prev) =>
      prev.map((c) =>
        c.id === activeContainerId
          ? { ...c, blocks: [...c.blocks, ...newBlocks] }
          : c
      )
    );

    const lastBlock = newBlocks[newBlocks.length - 1];
    setSelectedBlockId(lastBlock.id);
    setBlockInputValue('');
  }, [activeContainerId]);

  const removeLastBlockOfType = useCallback((blockType: BlockType) => {
    setContainers((prev) =>
      prev.map((c) => {
        if (c.id !== activeContainerId) return c;
        const lastIdx = c.blocks.reduce<number>((found, b, i) =>
          b.type === blockType ? i : found, -1);
        if (lastIdx === -1) return c;
        const blocks = [...c.blocks];
        blocks.splice(lastIdx, 1);
        return { ...c, blocks };
      })
    );
  }, [activeContainerId]);

  const updateBlockOptions = useCallback((blockId: string, options: string[]) => {
    setContainers((prev) =>
      prev.map((c) => ({
        ...c,
        blocks: c.blocks.map((b) => (b.id === blockId ? { ...b, options } : b)),
      }))
    );
  }, []);

  const updateBlockLabel = useCallback((blockId: string, label: string) => {
    setContainers((prev) =>
      prev.map((c) => ({
        ...c,
        blocks: c.blocks.map((b) => (b.id === blockId ? { ...b, label } : b)),
      }))
    );
  }, []);

  const deleteBlock = useCallback((blockId: string) => {
    setContainers((prev) =>
      prev.map((c) => {
        if (!c.blocks.some((b) => b.id === blockId)) return c;
        const filtered = c.blocks.filter((b) => b.id !== blockId);
        return { ...c, blocks: filtered };
      })
    );
    setSelectedBlockId((prev) => (prev === blockId ? null : prev));
  }, []);

  const duplicateBlock = useCallback((blockId: string) => {
    setContainers((prev) =>
      prev.map((c) => {
        const idx = c.blocks.findIndex((b) => b.id === blockId);
        if (idx === -1) return c;
        const original = c.blocks[idx];
        const copy: Block = { ...original, id: nanoid() };
        const blocks = [...c.blocks];
        blocks.splice(idx + 1, 0, copy);
        return { ...c, blocks };
      })
    );
  }, []);

  const repeatBlock = useCallback((blockId: string, count: number) => {
    setContainers((prev) =>
      prev.map((c) => {
        const idx = c.blocks.findIndex((b) => b.id === blockId);
        if (idx === -1) return c;
        const original = c.blocks[idx];
        const copies: Block[] = Array.from({ length: count }, () => ({
          ...original,
          id: nanoid(),
        }));
        const blocks = [...c.blocks];
        blocks.splice(idx + 1, 0, ...copies);
        return { ...c, blocks };
      })
    );
  }, []);

  const setSelectedBlockCb = useCallback((blockId: string | null) => {
    setSelectedBlockId(blockId);
  }, []);

  const setBlockInputVisibleCb = useCallback((visible: boolean) => {
    setBlockInputVisible(visible);
    if (visible) setBlockInputValue('');
  }, []);

  const reorderBlocks = useCallback((containerId: string, newBlocks: Block[]) => {
    setContainers((prev) =>
      prev.map((c) => c.id === containerId ? { ...c, blocks: newBlocks } : c)
    );
  }, []);

  const setBlockInputValueCb = useCallback((value: string) => {
    setBlockInputValue(value);
  }, []);

  return {
    containers,
    activeContainerId,
    selectedBlockId,
    blockInputVisible,
    blockInputValue,

    activeContainer,

    createContainer,
    deleteContainer,
    setActiveContainer: setActiveContainerCb,
    switchContainerType,

    addBlock,
    removeLastBlockOfType,
    updateBlockLabel,
    updateBlockOptions,
    deleteBlock,
    duplicateBlock,
    repeatBlock,
    setSelectedBlock: setSelectedBlockCb,

    reorderBlocks,

    setBlockInputVisible: setBlockInputVisibleCb,
    setBlockInputValue: setBlockInputValueCb,
  };
}
