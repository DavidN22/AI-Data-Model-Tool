import { useCallback, useEffect, useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Node,
  Edge,
} from 'reactflow';
import 'reactflow/dist/style.css';
import dagre from 'dagre';
import CustomNode from './CustomNode';
import { CircularProgress, Box, TextField, Button, Modal, Menu, MenuItem } from '@mui/material';


const nodeTypes = {
  custom: CustomNode,
};

interface FlowChartProps {
  nodes: Node[];
  edges: Edge[];
  loading: boolean;
  manualNodes: Node[]; // Add manualNodes
  setManualNodes: React.Dispatch<React.SetStateAction<Node[]>>; // Add setManualNodes
}

const getLayoutedElements = (nodes: Node[], edges: Edge[]) => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  dagreGraph.setGraph({
    rankdir: 'TB',
    ranksep: 200,
    nodesep: 300,
  });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: 200, height: 100 });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.position = {
      x: nodeWithPosition.x - nodeWithPosition.width / 2,
      y: nodeWithPosition.y - nodeWithPosition.height / 2,
    };
    return node;
  });

  const layoutedEdges = edges.map((edge) => ({
    ...edge,
    labelBgPadding: [8, 4],
    labelBgBorderRadius: 4,
  })) as Edge[];

  return { nodes: layoutedNodes, edges: layoutedEdges };
};

export function FlowChart({ nodes, edges, loading, setManualNodes }: FlowChartProps) {
  const [localNodes, setNodes, onNodesChange] = useNodesState(nodes);
  const [localEdges, setEdges, onEdgesChange] = useEdgesState(edges);
  const [newEdge, setNewEdge] = useState<Connection | null>(null);
  const [edgeLabel, setEdgeLabel] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Context menu state
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedElement, setSelectedElement] = useState<null | { id: string; type: 'node' | 'edge' }>(null);

  // SQL Modal State


  const onConnect = useCallback((params: Connection) => {
    setNewEdge(params);
    setIsModalOpen(true);
  }, []);

  const handleAddEdge = () => {
    if (newEdge) {
      setEdges((eds) =>
        addEdge({ ...newEdge, label: edgeLabel }, eds)
      );
      setEdgeLabel('');
      setIsModalOpen(false);
    }
  };

  const handleModalClose = () => {
    setEdgeLabel('');
    setIsModalOpen(false);
  };

  const handleNodeContextMenu = (event: React.MouseEvent, node: Node) => {
    event.preventDefault();
    setSelectedElement({ id: node.id, type: 'node' });
    setMenuAnchor(event.currentTarget as HTMLElement);
  };

  const handleEdgeContextMenu = (event: React.MouseEvent, edge: Edge) => {
    event.preventDefault();
    setSelectedElement({ id: edge.id, type: 'edge' });
    setMenuAnchor(event.currentTarget as HTMLElement);
  };

  const handleDelete = () => {
    if (selectedElement?.type === 'node') {
      const nodeId = selectedElement.id;

      setNodes((nds) => nds.filter((node) => node.id !== nodeId));
      setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));

      setManualNodes((prevManualNodes) => prevManualNodes.filter((node) => node.id !== nodeId));
    } else if (selectedElement?.type === 'edge') {
      setEdges((eds) => eds.filter((edge) => edge.id !== selectedElement.id));
    }

    setMenuAnchor(null);
    setSelectedElement(null);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedElement(null);
  };


  useEffect(() => {
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      nodes,
      edges
    );
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
  }, [nodes, edges, setNodes, setEdges]);

  return (
    <Box
      sx={{
        position: 'relative',
        height: '100%',
        width: '100%',
        border: '1px solid #ddd',
        borderRadius: 2,
        backgroundColor: '#f9f9f9',
      }}
    >
      {loading && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            zIndex: 10,
          }}
        >
          <CircularProgress />
        </Box>
      )}
      <ReactFlow
        nodes={localNodes}
        edges={localEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeContextMenu={handleNodeContextMenu}
        onEdgeContextMenu={handleEdgeContextMenu}
        fitView
        nodeTypes={nodeTypes}
      >
        <Background color="#aaa" gap={16} />
        <Controls />
      </ReactFlow>

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleDelete}>Delete</MenuItem>
      </Menu>

      <Modal open={isModalOpen} onClose={handleModalClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            p: 4,
            backgroundColor: 'white',
            borderRadius: 1,
            boxShadow: 24,
            width: '300px',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <h3>Name your edge</h3>
          <TextField
            label="Edge Name"
            value={edgeLabel}
            onChange={(e) => setEdgeLabel(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddEdge}
            disabled={!edgeLabel.trim()}
          >
            Add Edge
          </Button>
        </Box>
      </Modal>
    </Box>
  );
}
