import { useState, useEffect, useCallback } from 'react';
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
  Wifi
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

// Real world map path (simplified but accurate continents)
const WORLD_MAP_PATH = `
  M 120 95 Q 145 78 185 82 Q 230 68 268 88 Q 298 82 318 95 Q 332 115 318 138 
  Q 292 158 258 152 Q 228 168 198 162 Q 168 178 148 168 Q 128 152 118 138 Q 108 118 120 95 Z
  
  M 138 142 Q 158 138 178 148 Q 198 142 218 152 Q 228 168 208 185 Q 178 195 158 185 Q 138 168 138 142 Z
  
  M 218 228 Q 238 212 258 218 Q 278 208 288 228 Q 298 258 288 298 Q 278 338 258 368 
  Q 238 388 228 368 Q 218 338 222 298 Q 218 258 218 228 Z
  
  M 448 88 Q 478 72 518 78 Q 558 68 588 82 Q 618 78 638 92 Q 658 108 648 128 
  Q 628 142 598 138 Q 558 148 518 142 Q 478 152 448 142 Q 428 128 438 108 Q 442 92 448 88 Z
  
  M 468 158 Q 498 142 528 152 Q 558 148 578 168 Q 598 198 588 248 Q 578 298 558 328 
  Q 538 348 508 342 Q 478 348 458 328 Q 442 298 448 248 Q 452 198 468 158 Z
  
  M 578 68 Q 638 52 718 58 Q 798 48 858 68 Q 898 82 918 108 Q 928 138 908 168 
  Q 878 192 838 188 Q 798 198 748 192 Q 698 202 658 192 Q 618 188 598 162 Q 578 138 582 108 Q 578 82 578 68 Z
  
  M 648 198 Q 698 188 748 192 Q 788 198 808 218 Q 818 248 798 278 Q 768 298 728 292 
  Q 688 302 658 288 Q 638 268 642 238 Q 642 212 648 198 Z
  
  M 798 298 Q 848 282 888 292 Q 918 308 928 338 Q 922 368 898 382 Q 858 392 818 382 
  Q 788 368 788 338 Q 788 312 798 298 Z
  
  M 878 128 Q 888 118 898 122 Q 902 138 892 152 Q 878 162 872 148 Q 872 132 878 128 Z
`;

const threatLocations: ThreatLocation[] = [
  { id: '1', country: 'Russia', city: 'Moscow', lat: 55.7558, lng: 37.6173, threatCount: 47, severity: 'critical', type: 'APT Attack', ip: '185.243.218.xxx' },
  { id: '2', country: 'China', city: 'Beijing', lat: 39.9042, lng: 116.4074, threatCount: 38, severity: 'high', type: 'Data Exfiltration', ip: '223.5.5.xxx' },
  { id: '3', country: 'North Korea', city: 'Pyongyang', lat: 39.0392, lng: 125.7625, threatCount: 23, severity: 'critical', type: 'Ransomware', ip: '175.45.176.xxx' },
  { id: '4', country: 'Iran', city: 'Tehran', lat: 35.6892, lng: 51.3890, threatCount: 19, severity: 'high', type: 'Phishing', ip: '5.160.139.xxx' },
  { id: '5', country: 'Brazil', city: 'São Paulo', lat: -23.5505, lng: -46.6333, threatCount: 15, severity: 'medium', type: 'Brute Force', ip: '177.67.82.xxx' },
  { id: '6', country: 'Nigeria', city: 'Lagos', lat: 6.5244, lng: 3.3792, threatCount: 12, severity: 'medium', type: 'BEC Scam', ip: '41.58.13.xxx' },
  { id: '7', country: 'USA', city: 'Miami', lat: 25.7617, lng: -80.1918, threatCount: 8, severity: 'low', type: 'Credential Stuffing', ip: '173.245.48.xxx' },
  { id: '8', country: 'Germany', city: 'Berlin', lat: 52.5200, lng: 13.4050, threatCount: 5, severity: 'low', type: 'Port Scan', ip: '88.198.36.xxx' },
  { id: '9', country: 'India', city: 'Mumbai', lat: 19.0760, lng: 72.8777, threatCount: 21, severity: 'high', type: 'DDoS', ip: '49.37.180.xxx' },
  { id: '10', country: 'Ukraine', city: 'Kyiv', lat: 50.4501, lng: 30.5234, threatCount: 31, severity: 'critical', type: 'Wiper Malware', ip: '91.214.124.xxx' },
  { id: '11', country: 'Australia', city: 'Sydney', lat: -33.8688, lng: 151.2093, threatCount: 7, severity: 'low', type: 'Cryptomining', ip: '203.2.75.xxx' },
  { id: '12', country: 'Japan', city: 'Tokyo', lat: 35.6762, lng: 139.6503, threatCount: 14, severity: 'medium', type: 'SQL Injection', ip: '133.242.0.xxx' },
  { id: '13', country: 'South Korea', city: 'Seoul', lat: 37.5665, lng: 126.9780, threatCount: 9, severity: 'medium', type: 'XSS Attack', ip: '211.252.87.xxx' },
  { id: '14', country: 'UK', city: 'London', lat: 51.5074, lng: -0.1278, threatCount: 11, severity: 'medium', type: 'API Abuse', ip: '185.93.3.xxx' },
  { id: '15', country: 'Canada', city: 'Toronto', lat: 43.6532, lng: -79.3832, threatCount: 6, severity: 'low', type: 'Bot Activity', ip: '99.224.0.xxx' },
];

