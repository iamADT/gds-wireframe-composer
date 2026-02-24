import { useCallback, useEffect, useRef } from 'react';
import {
  ReactFlow,
  Background,
  useReactFlow,
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  ConnectionMode,
  type Connection,
  type Node,
  type Edge,
  type NodeChange,
  MarkerType,
} from '@xyflow/react';
import { nanoid } from 'nanoid';
import type { Container, CanvasNode, CanvasEdge } from '../types';
import ScreenNode from './ScreenNode';
import ShapeNode from './ShapeNode';
import StepEdge from './StepEdge';

const nodeTypes = { screen: ScreenNode, shape: ShapeNode };
const edgeTypes = { step: StepEdge };

interface Props {
  containers: Container[];
  canvasNodes: CanvasNode[];
  canvasEdges: CanvasEdge[];
  onNodePositionChange: (id: string, position: { x: number; y: number }) => void;
  onAddNode: (node: CanvasNode) => void;
  onRemoveNode: (id: string) => void;
  onAddEdge: (edge: CanvasEdge) => void;
  onUpdateEdgeLabel: (id: string, label: string) => void;
  onRemoveEdge: (id: string) => void;
  onRename: (id: string, name: string) => void;
  onOpenScreen: (id: string) => void;
}

function CanvasToolbar() {
  const { zoomIn, zoomOut, fitView } = useReactFlow();
  return (
    <div
      className="glass-elevated"
      style={{
        position: 'absolute',
        bottom: 16,
        right: 16,
        zIndex: 10,
        display: 'flex',
        gap: 4,
        padding: 6,
        borderRadius: 10,
      }}
    >
      {([
        { label: '+', action: () => zoomIn() },
        { label: '−', action: () => zoomOut() },
        { label: '⊡', action: () => fitView({ padding: 0.15 }) },
      ] as const).map(({ label, action }) => (
        <button
          key={label}
          onClick={action}
          style={{
            width: 28, height: 28,
            background: 'var(--glass-surface-2)',
            border: '1px solid var(--border-outer)',
            borderRadius: 6,
            color: 'var(--text-primary)',
            cursor: 'pointer',
            fontSize: 14,
            lineHeight: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function ConnectCanvasInner({
  containers, canvasNodes, canvasEdges,
  onNodePositionChange, onAddNode, onRemoveNode,
  onAddEdge, onUpdateEdgeLabel, onRemoveEdge,
  onRename, onOpenScreen,
}: Props) {
  const { screenToFlowPosition } = useReactFlow();

  // Use RF's own state so selection + keyboard deletion work correctly
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  // Stable refs for callbacks so effects don't re-run on every render
  const onOpenScreenRef = useRef(onOpenScreen);
  onOpenScreenRef.current = onOpenScreen;
  const onRenameRef = useRef(onRename);
  onRenameRef.current = onRename;
  const onAddNodeRef = useRef(onAddNode);
  onAddNodeRef.current = onAddNode;
  const onUpdateEdgeLabelRef = useRef(onUpdateEdgeLabel);
  onUpdateEdgeLabelRef.current = onUpdateEdgeLabel;

  // Sync store canvasNodes → RF nodes (add/remove/data update; preserve RF position during drag)
  useEffect(() => {
    setNodes((prev) => {
      const prevMap = new Map(prev.map((n) => [n.id, n]));
      return canvasNodes.map((storeNode) => {
        const data = storeNode.kind === 'screen'
          ? {
              container: containers.find((c) => c.id === storeNode.id),
              onOpen: (id: string) => onOpenScreenRef.current(id),
              onRename: (id: string, name: string) => onRenameRef.current(id, name),
            }
          : {
              shapeType: storeNode.shapeType,
              label: storeNode.label ?? '',
              onLabelChange: (label: string) => onAddNodeRef.current({ ...storeNode, label }),
            };
        const existing = prevMap.get(storeNode.id);
        if (existing) {
          // Keep RF's tracked position (may differ from store during drag), update data
          return { ...existing, data };
        }
        return {
          id: storeNode.id,
          type: storeNode.kind,
          position: storeNode.position,
          data,
          draggable: true,
        };
      });
    });
  }, [canvasNodes, containers]);

  // Sync store canvasEdges → RF edges
  useEffect(() => {
    setEdges((prev) => {
      const prevMap = new Map(prev.map((e) => [e.id, e]));
      return canvasEdges.map((storeEdge) => {
        const data = {
          label: storeEdge.label,
          onLabelChange: (label: string) => onUpdateEdgeLabelRef.current(storeEdge.id, label),
        };
        const existing = prevMap.get(storeEdge.id);
        if (existing) {
          return { ...existing, data };
        }
        return {
          id: storeEdge.id,
          source: storeEdge.source,
          sourceHandle: storeEdge.sourceHandle,
          target: storeEdge.target,
          targetHandle: storeEdge.targetHandle,
          type: 'step',
          markerEnd: { type: MarkerType.ArrowClosed, color: 'rgba(255,255,255,0.35)' },
          data,
        };
      });
    });
  }, [canvasEdges]);

  // Augment onNodesChange to sync position to store on drag end
  const handleNodesChange = useCallback((changes: NodeChange[]) => {
    onNodesChange(changes);
    for (const change of changes) {
      if (change.type === 'position' && change.dragging === false && change.position) {
        onNodePositionChange(change.id, change.position);
      }
    }
  }, [onNodesChange, onNodePositionChange]);

  // Keyboard deletion → sync to store
  const onNodesDelete = useCallback((deleted: Node[]) => {
    deleted.forEach((n) => onRemoveNode(n.id));
  }, [onRemoveNode]);

  const onEdgesDelete = useCallback((deleted: Edge[]) => {
    deleted.forEach((e) => onRemoveEdge(e.id));
  }, [onRemoveEdge]);

  const onConnect = useCallback((params: Connection) => {
    const edge: CanvasEdge = {
      id: nanoid(),
      source: params.source ?? '',
      sourceHandle: (params.sourceHandle ?? 'bottom') as CanvasEdge['sourceHandle'],
      target: params.target ?? '',
      targetHandle: (params.targetHandle ?? 'top') as CanvasEdge['targetHandle'],
    };
    onAddEdge(edge);
  }, [onAddEdge]);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const raw = e.dataTransfer.getData('application/rfnode');
    if (!raw) return;
    const data = JSON.parse(raw);
    const position = screenToFlowPosition({ x: e.clientX, y: e.clientY });
    onAddNode({
      id: data.id ?? nanoid(),
      kind: data.kind,
      shapeType: data.shapeType,
      position,
    });
  }, [screenToFlowPosition, onAddNode]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      onNodesChange={handleNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onNodesDelete={onNodesDelete}
      onEdgesDelete={onEdgesDelete}
      onDragOver={onDragOver}
      onDrop={onDrop}
      connectionMode={ConnectionMode.Loose}
      defaultViewport={{ x: 0, y: 0, zoom: 1 }}
      deleteKeyCode={['Backspace', 'Delete']}
      style={{ width: '100%', height: '100%' }}
    >
      <Background variant={'dots' as never} gap={20} size={1} color="rgba(255,255,255,0.08)" />
      <CanvasToolbar />
    </ReactFlow>
  );
}

export default function ConnectCanvas(props: Props) {
  return (
    <div
      className="glass-panel"
      style={{
        flex: 1,
        minWidth: 0,
        borderRadius: 16,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <ReactFlowProvider>
        <ConnectCanvasInner {...props} />
      </ReactFlowProvider>
    </div>
  );
}
