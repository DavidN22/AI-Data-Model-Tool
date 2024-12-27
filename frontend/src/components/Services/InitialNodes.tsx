import { Node, Edge } from 'reactflow';


export const initialNodes: Node[] = [
    {
      id: 'users',
      type: 'custom',
      data: {
        label: 'Example_Users',
        schema: [
          { name: 'id', type: 'UUID' },
          { name: 'name', type: 'VARCHAR' },
          { name: 'email', type: 'VARCHAR' },
          { name: 'created_at', type: 'TIMESTAMP' },
        ],
      },
      position: { x: 0, y: 0 },
    },
    {
      id: 'orders',
      type: 'custom',
      data: {
        label: 'Example_Orders',
        schema: [
          { name: 'id', type: 'UUID' },
          { name: 'user_id', type: 'UUID' },
          { name: 'status', type: 'VARCHAR' },
          { name: 'total', type: 'DECIMAL' },
          { name: 'created_at', type: 'TIMESTAMP' },
        ],
      },
      position: { x: 300, y: 200 },
    },
    {
      id: 'products',
      type: 'custom',
      data: {
        label: 'Example_Products',
        schema: [
          { name: 'id', type: 'UUID' },
          { name: 'name', type: 'VARCHAR' },
          { name: 'description', type: 'TEXT' },
          { name: 'price', type: 'DECIMAL' },
          { name: 'category_id', type: 'UUID' },
        ],
      },
      position: { x: 600, y: 400 },
    },
    {
      id: 'categories',
      type: 'custom',
      data: {
        label: 'Example_Categories',
        schema: [
          { name: 'id', type: 'UUID' },
          { name: 'name', type: 'VARCHAR' },
          { name: 'created_at', type: 'TIMESTAMP' },
        ],
      },
      position: { x: 900, y: 600 },
    },
    {
      id: 'order_items',
      type: 'custom',
      data: {
        label: 'Example_Order Items',
        schema: [
          { name: 'id', type: 'UUID' },
          { name: 'order_id', type: 'UUID' },
          { name: 'product_id', type: 'UUID' },
          { name: 'quantity', type: 'INTEGER' },
          { name: 'subtotal', type: 'DECIMAL' },
        ],
      },
      position: { x: 300, y: 600 },
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
