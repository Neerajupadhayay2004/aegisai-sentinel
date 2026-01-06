import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Users,
  Activity,
  Zap,
  Target,
  Eye,
  Radio,
  Server,
  Database,
  Bell,
  Lock,
  Globe,
  TrendingUp,
  TrendingDown,
  Mail,
  Phone,
  MessageSquare,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  Filter,
  Search,
  MoreHorizontal,
  UserPlus,
  Send,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Timer,
  BarChart3,
  PieChart as PieChartIcon
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Interfaces
interface Incident {
  id: string;
  title: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  source: string;
  timestamp: Date;
  status: 'new' | 'assigned' | 'investigating' | 'escalated' | 'resolved';
  assignee?: string;
  description: string;
  affectedAssets: string[];
  timeline: TimelineEvent[];
  escalationLevel: number;
}

interface TimelineEvent {
  id: string;
  action: string;
  user: string;
  timestamp: Date;
  type: 'action' | 'note' | 'escalation' | 'assignment';
}

interface Analyst {
  id: string;
  name: string;
  role: string;
  avatar: string;
  status: 'available' | 'busy' | 'offline';
  activeIncidents: number;
  resolvedToday: number;
  avgResponseTime: number;
  specialization: string[];
  workload: number;
}

interface EmailNotification {
  id: string;
  recipient: string;
  subject: string;
  incidentId: string;
  sentAt: Date;
  status: 'sent' | 'delivered' | 'failed';
}

// Mock data
const mockAnalysts: Analyst[] = [
  { id: '1', name: 'John Doe', role: 'Senior SOC Analyst', avatar: 'JD', status: 'available', activeIncidents: 3, resolvedToday: 8, avgResponseTime: 12, specialization: ['Malware', 'APT'], workload: 45 },
  { id: '2', name: 'Sarah Miller', role: 'Threat Hunter', avatar: 'SM', status: 'busy', activeIncidents: 5, resolvedToday: 6, avgResponseTime: 18, specialization: ['Ransomware', 'Phishing'], workload: 78 },
  { id: '3', name: 'Mike Chen', role: 'SOC Analyst L2', avatar: 'MC', status: 'available', activeIncidents: 2, resolvedToday: 12, avgResponseTime: 8, specialization: ['Network', 'DDoS'], workload: 32 },
  { id: '4', name: 'Emily Taylor', role: 'Incident Manager', avatar: 'ET', status: 'busy', activeIncidents: 7, resolvedToday: 4, avgResponseTime: 25, specialization: ['Escalation', 'Management'], workload: 92 },
  { id: '5', name: 'Alex Kim', role: 'SOC Analyst L1', avatar: 'AK', status: 'available', activeIncidents: 1, resolvedToday: 15, avgResponseTime: 5, specialization: ['Triage', 'Alerts'], workload: 28 },
];

