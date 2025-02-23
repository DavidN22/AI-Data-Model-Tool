import React, { useState, useRef, FormEvent } from "react";
import { SchemaEditor } from "./SchemaEditor";
import { Node } from "reactflow";
import { HowToUseModal } from "./HowToUseModal";
import TypingIndicator from "./CustomTypingIndicator";
import { useChat } from "./global/ChatContext";
interface ChatProps {
  generateDataModel: () => void;
  mergeDataModel: (arg: Node[]) => void;
  fetchAIResponse: (
    input: string,
    manualNodes: Node[],
    onData: (chunk: string) => void
  ) => Promise<string>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  resetNodesAndEdges: () => void;
  schemaAddNodes: (
    tableName: string,
    schema: { name: string; type: string }[]
  ) => void;
  manualNodes: Node[];
  setIsChatOpen: (arg: boolean) => void;
  isChatOpen: boolean;
}

interface Message {
  id: number;
  content: string;
  role: "user" | "assistant";
}

export function Chat({
  setIsChatOpen,
  generateDataModel,
  isChatOpen,
  mergeDataModel,
  loading,
  resetNodesAndEdges,
  schemaAddNodes,
  manualNodes,
  fetchAIResponse,
}: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [showSchemaEditor, setShowSchemaEditor] = useState(false);
  const [showHowToUse, setShowHowToUse] = useState(false); // State to control the modal
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  const { clearChat } = useChat();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsTyping(true);
    if (!input.trim()) return;

    //scroll to bottom
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 150);

    // Append user message
    const userMessage: Message = {
      id: messages.length,
      content: input,
      role: "user",
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput(""); // Clear input field
    setChatLoading(true);

    // Create an assistant message placeholder and append it to the state first
    const assistantMessageId = messages.length + 1;
    setMessages((prev) => [
      ...prev,
      { id: assistantMessageId, content: "", role: "assistant" },
    ]);

    try {
      await fetchAIResponse(input, manualNodes, (chunk) => {
        setIsTyping(false);
        setMessages((prevMessages) => {
          return prevMessages.map((msg) =>
            msg.id === assistantMessageId
              ? { ...msg, content: msg.content + chunk } // Directly append the new chunk
              : msg
          );
        });
      });
    } catch (error) {
      console.error("Error fetching AI response:", error);
    } finally {
      setChatLoading(false);
    }
  };

  const handleClear = async () => {
    try {
      resetNodesAndEdges();
      clearChat();
      const response = await fetch(
        "https://ai-data-model-tool-backend-davidn22s-projects.vercel.app/api/googleAi/clear",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );

      if (response.ok) {
        setMessages([]);
      } else {
        console.error("Failed to clear chat history");
      }
    } catch (error) {
      console.error("Error clearing chat history:", error);
    }
  };

  return (
    <div className="flex flex-col h-full border border-gray-200 rounded-lg bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="hidden md:block text-lg font-semibold text-gray-700">
          {showSchemaEditor ? "Editor" : "AI Chat"}
        </h2>

        <div className="flex space-x-2">
          <button
            onClick={() => setShowHowToUse(true)} // Show the instructions modal
            className="px-4 py-2 text-sm text-white bg-green-500 rounded hover:bg-green-600 focus:ring-2 focus:ring-green-500"
          >
            How to Use
          </button>
          <button
            onClick={() => setShowSchemaEditor(!showSchemaEditor)}
            className="px-4 py-2 text-sm text-white bg-blue-500 rounded hover:bg-blue-600 focus:ring-2 focus:ring-blue-500"
          >
            {showSchemaEditor ? "Switch to Chat" : "Switch to Input"}
          </button>
          <button
            onClick={handleClear}
            className="px-4 py-2 text-sm text-white bg-red-500 rounded hover:bg-red-600 focus:ring-2 focus:ring-red-500"
          >
            {showSchemaEditor ? "Clear All" : "Clear All"}
          </button>
          <button
            onClick={() => setIsChatOpen(false)}
            className="block md:hidden px-4 py-2 text-sm text-white bg-red-500 rounded hover:bg-red-600 focus:ring-2 focus:ring-red-500"
          >
            {showSchemaEditor ? "Close" : "Close"}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div
        className="flex-grow overflow-y-auto p-4 "
        style={{ height: "400px", overflowY: "auto" }}
      >
        {showSchemaEditor ? (
          <SchemaEditor
            onSubmit={schemaAddNodes}
            manualNodes={manualNodes}
            mergeDataModel={mergeDataModel}
            loading={loading}
          />
        ) : (
          <>
            {/* Chat Messages */}
            {messages.map((m, index) => {
  const isLastAssistantMessage =
    m.role !== "user" && index === messages.length - 1;
  const isFirstAssistantMessage =
    m.role !== "user" && messages.findIndex((msg) => msg.role !== "user") === index;

  return (
    <div
      key={m.id}
      className={`flex ${
        m.role === "user" ? "justify-end" : "justify-center"
      } ${m.role !== "user" && index > 0 ? "mt-4" : ""}`}
    >
    <div
      className={`whitespace-pre-wrap rounded-lg px-6 py-3 ${
        m.role === "user"
          ? "bg-blue-100 text-blue-900 text-right max-w-[70%]"
          : `text-left md:max-w-[75%] min-w-[100%] w-auto ${
              isLastAssistantMessage && !isFirstAssistantMessage
                ? isChatOpen
                  ? "min-h-[63vh]"
                  : "min-h-[530px]"
                : "min-h-[100px]"
            }`
      }`}
      >
      <span
        dangerouslySetInnerHTML={{
          __html: m.content
            .replace(/\\/g, "")
            .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
            .replace(/`([^`]*)`/g, "<strong>$1</strong>"),
        }}
      ></span>

      {/* Show Typing Indicator next to the AI message */}
      {isLastAssistantMessage && isTyping && <TypingIndicator />}
    </div>
  </div>
);

})}

            {chatLoading && <div className="flex justify-start"></div>}
            <div ref={messagesEndRef}></div>
          </>
        )}
      </div>

      {/* Input Field */}
      {!showSchemaEditor && (
        <form onSubmit={handleSubmit} className="border-t border-gray-200 p-4">
          <div className="flex space-x-2 items-end">
            <textarea
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                e.target.style.height = "auto";
                const newHeight = e.target.scrollHeight;
                e.target.style.height = `${Math.min(newHeight, 150)}px`; // Allow dynamic growth up to 150px
                e.target.style.overflowY = newHeight > 150 ? "auto" : "hidden"; // Show scrollbar only if needed
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                  e.currentTarget.style.height = "auto";
                }
              }}
              placeholder="Create a simple to-do list data model"
              className="flex-grow px-4 py-2 border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
              rows={1}
              disabled={chatLoading || loading}
              style={{
                lineHeight: "1.5",
                maxHeight: "150px", // Prevent excessive growth
                overflowY: "hidden", // Initially hide overflow
              }}
            />

            <button
              type="submit"
              className={`px-4 py-2 text-white rounded focus:outline-none focus:ring-2 ${
                chatLoading || loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600 focus:ring-blue-500"
              } text-sm md:text-base`}
              disabled={chatLoading || loading}
              style={{ height: "42px" }}
            >
              Send
            </button>
          </div>
        </form>
      )}

      {/* Generate Data Model Button */}
      {!showSchemaEditor && (
        <div className="p-4 bg-gray-50 border-t border-gray-200">
          <button
            onClick={async () => {
              try {
                await generateDataModel();
              } catch (error) {
                console.error("Error generating data model:", error);
                setMessages((prevMessages) => [
                  ...prevMessages,
                  {
                    id: Date.now(),
                    content:
                      "Error: Failed to generate data model. Please try again.",
                    role: "assistant",
                  },
                ]);
              }
            }}
            className={`w-full px-4 py-2 text-white rounded focus:outline-none focus:ring-2 ${
              loading || chatLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600 focus:ring-green-500"
            }`}
            disabled={chatLoading || loading}
          >
            Generate Data Model
          </button>
        </div>
      )}

      {/* Conditionally Render the Modal */}
      {showHowToUse && <HowToUseModal onClose={() => setShowHowToUse(false)} />}
    </div>
  );
}
