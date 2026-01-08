import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  Shield, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle,
  Clock,
  Play,
  Pause,
  Settings,
  ArrowRight,
  Bot,
  RefreshCw,
  Server,
  Lock,
  Mail,
  Ban,
  FileSearch,
  Network
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ResponseAction {
  id: string;
  name: string;
  icon: React.ReactNode;
  status: 'pending' | 'running' | 'completed' | 'failed';
  duration?: string;
}

interface ActiveResponse {
  id: string;
  threatId: string;
  threatType: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  playbook: string;
  startTime: Date;
  actions: ResponseAction[];
  progress: number;
  status: 'running' | 'completed' | 'failed';
}

interface Playbook {
  id: string;
  name: string;
  description: string;
  triggerConditions: string[];
  actions: string[];
  enabled: boolean;
  executionCount: number;
  avgResponseTime: string;
  successRate: number;
}

const defaultPlaybooks: Playbook[] = [
  {
    id: 'pb-1',
    name: 'Critical Threat Response',
    description: 'Immediate isolation and containment for critical severity threats',
    triggerConditions: ['severity = critical', 'confidence > 80%'],
    actions: ['Isolate endpoint', 'Block source IP', 'Revoke credentials', 'Alert SOC', 'Create ticket'],
    enabled: true,
    executionCount: 47,
    avgResponseTime: '1.2s',
    successRate: 98.5,
  },
  {
    id: 'pb-2',
    name: 'Ransomware Containment',
    description: 'Specialized response for ransomware detection',
    triggerConditions: ['threat_type = ransomware', 'file_encryption_detected'],
    actions: ['Kill process', 'Isolate system', 'Snapshot restore', 'Network quarantine'],
    enabled: true,
    executionCount: 12,
    avgResponseTime: '0.8s',
    successRate: 100,
  },
  {
    id: 'pb-3',
    name: 'Brute Force Mitigation',
    description: 'Auto-block and rate limiting for brute force attacks',
    triggerConditions: ['failed_logins > 5', 'time_window < 1min'],
    actions: ['Block IP', 'Enable CAPTCHA', 'Notify user', 'Log event'],
    enabled: true,
    executionCount: 234,
    avgResponseTime: '0.3s',
    successRate: 99.1,
  },
  {
    id: 'pb-4',
    name: 'Data Exfiltration Prevention',
    description: 'Block large data transfers to suspicious destinations',
    triggerConditions: ['data_transfer > 100MB', 'destination_reputation = low'],
    actions: ['Block transfer', 'Quarantine files', 'Alert DLP team'],
    enabled: false,
    executionCount: 8,
    avgResponseTime: '2.1s',
    successRate: 87.5,
  },
  {
    id: 'pb-5',
    name: 'Phishing Response',
    description: 'Handle detected phishing attempts automatically',
    triggerConditions: ['email_threat_detected', 'phishing_confidence > 90%'],
    actions: ['Quarantine email', 'Block sender domain', 'Warn recipients', 'Update filters'],
    enabled: true,
    executionCount: 156,
    avgResponseTime: '0.5s',
    successRate: 97.8,
  },
];

