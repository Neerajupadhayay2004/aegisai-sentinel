import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, AlertTriangle, MapPin, Activity, Shield, Zap, X } from 'lucide-react';
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
  { id: '11', country: 'Australia', city: 'Sydney', lat: -33.8688, lng: 151.2093, threatCount: 7, severity: 'low', type: 'Cryptomining', timestamp: new Date() },
  { id: '12', country: 'Japan', city: 'Tokyo', lat: 35.6762, lng: 139.6503, threatCount: 14, severity: 'medium', type: 'SQL Injection', timestamp: new Date() },
];

// Convert lat/lng to x/y percentage positions on the map
const latLngToPosition = (lat: number, lng: number) => {
  const x = ((lng + 180) / 360) * 100;
  const y = ((90 - lat) / 180) * 100;
  return { x, y };
};

export const WorldThreatMap = () => {
  const [threats] = useState<ThreatLocation[]>(threatLocations);
  const [selectedThreat, setSelectedThreat] = useState<ThreatLocation | null>(null);
  const [attackLines, setAttackLines] = useState<{ from: ThreatLocation; progress: number; id: number }[]>([]);
  const [totalAttacks, setTotalAttacks] = useState(247);
  const targetPosition = latLngToPosition(28.6139, 77.2090); // New Delhi as target

  useEffect(() => {
    let attackId = 0;
    const interval = setInterval(() => {
      const randomThreat = threats[Math.floor(Math.random() * threats.length)];
      setAttackLines(prev => [...prev.slice(-5), { from: randomThreat, progress: 0, id: attackId++ }]);
      setTotalAttacks(prev => prev + 1);
    }, 2500);

    return () => clearInterval(interval);
  }, [threats]);

  useEffect(() => {
    const animationInterval = setInterval(() => {
      setAttackLines(prev => 
        prev.map(line => ({ ...line, progress: Math.min(line.progress + 0.03, 1) }))
            .filter(line => line.progress < 1)
      );
    }, 30);

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

  const getSeverityBg = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const criticalCount = threats.filter(t => t.severity === 'critical').length;
  const highCount = threats.filter(t => t.severity === 'high').length;

  return (
    <Card variant="glass" className="relative overflow-hidden">
      <CardHeader className="pb-2 px-3 sm:px-6">
        <CardTitle className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Globe className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              <div className="absolute inset-0 bg-primary/30 blur-md rounded-full" />
            </div>
            <span className="text-base sm:text-lg">Global Threat Intelligence</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="critical" className="animate-pulse text-xs">
              <Activity className="h-3 w-3 mr-1" />
              {totalAttacks} Attacks
            </Badge>
            <Badge variant="outline" className="text-xs border-primary/50">
              <Shield className="h-3 w-3 mr-1 text-primary" />
              Protected
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-0">
        {/* Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 px-3 sm:px-6 py-3 bg-secondary/30 border-y border-border/50">
          <div className="text-center p-2 rounded-lg bg-background/50">
            <div className="text-lg sm:text-2xl font-bold text-red-500">{criticalCount}</div>
            <div className="text-[10px] sm:text-xs text-muted-foreground">Critical Zones</div>
          </div>
          <div className="text-center p-2 rounded-lg bg-background/50">
            <div className="text-lg sm:text-2xl font-bold text-orange-500">{highCount}</div>
            <div className="text-[10px] sm:text-xs text-muted-foreground">High Risk</div>
          </div>
          <div className="text-center p-2 rounded-lg bg-background/50">
            <div className="text-lg sm:text-2xl font-bold text-primary">{threats.length}</div>
            <div className="text-[10px] sm:text-xs text-muted-foreground">Active Sources</div>
          </div>
          <div className="text-center p-2 rounded-lg bg-background/50">
            <div className="text-lg sm:text-2xl font-bold text-green-500">98.7%</div>
            <div className="text-[10px] sm:text-xs text-muted-foreground">Blocked</div>
          </div>
        </div>

        {/* Map Container */}
        <div className="relative w-full aspect-[2/1] min-h-[250px] sm:min-h-[350px] lg:min-h-[450px] bg-gradient-to-b from-background via-secondary/20 to-background overflow-hidden">
          {/* Background Glow Effects */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-32 sm:w-64 h-32 sm:h-64 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-40 sm:w-80 h-40 sm:h-80 bg-red-500/5 rounded-full blur-3xl" />
          </div>

          {/* World Map SVG */}
          <svg 
            viewBox="0 0 1000 500" 
            className="absolute inset-0 w-full h-full"
            preserveAspectRatio="xMidYMid slice"
          >
            {/* Grid Pattern */}
            <defs>
              <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="currentColor" strokeWidth="0.3" className="text-primary/10" />
              </pattern>
              <linearGradient id="attackGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.2" />
                <stop offset="50%" stopColor="#ef4444" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#ef4444" stopOpacity="1" />
              </linearGradient>
              <radialGradient id="targetGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#00d4ff" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#00d4ff" stopOpacity="0" />
              </radialGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            <rect width="100%" height="100%" fill="url(#grid)" />
            
            {/* Simplified World Map - Continents */}
            <g className="text-primary/20" fill="currentColor">
              {/* North America */}
              <path d="M120,100 Q150,80 200,85 Q250,70 280,90 Q310,85 330,100 Q340,120 320,140 Q290,160 260,155 Q230,170 200,165 Q170,180 150,170 Q130,155 120,140 Q110,120 120,100 Z" />
              <path d="M140,145 Q160,140 180,150 Q200,145 220,155 Q230,170 210,185 Q180,195 160,185 Q140,170 140,145 Z" />
              
              {/* South America */}
              <path d="M220,230 Q240,215 260,220 Q280,210 290,230 Q300,260 290,300 Q280,340 260,370 Q240,390 230,370 Q220,340 225,300 Q220,260 220,230 Z" />
              
              {/* Europe */}
              <path d="M450,90 Q480,75 520,80 Q560,70 590,85 Q620,80 640,95 Q660,110 650,130 Q630,145 600,140 Q560,150 520,145 Q480,155 450,145 Q430,130 440,110 Q445,95 450,90 Z" />
              
              {/* Africa */}
              <path d="M470,160 Q500,145 530,155 Q560,150 580,170 Q600,200 590,250 Q580,300 560,330 Q540,350 510,345 Q480,350 460,330 Q445,300 450,250 Q455,200 470,160 Z" />
              
              {/* Asia */}
              <path d="M580,70 Q640,55 720,60 Q800,50 860,70 Q900,85 920,110 Q930,140 910,170 Q880,195 840,190 Q800,200 750,195 Q700,205 660,195 Q620,190 600,165 Q580,140 585,110 Q580,85 580,70 Z" />
              <path d="M650,200 Q700,190 750,195 Q790,200 810,220 Q820,250 800,280 Q770,300 730,295 Q690,305 660,290 Q640,270 645,240 Q645,215 650,200 Z" />
              
              {/* Australia */}
              <path d="M800,300 Q850,285 890,295 Q920,310 930,340 Q925,370 900,385 Q860,395 820,385 Q790,370 790,340 Q790,315 800,300 Z" />
              
              {/* Japan */}
              <path d="M880,130 Q890,120 900,125 Q905,140 895,155 Q880,165 875,150 Q875,135 880,130 Z" />
            </g>

            {/* Attack Lines */}
            {attackLines.map((attack) => {
              const fromPos = latLngToPosition(attack.from.lat, attack.from.lng);
              const currentX = fromPos.x + (targetPosition.x - fromPos.x) * attack.progress;
              const currentY = fromPos.y + (targetPosition.y - fromPos.y) * attack.progress;
              
              // Calculate control point for curved line
              const midX = (fromPos.x + targetPosition.x) / 2;
              const midY = Math.min(fromPos.y, targetPosition.y) - 10;
              
              const pathProgress = `M ${fromPos.x * 10} ${fromPos.y * 5} Q ${midX * 10} ${midY * 5} ${currentX * 10} ${currentY * 5}`;
              
              return (
                <g key={attack.id} filter="url(#glow)">
                  <path
                    d={pathProgress}
                    fill="none"
                    stroke={getSeverityColor(attack.from.severity)}
                    strokeWidth="2"
                    strokeLinecap="round"
                    opacity={1 - attack.progress * 0.3}
                  />
                  <circle
                    cx={currentX * 10}
                    cy={currentY * 5}
                    r="5"
                    fill={getSeverityColor(attack.from.severity)}
                  >
                    <animate attributeName="r" values="3;6;3" dur="0.5s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="1;0.5;1" dur="0.5s" repeatCount="indefinite" />
                  </circle>
                </g>
              );
            })}

            {/* Target Rings */}
            <g>
              <circle
                cx={targetPosition.x * 10}
                cy={targetPosition.y * 5}
                r="20"
                fill="none"
                stroke="#00d4ff"
                strokeWidth="1"
                opacity="0.3"
              >
                <animate attributeName="r" values="15;30;15" dur="3s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.5;0.1;0.5" dur="3s" repeatCount="indefinite" />
              </circle>
              <circle
                cx={targetPosition.x * 10}
                cy={targetPosition.y * 5}
                r="12"
                fill="url(#targetGlow)"
              />
              <circle
                cx={targetPosition.x * 10}
                cy={targetPosition.y * 5}
                r="6"
                fill="#00d4ff"
              />
            </g>

            {/* Threat Points */}
            {threats.map((threat) => {
              const pos = latLngToPosition(threat.lat, threat.lng);
              const color = getSeverityColor(threat.severity);
              const size = threat.severity === 'critical' ? 8 : threat.severity === 'high' ? 6 : 5;
              
              return (
                <g 
                  key={threat.id} 
                  className="cursor-pointer"
                  onClick={() => setSelectedThreat(threat)}
                >
                  {/* Outer pulse ring for critical */}
                  {threat.severity === 'critical' && (
                    <circle
                      cx={pos.x * 10}
                      cy={pos.y * 5}
                      r={size + 6}
                      fill="none"
                      stroke={color}
                      strokeWidth="1"
                      opacity="0.4"
                    >
                      <animate attributeName="r" values={`${size};${size + 12};${size}`} dur="2s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.5;0;0.5" dur="2s" repeatCount="indefinite" />
                    </circle>
                  )}
                  
                  {/* Glow effect */}
                  <circle
                    cx={pos.x * 10}
                    cy={pos.y * 5}
                    r={size + 3}
                    fill={color}
                    opacity="0.3"
                    filter="url(#glow)"
                  />
                  
                  {/* Main point */}
                  <circle
                    cx={pos.x * 10}
                    cy={pos.y * 5}
                    r={size}
                    fill={color}
                    className="transition-all duration-200"
                  >
                    <animate attributeName="opacity" values="0.8;1;0.8" dur="1.5s" repeatCount="indefinite" />
                  </circle>
                  
                  {/* Center dot */}
                  <circle
                    cx={pos.x * 10}
                    cy={pos.y * 5}
                    r={size / 2}
                    fill="white"
                    opacity="0.9"
                  />
                </g>
              );
            })}
          </svg>

          {/* Mobile-friendly Threat Markers with Labels */}
          <div className="absolute inset-0 pointer-events-none">
            {threats.map((threat) => {
              const pos = latLngToPosition(threat.lat, threat.lng);
              return (
                <motion.div
                  key={`label-${threat.id}`}
                  className="absolute pointer-events-auto cursor-pointer group"
                  style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: 'translate(-50%, -50%)' }}
                  whileHover={{ scale: 1.2, zIndex: 50 }}
                  onClick={() => setSelectedThreat(threat)}
                >
                  <div className="relative">
                    {/* Hover tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block z-50">
                      <div className="bg-background/95 backdrop-blur-sm border border-border rounded px-2 py-1 whitespace-nowrap shadow-lg">
                        <div className="text-[10px] sm:text-xs font-medium">{threat.city}</div>
                        <div className="text-[8px] sm:text-[10px] text-muted-foreground">{threat.threatCount} threats</div>
                      </div>
                    </div>
                    
                    {/* Clickable area */}
                    <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full ${getSeverityBg(threat.severity)} opacity-0`} />
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Target Label */}
          <motion.div
            className="absolute z-20 pointer-events-none"
            style={{ left: `${targetPosition.x}%`, top: `${targetPosition.y}%`, transform: 'translate(-50%, -150%)' }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-1 bg-primary/20 backdrop-blur-sm border border-primary/50 rounded-full px-2 py-0.5">
              <Zap className="h-3 w-3 text-primary" />
              <span className="text-[10px] sm:text-xs font-medium text-primary">HQ Protected</span>
            </div>
          </motion.div>

          {/* Selected Threat Details */}
          <AnimatePresence>
            {selectedThreat && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:bottom-auto sm:top-4 bg-background/95 backdrop-blur-lg border border-border rounded-lg p-3 sm:p-4 sm:w-72 z-30 shadow-xl"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg ${getSeverityBg(selectedThreat.severity)}/20`}>
                      <AlertTriangle className="h-4 w-4" style={{ color: getSeverityColor(selectedThreat.severity) }} />
                    </div>
                    <div>
                      <div className="font-semibold text-sm">{selectedThreat.city}</div>
                      <div className="text-xs text-muted-foreground">{selectedThreat.country}</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedThreat(null)}
                    className="p-1 rounded-full hover:bg-secondary transition-colors"
                  >
                    <X className="h-4 w-4 text-muted-foreground" />
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-secondary/50 rounded-lg p-2">
                    <div className="text-muted-foreground mb-0.5">Type</div>
                    <div className="font-medium truncate">{selectedThreat.type}</div>
                  </div>
                  <div className="bg-secondary/50 rounded-lg p-2">
                    <div className="text-muted-foreground mb-0.5">Attacks</div>
                    <div className="font-medium text-destructive">{selectedThreat.threatCount}</div>
                  </div>
                  <div className="bg-secondary/50 rounded-lg p-2">
                    <div className="text-muted-foreground mb-0.5">Severity</div>
                    <Badge variant={selectedThreat.severity as any} className="text-[10px] px-1.5">
                      {selectedThreat.severity.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="bg-secondary/50 rounded-lg p-2">
                    <div className="text-muted-foreground mb-0.5">Coords</div>
                    <div className="font-mono text-[10px]">{selectedThreat.lat.toFixed(1)}°, {selectedThreat.lng.toFixed(1)}°</div>
                  </div>
                </div>
                
                <div className="mt-3 pt-3 border-t border-border/50">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Defense Status</span>
                    <span className="text-green-500 font-medium flex items-center gap-1">
                      <Shield className="h-3 w-3" /> Active
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 py-3 px-3 border-t border-border/50 bg-secondary/20">
          {[
            { label: 'Critical', color: 'bg-red-500', count: criticalCount },
            { label: 'High', color: 'bg-orange-500', count: highCount },
            { label: 'Medium', color: 'bg-yellow-500', count: threats.filter(t => t.severity === 'medium').length },
            { label: 'Low', color: 'bg-green-500', count: threats.filter(t => t.severity === 'low').length },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-1.5">
              <div className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full ${item.color}`} />
              <span className="text-[10px] sm:text-xs text-muted-foreground">
                {item.label} <span className="font-medium text-foreground">({item.count})</span>
              </span>
            </div>
          ))}
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] sm:text-xs text-muted-foreground">Target HQ</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
