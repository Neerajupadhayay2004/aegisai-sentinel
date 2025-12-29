import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  AlertTriangle, 
  Globe, 
  Clock, 
  Zap,
  Activity,
  MapPin,
  Ban,
  Search,
  Brain,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { useThreatIntelligence, type LiveThreat } from '@/hooks/useThreatIntelligence';
import { useAudioAlerts } from '@/hooks/useAudioAlerts';

const ThreatItem = ({ 
  threat, 
  isNew,
  onBlock,
  onAnalyze,
  isAnalyzing
}: { 
  threat: LiveThreat; 
  isNew: boolean;
  onBlock: (ip: string) => void;
  onAnalyze: (threat: LiveThreat) => void;
  isAnalyzing: boolean;
}) => {
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
            threat.severity === 'critical' ? 'text-destructive animate-pulse' :
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
      
      <div className="flex items-center justify-between text-xs mb-2">
        <span className="text-muted-foreground">Target: {threat.target.service}:{threat.target.port}</span>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Confidence: {threat.confidence}%</span>
          <span className="text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {new Date(threat.timestamp).toLocaleTimeString()}
          </span>
        </div>
      </div>

      <div className="flex gap-2 mt-2">
        {threat.status === 'active' && (
          <Button 
            size="sm" 
            variant="destructive" 
            className="text-xs h-7 flex-1"
            onClick={() => onBlock(threat.source.ip)}
          >
            <Ban className="h-3 w-3 mr-1" />
            Block IP
          </Button>
        )}
        <Button 
          size="sm" 
          variant="outline" 
          className="text-xs h-7 flex-1"
          onClick={() => onAnalyze(threat)}
          disabled={isAnalyzing}
        >
          {isAnalyzing ? (
            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
          ) : (
            <Brain className="h-3 w-3 mr-1" />
          )}
          AI Analyze
        </Button>
      </div>
    </motion.div>
  );
};

interface RealTimeThreatFeedProps {
  className?: string;
  maxThreats?: number;
}

export const RealTimeThreatFeed = ({ className = '', maxThreats = 20 }: RealTimeThreatFeedProps) => {
  const { threats, stats, blockIP, analyzeThreat, isLoading } = useThreatIntelligence();
  const { triggerAlert } = useAudioAlerts();
  const [filter, setFilter] = useState('');
  const [newThreatIds, setNewThreatIds] = useState<Set<string>>(new Set());
  const [analyzingId, setAnalyzingId] = useState<string | null>(null);
  const previousThreatsRef = useRef<string[]>([]);

  // Detect new threats and trigger alerts
  useEffect(() => {
    const currentIds = threats.map(t => t.id);
    const newIds = currentIds.filter(id => !previousThreatsRef.current.includes(id));
    
    if (newIds.length > 0) {
      setNewThreatIds(new Set(newIds));
      
      // Find most severe new threat
      const newThreats = threats.filter(t => newIds.includes(t.id));
      const criticalNew = newThreats.find(t => t.severity === 'critical' && t.status === 'active');
      const highNew = newThreats.find(t => t.severity === 'high' && t.status === 'active');
      
      if (criticalNew) {
        triggerAlert('critical', 'Critical Threat', `${criticalNew.type} from ${criticalNew.source.country}`);
      } else if (highNew) {
        triggerAlert('high', 'High Priority Threat', `${highNew.type} detected`);
      }

      // Clear new indicator after animation
      setTimeout(() => {
        setNewThreatIds(new Set());
      }, 1000);
    }
    
    previousThreatsRef.current = currentIds;
  }, [threats, triggerAlert]);

  const handleBlock = async (ip: string) => {
    await blockIP(ip, 'Blocked from threat feed');
  };

  const handleAnalyze = async (threat: LiveThreat) => {
    setAnalyzingId(threat.id);
    try {
      const result = await analyzeThreat(threat.id, threat);
      console.log('Analysis result:', result);
    } finally {
      setAnalyzingId(null);
    }
  };

  const filteredThreats = threats
    .filter(t => 
      !filter || 
      t.type.toLowerCase().includes(filter.toLowerCase()) ||
      t.source.country.toLowerCase().includes(filter.toLowerCase()) ||
      t.source.ip.includes(filter)
    )
    .slice(0, maxThreats);

  return (
    <Card variant="glass" className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary animate-pulse" />
            <span>Real-Time Threat Intelligence</span>
          </div>
          <div className="flex items-center gap-2">
            {isLoading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Zap className="h-3 w-3 text-primary" />
              <span>Live</span>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search threats..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="pl-9 bg-secondary/50"
          />
        </div>

        {/* Stats bar */}
        {stats && (
          <div className="grid grid-cols-4 gap-2 mb-4">
            <div className="bg-card/60 rounded-lg p-2 text-center">
              <div className="text-lg font-bold text-foreground">{stats.totalAttacks24h.toLocaleString()}</div>
              <div className="text-[10px] text-muted-foreground">24h Attacks</div>
            </div>
            <div className="bg-success/10 rounded-lg p-2 text-center">
              <div className="text-lg font-bold text-success">{stats.blockedAttacks.toLocaleString()}</div>
              <div className="text-[10px] text-muted-foreground">Blocked</div>
            </div>
            <div className="bg-destructive/10 rounded-lg p-2 text-center">
              <div className="text-lg font-bold text-destructive">{stats.activeThreats}</div>
              <div className="text-[10px] text-muted-foreground">Active</div>
            </div>
            <div className="bg-primary/10 rounded-lg p-2 text-center">
              <div className="text-lg font-bold text-primary">{stats.averageResponseTime}</div>
              <div className="text-[10px] text-muted-foreground">Avg Response</div>
            </div>
          </div>
        )}

        {/* Threat list */}
        <ScrollArea className="h-[400px] pr-2">
          <AnimatePresence mode="popLayout">
            {filteredThreats.map((threat) => (
              <ThreatItem 
                key={threat.id} 
                threat={threat} 
                isNew={newThreatIds.has(threat.id)}
                onBlock={handleBlock}
                onAnalyze={handleAnalyze}
                isAnalyzing={analyzingId === threat.id}
              />
            ))}
          </AnimatePresence>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
