require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch"); 

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// Root route
app.get("/", (req, res) => {
  res.send("Backend successful ✅");
});

// API: Summarization
app.post("/api/summarize", async (req, res) => {
  const geminiApiKey = process.env.GEMINI_API_KEY;

  if (!geminiApiKey) {
    return res.status(500).json({
      error: "API key not configured. Please add it to your .env file.",
    });
  }

  const { text, tone } = req.body;
  if (!text || !tone) {
    return res.status(400).json({ error: "Both text and tone are required." });
  }

  const safeTone = tone.toLowerCase();
  const prompt = `Summarize the following message in exactly 12 bullet points using a ${safeTone} tone:\n\n"""${text}"""`;

  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`;

  try {
    const geminiResponse = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    });

    const rawText = await geminiResponse.text();

    if (!geminiResponse.ok) {
      console.error("Gemini API error:", geminiResponse.status, rawText);
      return res.status(500).json({ error: "Gemini API request failed", details: rawText });
    }

    let data;
    try {
      data = JSON.parse(rawText);
    } catch (err) {
      console.error("❌ Failed to parse JSON:", rawText);
      return res.status(500).json({ error: "Invalid JSON from Gemini API", details: rawText });
    }

    const summary =
      data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join(" ").trim() ||
      "No summary generated.";

    res.json({ summary });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log("Backend server running ✅");
  console.log(`Server at http://localhost:${PORT}`);
});
