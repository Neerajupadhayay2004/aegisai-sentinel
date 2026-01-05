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

  if (!mapToken) {
    return (
      <Card variant="glass" className="relative overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Globe className="h-7 w-7 text-primary" />
            <span className="text-gradient-cyber">Global</span> Threat Intelligence
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Enter your Mapbox public token to enable the interactive 3D threat map.
            Get your token from <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">mapbox.com</a>
          </p>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="pk.eyJ1Ij..."
              value={mapToken}
              onChange={(e) => setMapToken(e.target.value)}
              className="flex-1"
            />
            <Button onClick={() => setMapToken(mapToken)} disabled={!mapToken}>
              Initialize Map
            </Button>
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
