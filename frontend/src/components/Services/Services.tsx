import  { useState,useEffect } from 'react';
import { Node, Edge } from 'reactflow';
import { initialNodes, initialEdges } from './InitialNodes';


  export const useDataModelServices = () => {
    const [nodes, setNodes] = useState<Node[]>(initialNodes);
    const [edges, setEdges] = useState<Edge[]>(initialEdges);
    const [loading, setLoading] = useState(false);
    const [isFirstAdd, setIsFirstAdd] = useState(true);
    const [manualNodes, setManualNodes] = useState<Node[]>([]);
    const [aiNodes, setAiNodes] = useState<Node[]>([]); 
   useEffect(() => {
}, [manualNodes]);


    const handleAddNode = (tableName: string, schema: { name: string; type: string }[]) => {
  
      const newNode: Node = {
        id: tableName.toLowerCase().replace(/\s+/g, '_'),
        type: 'custom',
        data: {
          label: tableName,
          schema,
        },
        position: {
          x: Math.random() * 600,
          y: Math.random() * 400,
        },
      };
      setManualNodes((prevManualNodes) => {
        const updatedManualNodes = [...prevManualNodes, newNode];
        setNodes([...aiNodes, ...updatedManualNodes]); // Merge AI and manual nodes
        return updatedManualNodes;
      });;
      setIsFirstAdd(false);
    };
  const mergeDataModel = async () => { 
    setLoading(true);
    try {
      const message = `${JSON.stringify(manualNodes)}`

    const response = await fetch('https://ai-data-model-tool-backend-davidn22s-projects.vercel.app/api/googleAi/merge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
      credentials: 'include',
    });

      if (response.ok) {
        const data = await response.json();
        const mergedNodes = data.nodes.map((node: Node) => ({
          ...node,
          type: 'custom',
        }));
        const mergedEdges = data.edges;
        setAiNodes(mergedNodes);
        setManualNodes([]);
        setNodes(mergedNodes);
        setEdges(mergedEdges);
        setIsFirstAdd(false);

      } else {
        console.error('Failed to merge data model');
        throw new Error('Failed to merge data model');
      }
    } catch (error) {
      console.error('Error during data model merge:', error);
      throw error;
    } finally {
      setLoading(false);
    }



  }
    const generateDataModel = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://ai-data-model-tool-backend-davidn22s-projects.vercel.app/api/googleAi/googleGenerate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });
    
        if (response.ok) {
          const data = await response.json();
          const aiGeneratedNodes = data.nodes.map((node: Node) => ({
            ...node,
            type: 'custom',
          }));
          const aiGeneratedEdges = data.edges;
    
          setAiNodes(aiGeneratedNodes);
          setManualNodes([]);
          setNodes(aiGeneratedNodes);
          setEdges(aiGeneratedEdges);
          setIsFirstAdd(false);
        } else {
          console.error('Failed to fetch data model');
          throw new Error('Failed to fetch data model');
        }
      } catch (error) {
        console.error('Error during data model generation:', error);
        throw error;
      } finally {
        setLoading(false);
      }
    };
  
    const resetNodesAndEdges = () => {
      setNodes([]);
      setEdges([]);
      setManualNodes([]);
      setIsFirstAdd(true);
    };

    const fetchAIResponse = async (input: string, manualNodes: Node[], onData: (chunk: string) => void) => {
      try {
        const message = manualNodes.length > 0
          ? `${input} this is a new node/nodes that were manually added ${JSON.stringify(manualNodes)}`
          : input;
    
        const response = await fetch('https://ai-data-model-tool-backend-davidn22s-projects.vercel.app/api/googleAi', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message }),
          credentials: 'include',
        });
    
        if (!response.ok || !response.body) {
          throw new Error('Failed to fetch AI response');
        }
    
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
    
        let finalResponse = "";
    
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
    
          const chunk = decoder.decode(value, { stream: true });
          finalResponse += chunk;
          onData(chunk); // Update UI incrementally
        }
    
        return finalResponse.trim();
      } catch (error) {
        console.error("Error fetching AI response:", error);
        throw error;
      }
    };
    
   
    return {
      nodes,
      edges,
      loading,
      isFirstAdd,
      manualNodes,
      handleAddNode,
      mergeDataModel,
      generateDataModel,
      fetchAIResponse,
      resetNodesAndEdges,
      setLoading,
      setManualNodes,
    };
  };
 