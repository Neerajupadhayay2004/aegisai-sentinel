import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  AlertTriangle, 
  Globe, 
  Clock, 
  Zap,
  Activity,
  TrendingUp,
  MapPin
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface LiveThreat {
  id: string;
  type: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  source: {
    ip: string;
    country: string;
    city: string;
  };
  target: {
    ip: string;
    service: string;
  };
  timestamp: Date;
  status: 'active' | 'blocked' | 'investigating';
  description: string;
}

const threatTypes = [
  'DDoS Attack',
  'SQL Injection',
  'Brute Force Login',
  'Malware Detected',
  'Phishing Attempt',
  'Ransomware',
  'Zero-Day Exploit',
  'Port Scanning',
  'XSS Attack',
  'API Abuse',
  'Credential Stuffing',
  'Man-in-the-Middle',
];

const countries = [
  { name: 'China', code: 'CN', city: 'Beijing' },
  { name: 'Russia', code: 'RU', city: 'Moscow' },
  { name: 'USA', code: 'US', city: 'New York' },
  { name: 'Brazil', code: 'BR', city: 'São Paulo' },
  { name: 'India', code: 'IN', city: 'Mumbai' },
  { name: 'Germany', code: 'DE', city: 'Berlin' },
  { name: 'UK', code: 'GB', city: 'London' },
  { name: 'Japan', code: 'JP', city: 'Tokyo' },
  { name: 'South Korea', code: 'KR', city: 'Seoul' },
  { name: 'Iran', code: 'IR', city: 'Tehran' },
];

const services = ['Web Server', 'Database', 'API Gateway', 'Mail Server', 'DNS', 'VPN', 'Firewall'];

const generateRandomIP = () => 
  `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;

const generateThreat = (): LiveThreat => {
  const severities: ('critical' | 'high' | 'medium' | 'low')[] = ['critical', 'high', 'medium', 'low'];
  const statuses: ('active' | 'blocked' | 'investigating')[] = ['active', 'blocked', 'investigating'];
  const country = countries[Math.floor(Math.random() * countries.length)];
  const type = threatTypes[Math.floor(Math.random() * threatTypes.length)];
  const severity = severities[Math.floor(Math.random() * severities.length)];
  
  return {
    id: `threat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type,
    severity,
    source: {
      ip: generateRandomIP(),
      country: country.name,
      city: country.city,
    },
    target: {
      ip: generateRandomIP(),
      service: services[Math.floor(Math.random() * services.length)],
    },
    timestamp: new Date(),
    status: statuses[Math.floor(Math.random() * statuses.length)],
    description: `${type} detected from ${country.city}, ${country.name}. ${
      severity === 'critical' ? 'Immediate action required.' :
      severity === 'high' ? 'High priority response needed.' :
      severity === 'medium' ? 'Investigation in progress.' :
      'Low risk, monitoring.'
    }`,
  };
};

const ThreatItem = ({ threat, isNew }: { threat: LiveThreat; isNew: boolean }) => {
  const severityColors = {
    critical: 'border-l-destructive bg-destructive/5',
    high: 'border-l-warning bg-warning/5',
    medium: 'border-l-yellow-500 bg-yellow-500/5',
    low: 'border-l-success bg-success/5',
  };

  const statusColors = {
    active: 'bg-destructive/20 text-destructive border-destructive/50',
    blocked: 'bg-success/20 text-success border-success/50',
    investigating: 'bg-warning/20 text-warning border-warning/50',
  };

  return (
    <motion.div
      initial={isNew ? { opacity: 0, x: -20, scale: 0.95 } : false}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 20, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className={`p-3 rounded-lg border-l-4 border border-border/50 ${severityColors[threat.severity]} mb-2`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <AlertTriangle className={`h-4 w-4 ${
            threat.severity === 'critical' ? 'text-destructive' :
            threat.severity === 'high' ? 'text-warning' :
            threat.severity === 'medium' ? 'text-yellow-500' : 'text-success'
          }`} />
          <span className="font-semibold text-sm text-foreground">{threat.type}</span>
        </div>
        <Badge variant="outline" className={`text-[10px] ${statusColors[threat.status]}`}>
          {threat.status.toUpperCase()}
        </Badge>
      </div>
      
      <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground mb-2">
        <div className="flex items-center gap-1">
          <MapPin className="h-3 w-3" />
          <span>{threat.source.city}, {threat.source.country}</span>
        </div>
        <div className="flex items-center gap-1">
          <Globe className="h-3 w-3" />
          <span className="font-mono">{threat.source.ip}</span>
        </div>
      </div>
      
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">Target: {threat.target.service}</span>
        <span className="text-muted-foreground flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {threat.timestamp.toLocaleTimeString()}
        </span>
      </div>
    </motion.div>
  );
};

interface LiveThreatFeedProps {
  className?: string;
  maxThreats?: number;
}

export const LiveThreatFeed = ({ className = '', maxThreats = 20 }: LiveThreatFeedProps) => {
  const [threats, setThreats] = useState<LiveThreat[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    blocked: 0,
    active: 0,
    perMinute: 0,
  });
  const [newThreatIds, setNewThreatIds] = useState<Set<string>>(new Set());
  const threatCountRef = useRef(0);

  useEffect(() => {
    // Generate initial threats
    const initial = Array.from({ length: 5 }, () => generateThreat());
    setThreats(initial);
    threatCountRef.current = initial.length;

    // Add new threats periodically
    const interval = setInterval(() => {
      const newThreat = generateThreat();
      threatCountRef.current++;
      
      setNewThreatIds(prev => new Set(prev).add(newThreat.id));
      
      setThreats(prev => {
        const updated = [newThreat, ...prev];
        return updated.slice(0, maxThreats);
      });

      // Remove from new set after animation
      setTimeout(() => {
        setNewThreatIds(prev => {
          const next = new Set(prev);
          next.delete(newThreat.id);
          return next;
        });
      }, 500);
    }, 2000 + Math.random() * 3000);

    // Update stats
    const statsInterval = setInterval(() => {
      setStats(prev => ({
        total: threatCountRef.current,
        blocked: Math.floor(threatCountRef.current * 0.7),
        active: Math.floor(threatCountRef.current * 0.15),
        perMinute: Math.floor(Math.random() * 10) + 5,
      }));
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(statsInterval);
    };
  }, [maxThreats]);

  return (
    <Card variant="glass" className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary animate-pulse" />
            <span>Live Threat Feed</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Zap className="h-3 w-3 text-primary" />
            <span>{stats.perMinute}/min</span>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        {/* Stats bar */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-secondary/50 rounded-lg p-2 text-center">
            <div className="text-lg font-bold text-foreground">{stats.total}</div>
            <div className="text-[10px] text-muted-foreground">Total</div>
          </div>
          <div className="bg-success/10 rounded-lg p-2 text-center">
            <div className="text-lg font-bold text-success">{stats.blocked}</div>
            <div className="text-[10px] text-muted-foreground">Blocked</div>
          </div>
          <div className="bg-destructive/10 rounded-lg p-2 text-center">
            <div className="text-lg font-bold text-destructive">{stats.active}</div>
            <div className="text-[10px] text-muted-foreground">Active</div>
          </div>
        </div>

        {/* Threat list */}
        <ScrollArea className="h-[400px] pr-2">
          <AnimatePresence mode="popLayout">
            {threats.map((threat) => (
              <ThreatItem 
                key={threat.id} 
                threat={threat} 
                isNew={newThreatIds.has(threat.id)}
              />
            ))}
          </AnimatePresence>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
