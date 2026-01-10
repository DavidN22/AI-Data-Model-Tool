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
    <div className="flex flex-col h-full space-y-4">
      {/* Table Name Input */}
      <div className="space-y-2">
        <label htmlFor="tableName" className="block text-sm font-medium text-foreground">
          Table Name
        </label>
        <input
          id="tableName"
          type="text"
          value={tableName}
          onChange={(e) => setTableName(e.target.value)}
          className="input w-full"
          placeholder="users"
        />
      </div>

      {/* Columns Section */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-foreground">
            Columns
          </label>
          <button
            onClick={handleAddColumn}
            className="btn btn-secondary h-8 px-3 text-sm"
          >
            <span className="text-lg leading-none mr-1">+</span> Add Column
          </button>
        </div>
        
        <div
          className="flex-1 overflow-y-auto space-y-2 border rounded-lg p-3 bg-muted/30"
          ref={columnsContainerRef}
        >
          {columns.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              No columns yet. Click "Add Column" to get started.
            </div>
          ) : (
            columns.map((column) => (
              <div
                key={column.id}
                className="flex items-center gap-2 p-3 bg-white rounded-md border shadow-sm hover:shadow-md transition-shadow"
              >
                <input
                  type="text"
                  value={column.name}
                  onChange={(e) =>
                    handleColumnChange(column.id, 'name', e.target.value)
                  }
                  placeholder="column_name"
                  className="input flex-1 h-9 text-sm"
                />
                <select
                  value={column.type}
                  onChange={(e) =>
                    handleColumnChange(column.id, 'type', e.target.value)
                  }
                  className="h-9 px-3 text-sm rounded-md border bg-background hover:bg-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring w-32"
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
                  className="btn btn-ghost h-9 px-3 text-sm text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2 pt-2 border-t">
        <button
          onClick={handleSubmit}
          className={`btn w-full h-10 ${
            loading ? 'bg-muted text-muted-foreground cursor-not-allowed' : 'btn-primary'
          }`}
          disabled={loading}
        >
          {loading ? '⏳ Adding...' : '➕ Add Table'}
        </button>

        <button
          onClick={handleMergeWithAI}
          className={`btn w-full h-10 ${
            loading 
              ? 'bg-muted text-muted-foreground cursor-not-allowed' 
              : 'bg-purple-600 text-white hover:bg-purple-700'
          }`}
          disabled={loading}
        >
          {loading ? '⏳ Merging...' : '🔗 Merge with AI Model (beta)'}
        </button>
      </div>
    </div>
  );
}
