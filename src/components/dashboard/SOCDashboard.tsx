import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
  Cpu,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Bell,
  FileWarning,
  Lock,
  Unlock,
  Network,
  Globe
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';

interface Alert {
  id: string;
  title: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  source: string;
  timestamp: Date;
  status: 'new' | 'investigating' | 'resolved';
  assignee?: string;
}

const mockAlerts: Alert[] = [
  { id: '1', title: 'Brute Force Attack Detected', severity: 'critical', source: 'WAF', timestamp: new Date(Date.now() - 120000), status: 'investigating', assignee: 'John D.' },
  { id: '2', title: 'Suspicious PowerShell Execution', severity: 'high', source: 'EDR', timestamp: new Date(Date.now() - 300000), status: 'new' },
  { id: '3', title: 'Data Exfiltration Attempt', severity: 'critical', source: 'DLP', timestamp: new Date(Date.now() - 600000), status: 'investigating', assignee: 'Sarah M.' },
  { id: '4', title: 'Malware Detected on Endpoint', severity: 'high', source: 'AV', timestamp: new Date(Date.now() - 900000), status: 'resolved', assignee: 'Mike R.' },
  { id: '5', title: 'Unauthorized Access Attempt', severity: 'medium', source: 'IAM', timestamp: new Date(Date.now() - 1800000), status: 'new' },
  { id: '6', title: 'DDoS Attack in Progress', severity: 'critical', source: 'Firewall', timestamp: new Date(Date.now() - 60000), status: 'investigating', assignee: 'Alex K.' },
  { id: '7', title: 'SQL Injection Attempt', severity: 'high', source: 'WAF', timestamp: new Date(Date.now() - 450000), status: 'new' },
  { id: '8', title: 'Phishing Email Campaign', severity: 'medium', source: 'Email Gateway', timestamp: new Date(Date.now() - 2400000), status: 'resolved', assignee: 'Emily T.' },
];

