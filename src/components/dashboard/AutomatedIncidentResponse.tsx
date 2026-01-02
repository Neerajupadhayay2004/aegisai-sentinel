import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { 
  Zap, Shield, AlertTriangle, CheckCircle, Clock, Play, Pause, 
  Settings, RefreshCw, Target, Ban, Mail, MessageSquare, Database,
  Lock, Unlock, Server, Network, FileWarning
} from 'lucide-react';
import { toast } from 'sonner';

interface Playbook {
  id: string;
  name: string;
  description: string;
  trigger: string;
  actions: PlaybookAction[];
  enabled: boolean;
  executions: number;
  lastRun?: string;
  avgTime: string;
}

interface PlaybookAction {
  id: string;
  type: 'block_ip' | 'isolate_host' | 'disable_user' | 'notify' | 'quarantine' | 'collect_evidence' | 'escalate';
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
}

interface ActiveIncident {
  id: string;
  title: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'investigating' | 'responding' | 'contained' | 'resolved';
  playbook: string;
  progress: number;
  currentAction: string;
  startTime: string;
  affectedAssets: number;
}

const defaultPlaybooks: Playbook[] = [
  {
    id: '1',
    name: 'Ransomware Response',
    description: 'Automated containment and evidence collection for ransomware attacks',
    trigger: 'Ransomware signature detected OR file encryption anomaly',
    actions: [
      { id: '1a', type: 'isolate_host', name: 'Isolate infected host', status: 'pending' },
      { id: '1b', type: 'block_ip', name: 'Block C2 communication', status: 'pending' },
      { id: '1c', type: 'collect_evidence', name: 'Capture memory dump', status: 'pending' },
      { id: '1d', type: 'notify', name: 'Alert SOC team', status: 'pending' },
      { id: '1e', type: 'escalate', name: 'Escalate to IR team', status: 'pending' }
    ],
    enabled: true,
    executions: 12,
    lastRun: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    avgTime: '45s'
  },
  {
    id: '2',
    name: 'Brute Force Mitigation',
    description: 'Block and investigate brute force authentication attempts',
    trigger: '5+ failed login attempts within 5 minutes',
    actions: [
      { id: '2a', type: 'block_ip', name: 'Block source IP', status: 'pending' },
      { id: '2b', type: 'disable_user', name: 'Lock target account', status: 'pending' },
      { id: '2c', type: 'notify', name: 'Send security alert', status: 'pending' },
      { id: '2d', type: 'collect_evidence', name: 'Log forensic data', status: 'pending' }
    ],
    enabled: true,
    executions: 89,
    lastRun: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    avgTime: '12s'
  },
  {
    id: '3',
    name: 'Data Exfiltration Response',
    description: 'Detect and prevent unauthorized data transfers',
    trigger: 'Large outbound transfer to untrusted destination',
    actions: [
      { id: '3a', type: 'block_ip', name: 'Block destination', status: 'pending' },
      { id: '3b', type: 'isolate_host', name: 'Network isolation', status: 'pending' },
      { id: '3c', type: 'collect_evidence', name: 'Capture network logs', status: 'pending' },
      { id: '3d', type: 'escalate', name: 'Notify DLP team', status: 'pending' }
    ],
    enabled: true,
    executions: 23,
    avgTime: '28s'
  },
  {
    id: '4',
    name: 'Phishing Response',
    description: 'Automated response to detected phishing campaigns',
    trigger: 'Phishing email detected OR malicious link clicked',
    actions: [
      { id: '4a', type: 'quarantine', name: 'Quarantine email', status: 'pending' },
      { id: '4b', type: 'block_ip', name: 'Block sender domain', status: 'pending' },
      { id: '4c', type: 'notify', name: 'Warn affected users', status: 'pending' },
      { id: '4d', type: 'collect_evidence', name: 'Preserve email headers', status: 'pending' }
    ],
    enabled: true,
    executions: 156,
    lastRun: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    avgTime: '8s'
  }
];

