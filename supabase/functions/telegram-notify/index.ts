import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ThreatNotification {
  type: 'threat' | 'summary' | 'alert';
  severity?: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  message: string;
  threats?: Array<{
    title: string;
    severity: string;
    status: string;
    source: string;
  }>;
  metrics?: {
    activeThreats: number;
    blockedThreats: number;
    riskScore: number;
    endpointsAtRisk: number;
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const notification: ThreatNotification = await req.json();
    const TELEGRAM_BOT_TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN");
    const TELEGRAM_CHAT_ID = Deno.env.get("TELEGRAM_CHAT_ID");

    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      throw new Error("Telegram credentials not configured");
    }

    let message = "";

    if (notification.type === 'threat') {
      const severityEmoji = {
        critical: "🔴",
        high: "🟠", 
        medium: "🟡",
        low: "🟢"
      }[notification.severity || 'medium'];

      message = `${severityEmoji} *AegisAI Security Alert*\n\n` +
        `*${notification.title}*\n\n` +
        `${notification.message}\n\n` +
        `⏰ Time: ${new Date().toLocaleString()}\n` +
        `🎯 Action Required: Immediate`;
    } else if (notification.type === 'summary') {
      const metrics = notification.metrics!;
      message = `🛡️ *AegisAI Security Summary*\n\n` +
        `📊 *30-Minute Report*\n\n` +
        `🔴 Active Threats: ${metrics.activeThreats}\n` +
        `✅ Blocked Threats: ${metrics.blockedThreats}\n` +
        `⚠️ Risk Score: ${metrics.riskScore}/100\n` +
        `🖥️ Endpoints at Risk: ${metrics.endpointsAtRisk}\n\n`;

      if (notification.threats && notification.threats.length > 0) {
        message += `*Active Threats:*\n`;
        notification.threats.forEach((threat, i) => {
          const emoji = { critical: "🔴", high: "🟠", medium: "🟡", low: "🟢" }[threat.severity] || "⚪";
          message += `${i + 1}. ${emoji} ${threat.title}\n   └ Status: ${threat.status}\n`;
        });
      }

      message += `\n⏰ ${new Date().toLocaleString()}`;
    } else {
      message = `⚡ *AegisAI Alert*\n\n${notification.title}\n\n${notification.message}`;
    }

    const telegramResponse = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: "Markdown",
        }),
      }
    );

    const result = await telegramResponse.json();

    if (!result.ok) {
      console.error("Telegram API error:", result);
      throw new Error(result.description || "Failed to send Telegram message");
    }

    return new Response(JSON.stringify({ success: true, message_id: result.result.message_id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Telegram notification error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
