import express from 'express';
import OpenAI from 'openai';
import { apiKey } from '../api-key.js';
const router = express.Router();

const openai = new OpenAI({
  apiKey: apiKey,
});

const systemMessage = {
    role: 'system',
    content: `
      You are a dedicated data-modeling assistant only and nothing else. Respond to user queries with high-level explanations about database tables and their columns in a numbered format. 
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
  
      NEVER respond in JSON format unless the message explicitly starts with "The user pressed the Generate data model button."
    `,
  };
  
  let chatHistory = []; 

router.post('/', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    // Add user message to the chat history
    chatHistory.push({ role: 'user', content: message });

    const messages = [systemMessage, ...chatHistory];
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages  
    });

    const aiResponse = response.choices[0].message.content;


    if (!message.startsWith('The user pressed the Generate data model button') && aiResponse.trim().startsWith('{')) {
      throw new Error('AI responded in JSON format when it was not allowed.');
    }


    chatHistory.push({ role: 'assistant', content: aiResponse });

    res.json({ response: aiResponse });
  } catch (error) {
    console.error('Error calling OpenAI:', error.message);
    res.status(500).json({ error: 'Failed to fetch AI response or invalid response format.' });
  }
});

router.post('/clear', (req, res) => {
  chatHistory = [];
  res.json({ message: 'Chat history cleared' });
});

router.post('/test', async (req, res) => {
  try {
    const prompt = `
      The user pressed the Generate data model button. Generate a JSON object representing nodes and edges for a data model Only respond is JSON format and nothing else. 
      Example JSON response:
      {
        "nodes": [
          {
            "id": "users",
            "type": "custom",
            "data": {
              "label": "Users",
              "schema": [
                { "name": "id", "type": "UUID" },
                { "name": "name", "type": "VARCHAR" },
                { "name": "email", "type": "VARCHAR" },
                { "name": "created_at", "type": "TIMESTAMP" }
              ]
            },
            "position": { "x": 0, "y": 0 }
          }
        ],
        "edges": [
          { "id": "e1", "source": "users", "target": "orders", "label": "user_id" }
        ]
      }

      History of conversation:
      ${chatHistory.map((entry) => `${entry.role}: ${entry.content}`).join('\n')}
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
    });

    let aiResponse = response.choices[0].message.content;

    // Parse JSON response
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
