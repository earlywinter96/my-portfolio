import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/analyze", async (req, res) => {
  try {
    const { text } = req.body;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text }]
            }
          ]
        })
      }
    );

    const data = await response.json();

    const output =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No AI response received.";

    res.json({ output });
  } catch (error) {
    console.error("Gemini error:", error);
    res.status(500).json({ error: "AI analysis failed" });
  }
});

/* IMPORTANT: Render injects PORT */
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
