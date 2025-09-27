require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const fetch = require("node-fetch"); // if using Node <18

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API route
app.post("/api/summarize", async (req, res) => {
  const geminiApiKey = process.env.GEMINI_API_KEY;
  if (!geminiApiKey) return res.status(500).json({ error: "API key missing" });

  const { text, tone } = req.body;
  if (!text || !tone) return res.status(400).json({ error: "Text and tone required" });

  const prompt = `Summarize the following text in exactly 12 bullet points using a ${tone.toLowerCase()} tone:\n\n"""${text}"""`;
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`;

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    });

    const rawText = await response.text();
    if (!response.ok) return res.status(500).json({ error: rawText });

    const data = JSON.parse(rawText);
    const summary =
      data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join(" ").trim() ||
      "No summary generated";

    res.json({ summary });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

// Serve React frontend (production)
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/build")));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
