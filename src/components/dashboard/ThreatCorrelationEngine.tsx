import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Network,
  Link2,
  AlertTriangle,
  Target,
  Clock,
  MapPin,
  Fingerprint,
  TrendingUp,
  Shield,
  Zap,
  Eye,
  Activity,
  ChevronRight,
  Search,
  Filter,
  RefreshCw,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ThreatIndicator {
  id: string;
  type: 'ip' | 'domain' | 'hash' | 'url' | 'email';
  value: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  firstSeen: Date;
  lastSeen: Date;
  occurrences: number;
}

interface AttackCampaign {
  id: string;
  name: string;
  threatActor: string;
  confidence: number;
  severity: 'critical' | 'high' | 'medium' | 'low';
  startDate: Date;
  endDate?: Date;
  indicators: ThreatIndicator[];
  tactics: string[];
  techniques: string[];
  affectedAssets: number;
  status: 'active' | 'mitigated' | 'investigating';
  description: string;
}

interface CorrelationLink {
  source: string;
  target: string;
  strength: number;
  type: 'temporal' | 'behavioral' | 'ioc' | 'tactic';
}

// Generate mock campaign data
const generateCampaigns = (): AttackCampaign[] => {
  return [
    {
      id: 'camp-1',
      name: 'APT-29 Midnight Blizzard',
      threatActor: 'APT-29 (Cozy Bear)',
      confidence: 94,
      severity: 'critical',
      startDate: new Date(Date.now() - 7 * 24 * 3600000),
      indicators: [
        { id: 'ioc-1', type: 'ip', value: '185.234.72.14', severity: 'critical', firstSeen: new Date(Date.now() - 5 * 24 * 3600000), lastSeen: new Date(), occurrences: 47 },
        { id: 'ioc-2', type: 'domain', value: 'secure-update.cloud', severity: 'critical', firstSeen: new Date(Date.now() - 6 * 24 * 3600000), lastSeen: new Date(), occurrences: 23 },
        { id: 'ioc-3', type: 'hash', value: 'a3f2b8c9d4e5...', severity: 'high', firstSeen: new Date(Date.now() - 4 * 24 * 3600000), lastSeen: new Date(), occurrences: 12 },
      ],
      tactics: ['Initial Access', 'Execution', 'Persistence', 'Command & Control'],
      techniques: ['T1566.001', 'T1059.001', 'T1547.001', 'T1071.001'],
      affectedAssets: 23,
      status: 'active',
      description: 'Sophisticated nation-state campaign targeting government and defense sectors using spear-phishing and custom malware.',
    },
    {
      id: 'camp-2',
      name: 'FIN7 Carbanak Revival',
      threatActor: 'FIN7 (Carbon Spider)',
      confidence: 87,
      severity: 'high',
      startDate: new Date(Date.now() - 14 * 24 * 3600000),
      indicators: [
        { id: 'ioc-4', type: 'ip', value: '91.215.44.82', severity: 'high', firstSeen: new Date(Date.now() - 12 * 24 * 3600000), lastSeen: new Date(), occurrences: 89 },
        { id: 'ioc-5', type: 'email', value: 'hr-payroll@fin7mail.net', severity: 'high', firstSeen: new Date(Date.now() - 13 * 24 * 3600000), lastSeen: new Date(), occurrences: 156 },
      ],
      tactics: ['Initial Access', 'Collection', 'Exfiltration'],
      techniques: ['T1566.002', 'T1005', 'T1041'],
      affectedAssets: 45,
      status: 'investigating',
      description: 'Financial crime group targeting retail and hospitality with updated Carbanak malware variants.',
    },
    {
      id: 'camp-3',
      name: 'Lazarus Operation DreamJob',
      threatActor: 'Lazarus Group',
      confidence: 91,
      severity: 'critical',
      startDate: new Date(Date.now() - 21 * 24 * 3600000),
      endDate: new Date(Date.now() - 2 * 24 * 3600000),
      indicators: [
        { id: 'ioc-6', type: 'domain', value: 'careers-global.net', severity: 'critical', firstSeen: new Date(Date.now() - 20 * 24 * 3600000), lastSeen: new Date(Date.now() - 2 * 24 * 3600000), occurrences: 34 },
        { id: 'ioc-7', type: 'hash', value: 'b7e3f9a2c8d1...', severity: 'critical', firstSeen: new Date(Date.now() - 18 * 24 * 3600000), lastSeen: new Date(Date.now() - 2 * 24 * 3600000), occurrences: 8 },
      ],
      tactics: ['Initial Access', 'Execution', 'Defense Evasion'],
      techniques: ['T1204.002', 'T1059.005', 'T1036.005'],
      affectedAssets: 12,
      status: 'mitigated',
      description: 'North Korean APT using fake job offers to deliver malware targeting cryptocurrency companies.',
    },
    {
      id: 'camp-4',
      name: 'REvil Ransomware Wave',
      threatActor: 'REvil (Sodinokibi)',
      confidence: 78,
      severity: 'high',
      startDate: new Date(Date.now() - 3 * 24 * 3600000),
      indicators: [
        { id: 'ioc-8', type: 'ip', value: '45.142.213.56', severity: 'high', firstSeen: new Date(Date.now() - 2 * 24 * 3600000), lastSeen: new Date(), occurrences: 67 },
        { id: 'ioc-9', type: 'url', value: 'hxxps://revil-decrypt.onion', severity: 'high', firstSeen: new Date(Date.now() - 1 * 24 * 3600000), lastSeen: new Date(), occurrences: 4 },
      ],
      tactics: ['Impact', 'Exfiltration', 'Command & Control'],
      techniques: ['T1486', 'T1567', 'T1071.001'],
      affectedAssets: 8,
      status: 'active',
      description: 'Ransomware campaign exploiting VPN vulnerabilities for initial access and deploying double extortion tactics.',
    },
  ];
};

