import express from "express";
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { apiKey } from "../api-key.js";
import { randomBytes } from "crypto";
import {schemaAI} from "../schemaAI.js";

const router = express.Router();
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
const modelJson = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-exp",
  generationConfig: {
    responseMimeType: "application/json",
    responseSchema: schemaAI.schemaOne,
  },
});

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
    sessionId = randomBytes(16).toString("hex");
    res.cookie("sessionId", sessionId, {
      maxAge: 20 * 60 * 1000,
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    chatHistories[sessionId] = [];
  }

  req.sessionId = sessionId;

  next();
});

router.post("/", async (req, res) => {
  const { message } = req.body;
  const sessionId = req.sessionId;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    if (!chatHistories[sessionId]) {
      chatHistories[sessionId] = [];
    }

    const chatHistory = chatHistories[sessionId];
    chatHistory.push({ role: "user", content: message });

    if (chatHistory.length > MAX_CHAT_HISTORY_LENGTH) {
      chatHistories[sessionId] = [
        chatHistory[0],
        ...chatHistory.slice(-MAX_CHAT_HISTORY_LENGTH + 1),
      ];
    }

    const prompt = `
      System: ${systemMessage}
      Chat History:
      ${chatHistory.map((entry) => `${entry.role}: ${entry.content}`).join("\n")}
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
    chatHistory.push({ role: "assistant", content: aiResponse });

    res.end();
  } catch (error) {
    console.error("Error calling Gemini API:", error.message);
    res.status(500).json({
      error: "Failed to fetch AI response or invalid response format.",
    });
  }
});


router.post("/clear", (req, res) => {
  console.log(chatHistories)
  const sessionId = req.sessionId;

  delete chatHistories[sessionId];
  res.clearCookie("sessionId", {
    path: "/", // Match the path
    secure: true, // Match the secure flag
    sameSite: "None", // Match the sameSite attribute
  });
  res.json({ message: "Chat history cleared" });
});

router.post("/googleGenerate", async (req, res) => {
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
      ${chatHistories[sessionId]
        .map((entry) => `${entry.role}: ${entry.content}`)
        .join("\n")}
    `;

    const result = await modelJson.generateContent(prompt);
    const aiResponse = result.response.text();

    let parsedResponse;
    try {
      const cleanedResponse = aiResponse
        .replace(/```json/g, "")
        .replace(/```/g, "");
      parsedResponse = JSON.parse(cleanedResponse);
    } catch (error) {
      console.error("Failed to parse AI response:", error.message);
      return res
        .status(500)
        .json({ error: "AI response is not in the expected JSON format." });
    }

    chatHistories[sessionId].push({ role: "assistant", content: aiResponse });

    res.json(parsedResponse);
  } catch (error) {
    console.error("Error generating data model:", error.message);
    res.status(500).json({ error: "Failed to generate data model." });
  }
});

router.post("/merge", async (req, res) => {
  const { message } = req.body;
  const sessionId = req.sessionId;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    if (!chatHistories[sessionId]) {
      chatHistories[sessionId] = [];
    }

    const chatHistory = chatHistories[sessionId];
    chatHistory.push({ role: "user", content: message });

    const prompt = `
      Merge the user's new table/tables into the existing data model and try to connect it to the current model. The table they added might not work and your job is to connect it and fit it into the current model. Only respond in JSON format and nothing else.
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
      User's input/new table they added:
      ${message}
      Chat History:
      ${chatHistory
        .map((entry) => `${entry.role}: ${entry.content}`)
        .join("\n")}
    `;

    const result = await model.generateContent(prompt);
    const aiResponse = await result.response.text();

    let parsedResponse;

    try {
      // Clean and parse the AI response
      const cleanedResponse = aiResponse
        .replace(/```json/g, "")
        .replace(/```/g, "");
      parsedResponse = JSON.parse(cleanedResponse);
    } catch (error) {
      console.error("Failed to parse AI response:", error.message);
      return res
        .status(500)
        .json({ error: "AI response is not in the expected JSON format." });
    }

    // Save AI response to chat history
    chatHistory.push({ role: "assistant", content: aiResponse });

    res.json(parsedResponse);
  } catch (error) {
    console.error("Error generating merged data model:", error.message);
    res.status(500).json({ error: "Failed to merge data model." });
  }
});

export default router;
