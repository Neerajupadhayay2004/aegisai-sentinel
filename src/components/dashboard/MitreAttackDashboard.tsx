import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, Target, AlertTriangle, TrendingUp, Eye, Zap,
  ChevronRight, Info, ExternalLink
} from 'lucide-react';

interface TechniqueData {
  id: string;
  name: string;
  tactic: string;
  description: string;
  detections: number;
  severity: 'critical' | 'high' | 'medium' | 'low';
  coverage: number;
  lastSeen?: string;
  mitigations: string[];
}

interface TacticData {
  id: string;
  name: string;
  shortName: string;
  description: string;
  techniques: number;
  detections: number;
  coverage: number;
  color: string;
}

const tactics: TacticData[] = [
  { id: 'TA0001', name: 'Initial Access', shortName: 'Initial', description: 'Techniques for gaining initial foothold', techniques: 9, detections: 23, coverage: 78, color: 'bg-red-500' },
  { id: 'TA0002', name: 'Execution', shortName: 'Exec', description: 'Techniques for running malicious code', techniques: 12, detections: 45, coverage: 82, color: 'bg-orange-500' },
  { id: 'TA0003', name: 'Persistence', shortName: 'Persist', description: 'Techniques for maintaining presence', techniques: 19, detections: 31, coverage: 65, color: 'bg-yellow-500' },
  { id: 'TA0004', name: 'Privilege Escalation', shortName: 'PrivEsc', description: 'Techniques for gaining higher permissions', techniques: 13, detections: 18, coverage: 71, color: 'bg-lime-500' },
  { id: 'TA0005', name: 'Defense Evasion', shortName: 'Evasion', description: 'Techniques for avoiding detection', techniques: 42, detections: 67, coverage: 58, color: 'bg-green-500' },
  { id: 'TA0006', name: 'Credential Access', shortName: 'CredAcc', description: 'Techniques for stealing credentials', techniques: 17, detections: 28, coverage: 74, color: 'bg-teal-500' },
  { id: 'TA0007', name: 'Discovery', shortName: 'Discov', description: 'Techniques for exploring environment', techniques: 31, detections: 52, coverage: 69, color: 'bg-cyan-500' },
  { id: 'TA0008', name: 'Lateral Movement', shortName: 'LatMov', description: 'Techniques for moving through network', techniques: 9, detections: 15, coverage: 81, color: 'bg-blue-500' },
  { id: 'TA0009', name: 'Collection', shortName: 'Collect', description: 'Techniques for gathering target data', techniques: 17, detections: 22, coverage: 63, color: 'bg-indigo-500' },
  { id: 'TA0010', name: 'Exfiltration', shortName: 'Exfil', description: 'Techniques for stealing data', techniques: 9, detections: 11, coverage: 76, color: 'bg-violet-500' },
  { id: 'TA0011', name: 'Command and Control', shortName: 'C2', description: 'Techniques for communicating with compromised systems', techniques: 16, detections: 38, coverage: 72, color: 'bg-purple-500' },
  { id: 'TA0040', name: 'Impact', shortName: 'Impact', description: 'Techniques for disruption and destruction', techniques: 13, detections: 8, coverage: 85, color: 'bg-pink-500' },
];

const recentTechniques: TechniqueData[] = [
  {
    id: 'T1059.001',
    name: 'PowerShell',
    tactic: 'Execution',
    description: 'Adversaries may abuse PowerShell commands and scripts for execution',
    detections: 156,
    severity: 'high',
    coverage: 92,
    lastSeen: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    mitigations: ['Code Signing', 'Disable/Remove Feature', 'Execution Prevention']
  },
  {
    id: 'T1566.001',
    name: 'Spearphishing Attachment',
    tactic: 'Initial Access',
    description: 'Adversaries may send spearphishing emails with malicious attachments',
    detections: 89,
    severity: 'critical',
    coverage: 85,
    lastSeen: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    mitigations: ['User Training', 'Antivirus/Antimalware', 'Network Intrusion Prevention']
  },
  {
    id: 'T1078',
    name: 'Valid Accounts',
    tactic: 'Defense Evasion',
    description: 'Adversaries may use legitimate credentials to gain access',
    detections: 67,
    severity: 'high',
    coverage: 68,
    lastSeen: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    mitigations: ['Multi-factor Authentication', 'Privileged Account Management', 'User Account Management']
  },
  {
    id: 'T1486',
    name: 'Data Encrypted for Impact',
    tactic: 'Impact',
    description: 'Adversaries may encrypt data on target systems to interrupt availability',
    detections: 12,
    severity: 'critical',
    coverage: 94,
    lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    mitigations: ['Data Backup', 'Behavior Prevention on Endpoint']
  },
  {
    id: 'T1055',
    name: 'Process Injection',
    tactic: 'Defense Evasion',
    description: 'Adversaries may inject code into processes to evade defenses',
    detections: 45,
    severity: 'high',
    coverage: 76,
    lastSeen: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    mitigations: ['Behavior Prevention on Endpoint', 'Privileged Account Management']
  }
];

