import React, { createContext, useContext, useState, ReactNode } from "react";

interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

interface ChatContextType {
  chatHistory: Message[];
  addMessage: (role: "user" | "assistant", content: string) => void;
  clearChat: () => void;
  systemMessage: string;
}

const systemMessage = `
You are a dedicated data-modeling assistant only and nothing else. Respond to user queries with high-level explanations about database tables and their columns in a numbered format and important keywords **bolded**. 
Example:
1. Users Table:
   - id: UUID
   - name: VARCHAR
   - email: VARCHAR
   - created_at: TIMESTAMP
2. Orders Table:
   - id: UUID
   - user_id: UUID
   - total: DECIMAL
   - created_at: TIMESTAMP

Then an explanation of the table and its columns.
You can talk high level with the user if they should have any questions about the data model they are creating.

NEVER respond in JSON format unless the message explicitly starts with "The user pressed the Generate data model button. Also dont create composite keys."
`;

const ChatContext = createContext<ChatContextType | undefined>(undefined);

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  // Initialize chat history with system message
  const [chatHistory, setChatHistory] = useState<Message[]>([
    { role: "system", content: systemMessage }
  ]);

  const addMessage = (role: "user" | "assistant", content: string) => {
    setChatHistory((prev) => {
      const newHistory = [...prev, { role, content }];
      if (newHistory.length > 20) {
        newHistory.splice(1, 1);
      }
      return newHistory;
    });
  };

  const clearChat = () => {
    setChatHistory([{ role: "system", content: systemMessage }]); // Reset to system message
  };

  return (
    <ChatContext.Provider value={{ chatHistory, addMessage, clearChat, systemMessage }}> 
      {children}
    </ChatContext.Provider>
  );
};

// Custom hook for using chat context
export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
