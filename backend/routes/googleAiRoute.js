import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { apiKey } from '../api-key.js';

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

let chatHistory = [];
const MAX_CHAT_HISTORY_LENGTH = 10;

router.post('/', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    chatHistory.push({ role: 'user', content: message });
    if (chatHistory.length > MAX_CHAT_HISTORY_LENGTH) {
      chatHistory = chatHistory.slice(-MAX_CHAT_HISTORY_LENGTH);
    }

    const prompt = `
      System: ${systemMessage}
      Chat History:
      ${chatHistory.map((entry) => `${entry.role}: ${entry.content}`).join('\n')}
      User: ${message}
    `;

    const result = await model.generateContent(prompt);
    const aiResponse = result.response.text();

    if (!message.startsWith('The user pressed the Generate data model button') && aiResponse.startsWith('{')) {
      throw new Error('AI responded in JSON format when it was not allowed.');
    }

    chatHistory.push({ role: 'assistant', content: aiResponse });

    res.json({ response: aiResponse });
  } catch (error) {
    console.error('Error calling Gemini API:', error.message);
    res.status(500).json({ error: 'Failed to fetch AI response or invalid response format.' });
  }
});

router.post('/clear', (req, res) => {
  chatHistory = [];
  res.json({ message: 'Chat history cleared' });
});

router.post('/googleGenerate', async (req, res) => {
  try {
    const prompt = `
    The user pressed the Generate data model button. Generate a JSON object representing nodes and edges for a data model Only respond is JSON format and nothing else. 
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

    History of conversation:
    ${chatHistory.map((entry) => `${entry.role}: ${entry.content}`).join('\n')}
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

    chatHistory.push({ role: 'assistant', content: aiResponse });

    res.json(parsedResponse);
  } catch (error) {
    console.error('Error generating data model:', error.message);
    res.status(500).json({ error: 'Failed to generate data model.' });
  }
});

router.post('/merge', async (req, res) => {
    const { message } = req.body;
    try {
      const prompt = `
        Merge the users new table/tables into the existing data model and try to connect it to the current model. Only respond in JSON format and nothing else.
        ${message},
        History of conversation:
        ${chatHistory.map((entry) => `${entry.role}: ${entry.content}`).join('\n')}
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
  
      chatHistory.push({ role: 'assistant', content: aiResponse });
  
      res.json(parsedResponse);
    } catch (error) {
      console.error('Error generating data model:', error.message);
      res.status(500).json({ error: 'Failed to generate data model.' });
    }
  });
export default router;