const latLngToPosition = (lat: number, lng: number) => {
  const x = ((lng + 180) / 360) * 100;
  const y = ((90 - lat) / 180) * 100;
  return { x, y };
};

const targetPosition = latLngToPosition(28.6139, 77.2090); // HQ in India

export const AdvancedWorldMap = () => {
  const [threats] = useState<ThreatLocation[]>(threatLocations);
  const [selectedThreat, setSelectedThreat] = useState<ThreatLocation | null>(null);
  const [attackLines, setAttackLines] = useState<{ from: ThreatLocation; progress: number; id: number }[]>([]);
  const [totalAttacks, setTotalAttacks] = useState(1547);
  const [blockedAttacks, setBlockedAttacks] = useState(1523);
  
  const { 
    soundEnabled, 
    notificationsEnabled, 
    toggleSound, 
    requestNotifications,
    triggerAlert 
  } = useThreatAlerts();

  // Simulate attack lines
  useEffect(() => {
    let attackId = 0;
    const interval = setInterval(() => {
      const randomThreat = threats[Math.floor(Math.random() * threats.length)];
      setAttackLines(prev => [...prev.slice(-8), { from: randomThreat, progress: 0, id: attackId++ }]);
      setTotalAttacks(prev => prev + 1);
      
      // Random chance to block
      if (Math.random() > 0.03) {
        setBlockedAttacks(prev => prev + 1);
      }
      
      // Trigger alert for critical threats sometimes
      if (randomThreat.severity === 'critical' && Math.random() > 0.8) {
        triggerAlert(
          randomThreat.type,
          randomThreat.severity,
          `${randomThreat.city}, ${randomThreat.country}`,
          `Threat detected from ${randomThreat.ip}`
        );
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [threats, triggerAlert]);

  // Animate attack lines
  useEffect(() => {
    const animationInterval = setInterval(() => {
      setAttackLines(prev => 
        prev.map(line => ({ ...line, progress: Math.min(line.progress + 0.025, 1) }))
            .filter(line => line.progress < 1)
      );
    }, 25);

    return () => clearInterval(animationInterval);
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return '#ef4444';
      case 'high': return '#f97316';
      case 'medium': return '#eab308';
      case 'low': return '#22c55e';
      default: return '#6b7280';
    }
  };

  const criticalCount = threats.filter(t => t.severity === 'critical').length;
  const highCount = threats.filter(t => t.severity === 'high').length;

  return (
    <Card variant="glass" className="relative overflow-hidden">
      <CardHeader className="pb-2 px-4 sm:px-6">
        <CardTitle className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Globe className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              <div className="absolute inset-0 bg-primary/30 blur-md rounded-full" />
            </div>
            <span className="text-base sm:text-lg font-bold">
              <span className="text-gradient-cyber">Global</span> Threat Intelligence
            </span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={toggleSound}
              title={soundEnabled ? 'Mute sounds' : 'Enable sounds'}
            >
              {soundEnabled ? (
                <Volume2 className="h-4 w-4 text-primary" />
              ) : (
                <VolumeX className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={requestNotifications}
              title={notificationsEnabled ? 'Notifications enabled' : 'Enable notifications'}
            >
              {notificationsEnabled ? (
                <Bell className="h-4 w-4 text-primary" />
              ) : (
                <BellOff className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>
            <Badge variant="critical" className="animate-pulse text-xs">
              <Activity className="h-3 w-3 mr-1" />
              {totalAttacks.toLocaleString()} Attacks
            </Badge>
            <Badge variant="success" className="text-xs">
              <Shield className="h-3 w-3 mr-1" />
              {blockedAttacks.toLocaleString()} Blocked
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-0">
        {/* Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 px-4 sm:px-6 py-3 bg-secondary/30 border-y border-border/50">
          <div className="text-center p-2 rounded-lg bg-background/50">
            <div className="text-lg sm:text-2xl font-bold text-destructive">{criticalCount}</div>
            <div className="text-[10px] sm:text-xs text-muted-foreground">Critical Zones</div>
          </div>
          <div className="text-center p-2 rounded-lg bg-background/50">
            <div className="text-lg sm:text-2xl font-bold text-warning">{highCount}</div>
            <div className="text-[10px] sm:text-xs text-muted-foreground">High Risk</div>
          </div>
          <div className="text-center p-2 rounded-lg bg-background/50">
            <div className="text-lg sm:text-2xl font-bold text-primary">{threats.length}</div>
            <div className="text-[10px] sm:text-xs text-muted-foreground">Active Sources</div>
          </div>
          <div className="text-center p-2 rounded-lg bg-background/50">
            <div className="text-lg sm:text-2xl font-bold text-success">
              {((blockedAttacks / totalAttacks) * 100).toFixed(1)}%
            </div>
            <div className="text-[10px] sm:text-xs text-muted-foreground">Block Rate</div>
          </div>
        </div>

        {/* Map Container */}
        <div className="relative w-full aspect-[2/1] min-h-[300px] sm:min-h-[400px] lg:min-h-[500px] bg-gradient-to-b from-background via-secondary/10 to-background overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-40 sm:w-72 h-40 sm:h-72 bg-primary/5 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-48 sm:w-96 h-48 sm:h-96 bg-destructive/5 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 sm:w-[500px] h-64 sm:h-[500px] bg-primary/3 rounded-full blur-3xl" />
          </div>

          {/* World Map SVG */}
          <svg 
            viewBox="0 0 1000 500" 
            className="absolute inset-0 w-full h-full"
            preserveAspectRatio="xMidYMid slice"
          >
            {/* Definitions */}
            <defs>
              <pattern id="advancedGrid" width="25" height="25" patternUnits="userSpaceOnUse">
                <path d="M 25 0 L 0 0 0 25" fill="none" stroke="currentColor" strokeWidth="0.2" className="text-primary/10" />
              </pattern>
              <linearGradient id="attackGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.1" />
                <stop offset="50%" stopColor="#ef4444" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#ef4444" stopOpacity="1" />
              </linearGradient>
              <radialGradient id="targetGlow2" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#00d4aa" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#00d4aa" stopOpacity="0" />
              </radialGradient>
              <filter id="glowFilter">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
              <filter id="softGlow">
                <feGaussianBlur stdDeviation="1.5" result="blur"/>
                <feMerge>
                  <feMergeNode in="blur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            {/* Grid Background */}
            <rect width="100%" height="100%" fill="url(#advancedGrid)" />
            
            {/* World Continents */}
            <path 
              d={WORLD_MAP_PATH} 
              fill="hsl(var(--primary))" 
              fillOpacity="0.15"
              stroke="hsl(var(--primary))"
              strokeWidth="0.5"
              strokeOpacity="0.3"
            />

            {/* Attack Lines with Curved Paths */}
            {attackLines.map((attack) => {
              const fromPos = latLngToPosition(attack.from.lat, attack.from.lng);
              const currentX = fromPos.x + (targetPosition.x - fromPos.x) * attack.progress;
              const currentY = fromPos.y + (targetPosition.y - fromPos.y) * attack.progress;
              
              // Curved control points
              const midX = (fromPos.x + targetPosition.x) / 2;
              const midY = Math.min(fromPos.y, targetPosition.y) - 15;
              
              const pathProgress = `M ${fromPos.x * 10} ${fromPos.y * 5} Q ${midX * 10} ${midY * 5} ${currentX * 10} ${currentY * 5}`;
              
              return (
                <g key={attack.id} filter="url(#softGlow)">
                  <path
                    d={pathProgress}
                    fill="none"
                    stroke={getSeverityColor(attack.from.severity)}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    opacity={0.8 - attack.progress * 0.4}
                    strokeDasharray="4 2"
                  />
                  {/* Moving dot */}
                  <circle
                    cx={currentX * 10}
                    cy={currentY * 5}
                    r="4"
                    fill={getSeverityColor(attack.from.severity)}
                  >
                    <animate attributeName="r" values="2;5;2" dur="0.4s" repeatCount="indefinite" />
                  </circle>
                </g>
              );
            })}

            {/* Target HQ */}
            <g filter="url(#glowFilter)">
              {/* Outer rings */}
              <circle cx={targetPosition.x * 10} cy={targetPosition.y * 5} r="25" fill="none" stroke="#00d4aa" strokeWidth="0.5" opacity="0.3">
                <animate attributeName="r" values="20;35;20" dur="4s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.4;0.1;0.4" dur="4s" repeatCount="indefinite" />
              </circle>
              <circle cx={targetPosition.x * 10} cy={targetPosition.y * 5} r="15" fill="none" stroke="#00d4aa" strokeWidth="0.5" opacity="0.5">
                <animate attributeName="r" values="12;22;12" dur="3s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.6;0.2;0.6" dur="3s" repeatCount="indefinite" />
              </circle>
              {/* Core */}
              <circle cx={targetPosition.x * 10} cy={targetPosition.y * 5} r="10" fill="url(#targetGlow2)" />
              <circle cx={targetPosition.x * 10} cy={targetPosition.y * 5} r="5" fill="#00d4aa" />
            </g>

            {/* Threat Points */}
            {threats.map((threat) => {
              const pos = latLngToPosition(threat.lat, threat.lng);
              const color = getSeverityColor(threat.severity);
              const size = threat.severity === 'critical' ? 7 : threat.severity === 'high' ? 5 : 4;
              
              return (
                <g 
                  key={threat.id} 
                  className="cursor-pointer"
                  onClick={() => setSelectedThreat(threat)}
                  filter="url(#softGlow)"
                >
                  {/* Pulse for critical */}
                  {threat.severity === 'critical' && (
                    <circle cx={pos.x * 10} cy={pos.y * 5} r={size + 8} fill="none" stroke={color} strokeWidth="1" opacity="0.3">
                      <animate attributeName="r" values={`${size};${size + 15};${size}`} dur="2s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.4;0;0.4" dur="2s" repeatCount="indefinite" />
                    </circle>
                  )}
                  {/* Glow */}
                  <circle cx={pos.x * 10} cy={pos.y * 5} r={size + 3} fill={color} opacity="0.25" />
                  {/* Main */}
                  <circle cx={pos.x * 10} cy={pos.y * 5} r={size} fill={color}>
                    <animate attributeName="opacity" values="0.7;1;0.7" dur="1.5s" repeatCount="indefinite" />
                  </circle>
                  {/* Center */}
                  <circle cx={pos.x * 10} cy={pos.y * 5} r={size / 2} fill="white" opacity="0.8" />
                </g>
              );
            })}
          </svg>

          {/* Interactive Threat Markers */}
          {threats.map((threat) => {
            const pos = latLngToPosition(threat.lat, threat.lng);
            return (
              <motion.div
                key={`marker-${threat.id}`}
                className="absolute pointer-events-auto cursor-pointer group z-10"
                style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: 'translate(-50%, -50%)' }}
                whileHover={{ scale: 1.3 }}
                onClick={() => setSelectedThreat(threat)}
              >
                <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50">
                  <div className="bg-card/95 backdrop-blur-md border border-border rounded-lg px-3 py-2 shadow-xl whitespace-nowrap">
                    <div className="text-xs font-semibold text-foreground">{threat.city}, {threat.country}</div>
                    <div className="text-[10px] text-primary">{threat.type}</div>
                    <div className="text-[10px] text-muted-foreground font-mono">{threat.ip}</div>
                  </div>
                </div>
              </motion.div>
            );
          })}

          {/* HQ Label */}
          <motion.div
            className="absolute z-20 pointer-events-none"
            style={{ left: `${targetPosition.x}%`, top: `${targetPosition.y}%`, transform: 'translate(-50%, -180%)' }}
          >
            <div className="flex items-center gap-1.5 bg-primary/20 backdrop-blur-md border border-primary/50 rounded-full px-3 py-1">
              <Target className="h-3 w-3 text-primary" />
              <span className="text-xs font-semibold text-primary">Protected HQ</span>
            </div>
          </motion.div>
        </div>

        {/* Legend */}
        <div className="px-4 sm:px-6 py-3 bg-secondary/20 border-t border-border/50">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-xs">
              <span className="text-muted-foreground">Severity:</span>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-destructive animate-pulse" />
                <span className="text-muted-foreground">Critical</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-warning" />
                <span className="text-muted-foreground">High</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <span className="text-muted-foreground">Medium</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-success" />
                <span className="text-muted-foreground">Low</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Wifi className="h-3 w-3 text-primary animate-pulse" />
              <span>Real-time data • Updates every 1.5s</span>
            </div>
          </div>
        </div>
      </CardContent>

      {/* Threat Detail Modal */}
      <AnimatePresence>
        {selectedThreat && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedThreat(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-card border border-border rounded-xl p-6 max-w-md w-full shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    selectedThreat.severity === 'critical' ? 'bg-destructive/20' :
                    selectedThreat.severity === 'high' ? 'bg-warning/20' :
                    selectedThreat.severity === 'medium' ? 'bg-yellow-500/20' : 'bg-success/20'
                  }`}>
                    <AlertTriangle className={`h-5 w-5 ${
                      selectedThreat.severity === 'critical' ? 'text-destructive' :
                      selectedThreat.severity === 'high' ? 'text-warning' :
                      selectedThreat.severity === 'medium' ? 'text-yellow-500' : 'text-success'
                    }`} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{selectedThreat.type}</h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedThreat.city}, {selectedThreat.country}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setSelectedThreat(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-secondary/50">
                    <div className="text-xs text-muted-foreground mb-1">Threat Count</div>
                    <div className="text-2xl font-bold">{selectedThreat.threatCount}</div>
                  </div>
                  <div className="p-3 rounded-lg bg-secondary/50">
                    <div className="text-xs text-muted-foreground mb-1">Severity</div>
                    <Badge variant={selectedThreat.severity} className="mt-1">
                      {selectedThreat.severity.toUpperCase()}
                    </Badge>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-secondary/50">
                  <div className="text-xs text-muted-foreground mb-1">Source IP</div>
                  <div className="font-mono text-sm">{selectedThreat.ip}</div>
                </div>

                <div className="p-3 rounded-lg bg-secondary/50">
                  <div className="text-xs text-muted-foreground mb-1">Coordinates</div>
                  <div className="font-mono text-sm">
                    {selectedThreat.lat.toFixed(4)}°, {selectedThreat.lng.toFixed(4)}°
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button variant="destructive" className="flex-1">
                    <Shield className="h-4 w-4 mr-2" />
                    Block Source
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Activity className="h-4 w-4 mr-2" />
                    Investigate
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};
