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

    console.log("Telegram config check - Token exists:", !!TELEGRAM_BOT_TOKEN, "Chat ID exists:", !!TELEGRAM_CHAT_ID);

    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      console.error("Missing credentials - Token:", !!TELEGRAM_BOT_TOKEN, "ChatID:", !!TELEGRAM_CHAT_ID);
      return new Response(JSON.stringify({ 
        success: false, 
        error: "Telegram credentials not configured",
        hint: "Please ensure TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID are set in secrets"
      }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Validate token format (should be like 123456789:ABCdefGHIjklMNOpqrSTUvwxYZ)
    const tokenRegex = /^\d+:[A-Za-z0-9_-]+$/;
    if (!tokenRegex.test(TELEGRAM_BOT_TOKEN)) {
      console.error("Invalid token format");
      return new Response(JSON.stringify({ 
        success: false, 
        error: "Invalid bot token format",
        hint: "Token should be in format: 123456789:ABCdefGHI..."
      }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
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

    console.log("Sending message to Telegram...");
    
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
    console.log("Telegram API response:", JSON.stringify(result));

    if (!result.ok) {
      console.error("Telegram API error:", result);
      
      // Provide helpful error messages
      let hint = "Unknown error";
      if (result.error_code === 404) {
        hint = "Bot not found or chat not started. Please send /start to your bot first.";
      } else if (result.error_code === 400) {
        hint = "Invalid chat_id. Make sure you're using the correct numeric chat ID.";
      } else if (result.error_code === 401) {
        hint = "Invalid bot token. Please verify the token is correct.";
      }
      
      return new Response(JSON.stringify({ 
        success: false, 
        error: result.description || "Failed to send Telegram message",
        hint: hint
      }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
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
