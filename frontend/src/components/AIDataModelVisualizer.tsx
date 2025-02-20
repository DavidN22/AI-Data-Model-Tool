import { FlowChart } from './FlowChart';
import { Chat } from './Chat';
import { useDataModelServices } from './Services/Services';

export function AIDataModelVisualizer() {
  const {
    nodes,
    edges,
    loading,
    manualNodes,
    handleAddNode,
    generateDataModel,
    resetNodesAndEdges,
    setLoading,
    setManualNodes,
    mergeDataModel,
  } = useDataModelServices();

  return (
    <div className="h-screen w-full p-4 bg-gray-100 flex flex-col">
      <h1 className="text-2xl font-bold mb-4">AI Data Model Visualizer</h1>
      <div className="flex-grow flex gap-4">
        <div className="w-[40%] max-w-5xl">
          <Chat
            generateDataModel={generateDataModel}
            mergeDataModel={mergeDataModel}
            loading={loading}
            setLoading={setLoading}
            resetNodesAndEdges={resetNodesAndEdges}
            schemaAddNodes={handleAddNode}
            manualNodes={manualNodes}
          />
        </div>
        <div className="flex-grow">
          <FlowChart nodes={nodes} edges={edges} loading={loading}  manualNodes={manualNodes}
      setManualNodes={setManualNodes} />
        </div>
      </div>
    </div>
  );
}
