import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Globe, 
  AlertTriangle, 
  Shield, 
  Activity, 
  Zap, 
  Volume2, 
  VolumeX,
  Bell,
  BellOff,
  Radio,
  Target,
  Crosshair,
  Wifi,
  Server,
  MapPin
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

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

interface AttackEvent {
  id: number;
  from: ThreatLocation;
  timestamp: Date;
  blocked: boolean;
}

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
];

const HQ_LOCATION = { lat: 28.6139, lng: 77.2090 };

export const EnhancedGlobalMap = () => {
  const [attackEvents, setAttackEvents] = useState<AttackEvent[]>([]);
  const [selectedThreat, setSelectedThreat] = useState<ThreatLocation | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [liveStats, setLiveStats] = useState({
    totalAttacks: 24589,
    blocked: 24312,
    activeThreats: threatLocations.length,
    successRate: 98.9,
  });
  const [radarAngle, setRadarAngle] = useState(0);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Play sound effect
  const playSound = useCallback((type: 'attack' | 'block' | 'critical') => {
    if (!soundEnabled) return;
    
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      const ctx = audioContextRef.current;
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      const frequencies = { attack: 440, block: 880, critical: 220 };
      oscillator.frequency.setValueAtTime(frequencies[type], ctx.currentTime);
      oscillator.type = type === 'critical' ? 'sawtooth' : 'sine';
      
      gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
      
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.2);
    } catch (e) {
      console.log('Audio not supported');
    }
  }, [soundEnabled]);

  // Radar sweep animation
  useEffect(() => {
    const interval = setInterval(() => {
      setRadarAngle(prev => (prev + 2) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Simulate attack events
  useEffect(() => {
    const interval = setInterval(() => {
      const randomThreat = threatLocations[Math.floor(Math.random() * threatLocations.length)];
      const isBlocked = Math.random() > 0.12;

      setAttackEvents(prev => [...prev.slice(-15), {
        id: Date.now(),
        from: randomThreat,
        timestamp: new Date(),
        blocked: isBlocked,
      }]);

      setLiveStats(prev => ({
        ...prev,
        totalAttacks: prev.totalAttacks + 1,
        blocked: isBlocked ? prev.blocked + 1 : prev.blocked,
        successRate: ((prev.blocked + (isBlocked ? 1 : 0)) / (prev.totalAttacks + 1)) * 100,
      }));

      playSound(isBlocked ? 'block' : randomThreat.severity === 'critical' ? 'critical' : 'attack');
    }, 600);

    return () => clearInterval(interval);
  }, [playSound]);

  const getSeverityColor = (severity: string): string => {
    switch (severity) {
      case 'critical': return '#ff3b3b';
      case 'high': return '#ff8c00';
      case 'medium': return '#ffd700';
      case 'low': return '#00ff88';
      default: return '#888888';
    }
  };

  const coordToSvg = (lat: number, lng: number) => ({
    x: ((lng + 180) / 360) * 1000,
    y: ((90 - lat) / 180) * 500,
  });

  const hqPos = coordToSvg(HQ_LOCATION.lat, HQ_LOCATION.lng);
  const criticalCount = threatLocations.filter(t => t.severity === 'critical').length;

  return (
    <Card variant="glass" className="relative overflow-hidden w-full">
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.4); opacity: 0.5; }
        }
        @keyframes attackLine {
          0% { stroke-dashoffset: 100; opacity: 0; }
          20% { opacity: 1; }
          100% { stroke-dashoffset: 0; opacity: 0; }
        }
        @keyframes radarSweep {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes dataFlow {
          0% { stroke-dashoffset: 20; }
          100% { stroke-dashoffset: 0; }
        }
      `}</style>
      
      <CardHeader className="pb-2 px-3 sm:px-6">
        <CardTitle className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Globe className="h-5 w-5 sm:h-6 sm:w-6 text-primary animate-pulse" />
              <div className="absolute inset-0 bg-primary/40 blur-lg rounded-full" />
            </div>
            <div>
              <span className="text-base sm:text-lg font-bold">
                <span className="text-gradient-cyber">Global</span> Threat Map
              </span>
              <p className="text-[10px] sm:text-xs text-muted-foreground">Real-time cyber attack visualization</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7 sm:h-8 sm:w-8" 
              onClick={() => setSoundEnabled(!soundEnabled)}
            >
              {soundEnabled ? 
                <Volume2 className="h-3 w-3 sm:h-4 sm:w-4 text-primary" /> : 
                <VolumeX className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
              }
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7 sm:h-8 sm:w-8" 
              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
            >
              {notificationsEnabled ? 
                <Bell className="h-3 w-3 sm:h-4 sm:w-4 text-primary" /> : 
                <BellOff className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
              }
            </Button>
            <Badge variant="critical" className="animate-pulse text-[10px] sm:text-xs">
              <Radio className="h-2 w-2 sm:h-3 sm:w-3 mr-1" />
              LIVE
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        {/* Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 sm:gap-2 px-3 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-secondary/30 via-secondary/50 to-secondary/30">
          <motion.div 
            className="text-center p-1.5 sm:p-2 rounded-lg bg-background/60 backdrop-blur-sm border border-border/30"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="text-sm sm:text-xl font-bold text-destructive">{liveStats.totalAttacks.toLocaleString()}</div>
            <div className="text-[8px] sm:text-[10px] text-muted-foreground">Total Attacks</div>
          </motion.div>
          <motion.div 
            className="text-center p-1.5 sm:p-2 rounded-lg bg-background/60 backdrop-blur-sm border border-border/30"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          >
            <div className="text-sm sm:text-xl font-bold text-success">{liveStats.blocked.toLocaleString()}</div>
            <div className="text-[8px] sm:text-[10px] text-muted-foreground">Blocked</div>
          </motion.div>
          <motion.div 
            className="text-center p-1.5 sm:p-2 rounded-lg bg-background/60 backdrop-blur-sm border border-border/30"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
          >
            <div className="text-sm sm:text-xl font-bold text-warning">{criticalCount}</div>
            <div className="text-[8px] sm:text-[10px] text-muted-foreground">Critical</div>
          </motion.div>
          <motion.div 
            className="text-center p-1.5 sm:p-2 rounded-lg bg-background/60 backdrop-blur-sm border border-border/30"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
          >
            <div className="text-sm sm:text-xl font-bold text-primary">{liveStats.successRate.toFixed(1)}%</div>
            <div className="text-[8px] sm:text-[10px] text-muted-foreground">Success</div>
          </motion.div>
        </div>

        {/* SVG World Map */}
        <div className="relative w-full aspect-[2/1] sm:aspect-[2.5/1] bg-gradient-to-b from-[#0a1628] via-[#0f1f3d] to-[#0a1628] overflow-hidden">
          <svg viewBox="0 0 1000 500" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
            <defs>
              <radialGradient id="glowGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.4" />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
              </radialGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <radialGradient id="radarGradient">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Grid lines */}
            {Array.from({ length: 12 }).map((_, i) => (
              <line key={`v-${i}`} x1={i * 83.33} y1="0" x2={i * 83.33} y2="500" stroke="hsl(var(--border))" strokeOpacity="0.15" strokeWidth="0.5" />
            ))}
            {Array.from({ length: 6 }).map((_, i) => (
              <line key={`h-${i}`} x1="0" y1={i * 83.33} x2="1000" y2={i * 83.33} stroke="hsl(var(--border))" strokeOpacity="0.15" strokeWidth="0.5" />
            ))}

            {/* Continents */}
            <g fill="hsl(var(--muted))" fillOpacity="0.12" stroke="hsl(var(--primary))" strokeOpacity="0.25" strokeWidth="0.5">
              <path d="M100,80 L200,60 L280,80 L300,140 L280,200 L220,220 L160,200 L100,160 Z" />
              <path d="M220,250 L280,260 L300,320 L280,400 L240,420 L200,380 L200,300 Z" />
              <path d="M440,80 L520,70 L560,100 L540,150 L480,160 L440,130 Z" />
              <path d="M460,180 L540,170 L580,220 L560,340 L500,380 L440,340 L440,240 Z" />
              <path d="M560,60 L720,50 L820,80 L860,140 L820,200 L720,220 L620,180 L580,120 Z" />
              <path d="M780,300 L860,290 L900,340 L880,400 L800,400 L760,360 Z" />
            </g>

            {/* Radar sweep at HQ */}
            <g transform={`translate(${hqPos.x}, ${hqPos.y})`}>
              <circle r="80" fill="none" stroke="hsl(var(--primary))" strokeOpacity="0.1" strokeWidth="1" />
              <circle r="120" fill="none" stroke="hsl(var(--primary))" strokeOpacity="0.05" strokeWidth="1" />
              <g transform={`rotate(${radarAngle})`}>
                <path 
                  d="M 0,0 L 0,-100 A 100,100 0 0,1 50,-86.6 Z" 
                  fill="url(#radarGradient)"
                />
              </g>
            </g>

            {/* Attack lines */}
            {attackEvents.slice(-10).map((event) => {
              const fromPos = coordToSvg(event.from.lat, event.from.lng);
              return (
                <g key={event.id}>
                  <line
                    x1={fromPos.x}
                    y1={fromPos.y}
                    x2={hqPos.x}
                    y2={hqPos.y}
                    stroke={event.blocked ? '#22c55e' : '#ef4444'}
                    strokeWidth="1.5"
                    strokeOpacity="0.7"
                    strokeDasharray="5,5"
                    style={{
                      animation: 'attackLine 1.5s ease-out forwards',
                    }}
                  />
                  <circle
                    cx={fromPos.x}
                    cy={fromPos.y}
                    r="4"
                    fill={event.blocked ? '#22c55e' : '#ef4444'}
                    style={{ animation: 'pulse 0.5s ease-out' }}
                  />
                </g>
              );
            })}

            {/* Threat markers */}
            {threatLocations.map((threat) => {
              const pos = coordToSvg(threat.lat, threat.lng);
              const size = threat.severity === 'critical' ? 8 : threat.severity === 'high' ? 6 : 4;
              return (
                <g 
                  key={threat.id} 
                  transform={`translate(${pos.x}, ${pos.y})`}
                  onClick={() => setSelectedThreat(threat)}
                  style={{ cursor: 'pointer' }}
                >
                  <circle
                    r={size * 2}
                    fill={getSeverityColor(threat.severity)}
                    fillOpacity="0.2"
                    style={{ animation: 'pulse 2s ease-in-out infinite' }}
                  />
                  <circle
                    r={size}
                    fill={getSeverityColor(threat.severity)}
                    filter="url(#glow)"
                  />
                </g>
              );
            })}

            {/* HQ marker */}
            <g transform={`translate(${hqPos.x}, ${hqPos.y})`}>
              <circle r="16" fill="#00ff88" fillOpacity="0.2" style={{ animation: 'pulse 1.5s ease-in-out infinite' }} />
              <circle r="10" fill="#00ff88" filter="url(#glow)" />
              <circle r="4" fill="white" />
            </g>
          </svg>

          {/* Selected threat details overlay */}
          <AnimatePresence>
            {selectedThreat && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="absolute top-2 right-2 sm:top-4 sm:right-4 w-48 sm:w-64 p-3 rounded-lg bg-background/90 backdrop-blur-md border border-border/50 shadow-xl"
              >
                <div className="flex items-center justify-between mb-2">
                  <Badge 
                    variant={selectedThreat.severity === 'critical' ? 'destructive' : 'outline'}
                    className="text-[10px]"
                  >
                    {selectedThreat.severity.toUpperCase()}
                  </Badge>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-5 w-5" 
                    onClick={() => setSelectedThreat(null)}
                  >
                    ×
                  </Button>
                </div>
                <h4 className="font-bold text-sm">{selectedThreat.city}, {selectedThreat.country}</h4>
                <p className="text-xs text-muted-foreground mt-1">{selectedThreat.type}</p>
                <div className="grid grid-cols-2 gap-2 mt-3 text-[10px]">
                  <div>
                    <span className="text-muted-foreground">Threats:</span>
                    <span className="ml-1 font-bold">{selectedThreat.threatCount}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">IP:</span>
                    <span className="ml-1 font-mono">{selectedThreat.ip}</span>
                  </div>
                </div>
                <Button size="sm" className="w-full mt-3 h-7 text-xs">
                  <Shield className="h-3 w-3 mr-1" />
                  Block Region
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Legend */}
          <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 flex flex-wrap gap-2 sm:gap-3 text-[8px] sm:text-[10px]">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <span className="text-muted-foreground">Critical</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-orange-500" />
              <span className="text-muted-foreground">High</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-yellow-500" />
              <span className="text-muted-foreground">Medium</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-muted-foreground">HQ</span>
            </div>
          </div>
        </div>

        {/* Live Attack Feed */}
        <div className="px-3 sm:px-6 py-3 border-t border-border/30">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="h-4 w-4 text-primary animate-pulse" />
            <span className="text-xs font-medium">Live Attack Feed</span>
          </div>
          <ScrollArea className="h-20 sm:h-24">
            <div className="space-y-1">
              {attackEvents.slice(-8).reverse().map((event) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between text-[10px] sm:text-xs py-1 px-2 rounded bg-secondary/30"
                >
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={event.blocked ? 'outline' : 'destructive'} 
                      className="text-[8px] sm:text-[10px] px-1"
                    >
                      {event.blocked ? 'BLOCKED' : 'ALERT'}
                    </Badge>
                    <span className="text-muted-foreground truncate max-w-[120px] sm:max-w-none">
                      {event.from.type} from {event.from.city}
                    </span>
                  </div>
                  <span className="text-muted-foreground shrink-0">
                    {event.timestamp.toLocaleTimeString()}
                  </span>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
};
