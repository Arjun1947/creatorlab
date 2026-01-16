import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Groq from "groq-sdk";

import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

console.log("GROQ KEY LOADED:", !!process.env.GROQ_API_KEY);
console.log("MONGODB URI LOADED:", !!process.env.MONGODB_URI);

const app = express();

/* =======================
   CORS FIX (Frontend + Local)
======================= */
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://creatorlab-1.onrender.com",
    ],
    credentials: true,
  })
);

app.use(express.json());

/* =======================
   CONNECT DB
======================= */
connectDB();

/* =======================
   GROQ INIT
======================= */
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

/* =======================
   AUTH ROUTES
======================= */
app.use("/api/auth", authRoutes);
import userDataRoutes from "./routes/userDataRoutes.js";

app.use("/api/data", userDataRoutes);

/* =======================
   HEALTH CHECK
======================= */
app.get("/api/test", (req, res) => {
  res.json({ success: true, message: "Backend connected successfully ✅" });
});

/* =======================
   BIO / PROFILE OPTIMIZER
======================= */
app.post("/api/bio", async (req, res) => {
  try {
    const { niche, platform, tone } = req.body;

    let platformRule = "";

    if (platform === "Instagram") {
      platformRule = `
- Bio must be short and skimmable
- Use line breaks
- Use emojis sparingly
- Instagram-native tone
`;
    } else if (platform === "YouTube") {
      platformRule = `
- Bio should describe channel purpose
- Include subscribe CTA
- Clear value proposition
`;
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: `
You are an expert social media profile optimizer.

RULES:
- Bios must sound human and professional
- Avoid generic phrases
- Do NOT explain
- Respond ONLY in valid JSON
          `,
        },
        {
          role: "user",
          content: `
Create 3 optimized social media bios.

Niche: ${niche}
Platform: ${platform}
Tone: ${tone}

Platform Rules:
${platformRule}

Return ONLY this JSON:
{
  "bios": ["...", "...", "..."]
}
          `,
        },
      ],
      temperature: 0.7,
    });

    const raw = completion.choices[0].message.content;
    const parsed = JSON.parse(raw);

    res.json({
      bios: parsed.bios || [],
    });
  } catch (error) {
    console.error("BIO ERROR:", error.message);
    res.status(500).json({
      bios: ["⚠️ Bio generation failed"],
    });
  }
});

/* =======================
   CAPTION GENERATOR
======================= */
app.post("/api/caption", async (req, res) => {
  try {
    const { topic, tone, platform } = req.body;

    let platformInstruction = "";

    if (platform === "Instagram") {
      platformInstruction = `
MANDATORY RULES:
- EVERY caption MUST include at least one emoji (🔥 💪 ✨ 🚀 😎)
- Captions must be SHORT (max 12 words)
- Instagram Reel–native
`;
    } else if (platform === "YouTube Shorts") {
      platformInstruction = `
MANDATORY RULES:
- Start with a hook
- Add CTA like "Watch till the end"
- NO emojis
`;
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: `
You are a senior social media strategist.

RULES:
- Sound human
- No explanations
- JSON only
          `,
        },
        {
          role: "user",
          content: `
Platform: ${platform}
Topic: ${topic}
Tone: ${tone}

Rules:
${platformInstruction}

Return ONLY this JSON:
{
  "captions": ["...", "...", "..."],
  "hashtags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5"]
}
          `,
        },
      ],
      temperature: 0.8,
    });

    const raw = completion.choices[0].message.content;
    const parsed = JSON.parse(raw);

    res.json({
      captions: parsed.captions || [],
      hashtags: parsed.hashtags || [],
    });
  } catch (error) {
    console.error("CAPTION ERROR:", error.message);
    res.status(500).json({
      captions: ["⚠️ AI failed, try again"],
      hashtags: ["#error"],
    });
  }
});

/* =======================
   ROOT
======================= */
app.get("/", (req, res) => {
  res.send("CreatorLab Backend is running ✅ Use /api/test");
});

/* =======================
   PORT
======================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});
