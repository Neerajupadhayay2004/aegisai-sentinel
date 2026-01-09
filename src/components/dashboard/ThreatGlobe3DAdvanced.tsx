import { useRef, useMemo, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Sphere, Html, Stars, Line } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Globe, 
  Maximize2, 
  Minimize2, 
  Volume2, 
  VolumeX, 
  RefreshCw,
  AlertTriangle,
  Shield,
  Activity,
  Target,
  Zap,
} from 'lucide-react';

interface ThreatPoint {
  id: string;
  lat: number;
  lng: number;
  severity: 'critical' | 'high' | 'medium' | 'low';
  type: string;
  country: string;
  ip: string;
  timestamp: Date;
  attackVector: string;
}

interface AttackArc {
  id: string;
  from: { lat: number; lng: number; country: string };
  to: { lat: number; lng: number; country: string };
  severity: 'critical' | 'high' | 'medium' | 'low';
  type: string;
  progress: number;
}

// Convert lat/lng to 3D coordinates
const latLngToVector3 = (lat: number, lng: number, radius: number): THREE.Vector3 => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
};

// Globe with continents outline
const GlobeMesh = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const wireframeRef = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.0005;
    }
    if (wireframeRef.current) {
      wireframeRef.current.rotation.y += 0.0005;
    }
  });

  return (
    <group>
      {/* Main globe */}
      <Sphere ref={meshRef} args={[2, 64, 64]}>
        <meshPhongMaterial
          color="#0a0f1a"
          transparent
          opacity={0.95}
          shininess={10}
        />
      </Sphere>
      
      {/* Grid lines */}
      <Sphere ref={wireframeRef} args={[2.01, 36, 18]}>
        <meshBasicMaterial
          color="#00d4aa"
          transparent
          opacity={0.08}
          wireframe
        />
      </Sphere>
      
      {/* Atmosphere glow */}
      <Sphere args={[2.15, 64, 64]}>
        <meshBasicMaterial
          color="#00d4aa"
          transparent
          opacity={0.05}
          side={THREE.BackSide}
        />
      </Sphere>
      
      {/* Inner glow */}
      <Sphere args={[2.08, 64, 64]}>
        <meshBasicMaterial
          color="#0ea5e9"
          transparent
          opacity={0.03}
          side={THREE.BackSide}
        />
      </Sphere>
    </group>
  );
};

