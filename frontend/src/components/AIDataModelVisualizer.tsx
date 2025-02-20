import { useState } from "react";
import { FlowChart } from "./FlowChart";
import { Chat } from "./Chat";
import { useDataModelServices } from "./Services/Services";

export function AIDataModelVisualizer() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const {
    nodes,
    edges,
    loading,
    manualNodes,
    handleAddNode,
    fetchAIResponse,
    generateDataModel,
    resetNodesAndEdges,
    setLoading,
    setManualNodes,
    mergeDataModel,
  } = useDataModelServices();

  return (
    <div className="h-screen w-full p-4 bg-gray-100 flex flex-col relative">
      <h1 className="text-2xl font-bold mb-4 text-center sm:text-left">
        AI Data Model Visualizer
      </h1>

      {/* Chat Modal Button - Visible only on Mobile */}
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="md:hidden fixed top-4 left-4 mt-14 ml-4 px-5 py-3 text-sm text-white bg-blue-500 rounded hover:bg-blue-600 focus:ring-blue-500 z-50"
      >
        Open Chat
      </button>

      <div className="flex-grow flex gap-4">
        {/* Chat Panel - Hidden on Mobile, Shown on Desktop */}
        <div className="hidden md:block w-[70%] max-w-5xl">
          <Chat
            generateDataModel={generateDataModel}
            mergeDataModel={mergeDataModel}
            setIsChatOpen={setIsChatOpen}
            fetchAIResponse={fetchAIResponse}
            loading={loading}
            setLoading={setLoading}
            resetNodesAndEdges={resetNodesAndEdges}
            schemaAddNodes={handleAddNode}
            manualNodes={manualNodes}
          />
        </div>

        {/* FlowChart Full Width on Mobile, Shrunk on Desktop */}
        <div className="w-full md:flex-grow min-h-[300px] sm:min-h-0">
          <FlowChart
            nodes={nodes}
            edges={edges}
            loading={loading}
            manualNodes={manualNodes}
            setManualNodes={setManualNodes}
          />
        </div>
      </div>

      {/* Chat Modal - Visible only on Mobile */}
      {isChatOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">

          {/* Chat Content (Scrollable) */}
          <div className="flex-grow overflow-y-auto p-2 h-screen">
            <Chat           
              generateDataModel={generateDataModel}
              setIsChatOpen={setIsChatOpen}
              mergeDataModel={mergeDataModel}
              fetchAIResponse={fetchAIResponse}
              loading={loading}
              setLoading={setLoading}
              resetNodesAndEdges={resetNodesAndEdges}
              schemaAddNodes={handleAddNode}
              manualNodes={manualNodes}
            />
          </div>

          {/* Input & Generate Button */}
        </div>
      )}
    </div>
  );
}
