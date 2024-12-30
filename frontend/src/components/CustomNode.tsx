import { Handle, Position, NodeProps } from "reactflow";
import { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

interface CustomNodeData {
  label: string;
  schema: { name: string; type: string; constraints?: string }[];
}

const CustomNode = ({ data }: NodeProps<CustomNodeData>) => {
  const [flipped, setFlipped] = useState(false);
  const [copied, setCopied] = useState(false); // State for copy feedback

  // Generate SQL string
  const generateSQL = () => {
    const columns = data.schema
      .map((col) => {
        const constraints = col.constraints ? ` ${col.constraints}` : "";
        return `${col.name} ${col.type}${constraints}`;
      })
      .join(",\n  ");

    return `CREATE TABLE ${data.label} (\n  ${columns}\n);`;
  };

  const sqlString = generateSQL();

  const handleCopy = () => {
    navigator.clipboard.writeText(sqlString);
    setCopied(true); // Show 'Copied' feedback
    setTimeout(() => setCopied(false), 1000); // Reset feedback after 1 second
  };

  return (
    <Box
      sx={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        width: flipped ? "fit-content" : "220px",
        backgroundColor: flipped ? "#f0f0f0" : "#ffffff",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          backgroundColor: "#ffcc80",
          color: "#000",
          padding: "8px",
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTopLeftRadius: "8px",
          borderTopRightRadius: "8px",
        }}
      >
        <span>{data.label}</span>
        <Button
          variant="text"
          size="small"
          onClick={() => setFlipped(!flipped)}
          sx={{
            fontSize: "10px",
            padding: "2px 4px",
            minWidth: "unset",
          }}
        >
          {flipped ? "Back" : "SQL"}
        </Button>
      </Box>

      {/* Content */}
      <Box
        sx={{
          padding: "8px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        {flipped ? (
          <Box>
            <Typography
              variant="body2"
              component="pre"
              sx={{
                whiteSpace: "pre",
                fontFamily: "monospace",
                marginBottom: 2,
              }}
            >
              {sqlString}
            </Typography>
            <Button
              variant="contained"
              size="small"
              startIcon={<ContentCopyIcon />}
              onClick={handleCopy}
            >
              {copied ? "Copied!" : "Copy SQL"}
            </Button>
          </Box>
        ) : (
          data.schema.map((column, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {column.name}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "#888", fontStyle: "italic" }}
              >
                {column.type}
              </Typography>
            </Box>
          ))
        )}
      </Box>

      {/* ReactFlow Handles */}
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: "#555" }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: "#555" }}
      />
    </Box>
  );
};

export default CustomNode;
