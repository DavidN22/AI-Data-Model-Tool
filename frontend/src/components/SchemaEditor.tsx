import { useState, useRef, useEffect } from 'react';

interface Column {
  id: number;
  name: string;
  type: string;
}

interface SchemaEditorProps {
  onSubmit: (tableName: string, schema: { name: string; type: string }[]) => void;
}

export function SchemaEditor({ onSubmit }: SchemaEditorProps) {
  const [tableName, setTableName] = useState('');
  const [columns, setColumns] = useState<Column[]>([]);

  const columnsContainerRef = useRef<HTMLDivElement>(null);

  const handleAddColumn = () => {
    setColumns((prevColumns) => [
      ...prevColumns,
      { id: Date.now(), name: '', type: 'UUID' },
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
        <h3 className="font-medium text-gray-700">Columns:</h3>
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

      <div className="flex space-x-4">
        <button
          onClick={handleAddColumn}
          className="px-6 py-2 text-white bg-green-500 rounded hover:bg-green-600 focus:ring-2 focus:ring-green-500"
        >
          Add Column
        </button>
        <button
          onClick={handleSubmit}
          className="px-6 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 focus:ring-2 focus:ring-blue-500"
        >
          Submit
        </button>
      </div>
    </div>
  );
}
