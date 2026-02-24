import { useCallback, useMemo, useState } from 'react';
import AppBar from './components/AppBar';
import LeftPanel from './components/LeftPanel';
import RightPanel from './components/RightPanel';
import ContainerCreator from './components/ContainerCreator';
import ContainerList from './components/ContainerList';
import Composer from './components/Composer';
import Preview from './components/Preview';
import ConfirmDialog from './components/ConfirmDialog';
import { useComposerStore } from './hooks/useComposerStore';
import { useKeyboard } from './hooks/useKeyboard';
import { getApiKey, generateBlockLayout } from './lib/generateBlock';

export default function App() {
  const store = useComposerStore();
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [view, setView] = useState<'current' | 'screens'>('current');

  const handleDeleteRequest = useCallback((id: string) => {
    const container = store.containers.find((c) => c.id === id);
    if (container && container.blocks.length > 0) {
      setPendingDeleteId(id);
    } else {
      store.deleteContainer(id);
    }
  }, [store.containers, store.deleteContainer]);

  const handleDeleteConfirm = useCallback(() => {
    if (pendingDeleteId) {
      store.deleteContainer(pendingDeleteId);
      setPendingDeleteId(null);
    }
  }, [pendingDeleteId, store.deleteContainer]);

  const navigateBlock = useCallback((direction: 'up' | 'down') => {
    const blocks = store.activeContainer?.blocks;
    if (!blocks || blocks.length === 0) return;

    if (!store.selectedBlockId) {
      store.setSelectedBlock(blocks[0].id);
      return;
    }

    const idx = blocks.findIndex((b) => b.id === store.selectedBlockId);
    if (idx === -1) return;

    const nextIdx = direction === 'up' ? Math.max(0, idx - 1) : Math.min(blocks.length - 1, idx + 1);
    store.setSelectedBlock(blocks[nextIdx].id);
  }, [store.activeContainer, store.selectedBlockId, store.setSelectedBlock]);

  const deleteSelected = useCallback(() => {
    if (store.selectedBlockId) {
      store.deleteBlock(store.selectedBlockId);
    }
  }, [store.selectedBlockId, store.deleteBlock]);

  const createNext = useCallback(() => {
    store.createContainer('screen');
  }, [store.createContainer]);

  const handleRegenerateBlock = useCallback(async (blockId: string, prompt: string) => {
    const key = getApiKey();
    if (!key) return;
    const container = store.activeContainer;
    if (!container) return;
    const block = container.blocks.find((b) => b.id === blockId);
    if (!block) return;
    try {
      const result = await generateBlockLayout(prompt, container.type, container.blocks);
      store.regenerateBlock(blockId, result.layout, prompt);
    } catch {
      // Silent fail — BlockInput handles error display for user-initiated generation
    }
  }, [store.activeContainer, store.regenerateBlock]);

  const keyboardActions = useMemo(() => ({
    onCreateNextContainer: createNext,
    onDeleteSelectedBlock: deleteSelected,
    onNavigateBlock: navigateBlock,
  }), [createNext, deleteSelected, navigateBlock]);

  useKeyboard(keyboardActions);

  return (
    <div className="h-full flex flex-col" style={{ background: 'var(--bg-0)' }}>
      <AppBar />
      <div className="flex flex-1 overflow-hidden" style={{ padding: 16, gap: 16 }}>
        <LeftPanel>
          {pendingDeleteId && (() => {
            const c = store.containers.find((x) => x.id === pendingDeleteId);
            return c ? (
              <ConfirmDialog
                containerName={c.name}
                blockCount={c.blocks.length}
                onConfirm={handleDeleteConfirm}
                onCancel={() => setPendingDeleteId(null)}
              />
            ) : null;
          })()}
          <ContainerCreator
            onCreate={(type) => { store.createContainer(type); setView('current'); }}
            showStart={store.containers.length === 0}
            view={view}
            onViewChange={setView}
          />
          {view === 'screens' && (
            <ContainerList
              containers={store.containers}
              activeContainerId={store.activeContainerId}
              onSelect={(id) => { store.setActiveContainer(id); setView('current'); }}
              onDelete={handleDeleteRequest}
            />
          )}
          {view === 'current' && store.activeContainer && (
            <Composer
              container={store.activeContainer}
              selectedBlockId={store.selectedBlockId}
              blockInputVisible={store.blockInputVisible}
              onAddBlock={store.addBlock}
              onAddBlocks={store.addBlocks}
              onRemoveBlock={store.removeLastBlockOfType}
              onSelectBlock={store.setSelectedBlock}
              onUpdateBlockLabel={store.updateBlockLabel}
              onDeleteBlock={store.deleteBlock}
              onDuplicateBlock={store.duplicateBlock}
              onDismissInput={() => store.setBlockInputVisible(false)}
              onReorderBlocks={(newBlocks) => store.reorderBlocks(store.activeContainer!.id, newBlocks)}
              onAddCustomBlock={store.addCustomBlock}
              customTemplates={store.customTemplates}
              onRegenerateBlock={handleRegenerateBlock}
            />
          )}
        </LeftPanel>

        <RightPanel>
          <Preview
            container={store.activeContainer}
            selectedBlockId={store.selectedBlockId}
            onSelectBlock={store.setSelectedBlock}
            onUpdateBlockLabel={store.updateBlockLabel}
            onUpdateBlockOptions={store.updateBlockOptions}
          />
        </RightPanel>
      </div>
    </div>
  );
}