export const AutomatedResponseSystem = () => {
  const [playbooks, setPlaybooks] = useState<Playbook[]>(defaultPlaybooks);
  const [activeResponses, setActiveResponses] = useState<ActiveResponse[]>([]);
  const [systemEnabled, setSystemEnabled] = useState(true);
  const [stats, setStats] = useState({
    totalResponses: 457,
    successfulResponses: 449,
    avgResponseTime: '0.9s',
    threatsMitigated: 449,
  });

  const getActionIcon = (actionName: string) => {
    if (actionName.includes('Isolate')) return <Server className="h-3 w-3" />;
    if (actionName.includes('Block')) return <Ban className="h-3 w-3" />;
    if (actionName.includes('Revoke') || actionName.includes('credential')) return <Lock className="h-3 w-3" />;
    if (actionName.includes('Alert') || actionName.includes('Notify')) return <Mail className="h-3 w-3" />;
    if (actionName.includes('Scan') || actionName.includes('Search')) return <FileSearch className="h-3 w-3" />;
    if (actionName.includes('Network') || actionName.includes('Quarantine')) return <Network className="h-3 w-3" />;
    return <Zap className="h-3 w-3" />;
  };

  // Simulate active responses
  useEffect(() => {
    if (!systemEnabled) return;

    const interval = setInterval(() => {
      if (Math.random() > 0.7 && activeResponses.length < 3) {
        const playbook = playbooks.filter(p => p.enabled)[Math.floor(Math.random() * playbooks.filter(p => p.enabled).length)];
        if (!playbook) return;

        const newResponse: ActiveResponse = {
          id: crypto.randomUUID(),
          threatId: `THR-${Date.now()}`,
          threatType: ['APT Attack', 'Ransomware', 'Brute Force', 'Phishing'][Math.floor(Math.random() * 4)],
          severity: ['critical', 'high', 'medium'][Math.floor(Math.random() * 3)] as any,
          playbook: playbook.name,
          startTime: new Date(),
          actions: playbook.actions.map((action, i) => ({
            id: `${i}`,
            name: action,
            icon: getActionIcon(action),
            status: 'pending' as const,
          })),
          progress: 0,
          status: 'running',
        };

        setActiveResponses(prev => [...prev, newResponse]);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [systemEnabled, playbooks, activeResponses.length]);

  // Progress active responses
  useEffect(() => {
    if (!systemEnabled || activeResponses.length === 0) return;

    const interval = setInterval(() => {
      setActiveResponses(prev => prev.map(response => {
        if (response.status !== 'running') return response;

        const nextActionIndex = response.actions.findIndex(a => a.status === 'pending');
        if (nextActionIndex === -1) {
          return { ...response, status: 'completed' as const, progress: 100 };
        }

        const updatedActions = [...response.actions];
        if (nextActionIndex > 0) {
          updatedActions[nextActionIndex - 1] = {
            ...updatedActions[nextActionIndex - 1],
            status: Math.random() > 0.05 ? 'completed' : 'failed',
            duration: `${Math.floor(100 + Math.random() * 500)}ms`,
          };
        }
        updatedActions[nextActionIndex] = {
          ...updatedActions[nextActionIndex],
          status: 'running',
        };

        return {
          ...response,
          actions: updatedActions,
          progress: (nextActionIndex / response.actions.length) * 100,
        };
      }).filter(r => {
        if (r.status === 'completed') {
          setStats(prev => ({
            ...prev,
            totalResponses: prev.totalResponses + 1,
            successfulResponses: prev.successfulResponses + 1,
            threatsMitigated: prev.threatsMitigated + 1,
          }));
          return false;
        }
        return true;
      }));
    }, 800);

    return () => clearInterval(interval);
  }, [systemEnabled, activeResponses]);

  const togglePlaybook = (id: string) => {
    setPlaybooks(prev => prev.map(p => 
      p.id === id ? { ...p, enabled: !p.enabled } : p
    ));
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-500 bg-red-500/10 border-red-500/30';
      case 'high': return 'text-orange-500 bg-orange-500/10 border-orange-500/30';
      case 'medium': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30';
      default: return 'text-green-500 bg-green-500/10 border-green-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="h-3 w-3 text-green-500" />;
      case 'running': return <RefreshCw className="h-3 w-3 text-blue-500 animate-spin" />;
      case 'failed': return <XCircle className="h-3 w-3 text-red-500" />;
      default: return <Clock className="h-3 w-3 text-muted-foreground" />;
    }
  };

  return (
    <Card variant="glass" className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Bot className="h-6 w-6 text-primary" />
              <div className="absolute inset-0 bg-primary/40 blur-lg rounded-full" />
            </div>
            <div>
              <span className="text-lg font-bold">SOAR - Automated Response</span>
              <p className="text-xs text-muted-foreground">Security Orchestration, Automation and Response</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant={systemEnabled ? 'default' : 'secondary'} className="gap-1">
              {systemEnabled ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
              {systemEnabled ? 'Active' : 'Paused'}
            </Badge>
            <Switch checked={systemEnabled} onCheckedChange={setSystemEnabled} />
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          <div className="p-3 rounded-lg bg-primary/10 border border-primary/30">
            <div className="text-2xl font-bold text-primary">{stats.totalResponses}</div>
            <div className="text-xs text-muted-foreground">Total Responses</div>
          </div>
          <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30">
            <div className="text-2xl font-bold text-green-500">{stats.successfulResponses}</div>
            <div className="text-xs text-muted-foreground">Successful</div>
          </div>
          <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/30">
            <div className="text-2xl font-bold text-blue-500">{stats.avgResponseTime}</div>
            <div className="text-xs text-muted-foreground">Avg Response</div>
          </div>
          <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/30">
            <div className="text-2xl font-bold text-purple-500">{stats.threatsMitigated}</div>
            <div className="text-xs text-muted-foreground">Mitigated</div>
          </div>
        </div>

        <Tabs defaultValue="active" className="w-full">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="active" className="text-xs sm:text-sm">
              <Zap className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              Active Responses ({activeResponses.length})
            </TabsTrigger>
            <TabsTrigger value="playbooks" className="text-xs sm:text-sm">
              <Settings className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              Playbooks ({playbooks.filter(p => p.enabled).length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="mt-4">
            <ScrollArea className="h-[300px] sm:h-[350px]">
              {activeResponses.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-6">
                  <Shield className="h-12 w-12 text-green-500 mb-3" />
                  <p className="font-medium">No Active Responses</p>
                  <p className="text-xs text-muted-foreground">System is monitoring for threats</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <AnimatePresence>
                    {activeResponses.map((response, index) => (
                      <motion.div
                        key={response.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 100 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-4 rounded-lg border ${getSeverityColor(response.severity)}`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4" />
                            <span className="font-medium text-sm">{response.threatType}</span>
                            <Badge variant="outline" className="text-[10px]">{response.threatId}</Badge>
                          </div>
                          <Badge variant="outline" className={getSeverityColor(response.severity)}>
                            {response.severity}
                          </Badge>
                        </div>

                        <div className="text-xs text-muted-foreground mb-2">
                          Playbook: {response.playbook}
                        </div>

                        <Progress value={response.progress} className="h-2 mb-3" />

                        <div className="flex flex-wrap gap-1">
                          {response.actions.map((action, i) => (
                            <div 
                              key={action.id}
                              className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] ${
                                action.status === 'completed' ? 'bg-green-500/20 text-green-500' :
                                action.status === 'running' ? 'bg-blue-500/20 text-blue-500' :
                                action.status === 'failed' ? 'bg-red-500/20 text-red-500' :
                                'bg-secondary/50 text-muted-foreground'
                              }`}
                            >
                              {getStatusIcon(action.status)}
                              {action.name}
                              {action.duration && <span className="opacity-60">({action.duration})</span>}
                              {i < response.actions.length - 1 && <ArrowRight className="h-2 w-2 ml-1" />}
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="playbooks" className="mt-4">
            <ScrollArea className="h-[300px] sm:h-[350px]">
              <div className="space-y-3">
                {playbooks.map((playbook) => (
                  <div
                    key={playbook.id}
                    className={`p-4 rounded-lg border transition-all ${
                      playbook.enabled 
                        ? 'border-primary/30 bg-primary/5' 
                        : 'border-border/50 bg-secondary/20 opacity-60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{playbook.name}</span>
                          {playbook.enabled && (
                            <Badge variant="outline" className="text-[10px] text-green-500 border-green-500/30">
                              Active
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">{playbook.description}</p>
                        
                        <div className="flex flex-wrap gap-1 mb-2">
                          {playbook.actions.slice(0, 3).map((action, i) => (
                            <Badge key={i} variant="secondary" className="text-[10px]">
                              {action}
                            </Badge>
                          ))}
                          {playbook.actions.length > 3 && (
                            <Badge variant="secondary" className="text-[10px]">
                              +{playbook.actions.length - 3} more
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
                          <span>Executed: {playbook.executionCount}x</span>
                          <span>Avg: {playbook.avgResponseTime}</span>
                          <span className="text-green-500">Success: {playbook.successRate}%</span>
                        </div>
                      </div>
                      <Switch 
                        checked={playbook.enabled} 
                        onCheckedChange={() => togglePlaybook(playbook.id)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
