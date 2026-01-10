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
  const [copied, setCopied] = useState(false);

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
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Box
      sx={{
        border: "1px solid hsl(220 13% 91%)",
        borderRadius: "0.5rem",
        minWidth: flipped ? "320px" : "240px",
        backgroundColor: "white",
        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
        }
      }}
    >
      {/* Header */}
      <Box
        sx={{
          background: "linear-gradient(135deg, hsl(220.9 39.3% 11%) 0%, hsl(220.9 39.3% 18%) 100%)",
          color: "white",
          padding: "12px 16px",
          fontWeight: 600,
          fontSize: "0.875rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid hsl(220 13% 91%)",
        }}
      >
        <span style={{ letterSpacing: "0.025em" }}>{data.label}</span>
        <Button
          variant="text"
          size="small"
          onClick={() => setFlipped(!flipped)}
          sx={{
            fontSize: "0.75rem",
            padding: "4px 8px",
            minWidth: "unset",
            color: "white",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            borderRadius: "0.25rem",
            textTransform: "none",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.2)",
            }
          }}
        >
          {flipped ? "← Schema" : "SQL →"}
        </Button>
      </Box>

      {/* Content */}
      <Box
        sx={{
          padding: "12px 16px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          minHeight: "80px",
        }}
      >
        {flipped ? (
          <Box>
            <Typography
              variant="body2"
              component="pre"
              sx={{
                whiteSpace: "pre",
                fontFamily: "'Courier New', monospace",
                fontSize: "0.75rem",
                marginBottom: 2,
                padding: "12px",
                backgroundColor: "hsl(220 14.3% 95.9%)",
                borderRadius: "0.375rem",
                border: "1px solid hsl(220 13% 91%)",
                color: "hsl(224 71.4% 4.1%)",
                lineHeight: "1.6",
                overflow: "auto",
              }}
            >
              {sqlString}
            </Typography>
            <Button
              variant="contained"
              size="small"
              startIcon={<ContentCopyIcon sx={{ fontSize: "0.875rem" }} />}
              onClick={handleCopy}
              sx={{
                backgroundColor: copied ? "#10b981" : "hsl(220.9 39.3% 11%)",
                borderRadius: "0.375rem",
                textTransform: "none",
                fontSize: "0.75rem",
                padding: "6px 12px",
                "&:hover": {
                  backgroundColor: copied ? "#059669" : "hsl(220.9 39.3% 18%)",
                },
              }}
            >
              {copied ? "✓ Copied!" : "Copy SQL"}
            </Button>
          </Box>
        ) : (
          data.schema.map((column, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "6px 8px",
                backgroundColor: index % 2 === 0 ? "transparent" : "hsl(220 14.3% 95.9% / 0.3)",
                borderRadius: "0.25rem",
                transition: "background-color 0.15s ease-in-out",
                "&:hover": {
                  backgroundColor: "hsl(220 14.3% 95.9%)",
                }
              }}
            >
              <Typography 
                variant="body2" 
                sx={{ 
                  fontWeight: 500,
                  fontSize: "0.813rem",
                  color: "hsl(224 71.4% 4.1%)",
                }}
              >
                {column.name}
              </Typography>
              <Typography
                variant="body2"
                sx={{ 
                  color: "hsl(220 8.9% 46.1%)", 
                  fontFamily: "'Courier New', monospace",
                  fontSize: "0.75rem",
                  backgroundColor: "hsl(220 14.3% 95.9%)",
                  padding: "2px 6px",
                  borderRadius: "0.25rem",
                }}
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
        style={{ 
          background: "hsl(220.9 39.3% 11%)",
          width: "10px",
          height: "10px",
          border: "2px solid white",
        }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ 
          background: "hsl(220.9 39.3% 11%)",
          width: "10px",
          height: "10px",
          border: "2px solid white",
        }}
      />
    </Box>
  );
};

export default CustomNode;
