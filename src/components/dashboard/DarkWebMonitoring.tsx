import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Globe, 
  Eye, 
  AlertTriangle, 
  Shield, 
  Search,
  Skull,
  Key,
  Database,
  Users,
  Clock,
  TrendingUp,
  FileWarning,
  Lock,
  Zap,
  RefreshCw,
  Filter
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';

interface DarkWebMention {
  id: string;
  type: 'credential_leak' | 'data_breach' | 'ransomware_mention' | 'exploit_sale' | 'insider_threat' | 'brand_mention';
  source: string;
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium';
  timestamp: Date;
  affectedCount: number;
  verified: boolean;
  actionTaken: boolean;
}

interface LeakedCredential {
  id: string;
  email: string;
  source: string;
  leakDate: Date;
  passwordStrength: 'weak' | 'medium' | 'strong';
  status: 'active' | 'reset' | 'disabled';
}

interface ThreatActor {
  id: string;
  name: string;
  aliases: string[];
  targetingSectors: string[];
  techniques: string[];
  riskLevel: 'critical' | 'high' | 'medium';
  lastActivity: Date;
  mentions: number;
}

const mockMentions: DarkWebMention[] = [
  {
    id: '1',
    type: 'credential_leak',
    source: 'Genesis Market',
    title: 'Employee credentials found in marketplace',
    description: '47 corporate email credentials detected being sold',
    severity: 'critical',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    affectedCount: 47,
    verified: true,
    actionTaken: false,
  },
  {
    id: '2',
    type: 'ransomware_mention',
    source: 'LockBit Forum',
    title: 'Organization mentioned as potential target',
    description: 'Threat actors discussing network reconnaissance',
    severity: 'critical',
    timestamp: new Date(Date.now() - 1000 * 60 * 120),
    affectedCount: 0,
    verified: true,
    actionTaken: true,
  },
  {
    id: '3',
    type: 'data_breach',
    source: 'BreachForums',
    title: 'Partial database dump advertised',
    description: 'Claims of 50k customer records for sale',
    severity: 'high',
    timestamp: new Date(Date.now() - 1000 * 60 * 240),
    affectedCount: 50000,
    verified: false,
    actionTaken: false,
  },
  {
    id: '4',
    type: 'exploit_sale',
    source: 'Exploit.in',
    title: 'Zero-day for software in your stack',
    description: 'RCE vulnerability affecting web framework',
    severity: 'high',
    timestamp: new Date(Date.now() - 1000 * 60 * 360),
    affectedCount: 0,
    verified: true,
    actionTaken: true,
  },
  {
    id: '5',
    type: 'brand_mention',
    source: 'Telegram Channel',
    title: 'Company mentioned in threat actor chat',
    description: 'Discussion about potential social engineering targets',
    severity: 'medium',
    timestamp: new Date(Date.now() - 1000 * 60 * 480),
    affectedCount: 0,
    verified: false,
    actionTaken: false,
  },
];

const mockCredentials: LeakedCredential[] = [
  { id: '1', email: 'john.doe@company.com', source: 'LinkedIn Breach 2023', leakDate: new Date(Date.now() - 86400000 * 30), passwordStrength: 'weak', status: 'reset' },
  { id: '2', email: 'admin@company.com', source: 'Genesis Market', leakDate: new Date(Date.now() - 86400000 * 2), passwordStrength: 'medium', status: 'active' },
  { id: '3', email: 'finance@company.com', source: 'Russian Market', leakDate: new Date(Date.now() - 86400000 * 5), passwordStrength: 'strong', status: 'disabled' },
  { id: '4', email: 'hr.manager@company.com', source: 'Combo List', leakDate: new Date(Date.now() - 86400000 * 45), passwordStrength: 'weak', status: 'reset' },
  { id: '5', email: 'it.support@company.com', source: 'Stealer Logs', leakDate: new Date(Date.now() - 86400000 * 1), passwordStrength: 'medium', status: 'active' },
];

