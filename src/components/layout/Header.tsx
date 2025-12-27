import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Shield, Zap } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { NotificationBell } from '@/components/dashboard/NotificationBell';

export const Header = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [threatLevel, setThreatLevel] = useState<'low' | 'medium' | 'high' | 'critical'>('high');

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const threatColors = {
    low: 'text-success',
    medium: 'text-warning',
    high: 'text-orange-400',
    critical: 'text-destructive',
  };

  return (
    <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6">
        <div className="flex items-center gap-4 flex-1 max-w-xl">
          <div className="relative flex-1 hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search threats, endpoints, logs..." className="pl-10 bg-secondary/50 border-border/50" />
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-6">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 px-4 py-2 bg-card/60 rounded-lg border border-border/50">
            <div className="flex items-center gap-2">
              <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }} className={`w-2 h-2 rounded-full ${threatLevel === 'critical' ? 'bg-destructive' : threatLevel === 'high' ? 'bg-orange-400' : threatLevel === 'medium' ? 'bg-warning' : 'bg-success'}`} />
              <span className="text-xs text-muted-foreground">Threat Level:</span>
              <span className={`text-sm font-semibold uppercase ${threatColors[threatLevel]}`}>{threatLevel}</span>
            </div>
          </motion.div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Zap className="h-4 w-4 text-primary" />
            <span className="text-sm font-mono">{currentTime.toLocaleTimeString('en-US', { hour12: false })}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <NotificationBell />
          <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-card/60 rounded-lg border border-border/50">
            <Shield className="h-4 w-4 text-primary" />
            <span className="text-sm">Protection:</span>
            <Badge variant="success">Active</Badge>
          </div>
        </div>
      </div>
    </header>
  );
};
