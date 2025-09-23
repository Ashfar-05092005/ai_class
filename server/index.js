require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors()); // Allow all origins (you can restrict later)
app.use(express.json());
app.use(express.static("public"));

// Root route (just to test backend)
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

    res.json({ summary: summary.trim() });
  } catch (e) {
    console.error("Server error:", e);
    res.status(500).json({ error: e.message });
  }
});

// Start server
const PORT = process.env.port || 4000;
app.listen(PORT, () => {
  console.log("Backend successful ✅");
  console.log(`Server running at http://localhost:${PORT}`);
});
