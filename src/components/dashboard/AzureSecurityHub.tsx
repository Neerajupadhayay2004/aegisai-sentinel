import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  TrendingDown,
  Zap,
  Globe,
  Cpu,
  HardDrive,
  Network,
  RefreshCw,
  Settings,
  FileText,
  Users,
  Monitor,
  Wifi,
  Box,
  Layers,
  BarChart3,
  PieChart,
  Target
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';

interface AzureService {
  name: string;
  status: 'healthy' | 'warning' | 'critical';
  score: number;
  lastUpdate: string;
  icon: React.ElementType;
  category: string;
  description: string;
}

interface SecurityMetric {
  name: string;
  value: number;
  trend: 'up' | 'down' | 'stable';
  change: number;
  unit?: string;
}

interface ComplianceFramework {
  name: string;
  score: number;
  status: 'compliant' | 'partial' | 'non-compliant';
  controls: number;
  passed: number;
}

interface SecurityRecommendation {
  id: string;
  title: string;
  severity: 'high' | 'medium' | 'low';
  category: string;
  impact: string;
  status: 'open' | 'in_progress' | 'resolved';
}

interface ResourceHealth {
  type: string;
  healthy: number;
  unhealthy: number;
  unknown: number;
  icon: React.ElementType;
}

export const AzureSecurityHub = () => {
  const [secureScore, setSecureScore] = useState(87);
  const [activeTab, setActiveTab] = useState('overview');
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const [services] = useState<AzureService[]>([
    { name: 'Azure Sentinel', status: 'healthy', score: 98, lastUpdate: '2m ago', icon: Eye, category: 'SIEM', description: 'Cloud-native SIEM' },
    { name: 'Defender for Cloud', status: 'healthy', score: 94, lastUpdate: '1m ago', icon: Shield, category: 'CSPM', description: 'Cloud security posture' },
    { name: 'Azure AD Identity Protection', status: 'healthy', score: 91, lastUpdate: '3m ago', icon: Key, category: 'Identity', description: 'Identity security' },
    { name: 'Azure Firewall', status: 'healthy', score: 96, lastUpdate: '1m ago', icon: Lock, category: 'Network', description: 'Network security' },
    { name: 'DDoS Protection', status: 'warning', score: 78, lastUpdate: '5m ago', icon: Network, category: 'Network', description: 'DDoS mitigation' },
    { name: 'Key Vault', status: 'healthy', score: 100, lastUpdate: '1m ago', icon: Database, category: 'Secrets', description: 'Secrets management' },
    { name: 'Defender for Endpoint', status: 'healthy', score: 92, lastUpdate: '2m ago', icon: Monitor, category: 'EDR', description: 'Endpoint protection' },
    { name: 'Azure WAF', status: 'healthy', score: 95, lastUpdate: '1m ago', icon: Globe, category: 'Web', description: 'Web app firewall' },
  ]);

  const [metrics, setMetrics] = useState<SecurityMetric[]>([
    { name: 'Threat Detection Rate', value: 99.7, trend: 'up', change: 0.3, unit: '%' },
    { name: 'Mean Time to Detect', value: 12, trend: 'down', change: 2.1, unit: 'm' },
    { name: 'Incidents Resolved', value: 156, trend: 'up', change: 12 },
    { name: 'Active Investigations', value: 8, trend: 'stable', change: 0 },
    { name: 'Alerts Generated', value: 1247, trend: 'up', change: 5.2 },
    { name: 'False Positive Rate', value: 2.1, trend: 'down', change: 0.5, unit: '%' },
  ]);

  const [complianceFrameworks] = useState<ComplianceFramework[]>([
    { name: 'Azure Security Benchmark', score: 94, status: 'compliant', controls: 150, passed: 141 },
    { name: 'CIS Microsoft Azure', score: 89, status: 'compliant', controls: 200, passed: 178 },
    { name: 'PCI DSS 3.2.1', score: 92, status: 'compliant', controls: 250, passed: 230 },
    { name: 'HIPAA', score: 87, status: 'partial', controls: 100, passed: 87 },
    { name: 'SOC 2', score: 95, status: 'compliant', controls: 64, passed: 61 },
    { name: 'ISO 27001', score: 91, status: 'compliant', controls: 114, passed: 104 },
  ]);

  const [recommendations, setRecommendations] = useState<SecurityRecommendation[]>([
    { id: '1', title: 'Enable MFA for all privileged accounts', severity: 'high', category: 'Identity', impact: 'Critical', status: 'in_progress' },
    { id: '2', title: 'Encrypt storage accounts at rest', severity: 'high', category: 'Data', impact: 'High', status: 'open' },
    { id: '3', title: 'Enable diagnostic logs for Key Vault', severity: 'medium', category: 'Monitoring', impact: 'Medium', status: 'open' },
    { id: '4', title: 'Restrict RDP access from Internet', severity: 'high', category: 'Network', impact: 'Critical', status: 'resolved' },
    { id: '5', title: 'Enable Azure Defender for SQL', severity: 'medium', category: 'Database', impact: 'Medium', status: 'in_progress' },
  ]);

  const [resourceHealth] = useState<ResourceHealth[]>([
    { type: 'Virtual Machines', healthy: 45, unhealthy: 2, unknown: 1, icon: Server },
    { type: 'Storage Accounts', healthy: 23, unhealthy: 0, unknown: 0, icon: Database },
    { type: 'App Services', healthy: 12, unhealthy: 1, unknown: 0, icon: Globe },
    { type: 'SQL Databases', healthy: 8, unhealthy: 0, unknown: 0, icon: Database },
    { type: 'Key Vaults', healthy: 5, unhealthy: 0, unknown: 0, icon: Key },
    { type: 'Network Security Groups', healthy: 34, unhealthy: 3, unknown: 2, icon: Network },
  ]);

  const [threatIntel, setThreatIntel] = useState({
    newIocs: 234,
    activeCampaigns: 12,
    blockedThreats: 15678,
    riskScore: 32,
    tiIndicators: 45892,
    maliciousIPs: 1234,
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
        tiIndicators: prev.tiIndicators + Math.floor(Math.random() * 3),
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Refresh simulation
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': case 'compliant': return 'text-success';
      case 'warning': case 'partial': return 'text-warning';
      case 'critical': case 'non-compliant': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'healthy': case 'compliant': return 'success';
      case 'warning': case 'partial': return 'medium';
      case 'critical': case 'non-compliant': return 'critical';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Cloud className="h-8 w-8 text-blue-400" />
            <div className="absolute inset-0 bg-blue-400/40 blur-lg rounded-full" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">
              <span className="text-blue-400">Azure</span> Security Hub
            </h2>
            <p className="text-sm text-muted-foreground">Microsoft Defender for Cloud & Azure Sentinel</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Syncing...' : 'Sync'}
          </Button>
          <Badge variant="info" className="px-4 py-2">
            <Activity className="h-4 w-4 mr-2 animate-pulse" />
            Connected
          </Badge>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-5 max-w-2xl">
          <TabsTrigger value="overview" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="services" className="gap-2">
            <Layers className="h-4 w-4" />
            Services
          </TabsTrigger>
          <TabsTrigger value="compliance" className="gap-2">
            <CheckCircle className="h-4 w-4" />
            Compliance
          </TabsTrigger>
          <TabsTrigger value="recommendations" className="gap-2">
            <Target className="h-4 w-4" />
            Actions
          </TabsTrigger>
          <TabsTrigger value="resources" className="gap-2">
            <Server className="h-4 w-4" />
            Resources
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Secure Score */}
          <Card variant="glass" className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-transparent to-primary/10" />
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Azure Secure Score</h3>
                  <p className="text-sm text-muted-foreground">Overall security posture rating across all subscriptions</p>
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
                <span>0 - Poor</span>
                <span className="text-success font-semibold">Excellent (90+)</span>
                <span>100 - Perfect</span>
              </div>
            </CardContent>
          </Card>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {metrics.map((metric) => (
              <Card key={metric.name} variant="glass">
                <CardContent className="p-4">
                  <div className="text-xs text-muted-foreground mb-1">{metric.name}</div>
                  <div className="flex items-end justify-between">
                    <div className="text-2xl font-bold">
                      {metric.value}{metric.unit || ''}
                    </div>
                    <div className={`flex items-center text-xs ${
                      metric.trend === 'up' ? 'text-success' : 
                      metric.trend === 'down' ? (metric.name.includes('Time') || metric.name.includes('False') ? 'text-success' : 'text-destructive') : 'text-muted-foreground'
                    }`}>
                      {metric.trend === 'up' ? <TrendingUp className="h-3 w-3 mr-1" /> : 
                       metric.trend === 'down' ? <TrendingDown className="h-3 w-3 mr-1" /> : null}
                      {metric.change > 0 ? '+' : ''}{metric.change}%
                    </div>
                  </div>
                </CardContent>
              </Card>
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
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
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
                <div className="text-center p-4 bg-secondary/30 rounded-lg">
                  <div className="text-3xl font-bold text-purple-400">{threatIntel.tiIndicators.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground mt-1">TI Indicators</div>
                </div>
                <div className="text-center p-4 bg-secondary/30 rounded-lg">
                  <div className="text-3xl font-bold text-destructive">{threatIntel.maliciousIPs.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground mt-1">Malicious IPs</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Services Tab */}
        <TabsContent value="services">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                    <p className="text-[10px] text-muted-foreground mb-2">{service.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold">{service.score}%</div>
                      <Badge variant="outline" className="text-[10px]">{service.category}</Badge>
                    </div>
                    <Progress value={service.score} className="h-1.5 mt-2" />
                    <div className="text-[10px] text-muted-foreground mt-1">Updated {service.lastUpdate}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Compliance Tab */}
        <TabsContent value="compliance">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {complianceFrameworks.map((framework) => (
              <Card key={framework.name} variant="glass">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold">{framework.name}</h4>
                    <Badge variant={getStatusBadge(framework.status) as any} className="text-[10px]">
                      {framework.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 mb-3">
                    <div className="text-4xl font-bold">{framework.score}%</div>
                    <div className="flex-1">
                      <Progress value={framework.score} className="h-2" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Controls: {framework.controls}</span>
                    <span className="text-success">Passed: {framework.passed}</span>
                    <span className="text-destructive">Failed: {framework.controls - framework.passed}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Recommendations Tab */}
        <TabsContent value="recommendations">
          <Card variant="glass">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-400" />
                  Security Recommendations
                </span>
                <Badge variant="outline">{recommendations.filter(r => r.status === 'open').length} Open</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-3">
                  {recommendations.map((rec) => (
                    <motion.div
                      key={rec.id}
                      whileHover={{ scale: 1.01 }}
                      className={`p-4 rounded-lg border ${
                        rec.status === 'resolved' ? 'bg-success/10 border-success/30' : 
                        rec.status === 'in_progress' ? 'bg-warning/10 border-warning/30' : 
                        'bg-secondary/30 border-border/30'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant={rec.severity === 'high' ? 'critical' : rec.severity === 'medium' ? 'medium' : 'success'} className="text-[10px]">
                              {rec.severity}
                            </Badge>
                            <Badge variant="outline" className="text-[10px]">{rec.category}</Badge>
                          </div>
                          <h4 className="font-semibold">{rec.title}</h4>
                          <p className="text-xs text-muted-foreground mt-1">Impact: {rec.impact}</p>
                        </div>
                        <Badge variant={
                          rec.status === 'resolved' ? 'success' : 
                          rec.status === 'in_progress' ? 'medium' : 'secondary'
                        } className="text-[10px]">
                          {rec.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Resources Tab */}
        <TabsContent value="resources">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {resourceHealth.map((resource) => (
              <Card key={resource.type} variant="glass">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <resource.icon className="h-6 w-6 text-blue-400" />
                    <h4 className="font-semibold text-sm">{resource.type}</h4>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 bg-success/20 rounded-lg">
                      <div className="text-lg font-bold text-success">{resource.healthy}</div>
                      <div className="text-[10px] text-muted-foreground">Healthy</div>
                    </div>
                    <div className="p-2 bg-destructive/20 rounded-lg">
                      <div className="text-lg font-bold text-destructive">{resource.unhealthy}</div>
                      <div className="text-[10px] text-muted-foreground">Unhealthy</div>
                    </div>
                    <div className="p-2 bg-secondary/30 rounded-lg">
                      <div className="text-lg font-bold text-muted-foreground">{resource.unknown}</div>
                      <div className="text-[10px] text-muted-foreground">Unknown</div>
                    </div>
                  </div>
                  <Progress 
                    value={(resource.healthy / (resource.healthy + resource.unhealthy + resource.unknown)) * 100} 
                    className="h-1.5 mt-3" 
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