const mockIncidents: Incident[] = [
  {
    id: 'INC-001',
    title: 'Advanced Persistent Threat Detected',
    severity: 'critical',
    source: 'EDR',
    timestamp: new Date(Date.now() - 300000),
    status: 'investigating',
    assignee: 'John Doe',
    description: 'Suspected APT activity detected with lateral movement patterns across multiple endpoints.',
    affectedAssets: ['SRV-PROD-01', 'WS-EXEC-05', 'DB-MAIN-02'],
    escalationLevel: 2,
    timeline: [
      { id: '1', action: 'Incident created from EDR alert', user: 'System', timestamp: new Date(Date.now() - 300000), type: 'action' },
      { id: '2', action: 'Assigned to John Doe', user: 'Auto-Assignment', timestamp: new Date(Date.now() - 280000), type: 'assignment' },
      { id: '3', action: 'Initial triage completed - confirmed malicious activity', user: 'John Doe', timestamp: new Date(Date.now() - 200000), type: 'note' },
      { id: '4', action: 'Escalated to Level 2', user: 'John Doe', timestamp: new Date(Date.now() - 150000), type: 'escalation' },
    ]
  },
  {
    id: 'INC-002',
    title: 'Ransomware Encryption Attempt',
    severity: 'critical',
    source: 'AV',
    timestamp: new Date(Date.now() - 600000),
    status: 'escalated',
    assignee: 'Sarah Miller',
    description: 'Ransomware variant detected attempting to encrypt files on file server.',
    affectedAssets: ['FS-CORP-01'],
    escalationLevel: 3,
    timeline: [
      { id: '1', action: 'Ransomware detected by AV', user: 'System', timestamp: new Date(Date.now() - 600000), type: 'action' },
      { id: '2', action: 'Automatic isolation triggered', user: 'SOAR', timestamp: new Date(Date.now() - 595000), type: 'action' },
      { id: '3', action: 'Assigned to Sarah Miller', user: 'Auto-Assignment', timestamp: new Date(Date.now() - 590000), type: 'assignment' },
      { id: '4', action: 'Escalated to Level 3 - Executive notification', user: 'Sarah Miller', timestamp: new Date(Date.now() - 400000), type: 'escalation' },
    ]
  },
  {
    id: 'INC-003',
    title: 'DDoS Attack on Web Services',
    severity: 'high',
    source: 'WAF',
    timestamp: new Date(Date.now() - 900000),
    status: 'investigating',
    assignee: 'Mike Chen',
    description: 'Volumetric DDoS attack targeting public-facing web applications.',
    affectedAssets: ['WEB-PROD-01', 'WEB-PROD-02', 'LB-MAIN'],
    escalationLevel: 1,
    timeline: [
      { id: '1', action: 'DDoS attack detected', user: 'System', timestamp: new Date(Date.now() - 900000), type: 'action' },
      { id: '2', action: 'Rate limiting enabled', user: 'SOAR', timestamp: new Date(Date.now() - 895000), type: 'action' },
    ]
  },
  {
    id: 'INC-004',
    title: 'Suspicious Login Activity',
    severity: 'medium',
    source: 'SIEM',
    timestamp: new Date(Date.now() - 1200000),
    status: 'assigned',
    assignee: 'Alex Kim',
    description: 'Multiple failed login attempts followed by successful authentication from unusual location.',
    affectedAssets: ['AD-DC-01'],
    escalationLevel: 0,
    timeline: [
      { id: '1', action: 'Alert generated', user: 'System', timestamp: new Date(Date.now() - 1200000), type: 'action' },
    ]
  },
  {
    id: 'INC-005',
    title: 'Data Exfiltration Attempt',
    severity: 'critical',
    source: 'DLP',
    timestamp: new Date(Date.now() - 180000),
    status: 'new',
    description: 'Large volume of sensitive data being transferred to external storage.',
    affectedAssets: ['WS-FIN-03', 'CLOUD-STORAGE'],
    escalationLevel: 0,
    timeline: [
      { id: '1', action: 'DLP alert triggered', user: 'System', timestamp: new Date(Date.now() - 180000), type: 'action' },
    ]
  },
];

const mttrTrendData = [
  { hour: '00:00', mttr: 28, incidents: 5 },
  { hour: '04:00', mttr: 22, incidents: 3 },
  { hour: '08:00', mttr: 35, incidents: 12 },
  { hour: '12:00', mttr: 42, incidents: 18 },
  { hour: '16:00', mttr: 38, incidents: 15 },
  { hour: '20:00', mttr: 25, incidents: 8 },
];

const escalationData = [
  { name: 'Level 1', value: 45, color: 'hsl(var(--success))' },
  { name: 'Level 2', value: 30, color: 'hsl(var(--warning))' },
  { name: 'Level 3', value: 15, color: 'hsl(var(--destructive))' },
  { name: 'Executive', value: 10, color: 'hsl(var(--primary))' },
];

