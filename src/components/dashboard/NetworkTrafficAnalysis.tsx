import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Network, Activity, ArrowUpDown, AlertTriangle, Shield, 
  Wifi, Server, Database, Globe, TrendingUp, Zap,
  ArrowUp, ArrowDown, Clock
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface TrafficData {
  time: string;
  inbound: number;
  outbound: number;
  threats: number;
  blocked: number;
}

interface ConnectionData {
  id: string;
  source: string;
  destination: string;
  protocol: string;
  port: number;
  status: 'active' | 'blocked' | 'suspicious';
  bytes: number;
  duration: string;
  country: string;
}

interface ProtocolStats {
  name: string;
  percentage: number;
  color: string;
}

const generateTrafficData = (): TrafficData[] => {
  const data: TrafficData[] = [];
  const now = new Date();
  
  for (let i = 59; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 1000);
    data.push({
      time: time.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      inbound: Math.floor(Math.random() * 500 + 200),
      outbound: Math.floor(Math.random() * 400 + 150),
      threats: Math.floor(Math.random() * 20),
      blocked: Math.floor(Math.random() * 15),
    });
  }
  return data;
};

const generateConnections = (): ConnectionData[] => {
  const protocols = ['HTTPS', 'HTTP', 'SSH', 'FTP', 'DNS', 'SMTP', 'RDP', 'SMB'];
  const countries = ['USA', 'China', 'Russia', 'Germany', 'UK', 'Brazil', 'India', 'Japan'];
  const statuses: ConnectionData['status'][] = ['active', 'active', 'active', 'blocked', 'suspicious'];
  
  return Array.from({ length: 20 }, (_, i) => ({
    id: `conn-${i}`,
    source: `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`,
    destination: `10.0.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`,
    protocol: protocols[Math.floor(Math.random() * protocols.length)],
    port: [22, 80, 443, 21, 53, 25, 3389, 445][Math.floor(Math.random() * 8)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    bytes: Math.floor(Math.random() * 10000000),
    duration: `${Math.floor(Math.random() * 60)}m ${Math.floor(Math.random() * 60)}s`,
    country: countries[Math.floor(Math.random() * countries.length)],
  }));
};

const protocolStats: ProtocolStats[] = [
  { name: 'HTTPS', percentage: 68, color: '#22c55e' },
  { name: 'HTTP', percentage: 12, color: '#eab308' },
  { name: 'DNS', percentage: 8, color: '#3b82f6' },
  { name: 'SSH', percentage: 5, color: '#8b5cf6' },
  { name: 'Other', percentage: 7, color: '#6b7280' },
];

export const NetworkTrafficAnalysis: React.FC = () => {
  const [trafficData, setTrafficData] = useState<TrafficData[]>(generateTrafficData());
  const [connections, setConnections] = useState<ConnectionData[]>(generateConnections());
  const [stats, setStats] = useState({
    totalBandwidth: 2.4,
    packetsPerSecond: 45678,
    activeConnections: 1247,
    threatsDetected: 23,
    bytesIn: 1.2,
    bytesOut: 0.8,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTrafficData(prev => {
        const newData = [...prev.slice(1), {
          time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          inbound: Math.floor(Math.random() * 500 + 200),
          outbound: Math.floor(Math.random() * 400 + 150),
          threats: Math.floor(Math.random() * 20),
          blocked: Math.floor(Math.random() * 15),
        }];
        return newData;
      });

      setStats(prev => ({
        ...prev,
        totalBandwidth: +(Math.random() * 1 + 2).toFixed(2),
        packetsPerSecond: Math.floor(Math.random() * 10000 + 40000),
        activeConnections: Math.floor(Math.random() * 200 + 1100),
        threatsDetected: Math.floor(Math.random() * 10 + 20),
      }));
    }, 1000);

    const connInterval = setInterval(() => {
      setConnections(generateConnections());
    }, 5000);

    return () => {
      clearInterval(interval);
      clearInterval(connInterval);
    };
  }, []);

  const formatBytes = (bytes: number) => {
    if (bytes >= 1000000) return `${(bytes / 1000000).toFixed(2)} MB`;
    if (bytes >= 1000) return `${(bytes / 1000).toFixed(2)} KB`;
    return `${bytes} B`;
  };

  const getStatusColor = (status: ConnectionData['status']) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'blocked': return 'bg-red-500';
      case 'suspicious': return 'bg-yellow-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="glass-card border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-2">
              <Activity className="h-4 w-4" />
              Bandwidth
            </div>
            <div className="text-2xl font-bold text-primary">{stats.totalBandwidth} Gbps</div>
          </CardContent>
        </Card>
        
        <Card className="glass-card border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-2">
              <Zap className="h-4 w-4" />
              Packets/s
            </div>
            <div className="text-2xl font-bold">{stats.packetsPerSecond.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card className="glass-card border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-2">
              <Network className="h-4 w-4" />
              Connections
            </div>
            <div className="text-2xl font-bold">{stats.activeConnections.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card className="glass-card border-destructive/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-2">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              Threats
            </div>
            <div className="text-2xl font-bold text-destructive">{stats.threatsDetected}</div>
          </CardContent>
        </Card>
        
        <Card className="glass-card border-green-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-2">
              <ArrowDown className="h-4 w-4 text-green-500" />
              Inbound
            </div>
            <div className="text-2xl font-bold text-green-500">{stats.bytesIn} GB/s</div>
          </CardContent>
        </Card>
        
        <Card className="glass-card border-blue-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground text-xs mb-2">
              <ArrowUp className="h-4 w-4 text-blue-500" />
              Outbound
            </div>
            <div className="text-2xl font-bold text-blue-500">{stats.bytesOut} GB/s</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Traffic Chart */}
        <Card className="glass-card border-primary/20 xl:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/20">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>Real-time Network Traffic</CardTitle>
              </div>
              <Badge variant="active" className="animate-pulse">LIVE</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trafficData}>
                  <defs>
                    <linearGradient id="inboundGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="outboundGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                  <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} interval={10} />
                  <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Area type="monotone" dataKey="inbound" stroke="#22c55e" fill="url(#inboundGradient)" strokeWidth={2} />
                  <Area type="monotone" dataKey="outbound" stroke="#3b82f6" fill="url(#outboundGradient)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-sm text-muted-foreground">Inbound</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-sm text-muted-foreground">Outbound</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Protocol Distribution */}
        <Card className="glass-card border-primary/20">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/20">
                <Server className="h-5 w-5 text-primary" />
              </div>
              <CardTitle>Protocol Distribution</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {protocolStats.map((protocol) => (
              <div key={protocol.name} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{protocol.name}</span>
                  <span className="text-muted-foreground">{protocol.percentage}%</span>
                </div>
                <div className="h-2 bg-background rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: protocol.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${protocol.percentage}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Active Connections Table */}
      <Card className="glass-card border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/20">
                <Wifi className="h-5 w-5 text-primary" />
              </div>
              <CardTitle>Active Connections</CardTitle>
            </div>
            <Badge variant="outline">{connections.length} connections</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left py-3 px-2 text-muted-foreground font-medium">Status</th>
                  <th className="text-left py-3 px-2 text-muted-foreground font-medium">Source</th>
                  <th className="text-left py-3 px-2 text-muted-foreground font-medium">Destination</th>
                  <th className="text-left py-3 px-2 text-muted-foreground font-medium">Protocol</th>
                  <th className="text-left py-3 px-2 text-muted-foreground font-medium">Port</th>
                  <th className="text-left py-3 px-2 text-muted-foreground font-medium">Country</th>
                  <th className="text-left py-3 px-2 text-muted-foreground font-medium">Data</th>
                  <th className="text-left py-3 px-2 text-muted-foreground font-medium">Duration</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence mode="popLayout">
                  {connections.slice(0, 10).map((conn) => (
                    <motion.tr
                      key={conn.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="border-b border-border/30 hover:bg-primary/5 transition-colors"
                    >
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(conn.status)}`} />
                          <span className="capitalize text-xs">{conn.status}</span>
                        </div>
                      </td>
                      <td className="py-3 px-2 font-mono text-xs">{conn.source}</td>
                      <td className="py-3 px-2 font-mono text-xs">{conn.destination}</td>
                      <td className="py-3 px-2">
                        <Badge variant="outline" className="text-xs">{conn.protocol}</Badge>
                      </td>
                      <td className="py-3 px-2 font-mono text-xs">{conn.port}</td>
                      <td className="py-3 px-2 text-xs">{conn.country}</td>
                      <td className="py-3 px-2 text-xs text-muted-foreground">{formatBytes(conn.bytes)}</td>
                      <td className="py-3 px-2 text-xs text-muted-foreground">{conn.duration}</td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
