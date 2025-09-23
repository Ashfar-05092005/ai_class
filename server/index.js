require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve React frontend (after build)
app.use(express.static(path.join(__dirname, "build")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

// API: Summarization
app.post("/api/summarize", async (req, res) => {
  const geminiApiKey = process.env.GEMINI_API_KEY;

  if (!geminiApiKey) {
    return res.status(500).json({
      error: "API key not configured. Please add GEMINI_API_KEY to .env",
    });
  }

  const { text, tone } = req.body;
  if (!text || !tone) {
    return res.status(400).json({ error: "Both text and tone are required." });
  }

  const safeTone = tone.toLowerCase();
  const prompt = `Summarize the following message in exactly 10git bullet points using a ${safeTone} tone:\n\n"""${text}"""`;

  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`;

  try {
    const geminiResponse = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    if (!geminiResponse.ok) {
      const errorData = await geminiResponse.json().catch(() => ({}));
      console.error("API Error:", geminiResponse.status, errorData);
      return res
        .status(500)
        .json({ error: errorData.error?.message || "Gemini API failed" });
    }

    const data = await geminiResponse.json();
    const summary =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No summary generated.";

    return res.json({ summary: summary.trim() });
  } catch (e) {
    console.error("Server error:", e);
    return res.status(500).json({ error: e.message });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
