import React, { useState, useRef, FormEvent } from "react";
import { SchemaEditor } from "./SchemaEditor";
import { Node } from "reactflow";
import { HowToUseModal } from "./HowToUseModal";
import TypingIndicator from "./CustomTypingIndicator";
import { useChat } from "./global/ChatContext";

const API_BASE_URL = import.meta.env.DEV
  ? ""
  : "https://ai-data-model-tool-backend-davidn22s-projects.vercel.app";

interface ChatProps {
  generateDataModel: () => void;
  mergeDataModel: (arg: Node[]) => void;
  fetchAIResponse: (
    input: string,
    manualNodes: Node[],
    onData: (chunk: string) => void,
  ) => Promise<string>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  resetNodesAndEdges: () => void;
  schemaAddNodes: (
    tableName: string,
    schema: { name: string; type: string }[],
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
              : msg,
          );
        });
      });
    } catch (error) {
      setIsTyping(false);
      console.error("Error fetching AI response:", error);
    } finally {
      setChatLoading(false);
    }
  };

  const handleClear = async () => {
    try {
      resetNodesAndEdges();
      clearChat();
      const response = await fetch(`${API_BASE_URL}/api/googleAi/clear`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

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
    <div className="flex flex-col h-full card overflow-hidden bg-gradient-to-b from-white to-slate-50/50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md p-3 border-b flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-800 to-slate-600 flex items-center justify-center text-white font-semibold text-sm shadow-sm">
            {showSchemaEditor ? "✏️" : "🤖"}
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground leading-tight">
              {showSchemaEditor ? "Schema Editor" : "AI Assistant"}
            </h2>
            <p className="text-xs text-muted-foreground">
              {showSchemaEditor ? "Manual mode" : "Gemini AI"}
            </p>
          </div>
        </div>
        <div className="flex gap-1.5">
          <button
            onClick={() => setShowHowToUse(true)}
            className="btn btn-secondary h-8 px-3 text-xs font-medium"
          >
            💡 Guide
          </button>
          <button
            onClick={() => setShowSchemaEditor(!showSchemaEditor)}
            className="btn btn-secondary h-8 px-3 text-xs font-medium"
          >
            {showSchemaEditor ? "💬" : "✏️"}
          </button>
          <button
            onClick={handleClear}
            className="btn btn-ghost h-8 w-8 p-0 text-muted-foreground hover:text-red-600 hover:bg-red-50"
            title="Clear all"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
          <button
            onClick={() => setIsChatOpen(false)}
            className="block md:hidden btn btn-ghost h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {showSchemaEditor ? (
          <SchemaEditor
            onSubmit={schemaAddNodes}
            manualNodes={manualNodes}
            mergeDataModel={mergeDataModel}
            loading={loading}
          />
        ) : (
          <div className="space-y-3">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-600 flex items-center justify-center text-3xl mb-4 shadow-lg">
                  🤖
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Start a conversation
                </h3>
                <p className="text-sm text-muted-foreground max-w-xs">
                  Describe your data model and I'll help you visualize it
                </p>
              </div>
            ) : (
              messages.map((m, index) => {
                const isLastAssistantMessage =
                  m.role !== "user" && index === messages.length - 1;

                return (
                  <div
                    key={m.id}
                    className={`flex animate-slide-in ${
                      m.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`flex gap-2 max-w-[85%] ${m.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                    >
                      <div
                        className={`w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center text-xs ${
                          m.role === "user"
                            ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-sm"
                            : "bg-gradient-to-br from-slate-800 to-slate-600 text-white shadow-sm"
                        }`}
                      >
                        {m.role === "user" ? "👤" : "🤖"}
                      </div>
                      <div
                        className={`whitespace-pre-wrap break-words rounded-2xl px-4 py-2.5 text-sm ${
                          m.role === "user"
                            ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md"
                            : "bg-white border text-foreground shadow-sm"
                        }`}
                      >
                        <span
                          dangerouslySetInnerHTML={{
                            __html: m.content
                              .replace(/\\/g, "")
                              .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                              .replace(
                                /`([^`]*)`/g,
                                `<code class='px-1.5 py-0.5 ${m.role === "user" ? "bg-blue-700/40" : "bg-muted"} rounded text-xs font-mono'>$1</code>`,
                              ),
                          }}
                        ></span>
                        {isLastAssistantMessage && isTyping && (
                          <TypingIndicator />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef}></div>
          </div>
        )}
      </div>

      {/* Input Field */}
      {!showSchemaEditor && (
        <div className="border-t bg-white/80 backdrop-blur-sm p-3">
          <form
            onSubmit={handleSubmit}
            className="flex gap-2 items-end bg-muted/40 rounded-2xl p-2 border"
          >
            <textarea
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                e.target.style.height = "auto";
                const newHeight = e.target.scrollHeight;
                e.target.style.height = `${Math.min(newHeight, 150)}px`;
                e.target.style.overflowY = newHeight > 150 ? "auto" : "hidden";
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                  e.currentTarget.style.height = "auto";
                }
              }}
              placeholder="Create a simple to-do list data model"
              className="flex-1 resize-none min-h-[36px] max-h-32 bg-transparent border-0 focus:outline-none focus:ring-0 px-3 py-2 text-sm placeholder:text-muted-foreground"
              rows={1}
              disabled={chatLoading || loading}
              style={{
                lineHeight: "1.5",
                maxHeight: "150px",
                overflowY: "hidden",
              }}
            />

            <button
              type="submit"
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                chatLoading || loading
                  ? "bg-muted text-muted-foreground cursor-not-allowed"
                  : "bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-md hover:shadow-lg"
              }`}
              disabled={chatLoading || loading}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </button>
          </form>
        </div>
      )}

      {/* Generate Data Model Button */}
      {!showSchemaEditor && (
        <div className="px-3 pb-3 bg-white/80 backdrop-blur-sm">
          <button
            onClick={async () => {
              if (messages.length === 0) {
                alert(
                  "Please start a conversation with the AI first. \nExample: 'Create a simple to-do list data model'",
                );
                return;
              }

              try {
                setIsChatOpen(false);
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
            className={`btn w-full h-10 text-sm font-medium rounded-xl shadow-sm transition-all ${
              loading || chatLoading
                ? "bg-muted text-muted-foreground cursor-not-allowed"
                : "bg-gradient-to-r from-emerald-600 to-emerald-500 text-white hover:from-emerald-700 hover:to-emerald-600 shadow-md hover:shadow-lg"
            }`}
            disabled={chatLoading || loading}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Generating...
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4 inline mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                Generate Data Model
              </>
            )}
          </button>
        </div>
      )}

      {/* Conditionally Render the Modal */}
      {showHowToUse && <HowToUseModal onClose={() => setShowHowToUse(false)} />}
    </div>
  );
}
