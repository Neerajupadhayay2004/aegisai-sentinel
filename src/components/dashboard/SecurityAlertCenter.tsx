import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  BellRing, 
  AlertTriangle, 
  Shield, 
  X, 
  Check, 
  Filter,
  Volume2,
  VolumeX,
  ChevronDown,
  Clock,
  MapPin,
  Globe,
  Zap,
  Radio,
  Eye,
  EyeOff,
  Trash2,
  CheckCheck
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SecurityAlert {
  id: string;
  type: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  title: string;
  message: string;
  source: string | null;
  ip_address: string | null;
  is_read: boolean;
  is_acknowledged: boolean;
  created_at: string;
}

const mockAlerts: SecurityAlert[] = [
  { id: '1', type: 'APT', severity: 'critical', title: 'APT29 Campaign Detected', message: 'Advanced persistent threat group activity from Eastern Europe targeting critical infrastructure', source: 'Moscow, RU', ip_address: '185.243.xxx.xxx', is_read: false, is_acknowledged: false, created_at: new Date(Date.now() - 60000).toISOString() },
  { id: '2', type: 'Ransomware', severity: 'critical', title: 'LockBit 3.0 Signature Found', message: 'Ransomware executable detected attempting lateral movement in network segment 192.168.1.0/24', source: 'Internal', ip_address: '192.168.1.45', is_read: false, is_acknowledged: false, created_at: new Date(Date.now() - 120000).toISOString() },
  { id: '3', type: 'DDoS', severity: 'high', title: 'Volumetric DDoS Attack', message: '15Gbps UDP flood targeting web servers, mitigation engaged via Azure DDoS Protection', source: 'Multiple', ip_address: 'Distributed', is_read: false, is_acknowledged: false, created_at: new Date(Date.now() - 180000).toISOString() },
  { id: '4', type: 'Brute Force', severity: 'high', title: 'SSH Brute Force Attack', message: '2,847 failed login attempts on bastion host from Chinese IP range', source: 'Beijing, CN', ip_address: '223.5.xxx.xxx', is_read: true, is_acknowledged: false, created_at: new Date(Date.now() - 300000).toISOString() },
  { id: '5', type: 'Malware', severity: 'medium', title: 'Emotet Loader Blocked', message: 'Email attachment containing Emotet dropper quarantined by Azure Defender', source: 'Email Gateway', ip_address: 'N/A', is_read: true, is_acknowledged: true, created_at: new Date(Date.now() - 600000).toISOString() },
  { id: '6', type: 'Anomaly', severity: 'medium', title: 'Unusual Data Transfer', message: '3.2GB outbound transfer to unknown cloud storage detected from workstation WS-0047', source: 'Internal', ip_address: '192.168.2.47', is_read: true, is_acknowledged: false, created_at: new Date(Date.now() - 900000).toISOString() },
  { id: '7', type: 'Phishing', severity: 'low', title: 'Phishing Email Reported', message: 'User reported suspicious email impersonating Microsoft 365 support', source: 'User Report', ip_address: 'N/A', is_read: true, is_acknowledged: true, created_at: new Date(Date.now() - 1200000).toISOString() },
  { id: '8', type: 'Info', severity: 'info', title: 'Threat Intel Update', message: 'New IOCs added to threat intelligence feeds from Azure Sentinel', source: 'Azure Sentinel', ip_address: 'N/A', is_read: true, is_acknowledged: true, created_at: new Date(Date.now() - 1800000).toISOString() },
];

