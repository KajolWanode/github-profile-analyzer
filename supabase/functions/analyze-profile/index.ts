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
    const { github } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const prompt = `Analyze this developer profile and provide career insights.

GitHub Data:
- Username: ${github.user.login}
- Name: ${github.user.name || "N/A"}
- Bio: ${github.user.bio || "N/A"}
- Repos: ${github.repos.length}
- Followers: ${github.user.followers}
- Languages: ${github.languages.map((l: any) => l.name).join(", ")}
- Active Repos (6mo): ${github.contributionStats.activeRepos}
- GitHub Strengths: ${github.strengths.join("; ")}
- GitHub Weaknesses: ${github.weaknesses.join("; ")}

Provide a JSON response with:
1. recommendations: Array of 5 objects with { id, title, description, priority (high/medium/low), category, impact }
2. roadmap: Array of 3 phases (7-day, 30-day, 90-day) each with items array of { task, howTo, expectedOutcome }
3. careerPredictions: Array of 4 objects with { role, confidence (0-100), reasoning, skillsNeeded (array) }

Be specific and actionable. Return only valid JSON.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: "You are a career advisor AI. Return only valid JSON." },
          { role: "user", content: prompt },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("AI error:", text);
      throw new Error("AI analysis failed");
    }

    const aiData = await response.json();
    const content = aiData.choices?.[0]?.message?.content;
    const parsed = JSON.parse(content);

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
