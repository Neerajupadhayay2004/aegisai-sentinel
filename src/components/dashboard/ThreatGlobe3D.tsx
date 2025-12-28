import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Sphere, Html } from '@react-three/drei';
import * as THREE from 'three';

interface ThreatPoint {
  id: string;
  lat: number;
  lng: number;
  severity: 'critical' | 'high' | 'medium' | 'low';
  type: string;
  country: string;
  ip: string;
  timestamp: Date;
}

interface AttackArc {
  id: string;
  from: { lat: number; lng: number };
  to: { lat: number; lng: number };
  severity: 'critical' | 'high' | 'medium' | 'low';
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

// Globe mesh component
const GlobeMesh = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.001;
    }
  });

  return (
    <Sphere ref={meshRef} args={[2, 64, 64]}>
      <meshPhongMaterial
        color="#0a1628"
        transparent
        opacity={0.9}
        wireframe={false}
      />
    </Sphere>
  );
};

// Wireframe overlay
const GlobeWireframe = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.001;
    }
  });

  return (
    <Sphere ref={meshRef} args={[2.02, 32, 32]}>
      <meshBasicMaterial
        color="#00d4aa"
        transparent
        opacity={0.1}
        wireframe
      />
    </Sphere>
  );
};

// Threat point component
const ThreatPoint = ({ point, radius }: { point: ThreatPoint; radius: number }) => {
  const position = useMemo(() => latLngToVector3(point.lat, point.lng, radius), [point.lat, point.lng, radius]);
  const meshRef = useRef<THREE.Mesh>(null);
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
      const scale = 1 + Math.sin(clock.getElapsedTime() * 3 + point.lat) * 0.3;
      meshRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.9} />
      </mesh>
      <mesh scale={[1.5, 1.5, 1.5]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.3} />
      </mesh>
      {hovered && (
        <Html distanceFactor={10}>
          <div className="bg-card/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-xl min-w-[200px]">
            <div className="text-xs font-semibold text-primary mb-1">{point.type}</div>
            <div className="text-xs text-muted-foreground">{point.country}</div>
            <div className="text-xs text-muted-foreground font-mono">{point.ip}</div>
            <div className={`text-xs mt-1 font-semibold ${
              point.severity === 'critical' ? 'text-destructive' :
              point.severity === 'high' ? 'text-warning' :
              point.severity === 'medium' ? 'text-yellow-500' : 'text-success'
            }`}>
              {point.severity.toUpperCase()}
            </div>
          </div>
        </Html>
      )}
    </group>
  );
};

// Attack arc component
const AttackArcMesh = ({ arc, radius }: { arc: AttackArc; radius: number }) => {
  const [points, setPoints] = useState<THREE.Vector3[]>([]);
  const progressRef = useRef(0);
  
  const { curve, color } = useMemo(() => {
    const from = latLngToVector3(arc.from.lat, arc.from.lng, radius);
    const to = latLngToVector3(arc.to.lat, arc.to.lng, radius);
    
    const mid = new THREE.Vector3().addVectors(from, to).multiplyScalar(0.5);
    const distance = from.distanceTo(to);
    mid.normalize().multiplyScalar(radius + distance * 0.3);
    
    const curve = new THREE.QuadraticBezierCurve3(from, mid, to);
    
    const color = arc.severity === 'critical' ? '#ef4444' :
                  arc.severity === 'high' ? '#f97316' :
                  arc.severity === 'medium' ? '#eab308' : '#22c55e';
    
    return { curve, color };
  }, [arc, radius]);

  useFrame(() => {
    progressRef.current = (progressRef.current + 0.008) % 1;
    const newPoints = curve.getPoints(50).slice(0, Math.floor(50 * progressRef.current) + 1);
    setPoints(newPoints);
  });

  const lineGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    if (points.length > 1) {
      geometry.setFromPoints(points);
    }
    return geometry;
  }, [points]);

  if (points.length < 2) return null;

  return (
    <primitive object={new THREE.Line(lineGeometry, new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.8 }))} />
  );
};

// Atmosphere glow
const Atmosphere = () => {
  return (
    <Sphere args={[2.15, 64, 64]}>
      <meshBasicMaterial
        color="#00d4aa"
        transparent
        opacity={0.08}
        side={THREE.BackSide}
      />
    </Sphere>
  );
};

