import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, upgrade',
};

// Threat locations for simulation
const threatLocations = [
  { country: 'Russia', city: 'Moscow', lat: 55.76, lng: 37.62, types: ['APT Campaign', 'Brute Force', 'Ransomware'] },
  { country: 'China', city: 'Beijing', lat: 39.90, lng: 116.41, types: ['Supply Chain', 'Espionage', 'Zero-day'] },
  { country: 'North Korea', city: 'Pyongyang', lat: 39.04, lng: 125.76, types: ['Ransomware', 'Crypto Mining'] },
  { country: 'Iran', city: 'Tehran', lat: 35.69, lng: 51.39, types: ['Wiper Malware', 'DDoS'] },
  { country: 'Brazil', city: 'São Paulo', lat: -23.55, lng: -46.63, types: ['Banking Trojan', 'Phishing'] },
  { country: 'Nigeria', city: 'Lagos', lat: 6.52, lng: 3.38, types: ['BEC Fraud', 'Scam'] },
  { country: 'USA', city: 'Miami', lat: 25.76, lng: -80.19, types: ['Botnet', 'Credential Stuffing'] },
  { country: 'Germany', city: 'Frankfurt', lat: 50.11, lng: 8.68, types: ['DDoS Amplifier', 'Proxy Abuse'] },
  { country: 'India', city: 'Mumbai', lat: 19.08, lng: 72.88, types: ['Cryptojacking', 'Tech Support Scam'] },
  { country: 'Ukraine', city: 'Kyiv', lat: 50.45, lng: 30.52, types: ['Destructive Malware', 'Wipers'] },
];

const severities = ['critical', 'high', 'medium', 'low'] as const;
const statuses = ['active', 'blocked', 'investigating'] as const;

