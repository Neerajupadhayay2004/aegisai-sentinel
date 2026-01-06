import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
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
  Radio,
  Satellite,
  Cloud,
  Link2,
  Eye,
  Lock,
  Crosshair,
  Settings,
  Layers,
  Navigation
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  { id: '13', country: 'UK', city: 'London', lat: 51.51, lng: -0.13, threatCount: 31, severity: 'medium', type: 'Insider Threat', ip: '185.93.xxx.xxx' },
  { id: '14', country: 'South Korea', city: 'Seoul', lat: 37.57, lng: 126.98, threatCount: 28, severity: 'medium', type: 'Zero-day Exploit', ip: '211.252.xxx.xxx' },
  { id: '15', country: 'Singapore', city: 'Singapore', lat: 1.35, lng: 103.82, threatCount: 19, severity: 'low', type: 'Data Exfiltration', ip: '203.116.xxx.xxx' },
];

// HQ Location - New Delhi, India
const HQ_LOCATION = { lat: 28.6139, lng: 77.2090 };

export const GlobalThreatMapAdvanced = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [mapToken, setMapToken] = useState('');
  const [isMapInitialized, setIsMapInitialized] = useState(false);
  const [selectedThreat, setSelectedThreat] = useState<ThreatLocation | null>(null);
  const [attackEvents, setAttackEvents] = useState<AttackEvent[]>([]);
  const [mapStyle, setMapStyle] = useState<'dark' | 'satellite' | 'light'>('dark');
  const [liveStats, setLiveStats] = useState({
    totalAttacks: 24589,
    blocked: 24312,
    intercepted: 277,
    activeThreats: threatLocations.length,
  });

  const { 
    soundEnabled, 
    notificationsEnabled, 
    toggleSound, 
    requestNotifications,
    triggerAlert 
  } = useThreatAlerts();

  // Get severity color
  const getSeverityColor = (severity: string): string => {
    switch (severity) {
      case 'critical': return '#ff3b3b';
      case 'high': return '#ff8c00';
      case 'medium': return '#ffd700';
      case 'low': return '#00ff88';
      default: return '#888888';
    }
  };

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || !mapToken || isMapInitialized) return;

    mapboxgl.accessToken = mapToken;

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: mapStyle === 'dark' 
          ? 'mapbox://styles/mapbox/dark-v11'
          : mapStyle === 'satellite'
          ? 'mapbox://styles/mapbox/satellite-streets-v12'
          : 'mapbox://styles/mapbox/light-v11',
        projection: 'globe',
        zoom: 1.8,
        center: [30, 20],
        pitch: 45,
        bearing: 0,
      });

      map.current.addControl(
        new mapboxgl.NavigationControl({ visualizePitch: true }),
        'top-right'
      );

      map.current.on('style.load', () => {
        if (!map.current) return;

        // Add atmosphere and fog for 3D globe effect
        map.current.setFog({
          color: 'rgb(10, 10, 30)',
          'high-color': 'rgb(20, 20, 60)',
          'horizon-blend': 0.1,
          'star-intensity': 0.15,
          'space-color': 'rgb(5, 5, 15)',
        });

        // Add threat markers
        threatLocations.forEach((threat) => {
          const el = document.createElement('div');
          el.className = 'threat-marker';
          el.style.cssText = `
            width: ${threat.severity === 'critical' ? 24 : threat.severity === 'high' ? 20 : 16}px;
            height: ${threat.severity === 'critical' ? 24 : threat.severity === 'high' ? 20 : 16}px;
            background: ${getSeverityColor(threat.severity)};
            border: 2px solid rgba(255,255,255,0.3);
            border-radius: 50%;
            cursor: pointer;
            box-shadow: 0 0 20px ${getSeverityColor(threat.severity)}, 0 0 40px ${getSeverityColor(threat.severity)}50;
            animation: pulse 2s ease-in-out infinite;
          `;

          const marker = new mapboxgl.Marker(el)
            .setLngLat([threat.lng, threat.lat])
            .addTo(map.current!);

          el.addEventListener('click', () => {
            setSelectedThreat(threat);
            map.current?.flyTo({
              center: [threat.lng, threat.lat],
              zoom: 5,
              duration: 2000,
            });
          });

          markersRef.current.push(marker);
        });

        // Add HQ marker
        const hqEl = document.createElement('div');
        hqEl.style.cssText = `
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, #00ff88, #00cc66);
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: 0 0 30px #00ff88, 0 0 60px #00ff8850;
          animation: pulse 1.5s ease-in-out infinite;
        `;
        
        new mapboxgl.Marker(hqEl)
          .setLngLat([HQ_LOCATION.lng, HQ_LOCATION.lat])
          .addTo(map.current!);

        setIsMapInitialized(true);
      });

      // Auto-rotate globe
      const secondsPerRevolution = 300;
      let userInteracting = false;

      function spinGlobe() {
        if (!map.current || userInteracting) return;
        const zoom = map.current.getZoom();
        if (zoom < 5) {
          const center = map.current.getCenter();
          center.lng += 360 / secondsPerRevolution;
          map.current.easeTo({ center, duration: 1000, easing: (n) => n });
        }
      }

      map.current.on('mousedown', () => { userInteracting = true; });
      map.current.on('mouseup', () => { userInteracting = false; spinGlobe(); });
      map.current.on('moveend', spinGlobe);
      spinGlobe();

    } catch (error) {
      console.error('Error initializing map:', error);
    }

    return () => {
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];
      map.current?.remove();
      map.current = null;
      setIsMapInitialized(false);
    };
  }, [mapToken]);

  // Update map style
  useEffect(() => {
    if (!map.current || !isMapInitialized) return;
    
    const styleUrl = mapStyle === 'dark' 
      ? 'mapbox://styles/mapbox/dark-v11'
      : mapStyle === 'satellite'
      ? 'mapbox://styles/mapbox/satellite-streets-v12'
      : 'mapbox://styles/mapbox/light-v11';
    
    map.current.setStyle(styleUrl);
  }, [mapStyle, isMapInitialized]);

  // Simulate attack events
  useEffect(() => {
    const interval = setInterval(() => {
      const randomThreat = threatLocations[Math.floor(Math.random() * threatLocations.length)];
      const isBlocked = Math.random() > 0.12;

      setAttackEvents(prev => [...prev.slice(-20), {
        id: Date.now(),
        from: randomThreat,
        timestamp: new Date(),
        blocked: isBlocked,
      }]);

      setLiveStats(prev => ({
        ...prev,
        totalAttacks: prev.totalAttacks + 1,
        blocked: isBlocked ? prev.blocked + 1 : prev.blocked,
        intercepted: !isBlocked ? prev.intercepted + 1 : prev.intercepted,
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
  }, [triggerAlert]);

  const criticalThreats = threatLocations.filter(t => t.severity === 'critical');

  // Render fallback SVG map if no token
  if (!mapToken) {
    return (
      <Card variant="glass" className="relative overflow-hidden">
        <style>{`
          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.3); opacity: 0.6; }
          }
          @keyframes attackLine {
            0% { stroke-dashoffset: 100; opacity: 0; }
            20% { opacity: 1; }
            100% { stroke-dashoffset: 0; opacity: 0; }
          }
        `}</style>
        
        <CardHeader className="pb-2 px-3 sm:px-6">
          <CardTitle className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Globe className="h-6 w-6 sm:h-7 sm:w-7 text-primary animate-pulse" />
                <div className="absolute inset-0 bg-primary/40 blur-lg rounded-full" />
              </div>
              <div>
                <span className="text-lg sm:text-xl font-bold">
                  <span className="text-gradient-cyber">Global</span> Threat Map
                </span>
                <p className="text-[10px] sm:text-xs text-muted-foreground">Real-time cyber attack visualization</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8" onClick={toggleSound}>
                {soundEnabled ? <Volume2 className="h-3 w-3 sm:h-4 sm:w-4 text-primary" /> : <VolumeX className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />}
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8" onClick={requestNotifications}>
                {notificationsEnabled ? <Bell className="h-3 w-3 sm:h-4 sm:w-4 text-primary" /> : <BellOff className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />}
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
              <div className="text-base sm:text-xl font-bold text-destructive">{liveStats.totalAttacks.toLocaleString()}</div>
              <div className="text-[8px] sm:text-[10px] text-muted-foreground">Total Attacks</div>
            </motion.div>
            <motion.div 
              className="text-center p-1.5 sm:p-2 rounded-lg bg-background/60 backdrop-blur-sm border border-border/30"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            >
              <div className="text-base sm:text-xl font-bold text-success">{liveStats.blocked.toLocaleString()}</div>
              <div className="text-[8px] sm:text-[10px] text-muted-foreground">Blocked</div>
            </motion.div>
            <motion.div 
              className="text-center p-1.5 sm:p-2 rounded-lg bg-background/60 backdrop-blur-sm border border-border/30"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            >
              <div className="text-base sm:text-xl font-bold text-warning">{criticalThreats.length}</div>
              <div className="text-[8px] sm:text-[10px] text-muted-foreground">Critical</div>
            </motion.div>
            <motion.div 
              className="text-center p-1.5 sm:p-2 rounded-lg bg-background/60 backdrop-blur-sm border border-border/30"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
            >
              <div className="text-base sm:text-xl font-bold text-primary">
                {((liveStats.blocked / liveStats.totalAttacks) * 100).toFixed(1)}%
              </div>
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
              </defs>

              {/* Grid */}
              {Array.from({ length: 12 }).map((_, i) => (
                <line key={`v-${i}`} x1={i * 83.33} y1="0" x2={i * 83.33} y2="500" stroke="hsl(var(--border))" strokeOpacity="0.2" strokeWidth="0.5" />
              ))}
              {Array.from({ length: 6 }).map((_, i) => (
                <line key={`h-${i}`} x1="0" y1={i * 83.33} x2="1000" y2={i * 83.33} stroke="hsl(var(--border))" strokeOpacity="0.2" strokeWidth="0.5" />
              ))}

              {/* Simplified continents */}
              <g fill="hsl(var(--muted))" fillOpacity="0.15" stroke="hsl(var(--primary))" strokeOpacity="0.3" strokeWidth="0.5">
                {/* North America */}
                <path d="M100,80 L200,60 L280,80 L300,140 L280,200 L220,220 L160,200 L100,160 Z" />
                {/* South America */}
                <path d="M220,250 L280,260 L300,320 L280,400 L240,420 L200,380 L200,300 Z" />
                {/* Europe */}
                <path d="M440,80 L520,70 L560,100 L540,150 L480,160 L440,130 Z" />
                {/* Africa */}
                <path d="M460,180 L540,170 L580,220 L560,340 L500,380 L440,340 L440,240 Z" />
                {/* Asia */}
                <path d="M560,60 L720,50 L820,80 L860,140 L820,200 L720,220 L620,180 L580,120 Z" />
                {/* Australia */}
                <path d="M780,300 L860,290 L900,340 L880,400 L800,400 L760,360 Z" />
              </g>

              {/* Attack lines animation */}
              {attackEvents.slice(-10).map((event, i) => {
                const fromX = ((event.from.lng + 180) / 360) * 1000;
                const fromY = ((90 - event.from.lat) / 180) * 500;
                const toX = ((HQ_LOCATION.lng + 180) / 360) * 1000;
                const toY = ((90 - HQ_LOCATION.lat) / 180) * 500;
                return (
                  <g key={event.id}>
                    <line
                      x1={fromX}
                      y1={fromY}
                      x2={toX}
                      y2={toY}
                      stroke={event.blocked ? '#22c55e' : '#ef4444'}
                      strokeWidth="1"
                      strokeOpacity="0.6"
                      strokeDasharray="5,5"
                      style={{ animation: `attackLine 2s ease-out ${i * 0.1}s` }}
                    />
                  </g>
                );
              })}

              {/* Threat locations */}
              {threatLocations.map((threat) => {
                const x = ((threat.lng + 180) / 360) * 1000;
                const y = ((90 - threat.lat) / 180) * 500;
                const size = threat.severity === 'critical' ? 8 : threat.severity === 'high' ? 6 : 4;
                return (
                  <g key={threat.id} onClick={() => setSelectedThreat(threat)} className="cursor-pointer">
                    <circle
                      cx={x}
                      cy={y}
                      r={size * 2}
                      fill={getSeverityColor(threat.severity)}
                      fillOpacity="0.2"
                      style={{ animation: 'pulse 2s ease-in-out infinite' }}
                    />
                    <circle
                      cx={x}
                      cy={y}
                      r={size}
                      fill={getSeverityColor(threat.severity)}
                      filter="url(#glow)"
                    />
                  </g>
                );
              })}

              {/* HQ Location */}
              <g>
                <circle
                  cx={((HQ_LOCATION.lng + 180) / 360) * 1000}
                  cy={((90 - HQ_LOCATION.lat) / 180) * 500}
                  r="12"
                  fill="#00ff88"
                  fillOpacity="0.3"
                  style={{ animation: 'pulse 1.5s ease-in-out infinite' }}
                />
                <circle
                  cx={((HQ_LOCATION.lng + 180) / 360) * 1000}
                  cy={((90 - HQ_LOCATION.lat) / 180) * 500}
                  r="6"
                  fill="#00ff88"
                  filter="url(#glow)"
                />
              </g>
            </svg>

            {/* Legend */}
            <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 p-2 sm:p-3 rounded-lg bg-background/80 backdrop-blur-sm border border-border/30">
              <div className="text-[10px] sm:text-xs font-medium mb-1 sm:mb-2">Threat Severity</div>
              <div className="space-y-0.5 sm:space-y-1">
                {[
                  { label: 'Critical', color: '#ff3b3b' },
                  { label: 'High', color: '#ff8c00' },
                  { label: 'Medium', color: '#ffd700' },
                  { label: 'Low', color: '#00ff88' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-1 sm:gap-2">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-[8px] sm:text-[10px] text-muted-foreground">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* HQ Label */}
            <div className="absolute top-2 right-2 sm:top-4 sm:right-4 p-2 sm:p-3 rounded-lg bg-background/80 backdrop-blur-sm border border-border/30">
              <div className="flex items-center gap-1 sm:gap-2">
                <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] sm:text-xs font-medium">HQ: New Delhi</span>
              </div>
            </div>
          </div>

          {/* Threat Details Panel */}
          <AnimatePresence>
            {selectedThreat && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="p-3 sm:p-4 border-t border-border/30 bg-secondary/30"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className={`text-[10px] ${
                        selectedThreat.severity === 'critical' ? 'bg-red-500/20 text-red-400' :
                        selectedThreat.severity === 'high' ? 'bg-orange-500/20 text-orange-400' :
                        selectedThreat.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-green-500/20 text-green-400'
                      }`}>
                        {selectedThreat.severity}
                      </Badge>
                      <span className="text-sm font-bold">{selectedThreat.city}, {selectedThreat.country}</span>
                    </div>
                    <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 text-xs">
                      <div>
                        <span className="text-muted-foreground">Type:</span>
                        <span className="ml-1 font-medium">{selectedThreat.type}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Threats:</span>
                        <span className="ml-1 font-medium text-destructive">{selectedThreat.threatCount}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">IP Range:</span>
                        <span className="ml-1 font-mono">{selectedThreat.ip}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Status:</span>
                        <span className="ml-1 font-medium text-yellow-500">Active</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setSelectedThreat(null)} className="h-6 w-6 sm:h-8 sm:w-8">
                    <X className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Recent Attacks Feed */}
          <div className="p-3 sm:p-4 border-t border-border/30">
            <h4 className="text-xs sm:text-sm font-medium mb-2 sm:mb-3 flex items-center gap-2">
              <Activity className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
              Recent Attack Feed
            </h4>
            <div className="space-y-1 sm:space-y-2 max-h-[120px] sm:max-h-[150px] overflow-y-auto">
              {attackEvents.slice(-8).reverse().map((event) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between text-[10px] sm:text-xs p-1.5 sm:p-2 rounded bg-secondary/30"
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${event.blocked ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className="truncate max-w-[100px] sm:max-w-none">{event.from.city}, {event.from.country}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={event.blocked ? 'success' : 'destructive'} className="text-[8px] sm:text-[10px]">
                      {event.blocked ? 'Blocked' : 'Alert'}
                    </Badge>
                    <span className="text-muted-foreground hidden sm:inline">
                      {new Date(event.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Mapbox Token Input */}
          <div className="p-3 sm:p-4 border-t border-border/30 bg-secondary/20">
            <p className="text-[10px] sm:text-xs text-muted-foreground mb-2">
              Optional: Add Mapbox token for enhanced 3D globe view
            </p>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="pk.eyJ1Ij..."
                value={mapToken}
                onChange={(e) => setMapToken(e.target.value)}
                className="flex-1 h-8 text-xs"
              />
              <Button size="sm" onClick={() => setMapToken(mapToken)} disabled={!mapToken} className="h-8 text-xs">
                Enable 3D
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="glass" className="relative overflow-hidden">
      {/* Add CSS for pulse animation */}
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.8; }
        }
      `}</style>

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
              <p className="text-xs text-muted-foreground">Real-time 3D cyber attack visualization</p>
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

        {/* Stats Bar */}
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
        <div className="relative w-full aspect-[2/1] min-h-[500px] lg:min-h-[600px]">
          <div ref={mapContainer} className="absolute inset-0" />
          
          {/* Map Style Controls */}
          <div className="absolute top-4 left-4 z-10 flex gap-2">
            <Button
              size="sm"
              variant={mapStyle === 'dark' ? 'default' : 'outline'}
              onClick={() => setMapStyle('dark')}
              className="h-8 text-xs"
            >
              <Layers className="h-3 w-3 mr-1" />
              Dark
            </Button>
            <Button
              size="sm"
              variant={mapStyle === 'satellite' ? 'default' : 'outline'}
              onClick={() => setMapStyle('satellite')}
              className="h-8 text-xs"
            >
              <Satellite className="h-3 w-3 mr-1" />
              Satellite
            </Button>
            <Button
              size="sm"
              variant={mapStyle === 'light' ? 'default' : 'outline'}
              onClick={() => setMapStyle('light')}
              className="h-8 text-xs"
            >
              <Globe className="h-3 w-3 mr-1" />
              Light
            </Button>
          </div>

          {/* HQ Indicator */}
          <div className="absolute bottom-4 left-4 z-10 p-3 bg-background/80 backdrop-blur-sm rounded-lg border border-success/30">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-success rounded-full animate-pulse" />
              <span className="text-xs font-semibold">HQ: New Delhi, India</span>
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">Defense Command Center</p>
          </div>

          {/* Live Attack Feed */}
          <div className="absolute top-4 right-16 z-10 w-64 max-h-48 overflow-hidden">
            <div className="bg-background/80 backdrop-blur-sm rounded-lg border border-border/50 p-2">
              <div className="text-xs font-semibold mb-2 flex items-center gap-1">
                <Activity className="h-3 w-3 text-primary" />
                Live Attack Feed
              </div>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                <AnimatePresence>
                  {attackEvents.slice(-5).reverse().map((event) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className={`text-[10px] p-1.5 rounded ${event.blocked ? 'bg-success/20' : 'bg-destructive/20'}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono">{event.from.city}</span>
                        <Badge variant={event.blocked ? 'success' : 'critical'} className="text-[8px] h-4">
                          {event.blocked ? 'BLOCKED' : 'ALERT'}
                        </Badge>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Threat Details */}
        <AnimatePresence>
          {selectedThreat && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="p-4 bg-gradient-to-r from-destructive/10 via-secondary/30 to-destructive/10 border-t border-destructive/30"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full animate-pulse"
                    style={{ background: getSeverityColor(selectedThreat.severity) }}
                  />
                  <div>
                    <h4 className="font-bold">{selectedThreat.city}, {selectedThreat.country}</h4>
                    <p className="text-sm text-muted-foreground">{selectedThreat.type}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setSelectedThreat(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                <div>
                  <div className="text-xs text-muted-foreground">Threat Count</div>
                  <div className="text-lg font-bold">{selectedThreat.threatCount}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Severity</div>
                  <Badge variant={selectedThreat.severity as any} className="mt-1">
                    {selectedThreat.severity.toUpperCase()}
                  </Badge>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Source IP</div>
                  <div className="text-sm font-mono">{selectedThreat.ip}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Coordinates</div>
                  <div className="text-sm font-mono">{selectedThreat.lat.toFixed(2)}, {selectedThreat.lng.toFixed(2)}</div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Threat Legend */}
        <div className="p-4 bg-secondary/20 border-t border-border/30">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4 flex-wrap">
              <span className="text-xs font-semibold">Threat Severity:</span>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-[#ff3b3b]" />
                <span className="text-[10px]">Critical</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-[#ff8c00]" />
                <span className="text-[10px]">High</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-[#ffd700]" />
                <span className="text-[10px]">Medium</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-[#00ff88]" />
                <span className="text-[10px]">Low</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-success" />
              <span className="text-xs">All data encrypted & blockchain verified</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
