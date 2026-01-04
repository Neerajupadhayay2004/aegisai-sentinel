import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Globe, 
  AlertTriangle, 
  Shield, 
  Activity, 
  Zap, 
  X, 
  Volume2, 
  VolumeX,
  Bell,
  BellOff,
  MapPin,
  Target,
  Wifi,
  Radio,
  Server,
  Crosshair,
  Satellite,
  Radar,
  Cloud,
  Link2,
  Eye,
  Lock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useThreatAlerts } from '@/hooks/useThreatAlerts';

interface ThreatLocation {
  id: string;
  country: string;
  city: string;
  lat: number;
  lng: number;
  threatCount: number;
  severity: 'critical' | 'high' | 'medium' | 'low';
  type: string;
  ip: string;
}

interface AttackLine {
  id: number;
  from: ThreatLocation;
  progress: number;
  intercepted: boolean;
}

// Enhanced world map paths with more detail
const WORLD_CONTINENTS = {
  northAmerica: `M 50 80 L 90 60 L 140 55 L 180 65 L 210 85 L 230 110 L 225 140 L 200 170 L 165 185 L 130 180 L 100 200 L 80 180 L 60 160 L 45 130 L 50 100 Z`,
  southAmerica: `M 150 220 L 180 210 L 210 230 L 220 270 L 215 320 L 195 370 L 170 400 L 155 380 L 145 340 L 140 290 L 145 250 Z`,
  europe: `M 420 65 L 470 55 L 520 60 L 560 70 L 580 95 L 570 120 L 540 135 L 500 140 L 460 130 L 430 115 L 420 90 Z`,
  africa: `M 420 150 L 480 140 L 530 155 L 560 190 L 555 250 L 530 310 L 490 350 L 450 340 L 420 300 L 415 250 L 420 200 Z`,
  asia: `M 560 50 L 650 40 L 750 50 L 850 70 L 900 100 L 920 150 L 900 200 L 850 230 L 780 250 L 700 240 L 640 210 L 590 170 L 570 130 L 560 90 Z`,
  australia: `M 780 280 L 850 270 L 900 290 L 920 330 L 900 370 L 850 385 L 800 375 L 770 340 L 775 310 Z`,
  india: `M 640 160 L 680 150 L 720 170 L 730 210 L 710 250 L 670 260 L 640 240 L 635 200 Z`,
  middleEast: `M 540 140 L 600 130 L 640 150 L 650 190 L 620 220 L 570 210 L 545 180 Z`,
};