export const SecurityAlertCenter = () => {
  const [alerts, setAlerts] = useState<SecurityAlert[]>(mockAlerts);
  const [filter, setFilter] = useState<string>('all');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isExpanded, setIsExpanded] = useState(true);
  const { toast } = useToast();

  // Subscribe to realtime alerts
  useEffect(() => {
    const channel = supabase
      .channel('security-alerts')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'security_alerts' },
        (payload) => {
          const newAlert = payload.new as SecurityAlert;
          setAlerts(prev => [newAlert, ...prev]);
          
          if (soundEnabled) {
            playAlertSound(newAlert.severity);
          }
          
          toast({
            title: `🚨 ${newAlert.title}`,
            description: newAlert.message,
            variant: newAlert.severity === 'critical' ? 'destructive' : 'default',
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [soundEnabled, toast]);

  // Simulate new alerts
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const types = ['APT', 'Ransomware', 'DDoS', 'Brute Force', 'Malware', 'Anomaly'];
        const severities: SecurityAlert['severity'][] = ['critical', 'high', 'medium', 'low'];
        const severity = severities[Math.floor(Math.random() * severities.length)];
        
        const newAlert: SecurityAlert = {
          id: crypto.randomUUID(),
          type: types[Math.floor(Math.random() * types.length)],
          severity,
          title: `New ${severity.toUpperCase()} Alert`,
          message: `Automated threat detection triggered at ${new Date().toLocaleTimeString()}`,
          source: ['Moscow, RU', 'Beijing, CN', 'Tehran, IR', 'Internal'][Math.floor(Math.random() * 4)],
          ip_address: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.xxx.xxx`,
          is_read: false,
          is_acknowledged: false,
          created_at: new Date().toISOString(),
        };

        setAlerts(prev => [newAlert, ...prev.slice(0, 49)]);

        if (soundEnabled && (severity === 'critical' || severity === 'high')) {
          playAlertSound(severity);
        }
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [soundEnabled]);

  const playAlertSound = (severity: string) => {
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.frequency.value = severity === 'critical' ? 880 : severity === 'high' ? 660 : 440;
      osc.type = 'sine';
      
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch (e) {
      console.log('Audio not supported');
    }
  };

  const markAsRead = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, is_read: true } : a));
  };

  const acknowledge = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, is_acknowledged: true, is_read: true } : a));
    toast({ title: 'Alert acknowledged', description: 'The alert has been marked as acknowledged' });
  };

  const dismissAlert = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  const markAllRead = () => {
    setAlerts(prev => prev.map(a => ({ ...a, is_read: true })));
  };

  const filteredAlerts = alerts.filter(alert => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !alert.is_read;
    if (filter === 'critical') return alert.severity === 'critical';
    if (filter === 'high') return alert.severity === 'high' || alert.severity === 'critical';
    return alert.severity === filter;
  });

  const unreadCount = alerts.filter(a => !a.is_read).length;
  const criticalCount = alerts.filter(a => a.severity === 'critical' && !a.is_acknowledged).length;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-destructive';
      case 'high': return 'text-orange-400';
      case 'medium': return 'text-warning';
      case 'low': return 'text-primary';
      default: return 'text-blue-400';
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical': return 'critical';
      case 'high': return 'high';
      case 'medium': return 'medium';
      case 'low': return 'low';
      default: return 'info';
    }
  };

  const getTimeAgo = (timestamp: string) => {
    const diff = Date.now() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <Card variant="glass" className="relative overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              {criticalCount > 0 ? (
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <BellRing className="h-6 w-6 text-destructive" />
                </motion.div>
              ) : (
                <Bell className="h-6 w-6 text-primary" />
              )}
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </div>
            <div>
              <span className="text-lg font-bold">
                <span className="text-gradient-cyber">Security</span> Alert Center
              </span>
              <p className="text-xs text-muted-foreground">Real-time threat notifications</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSoundEnabled(!soundEnabled)}>
              {soundEnabled ? <Volume2 className="h-4 w-4 text-primary" /> : <VolumeX className="h-4 w-4 text-muted-foreground" />}
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={markAllRead}>
              <CheckCheck className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsExpanded(!isExpanded)}>
              <motion.div animate={{ rotate: isExpanded ? 0 : 180 }}>
                <ChevronDown className="h-4 w-4" />
              </motion.div>
            </Button>
          </div>
        </CardTitle>
      </CardHeader>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            <CardContent className="pt-0">
              {/* Stats Bar */}
              <div className="grid grid-cols-4 gap-2 mb-4 p-3 bg-secondary/30 rounded-lg">
                <div className="text-center">
                  <div className="text-lg font-bold text-destructive">{criticalCount}</div>
                  <div className="text-[10px] text-muted-foreground">Critical</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-orange-400">{alerts.filter(a => a.severity === 'high' && !a.is_acknowledged).length}</div>
                  <div className="text-[10px] text-muted-foreground">High</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-warning">{alerts.filter(a => a.severity === 'medium').length}</div>
                  <div className="text-[10px] text-muted-foreground">Medium</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-primary">{unreadCount}</div>
                  <div className="text-[10px] text-muted-foreground">Unread</div>
                </div>
              </div>

              {/* Filter Tabs */}
              <Tabs value={filter} onValueChange={setFilter} className="mb-4">
                <TabsList className="grid w-full grid-cols-5 h-8">
                  <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
                  <TabsTrigger value="unread" className="text-xs">Unread</TabsTrigger>
                  <TabsTrigger value="critical" className="text-xs">Critical</TabsTrigger>
                  <TabsTrigger value="high" className="text-xs">High+</TabsTrigger>
                  <TabsTrigger value="medium" className="text-xs">Medium</TabsTrigger>
                </TabsList>
              </Tabs>

              {/* Alerts List */}
              <ScrollArea className="h-[400px] pr-2">
                <div className="space-y-2">
                  {filteredAlerts.map((alert) => (
                    <motion.div
                      key={alert.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className={`p-3 rounded-lg border transition-all cursor-pointer ${
                        !alert.is_read 
                          ? 'bg-secondary/50 border-primary/30' 
                          : 'bg-secondary/20 border-border/30'
                      } ${alert.severity === 'critical' && !alert.is_acknowledged ? 'animate-pulse border-destructive/50' : ''}`}
                      onClick={() => markAsRead(alert.id)}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-3 flex-1">
                          <div className={`mt-0.5 ${getSeverityColor(alert.severity)}`}>
                            {alert.severity === 'critical' ? (
                              <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: Infinity }}>
                                <AlertTriangle className="h-5 w-5" />
                              </motion.div>
                            ) : (
                              <Shield className="h-5 w-5" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-semibold text-sm truncate">{alert.title}</span>
                              <Badge variant={getSeverityBadge(alert.severity) as any} className="text-[10px] h-5">
                                {alert.severity.toUpperCase()}
                              </Badge>
                              <Badge variant="outline" className="text-[10px] h-5">{alert.type}</Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{alert.message}</p>
                            <div className="flex items-center gap-3 mt-2 text-[10px] text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {getTimeAgo(alert.created_at)}
                              </span>
                              {alert.source && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {alert.source}
                                </span>
                              )}
                              {alert.ip_address && (
                                <span className="flex items-center gap-1">
                                  <Globe className="h-3 w-3" />
                                  {alert.ip_address}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          {!alert.is_acknowledged && (
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-7 w-7" 
                              onClick={(e) => { e.stopPropagation(); acknowledge(alert.id); }}
                            >
                              <Check className="h-3.5 w-3.5 text-success" />
                            </Button>
                          )}
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7" 
                            onClick={(e) => { e.stopPropagation(); dismissAlert(alert.id); }}
                          >
                            <X className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                      
                      {alert.is_acknowledged && (
                        <div className="mt-2 pt-2 border-t border-border/30">
                          <span className="text-[10px] text-success flex items-center gap-1">
                            <Check className="h-3 w-3" />
                            Acknowledged
                          </span>
                        </div>
                      )}
                    </motion.div>
                  ))}
                  
                  {filteredAlerts.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Shield className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>No alerts matching filter</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};
