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
    <div className="h-screen w-full bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col relative">
      {/* Mobile Chat Toggle Button */}
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="md:hidden fixed top-4 right-4 z-50 w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      </button>

      <div className="flex-1 flex gap-4 p-4 overflow-hidden">
        {/* Chat Panel - Responsive */}
        <div
          className={`transition-all ${
            isChatOpen
              ? "fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-40 p-4"
              : "hidden md:flex md:w-[420px] md:flex-shrink-0"
          }`}
          onClick={(e) => {
            if (isChatOpen && e.target === e.currentTarget) {
              setIsChatOpen(false);
            }
          }}
        >
          <div
            className={`bg-white shadow-lg overflow-hidden ${
              isChatOpen ? "w-full max-w-md h-[90vh] rounded-2xl" : "w-full h-full card"
            }`}
          >
            <Chat
              generateDataModel={generateDataModel}
              mergeDataModel={mergeDataModel}
              setIsChatOpen={setIsChatOpen}
              fetchAIResponse={fetchAIResponse}
              isChatOpen={isChatOpen}
              loading={loading}
              setLoading={setLoading}
              resetNodesAndEdges={resetNodesAndEdges}
              schemaAddNodes={handleAddNode}
              manualNodes={manualNodes}
            />
          </div>
        </div>

        {/* FlowChart - Full Width */}
        <div className="flex-1 min-w-0">
          <FlowChart
            nodes={nodes}
            edges={edges}
            loading={loading}
            manualNodes={manualNodes}
            setManualNodes={setManualNodes}
          />
        </div>
      </div>
    </div>
  );
}
