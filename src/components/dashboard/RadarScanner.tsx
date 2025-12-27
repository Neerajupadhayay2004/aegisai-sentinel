import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface RadarScannerProps {
  size?: number;
  threats?: { angle: number; distance: number; severity: 'low' | 'medium' | 'high' | 'critical' }[];
  isScanning?: boolean;
}

export const RadarScanner = ({ size = 300, threats = [], isScanning = true }: RadarScannerProps) => {
  const [sweepAngle, setSweepAngle] = useState(0);
  const [blips, setBlips] = useState<{ x: number; y: number; severity: string; opacity: number }[]>([]);

  useEffect(() => {
    if (!isScanning) return;

    const interval = setInterval(() => {
      setSweepAngle((prev) => (prev + 2) % 360);
    }, 30);

    return () => clearInterval(interval);
  }, [isScanning]);

  useEffect(() => {
    // Generate random blips for demo
    const newBlips = Array.from({ length: 5 }, () => ({
      x: Math.random() * 0.8 + 0.1,
      y: Math.random() * 0.8 + 0.1,
      severity: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)],
      opacity: Math.random() * 0.5 + 0.5,
    }));
    setBlips(newBlips);
  }, []);

  const center = size / 2;
  const rings = [0.25, 0.5, 0.75, 1];

  const severityColors: Record<string, string> = {
    low: '#00d4aa',
    medium: '#eab308',
    high: '#f97316',
    critical: '#ef4444',
  };

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="absolute inset-0">
        {/* Background */}
        <circle
          cx={center}
          cy={center}
          r={center - 10}
          fill="url(#radarGradient)"
          stroke="hsl(173, 80%, 50%)"
          strokeWidth="1"
          opacity="0.3"
        />

        {/* Grid rings */}
        {rings.map((ring, i) => (
          <circle
            key={i}
            cx={center}
            cy={center}
            r={(center - 10) * ring}
            fill="none"
            stroke="hsl(173, 80%, 50%)"
            strokeWidth="1"
            opacity={0.2}
          />
        ))}

        {/* Cross lines */}
        <line
          x1={10}
          y1={center}
          x2={size - 10}
          y2={center}
          stroke="hsl(173, 80%, 50%)"
          strokeWidth="1"
          opacity="0.2"
        />
        <line
          x1={center}
          y1={10}
          x2={center}
          y2={size - 10}
          stroke="hsl(173, 80%, 50%)"
          strokeWidth="1"
          opacity="0.2"
        />

        {/* Diagonal lines */}
        <line
          x1={10 + (center - 10) * 0.3}
          y1={10 + (center - 10) * 0.3}
          x2={size - 10 - (center - 10) * 0.3}
          y2={size - 10 - (center - 10) * 0.3}
          stroke="hsl(173, 80%, 50%)"
          strokeWidth="1"
          opacity="0.1"
        />
        <line
          x1={size - 10 - (center - 10) * 0.3}
          y1={10 + (center - 10) * 0.3}
          x2={10 + (center - 10) * 0.3}
          y2={size - 10 - (center - 10) * 0.3}
          stroke="hsl(173, 80%, 50%)"
          strokeWidth="1"
          opacity="0.1"
        />

        {/* Gradients */}
        <defs>
          <radialGradient id="radarGradient">
            <stop offset="0%" stopColor="hsl(173, 80%, 50%)" stopOpacity="0.1" />
            <stop offset="100%" stopColor="hsl(222, 47%, 6%)" stopOpacity="0.9" />
          </radialGradient>
          <linearGradient id="sweepGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(173, 80%, 50%)" stopOpacity="0" />
            <stop offset="100%" stopColor="hsl(173, 80%, 50%)" stopOpacity="0.6" />
          </linearGradient>
        </defs>

        {/* Sweep line */}
        {isScanning && (
          <g transform={`rotate(${sweepAngle}, ${center}, ${center})`}>
            <line
              x1={center}
              y1={center}
              x2={center}
              y2={15}
              stroke="hsl(173, 80%, 50%)"
              strokeWidth="2"
              opacity="0.8"
            />
            <path
              d={`M ${center} ${center} L ${center} 15 A ${center - 15} ${center - 15} 0 0 1 ${center + (center - 15) * Math.sin(Math.PI / 6)} ${center - (center - 15) * Math.cos(Math.PI / 6)} Z`}
              fill="url(#sweepGradient)"
              opacity="0.3"
            />
          </g>
        )}

        {/* Threat blips */}
        {blips.map((blip, i) => (
          <motion.circle
            key={i}
            cx={center + (blip.x - 0.5) * (size - 40)}
            cy={center + (blip.y - 0.5) * (size - 40)}
            r="6"
            fill={severityColors[blip.severity]}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [blip.opacity, blip.opacity * 0.5, blip.opacity],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.3,
            }}
          />
        ))}

        {/* Center dot */}
        <circle
          cx={center}
          cy={center}
          r="4"
          fill="hsl(173, 80%, 50%)"
          className="animate-pulse"
        />
      </svg>

      {/* Glow effect */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: 'radial-gradient(circle at center, hsl(173 80% 50% / 0.1) 0%, transparent 70%)',
          filter: 'blur(20px)',
        }}
      />

      {/* Labels */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 text-xs text-primary/60 font-mono">N</div>
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-primary/60 font-mono">S</div>
      <div className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-primary/60 font-mono">W</div>
      <div className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-primary/60 font-mono">E</div>
    </div>
  );
};