const threatLocations: ThreatLocation[] = [
  { id: '1', country: 'Russia', city: 'Moscow', lat: 55.76, lng: 37.62, threatCount: 156, severity: 'critical', type: 'APT Campaign', ip: '185.243.xxx.xxx' },
  { id: '2', country: 'China', city: 'Beijing', lat: 39.90, lng: 116.41, threatCount: 128, severity: 'critical', type: 'Supply Chain Attack', ip: '223.5.xxx.xxx' },
  { id: '3', country: 'North Korea', city: 'Pyongyang', lat: 39.04, lng: 125.76, threatCount: 89, severity: 'critical', type: 'Ransomware', ip: '175.45.xxx.xxx' },
  { id: '4', country: 'Iran', city: 'Tehran', lat: 35.69, lng: 51.39, threatCount: 67, severity: 'high', type: 'Wiper Malware', ip: '5.160.xxx.xxx' },
  { id: '5', country: 'Brazil', city: 'São Paulo', lat: -23.55, lng: -46.63, threatCount: 45, severity: 'high', type: 'Banking Trojan', ip: '177.67.xxx.xxx' },
  { id: '6', country: 'Nigeria', city: 'Lagos', lat: 6.52, lng: 3.38, threatCount: 34, severity: 'medium', type: 'BEC Fraud', ip: '41.58.xxx.xxx' },
  { id: '7', country: 'USA', city: 'Miami', lat: 25.76, lng: -80.19, threatCount: 23, severity: 'low', type: 'Botnet Activity', ip: '173.245.xxx.xxx' },
  { id: '8', country: 'Germany', city: 'Frankfurt', lat: 50.11, lng: 8.68, threatCount: 18, severity: 'medium', type: 'DDoS Amplifier', ip: '88.198.xxx.xxx' },
  { id: '9', country: 'India', city: 'Mumbai', lat: 19.08, lng: 72.88, threatCount: 78, severity: 'high', type: 'Cryptojacking', ip: '49.37.xxx.xxx' },
  { id: '10', country: 'Ukraine', city: 'Kyiv', lat: 50.45, lng: 30.52, threatCount: 112, severity: 'critical', type: 'Destructive Malware', ip: '91.214.xxx.xxx' },
  { id: '11', country: 'Australia', city: 'Sydney', lat: -33.87, lng: 151.21, threatCount: 15, severity: 'low', type: 'Phishing', ip: '203.2.xxx.xxx' },
  { id: '12', country: 'Japan', city: 'Tokyo', lat: 35.68, lng: 139.65, threatCount: 42, severity: 'medium', type: 'Credential Stuffing', ip: '133.242.xxx.xxx' },
  { id: '13', country: 'UK', city: 'London', lat: 51.51, lng: -0.13, threatCount: 31, severity: 'medium', type: 'Insider Threat', ip: '185.93.xxx.xxx' },
  { id: '14', country: 'South Korea', city: 'Seoul', lat: 37.57, lng: 126.98, threatCount: 28, severity: 'medium', type: 'Zero-day Exploit', ip: '211.252.xxx.xxx' },
  { id: '15', country: 'Singapore', city: 'Singapore', lat: 1.35, lng: 103.82, threatCount: 19, severity: 'low', type: 'Data Exfiltration', ip: '203.116.xxx.xxx' },
];

const latLngToSVG = (lat: number, lng: number, width: number = 1000, height: number = 450) => {
  const x = ((lng + 180) / 360) * width;
  const y = ((90 - lat) / 180) * height;
  return { x, y };
};

