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
  manualNodes: Node[];
  setManualNodes: React.Dispatch<React.SetStateAction<Node[]>>;
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

  return { nodes: layoutedNodes, edges };
};

export function FlowChart({ nodes, edges, loading, setManualNodes }: FlowChartProps) {
  const [localNodes, setNodes, onNodesChange] = useNodesState([]);
  const [localEdges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isLayoutReady, setIsLayoutReady] = useState(false); // State to track layout readiness
  const [newEdge, setNewEdge] = useState<Connection | null>(null);
  const [edgeLabel, setEdgeLabel] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedElement, setSelectedElement] = useState<null | { id: string; type: 'node' | 'edge' }>(null);

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
    setIsLayoutReady(true); // Mark layout as ready
  }, [nodes, edges, setNodes, setEdges]);

  return (
    <Box
      sx={{
        position: 'relative',
        height: '100%',
        width: '100%',
        borderRadius: '0.5rem',
        overflow: 'hidden',
        backgroundColor: '#fafafa',
        border: '1px solid',
        borderColor: 'hsl(220 13% 91%)',
        boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
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
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(4px)',
            zIndex: 10,
          }}
        >
          <CircularProgress sx={{ color: 'hsl(220.9 39.3% 11%)' }} />
        </Box>
      )}

      {isLayoutReady && (
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
          <Background 
            color="hsl(220 13% 91%)" 
            gap={16}
            style={{ opacity: 0.5 }}
          />
          <Controls 
            style={{
              button: {
                backgroundColor: 'white',
                border: '1px solid hsl(220 13% 91%)',
                borderRadius: '0.375rem',
              }
            }}
          />
        </ReactFlow>
      )}

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            borderRadius: '0.5rem',
            border: '1px solid hsl(220 13% 91%)',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
          }
        }}
      >
        <MenuItem 
          onClick={handleDelete}
          sx={{
            color: '#dc2626',
            '&:hover': {
              backgroundColor: '#fef2f2',
            }
          }}
        >
          Delete
        </MenuItem>
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
            borderRadius: '0.5rem',
            border: '1px solid hsl(220 13% 91%)',
            boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
            width: '320px',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <h3 style={{ 
            margin: 0, 
            fontSize: '1.125rem', 
            fontWeight: 600,
            color: 'hsl(224 71.4% 4.1%)'
          }}>
            Name Your Edge
          </h3>
          <TextField
            label="Relationship Name"
            value={edgeLabel}
            onChange={(e) => setEdgeLabel(e.target.value)}
            size="small"
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '0.375rem',
              }
            }}
          />
          <Button
            variant="contained"
            onClick={handleAddEdge}
            disabled={!edgeLabel.trim()}
            sx={{
              backgroundColor: 'hsl(220.9 39.3% 11%)',
              borderRadius: '0.375rem',
              textTransform: 'none',
              '&:hover': {
                backgroundColor: 'hsl(220.9 39.3% 18%)',
              },
              '&:disabled': {
                backgroundColor: 'hsl(220 14.3% 95.9%)',
              }
            }}
          >
            Add Edge
          </Button>
        </Box>
      </Modal>
    </Box>
  );
}
