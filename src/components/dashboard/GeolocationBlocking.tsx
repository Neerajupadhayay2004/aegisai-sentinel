import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Globe, 
  Shield, 
  Ban, 
  AlertTriangle, 
  ChevronDown,
  MapPin,
  Lock,
  Unlock,
  Activity,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useThreatIntelligence, type BlockedCountry } from '@/hooks/useThreatIntelligence';

const riskColors = {
  critical: 'bg-destructive/20 text-destructive border-destructive/50',
  high: 'bg-warning/20 text-warning border-warning/50',
  medium: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50',
  low: 'bg-success/20 text-success border-success/50',
};

const CountryItem = ({ 
  country, 
  onToggle 
}: { 
  country: BlockedCountry; 
  onToggle: (code: string, block: boolean) => void;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-3 rounded-lg border ${
          country.isBlocked 
            ? 'bg-destructive/5 border-destructive/30' 
            : 'bg-card border-border/50'
        } mb-2`}
      >
        <CollapsibleTrigger className="w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${riskColors[country.riskLevel]}`}>
                {country.isBlocked ? (
                  <Ban className="h-4 w-4" />
                ) : (
                  <Globe className="h-4 w-4" />
                )}
              </div>
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground">{country.name}</span>
                  <Badge variant="outline" className={`text-[10px] ${riskColors[country.riskLevel]}`}>
                    {country.riskLevel.toUpperCase()}
                  </Badge>
                </div>
                <div className="text-xs text-muted-foreground">
                  {country.blockedIPs.toLocaleString()} blocked IPs
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Switch
                checked={country.isBlocked}
                onCheckedChange={(checked) => onToggle(country.code, checked)}
                onClick={(e) => e.stopPropagation()}
              />
              <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${
                isExpanded ? 'rotate-180' : ''
              }`} />
            </div>
          </div>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <div className="mt-3 pt-3 border-t border-border/50 grid grid-cols-2 gap-3">
            <div className="bg-secondary/50 rounded-lg p-2">
              <div className="text-xs text-muted-foreground">Attack Types</div>
              <div className="text-sm font-medium text-foreground">DDoS, Brute Force</div>
            </div>
            <div className="bg-secondary/50 rounded-lg p-2">
              <div className="text-xs text-muted-foreground">Last Attack</div>
              <div className="text-sm font-medium text-foreground">2 min ago</div>
            </div>
            <div className="bg-secondary/50 rounded-lg p-2">
              <div className="text-xs text-muted-foreground">Threat Trend</div>
              <div className="text-sm font-medium text-destructive flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                +15%
              </div>
            </div>
            <div className="bg-secondary/50 rounded-lg p-2">
              <div className="text-xs text-muted-foreground">Active IPs</div>
              <div className="text-sm font-medium text-foreground">
                {Math.floor(country.blockedIPs * 0.1).toLocaleString()}
              </div>
            </div>
          </div>
          
          <div className="mt-3 flex gap-2">
            <Button size="sm" variant="outline" className="flex-1 text-xs">
              <MapPin className="h-3 w-3 mr-1" />
              View on Map
            </Button>
            <Button size="sm" variant="outline" className="flex-1 text-xs">
              <Activity className="h-3 w-3 mr-1" />
              View Logs
            </Button>
          </div>
        </CollapsibleContent>
      </motion.div>
    </Collapsible>
  );
};

interface GeolocationBlockingProps {
  className?: string;
}

export const GeolocationBlocking = ({ className = '' }: GeolocationBlockingProps) => {
  const { blockedCountries, toggleCountryBlock } = useThreatIntelligence();
  const [blockAllHighRisk, setBlockAllHighRisk] = useState(true);

  const handleBlockAllHighRisk = (block: boolean) => {
    setBlockAllHighRisk(block);
    blockedCountries
      .filter(c => c.riskLevel === 'critical' || c.riskLevel === 'high')
      .forEach(c => toggleCountryBlock(c.code, block));
  };

  const totalBlocked = blockedCountries.filter(c => c.isBlocked).length;
  const totalBlockedIPs = blockedCountries
    .filter(c => c.isBlocked)
    .reduce((sum, c) => sum + c.blockedIPs, 0);

  return (
    <Card variant="glass" className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            <span>Geolocation Blocking</span>
          </div>
          <Badge variant="destructive" className="text-xs">
            {totalBlocked} Countries
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        {/* Quick Actions */}
        <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg mb-4">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-destructive" />
            <span className="text-sm font-medium">Block All High-Risk</span>
          </div>
          <Switch 
            checked={blockAllHighRisk} 
            onCheckedChange={handleBlockAllHighRisk}
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Ban className="h-4 w-4 text-destructive" />
              <span className="text-xs text-muted-foreground">Blocked IPs</span>
            </div>
            <div className="text-xl font-bold text-destructive">
              {totalBlockedIPs.toLocaleString()}
            </div>
          </div>
          <div className="bg-success/10 border border-success/30 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Shield className="h-4 w-4 text-success" />
              <span className="text-xs text-muted-foreground">Attacks Prevented</span>
            </div>
            <div className="text-xl font-bold text-success">
              {Math.floor(totalBlockedIPs * 2.3).toLocaleString()}
            </div>
          </div>
        </div>

        {/* Country List */}
        <ScrollArea className="h-[300px] pr-2">
          <AnimatePresence mode="popLayout">
            {blockedCountries.map((country) => (
              <CountryItem
                key={country.code}
                country={country}
                onToggle={toggleCountryBlock}
              />
            ))}
          </AnimatePresence>
        </ScrollArea>

        {/* Legend */}
        <div className="mt-4 pt-4 border-t border-border/50">
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span className="font-medium">Risk Levels:</span>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-destructive" />
              Critical
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-warning" />
              High
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-yellow-500" />
              Medium
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-success" />
              Low
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