const mockThreatActors: ThreatActor[] = [
  {
    id: '1',
    name: 'LockBit 3.0',
    aliases: ['ABCD', 'LockBitSupp'],
    targetingSectors: ['Healthcare', 'Finance', 'Manufacturing'],
    techniques: ['T1486', 'T1490', 'T1027'],
    riskLevel: 'critical',
    lastActivity: new Date(Date.now() - 86400000 * 2),
    mentions: 127,
  },
  {
    id: '2',
    name: 'APT29',
    aliases: ['Cozy Bear', 'The Dukes'],
    targetingSectors: ['Government', 'Energy', 'Technology'],
    techniques: ['T1566', 'T1055', 'T1071'],
    riskLevel: 'critical',
    lastActivity: new Date(Date.now() - 86400000 * 7),
    mentions: 89,
  },
  {
    id: '3',
    name: 'FIN7',
    aliases: ['Carbanak', 'Navigator'],
    targetingSectors: ['Retail', 'Hospitality', 'Finance'],
    techniques: ['T1059', 'T1003', 'T1560'],
    riskLevel: 'high',
    lastActivity: new Date(Date.now() - 86400000 * 14),
    mentions: 56,
  },
];

export const DarkWebMonitoring = () => {
  const [mentions, setMentions] = useState<DarkWebMention[]>(mockMentions);
  const [credentials, setCredentials] = useState<LeakedCredential[]>(mockCredentials);
  const [actors, setActors] = useState<ThreatActor[]>(mockThreatActors);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [lastScan, setLastScan] = useState(new Date());

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'credential_leak': return <Key className="h-4 w-4" />;
      case 'data_breach': return <Database className="h-4 w-4" />;
      case 'ransomware_mention': return <Skull className="h-4 w-4" />;
      case 'exploit_sale': return <FileWarning className="h-4 w-4" />;
      case 'insider_threat': return <Users className="h-4 w-4" />;
      default: return <Globe className="h-4 w-4" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-500 bg-red-500/10 border-red-500/30';
      case 'high': return 'text-orange-500 bg-orange-500/10 border-orange-500/30';
      case 'medium': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30';
      default: return 'text-gray-500 bg-gray-500/10 border-gray-500/30';
    }
  };

  const handleScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          setLastScan(new Date());
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 500);
  };

  const handleTakeAction = (id: string) => {
    setMentions(prev => prev.map(m => 
      m.id === id ? { ...m, actionTaken: true } : m
    ));
  };

  const timeAgo = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  const criticalCount = mentions.filter(m => m.severity === 'critical').length;
  const unresolvedCount = mentions.filter(m => !m.actionTaken).length;
  const activeCredentials = credentials.filter(c => c.status === 'active').length;

  return (
    <Card variant="glass" className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Eye className="h-6 w-6 text-purple-400" />
              <div className="absolute inset-0 bg-purple-400/40 blur-lg rounded-full" />
            </div>
            <div>
              <span className="text-lg font-bold">Dark Web Monitoring</span>
              <p className="text-xs text-muted-foreground">Real-time threat intelligence from underground sources</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              <Clock className="h-3 w-3 mr-1" />
              Last scan: {timeAgo(lastScan)}
            </Badge>
            <Button size="sm" onClick={handleScan} disabled={isScanning}>
              <RefreshCw className={`h-4 w-4 mr-1 ${isScanning ? 'animate-spin' : ''}`} />
              {isScanning ? 'Scanning...' : 'Scan Now'}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress bar during scan */}
        {isScanning && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="space-y-2"
          >
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Scanning dark web sources...</span>
              <span>{Math.floor(scanProgress)}%</span>
            </div>
            <Progress value={scanProgress} className="h-2" />
          </motion.div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30">
            <div className="text-2xl font-bold text-red-500">{criticalCount}</div>
            <div className="text-xs text-muted-foreground">Critical Alerts</div>
          </div>
          <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/30">
            <div className="text-2xl font-bold text-orange-500">{unresolvedCount}</div>
            <div className="text-xs text-muted-foreground">Unresolved</div>
          </div>
          <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/30">
            <div className="text-2xl font-bold text-purple-500">{activeCredentials}</div>
            <div className="text-xs text-muted-foreground">Active Leaks</div>
          </div>
          <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/30">
            <div className="text-2xl font-bold text-blue-500">{actors.length}</div>
            <div className="text-xs text-muted-foreground">Tracked Actors</div>
          </div>
        </div>

        <Tabs defaultValue="mentions" className="w-full">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="mentions" className="text-xs sm:text-sm">
              <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              Mentions
            </TabsTrigger>
            <TabsTrigger value="credentials" className="text-xs sm:text-sm">
              <Key className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              Credentials
            </TabsTrigger>
            <TabsTrigger value="actors" className="text-xs sm:text-sm">
              <Skull className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              Threat Actors
            </TabsTrigger>
          </TabsList>

          <TabsContent value="mentions" className="mt-4">
            <div className="mb-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search mentions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <ScrollArea className="h-[300px] sm:h-[400px]">
              <div className="space-y-2">
                <AnimatePresence>
                  {mentions
                    .filter(m => m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                m.description.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((mention, index) => (
                    <motion.div
                      key={mention.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.05 }}
                      className={`p-3 rounded-lg border ${getSeverityColor(mention.severity)} ${mention.actionTaken ? 'opacity-60' : ''}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-2 flex-1 min-w-0">
                          <div className={`p-1.5 rounded ${getSeverityColor(mention.severity)}`}>
                            {getTypeIcon(mention.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-medium text-sm truncate">{mention.title}</span>
                              {mention.verified && (
                                <Badge variant="outline" className="text-[10px] px-1">Verified</Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{mention.description}</p>
                            <div className="flex items-center gap-2 mt-2 flex-wrap">
                              <Badge variant="secondary" className="text-[10px]">{mention.source}</Badge>
                              <span className="text-[10px] text-muted-foreground">{timeAgo(mention.timestamp)}</span>
                              {mention.affectedCount > 0 && (
                                <span className="text-[10px] text-muted-foreground">
                                  {mention.affectedCount.toLocaleString()} affected
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        {!mention.actionTaken && (
                          <Button size="sm" variant="outline" onClick={() => handleTakeAction(mention.id)} className="shrink-0">
                            <Zap className="h-3 w-3 mr-1" />
                            Act
                          </Button>
                        )}
                        {mention.actionTaken && (
                          <Badge variant="outline" className="text-green-500 border-green-500/30 shrink-0">
                            <Shield className="h-3 w-3 mr-1" />
                            Resolved
                          </Badge>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="credentials" className="mt-4">
            <ScrollArea className="h-[300px] sm:h-[400px]">
              <div className="space-y-2">
                {credentials.map((cred, index) => (
                  <motion.div
                    key={cred.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-3 rounded-lg border border-border/50 bg-secondary/20"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <Lock className="h-4 w-4 text-muted-foreground shrink-0" />
                        <div className="min-w-0">
                          <div className="font-mono text-sm truncate">{cred.email}</div>
                          <div className="text-xs text-muted-foreground">
                            {cred.source} • {timeAgo(cred.leakDate)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Badge 
                          variant="outline" 
                          className={
                            cred.passwordStrength === 'weak' ? 'text-red-500 border-red-500/30' :
                            cred.passwordStrength === 'medium' ? 'text-yellow-500 border-yellow-500/30' :
                            'text-green-500 border-green-500/30'
                          }
                        >
                          {cred.passwordStrength}
                        </Badge>
                        <Badge 
                          variant="outline"
                          className={
                            cred.status === 'active' ? 'text-red-500 border-red-500/30' :
                            cred.status === 'reset' ? 'text-yellow-500 border-yellow-500/30' :
                            'text-green-500 border-green-500/30'
                          }
                        >
                          {cred.status}
                        </Badge>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="actors" className="mt-4">
            <ScrollArea className="h-[300px] sm:h-[400px]">
              <div className="space-y-3">
                {actors.map((actor, index) => (
                  <motion.div
                    key={actor.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`p-4 rounded-lg border ${getSeverityColor(actor.riskLevel)}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <Skull className="h-5 w-5" />
                          <span className="font-bold">{actor.name}</span>
                          <Badge variant={actor.riskLevel === 'critical' ? 'destructive' : 'outline'}>
                            {actor.riskLevel}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          AKA: {actor.aliases.join(', ')}
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {actor.targetingSectors.map(sector => (
                            <Badge key={sector} variant="secondary" className="text-[10px]">
                              {sector}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" />
                            {actor.mentions} mentions
                          </span>
                          <span>Last active: {timeAgo(actor.lastActivity)}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