// Animated threat point
const ThreatPointMesh = ({ point, radius, onHover }: { 
  point: ThreatPoint; 
  radius: number;
  onHover: (point: ThreatPoint | null) => void;
}) => {
  const position = useMemo(() => latLngToVector3(point.lat, point.lng, radius), [point.lat, point.lng, radius]);
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  const color = useMemo(() => {
    switch (point.severity) {
      case 'critical': return '#ef4444';
      case 'high': return '#f97316';
      case 'medium': return '#eab308';
      case 'low': return '#22c55e';
      default: return '#00d4aa';
    }
  }, [point.severity]);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const scale = 1 + Math.sin(clock.getElapsedTime() * 4 + point.lat) * 0.4;
      meshRef.current.scale.setScalar(scale);
    }
    if (ringRef.current) {
      ringRef.current.rotation.z += 0.02;
      const ringScale = 1 + Math.sin(clock.getElapsedTime() * 2) * 0.2;
      ringRef.current.scale.setScalar(ringScale);
    }
  });

  return (
    <group position={position}>
      {/* Core point */}
      <mesh
        ref={meshRef}
        onPointerOver={() => { setHovered(true); onHover(point); }}
        onPointerOut={() => { setHovered(false); onHover(null); }}
      >
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.95} />
      </mesh>
      
      {/* Outer glow */}
      <mesh scale={[2, 2, 2]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.3} />
      </mesh>
      
      {/* Pulsing ring for critical */}
      {point.severity === 'critical' && (
        <mesh ref={ringRef}>
          <ringGeometry args={[0.08, 0.1, 32]} />
          <meshBasicMaterial color={color} transparent opacity={0.5} side={THREE.DoubleSide} />
        </mesh>
      )}
      
      {/* Tooltip */}
      {hovered && (
        <Html distanceFactor={8} style={{ pointerEvents: 'none' }}>
          <div className="bg-card/95 backdrop-blur-md border border-primary/30 rounded-lg p-3 shadow-2xl min-w-[220px] transform -translate-x-1/2">
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-2 h-2 rounded-full animate-pulse ${
                point.severity === 'critical' ? 'bg-red-500' :
                point.severity === 'high' ? 'bg-orange-500' :
                point.severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
              }`} />
              <span className="text-sm font-semibold text-foreground">{point.type}</span>
            </div>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Location:</span>
                <span className="text-foreground">{point.country}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">IP:</span>
                <span className="text-foreground font-mono">{point.ip}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Vector:</span>
                <span className="text-foreground">{point.attackVector}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Severity:</span>
                <span className={`font-semibold ${
                  point.severity === 'critical' ? 'text-red-500' :
                  point.severity === 'high' ? 'text-orange-500' :
                  point.severity === 'medium' ? 'text-yellow-500' : 'text-green-500'
                }`}>{point.severity.toUpperCase()}</span>
              </div>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
};

// Animated attack arc
const AttackArcMesh = ({ arc, radius }: { arc: AttackArc; radius: number }) => {
  const progressRef = useRef(arc.progress);
  const [points, setPoints] = useState<THREE.Vector3[]>([]);
  
  const { curve, color } = useMemo(() => {
    const from = latLngToVector3(arc.from.lat, arc.from.lng, radius);
    const to = latLngToVector3(arc.to.lat, arc.to.lng, radius);
    
    const mid = new THREE.Vector3().addVectors(from, to).multiplyScalar(0.5);
    const distance = from.distanceTo(to);
    mid.normalize().multiplyScalar(radius + distance * 0.4);
    
    const curve = new THREE.QuadraticBezierCurve3(from, mid, to);
    
    const color = arc.severity === 'critical' ? '#ef4444' :
                  arc.severity === 'high' ? '#f97316' :
                  arc.severity === 'medium' ? '#eab308' : '#22c55e';
    
    return { curve, color };
  }, [arc, radius]);

  useFrame(() => {
    progressRef.current = (progressRef.current + 0.006) % 1;
    const numPoints = Math.floor(50 * progressRef.current) + 1;
    const newPoints = curve.getPoints(50).slice(0, numPoints);
    setPoints(newPoints);
  });

  if (points.length < 2) return null;

  return (
    <group>
      <Line
        points={points}
        color={color}
        lineWidth={2}
        transparent
        opacity={0.7}
      />
      {/* Moving particle at the end */}
      {points.length > 0 && (
        <mesh position={points[points.length - 1]}>
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshBasicMaterial color={color} />
        </mesh>
      )}
    </group>
  );
};

// Radar sweep effect
const RadarSweep = ({ radius }: { radius: number }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.3;
    }
  });

  return (
    <mesh ref={meshRef} rotation={[Math.PI / 2, 0, 0]}>
      <ringGeometry args={[0, radius * 1.1, 64, 1, 0, Math.PI / 4]} />
      <meshBasicMaterial 
        color="#00d4aa" 
        transparent 
        opacity={0.1} 
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

// Scene component
const GlobeScene = ({ 
  threats, 
  attacks,
  onHoverThreat,
}: { 
  threats: ThreatPoint[]; 
  attacks: AttackArc[];
  onHoverThreat: (point: ThreatPoint | null) => void;
}) => {
  const { camera } = useThree();
  
  useEffect(() => {
    camera.position.set(0, 0, 5);
  }, [camera]);

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1.2} color="#ffffff" />
      <pointLight position={[-10, -10, -10]} intensity={0.6} color="#00d4aa" />
      <pointLight position={[0, 10, 5]} intensity={0.4} color="#0ea5e9" />
      
      {/* Stars background */}
      <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
      
      {/* Globe */}
      <GlobeMesh />
      
      {/* Radar sweep */}
      <RadarSweep radius={2} />
      
      {/* Threat points */}
      {threats.map((threat) => (
        <ThreatPointMesh 
          key={threat.id} 
          point={threat} 
          radius={2.08}
          onHover={onHoverThreat}
        />
      ))}
      
      {/* Attack arcs */}
      {attacks.map((arc) => (
        <AttackArcMesh key={arc.id} arc={arc} radius={2.05} />
      ))}
      
      {/* Controls */}
      <OrbitControls
        enableZoom={true}
        enablePan={false}
        minDistance={3}
        maxDistance={10}
        autoRotate
        autoRotateSpeed={0.3}
        dampingFactor={0.05}
        enableDamping
      />
    </>
  );
};

// Generate random threat data
const generateRandomThreats = (): ThreatPoint[] => {
  const locations = [
    { lat: 39.9, lng: 116.4, country: 'China' },
    { lat: 55.7, lng: 37.6, country: 'Russia' },
    { lat: 28.6, lng: 77.2, country: 'India' },
    { lat: 35.6, lng: 139.7, country: 'Japan' },
    { lat: 51.5, lng: -0.1, country: 'UK' },
    { lat: 40.7, lng: -74.0, country: 'USA' },
    { lat: 48.8, lng: 2.3, country: 'France' },
    { lat: 52.5, lng: 13.4, country: 'Germany' },
    { lat: -23.5, lng: -46.6, country: 'Brazil' },
    { lat: -33.8, lng: 151.2, country: 'Australia' },
    { lat: 1.3, lng: 103.8, country: 'Singapore' },
    { lat: 25.0, lng: 55.2, country: 'UAE' },
    { lat: 37.5, lng: 127.0, country: 'South Korea' },
    { lat: 41.0, lng: 28.9, country: 'Turkey' },
    { lat: 19.4, lng: -99.1, country: 'Mexico' },
    { lat: 59.3, lng: 18.0, country: 'Sweden' },
    { lat: 50.4, lng: 30.5, country: 'Ukraine' },
    { lat: 35.2, lng: -80.8, country: 'USA (NC)' },
    { lat: 34.0, lng: -118.2, country: 'USA (CA)' },
    { lat: 22.3, lng: 114.2, country: 'Hong Kong' },
  ];

  const types = ['DDoS Attack', 'SQL Injection', 'Brute Force', 'Malware C2', 'Phishing', 'Ransomware', 'Zero-Day Exploit', 'Credential Stuffing', 'API Abuse'];
  const vectors = ['Port 443', 'Port 22', 'Port 3389', 'Email', 'DNS', 'HTTP', 'SMB'];
  const severities: ('critical' | 'high' | 'medium' | 'low')[] = ['critical', 'high', 'medium', 'low'];

  return locations.map((loc, i) => ({
    id: `threat-${i}`,
    lat: loc.lat + (Math.random() - 0.5) * 3,
    lng: loc.lng + (Math.random() - 0.5) * 3,
    severity: severities[Math.floor(Math.random() * severities.length)],
    type: types[Math.floor(Math.random() * types.length)],
    country: loc.country,
    ip: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
    timestamp: new Date(Date.now() - Math.random() * 3600000),
    attackVector: vectors[Math.floor(Math.random() * vectors.length)],
  }));
};

const generateRandomAttacks = (): AttackArc[] => {
  const sources = [
    { lat: 39.9, lng: 116.4, country: 'China' },
    { lat: 55.7, lng: 37.6, country: 'Russia' },
    { lat: 35.6, lng: 139.7, country: 'Japan' },
    { lat: -23.5, lng: -46.6, country: 'Brazil' },
    { lat: 50.4, lng: 30.5, country: 'Ukraine' },
    { lat: 1.3, lng: 103.8, country: 'Singapore' },
  ];
  
  const targets = [
    { lat: 40.7, lng: -74.0, country: 'USA (NY)' },
    { lat: 51.5, lng: -0.1, country: 'UK' },
    { lat: 52.5, lng: 13.4, country: 'Germany' },
    { lat: -33.8, lng: 151.2, country: 'Australia' },
    { lat: 34.0, lng: -118.2, country: 'USA (CA)' },
    { lat: 48.8, lng: 2.3, country: 'France' },
  ];

  const types = ['DDoS', 'Data Exfil', 'C2 Traffic', 'Lateral Move'];
  const severities: ('critical' | 'high' | 'medium' | 'low')[] = ['critical', 'high', 'medium', 'low'];

  return sources.map((source, i) => ({
    id: `arc-${i}`,
    from: source,
    to: targets[i % targets.length],
    severity: severities[Math.floor(Math.random() * severities.length)],
    type: types[Math.floor(Math.random() * types.length)],
    progress: Math.random(),
  }));
};

interface ThreatGlobe3DAdvancedProps {
  className?: string;
}

export const ThreatGlobe3DAdvanced = ({ className = '' }: ThreatGlobe3DAdvancedProps) => {
  const [threats, setThreats] = useState<ThreatPoint[]>(generateRandomThreats());
  const [attacks, setAttacks] = useState<AttackArc[]>(generateRandomAttacks());
  const [hoveredThreat, setHoveredThreat] = useState<ThreatPoint | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setThreats(generateRandomThreats());
      setAttacks(generateRandomAttacks());
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Play alert sound for critical threats
  useEffect(() => {
    if (soundEnabled && threats.some(t => t.severity === 'critical')) {
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleVUeA0Gg3+mgc0cjJXm+6bF6SEEfR6fv25dZQFQmE4rXu4FaSWMnAoTP');
      audio.volume = 0.3;
      audio.play().catch(() => {});
    }
  }, [threats, soundEnabled]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement && containerRef.current) {
      containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const criticalCount = threats.filter(t => t.severity === 'critical').length;
  const highCount = threats.filter(t => t.severity === 'high').length;
  const activeAttacks = attacks.length;

  return (
    <Card variant="glass" className={`overflow-hidden ${className}`}>
      <CardHeader className="pb-2 border-b border-border/50">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/30">
              <Globe className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">3D Global Threat Map</CardTitle>
              <p className="text-xs text-muted-foreground">Real-time attack visualization</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="destructive" className="gap-1">
              <AlertTriangle className="h-3 w-3" />
              {criticalCount} Critical
            </Badge>
            <Badge variant="secondary" className="gap-1 bg-orange-500/20 text-orange-500 border-orange-500/30">
              <Activity className="h-3 w-3" />
              {activeAttacks} Active
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div 
          ref={containerRef}
          className={`relative ${isFullscreen ? 'h-screen' : 'h-[500px]'} bg-gradient-to-b from-background to-card`}
        >
          {/* 3D Canvas */}
          <Suspense fallback={
            <div className="w-full h-full flex items-center justify-center">
              <RefreshCw className="h-8 w-8 text-primary animate-spin" />
            </div>
          }>
            <Canvas
              camera={{ position: [0, 0, 5], fov: 45 }}
              style={{ background: 'transparent' }}
              gl={{ antialias: true, alpha: true }}
            >
              <GlobeScene 
                threats={threats} 
                attacks={attacks}
                onHoverThreat={setHoveredThreat}
              />
            </Canvas>
          </Suspense>

          {/* Controls Overlay */}
          <div className="absolute top-4 right-4 flex gap-2">
            <Button
              size="icon"
              variant="ghost"
              className="bg-background/50 backdrop-blur-sm"
              onClick={() => setSoundEnabled(!soundEnabled)}
            >
              {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="bg-background/50 backdrop-blur-sm"
              onClick={toggleFullscreen}
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
          </div>

          {/* Stats Overlay */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-4 left-4 right-4"
          >
            <div className="flex flex-wrap gap-2 justify-center">
              <div className="bg-card/80 backdrop-blur-md border border-destructive/30 rounded-lg px-3 py-2 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
                <span className="text-xs font-medium">Critical: {criticalCount}</span>
              </div>
              <div className="bg-card/80 backdrop-blur-md border border-warning/30 rounded-lg px-3 py-2 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-warning" />
                <span className="text-xs font-medium">High: {highCount}</span>
              </div>
              <div className="bg-card/80 backdrop-blur-md border border-yellow-500/30 rounded-lg px-3 py-2 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-yellow-500" />
                <span className="text-xs font-medium">Medium: {threats.filter(t => t.severity === 'medium').length}</span>
              </div>
              <div className="bg-card/80 backdrop-blur-md border border-success/30 rounded-lg px-3 py-2 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-success" />
                <span className="text-xs font-medium">Low: {threats.filter(t => t.severity === 'low').length}</span>
              </div>
              <div className="bg-card/80 backdrop-blur-md border border-primary/30 rounded-lg px-3 py-2 flex items-center gap-2">
                <Zap className="w-3 h-3 text-primary" />
                <span className="text-xs font-medium">Attacks: {activeAttacks}</span>
              </div>
            </div>
          </motion.div>

          {/* Legend */}
          <div className="absolute top-4 left-4 bg-card/80 backdrop-blur-md border border-border/50 rounded-lg p-3">
            <h4 className="text-xs font-semibold mb-2 text-muted-foreground">THREAT LEGEND</h4>
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-destructive animate-pulse" />
                <span>Critical - Active Attack</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-warning" />
                <span>High - Potential Threat</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <span>Medium - Suspicious</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-success" />
                <span>Low - Monitoring</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
