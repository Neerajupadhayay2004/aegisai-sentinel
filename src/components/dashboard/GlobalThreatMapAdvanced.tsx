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
  Crosshair
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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

// Detailed world map with realistic continent paths
const DETAILED_WORLD_PATH = `
  M 80 50 L 95 42 L 115 45 L 135 38 L 160 42 L 180 35 L 200 40 L 220 35 L 240 42 L 255 38 
  L 270 45 L 285 40 L 300 48 L 310 55 L 305 68 L 295 78 L 280 85 L 260 82 L 240 88 
  L 220 85 L 200 92 L 180 88 L 160 95 L 140 90 L 120 98 L 100 92 L 85 85 L 75 70 L 80 50 Z
  
  M 100 100 L 130 95 L 160 102 L 180 98 L 195 108 L 185 125 L 170 140 L 150 150 
  L 130 145 L 110 155 L 95 145 L 85 125 L 90 110 L 100 100 Z
  
  M 200 150 L 230 140 L 260 148 L 285 142 L 310 155 L 325 175 L 320 200 L 305 225 
  L 280 250 L 255 275 L 235 295 L 220 310 L 210 295 L 205 270 L 210 245 L 200 220 
  L 195 195 L 200 170 L 200 150 Z
  
  M 480 35 L 520 28 L 560 32 L 600 25 L 640 30 L 680 22 L 720 28 L 760 22 L 800 30 
  L 840 25 L 870 35 L 890 50 L 895 70 L 885 90 L 865 105 L 840 115 L 810 110 
  L 780 118 L 750 112 L 720 120 L 690 115 L 660 125 L 630 118 L 600 128 L 570 122 
  L 540 130 L 510 125 L 480 118 L 460 100 L 455 75 L 465 55 L 480 35 Z
  
  M 520 130 L 560 125 L 600 132 L 640 128 L 680 138 L 720 132 L 755 145 L 780 165 
  L 790 195 L 785 225 L 770 255 L 750 280 L 725 300 L 695 315 L 660 325 L 625 320 
  L 590 330 L 555 322 L 525 335 L 500 322 L 480 300 L 470 270 L 475 240 L 485 210 
  L 500 180 L 510 155 L 520 130 Z
  
  M 650 55 L 700 48 L 750 55 L 800 50 L 850 58 L 900 52 L 940 62 L 970 80 L 980 105 
  L 975 130 L 960 150 L 935 165 L 905 175 L 870 180 L 835 185 L 800 178 L 765 188 
  L 730 182 L 695 192 L 660 185 L 630 175 L 610 155 L 605 130 L 615 105 L 630 80 L 650 55 Z
  
  M 680 190 L 720 185 L 760 192 L 800 188 L 835 198 L 860 218 L 870 248 L 860 278 
  L 840 305 L 810 328 L 775 345 L 740 355 L 705 350 L 670 358 L 640 348 L 620 325 
  L 615 295 L 625 265 L 645 238 L 665 215 L 680 190 Z
  
  M 800 310 L 850 300 L 895 312 L 935 305 L 970 325 L 985 355 L 975 390 L 950 420 
  L 910 445 L 865 460 L 820 455 L 780 465 L 745 450 L 725 420 L 730 385 L 750 355 
  L 775 330 L 800 310 Z
  
  M 920 90 L 940 85 L 960 92 L 975 108 L 970 128 L 955 142 L 935 148 L 918 140 
  L 908 125 L 912 105 L 920 90 Z
`;

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

