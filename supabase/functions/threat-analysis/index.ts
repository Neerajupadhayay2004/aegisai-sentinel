import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ThreatData {
  id: string;
  title: string;
  description: string;
  severity: string;
  source: string;
  targetAsset: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { threat }: { threat: ThreatData } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const analysisPrompt = `Analyze this cybersecurity threat and provide a comprehensive assessment:

Threat: ${threat.title}
Description: ${threat.description}
Severity: ${threat.severity}
Source: ${threat.source}
Target: ${threat.targetAsset}

Provide analysis in this exact JSON format:
{
  "mitre_attack": {
    "tactic": "string",
    "tactic_id": "string (e.g., TA0040)",
    "technique": "string",
    "technique_id": "string (e.g., T1486)",
    "sub_technique": "string or null",
    "kill_chain_phase": "string"
  },
  "business_impact": {
    "financial_impact_low": number,
    "financial_impact_high": number,
    "downtime_hours_low": number,
    "downtime_hours_high": number,
    "compliance_risk": "HIGH|MEDIUM|LOW",
    "reputation_risk": "SEVERE|MODERATE|LOW",
    "affected_systems": ["array of affected system types"]
  },
  "root_cause": {
    "entry_point": "string",
    "attack_vector": "string",
    "misconfiguration": "string or null",
    "policy_failure": "string or null",
    "lateral_movement_path": ["array of movement steps"]
  },
  "recommendations": [
    {
      "priority": "CRITICAL|HIGH|MEDIUM|LOW",
      "action": "string",
      "automated": boolean,
      "timeframe": "string"
    }
  ],
  "confidence_score": number (0-100),
  "related_iocs": ["array of indicators of compromise"]
}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "You are a cybersecurity expert AI. Always respond with valid JSON only, no markdown formatting." },
          { role: "user", content: analysisPrompt },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI analysis failed");
    }

    const data = await response.json();
    const analysisText = data.choices[0]?.message?.content || "{}";
    
    // Parse the JSON response
    let analysis;
    try {
      // Remove any markdown code blocks if present
      const cleanJson = analysisText.replace(/```json\n?|\n?```/g, '').trim();
      analysis = JSON.parse(cleanJson);
    } catch {
      console.error("Failed to parse AI response:", analysisText);
      analysis = { error: "Failed to parse analysis", raw: analysisText };
    }

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Threat analysis error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
