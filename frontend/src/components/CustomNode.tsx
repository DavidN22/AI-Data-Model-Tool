import { Handle, Position, NodeProps } from 'reactflow';

interface CustomNodeData {
  label: string;
  schema: { name: string; type: string }[];
}

const CustomNode = ({ data }: NodeProps<CustomNodeData>) => {
  return (
    <div
      style={{
        border: '1px solid #ddd',
        borderRadius: '8px',
        width: '220px',
        fontSize: '12px',
        backgroundColor: '#ffffff',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      }}
    >
      {/* Header */}
      <div
        style={{
          backgroundColor: '#ffcc80',
          color: '#000',
          padding: '8px',
          fontWeight: 'bold',
          textAlign: 'center',
          borderTopLeftRadius: '8px',
          borderTopRightRadius: '8px',
        }}
      >
        {data.label}
      </div>

      {/* Schema Details */}
      <div style={{ padding: '8px' }}>
        {data.schema.map((column, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '4px',
            }}
          >
            <span style={{ fontWeight: 500 }}>{column.name}</span>
            <span style={{ color: '#888', fontStyle: 'italic' }}>
              {column.type}
            </span>
          </div>
        ))}
      </div>

      {/* ReactFlow Handles */}
      <Handle type="target" position={Position.Top} style={{ background: '#555' }} />
      <Handle type="source" position={Position.Bottom} style={{ background: '#555' }} />
    </div>
  );
};

export default CustomNode;