export const AutomatedIncidentResponse = () => {
  const [playbooks, setPlaybooks] = useState<Playbook[]>(defaultPlaybooks);
  const [activeIncidents, setActiveIncidents] = useState<ActiveIncident[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);

  useEffect(() => {
    // Simulate active incidents
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const newIncident: ActiveIncident = {
          id: `inc-${Date.now()}`,
          title: ['Ransomware Detected', 'Brute Force Attack', 'Suspicious Data Transfer', 'Phishing Attempt'][Math.floor(Math.random() * 4)],
          severity: ['critical', 'high', 'medium'][Math.floor(Math.random() * 3)] as any,
          status: 'responding',
          playbook: playbooks[Math.floor(Math.random() * playbooks.length)].name,
          progress: 0,
          currentAction: 'Initializing response...',
          startTime: new Date().toISOString(),
          affectedAssets: Math.floor(Math.random() * 10) + 1
        };

        setActiveIncidents(prev => [newIncident, ...prev.slice(0, 4)]);
        toast.warning(`New incident: ${newIncident.title}`, {
          description: `Playbook "${newIncident.playbook}" triggered`
        });
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [playbooks]);

  useEffect(() => {
    // Simulate incident progress
    const interval = setInterval(() => {
      setActiveIncidents(prev => prev.map(incident => {
        if (incident.progress >= 100) {
          return { ...incident, status: 'contained' as const };
        }
        const actions = ['Isolating host...', 'Blocking IPs...', 'Collecting evidence...', 'Notifying team...', 'Finalizing...'];
        return {
          ...incident,
          progress: Math.min(incident.progress + Math.random() * 15, 100),
          currentAction: actions[Math.floor((incident.progress / 100) * actions.length)]
        };
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const togglePlaybook = (id: string) => {
    setPlaybooks(prev => prev.map(p => 
      p.id === id ? { ...p, enabled: !p.enabled } : p
    ));
    toast.success('Playbook updated');
  };

  const simulateIncident = () => {
    setIsSimulating(true);
    const playbook = playbooks[Math.floor(Math.random() * playbooks.length)];
    
    const incident: ActiveIncident = {
      id: `sim-${Date.now()}`,
      title: `Simulated: ${playbook.name}`,
      severity: 'high',
      status: 'responding',
      playbook: playbook.name,
      progress: 0,
      currentAction: 'Starting simulation...',
      startTime: new Date().toISOString(),
      affectedAssets: 3
    };

    setActiveIncidents(prev => [incident, ...prev]);
    toast.info('Incident simulation started');
    
    setTimeout(() => setIsSimulating(false), 2000);
  };

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'block_ip': return <Ban className="h-4 w-4" />;
      case 'isolate_host': return <Network className="h-4 w-4" />;
      case 'disable_user': return <Lock className="h-4 w-4" />;
      case 'notify': return <Mail className="h-4 w-4" />;
      case 'quarantine': return <FileWarning className="h-4 w-4" />;
      case 'collect_evidence': return <Database className="h-4 w-4" />;
      case 'escalate': return <MessageSquare className="h-4 w-4" />;
      default: return <Zap className="h-4 w-4" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/50';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'investigating': return 'bg-blue-500/20 text-blue-400';
      case 'responding': return 'bg-yellow-500/20 text-yellow-400';
      case 'contained': return 'bg-green-500/20 text-green-400';
      case 'resolved': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Zap className="h-6 w-6 text-primary" />
            Automated Incident Response (SOAR)
          </h2>
          <p className="text-muted-foreground">Orchestrated playbooks for rapid threat containment</p>
        </div>
        <Button onClick={simulateIncident} disabled={isSimulating}>
          {isSimulating ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <Play className="h-4 w-4 mr-2" />}
          Simulate Incident
        </Button>
      </div>

      {/* Active Incidents */}
      {activeIncidents.length > 0 && (
        <Card className="bg-card/50 border-border">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-400 animate-pulse" />
              Active Incident Responses ({activeIncidents.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeIncidents.map((incident) => (
              <div key={incident.id} className="p-4 bg-background/50 rounded-lg border border-border">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Badge className={getSeverityColor(incident.severity)}>
                      {incident.severity.toUpperCase()}
                    </Badge>
                    <span className="font-semibold">{incident.title}</span>
                    <Badge className={getStatusColor(incident.status)}>
                      {incident.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {incident.affectedAssets} assets affected
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{incident.currentAction}</span>
                    <span>{Math.round(incident.progress)}%</span>
                  </div>
                  <Progress value={incident.progress} className="h-2" />
                </div>
                
                <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  Started {new Date(incident.startTime).toLocaleTimeString()}
                  <span className="mx-2">•</span>
                  Playbook: {incident.playbook}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Playbooks */}
      <div className="grid gap-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          Response Playbooks
        </h3>
        
        {playbooks.map((playbook) => (
          <Card key={playbook.id} className="bg-card/50 border-border hover:border-primary/50 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-semibold text-foreground">{playbook.name}</h4>
                    <Badge variant={playbook.enabled ? 'default' : 'secondary'}>
                      {playbook.enabled ? 'Active' : 'Disabled'}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{playbook.description}</p>
                  <div className="text-xs text-primary/80 bg-primary/10 px-2 py-1 rounded inline-block">
                    Trigger: {playbook.trigger}
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-3">
                    {playbook.actions.map((action) => (
                      <div key={action.id} className="flex items-center gap-1 text-xs bg-background/50 px-2 py-1 rounded border border-border">
                        {getActionIcon(action.type)}
                        {action.name}
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                    <span>{playbook.executions} executions</span>
                    <span>Avg. time: {playbook.avgTime}</span>
                    {playbook.lastRun && (
                      <span>Last run: {new Date(playbook.lastRun).toLocaleString()}</span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Switch
                    checked={playbook.enabled}
                    onCheckedChange={() => togglePlaybook(playbook.id)}
                  />
                  <Button variant="ghost" size="icon">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