const threatTrendData = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i}:00`,
  threats: Math.floor(Math.random() * 50) + 10,
  blocked: Math.floor(Math.random() * 45) + 8,
  alerts: Math.floor(Math.random() * 20) + 5,
}));

const sourceDistribution = [
  { name: 'Firewall', value: 35, color: '#ef4444' },
  { name: 'EDR', value: 25, color: '#f97316' },
  { name: 'WAF', value: 20, color: '#eab308' },
  { name: 'SIEM', value: 12, color: '#22c55e' },
  { name: 'Other', value: 8, color: '#6366f1' },
];

const mttrData = [
  { day: 'Mon', mttr: 45 },
  { day: 'Tue', mttr: 38 },
  { day: 'Wed', mttr: 52 },
  { day: 'Thu', mttr: 41 },
  { day: 'Fri', mttr: 35 },
  { day: 'Sat', mttr: 28 },
  { day: 'Sun', mttr: 31 },
];

export const SOCDashboard = () => {
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [liveStats, setLiveStats] = useState({
    activeThreats: 47,
    blockedToday: 1823,
    alertsQueue: 23,
    mttr: 42,
    uptime: 99.97,
    eventsPerSecond: 2847,
  });

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveStats(prev => ({
        ...prev,
        activeThreats: prev.activeThreats + Math.floor(Math.random() * 3) - 1,
        blockedToday: prev.blockedToday + Math.floor(Math.random() * 5),
        eventsPerSecond: Math.floor(Math.random() * 1000) + 2000,
      }));
    }, 2000);

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
      case 'investigating': return 'bg-yellow-500/20 text-yellow-400';
      case 'resolved': return 'bg-green-500/20 text-green-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const timeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    return `${Math.floor(seconds / 3600)}h ago`;
  };

  const criticalAlerts = alerts.filter(a => a.severity === 'critical' && a.status !== 'resolved').length;
  const newAlerts = alerts.filter(a => a.status === 'new').length;
  const investigatingAlerts = alerts.filter(a => a.status === 'investigating').length;

  return (
    <div className="space-y-6">
      {/* Top Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card variant="glass" className="p-4 border-l-4 border-l-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-red-500">{liveStats.activeThreats}</p>
                <p className="text-xs text-muted-foreground">Active Threats</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500/50" />
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Card variant="glass" className="p-4 border-l-4 border-l-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-green-500">{liveStats.blockedToday.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Blocked Today</p>
              </div>
              <Shield className="h-8 w-8 text-green-500/50" />
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card variant="glass" className="p-4 border-l-4 border-l-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-yellow-500">{liveStats.alertsQueue}</p>
                <p className="text-xs text-muted-foreground">Alerts Queue</p>
              </div>
              <Bell className="h-8 w-8 text-yellow-500/50" />
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Card variant="glass" className="p-4 border-l-4 border-l-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-blue-500">{liveStats.mttr}m</p>
                <p className="text-xs text-muted-foreground">Avg MTTR</p>
              </div>
              <Clock className="h-8 w-8 text-blue-500/50" />
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card variant="glass" className="p-4 border-l-4 border-l-primary">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-primary">{liveStats.uptime}%</p>
                <p className="text-xs text-muted-foreground">System Uptime</p>
              </div>
              <Activity className="h-8 w-8 text-primary/50" />
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <Card variant="glass" className="p-4 border-l-4 border-l-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-purple-500">{liveStats.eventsPerSecond.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Events/sec</p>
              </div>
              <Zap className="h-8 w-8 text-purple-500/50" />
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Alerts Panel */}
        <Card variant="glass" className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                Active Alerts
              </div>
              <div className="flex gap-2">
                <Badge variant="critical">{criticalAlerts} Critical</Badge>
                <Badge variant="high">{newAlerts} New</Badge>
                <Badge variant="info">{investigatingAlerts} Investigating</Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="max-h-[400px] overflow-y-auto space-y-2">
            {alerts.filter(a => a.status !== 'resolved').map((alert, index) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-full min-h-[40px] rounded ${
                    alert.severity === 'critical' ? 'bg-red-500' :
                    alert.severity === 'high' ? 'bg-orange-500' :
                    alert.severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                  }`} />
                  <div>
                    <p className="font-medium text-sm">{alert.title}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{alert.source}</span>
                      <span>•</span>
                      <span>{timeAgo(alert.timestamp)}</span>
                      {alert.assignee && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {alert.assignee}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(alert.status)}>{alert.status}</Badge>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>

        {/* System Health Panel */}
        <Card variant="glass">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5 text-primary" />
              System Health
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { name: 'SIEM', status: 'healthy', load: 45, icon: Database },
              { name: 'EDR Agents', status: 'healthy', load: 32, icon: Shield },
              { name: 'Firewall', status: 'healthy', load: 67, icon: Lock },
              { name: 'WAF', status: 'warning', load: 85, icon: Globe },
              { name: 'Log Collectors', status: 'healthy', load: 51, icon: Radio },
              { name: 'Threat Intel', status: 'healthy', load: 23, icon: Target },
            ].map((system, index) => (
              <motion.div
                key={system.name}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <system.icon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{system.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-24">
                    <Progress 
                      value={system.load} 
                      className={`h-2 ${system.load > 80 ? '[&>div]:bg-red-500' : system.load > 60 ? '[&>div]:bg-yellow-500' : '[&>div]:bg-green-500'}`}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground w-10">{system.load}%</span>
                  <div className={`w-2 h-2 rounded-full ${
                    system.status === 'healthy' ? 'bg-green-500' : 
                    system.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                  }`} />
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Threat Trend Chart */}
        <Card variant="glass" className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              24h Threat Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={threatTrendData}>
                <defs>
                  <linearGradient id="threatGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="blockedGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis dataKey="hour" stroke="hsl(var(--muted-foreground))" fontSize={10} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }} 
                />
                <Area type="monotone" dataKey="threats" stroke="#ef4444" fill="url(#threatGradient)" />
                <Area type="monotone" dataKey="blocked" stroke="#22c55e" fill="url(#blockedGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Source Distribution */}
        <Card variant="glass">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Alert Sources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={sourceDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {sourceDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* MTTR Trend */}
      <Card variant="glass">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Mean Time to Respond (MTTR) - Last 7 Days
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={mttrData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} unit="m" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
                formatter={(value: number) => [`${value} minutes`, 'MTTR']}
              />
              <Bar dataKey="mttr" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Bottom Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card variant="glass" className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-green-500/20">
              <CheckCircle className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Resolved Today</p>
              <p className="text-2xl font-bold">127</p>
            </div>
          </div>
        </Card>
        <Card variant="glass" className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-blue-500/20">
              <Users className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Analysts</p>
              <p className="text-2xl font-bold">8</p>
            </div>
          </div>
        </Card>
        <Card variant="glass" className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-purple-500/20">
              <Network className="h-6 w-6 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Endpoints Monitored</p>
              <p className="text-2xl font-bold">2,847</p>
            </div>
          </div>
        </Card>
        <Card variant="glass" className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-primary/20">
              <Cpu className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Rules Active</p>
              <p className="text-2xl font-bold">1,423</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
