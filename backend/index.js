import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Groq from "groq-sdk";

dotenv.config();

console.log("GROQ KEY LOADED:", !!process.env.GROQ_API_KEY);

const app = express();
app.use(cors());
app.use(express.json());

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// ✅ HEALTH CHECK
app.get("/api/test", (req, res) => {
  res.json({ success: true, message: "Backend connected successfully ✅" });
});

// ✅ AI CAPTION ROUTE (PLATFORM-AWARE)
// ✅ BIO / PROFILE OPTIMIZER
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
    console.log("BIO RAW RESPONSE:", raw);

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

app.post("/api/caption", async (req, res) => {
  try {
    const { topic, tone, platform } = req.body;

    // 🔥 PLATFORM RULES (THIS WAS MISSING BEFORE)
    let platformInstruction = "";

    if (platform === "Instagram") {
      platformInstruction = `
MANDATORY RULES:
- EVERY caption MUST include at least one emoji (🔥 💪 ✨ 🚀 😎)
- Captions must be SHORT (max 12 words)
- Style must feel Instagram Reel–native
- Fun, aesthetic, scroll-stopping
`;
    } else if (platform === "YouTube Shorts") {
      platformInstruction = `
MANDATORY RULES:
- EVERY caption MUST start with a hook
- Hooks like: "Wait for it...", "Nobody talks about this...", "This will change everything..."
- Add CTA like "Watch till the end" or "Subscribe for more"
- NO emojis in captions
`;
    } else {
      platformInstruction = `
General social media style
`;
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
  role: "system",
  content: `
You are a senior social media strategist and viral content writer.

RULES YOU MUST FOLLOW:
- Write captions like a real creator, not AI
- Avoid generic phrases like "Stay motivated", "Believe in yourself"
- Captions must sound natural, punchy, and confident
- Use curiosity, urgency, or emotion
- Do NOT explain anything
- Do NOT add extra text
- Respond ONLY with valid JSON
`,
},

        {
          role: "user",
          content: `
Create HIGH-QUALITY, VIRAL social media captions that could realistically go viral.

Platform: ${platform}
Topic: ${topic}
Tone: ${tone}

Platform Rules:
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
    console.log("RAW AI RESPONSE:", raw);

    const parsed = JSON.parse(raw);

    res.json({
      captions: parsed.captions || [],
      hashtags: parsed.hashtags || [],
    });

  } catch (error) {
    console.error("GROQ ERROR:", error.message);
    res.status(500).json({
      captions: ["⚠️ AI failed, try again"],
      hashtags: ["#error"],
    });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
