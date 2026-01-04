import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Cloud, 
  Shield, 
  Lock, 
  Eye, 
  Activity, 
  Database,
  Key,
  Server,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Zap,
  Globe,
  Cpu,
  HardDrive,
  Network
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface AzureService {
  name: string;
  status: 'healthy' | 'warning' | 'critical';
  score: number;
  lastUpdate: string;
  icon: React.ElementType;
}

interface SecurityMetric {
  name: string;
  value: number;
  trend: 'up' | 'down' | 'stable';
  change: number;
}

export const AzureSecurityHub = () => {
  const [secureScore, setSecureScore] = useState(87);
  const [services] = useState<AzureService[]>([
    { name: 'Azure Sentinel', status: 'healthy', score: 98, lastUpdate: '2m ago', icon: Eye },
    { name: 'Defender for Cloud', status: 'healthy', score: 94, lastUpdate: '1m ago', icon: Shield },
    { name: 'Azure AD Identity Protection', status: 'healthy', score: 91, lastUpdate: '3m ago', icon: Key },
    { name: 'Azure Firewall', status: 'healthy', score: 96, lastUpdate: '1m ago', icon: Lock },
    { name: 'DDoS Protection', status: 'warning', score: 78, lastUpdate: '5m ago', icon: Network },
    { name: 'Key Vault', status: 'healthy', score: 100, lastUpdate: '1m ago', icon: Database },
  ]);

  const [metrics] = useState<SecurityMetric[]>([
    { name: 'Threat Detection Rate', value: 99.7, trend: 'up', change: 0.3 },
    { name: 'Mean Time to Detect', value: 12, trend: 'down', change: 2.1 },
    { name: 'Incidents Resolved', value: 156, trend: 'up', change: 12 },
    { name: 'Active Investigations', value: 8, trend: 'stable', change: 0 },
  ]);

  const [threatIntel, setThreatIntel] = useState({
    newIocs: 234,
    activeCampaigns: 12,
    blockedThreats: 15678,
    riskScore: 32,
  });

  // Animate secure score
  useEffect(() => {
    const interval = setInterval(() => {
      setSecureScore(prev => {
        const change = (Math.random() - 0.5) * 2;
        return Math.max(75, Math.min(99, prev + change));
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Animate threat intel
  useEffect(() => {
    const interval = setInterval(() => {
      setThreatIntel(prev => ({
        ...prev,
        blockedThreats: prev.blockedThreats + Math.floor(Math.random() * 5),
        newIocs: prev.newIocs + (Math.random() > 0.7 ? 1 : 0),
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-success';
      case 'warning': return 'text-warning';
      case 'critical': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'healthy': return 'success';
      case 'warning': return 'medium';
      case 'critical': return 'critical';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Cloud className="h-8 w-8 text-blue-400" />
            <div className="absolute inset-0 bg-blue-400/40 blur-lg rounded-full" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">
              <span className="text-blue-400">Azure</span> Security Hub
            </h2>
            <p className="text-sm text-muted-foreground">Integrated cloud security management</p>
          </div>
        </div>
        <Badge variant="info" className="px-4 py-2">
          <Activity className="h-4 w-4 mr-2 animate-pulse" />
          Connected
        </Badge>
      </div>

      {/* Secure Score */}
      <Card variant="glass" className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-transparent to-primary/10" />
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-2">Azure Secure Score</h3>
              <p className="text-sm text-muted-foreground">Overall security posture rating</p>
            </div>
            <motion.div 
              className="relative"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="text-5xl font-bold text-blue-400">{Math.round(secureScore)}%</div>
              <div className="absolute -inset-4 bg-blue-400/20 blur-2xl rounded-full -z-10" />
            </motion.div>
          </div>
          <Progress value={secureScore} className="h-3 mt-4" />
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span>0</span>
            <span>Excellent (90+)</span>
            <span>100</span>
          </div>
        </CardContent>
      </Card>

      {/* Services Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {services.map((service) => (
          <motion.div
            key={service.name}
            whileHover={{ scale: 1.02 }}
            className="relative"
          >
            <Card variant="glass" className="h-full">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <service.icon className={`h-6 w-6 ${getStatusColor(service.status)}`} />
                  <Badge variant={getStatusBadge(service.status) as any} className="text-[10px]">
                    {service.status}
                  </Badge>
                </div>
                <h4 className="font-semibold text-sm mb-1">{service.name}</h4>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold">{service.score}%</div>
                  <span className="text-[10px] text-muted-foreground">{service.lastUpdate}</span>
                </div>
                <Progress value={service.score} className="h-1.5 mt-2" />
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Threat Intelligence */}
      <Card variant="glass">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Eye className="h-5 w-5 text-blue-400" />
            Azure Sentinel Threat Intelligence
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-secondary/30 rounded-lg">
              <motion.div 
                className="text-3xl font-bold text-primary"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {threatIntel.newIocs.toLocaleString()}
              </motion.div>
              <div className="text-xs text-muted-foreground mt-1">New IOCs Today</div>
            </div>
            <div className="text-center p-4 bg-secondary/30 rounded-lg">
              <div className="text-3xl font-bold text-warning">{threatIntel.activeCampaigns}</div>
              <div className="text-xs text-muted-foreground mt-1">Active Campaigns</div>
            </div>
            <div className="text-center p-4 bg-secondary/30 rounded-lg">
              <motion.div 
                className="text-3xl font-bold text-success"
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                {threatIntel.blockedThreats.toLocaleString()}
              </motion.div>
              <div className="text-xs text-muted-foreground mt-1">Threats Blocked</div>
            </div>
            <div className="text-center p-4 bg-secondary/30 rounded-lg">
              <div className="text-3xl font-bold text-blue-400">{threatIntel.riskScore}</div>
              <div className="text-xs text-muted-foreground mt-1">Risk Score</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <Card key={metric.name} variant="glass">
            <CardContent className="p-4">
              <div className="text-xs text-muted-foreground mb-1">{metric.name}</div>
              <div className="flex items-end justify-between">
                <div className="text-2xl font-bold">
                  {metric.name.includes('Time') ? `${metric.value}m` : metric.value}
                </div>
                <div className={`flex items-center text-xs ${
                  metric.trend === 'up' ? 'text-success' : 
                  metric.trend === 'down' ? 'text-destructive' : 'text-muted-foreground'
                }`}>
                  <TrendingUp className={`h-3 w-3 mr-1 ${metric.trend === 'down' ? 'rotate-180' : ''}`} />
                  {metric.change > 0 ? '+' : ''}{metric.change}%
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
