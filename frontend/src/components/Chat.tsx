import React, { useState, useEffect, useRef, FormEvent } from 'react';
import { SchemaEditor } from './SchemaEditor';
import { Node } from 'reactflow';
import { useDataModelServices } from './Services/Services';


interface ChatProps {
  generateDataModel: () => void;
  mergeDataModel: (arg:Node[]) => void;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  resetNodesAndEdges: () => void;
  schemaAddNodes: (tableName: string, schema: { name: string; type: string }[]) => void;
  manualNodes: Node[];
}

interface Message {
  id: number;
  content: string;
  role: 'user' | 'assistant';
}

export function Chat({ generateDataModel, mergeDataModel, loading, resetNodesAndEdges, schemaAddNodes, manualNodes }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [showSchemaEditor, setShowSchemaEditor] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const { fetchAIResponse } = useDataModelServices();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      const newMessage: Message = { id: Date.now(), content: input, role: 'user' };
      setMessages([...messages, newMessage]);
      setInput('');
      setChatLoading(true);

      try {
        const formattedContent = await fetchAIResponse(input, manualNodes); 
        const aiResponse: Message = { id: Date.now(), content: formattedContent, role: 'assistant' };
        setMessages((prevMessages) => [...prevMessages, aiResponse]);
      } catch (error) {
        console.error('Error fetching AI response:', error);
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            id: Date.now(),
            content: 'Error: An unexpected error occurred. Please try again or refresh the browser for fresh logs.',
            role: 'assistant',
          },
        ]);
      } finally {
        setChatLoading(false);
      }
    }
  };

  const handleClear = async () => {
      try {
        resetNodesAndEdges();
        const response = await fetch('https://ai-data-model-tool-backend-davidn22s-projects.vercel.app/api/googleAi/clear', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
          setMessages([]);
        } else {
          console.error('Failed to clear chat history');
        }
      } catch (error) {
        console.error('Error clearing chat history:', error);
      }
  };
  return (
    <div className="flex flex-col h-full border border-gray-200 rounded-lg bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-700">
          {showSchemaEditor ? 'Schema Editor' : 'AI Chat'}
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowSchemaEditor(!showSchemaEditor)}
            className="px-4 py-2 text-sm text-white bg-blue-500 rounded hover:bg-blue-600 focus:ring-2 focus:ring-blue-500"
          >
            {showSchemaEditor ? 'Switch to Chat' : 'Switch to Input'}
          </button>
          <button
            onClick={handleClear}
            className="px-4 py-2 text-sm text-white bg-red-500 rounded hover:bg-red-600 focus:ring-2 focus:ring-red-500"
          >
            {showSchemaEditor ? 'Clear All' : 'Clear All'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4" style={{ height: '400px', overflowY: 'auto' }}>
        {showSchemaEditor ? (
          <SchemaEditor onSubmit={schemaAddNodes} manualNodes={manualNodes} mergeDataModel = {mergeDataModel} loading ={loading}  />
        ) : (
          <>
            {/* Chat Messages */}
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] whitespace-pre-wrap rounded-lg px-4 py-2 ${
                    m.role === 'user' ? 'bg-blue-100 text-blue-900' : 'bg-gray-100 text-gray-800'
                  }`}
                  dangerouslySetInnerHTML={{
                    __html: m.content
                      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                      .replace(/`([^`]*)`/g, '<strong>$1</strong>'),
                  }}
                ></div>
              </div>
            ))}
            {chatLoading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-lg px-4 py-2 bg-gray-100 text-gray-800">Typing...</div>
              </div>
            )}
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
                e.target.style.height = 'auto';
                e.target.style.height = `${e.target.scrollHeight}px`;
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                  e.currentTarget.style.height = 'auto';
                }
              }}
              placeholder="Type your message..."
              className="flex-grow px-4 py-2 border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={1}
              disabled={chatLoading || loading}
              style={{ lineHeight: '1.5', overflow: 'hidden' }}
            />
            <button
              type="submit"
              className={`px-4 py-2 text-white rounded focus:outline-none focus:ring-2 ${
                chatLoading || loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-500'
              }`}
              disabled={chatLoading || loading}
              style={{ height: '42px' }}
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
              console.error('Error generating data model:', error);
              setMessages((prevMessages) => [
                ...prevMessages,
                {
                  id: Date.now(),
                  content: 'Error: Failed to generate data model. Please try again.',
                  role: 'assistant',
                },
              ]);
            } 
          }}
          className={`w-full px-4 py-2 text-white rounded focus:outline-none focus:ring-2 ${
            loading || chatLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600 focus:ring-green-500'
          }`}
          disabled={chatLoading || loading}
        >
          Generate Data Model
        </button>
      </div>
      
      )}
    </div>
  );
}