function generateThreat() {
  const location = threatLocations[Math.floor(Math.random() * threatLocations.length)];
  const severity = severities[Math.floor(Math.random() * (Math.random() > 0.7 ? 2 : 4))];
  const type = location.types[Math.floor(Math.random() * location.types.length)];
  const isBlocked = Math.random() > 0.15;
  
  return {
    id: crypto.randomUUID(),
    type,
    severity,
    status: isBlocked ? 'blocked' : statuses[Math.floor(Math.random() * 2)],
    source: {
      ip: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.xxx.xxx`,
      city: location.city,
      country: location.country,
      lat: location.lat,
      lng: location.lng,
    },
    target: {
      ip: '10.0.0.' + Math.floor(Math.random() * 255),
      service: ['HTTP', 'SSH', 'RDP', 'SMTP', 'DNS', 'FTP'][Math.floor(Math.random() * 6)],
      port: [80, 443, 22, 3389, 25, 53, 21][Math.floor(Math.random() * 7)],
    },
    timestamp: new Date().toISOString(),
    confidence: Math.floor(70 + Math.random() * 30),
    iocIndicators: Math.floor(1 + Math.random() * 8),
    mitreTactic: ['Initial Access', 'Execution', 'Persistence', 'Privilege Escalation', 'Defense Evasion'][Math.floor(Math.random() * 5)],
    mitreTechnique: ['T1566', 'T1059', 'T1078', 'T1548', 'T1070'][Math.floor(Math.random() * 5)],
  };
}

function generateDarkWebAlert() {
  const alertTypes = [
    { type: 'credential_leak', message: 'Employee credentials found on dark web marketplace' },
    { type: 'data_breach', message: 'Company data mentioned in threat actor forum' },
    { type: 'ransomware_mention', message: 'Organization listed as potential target by ransomware group' },
    { type: 'exploit_sale', message: 'Zero-day exploit targeting your software stack for sale' },
    { type: 'insider_threat', message: 'Internal access credentials being traded' },
  ];
  
  const alert = alertTypes[Math.floor(Math.random() * alertTypes.length)];
  
  return {
    id: crypto.randomUUID(),
    ...alert,
    severity: ['critical', 'high'][Math.floor(Math.random() * 2)],
    source: ['Genesis Market', 'Russian Market', 'Exploit.in', 'BreachForums', 'Telegram Channel'][Math.floor(Math.random() * 5)],
    timestamp: new Date().toISOString(),
    affectedAssets: Math.floor(1 + Math.random() * 50),
    riskScore: Math.floor(70 + Math.random() * 30),
  };
}

function generateAutomatedResponse(threat: ReturnType<typeof generateThreat>) {
  const actions = [];
  
  if (threat.severity === 'critical') {
    actions.push(
      { action: 'isolate_endpoint', status: 'completed', timestamp: new Date().toISOString() },
      { action: 'block_ip', status: 'completed', timestamp: new Date().toISOString() },
      { action: 'revoke_credentials', status: 'in_progress', timestamp: new Date().toISOString() },
      { action: 'notify_soc', status: 'pending', timestamp: new Date().toISOString() },
    );
  } else if (threat.severity === 'high') {
    actions.push(
      { action: 'block_ip', status: 'completed', timestamp: new Date().toISOString() },
      { action: 'quarantine_file', status: 'completed', timestamp: new Date().toISOString() },
    );
  } else {
    actions.push(
      { action: 'log_event', status: 'completed', timestamp: new Date().toISOString() },
      { action: 'update_rules', status: 'pending', timestamp: new Date().toISOString() },
    );
  }
  
  return {
    threatId: threat.id,
    playbook: threat.severity === 'critical' ? 'Critical Incident Response' : 'Standard Threat Response',
    actions,
    automated: true,
    executionTime: Math.floor(100 + Math.random() * 2000) + 'ms',
  };
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const { headers } = req;
  const upgradeHeader = headers.get("upgrade") || "";

  // Handle WebSocket upgrade
  if (upgradeHeader.toLowerCase() === "websocket") {
    const { socket, response } = Deno.upgradeWebSocket(req);
    
    let threatInterval: number;
    let darkWebInterval: number;
    let statsInterval: number;
    
    socket.onopen = () => {
      console.log("WebSocket client connected");
      
      // Send initial data
      socket.send(JSON.stringify({
        type: 'connection_established',
        timestamp: new Date().toISOString(),
        message: 'Real-time threat streaming active',
      }));
      
      // Stream threats every 800ms
      threatInterval = setInterval(() => {
        const threat = generateThreat();
        socket.send(JSON.stringify({
          type: 'threat',
          data: threat,
        }));
        
        // Generate automated response for some threats
        if (threat.status === 'blocked' || threat.severity === 'critical') {
          setTimeout(() => {
            socket.send(JSON.stringify({
              type: 'automated_response',
              data: generateAutomatedResponse(threat),
            }));
          }, 500);
        }
      }, 800);
      
      // Stream dark web alerts every 15 seconds
      darkWebInterval = setInterval(() => {
        if (Math.random() > 0.6) {
          socket.send(JSON.stringify({
            type: 'dark_web_alert',
            data: generateDarkWebAlert(),
          }));
        }
      }, 15000);
      
      // Stream stats every 2 seconds
      statsInterval = setInterval(() => {
        socket.send(JSON.stringify({
          type: 'stats_update',
          data: {
            totalAttacks: Math.floor(24000 + Math.random() * 1000),
            blocked: Math.floor(23500 + Math.random() * 500),
            activeThreats: Math.floor(5 + Math.random() * 15),
            criticalAlerts: Math.floor(1 + Math.random() * 5),
            responseTime: Math.floor(100 + Math.random() * 400) + 'ms',
          },
        }));
      }, 2000);
    };
    
    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        console.log("Received message:", message);
        
        if (message.type === 'subscribe') {
          socket.send(JSON.stringify({
            type: 'subscribed',
            channels: message.channels || ['threats', 'dark_web', 'stats'],
          }));
        }
        
        if (message.type === 'block_ip') {
          socket.send(JSON.stringify({
            type: 'ip_blocked',
            data: {
              ip: message.ip,
              timestamp: new Date().toISOString(),
              success: true,
            },
          }));
        }
      } catch (e) {
        console.error("Error parsing message:", e);
      }
    };
    
    socket.onclose = () => {
      console.log("WebSocket client disconnected");
      clearInterval(threatInterval);
      clearInterval(darkWebInterval);
      clearInterval(statsInterval);
    };
    
    socket.onerror = (e) => {
      console.error("WebSocket error:", e);
    };
    
    return response;
  }

  // Handle regular HTTP requests
  try {
    const { action } = await req.json();
    
    if (action === 'get_current_threats') {
      const threats = Array.from({ length: 10 }, () => generateThreat());
      return new Response(JSON.stringify({ threats }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    if (action === 'get_dark_web_alerts') {
      const alerts = Array.from({ length: 5 }, () => generateDarkWebAlert());
      return new Response(JSON.stringify({ alerts }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    return new Response(JSON.stringify({ error: 'Unknown action' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
