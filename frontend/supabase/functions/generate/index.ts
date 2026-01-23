import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, platform, niche, language, tone, inputText } = await req.json();
    
    console.log("Generation request:", { type, platform, niche, language, tone });

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompts = {
      caption: `You are an expert social media content creator. Generate 3 engaging captions for ${platform === "instagram" ? "Instagram Reels" : "YouTube Shorts"} in the ${niche} niche. 
      
The tone should be ${tone}. Language: ${language === "hinglish" ? "Hinglish (mix of Hindi and English)" : "English"}.

Rules:
- Each caption should be unique and engaging
- Include relevant emojis
- Keep it concise but impactful
- Make it shareable and relatable
- Optimize for engagement`,

      hashtag: `You are a social media hashtag expert. Generate 15-20 trending and relevant hashtags for ${platform === "instagram" ? "Instagram Reels" : "YouTube Shorts"} in the ${niche} niche.

Rules:
- Mix popular and niche-specific hashtags
- Include both broad reach and targeted hashtags
- Make them relevant to the content described
- Format as a single string with each hashtag separated by space`,

      hook: `You are a viral content creator specializing in scroll-stopping hooks. Generate 3 powerful opening hooks for ${platform === "instagram" ? "Instagram Reels" : "YouTube Shorts"} in the ${niche} niche.

The tone should be ${tone}. Language: ${language === "hinglish" ? "Hinglish (mix of Hindi and English)" : "English"}.

Rules:
- Each hook should grab attention in the first 1-2 seconds
- Create curiosity or urgency
- Make viewers want to watch till the end
- Be bold and direct`,
    };

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompts[type as keyof typeof systemPrompts] },
          { role: "user", content: `Create content based on this topic/script: ${inputText}` },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "generate_content",
              description: `Generate ${type}s for social media content`,
              parameters: {
                type: "object",
                properties: {
                  outputs: {
                    type: "array",
                    items: { type: "string" },
                    description: type === "hashtag" 
                      ? "Array with a single string containing all hashtags" 
                      : `Array of 3 generated ${type}s`,
                  },
                },
                required: ["outputs"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "generate_content" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please try again later." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("Failed to generate content");
    }

    const data = await response.json();
    console.log("AI response:", JSON.stringify(data));

    let outputs: string[] = [];
    
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (toolCall?.function?.arguments) {
      const args = JSON.parse(toolCall.function.arguments);
      outputs = args.outputs || [];
    }

    return new Response(
      JSON.stringify({ outputs }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Generate error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
