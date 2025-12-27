import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Wifi, Shield, Zap, AlertTriangle, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { mockScans } from '@/lib/mockData';
import { ScanResult } from '@/types/security';

const scanTypeConfig: Record<string, { icon: React.ElementType; color: string; label: string }> = {
  network: { icon: Wifi, color: 'text-primary', label: 'Network Scan' },
  vulnerability: { icon: AlertTriangle, color: 'text-warning', label: 'Vulnerability Scan' },
  misconfiguration: { icon: Shield, color: 'text-blue-400', label: 'Config Audit' },
  identity: { icon: Zap, color: 'text-purple-400', label: 'Identity Scan' },
  cloud: { icon: Activity, color: 'text-accent', label: 'Cloud Posture' },
};

export const LiveScanStatus = () => {
  const [scans, setScans] = useState<ScanResult[]>(mockScans);

  useEffect(() => {
    const interval = setInterval(() => {
      setScans((prev) =>
        prev.map((scan) => {
          if (scan.status === 'scanning' && scan.progress < 100) {
            const newProgress = Math.min(scan.progress + Math.random() * 5, 100);
            return {
              ...scan,
              progress: newProgress,
              findings: scan.findings + (Math.random() > 0.8 ? 1 : 0),
              status: newProgress >= 100 ? 'completed' : 'scanning',
              endTime: newProgress >= 100 ? new Date() : undefined,
            };
          }
          return scan;
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Card variant="glass">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center justify-between">
            <span>Live Scan Status</span>
            <Badge variant="success" className="gap-1">
              <Activity className="h-3 w-3 animate-pulse" />
              {scans.filter((s) => s.status === 'scanning').length} Active
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <AnimatePresence>
            {scans.map((scan, index) => {
              const config = scanTypeConfig[scan.type];
              const Icon = config.icon;
              
              return (
                <motion.div
                  key={scan.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >
                  <div className="flex items-center gap-4 p-4 rounded-lg bg-secondary/30 border border-border/50">
                    <div className={`p-2 rounded-lg bg-secondary ${config.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">{config.label}</span>
                        <div className="flex items-center gap-2">
                          {scan.status === 'scanning' ? (
                            <Badge variant="info" className="gap-1">
                              <span className="w-2 h-2 bg-current rounded-full animate-pulse" />
                              Scanning
                            </Badge>
                          ) : scan.status === 'completed' ? (
                            <Badge variant="success" className="gap-1">
                              <Check className="h-3 w-3" />
                              Completed
                            </Badge>
                          ) : (
                            <Badge variant="secondary">Idle</Badge>
                          )}
                        </div>
                      </div>
                      
                      {scan.status === 'scanning' && (
                        <div className="space-y-2">
                          <Progress value={scan.progress} className="h-2" />
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>{Math.round(scan.progress)}% complete</span>
                            <span>
                              {scan.findings} findings ({scan.criticalFindings} critical)
                            </span>
                          </div>
                        </div>
                      )}
                      
                      {scan.status === 'completed' && (
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-muted-foreground">
                            {scan.findings} findings
                          </span>
                          {scan.criticalFindings > 0 && (
                            <span className="text-destructive font-semibold">
                              {scan.criticalFindings} critical
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
};
