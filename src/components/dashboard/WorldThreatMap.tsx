import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, AlertTriangle, MapPin, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ThreatLocation {
  id: string;
  country: string;
  city: string;
  lat: number;
  lng: number;
  threatCount: number;
  severity: 'critical' | 'high' | 'medium' | 'low';
  type: string;
  timestamp: Date;
}

const threatLocations: ThreatLocation[] = [
  { id: '1', country: 'Russia', city: 'Moscow', lat: 55.7558, lng: 37.6173, threatCount: 47, severity: 'critical', type: 'APT Attack', timestamp: new Date() },
  { id: '2', country: 'China', city: 'Beijing', lat: 39.9042, lng: 116.4074, threatCount: 38, severity: 'high', type: 'Data Exfiltration', timestamp: new Date() },
  { id: '3', country: 'North Korea', city: 'Pyongyang', lat: 39.0392, lng: 125.7625, threatCount: 23, severity: 'critical', type: 'Ransomware', timestamp: new Date() },
  { id: '4', country: 'Iran', city: 'Tehran', lat: 35.6892, lng: 51.3890, threatCount: 19, severity: 'high', type: 'Phishing', timestamp: new Date() },
  { id: '5', country: 'Brazil', city: 'São Paulo', lat: -23.5505, lng: -46.6333, threatCount: 15, severity: 'medium', type: 'Brute Force', timestamp: new Date() },
  { id: '6', country: 'Nigeria', city: 'Lagos', lat: 6.5244, lng: 3.3792, threatCount: 12, severity: 'medium', type: 'BEC Scam', timestamp: new Date() },
  { id: '7', country: 'USA', city: 'Miami', lat: 25.7617, lng: -80.1918, threatCount: 8, severity: 'low', type: 'Credential Stuffing', timestamp: new Date() },
  { id: '8', country: 'Germany', city: 'Berlin', lat: 52.5200, lng: 13.4050, threatCount: 5, severity: 'low', type: 'Port Scan', timestamp: new Date() },
  { id: '9', country: 'India', city: 'Mumbai', lat: 19.0760, lng: 72.8777, threatCount: 21, severity: 'high', type: 'DDoS', timestamp: new Date() },
  { id: '10', country: 'Ukraine', city: 'Kyiv', lat: 50.4501, lng: 30.5234, threatCount: 31, severity: 'critical', type: 'Wiper Malware', timestamp: new Date() },
];

// Convert lat/lng to x/y percentage positions on the map
const latLngToPosition = (lat: number, lng: number) => {
  const x = ((lng + 180) / 360) * 100;
  const y = ((90 - lat) / 180) * 100;
  return { x, y };
};

