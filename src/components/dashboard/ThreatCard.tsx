import { motion } from 'framer-motion';
import { AlertTriangle, Shield, Clock, MapPin, Crosshair, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Threat } from '@/types/security';
import { cn } from '@/lib/utils';

interface ThreatCardProps {
  threat: Threat;
  onViewDetails?: (threat: Threat) => void;
  onMitigate?: (threat: Threat) => void;
}

export const ThreatCard = ({ threat, onViewDetails, onMitigate }: ThreatCardProps) => {
  const severityConfig = {
    critical: { color: 'text-destructive', bg: 'bg-destructive/10', border: 'border-destructive/30', badge: 'critical' as const },
    high: { color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30', badge: 'high' as const },
    medium: { color: 'text-warning', bg: 'bg-warning/10', border: 'border-warning/30', badge: 'medium' as const },
    low: { color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/30', badge: 'low' as const },
    info: { color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30', badge: 'info' as const },
  };

  const config = severityConfig[threat.severity];
  const timeAgo = getTimeAgo(threat.timestamp);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        variant="glass"
        className={cn(
          "relative overflow-hidden transition-all duration-300",
          config.border,
          threat.status === 'active' && "animate-pulse-glow"
        )}
      >
        {/* Severity indicator bar */}
        <div className={cn("absolute left-0 top-0 bottom-0 w-1", config.bg.replace('/10', ''))} />

        <CardHeader className="pb-3 pl-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className={cn("p-2 rounded-lg", config.bg)}>
                <AlertTriangle className={cn("h-5 w-5", config.color)} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <CardTitle className="text-base">{threat.title}</CardTitle>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant={config.badge}>{threat.severity.toUpperCase()}</Badge>
                  <Badge variant={threat.status as 'active' | 'mitigated' | 'investigating' | 'resolved'}>
                    {threat.status}
                  </Badge>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {timeAgo}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-foreground">{threat.confidenceScore}%</div>
              <div className="text-xs text-muted-foreground">Confidence</div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pl-5 pt-0">
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {threat.description}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground truncate">{threat.source}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Crosshair className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground truncate">{threat.targetAsset}</span>
            </div>
            {threat.mitreTactic && (
              <div className="flex items-center gap-2 text-sm">
                <Shield className="h-4 w-4 text-primary" />
                <span className="text-primary truncate">{threat.mitreTactic}</span>
              </div>
            )}
            {threat.affectedEndpoints !== undefined && threat.affectedEndpoints > 0 && (
              <div className="text-sm">
                <span className="text-destructive font-semibold">{threat.affectedEndpoints}</span>
                <span className="text-muted-foreground"> endpoints affected</span>
              </div>
            )}
          </div>

          {threat.mitreTechnique && (
            <div className="bg-secondary/50 rounded-lg p-3 mb-4">
              <div className="text-xs text-muted-foreground mb-1">MITRE ATT&CK</div>
              <div className="text-sm font-mono text-primary">{threat.mitreTechnique}</div>
              {threat.killChainPhase && (
                <div className="text-xs text-muted-foreground mt-1">
                  Kill Chain: {threat.killChainPhase}
                </div>
              )}
            </div>
          )}

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails?.(threat)}
              className="flex-1"
            >
              View Details
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
            {threat.status === 'active' && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onMitigate?.(threat)}
                className="flex-1"
              >
                Mitigate Now
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

function getTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}