export const SOCDashboardAdvanced = () => {
  const [incidents, setIncidents] = useState<Incident[]>(mockIncidents);
  const [analysts] = useState<Analyst[]>(mockAnalysts);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [emailNotifications, setEmailNotifications] = useState<EmailNotification[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  const [liveStats, setLiveStats] = useState({
    activeIncidents: 23,
    resolvedToday: 47,
    avgMTTR: 32,
    escalationRate: 18,
    pendingAlerts: 156,
    analystsOnline: 4,
  });

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveStats(prev => ({
        ...prev,
        activeIncidents: Math.max(0, prev.activeIncidents + Math.floor(Math.random() * 3) - 1),
        resolvedToday: prev.resolvedToday + (Math.random() > 0.7 ? 1 : 0),
        pendingAlerts: Math.max(0, prev.pendingAlerts + Math.floor(Math.random() * 5) - 2),
        avgMTTR: Math.max(15, Math.min(60, prev.avgMTTR + Math.floor(Math.random() * 5) - 2)),
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-500/20 text-blue-400';
      case 'assigned': return 'bg-purple-500/20 text-purple-400';
      case 'investigating': return 'bg-yellow-500/20 text-yellow-400';
      case 'escalated': return 'bg-red-500/20 text-red-400';
      case 'resolved': return 'bg-green-500/20 text-green-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getAnalystStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-500';
      case 'busy': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const timeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    return `${Math.floor(seconds / 3600)}h ago`;
  };

  const handleEscalate = (incident: Incident) => {
    const updatedIncident = {
      ...incident,
      escalationLevel: incident.escalationLevel + 1,
      status: 'escalated' as const,
      timeline: [
        ...incident.timeline,
        {
          id: String(incident.timeline.length + 1),
          action: `Escalated to Level ${incident.escalationLevel + 1}`,
          user: 'Current User',
          timestamp: new Date(),
          type: 'escalation' as const,
        }
      ]
    };
    
    setIncidents(prev => prev.map(i => i.id === incident.id ? updatedIncident : i));
    setSelectedIncident(updatedIncident);
    toast.success(`Incident ${incident.id} escalated to Level ${incident.escalationLevel + 1}`);
  };

  const handleAssign = (incident: Incident, analyst: Analyst) => {
    const updatedIncident = {
      ...incident,
      assignee: analyst.name,
      status: 'assigned' as const,
      timeline: [
        ...incident.timeline,
        {
          id: String(incident.timeline.length + 1),
          action: `Assigned to ${analyst.name}`,
          user: 'Current User',
          timestamp: new Date(),
          type: 'assignment' as const,
        }
      ]
    };
    
    setIncidents(prev => prev.map(i => i.id === incident.id ? updatedIncident : i));
    setSelectedIncident(updatedIncident);
    toast.success(`Incident ${incident.id} assigned to ${analyst.name}`);
  };

  const handleSendEmailAlert = (incident: Incident, recipient: string) => {
    const newNotification: EmailNotification = {
      id: String(Date.now()),
      recipient,
      subject: `[${incident.severity.toUpperCase()}] ${incident.title}`,
      incidentId: incident.id,
      sentAt: new Date(),
      status: 'sent',
    };

    setEmailNotifications(prev => [...prev, newNotification]);
    
    // Simulate email delivery
    setTimeout(() => {
      setEmailNotifications(prev => 
        prev.map(n => n.id === newNotification.id ? { ...n, status: 'delivered' } : n)
      );
      toast.success(`Email alert sent to ${recipient}`);
    }, 1500);
  };

  const filteredIncidents = incidents.filter(incident => {
    const matchesSearch = incident.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         incident.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = severityFilter === 'all' || incident.severity === severityFilter;
    const matchesStatus = statusFilter === 'all' || incident.status === statusFilter;
    return matchesSearch && matchesSeverity && matchesStatus;
  });

  const criticalCount = incidents.filter(i => i.severity === 'critical' && i.status !== 'resolved').length;
  const newCount = incidents.filter(i => i.status === 'new').length;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-4">
        {[
          { label: 'Active Incidents', value: liveStats.activeIncidents, icon: AlertTriangle, color: 'text-red-500', borderColor: 'border-l-red-500' },
          { label: 'Resolved Today', value: liveStats.resolvedToday, icon: CheckCircle, color: 'text-green-500', borderColor: 'border-l-green-500' },
          { label: 'Avg MTTR', value: `${liveStats.avgMTTR}m`, icon: Clock, color: 'text-blue-500', borderColor: 'border-l-blue-500' },
          { label: 'Escalation Rate', value: `${liveStats.escalationRate}%`, icon: TrendingUp, color: 'text-orange-500', borderColor: 'border-l-orange-500' },
          { label: 'Pending Alerts', value: liveStats.pendingAlerts, icon: Bell, color: 'text-yellow-500', borderColor: 'border-l-yellow-500' },
          { label: 'Analysts Online', value: liveStats.analystsOnline, icon: Users, color: 'text-primary', borderColor: 'border-l-primary' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card variant="glass" className={`p-3 sm:p-4 border-l-4 ${stat.borderColor}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-lg sm:text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">{stat.label}</p>
                </div>
                <stat.icon className={`h-6 w-6 sm:h-8 sm:w-8 ${stat.color} opacity-50`} />
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="incidents" className="space-y-4">
        <TabsList className="grid w-full max-w-2xl grid-cols-4">
          <TabsTrigger value="incidents" className="gap-1 sm:gap-2 text-xs sm:text-sm">
            <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Incidents</span>
            <span className="sm:hidden">Inc</span>
          </TabsTrigger>
          <TabsTrigger value="timeline" className="gap-1 sm:gap-2 text-xs sm:text-sm">
            <Timer className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Timeline</span>
            <span className="sm:hidden">Time</span>
          </TabsTrigger>
          <TabsTrigger value="analysts" className="gap-1 sm:gap-2 text-xs sm:text-sm">
            <Users className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Analysts</span>
            <span className="sm:hidden">Team</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-1 sm:gap-2 text-xs sm:text-sm">
            <Mail className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Alerts</span>
            <span className="sm:hidden">Mail</span>
          </TabsTrigger>
        </TabsList>

        {/* Incidents Tab */}
        <TabsContent value="incidents" className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search incidents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger className="w-[120px] sm:w-[140px]">
                  <SelectValue placeholder="Severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severity</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[120px] sm:w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="assigned">Assigned</SelectItem>
                  <SelectItem value="investigating">Investigating</SelectItem>
                  <SelectItem value="escalated">Escalated</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Incidents List */}
            <Card variant="glass" className="lg:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-primary" />
                    Active Incidents
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="critical">{criticalCount} Critical</Badge>
                    <Badge variant="info">{newCount} New</Badge>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px] sm:h-[500px]">
                  <div className="space-y-2">
                    {filteredIncidents.map((incident, index) => (
                      <motion.div
                        key={incident.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`p-3 rounded-lg cursor-pointer transition-all ${
                          selectedIncident?.id === incident.id 
                            ? 'bg-primary/20 border border-primary/50' 
                            : 'bg-secondary/30 hover:bg-secondary/50'
                        }`}
                        onClick={() => setSelectedIncident(incident)}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge className={getSeverityColor(incident.severity)} variant="outline">
                                {incident.severity}
                              </Badge>
                              <span className="text-xs text-muted-foreground">{incident.id}</span>
                            </div>
                            <p className="font-medium text-sm mt-1 truncate">{incident.title}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1 flex-wrap">
                              <span>{incident.source}</span>
                              <span>•</span>
                              <span>{timeAgo(incident.timestamp)}</span>
                              {incident.assignee && (
                                <>
                                  <span>•</span>
                                  <span className="flex items-center gap-1">
                                    <Users className="h-3 w-3" />
                                    {incident.assignee}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <Badge className={getStatusColor(incident.status)}>{incident.status}</Badge>
                            {incident.escalationLevel > 0 && (
                              <Badge variant="outline" className="text-[10px]">
                                L{incident.escalationLevel}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Incident Details */}
            <Card variant="glass">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-primary" />
                  Incident Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedIncident ? (
                  <div className="space-y-4">
                    <div>
                      <Badge className={getSeverityColor(selectedIncident.severity)} variant="outline">
                        {selectedIncident.severity}
                      </Badge>
                      <h3 className="font-semibold mt-2">{selectedIncident.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{selectedIncident.id}</p>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">{selectedIncident.description}</p>
                    
                    <div>
                      <p className="text-xs font-medium mb-2">Affected Assets</p>
                      <div className="flex flex-wrap gap-1">
                        {selectedIncident.affectedAssets.map((asset, i) => (
                          <Badge key={i} variant="outline" className="text-[10px]">{asset}</Badge>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-border pt-3 space-y-2">
                      <p className="text-xs font-medium">Quick Actions</p>
                      <div className="grid grid-cols-2 gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleEscalate(selectedIncident)}
                          className="text-xs"
                        >
                          <ArrowUpRight className="h-3 w-3 mr-1" />
                          Escalate
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleSendEmailAlert(selectedIncident, 'soc-team@company.com')}
                          className="text-xs"
                        >
                          <Mail className="h-3 w-3 mr-1" />
                          Email Alert
                        </Button>
                      </div>
                      
                      <Select onValueChange={(value) => {
                        const analyst = analysts.find(a => a.id === value);
                        if (analyst) handleAssign(selectedIncident, analyst);
                      }}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Assign to analyst..." />
                        </SelectTrigger>
                        <SelectContent>
                          {analysts.filter(a => a.status !== 'offline').map(analyst => (
                            <SelectItem key={analyst.id} value={analyst.id}>
                              <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${getAnalystStatusColor(analyst.status)}`} />
                                {analyst.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="border-t border-border pt-3">
                      <p className="text-xs font-medium mb-2">Timeline</p>
                      <ScrollArea className="h-[150px]">
                        <div className="space-y-2">
                          {selectedIncident.timeline.map((event, i) => (
                            <div key={event.id} className="flex gap-2 text-xs">
                              <div className={`w-2 h-2 rounded-full mt-1.5 ${
                                event.type === 'escalation' ? 'bg-red-500' :
                                event.type === 'assignment' ? 'bg-blue-500' :
                                event.type === 'note' ? 'bg-yellow-500' : 'bg-green-500'
                              }`} />
                              <div className="flex-1">
                                <p className="text-foreground">{event.action}</p>
                                <p className="text-muted-foreground">
                                  {event.user} • {timeAgo(event.timestamp)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[400px] text-muted-foreground">
                    <Eye className="h-12 w-12 mb-4 opacity-50" />
                    <p className="text-sm">Select an incident to view details</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Timeline Tab */}
        <TabsContent value="timeline" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card variant="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Timer className="h-5 w-5 text-primary" />
                  MTTR Trend (24h)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={mttrTrendData}>
                    <defs>
                      <linearGradient id="mttrGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                    <XAxis dataKey="hour" stroke="hsl(var(--muted-foreground))" fontSize={10} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} unit="m" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }} 
                    />
                    <Area type="monotone" dataKey="mttr" stroke="hsl(var(--primary))" fill="url(#mttrGradient)" />
                    <Line type="monotone" dataKey="incidents" stroke="hsl(var(--destructive))" strokeDasharray="5 5" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card variant="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Escalation Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={escalationData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {escalationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Incident Timeline */}
          <Card variant="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Live Incident Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px]">
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
                  <div className="space-y-4">
                    {incidents
                      .flatMap(incident => 
                        incident.timeline.map(event => ({
                          ...event,
                          incidentId: incident.id,
                          severity: incident.severity,
                        }))
                      )
                      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
                      .slice(0, 20)
                      .map((event, i) => (
                        <motion.div
                          key={`${event.incidentId}-${event.id}`}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="relative pl-10"
                        >
                          <div className={`absolute left-2.5 w-3 h-3 rounded-full border-2 border-background ${
                            event.type === 'escalation' ? 'bg-red-500' :
                            event.type === 'assignment' ? 'bg-blue-500' :
                            event.type === 'note' ? 'bg-yellow-500' : 'bg-green-500'
                          }`} />
                          <div className="p-3 rounded-lg bg-secondary/30">
                            <div className="flex items-center justify-between flex-wrap gap-2">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-[10px]">{event.incidentId}</Badge>
                                <span className="text-sm font-medium">{event.action}</span>
                              </div>
                              <span className="text-xs text-muted-foreground">{timeAgo(event.timestamp)}</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">by {event.user}</p>
                          </div>
                        </motion.div>
                      ))}
                  </div>
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analysts Tab */}
        <TabsContent value="analysts" className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {analysts.map((analyst, index) => (
              <motion.div
                key={analyst.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card variant="glass" className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                        {analyst.avatar}
                      </div>
                      <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background ${getAnalystStatusColor(analyst.status)}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold truncate">{analyst.name}</h4>
                      <p className="text-xs text-muted-foreground">{analyst.role}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {analyst.specialization.map((spec, i) => (
                          <Badge key={i} variant="outline" className="text-[10px]">{spec}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 space-y-3">
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-muted-foreground">Workload</span>
                        <span className={analyst.workload > 80 ? 'text-red-500' : analyst.workload > 50 ? 'text-yellow-500' : 'text-green-500'}>
                          {analyst.workload}%
                        </span>
                      </div>
                      <Progress 
                        value={analyst.workload} 
                        className={`h-2 ${analyst.workload > 80 ? '[&>div]:bg-red-500' : analyst.workload > 50 ? '[&>div]:bg-yellow-500' : '[&>div]:bg-green-500'}`}
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="p-2 rounded bg-secondary/30">
                        <p className="text-lg font-bold text-primary">{analyst.activeIncidents}</p>
                        <p className="text-[10px] text-muted-foreground">Active</p>
                      </div>
                      <div className="p-2 rounded bg-secondary/30">
                        <p className="text-lg font-bold text-green-500">{analyst.resolvedToday}</p>
                        <p className="text-[10px] text-muted-foreground">Resolved</p>
                      </div>
                      <div className="p-2 rounded bg-secondary/30">
                        <p className="text-lg font-bold text-blue-500">{analyst.avgResponseTime}m</p>
                        <p className="text-[10px] text-muted-foreground">Avg RT</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Team Performance Summary */}
          <Card variant="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Team Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={analysts.map(a => ({ name: a.name.split(' ')[0], resolved: a.resolvedToday, active: a.activeIncidents }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={10} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }} 
                  />
                  <Bar dataKey="resolved" fill="hsl(var(--success))" name="Resolved" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="active" fill="hsl(var(--warning))" name="Active" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Email Notifications Tab */}
        <TabsContent value="notifications" className="space-y-4">
          <Card variant="glass">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-primary" />
                  Email Alert System
                </div>
                <Badge variant="info">Simulated Mode</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Email alerts are simulated locally. In production, connect an email service API.
              </p>

              {/* Quick Send */}
              <div className="p-4 rounded-lg bg-secondary/30 space-y-3">
                <h4 className="font-medium text-sm">Quick Alert Recipients</h4>
                <div className="flex flex-wrap gap-2">
                  {['soc-team@company.com', 'security-manager@company.com', 'ciso@company.com', 'it-ops@company.com'].map((email) => (
                    <Button
                      key={email}
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      onClick={() => {
                        if (selectedIncident) {
                          handleSendEmailAlert(selectedIncident, email);
                        } else {
                          toast.error('Please select an incident first');
                        }
                      }}
                    >
                      <Mail className="h-3 w-3 mr-1" />
                      {email.split('@')[0]}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Notification Log */}
              <div>
                <h4 className="font-medium text-sm mb-3">Recent Notifications</h4>
                {emailNotifications.length > 0 ? (
                  <ScrollArea className="h-[300px]">
                    <div className="space-y-2">
                      {emailNotifications.slice().reverse().map((notification) => (
                        <motion.div
                          key={notification.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="p-3 rounded-lg bg-secondary/30 flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              notification.status === 'delivered' ? 'bg-green-500/20' :
                              notification.status === 'sent' ? 'bg-blue-500/20' : 'bg-red-500/20'
                            }`}>
                              {notification.status === 'delivered' ? (
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                              ) : notification.status === 'sent' ? (
                                <Send className="h-4 w-4 text-blue-500" />
                              ) : (
                                <XCircle className="h-4 w-4 text-red-500" />
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-medium">{notification.subject}</p>
                              <p className="text-xs text-muted-foreground">
                                To: {notification.recipient} • {timeAgo(notification.sentAt)}
                              </p>
                            </div>
                          </div>
                          <Badge className={
                            notification.status === 'delivered' ? 'bg-green-500/20 text-green-400' :
                            notification.status === 'sent' ? 'bg-blue-500/20 text-blue-400' : 
                            'bg-red-500/20 text-red-400'
                          }>
                            {notification.status}
                          </Badge>
                        </motion.div>
                      ))}
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[200px] text-muted-foreground">
                    <Mail className="h-12 w-12 mb-4 opacity-50" />
                    <p className="text-sm">No notifications sent yet</p>
                    <p className="text-xs">Select an incident and send an alert</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
