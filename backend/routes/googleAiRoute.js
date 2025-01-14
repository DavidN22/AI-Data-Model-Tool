import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { apiKey } from '../api-key.js';
import { randomBytes } from 'crypto';

const router = express.Router();
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

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

NEVER respond in JSON format unless the message explicitly starts with "The user pressed the Generate data model button. Also dont create composite keys."
`;

const chatHistories = {};
const MAX_CHAT_HISTORY_LENGTH = 10;

setInterval(() => {
  Object.keys(chatHistories).forEach((sessionId) => {
    if (chatHistories[sessionId]) {
      delete chatHistories[sessionId];
      console.log(`Deleted chat history for expired session: ${sessionId}`);
    }
  });
}, 20 * 60 * 1000); 

router.use((req, res, next) => {
  let sessionId = req.cookies.sessionId;

  if (!sessionId) {
    sessionId = randomBytes(16).toString('hex');
    res.cookie('sessionId', sessionId, {
      maxAge: 20 * 60 * 1000, 
    });
    chatHistories[sessionId] = [];
  }

  req.sessionId = sessionId;

  next();
});




router.post('/', async (req, res) => {
  console.log(chatHistories);
  const { message } = req.body;
  const sessionId = req.sessionId;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    if (!chatHistories[sessionId]) {
      chatHistories[sessionId] = [];
    }

    const chatHistory = chatHistories[sessionId];
    chatHistory.push({ role: 'user', content: message });

    if (chatHistory.length > MAX_CHAT_HISTORY_LENGTH) {
      chatHistories[sessionId] = [chatHistory[0], ...chatHistory.slice(-MAX_CHAT_HISTORY_LENGTH + 1)];
    }

    const prompt = `
      System: ${systemMessage}
      Chat History:
      ${chatHistory.map((entry) => `${entry.role}: ${entry.content}`).join('\n')}
      User: ${message}
    `;

    const result = await model.generateContent(prompt);
    const aiResponse = result.response.text();

    chatHistory.push({ role: 'assistant', content: aiResponse });

    res.json({ response: aiResponse });
  } catch (error) {
    console.error('Error calling Gemini API:', error.message);
    res.status(500).json({ error: 'Failed to fetch AI response or invalid response format.' });
  }
});

router.post('/clear', (req, res) => {
  const sessionId = req.sessionId;

  delete chatHistories[sessionId];
  res.clearCookie('sessionId');
  res.json({ message: 'Chat history cleared' });
});

router.post('/googleGenerate', async (req, res) => {
  const sessionId = req.sessionId;
  try {
    const prompt = `
      The user pressed the Generate data model button. Generate a JSON object representing nodes and edges for a data model. Only respond in JSON format and nothing else. 
      Example JSON response:
      {
        "nodes": [
          {
            "id": "example_users",
            "type": "custom",
            "data": {
              "label": "Example_Users",
              "schema": [
                { "name": "id", "type": "UUID", "constraints": "PRIMARY KEY" },
                { "name": "name", "type": "VARCHAR(255)", "constraints": "NOT NULL" },
                { "name": "email", "type": "VARCHAR(255)", "constraints": "UNIQUE NOT NULL" },
                { "name": "created_at", "type": "TIMESTAMP", "constraints": "DEFAULT CURRENT_TIMESTAMP" }
              ]
            },
            "position": { "x": 100, "y": 50 }
          }
        ],
        "edges": [
          { "id": "e1", "source": "users", "target": "orders", "label": "user_id" }
        ]
      }

      Chat History:
      ${chatHistories[sessionId].map((entry) => `${entry.role}: ${entry.content}`).join('\n')}
    `;

    const result = await model.generateContent(prompt);
    const aiResponse = result.response.text();

    let parsedResponse;
    try {
      const cleanedResponse = aiResponse.replace(/```json/g, '').replace(/```/g, '');
      parsedResponse = JSON.parse(cleanedResponse);
    } catch (error) {
      console.error('Failed to parse AI response:', error.message);
      return res.status(500).json({ error: 'AI response is not in the expected JSON format.' });
    }

    chatHistories[sessionId].push({ role: 'assistant', content: aiResponse });

    res.json(parsedResponse);
  } catch (error) {
    console.error('Error generating data model:', error.message);
    res.status(500).json({ error: 'Failed to generate data model.' });
  }
});

export default router;