export const WorldThreatMap = () => {
  const [threats, setThreats] = useState<ThreatLocation[]>(threatLocations);
  const [selectedThreat, setSelectedThreat] = useState<ThreatLocation | null>(null);
  const [attackLines, setAttackLines] = useState<{ from: ThreatLocation; progress: number }[]>([]);
  const targetPosition = latLngToPosition(28.6139, 77.2090); // New Delhi as target

  useEffect(() => {
    // Simulate live attacks
    const interval = setInterval(() => {
      const randomThreat = threats[Math.floor(Math.random() * threats.length)];
      setAttackLines(prev => [...prev.slice(-4), { from: randomThreat, progress: 0 }]);
    }, 3000);

    return () => clearInterval(interval);
  }, [threats]);

  useEffect(() => {
    // Animate attack lines
    const animationInterval = setInterval(() => {
      setAttackLines(prev => 
        prev.map(line => ({ ...line, progress: Math.min(line.progress + 0.05, 1) }))
            .filter(line => line.progress < 1)
      );
    }, 50);

    return () => clearInterval(animationInterval);
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getSeverityGlow = (severity: string) => {
    switch (severity) {
      case 'critical': return 'shadow-[0_0_20px_rgba(239,68,68,0.8)]';
      case 'high': return 'shadow-[0_0_15px_rgba(249,115,22,0.7)]';
      case 'medium': return 'shadow-[0_0_10px_rgba(234,179,8,0.6)]';
      case 'low': return 'shadow-[0_0_8px_rgba(34,197,94,0.5)]';
      default: return '';
    }
  };

  return (
    <Card variant="glass" className="relative overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary animate-pulse" />
            Global Threat Map
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="critical" className="animate-pulse">
              <Activity className="h-3 w-3 mr-1" />
              Live Monitoring
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {/* Map Container */}
        <div className="relative w-full h-[400px] bg-gradient-to-b from-background via-secondary/30 to-background overflow-hidden">
          {/* World Map SVG Background */}
          <svg 
            viewBox="0 0 1000 500" 
            className="absolute inset-0 w-full h-full opacity-30"
            preserveAspectRatio="xMidYMid slice"
          >
            {/* Simplified world map paths */}
            <path 
              d="M150,120 Q200,100 250,110 Q300,90 350,100 Q400,80 450,95 L480,90 Q500,100 520,95 Q560,85 600,100 Q650,90 700,105 L750,100 Q800,110 850,100 L900,120 L900,180 Q850,200 800,190 Q750,210 700,195 Q650,220 600,200 L550,215 Q500,200 450,220 Q400,200 350,210 Q300,195 250,210 Q200,190 150,200 Z M120,250 Q180,230 220,245 Q280,225 320,240 Q380,220 420,235 L480,225 Q520,245 560,230 Q620,250 680,235 Q740,255 800,240 L860,255 Q880,280 860,300 Q820,330 780,310 Q720,340 660,320 Q600,350 540,325 Q480,355 420,330 Q360,360 300,335 Q240,365 180,340 Q120,370 100,340 Q80,310 100,280 Z" 
              fill="currentColor" 
              className="text-primary/20"
            />
            {/* Grid lines */}
            {[...Array(10)].map((_, i) => (
              <line key={`h${i}`} x1="0" y1={i * 50} x2="1000" y2={i * 50} stroke="currentColor" strokeWidth="0.5" className="text-primary/10" />
            ))}
            {[...Array(20)].map((_, i) => (
              <line key={`v${i}`} x1={i * 50} y1="0" x2={i * 50} y2="500" stroke="currentColor" strokeWidth="0.5" className="text-primary/10" />
            ))}
          </svg>

          {/* Attack Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {attackLines.map((attack, i) => {
              const fromPos = latLngToPosition(attack.from.lat, attack.from.lng);
              const currentX = fromPos.x + (targetPosition.x - fromPos.x) * attack.progress;
              const currentY = fromPos.y + (targetPosition.y - fromPos.y) * attack.progress;
              
              return (
                <g key={i}>
                  <line
                    x1={`${fromPos.x}%`}
                    y1={`${fromPos.y}%`}
                    x2={`${currentX}%`}
                    y2={`${currentY}%`}
                    stroke="url(#attackGradient)"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                  />
                  <circle
                    cx={`${currentX}%`}
                    cy={`${currentY}%`}
                    r="4"
                    fill="#ef4444"
                    className="animate-pulse"
                  />
                </g>
              );
            })}
            <defs>
              <linearGradient id="attackGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#ef4444" stopOpacity="1" />
              </linearGradient>
            </defs>
          </svg>

          {/* Target indicator */}
          <motion.div
            className="absolute w-8 h-8 -translate-x-1/2 -translate-y-1/2 z-20"
            style={{ left: `${targetPosition.x}%`, top: `${targetPosition.y}%` }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="absolute inset-0 bg-primary/30 rounded-full animate-ping" />
            <div className="absolute inset-1 bg-primary/50 rounded-full" />
            <div className="absolute inset-2 bg-primary rounded-full flex items-center justify-center">
              <MapPin className="h-3 w-3 text-primary-foreground" />
            </div>
          </motion.div>

          {/* Threat Points */}
          {threats.map((threat) => {
            const pos = latLngToPosition(threat.lat, threat.lng);
            return (
              <motion.div
                key={threat.id}
                className={`absolute cursor-pointer z-10 -translate-x-1/2 -translate-y-1/2`}
                style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                whileHover={{ scale: 1.5 }}
                onClick={() => setSelectedThreat(threat)}
              >
                <div className={`relative w-4 h-4 rounded-full ${getSeverityColor(threat.severity)} ${getSeverityGlow(threat.severity)}`}>
                  <div className={`absolute inset-0 rounded-full ${getSeverityColor(threat.severity)} animate-ping opacity-75`} />
                  {threat.severity === 'critical' && (
                    <div className={`absolute -inset-2 rounded-full border-2 border-red-500/50 animate-pulse`} />
                  )}
                </div>
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] text-muted-foreground bg-background/80 px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  {threat.city}
                </div>
              </motion.div>
            );
          })}

          {/* Selected Threat Details */}
          <AnimatePresence>
            {selectedThreat && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="absolute top-4 right-4 bg-background/95 backdrop-blur-lg border border-border rounded-lg p-4 w-64 z-30"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className={`h-4 w-4 ${
                      selectedThreat.severity === 'critical' ? 'text-red-500' :
                      selectedThreat.severity === 'high' ? 'text-orange-500' :
                      selectedThreat.severity === 'medium' ? 'text-yellow-500' : 'text-green-500'
                    }`} />
                    <span className="font-semibold text-sm">{selectedThreat.city}, {selectedThreat.country}</span>
                  </div>
                  <button 
                    onClick={() => setSelectedThreat(null)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    ×
                  </button>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Threat Type:</span>
                    <span className="font-medium">{selectedThreat.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Attack Count:</span>
                    <span className="font-medium text-destructive">{selectedThreat.threatCount}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Severity:</span>
                    <Badge variant={selectedThreat.severity as any} className="text-xs">
                      {selectedThreat.severity.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Coordinates:</span>
                    <span className="font-mono text-[10px]">{selectedThreat.lat.toFixed(2)}, {selectedThreat.lng.toFixed(2)}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 py-3 border-t border-border/50">
          {[
            { label: 'Critical', color: 'bg-red-500' },
            { label: 'High', color: 'bg-orange-500' },
            { label: 'Medium', color: 'bg-yellow-500' },
            { label: 'Low', color: 'bg-green-500' },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-1.5">
              <div className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
              <span className="text-xs text-muted-foreground">{item.label}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
