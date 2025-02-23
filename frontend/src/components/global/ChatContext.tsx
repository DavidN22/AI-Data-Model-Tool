import React, { createContext, useContext, useState, ReactNode } from "react";
import { systemMessage } from "./ChatConfig";
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