export const GlobalThreatMapAdvanced = () => {
  const [threats] = useState<ThreatLocation[]>(threatLocations);
  const [selectedThreat, setSelectedThreat] = useState<ThreatLocation | null>(null);
  const [attackLines, setAttackLines] = useState<AttackLine[]>([]);
  const [liveStats, setLiveStats] = useState({
    totalAttacks: 24589,
    blocked: 24312,
    intercepted: 277,
    activeThreats: threats.length,
  });
  const [hoveredThreat, setHoveredThreat] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'map' | 'satellite' | 'threat'>('map');
  
  const { 
    soundEnabled, 
    notificationsEnabled, 
    toggleSound, 
    requestNotifications,
    triggerAlert 
  } = useThreatAlerts();

  // Target position (HQ in India)
  const targetPos = latLngToSVG(28.61, 77.21);

  // Generate attack lines
  useEffect(() => {
    let attackId = 0;
    const interval = setInterval(() => {
      const randomThreat = threats[Math.floor(Math.random() * threats.length)];
      const isIntercepted = Math.random() > 0.12;
      
      setAttackLines(prev => [...prev.slice(-15), { 
        id: attackId++, 
        from: randomThreat, 
        progress: 0,
        intercepted: isIntercepted
      }]);
      
      setLiveStats(prev => ({
        ...prev,
        totalAttacks: prev.totalAttacks + 1,
        blocked: isIntercepted ? prev.blocked + 1 : prev.blocked,
        intercepted: !isIntercepted ? prev.intercepted + 1 : prev.intercepted,
      }));

      if (randomThreat.severity === 'critical' && Math.random() > 0.9) {
        triggerAlert(
          randomThreat.type,
          randomThreat.severity,
          `${randomThreat.city}, ${randomThreat.country}`,
          `Active threat from ${randomThreat.ip}`
        );
      }
    }, 600);

    return () => clearInterval(interval);
  }, [threats, triggerAlert]);

  // Animate attack lines
  useEffect(() => {
    const interval = setInterval(() => {
      setAttackLines(prev => 
        prev.map(line => ({ ...line, progress: Math.min(line.progress + 0.018, 1) }))
            .filter(line => line.progress < 1)
      );
    }, 16);
    return () => clearInterval(interval);
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return '#ff3b3b';
      case 'high': return '#ff8c00';
      case 'medium': return '#ffd700';
      case 'low': return '#00ff88';
      default: return '#888888';
    }
  };

  const criticalThreats = threats.filter(t => t.severity === 'critical');
  const totalThreatCount = threats.reduce((acc, t) => acc + t.threatCount, 0);

  return (
    <Card variant="glass" className="relative overflow-hidden">
      <CardHeader className="pb-2 px-4 sm:px-6">
        <CardTitle className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Globe className="h-7 w-7 text-primary animate-pulse" />
              <div className="absolute inset-0 bg-primary/40 blur-lg rounded-full" />
            </div>
            <div>
              <span className="text-xl font-bold">
                <span className="text-gradient-cyber">Global</span> Threat Intelligence
              </span>
              <p className="text-xs text-muted-foreground">Real-time cyber attack visualization powered by Azure Sentinel</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={toggleSound}>
              {soundEnabled ? <Volume2 className="h-4 w-4 text-primary" /> : <VolumeX className="h-4 w-4 text-muted-foreground" />}
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={requestNotifications}>
              {notificationsEnabled ? <Bell className="h-4 w-4 text-primary" /> : <BellOff className="h-4 w-4 text-muted-foreground" />}
            </Button>
            <Badge variant="critical" className="animate-pulse">
              <Radio className="h-3 w-3 mr-1 animate-pulse" />
              LIVE
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        {/* Integration Badges */}
        <div className="flex items-center justify-center gap-2 px-4 py-2 bg-secondary/20 border-y border-border/30 flex-wrap">
          <Badge variant="info" className="text-[10px] gap-1">
            <Cloud className="h-3 w-3" />
            Azure Sentinel
          </Badge>
          <Badge variant="success" className="text-[10px] gap-1">
            <Shield className="h-3 w-3" />
            Defender XDR
          </Badge>
          <Badge className="text-[10px] gap-1 bg-purple-500/20 text-purple-400 border-purple-500/30">
            <Link2 className="h-3 w-3" />
            Blockchain Verified
          </Badge>
          <Badge variant="outline" className="text-[10px] gap-1">
            <Eye className="h-3 w-3" />
            AI Analysis
          </Badge>
        </div>

        {/* Enhanced Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 px-4 sm:px-6 py-3 bg-gradient-to-r from-secondary/30 via-secondary/50 to-secondary/30">
          <motion.div 
            className="text-center p-2 rounded-lg bg-background/60 backdrop-blur-sm border border-border/30"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="text-xl sm:text-2xl font-bold text-destructive">{liveStats.totalAttacks.toLocaleString()}</div>
            <div className="text-[10px] sm:text-xs text-muted-foreground flex items-center justify-center gap-1">
              <Zap className="h-3 w-3" />
              Total Attacks
            </div>
          </motion.div>
          <motion.div 
            className="text-center p-2 rounded-lg bg-background/60 backdrop-blur-sm border border-border/30"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          >
            <div className="text-xl sm:text-2xl font-bold text-success">{liveStats.blocked.toLocaleString()}</div>
            <div className="text-[10px] sm:text-xs text-muted-foreground flex items-center justify-center gap-1">
              <Shield className="h-3 w-3" />
              Blocked
            </div>
          </motion.div>
          <motion.div 
            className="text-center p-2 rounded-lg bg-background/60 backdrop-blur-sm border border-border/30"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
          >
            <div className="text-xl sm:text-2xl font-bold text-warning">{criticalThreats.length}</div>
            <div className="text-[10px] sm:text-xs text-muted-foreground flex items-center justify-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              Critical Sources
            </div>
          </motion.div>
          <motion.div 
            className="text-center p-2 rounded-lg bg-background/60 backdrop-blur-sm border border-border/30"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
          >
            <div className="text-xl sm:text-2xl font-bold text-primary">
              {((liveStats.blocked / liveStats.totalAttacks) * 100).toFixed(2)}%
            </div>
            <div className="text-[10px] sm:text-xs text-muted-foreground flex items-center justify-center gap-1">
              <Target className="h-3 w-3" />
              Success Rate
            </div>
          </motion.div>
        </div>

        {/* Map Container */}
        <div className="relative w-full aspect-[2/1] min-h-[400px] sm:min-h-[500px] lg:min-h-[600px] bg-gradient-radial from-primary/5 via-background to-background overflow-hidden">
          {/* Animated Background Grid */}
          <div className="absolute inset-0 pointer-events-none opacity-40">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="hexGrid" width="40" height="35" patternUnits="userSpaceOnUse">
                  <path d="M20 0 L40 10 L40 30 L20 40 L0 30 L0 10 Z" 
                        fill="none" stroke="hsl(var(--primary))" strokeWidth="0.3" opacity="0.4" />
                </pattern>
                <linearGradient id="gridFade" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="white" stopOpacity="1" />
                  <stop offset="50%" stopColor="white" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="white" stopOpacity="0" />
                </linearGradient>
              </defs>
              <rect width="100%" height="100%" fill="url(#hexGrid)" mask="url(#gridFade)" />
            </svg>
          </div>

          {/* Glowing Orbs Background */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <motion.div 
              className="absolute top-1/4 left-1/6 w-64 h-64 bg-red-500/10 rounded-full blur-3xl"
              animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.3, 1] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            <motion.div 
              className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/10 rounded-full blur-3xl"
              animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.2, 1] }}
              transition={{ duration: 5, repeat: Infinity, delay: 1 }}
            />
            <motion.div 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl"
              animate={{ opacity: [0.1, 0.3, 0.1] }}
              transition={{ duration: 6, repeat: Infinity, delay: 2 }}
            />
          </div>

          {/* SVG Map */}
          <svg 
            viewBox="0 0 1000 450" 
            className="absolute inset-0 w-full h-full"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              {/* Gradients */}
              <radialGradient id="targetGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#00ff88" stopOpacity="1" />
                <stop offset="50%" stopColor="#00ff88" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#00ff88" stopOpacity="0" />
              </radialGradient>
              
              <radialGradient id="threatGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ff3b3b" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#ff3b3b" stopOpacity="0" />
              </radialGradient>

              <radialGradient id="azureGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#0078d4" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#0078d4" stopOpacity="0" />
              </radialGradient>

              {/* Filters */}
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>

              <filter id="strongGlow" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            {/* World Map Continents */}
            {Object.entries(WORLD_CONTINENTS).map(([name, path]) => (
              <path 
                key={name}
                d={path} 
                fill="hsl(var(--primary))" 
                fillOpacity="0.15"
                stroke="hsl(var(--primary))"
                strokeWidth="1.5"
                strokeOpacity="0.5"
                filter="url(#glow)"
                className="transition-all duration-300 hover:fill-opacity-25"
              />
            ))}

            {/* Grid Lines */}
            {[...Array(9)].map((_, i) => (
              <line 
                key={`h-${i}`}
                x1="0" 
                y1={50 * (i + 1)} 
                x2="1000" 
                y2={50 * (i + 1)} 
                stroke="hsl(var(--primary))" 
                strokeOpacity="0.1" 
                strokeWidth="0.5"
              />
            ))}
            {[...Array(19)].map((_, i) => (
              <line 
                key={`v-${i}`}
                x1={50 * (i + 1)} 
                y1="0" 
                x2={50 * (i + 1)} 
                y2="450" 
                stroke="hsl(var(--primary))" 
                strokeOpacity="0.1" 
                strokeWidth="0.5"
              />
            ))}

            {/* Attack Lines with Bezier Curves */}
            {attackLines.map((attack) => {
              const fromPos = latLngToSVG(attack.from.lat, attack.from.lng);
              const progress = attack.progress;
              
              // Create curved path
              const midX = (fromPos.x + targetPos.x) / 2;
              const midY = Math.min(fromPos.y, targetPos.y) - 60 - Math.random() * 30;
              
              // Calculate current position on curve
              const t = progress;
              const currentX = Math.pow(1-t, 2) * fromPos.x + 2 * (1-t) * t * midX + Math.pow(t, 2) * targetPos.x;
              const currentY = Math.pow(1-t, 2) * fromPos.y + 2 * (1-t) * t * midY + Math.pow(t, 2) * targetPos.y;
              
              return (
                <g key={attack.id}>
                  {/* Trail */}
                  <path
                    d={`M ${fromPos.x} ${fromPos.y} Q ${midX} ${midY} ${currentX} ${currentY}`}
                    fill="none"
                    stroke={attack.intercepted ? getSeverityColor(attack.from.severity) : '#00ff88'}
                    strokeWidth="2"
                    strokeOpacity={0.6}
                    filter="url(#glow)"
                  />
                  
                  {/* Moving point */}
                  <circle 
                    cx={currentX} 
                    cy={currentY} 
                    r="4" 
                    fill={attack.intercepted ? getSeverityColor(attack.from.severity) : '#00ff88'}
                    filter="url(#strongGlow)"
                  />

                  {/* Intercept effect */}
                  {progress > 0.85 && attack.intercepted && (
                    <circle
                      cx={targetPos.x}
                      cy={targetPos.y}
                      r={(1 - progress) * 100 + 20}
                      fill="none"
                      stroke="#00ff88"
                      strokeWidth="2"
                      opacity={(1 - progress) * 3}
                      filter="url(#glow)"
                    />
                  )}
                </g>
              );
            })}

            {/* Threat Points */}
            {threats.map((threat) => {
              const pos = latLngToSVG(threat.lat, threat.lng);
              const isHovered = hoveredThreat === threat.id;
              const size = threat.severity === 'critical' ? 10 : threat.severity === 'high' ? 8 : 6;
              
              return (
                <g 
                  key={threat.id}
                  onMouseEnter={() => setHoveredThreat(threat.id)}
                  onMouseLeave={() => setHoveredThreat(null)}
                  onClick={() => setSelectedThreat(threat)}
                  className="cursor-pointer"
                >
                  {/* Pulse effect */}
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={size + 15}
                    fill="none"
                    stroke={getSeverityColor(threat.severity)}
                    strokeWidth="1"
                    opacity={isHovered ? 0.5 : 0.2}
                  >
                    <animate attributeName="r" values={`${size};${size + 20};${size}`} dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.5;0;0.5" dur="2s" repeatCount="indefinite" />
                  </circle>
                  
                  {/* Outer glow */}
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={size + 6}
                    fill={getSeverityColor(threat.severity)}
                    opacity="0.2"
                    filter="url(#glow)"
                  />
                  
                  {/* Main dot */}
                  <circle 
                    cx={pos.x} 
                    cy={pos.y} 
                    r={isHovered ? size + 3 : size}
                    fill={getSeverityColor(threat.severity)}
                    stroke="white"
                    strokeWidth="1"
                    strokeOpacity="0.5"
                    filter="url(#glow)"
                    className="transition-all duration-200"
                  />
                  
                  {/* Label on hover */}
                  {isHovered && (
                    <g>
                      <rect 
                        x={pos.x + 12} 
                        y={pos.y - 25} 
                        width={120} 
                        height={50} 
                        rx="4"
                        fill="hsl(var(--background))"
                        fillOpacity="0.95"
                        stroke={getSeverityColor(threat.severity)}
                        strokeWidth="1"
                      />
                      <text x={pos.x + 20} y={pos.y - 8} fill="white" fontSize="10" fontWeight="bold">
                        {threat.city}, {threat.country}
                      </text>
                      <text x={pos.x + 20} y={pos.y + 5} fill={getSeverityColor(threat.severity)} fontSize="9">
                        {threat.type}
                      </text>
                      <text x={pos.x + 20} y={pos.y + 18} fill="#888" fontSize="8">
                        {threat.threatCount} threats • {threat.ip}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}

            {/* Target HQ */}
            <g>
              {/* Outer rings */}
              <circle cx={targetPos.x} cy={targetPos.y} r="35" fill="none" stroke="#00ff88" strokeWidth="1" opacity="0.3">
                <animate attributeName="r" values="35;45;35" dur="3s" repeatCount="indefinite" />
              </circle>
              <circle cx={targetPos.x} cy={targetPos.y} r="25" fill="none" stroke="#00ff88" strokeWidth="1.5" opacity="0.5">
                <animate attributeName="r" values="25;35;25" dur="2s" repeatCount="indefinite" />
              </circle>
              
              {/* Shield background */}
              <circle cx={targetPos.x} cy={targetPos.y} r="18" fill="url(#targetGlow)" />
              
              {/* Shield icon background */}
              <circle cx={targetPos.x} cy={targetPos.y} r="12" fill="hsl(var(--background))" stroke="#00ff88" strokeWidth="2" />
              
              {/* HQ Label */}
              <text x={targetPos.x} y={targetPos.y + 35} fill="#00ff88" fontSize="10" textAnchor="middle" fontWeight="bold">
                AEGIS HQ
              </text>
              <text x={targetPos.x} y={targetPos.y + 45} fill="#888" fontSize="8" textAnchor="middle">
                New Delhi, India
              </text>
            </g>

            {/* Radar sweep effect */}
            <g transform={`translate(${targetPos.x}, ${targetPos.y})`}>
              <defs>
                <linearGradient id="radarGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#00ff88" stopOpacity="0" />
                  <stop offset="100%" stopColor="#00ff88" stopOpacity="0.4" />
                </linearGradient>
              </defs>
              <path
                d="M 0 0 L 80 -30 A 85 85 0 0 1 80 30 Z"
                fill="url(#radarGrad)"
              >
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="0"
                  to="360"
                  dur="4s"
                  repeatCount="indefinite"
                />
              </path>
            </g>
          </svg>

          {/* Selected Threat Panel */}
          <AnimatePresence>
            {selectedThreat && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="absolute top-4 right-4 w-72 bg-background/95 backdrop-blur-lg rounded-lg border border-primary/30 shadow-xl"
              >
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant={selectedThreat.severity === 'critical' ? 'critical' : selectedThreat.severity === 'high' ? 'high' : 'medium'}>
                      {selectedThreat.severity.toUpperCase()}
                    </Badge>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setSelectedThreat(null)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <h3 className="font-bold text-lg">{selectedThreat.city}</h3>
                  <p className="text-sm text-muted-foreground">{selectedThreat.country}</p>
                  <div className="mt-3 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Attack Type</span>
                      <span className="font-medium">{selectedThreat.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Threat Count</span>
                      <span className="font-medium text-destructive">{selectedThreat.threatCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Source IP</span>
                      <span className="font-mono text-xs">{selectedThreat.ip}</span>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button size="sm" variant="destructive" className="flex-1">
                      <Lock className="h-3 w-3 mr-1" />
                      Block
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <Eye className="h-3 w-3 mr-1" />
                      Investigate
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Stats */}
        <div className="px-4 py-3 bg-secondary/20 border-t border-border/30">
          <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1 text-muted-foreground">
                <div className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
                Critical: {criticalThreats.length}
              </span>
              <span className="flex items-center gap-1 text-muted-foreground">
                <div className="w-2 h-2 rounded-full bg-orange-400" />
                High: {threats.filter(t => t.severity === 'high').length}
              </span>
              <span className="flex items-center gap-1 text-muted-foreground">
                <div className="w-2 h-2 rounded-full bg-warning" />
                Medium: {threats.filter(t => t.severity === 'medium').length}
              </span>
              <span className="flex items-center gap-1 text-muted-foreground">
                <div className="w-2 h-2 rounded-full bg-primary" />
                Low: {threats.filter(t => t.severity === 'low').length}
              </span>
            </div>
            <span className="text-muted-foreground">
              Last updated: Just now
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
