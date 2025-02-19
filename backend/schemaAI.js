import { SchemaType } from "@google/generative-ai";

// Define a correct JSON schema for AI response
const schema = {
  description: "Database Table Schema",
  type: SchemaType.OBJECT, // Top-level should be an object
  properties: {
    nodes: {
      type: SchemaType.ARRAY,
      description: "List of database tables",
      items: {
        type: SchemaType.OBJECT,
        properties: {
          id: { type: SchemaType.STRING, description: "Table ID" },
          type: { type: SchemaType.STRING, description: "Table type" },
          data: {
            type: SchemaType.OBJECT,
            properties: {
              label: { type: SchemaType.STRING, description: "Table Name" },
              schema: {
                type: SchemaType.ARRAY,
                description: "List of column definitions",
                items: {
                  type: SchemaType.OBJECT,
                  properties: {
                    name: { type: SchemaType.STRING, description: "Column Name" },
                    type: { type: SchemaType.STRING, description: "Data Type" },
                    constraints: { type: SchemaType.STRING, description: "Constraints" },
                  },
                  required: ["name", "type"],
                },
              },
            },
          },
          position: {
            type: SchemaType.OBJECT,
            properties: {
              x: { type: SchemaType.NUMBER, description: "X position" },
              y: { type: SchemaType.NUMBER, description: "Y position" },
            },
          },
        },
        required: ["id", "data"],
      },
    },
    edges: {
      type: SchemaType.ARRAY,
      description: "List of table relationships",
      items: {
        type: SchemaType.OBJECT,
        properties: {
          id: { type: SchemaType.STRING, description: "Edge ID" },
          source: { type: SchemaType.STRING, description: "Source Table" },
          target: { type: SchemaType.STRING, description: "Target Table" },
          label: { type: SchemaType.STRING, description: "Relationship Name" },
        },
        required: ["id", "source", "target"],
      },
    },
  },
  required: ["nodes", "edges"],
};

export const schemaAI = {
  schemaOne: schema,
};