// Generate correlation links between indicators
const generateCorrelations = (campaigns: AttackCampaign[]): CorrelationLink[] => {
  const links: CorrelationLink[] = [];
  campaigns.forEach((campaign, i) => {
    campaign.indicators.forEach((indicator, j) => {
      // Create temporal correlations
      if (j < campaign.indicators.length - 1) {
        links.push({
          source: indicator.id,
          target: campaign.indicators[j + 1].id,
          strength: 0.7 + Math.random() * 0.3,
          type: 'temporal',
        });
      }
      // Create cross-campaign correlations
      if (i < campaigns.length - 1 && Math.random() > 0.7) {
        const targetCampaign = campaigns[i + 1];
        if (targetCampaign.indicators.length > 0) {
          links.push({
            source: indicator.id,
            target: targetCampaign.indicators[0].id,
            strength: 0.3 + Math.random() * 0.4,
            type: Math.random() > 0.5 ? 'behavioral' : 'ioc',
          });
        }
      }
    });
  });
  return links;
};

export const ThreatCorrelationEngine = () => {
  const [campaigns, setCampaigns] = useState<AttackCampaign[]>(generateCampaigns());
  const [correlations, setCorrelations] = useState<CorrelationLink[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<AttackCampaign | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);

  useEffect(() => {
    setCorrelations(generateCorrelations(campaigns));
  }, [campaigns]);

  // Auto-refresh campaigns
  useEffect(() => {
    const interval = setInterval(() => {
      setCampaigns(prev => {
        const updated = [...prev];
        // Randomly update some values
        updated.forEach(campaign => {
          campaign.affectedAssets += Math.floor(Math.random() * 3);
          campaign.indicators.forEach(ind => {
            ind.occurrences += Math.floor(Math.random() * 5);
            ind.lastSeen = new Date();
          });
        });
        return updated;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const runCorrelationAnalysis = async () => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    
    for (let i = 0; i <= 100; i += 2) {
      await new Promise(resolve => setTimeout(resolve, 50));
      setAnalysisProgress(i);
    }
    
    // Generate new correlations
    setCorrelations(generateCorrelations(campaigns));
    setIsAnalyzing(false);
  };

  const filteredCampaigns = useMemo(() => {
    if (!searchQuery) return campaigns;
    const query = searchQuery.toLowerCase();
    return campaigns.filter(c =>
      c.name.toLowerCase().includes(query) ||
      c.threatActor.toLowerCase().includes(query) ||
      c.indicators.some(i => i.value.toLowerCase().includes(query))
    );
  }, [campaigns, searchQuery]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-500 bg-red-500/10 border-red-500/30';
      case 'high': return 'text-orange-500 bg-orange-500/10 border-orange-500/30';
      case 'medium': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30';
      case 'low': return 'text-green-500 bg-green-500/10 border-green-500/30';
      default: return 'text-muted-foreground bg-muted/10 border-muted/30';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-red-500 animate-pulse';
      case 'investigating': return 'bg-yellow-500 animate-pulse';
      case 'mitigated': return 'bg-green-500';
      default: return 'bg-muted';
    }
  };

  const getIOCIcon = (type: string) => {
    switch (type) {
      case 'ip': return MapPin;
      case 'domain': return Network;
      case 'hash': return Fingerprint;
      case 'url': return Link2;
      case 'email': return Target;
      default: return Eye;
    }
  };

  const totalIndicators = campaigns.reduce((acc, c) => acc + c.indicators.length, 0);
  const activeCampaigns = campaigns.filter(c => c.status === 'active').length;
  const totalAffected = campaigns.reduce((acc, c) => acc + c.affectedAssets, 0);

  return (
    <Card variant="glass" className="overflow-hidden">
      <CardHeader className="pb-4 border-b border-border/50">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/30">
              <Network className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Threat Correlation Engine</CardTitle>
              <p className="text-sm text-muted-foreground">AI-powered attack campaign identification</p>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search campaigns, IOCs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-background/50"
              />
            </div>
            <Button
              variant="cyber"
              size="sm"
              onClick={runCorrelationAnalysis}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Zap className="h-4 w-4 mr-2" />
              )}
              Analyze
            </Button>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          <div className="bg-background/50 rounded-lg p-3 border border-border/50">
            <div className="flex items-center gap-2 mb-1">
              <Target className="h-4 w-4 text-primary" />
              <span className="text-xs text-muted-foreground">Campaigns</span>
            </div>
            <div className="text-xl font-bold">{campaigns.length}</div>
          </div>
          <div className="bg-background/50 rounded-lg p-3 border border-border/50">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <span className="text-xs text-muted-foreground">Active</span>
            </div>
            <div className="text-xl font-bold text-destructive">{activeCampaigns}</div>
          </div>
          <div className="bg-background/50 rounded-lg p-3 border border-border/50">
            <div className="flex items-center gap-2 mb-1">
              <Fingerprint className="h-4 w-4 text-warning" />
              <span className="text-xs text-muted-foreground">IOCs</span>
            </div>
            <div className="text-xl font-bold">{totalIndicators}</div>
          </div>
          <div className="bg-background/50 rounded-lg p-3 border border-border/50">
            <div className="flex items-center gap-2 mb-1">
              <Link2 className="h-4 w-4 text-success" />
              <span className="text-xs text-muted-foreground">Correlations</span>
            </div>
            <div className="text-xl font-bold">{correlations.length}</div>
          </div>
        </div>

        {/* Analysis Progress */}
        <AnimatePresence>
          {isAnalyzing && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4"
            >
              <div className="flex items-center gap-3">
                <Activity className="h-4 w-4 text-primary animate-pulse" />
                <span className="text-sm text-muted-foreground">Analyzing threat patterns...</span>
                <span className="text-sm font-mono text-primary">{analysisProgress}%</span>
              </div>
              <Progress value={analysisProgress} className="mt-2 h-1" />
            </motion.div>
          )}
        </AnimatePresence>
      </CardHeader>

      <CardContent className="p-0">
        <Tabs defaultValue="campaigns" className="w-full">
          <TabsList className="w-full justify-start rounded-none border-b border-border/50 bg-transparent p-0 h-auto">
            <TabsTrigger value="campaigns" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary px-6 py-3">
              Campaigns
            </TabsTrigger>
            <TabsTrigger value="graph" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary px-6 py-3">
              Correlation Graph
            </TabsTrigger>
            <TabsTrigger value="timeline" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary px-6 py-3">
              Timeline
            </TabsTrigger>
          </TabsList>

          <TabsContent value="campaigns" className="p-4 space-y-3 max-h-[500px] overflow-y-auto scrollbar-cyber">
            {filteredCampaigns.map((campaign, index) => (
              <motion.div
                key={campaign.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedCampaign?.id === campaign.id
                    ? 'bg-primary/10 border-primary/50'
                    : 'bg-background/50 border-border/50 hover:border-primary/30'
                }`}
                onClick={() => setSelectedCampaign(selectedCampaign?.id === campaign.id ? null : campaign)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(campaign.status)}`} />
                      <span className="font-semibold">{campaign.name}</span>
                      <Badge className={getSeverityColor(campaign.severity)}>
                        {campaign.severity.toUpperCase()}
                      </Badge>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Target className="h-3 w-3" />
                        {campaign.threatActor}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(campaign.startDate).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Fingerprint className="h-3 w-3" />
                        {campaign.indicators.length} IOCs
                      </span>
                      <span className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        {campaign.confidence}% confidence
                      </span>
                    </div>
                  </div>
                  
                  <ChevronRight className={`h-5 w-5 text-muted-foreground transition-transform ${
                    selectedCampaign?.id === campaign.id ? 'rotate-90' : ''
                  }`} />
                </div>

                {/* Expanded Details */}
                <AnimatePresence>
                  {selectedCampaign?.id === campaign.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 pt-4 border-t border-border/50"
                    >
                      <p className="text-sm text-muted-foreground mb-4">{campaign.description}</p>
                      
                      {/* MITRE Tactics */}
                      <div className="mb-4">
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-2">MITRE ATT&CK Tactics</h4>
                        <div className="flex flex-wrap gap-2">
                          {campaign.tactics.map((tactic, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {tactic}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Techniques */}
                      <div className="mb-4">
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-2">Techniques</h4>
                        <div className="flex flex-wrap gap-2">
                          {campaign.techniques.map((tech, i) => (
                            <Badge key={i} variant="secondary" className="text-xs font-mono">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* IOCs */}
                      <div>
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-2">Indicators of Compromise</h4>
                        <div className="space-y-2">
                          {campaign.indicators.map((ioc) => {
                            const IOCIcon = getIOCIcon(ioc.type);
                            return (
                              <div key={ioc.id} className="flex items-center gap-3 p-2 bg-background/50 rounded-lg">
                                <IOCIcon className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm font-mono flex-1">{ioc.value}</span>
                                <Badge className={`text-xs ${getSeverityColor(ioc.severity)}`}>
                                  {ioc.occurrences}x
                                </Badge>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="flex gap-2 mt-4">
                        <Button size="sm" variant="cyber">
                          <Shield className="h-3 w-3 mr-1" />
                          Block All IOCs
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3 mr-1" />
                          Full Report
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </TabsContent>

          <TabsContent value="graph" className="p-4">
            {/* Visual Correlation Graph */}
            <div className="relative h-[400px] bg-background/50 rounded-lg border border-border/50 overflow-hidden">
              <svg className="w-full h-full">
                {/* Draw correlation lines */}
                {correlations.slice(0, 20).map((link, i) => (
                  <motion.line
                    key={i}
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: link.strength * 0.5 }}
                    transition={{ delay: i * 0.05, duration: 0.5 }}
                    x1={100 + (i % 5) * 150}
                    y1={80 + Math.floor(i / 5) * 80}
                    x2={250 + ((i + 2) % 5) * 150}
                    y2={120 + Math.floor((i + 1) / 5) * 80}
                    stroke={link.type === 'temporal' ? '#00d4aa' : link.type === 'behavioral' ? '#f97316' : '#ef4444'}
                    strokeWidth={link.strength * 3}
                    strokeDasharray={link.type === 'behavioral' ? '5,5' : 'none'}
                  />
                ))}
                
                {/* Draw campaign nodes */}
                {campaigns.map((campaign, i) => (
                  <g key={campaign.id}>
                    <motion.circle
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                      cx={200 + (i % 3) * 200}
                      cy={150 + Math.floor(i / 3) * 150}
                      r={30 + campaign.indicators.length * 5}
                      fill={campaign.severity === 'critical' ? '#ef444420' : campaign.severity === 'high' ? '#f9731620' : '#22c55e20'}
                      stroke={campaign.severity === 'critical' ? '#ef4444' : campaign.severity === 'high' ? '#f97316' : '#22c55e'}
                      strokeWidth={2}
                      className="cursor-pointer hover:opacity-80 transition-opacity"
                    />
                    <text
                      x={200 + (i % 3) * 200}
                      y={150 + Math.floor(i / 3) * 150}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="fill-foreground text-xs font-semibold"
                    >
                      {campaign.name.split(' ').slice(0, 2).join(' ')}
                    </text>
                  </g>
                ))}
              </svg>
              
              {/* Legend */}
              <div className="absolute bottom-4 left-4 flex gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-0.5 bg-primary" />
                  <span className="text-muted-foreground">Temporal</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-0.5 bg-warning" style={{ borderTop: '2px dashed' }} />
                  <span className="text-muted-foreground">Behavioral</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-0.5 bg-destructive" />
                  <span className="text-muted-foreground">IOC Match</span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="timeline" className="p-4">
            {/* Campaign Timeline */}
            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border" />
              
              {campaigns.sort((a, b) => b.startDate.getTime() - a.startDate.getTime()).map((campaign, i) => (
                <motion.div
                  key={campaign.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="relative pl-16 pb-8"
                >
                  <div className={`absolute left-6 w-4 h-4 rounded-full border-2 ${
                    campaign.status === 'active'
                      ? 'bg-destructive border-destructive'
                      : campaign.status === 'investigating'
                      ? 'bg-warning border-warning'
                      : 'bg-success border-success'
                  }`} />
                  
                  <div className="bg-background/50 rounded-lg border border-border/50 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm text-muted-foreground font-mono">
                        {new Date(campaign.startDate).toLocaleDateString()}
                      </span>
                      <Badge className={getSeverityColor(campaign.severity)}>
                        {campaign.severity}
                      </Badge>
                    </div>
                    <h4 className="font-semibold mb-1">{campaign.name}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{campaign.threatActor}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{campaign.indicators.length} IOCs</span>
                      <span>{campaign.affectedAssets} assets</span>
                      <span>{campaign.confidence}% confidence</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
