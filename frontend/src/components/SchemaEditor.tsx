import { useState, useRef, useEffect } from 'react';
import { Node } from 'reactflow';

interface Column {
  id: number;
  name: string;
  type: string;
  added: boolean;
}

interface SchemaEditorProps {
  manualNodes: Node[];
  onSubmit: (tableName: string, schema: { name: string; type: string }[]) => void;
  mergeDataModel: (manualNodes: Node[]) => void;
  loading: boolean;
}

export function SchemaEditor({ onSubmit, manualNodes, mergeDataModel, loading }: SchemaEditorProps) {
  const [tableName, setTableName] = useState('');
  const [columns, setColumns] = useState<Column[]>([]);
  const columnsContainerRef = useRef<HTMLDivElement>(null);

  const handleAddColumn = () => {
    setColumns((prevColumns) => [
      ...prevColumns,
      { id: Date.now(), name: '', type: 'UUID', added: true },
    ]);
  };

  const handleColumnChange = (id: number, field: 'name' | 'type', value: string) => {
    setColumns((prevColumns) =>
      prevColumns.map((col) =>
        col.id === id ? { ...col, [field]: value } : col
      )
    );
  };

  const handleDeleteColumn = (id: number) => {
    setColumns((prevColumns) => prevColumns.filter((col) => col.id !== id));
  };

  const handleSubmit = () => {
    if (!tableName) {
      alert('Table name is required');
      return;
    }

    const schema = columns.map(({ name, type }) => ({ name, type }));
    onSubmit(tableName, schema);
    setTableName('');
    setColumns([]);
  };

  const handleMergeWithAI = () => {
    mergeDataModel(manualNodes);
  };

  useEffect(() => {
    if (columnsContainerRef.current) {
      columnsContainerRef.current.scrollTop = columnsContainerRef.current.scrollHeight;
    }
  }, [columns]);

  return (
    <div className="flex flex-col h-full overflow-y-auto p-4 space-y-6">
      <div className="space-y-2">
        <label htmlFor="tableName" className="block font-medium text-gray-700">
          Table Name:
        </label>
        <input
          id="tableName"
          type="text"
          value={tableName}
          onChange={(e) => setTableName(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter table name"
        />
      </div>

      <div
        className="space-y-4 flex-grow overflow-y-auto border border-gray-200 p-2 rounded"
        ref={columnsContainerRef}
      >
        <h3 className="font-medium text-gray-700 flex items-center justify-between">
          Columns
          <button
            onClick={handleAddColumn}
            className="text-lg font-bold text-white bg-green-500 rounded-full w-8 h-8 flex items-center justify-center hover:bg-green-600 focus:ring-2 focus:ring-green-500"
          >
            +
          </button>
        </h3>
        {columns.map((column) => (
          <div
            key={column.id}
            className="flex items-center space-x-1 border-b border-gray-200 pb-2"
          >
            <input
              type="text"
              value={column.name}
              onChange={(e) =>
                handleColumnChange(column.id, 'name', e.target.value)
              }
              placeholder="Column Name"
              className="w-1/2 px-1 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={column.type}
              onChange={(e) =>
                handleColumnChange(column.id, 'type', e.target.value)
              }
              className="w-1/3 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ minWidth: '130px' }}
            >
              <option value="UUID">UUID</option>
              <option value="VARCHAR">VARCHAR</option>
              <option value="INTEGER">INTEGER</option>
              <option value="DECIMAL">DECIMAL</option>
              <option value="TEXT">TEXT</option>
              <option value="BOOLEAN">BOOLEAN</option>
              <option value="TIMESTAMP">TIMESTAMP</option>
            </select>
            <button
              onClick={() => handleDeleteColumn(column.id)}
              className="px-4 py-2 text-sm text-white bg-red-500 rounded hover:bg-red-600 focus:ring-2 focus:ring-red-500"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
      <button
  onClick={handleSubmit}
  className={`w-full px-4 py-2 text-white rounded focus:outline-none focus:ring-2 ${
    loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-500'
  }`}
  disabled={loading}
>
  {'Submit '}
</button>

<button
  onClick={handleMergeWithAI}
  className={`w-full px-4 py-2 text-white rounded focus:outline-none focus:ring-2 ${
    loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-purple-500 hover:bg-purple-600 focus:ring-purple-500'
  }`}
  disabled={loading}
>
  {loading ? 'Merging...' : 'Merge with current AI model (beta)'}
</button>

    </div>
  );
}
