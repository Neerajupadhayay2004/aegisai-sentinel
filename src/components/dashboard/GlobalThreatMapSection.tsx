import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Globe, Shield, AlertTriangle, TrendingUp, Activity, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ThreatGlobe3D } from './ThreatGlobe3D';
import { LiveThreatFeed } from './LiveThreatFeed';

interface GlobalStats {
  totalAttacks: number;
  blocked: number;
  activeThreats: number;
  countriesAffected: number;
  avgResponseTime: string;
}

export const GlobalThreatMapSection = () => {
  const [stats, setStats] = useState<GlobalStats>({
    totalAttacks: 0,
    blocked: 0,
    activeThreats: 0,
    countriesAffected: 0,
    avgResponseTime: '0ms',
  });
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    // Simulate real-time stats
    const updateStats = () => {
      setStats(prev => ({
        totalAttacks: prev.totalAttacks + Math.floor(Math.random() * 5) + 1,
        blocked: prev.blocked + Math.floor(Math.random() * 4) + 1,
        activeThreats: Math.floor(Math.random() * 20) + 5,
        countriesAffected: Math.floor(Math.random() * 30) + 50,
        avgResponseTime: `${Math.floor(Math.random() * 50) + 10}ms`,
      }));
    };

    // Initial values
    setStats({
      totalAttacks: 15847,
      blocked: 15234,
      activeThreats: 12,
      countriesAffected: 67,
      avgResponseTime: '23ms',
    });

    const interval = setInterval(updateStats, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Globe className="h-6 w-6 text-primary" />
            <span className="text-gradient-cyber">Global Threat</span> Intelligence
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Real-time visualization of worldwide cyber attacks and threat patterns
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="active" className="px-3 py-1.5 gap-2">
            <span className="w-2 h-2 bg-current rounded-full animate-pulse" />
            Live Monitoring
          </Badge>
          <Button variant="cyber" size="sm">
            <Zap className="h-4 w-4 mr-1" />
            Deploy Shield
          </Button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-card/60 backdrop-blur-sm border border-border/50 rounded-xl p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <Activity className="h-4 w-4 text-primary" />
            <span className="text-xs text-muted-foreground">Total Attacks</span>
          </div>
          <div className="text-2xl font-bold text-foreground">
            {stats.totalAttacks.toLocaleString()}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15 }}
          className="bg-success/10 border border-success/30 rounded-xl p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <Shield className="h-4 w-4 text-success" />
            <span className="text-xs text-muted-foreground">Blocked</span>
          </div>
          <div className="text-2xl font-bold text-success">
            {stats.blocked.toLocaleString()}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-destructive/10 border border-destructive/30 rounded-xl p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <span className="text-xs text-muted-foreground">Active Threats</span>
          </div>
          <div className="text-2xl font-bold text-destructive">
            {stats.activeThreats}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25 }}
          className="bg-card/60 backdrop-blur-sm border border-border/50 rounded-xl p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <Globe className="h-4 w-4 text-primary" />
            <span className="text-xs text-muted-foreground">Countries</span>
          </div>
          <div className="text-2xl font-bold text-foreground">
            {stats.countriesAffected}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-card/60 backdrop-blur-sm border border-border/50 rounded-xl p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            <span className="text-xs text-muted-foreground">Response Time</span>
          </div>
          <div className="text-2xl font-bold text-primary">
            {stats.avgResponseTime}
          </div>
        </motion.div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* 3D Globe */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="xl:col-span-2"
        >
          <Card variant="glass" className="overflow-hidden h-[500px]">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-primary" />
                  3D Threat Visualization
                </div>
                <Badge variant="outline" className="text-xs">
                  Interactive
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 h-[calc(100%-60px)]">
              <ThreatGlobe3D className="w-full h-full" />
            </CardContent>
          </Card>
        </motion.div>

        {/* Live Feed */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="xl:col-span-1"
        >
          <LiveThreatFeed className="h-[500px]" />
        </motion.div>
      </div>

      {/* Attack Origin Map Legend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card variant="glass">
          <CardContent className="py-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-6">
                <span className="text-sm text-muted-foreground">Severity Legend:</span>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-destructive animate-pulse" />
                    <span className="text-xs text-muted-foreground">Critical</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-warning" />
                    <span className="text-xs text-muted-foreground">High</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <span className="text-xs text-muted-foreground">Medium</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-success" />
                    <span className="text-xs text-muted-foreground">Low</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Activity className="h-3 w-3 text-primary animate-pulse" />
                <span>Data refreshes every 3 seconds</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