export const MitreAttackDashboard = () => {
  const [selectedTactic, setSelectedTactic] = useState<TacticData | null>(null);
  const [liveDetections, setLiveDetections] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveDetections(prev => prev + Math.floor(Math.random() * 3));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/50';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const totalDetections = tactics.reduce((sum, t) => sum + t.detections, 0);
  const avgCoverage = Math.round(tactics.reduce((sum, t) => sum + t.coverage, 0) / tactics.length);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Target className="h-6 w-6 text-primary" />
            MITRE ATT&CK Coverage
          </h2>
          <p className="text-muted-foreground">Real-time mapping of detected techniques to MITRE framework</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">{totalDetections + liveDetections}</div>
            <div className="text-xs text-muted-foreground">Total Detections</div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-400">{avgCoverage}%</div>
            <div className="text-xs text-muted-foreground">Avg Coverage</div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="matrix" className="space-y-4">
        <TabsList className="bg-card/50 border border-border">
          <TabsTrigger value="matrix" className="data-[state=active]:bg-primary/20">
            <Shield className="h-4 w-4 mr-2" />
            ATT&CK Matrix
          </TabsTrigger>
          <TabsTrigger value="techniques" className="data-[state=active]:bg-primary/20">
            <Target className="h-4 w-4 mr-2" />
            Recent Techniques
          </TabsTrigger>
          <TabsTrigger value="coverage" className="data-[state=active]:bg-primary/20">
            <TrendingUp className="h-4 w-4 mr-2" />
            Coverage Analysis
          </TabsTrigger>
        </TabsList>

        <TabsContent value="matrix" className="space-y-4">
          {/* MITRE ATT&CK Matrix Visualization */}
          <Card className="bg-card/50 border-border">
            <CardHeader>
              <CardTitle className="text-lg">Enterprise ATT&CK Matrix</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-6 lg:grid-cols-12 gap-2">
                {tactics.map((tactic) => (
                  <div
                    key={tactic.id}
                    className="cursor-pointer group"
                    onClick={() => setSelectedTactic(selectedTactic?.id === tactic.id ? null : tactic)}
                  >
                    <div className={`p-2 rounded-lg border transition-all ${
                      selectedTactic?.id === tactic.id 
                        ? 'border-primary bg-primary/20' 
                        : 'border-border bg-background/50 hover:border-primary/50'
                    }`}>
                      <div className={`h-2 w-full rounded mb-2 ${tactic.color}`} style={{ opacity: tactic.coverage / 100 }} />
                      <div className="text-xs font-medium truncate">{tactic.shortName}</div>
                      <div className="text-xs text-muted-foreground">{tactic.techniques} tech</div>
                      <div className="text-xs text-primary">{tactic.detections} det</div>
                    </div>
                  </div>
                ))}
              </div>

              {selectedTactic && (
                <div className="mt-4 p-4 bg-background/50 rounded-lg border border-primary/50">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-foreground">{selectedTactic.name}</h4>
                      <p className="text-sm text-muted-foreground">{selectedTactic.description}</p>
                    </div>
                    <Badge variant="outline">{selectedTactic.id}</Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <div className="text-2xl font-bold">{selectedTactic.techniques}</div>
                      <div className="text-xs text-muted-foreground">Techniques</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-primary">{selectedTactic.detections}</div>
                      <div className="text-xs text-muted-foreground">Detections</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-400">{selectedTactic.coverage}%</div>
                      <div className="text-xs text-muted-foreground">Coverage</div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Heat Map Legend */}
          <Card className="bg-card/50 border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">Detection Coverage:</span>
                  <div className="flex items-center gap-1">
                    <div className="w-8 h-3 bg-red-500/20 rounded" />
                    <span className="text-xs">Low</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-8 h-3 bg-yellow-500/50 rounded" />
                    <span className="text-xs">Medium</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-8 h-3 bg-green-500/80 rounded" />
                    <span className="text-xs">High</span>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Full Matrix
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="techniques" className="space-y-4">
          <div className="grid gap-4">
            {recentTechniques.map((technique) => (
              <Card key={technique.id} className="bg-card/50 border-border hover:border-primary/50 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge className={getSeverityColor(technique.severity)}>
                          {technique.severity.toUpperCase()}
                        </Badge>
                        <span className="font-mono text-sm text-primary">{technique.id}</span>
                        <h4 className="font-semibold">{technique.name}</h4>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3">{technique.description}</p>
                      
                      <div className="flex items-center gap-4 mb-3">
                        <Badge variant="outline">{technique.tactic}</Badge>
                        <span className="text-sm text-muted-foreground">{technique.detections} detections</span>
                        {technique.lastSeen && (
                          <span className="text-sm text-muted-foreground">
                            Last seen: {new Date(technique.lastSeen).toLocaleTimeString()}
                          </span>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Detection Coverage</span>
                          <span className="font-semibold">{technique.coverage}%</span>
                        </div>
                        <Progress value={technique.coverage} className="h-2" />
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mt-3">
                        <span className="text-xs text-muted-foreground mr-2">Mitigations:</span>
                        {technique.mitigations.map((m) => (
                          <Badge key={m} variant="secondary" className="text-xs">
                            {m}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <Button variant="ghost" size="icon">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="coverage" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {tactics.map((tactic) => (
              <Card key={tactic.id} className="bg-card/50 border-border">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded ${tactic.color}`} />
                      <span className="font-semibold">{tactic.name}</span>
                    </div>
                    <Badge variant="outline">{tactic.id}</Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Coverage</span>
                      <span className={tactic.coverage >= 80 ? 'text-green-400' : tactic.coverage >= 60 ? 'text-yellow-400' : 'text-red-400'}>
                        {tactic.coverage}%
                      </span>
                    </div>
                    <Progress value={tactic.coverage} className="h-2" />
                  </div>
                  
                  <div className="flex justify-between mt-3 text-sm text-muted-foreground">
                    <span>{tactic.techniques} techniques</span>
                    <span>{tactic.detections} detections</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
