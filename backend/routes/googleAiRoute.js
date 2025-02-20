import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GeminiKey } from '../api-key.js';
import { getChatHistory, addToChatHistory, clearChatHistory } from '../Services/chatHistory.js';

const router = express.Router();

const genAI = new GoogleGenerativeAI(GeminiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });


router.post('/', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    addToChatHistory({ role: 'user', content: message });

    const chatHistory = getChatHistory();
    const prompt = `
      Chat History:
      ${chatHistory.map((entry) => `${entry.role}: ${entry.content}`).join('\n')}
      User: ${message}
    `;

    const result = await model.generateContentStream(prompt);

    res.setHeader("Content-Type", "text/plain");
    res.setHeader("Transfer-Encoding", "chunked");

    let aiResponse = "";

    for await (const chunk of result.stream) {
      if (chunk.text) {
        const textChunk = chunk.text();
        aiResponse += textChunk;
        res.write(textChunk);
      }
    }

    // Store AI response in chat history
    console.log("Adding AI response to chat history");
    addToChatHistory({ role: "assistant", content: aiResponse });

    res.end();
  } catch (error) {
    console.error('Error calling Gemini API:', error.message);
    res.status(500).json({ error: 'Failed to fetch AI response or invalid response format.' });
  }
});

router.post('/clear', (req, res) => {
  clearChatHistory();
  res.json({ message: 'Chat history cleared' });
});

router.post('/generateModel', async (req, res) => {
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

    History of conversation:
    ${getChatHistory().map((entry) => `${entry.role}: ${entry.content}`).join('\n')}
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

    addToChatHistory({ role: 'assistant', content: aiResponse });

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
      Merge the user's new table/tables into the existing data model and try to connect it to the current model. Only respond in JSON format and nothing else.
      ${message},
      History of conversation:
      ${getChatHistory().map((entry) => `${entry.role}: ${entry.content}`).join('\n')}
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

    addToChatHistory({ role: 'assistant', content: aiResponse });

    res.json(parsedResponse);
  } catch (error) {
    console.error('Error merging data model:', error.message);
    res.status(500).json({ error: 'Failed to merge data model.' });
  }
});

export default router;
