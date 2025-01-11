const MAX_CHAT_HISTORY_LENGTH = 10;
let chatHistory = [];

const systemMessage = {
  role: 'system',
  content: `
    You are a dedicated data-modeling assistant only and nothing else. Respond to user queries with high-level explanations about database tables and their columns in a numbered format and important keywords bolded. 
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

    NEVER respond in JSON format unless the message explicitly starts with "The user pressed the Generate data model button. Also don't create composite keys."
  `,
};

export const getChatHistory = () => {
  return [systemMessage, ...chatHistory];
};

export const addToChatHistory = (entry) => {
  chatHistory.push(entry);

  if (chatHistory.length > MAX_CHAT_HISTORY_LENGTH) {
    chatHistory = [chatHistory[0], ...chatHistory.slice(-MAX_CHAT_HISTORY_LENGTH + 1)];
  }
};
export const clearChatHistory = () => {
  chatHistory = [];
};
