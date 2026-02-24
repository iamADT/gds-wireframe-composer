import { useEffect } from 'react';

interface KeyboardActions {
  onCreateNextContainer: () => void;
  onDeleteSelectedBlock: () => void;
  onNavigateBlock: (direction: 'up' | 'down') => void;
}

export function useKeyboard(actions: KeyboardActions) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

      // Cmd+Enter — always available, creates next container
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        actions.onCreateNextContainer();
        return;
      }

      // Skip remaining shortcuts if user is typing in an input
      if (isInput) return;

      // Delete / Backspace — delete selected block
      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        actions.onDeleteSelectedBlock();
        return;
      }

      // Arrow up/down — navigate between blocks
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        actions.onNavigateBlock('up');
        return;
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        actions.onNavigateBlock('down');
        return;
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [actions]);
}
