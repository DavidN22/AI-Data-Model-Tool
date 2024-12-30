import { Node, Edge } from 'reactflow';

export const initialNodes: Node[] = [
  {
    id: 'users',
    type: 'custom',
    data: {
      label: 'Example_Users',
      schema: [
        { name: 'id', type: 'UUID', constraints: 'PRIMARY KEY' },
        { name: 'name', type: 'VARCHAR(255)', constraints: 'NOT NULL' },
        { name: 'email', type: 'VARCHAR(255)', constraints: 'UNIQUE NOT NULL' },
        { name: 'created_at', type: 'TIMESTAMP', constraints: 'DEFAULT CURRENT_TIMESTAMP' },
      ],
    },
    position: { x: 100, y: 100 },
  },
  {
    id: 'orders',
    type: 'custom',
    data: {
      label: 'Example_Orders',
      schema: [
        { name: 'id', type: 'UUID', constraints: 'PRIMARY KEY' },
        { name: 'user_id', type: 'UUID', constraints: 'REFERENCES Example_Users(id) ON DELETE CASCADE' },
        { name: 'status', type: 'VARCHAR(50)', constraints: 'NOT NULL' },
        { name: 'total', type: 'DECIMAL(10, 2)', constraints: 'NOT NULL' },
        { name: 'created_at', type: 'TIMESTAMP', constraints: 'DEFAULT CURRENT_TIMESTAMP' },
      ],
    },
    position: { x: 400, y: 100 },
  },
  {
    id: 'products',
    type: 'custom',
    data: {
      label: 'Example_Products',
      schema: [
        { name: 'id', type: 'UUID', constraints: 'PRIMARY KEY' },
        { name: 'name', type: 'VARCHAR(255)', constraints: 'NOT NULL' },
        { name: 'description', type: 'TEXT', constraints: '' },
        { name: 'price', type: 'DECIMAL(10, 2)', constraints: 'NOT NULL' },
        { name: 'category_id', type: 'UUID', constraints: 'REFERENCES Example_Categories(id) ON DELETE CASCADE' },
      ],
    },
    position: { x: 700, y: 300 },
  },
  {
    id: 'categories',
    type: 'custom',
    data: {
      label: 'Example_Categories',
      schema: [
        { name: 'id', type: 'UUID', constraints: 'PRIMARY KEY' },
        { name: 'name', type: 'VARCHAR(255)', constraints: 'NOT NULL' },
        { name: 'created_at', type: 'TIMESTAMP', constraints: 'DEFAULT CURRENT_TIMESTAMP' },
      ],
    },
    position: { x: 1000, y: 300 },
  },
  {
    id: 'order_items',
    type: 'custom',
    data: {
      label: 'Example_Order_Items',
      schema: [
        { name: 'id', type: 'UUID', constraints: 'PRIMARY KEY' },
        { name: 'order_id', type: 'UUID', constraints: 'REFERENCES Example_Orders(id) ON DELETE CASCADE' },
        { name: 'product_id', type: 'UUID', constraints: 'REFERENCES Example_Products(id) ON DELETE CASCADE' },
        { name: 'quantity', type: 'INTEGER', constraints: 'NOT NULL' },
        { name: 'subtotal', type: 'DECIMAL(10, 2)', constraints: 'NOT NULL' },
      ],
    },
    position: { x: 400, y: 500 },
  },
];


  
  export const initialEdges: Edge[] = [
    {
      id: 'e1-2',
      source: 'users',
      target: 'orders',
      label: 'user_id',
    },
    {
      id: 'e2-5',
      source: 'orders',
      target: 'order_items',
      label: 'order_id',
    },
    {
      id: 'e3-5',
      source: 'products',
      target: 'order_items',
      label: 'product_id',
    },
    {
      id: 'e4-3',
      source: 'categories',
      target: 'products',
      label: 'category_id',
    },
  ];