const latLngToSVG = (lat: number, lng: number, width: number = 1000, height: number = 500) => {
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
      const isIntercepted = Math.random() > 0.15;
      
      setAttackLines(prev => [...prev.slice(-12), { 
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

      if (randomThreat.severity === 'critical' && Math.random() > 0.85) {
        triggerAlert(
          randomThreat.type,
          randomThreat.severity,
          `${randomThreat.city}, ${randomThreat.country}`,
          `Active threat from ${randomThreat.ip}`
        );
      }
    }, 800);

    return () => clearInterval(interval);
  }, [threats, triggerAlert]);

  // Animate attack lines
  useEffect(() => {
    const interval = setInterval(() => {
      setAttackLines(prev => 
        prev.map(line => ({ ...line, progress: Math.min(line.progress + 0.015, 1) }))
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
              <Globe className="h-6 w-6 text-primary animate-pulse" />
              <div className="absolute inset-0 bg-primary/40 blur-lg rounded-full" />
            </div>
            <div>
              <span className="text-lg font-bold">
                <span className="text-gradient-cyber">Advanced</span> Global Threat Map
              </span>
              <p className="text-xs text-muted-foreground">Real-time cyber attack visualization</p>
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
        {/* Enhanced Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 px-4 sm:px-6 py-3 bg-gradient-to-r from-secondary/30 via-secondary/50 to-secondary/30 border-y border-border/50">
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
        <div className="relative w-full aspect-[2/1] min-h-[350px] sm:min-h-[450px] lg:min-h-[550px] bg-gradient-radial from-primary/5 via-background to-background overflow-hidden">
          {/* Animated Background Grid */}
          <div className="absolute inset-0 pointer-events-none opacity-30">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="hexGrid" width="30" height="26" patternUnits="userSpaceOnUse">
                  <path d="M15 0 L30 7.5 L30 22.5 L15 30 L0 22.5 L0 7.5 Z" 
                        fill="none" stroke="hsl(var(--primary))" strokeWidth="0.3" opacity="0.3" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#hexGrid)" />
            </svg>
          </div>

          {/* Glowing Orbs Background */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <motion.div 
              className="absolute top-1/4 left-1/6 w-48 h-48 bg-red-500/10 rounded-full blur-3xl"
              animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.2, 1] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            <motion.div 
              className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl"
              animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.1, 1] }}
              transition={{ duration: 5, repeat: Infinity, delay: 1 }}
            />
            <motion.div 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-500/5 rounded-full blur-3xl"
              animate={{ opacity: [0.1, 0.3, 0.1] }}
              transition={{ duration: 6, repeat: Infinity, delay: 2 }}
            />
          </div>

          {/* SVG Map */}
          <svg 
            viewBox="0 0 1000 500" 
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

              {/* Filters */}
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>

              <filter id="strongGlow" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>

              {/* Line Gradient */}
              <linearGradient id="attackLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ff3b3b" stopOpacity="0.1" />
                <stop offset="70%" stopColor="#ff3b3b" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#ff3b3b" stopOpacity="1" />
              </linearGradient>

              <linearGradient id="blockedLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00ff88" stopOpacity="0.1" />
                <stop offset="70%" stopColor="#00ff88" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#00ff88" stopOpacity="0.8" />
              </linearGradient>
            </defs>

            {/* World Map Continents */}
            <path 
              d={DETAILED_WORLD_PATH} 
              fill="hsl(var(--primary))" 
              fillOpacity="0.12"
              stroke="hsl(var(--primary))"
              strokeWidth="1"
              strokeOpacity="0.4"
              filter="url(#glow)"
            />

            {/* Attack Lines with Bezier Curves */}
            {attackLines.map((attack) => {
              const fromPos = latLngToSVG(attack.from.lat, attack.from.lng);
              const progress = attack.progress;
              
              // Create curved path
              const midX = (fromPos.x + targetPos.x) / 2;
              const midY = Math.min(fromPos.y, targetPos.y) - 80 - Math.random() * 40;
              
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
                    strokeOpacity={0.7 - progress * 0.5}
                    strokeDasharray="8 4"
                    filter="url(#glow)"
                  />
                  
                  {/* Moving projectile */}
                  <circle
                    cx={currentX}
                    cy={currentY}
                    r="5"
                    fill={attack.intercepted ? getSeverityColor(attack.from.severity) : '#00ff88'}
                    filter="url(#strongGlow)"
                  >
                    <animate attributeName="r" values="3;6;3" dur="0.3s" repeatCount="indefinite" />
                  </circle>
                  
                  {/* Impact burst when reaching target */}
                  {progress > 0.95 && (
                    <circle
                      cx={targetPos.x}
                      cy={targetPos.y}
                      r="20"
                      fill="none"
                      stroke={attack.intercepted ? '#00ff88' : '#ff3b3b'}
                      strokeWidth="2"
                      opacity={1 - (progress - 0.95) * 20}
                    >
                      <animate attributeName="r" values="10;40" dur="0.5s" />
                    </circle>
                  )}
                </g>
              );
            })}

            {/* Target HQ - Enhanced */}
            <g filter="url(#strongGlow)">
              {/* Outer scanning rings */}
              <circle cx={targetPos.x} cy={targetPos.y} r="50" fill="none" stroke="#00ff88" strokeWidth="0.5" opacity="0.2">
                <animate attributeName="r" values="30;60;30" dur="4s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.3;0.1;0.3" dur="4s" repeatCount="indefinite" />
              </circle>
              <circle cx={targetPos.x} cy={targetPos.y} r="35" fill="none" stroke="#00ff88" strokeWidth="0.8" opacity="0.3">
                <animate attributeName="r" values="20;45;20" dur="3s" repeatCount="indefinite" />
              </circle>
              <circle cx={targetPos.x} cy={targetPos.y} r="25" fill="none" stroke="#00ff88" strokeWidth="1" opacity="0.4">
                <animate attributeName="r" values="15;30;15" dur="2s" repeatCount="indefinite" />
              </circle>
              
              {/* Defense perimeter */}
              <circle cx={targetPos.x} cy={targetPos.y} r="18" fill="url(#targetGlow)" />
              <circle cx={targetPos.x} cy={targetPos.y} r="12" fill="#00ff88" opacity="0.8" />
              <circle cx={targetPos.x} cy={targetPos.y} r="6" fill="white" />
              
              {/* Crosshairs */}
              <line x1={targetPos.x - 30} y1={targetPos.y} x2={targetPos.x - 15} y2={targetPos.y} stroke="#00ff88" strokeWidth="1" />
              <line x1={targetPos.x + 15} y1={targetPos.y} x2={targetPos.x + 30} y2={targetPos.y} stroke="#00ff88" strokeWidth="1" />
              <line x1={targetPos.x} y1={targetPos.y - 30} x2={targetPos.x} y2={targetPos.y - 15} stroke="#00ff88" strokeWidth="1" />
              <line x1={targetPos.x} y1={targetPos.y + 15} x2={targetPos.x} y2={targetPos.y + 30} stroke="#00ff88" strokeWidth="1" />
            </g>

            {/* Threat Source Points */}
            {threats.map((threat) => {
              const pos = latLngToSVG(threat.lat, threat.lng);
              const color = getSeverityColor(threat.severity);
              const baseSize = threat.severity === 'critical' ? 10 : threat.severity === 'high' ? 8 : 6;
              const isHovered = hoveredThreat === threat.id;
              
              return (
                <g 
                  key={threat.id}
                  className="cursor-pointer"
                  onClick={() => setSelectedThreat(threat)}
                  onMouseEnter={() => setHoveredThreat(threat.id)}
                  onMouseLeave={() => setHoveredThreat(null)}
                  filter="url(#glow)"
                >
                  {/* Pulse animation for critical threats */}
                  {threat.severity === 'critical' && (
                    <>
                      <circle cx={pos.x} cy={pos.y} r={baseSize + 15} fill="none" stroke={color} strokeWidth="1" opacity="0.2">
                        <animate attributeName="r" values={`${baseSize};${baseSize + 25};${baseSize}`} dur="2s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.4;0;0.4" dur="2s" repeatCount="indefinite" />
                      </circle>
                      <circle cx={pos.x} cy={pos.y} r={baseSize + 8} fill="none" stroke={color} strokeWidth="1.5" opacity="0.3">
                        <animate attributeName="r" values={`${baseSize};${baseSize + 18};${baseSize}`} dur="1.5s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.5;0.1;0.5" dur="1.5s" repeatCount="indefinite" />
                      </circle>
                    </>
                  )}
                  
                  {/* Glow */}
                  <circle cx={pos.x} cy={pos.y} r={baseSize + 4} fill={color} opacity="0.3" />
                  
                  {/* Main circle */}
                  <circle 
                    cx={pos.x} 
                    cy={pos.y} 
                    r={isHovered ? baseSize + 2 : baseSize} 
                    fill={color}
                    className="transition-all duration-200"
                  >
                    <animate attributeName="opacity" values="0.8;1;0.8" dur="1.5s" repeatCount="indefinite" />
                  </circle>
                  
                  {/* Inner dot */}
                  <circle cx={pos.x} cy={pos.y} r={baseSize / 2.5} fill="white" opacity="0.9" />
                  
                  {/* Threat count label */}
                  {(threat.severity === 'critical' || isHovered) && (
                    <text 
                      x={pos.x} 
                      y={pos.y - baseSize - 8} 
                      textAnchor="middle" 
                      fill={color}
                      fontSize="10"
                      fontWeight="bold"
                    >
                      {threat.threatCount}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Legend */}
          <div className="absolute bottom-4 left-4 p-3 rounded-lg bg-background/80 backdrop-blur-sm border border-border/50 text-xs">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span>Critical</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-orange-500" />
                <span>High</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <span>Medium</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <span>Low</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Crosshair className="w-3 h-3 text-green-400" />
                <span>HQ</span>
              </div>
            </div>
          </div>

          {/* Live Indicator */}
          <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/20 border border-red-500/30">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs font-medium text-red-400">MONITORING ACTIVE</span>
          </div>
        </div>

        {/* Threat Detail Popup */}
        <AnimatePresence>
          {selectedThreat && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="absolute bottom-4 right-4 w-80 p-4 rounded-xl bg-card/95 backdrop-blur-md border border-border shadow-2xl"
            >
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-6 w-6"
                onClick={() => setSelectedThreat(null)}
              >
                <X className="h-4 w-4" />
              </Button>
              
              <div className="flex items-center gap-3 mb-3">
                <div 
                  className="w-3 h-3 rounded-full animate-pulse"
                  style={{ backgroundColor: getSeverityColor(selectedThreat.severity) }}
                />
                <div>
                  <h3 className="font-bold">{selectedThreat.city}, {selectedThreat.country}</h3>
                  <p className="text-xs text-muted-foreground">{selectedThreat.type}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="p-2 rounded-lg bg-secondary/50">
                  <p className="text-xs text-muted-foreground">Threat Count</p>
                  <p className="font-bold text-lg">{selectedThreat.threatCount}</p>
                </div>
                <div className="p-2 rounded-lg bg-secondary/50">
                  <p className="text-xs text-muted-foreground">Severity</p>
                  <Badge className={`mt-1 ${
                    selectedThreat.severity === 'critical' ? 'bg-red-500/20 text-red-400' :
                    selectedThreat.severity === 'high' ? 'bg-orange-500/20 text-orange-400' :
                    selectedThreat.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-green-500/20 text-green-400'
                  }`}>
                    {selectedThreat.severity.toUpperCase()}
                  </Badge>
                </div>
              </div>

              <div className="mt-3 p-2 rounded-lg bg-secondary/30">
                <p className="text-xs text-muted-foreground">Source IP</p>
                <code className="text-sm font-mono">{selectedThreat.ip}</code>
              </div>

              <div className="flex gap-2 mt-4">
                <Button size="sm" variant="destructive" className="flex-1 gap-1">
                  <Shield className="h-3 w-3" />
                  Block Source
                </Button>
                <Button size="sm" variant="outline" className="flex-1 gap-1">
                  <Target className="h-3 w-3" />
                  Investigate
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};