// Stars background
const Stars = () => {
  const points = useMemo(() => {
    const positions = new Float32Array(2000 * 3);
    for (let i = 0; i < 2000; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 50;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 50;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 50;
    }
    return positions;
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={2000}
          array={points}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial color="#ffffff" size={0.05} transparent opacity={0.6} />
    </points>
  );
};

// Main scene component
const GlobeScene = ({ threats, attacks }: { threats: ThreatPoint[]; attacks: AttackArc[] }) => {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#00d4aa" />
      
      <Stars />
      <GlobeMesh />
      <GlobeWireframe />
      <Atmosphere />
      
      {threats.map((threat) => (
        <ThreatPoint key={threat.id} point={threat} radius={2.05} />
      ))}
      
      {attacks.map((arc) => (
        <AttackArcMesh key={arc.id} arc={arc} radius={2.05} />
      ))}
      
      <OrbitControls
        enableZoom={true}
        enablePan={false}
        minDistance={3}
        maxDistance={8}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </>
  );
};

// Generate random threats for demo
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
  ];

  const types = ['DDoS Attack', 'SQL Injection', 'Brute Force', 'Malware', 'Phishing', 'Ransomware', 'Zero-Day Exploit'];
  const severities: ('critical' | 'high' | 'medium' | 'low')[] = ['critical', 'high', 'medium', 'low'];

  return locations.map((loc, i) => ({
    id: `threat-${i}`,
    lat: loc.lat + (Math.random() - 0.5) * 5,
    lng: loc.lng + (Math.random() - 0.5) * 5,
    severity: severities[Math.floor(Math.random() * severities.length)],
    type: types[Math.floor(Math.random() * types.length)],
    country: loc.country,
    ip: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
    timestamp: new Date(Date.now() - Math.random() * 3600000),
  }));
};

const generateRandomAttacks = (): AttackArc[] => {
  const sources = [
    { lat: 39.9, lng: 116.4 },
    { lat: 55.7, lng: 37.6 },
    { lat: 35.6, lng: 139.7 },
    { lat: -23.5, lng: -46.6 },
  ];
  
  const targets = [
    { lat: 40.7, lng: -74.0 },
    { lat: 51.5, lng: -0.1 },
    { lat: 52.5, lng: 13.4 },
    { lat: -33.8, lng: 151.2 },
  ];

  const severities: ('critical' | 'high' | 'medium' | 'low')[] = ['critical', 'high', 'medium', 'low'];

  return sources.map((source, i) => ({
    id: `arc-${i}`,
    from: source,
    to: targets[i % targets.length],
    severity: severities[Math.floor(Math.random() * severities.length)],
  }));
};

interface ThreatGlobe3DProps {
  className?: string;
}

export const ThreatGlobe3D = ({ className = '' }: ThreatGlobe3DProps) => {
  const [threats, setThreats] = useState<ThreatPoint[]>(generateRandomThreats());
  const [attacks, setAttacks] = useState<AttackArc[]>(generateRandomAttacks());

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setThreats(generateRandomThreats());
      setAttacks(generateRandomAttacks());
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`relative w-full h-full min-h-[400px] ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        style={{ background: 'transparent' }}
      >
        <GlobeScene threats={threats} attacks={attacks} />
      </Canvas>
      
      {/* Overlay stats */}
      <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2 justify-center">
        <div className="bg-card/80 backdrop-blur-sm border border-border rounded-lg px-3 py-1.5 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
          <span className="text-xs text-muted-foreground">Critical: {threats.filter(t => t.severity === 'critical').length}</span>
        </div>
        <div className="bg-card/80 backdrop-blur-sm border border-border rounded-lg px-3 py-1.5 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-warning" />
          <span className="text-xs text-muted-foreground">High: {threats.filter(t => t.severity === 'high').length}</span>
        </div>
        <div className="bg-card/80 backdrop-blur-sm border border-border rounded-lg px-3 py-1.5 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-yellow-500" />
          <span className="text-xs text-muted-foreground">Medium: {threats.filter(t => t.severity === 'medium').length}</span>
        </div>
        <div className="bg-card/80 backdrop-blur-sm border border-border rounded-lg px-3 py-1.5 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-success" />
          <span className="text-xs text-muted-foreground">Low: {threats.filter(t => t.severity === 'low').length}</span>
        </div>
      </div>
    </div>
  );
};
