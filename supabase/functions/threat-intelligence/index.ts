import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// High-risk countries for geolocation blocking
const HIGH_RISK_COUNTRIES = [
  { code: "CN", name: "China", riskLevel: "critical", blockedIPs: 15847 },
  { code: "RU", name: "Russia", riskLevel: "critical", blockedIPs: 12453 },
  { code: "KP", name: "North Korea", riskLevel: "critical", blockedIPs: 3421 },
  { code: "IR", name: "Iran", riskLevel: "high", blockedIPs: 8932 },
  { code: "NG", name: "Nigeria", riskLevel: "high", blockedIPs: 5621 },
  { code: "VN", name: "Vietnam", riskLevel: "medium", blockedIPs: 2341 },
  { code: "BR", name: "Brazil", riskLevel: "medium", blockedIPs: 4532 },
  { code: "IN", name: "India", riskLevel: "medium", blockedIPs: 6721 },
  { code: "PK", name: "Pakistan", riskLevel: "medium", blockedIPs: 1892 },
  { code: "ID", name: "Indonesia", riskLevel: "low", blockedIPs: 2134 },
];

// Simulated threat intelligence data
const generateThreatIntelligence = () => {
  const threatTypes = [
    "DDoS Attack", "SQL Injection", "Brute Force", "Ransomware", 
    "Phishing", "Zero-Day Exploit", "Malware", "XSS Attack",
    "API Abuse", "Credential Stuffing", "Man-in-the-Middle"
  ];

  const cities = [
    { name: "Beijing", country: "China", lat: 39.9, lng: 116.4 },
    { name: "Moscow", country: "Russia", lat: 55.75, lng: 37.62 },
    { name: "Tehran", country: "Iran", lat: 35.7, lng: 51.4 },
    { name: "Pyongyang", country: "North Korea", lat: 39.03, lng: 125.75 },
    { name: "Lagos", country: "Nigeria", lat: 6.52, lng: 3.38 },
    { name: "Ho Chi Minh", country: "Vietnam", lat: 10.82, lng: 106.63 },
    { name: "São Paulo", country: "Brazil", lat: -23.55, lng: -46.63 },
    { name: "Mumbai", country: "India", lat: 19.08, lng: 72.88 },
    { name: "Karachi", country: "Pakistan", lat: 24.86, lng: 67.01 },
    { name: "Jakarta", country: "Indonesia", lat: -6.21, lng: 106.85 },
  ];

  const threats = [];
  const numThreats = Math.floor(Math.random() * 10) + 15;

  for (let i = 0; i < numThreats; i++) {
    const city = cities[Math.floor(Math.random() * cities.length)];
    const severity = Math.random() < 0.2 ? "critical" : Math.random() < 0.4 ? "high" : Math.random() < 0.7 ? "medium" : "low";
    const status = Math.random() < 0.7 ? "blocked" : Math.random() < 0.85 ? "investigating" : "active";
    
    threats.push({
      id: `threat-${Date.now()}-${i}`,
      type: threatTypes[Math.floor(Math.random() * threatTypes.length)],
      severity,
      status,
      source: {
        ip: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        city: city.name,
        country: city.country,
        lat: city.lat + (Math.random() - 0.5) * 2,
        lng: city.lng + (Math.random() - 0.5) * 2,
      },
      target: {
        ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        service: ["Web Server", "Database", "API Gateway", "Mail Server", "DNS", "VPN"][Math.floor(Math.random() * 6)],
        port: [80, 443, 22, 3306, 5432, 27017][Math.floor(Math.random() * 6)],
      },
      timestamp: new Date(Date.now() - Math.random() * 3600000).toISOString(),
      confidence: Math.floor(Math.random() * 30) + 70,
      iocIndicators: Math.floor(Math.random() * 5) + 1,
    });
  }

  return threats;
};

// Generate attack statistics
const generateStats = () => {
  return {
    totalAttacks24h: Math.floor(Math.random() * 5000) + 15000,
    blockedAttacks: Math.floor(Math.random() * 4500) + 14000,
    activeThreats: Math.floor(Math.random() * 20) + 5,
    criticalAlerts: Math.floor(Math.random() * 5) + 1,
    averageResponseTime: `${Math.floor(Math.random() * 50) + 10}ms`,
    threatTrend: Math.random() < 0.5 ? "increasing" : "decreasing",
    topAttackType: ["DDoS", "Brute Force", "SQL Injection", "Phishing"][Math.floor(Math.random() * 4)],
    countriesTargeted: Math.floor(Math.random() * 30) + 50,
  };
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, data } = await req.json();

    switch (action) {
      case "get_threats": {
        const threats = generateThreatIntelligence();
        const stats = generateStats();
        return new Response(JSON.stringify({ threats, stats }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "get_blocked_countries": {
        return new Response(JSON.stringify({ countries: HIGH_RISK_COUNTRIES }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "block_country": {
        const { countryCode, block } = data;
        console.log(`${block ? "Blocking" : "Unblocking"} country: ${countryCode}`);
        return new Response(JSON.stringify({ 
          success: true, 
          message: `Country ${countryCode} has been ${block ? "blocked" : "unblocked"}`,
          countryCode,
          blocked: block,
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "block_ip": {
        const { ip, reason } = data;
        console.log(`Blocking IP: ${ip}, Reason: ${reason}`);
        return new Response(JSON.stringify({ 
          success: true, 
          message: `IP ${ip} has been blocked`,
          ip,
          reason,
          timestamp: new Date().toISOString(),
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "analyze_threat": {
        const { threatId, threatData } = data;
        const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
        
        if (!LOVABLE_API_KEY) {
          throw new Error("LOVABLE_API_KEY is not configured");
        }

        const analysisPrompt = `Analyze this cybersecurity threat and provide detailed recommendations:
        
Threat Type: ${threatData.type}
Severity: ${threatData.severity}
Source IP: ${threatData.source.ip}
Source Location: ${threatData.source.city}, ${threatData.source.country}
Target Service: ${threatData.target.service}
Target Port: ${threatData.target.port}

Provide a JSON response with:
1. risk_assessment: detailed risk analysis
2. mitigation_steps: array of immediate actions to take
3. long_term_recommendations: array of long-term security improvements
4. similar_attacks: description of similar attack patterns
5. estimated_impact: business impact assessment
6. mitre_attack_mapping: relevant MITRE ATT&CK techniques`;

        const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash",
            messages: [
              { role: "system", content: "You are a cybersecurity expert AI. Always respond with valid JSON only." },
              { role: "user", content: analysisPrompt },
            ],
          }),
        });

        if (!response.ok) {
          if (response.status === 429) {
            return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
              status: 429,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
          }
          throw new Error("AI analysis failed");
        }

        const aiData = await response.json();
        const analysisText = aiData.choices[0]?.message?.content || "{}";
        
        let analysis;
        try {
          const cleanJson = analysisText.replace(/```json\n?|\n?```/g, '').trim();
          analysis = JSON.parse(cleanJson);
        } catch {
          analysis = { raw_analysis: analysisText };
        }

        return new Response(JSON.stringify({ 
          threatId, 
          analysis,
          analyzedAt: new Date().toISOString(),
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      default:
        return new Response(JSON.stringify({ error: "Unknown action" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
  } catch (error) {
    console.error("Threat intelligence error:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Unknown error" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
