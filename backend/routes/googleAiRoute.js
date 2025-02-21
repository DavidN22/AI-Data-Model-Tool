import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { apiKey } from "../api-key.js";
import { schemaAI } from "../schemaAI.js";

const router = express.Router();
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
const modelJson = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
  generationConfig: {
    responseMimeType: "application/json",
    responseSchema: schemaAI.schemaOne,
  },
});

router.post("/", async (req, res) => {
  const { message, chatHistory } = req.body;

  if (!message || !Array.isArray(chatHistory)) {
    return res.status(400).json({ error: "Message and chat history are required" });
  }

  try {
    const prompt = `
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

    res.end();
  } catch (error) {
    console.error("Error calling Gemini API:", error.message);
    res.status(500).json({
      error: "Failed to fetch AI response or invalid response format.",
    });
  }
});

router.post("/clear", (req, res) => {
  res.json({ message: "Chat history cleared" });
});

router.post("/googleGenerate", async (req, res) => {
  const { chatHistory } = req.body;

  if (!chatHistory) {
    return res.status(400).json({ error: "Chat history is required" });
  }

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
                { "name": "name", "type": "VARCHAR(255)", "constraints": "NOT NULL REFERENCES Users(id) ON DELETE CASCADE," },
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

      Chat History (!IMPORTANT! - Last messages being the most recent and Respond the schema part in a VALID SQL FORMAT,
      assume the schema is then converted to a string for the user to then copy and paste into their database):
      ${chatHistory.map((entry) => `${entry.role}: ${entry.content}`).join("\n")}
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

    res.json(parsedResponse);
  } catch (error) {
    console.error("Error generating data model:", error.message);
    res.status(500).json({ error: "Failed to generate data model." });
  }
});

router.post("/merge", async (req, res) => {
  const { message, chatHistory } = req.body;

  if (!message || !chatHistory) {
    return res.status(400).json({ error: "Message and chat history are required" });
  }

  try {
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
      Chat History (!IMPORTANT! - Last messages being the most recent):
      ${chatHistory.map((entry) => `${entry.role}: ${entry.content}`).join("\n")}
    `;
console.log(prompt);
    const result = await model.generateContent(prompt);
    const aiResponse = await result.response.text();

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

    res.json(parsedResponse);
  } catch (error) {
    console.error("Error generating merged data model:", error.message);
    res.status(500).json({ error: "Failed to merge data model." });
  }
});

export default router;
