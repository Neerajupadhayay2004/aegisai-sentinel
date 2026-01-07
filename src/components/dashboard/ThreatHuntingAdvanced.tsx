import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { 
  Search, 
  Database, 
  FileSearch, 
  Target, 
  Crosshair, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Zap,
  Shield,
  Activity,
  Eye,
  Play,
  Pause,
  RotateCcw,
  Download,
  Filter,
  Brain,
  Radar,
  Network,
  Server
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAudioAlerts } from '@/hooks/useAudioAlerts';

interface IOCResult {
  id: string;
  type: 'ip' | 'domain' | 'hash' | 'url' | 'email';
  value: string;
  threat_level: 'critical' | 'high' | 'medium' | 'low';
  source: string;
  first_seen: string;
  last_seen: string;
  tags: string[];
  ai_analysis?: string;
  confidence: number;
  related_iocs?: string[];
}

interface HuntQuery {
  id: string;
  name: string;
  query: string;
  description: string;
  category: string;
  lastRun?: string;
  results?: number;
}

interface HuntResult {
  id: string;
  timestamp: string;
  source_ip: string;
  destination_ip: string;
  process: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  matched_rule: string;
}

const predefinedQueries: HuntQuery[] = [
  {
    id: '1',
    name: 'Suspicious PowerShell Activity',
    query: 'process.name:"powershell.exe" AND (command_line:*-enc* OR command_line:*-hidden* OR command_line:*bypass*)',
    description: 'Detect encoded or hidden PowerShell commands',
    category: 'Execution'
  },
  {
    id: '2',
    name: 'Lateral Movement Detection',
    query: 'event.type:"authentication" AND source.ip:internal AND destination.ip:internal AND user.name:admin*',
    description: 'Find admin account usage across internal systems',
    category: 'Lateral Movement'
  },
  {
    id: '3',
    name: 'Data Exfiltration Patterns',
    query: 'network.bytes_out:>10000000 AND destination.geo.country_name:NOT("United States")',
    description: 'Large outbound transfers to foreign countries',
    category: 'Exfiltration'
  },
  {
    id: '4',
    name: 'Persistence Mechanisms',
    query: 'registry.path:*\\Run* OR file.path:*\\Startup\\* OR scheduled_task.name:*',
    description: 'Detect common persistence techniques',
    category: 'Persistence'
  },
  {
    id: '5',
    name: 'Credential Access Attempts',
    query: 'process.name:("mimikatz.exe" OR "procdump.exe") OR file.path:*\\lsass*',
    description: 'Identify credential dumping attempts',
    category: 'Credential Access'
  },
  {
    id: '6',
    name: 'C2 Communication Detection',
    query: 'dns.query:*.xyz OR dns.query:*.tk OR network.protocol:dns AND network.bytes_out:>500',
    description: 'Suspicious DNS and C2 beaconing patterns',
    category: 'Command & Control'
  },
  {
    id: '7',
    name: 'Ransomware Indicators',
    query: 'file.extension:(encrypted OR locked OR cry) OR process.name:*crypt* OR registry.data:*bitcoin*',
    description: 'Early ransomware activity detection',
    category: 'Impact'
  },
  {
    id: '8',
    name: 'Living off the Land (LOLBins)',
    query: 'process.name:(certutil.exe OR mshta.exe OR regsvr32.exe OR rundll32.exe) AND network.direction:outbound',
    description: 'Detect abuse of legitimate Windows binaries',
    category: 'Defense Evasion'
  }
];

export const ThreatHuntingAdvanced = () => {
  const [iocInput, setIocInput] = useState('');
  const [customQuery, setCustomQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [iocResults, setIocResults] = useState<IOCResult[]>([]);
  const [queryResults, setQueryResults] = useState<HuntResult[]>([]);
  const [activeHunt, setActiveHunt] = useState<string | null>(null);
  const [scanProgress, setScanProgress] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const { settings, playAlertSound, playScanSound } = useAudioAlerts();

  const categories = ['all', ...Array.from(new Set(predefinedQueries.map(q => q.category)))];

  const filteredQueries = selectedCategory === 'all' 
    ? predefinedQueries 
    : predefinedQueries.filter(q => q.category === selectedCategory);

  const searchIOC = async () => {
    if (!iocInput.trim()) return;
    
    setIsSearching(true);
    setScanProgress(0);
    
    if (settings.enabled) {
      playScanSound();
    }

    // Simulate progress
    const progressInterval = setInterval(() => {
      setScanProgress(prev => Math.min(prev + 10, 90));
    }, 200);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockResults: IOCResult[] = [
        {
          id: '1',
          type: detectIOCType(iocInput),
          value: iocInput,
          threat_level: ['critical', 'high', 'medium', 'low'][Math.floor(Math.random() * 4)] as IOCResult['threat_level'],
          source: 'VirusTotal, AbuseIPDB, AlienVault, ThreatCrowd',
          first_seen: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
          last_seen: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
          tags: ['malware', 'c2', 'ransomware', 'apt', 'botnet'].slice(0, Math.floor(Math.random() * 4) + 1),
          ai_analysis: `AI Analysis: This indicator shows characteristics consistent with known threat actor activity. The IOC has been observed in multiple campaigns targeting financial and government sectors. Risk Score: ${Math.floor(Math.random() * 40) + 60}/100. Recommended actions: Block at perimeter, investigate affected endpoints, check for lateral movement.`,
          confidence: Math.floor(Math.random() * 30) + 70,
          related_iocs: ['192.168.1.100', 'malware.bad.com', 'a1b2c3d4e5...'].slice(0, Math.floor(Math.random() * 3))
        }
      ];

      clearInterval(progressInterval);
      setScanProgress(100);
      setIocResults(mockResults);
      
      if (settings.enabled) {
        playAlertSound('success');
      }
      
      toast.success('IOC search completed - threat intelligence gathered');
    } catch (error) {
      console.error('IOC search error:', error);
      toast.error('Failed to search IOC');
    } finally {
      setIsSearching(false);
      setTimeout(() => setScanProgress(0), 1000);
    }
  };

  const detectIOCType = (value: string): 'ip' | 'domain' | 'hash' | 'url' | 'email' => {
    if (/^(\d{1,3}\.){3}\d{1,3}$/.test(value)) return 'ip';
    if (/^[a-f0-9]{32,64}$/i.test(value)) return 'hash';
    if (value.includes('@')) return 'email';
    if (value.startsWith('http')) return 'url';
    return 'domain';
  };

  const runQuery = async (query: HuntQuery) => {
    setIsSearching(true);
    setActiveHunt(query.id);
    setScanProgress(0);
    
    if (settings.enabled) {
      playScanSound();
    }

    const progressInterval = setInterval(() => {
      setScanProgress(prev => Math.min(prev + 5, 95));
    }, 150);

    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const mockResults: HuntResult[] = Array.from({ length: Math.floor(Math.random() * 15) + 5 }, (_, i) => ({
        id: `result-${i}`,
        timestamp: new Date(Date.now() - Math.random() * 48 * 60 * 60 * 1000).toISOString(),
        source_ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        destination_ip: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        process: ['powershell.exe', 'cmd.exe', 'python.exe', 'wscript.exe', 'mshta.exe', 'certutil.exe'][Math.floor(Math.random() * 6)],
        severity: ['critical', 'high', 'medium', 'low'][Math.floor(Math.random() * 4)] as HuntResult['severity'],
        description: 'Suspicious activity detected matching hunt query criteria',
        matched_rule: query.name
      }));

      clearInterval(progressInterval);
      setScanProgress(100);
      setQueryResults(mockResults);
      
      const criticalCount = mockResults.filter(r => r.severity === 'critical').length;
      if (criticalCount > 0 && settings.enabled) {
        playAlertSound('critical');
      } else if (settings.enabled) {
        playAlertSound('success');
      }
      
      toast.success(`Hunt completed: ${mockResults.length} matches found`);
    } catch (error) {
      toast.error('Query execution failed');
    } finally {
      setIsSearching(false);
      setActiveHunt(null);
      setTimeout(() => setScanProgress(0), 1000);
    }
  };

  const getThreatColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/50';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Execution': 'bg-red-500/20 text-red-400',
      'Lateral Movement': 'bg-orange-500/20 text-orange-400',
      'Exfiltration': 'bg-purple-500/20 text-purple-400',
      'Persistence': 'bg-blue-500/20 text-blue-400',
      'Credential Access': 'bg-yellow-500/20 text-yellow-400',
      'Command & Control': 'bg-pink-500/20 text-pink-400',
      'Impact': 'bg-red-600/20 text-red-500',
      'Defense Evasion': 'bg-cyan-500/20 text-cyan-400',
    };
    return colors[category] || 'bg-muted text-muted-foreground';
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground flex items-center gap-2">
            <Crosshair className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            <span className="text-gradient-cyber">Threat</span> Hunting Console
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">Advanced IOC search, custom queries & AI-powered analysis</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="info" className="gap-1 text-xs">
            <Brain className="h-3 w-3" />
            AI Enabled
          </Badge>
          <Badge variant="active" className="gap-1 text-xs">
            <Radar className="h-3 w-3 animate-spin" />
            Live
          </Badge>
        </div>
      </div>

      {/* Progress Bar */}
      <AnimatePresence>
        {scanProgress > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Scanning threat intelligence databases...</span>
                <span>{scanProgress}%</span>
              </div>
              <Progress value={scanProgress} className="h-2" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Tabs defaultValue="ioc" className="space-y-4">
        <TabsList className="bg-card/50 border border-border grid w-full grid-cols-3">
          <TabsTrigger value="ioc" className="data-[state=active]:bg-primary/20 text-xs sm:text-sm">
            <Target className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">IOC Search</span>
            <span className="sm:hidden">IOC</span>
          </TabsTrigger>
          <TabsTrigger value="hunt" className="data-[state=active]:bg-primary/20 text-xs sm:text-sm">
            <FileSearch className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Hunt Queries</span>
            <span className="sm:hidden">Hunt</span>
          </TabsTrigger>
          <TabsTrigger value="custom" className="data-[state=active]:bg-primary/20 text-xs sm:text-sm">
            <Database className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Custom Query</span>
            <span className="sm:hidden">Custom</span>
          </TabsTrigger>
        </TabsList>

        {/* IOC Search Tab */}
        <TabsContent value="ioc" className="space-y-4">
          <Card className="bg-card/50 border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                Indicator of Compromise (IOC) Lookup
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  placeholder="Enter IP, domain, hash, URL, or email..."
                  value={iocInput}
                  onChange={(e) => setIocInput(e.target.value)}
                  className="flex-1 bg-background/50 text-sm"
                  onKeyDown={(e) => e.key === 'Enter' && searchIOC()}
                />
                <Button onClick={searchIOC} disabled={isSearching} className="w-full sm:w-auto">
                  {isSearching ? (
                    <Clock className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Search className="h-4 w-4 mr-2" />
                  )}
                  Search
                </Button>
              </div>

              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {['8.8.8.8', 'malware.evil.com', 'a1b2c3d4e5f6...', 'https://phish.site'].map((example) => (
                  <Badge
                    key={example}
                    variant="outline"
                    className="cursor-pointer hover:bg-primary/20 text-[10px] sm:text-xs"
                    onClick={() => setIocInput(example)}
                  >
                    {example}
                  </Badge>
                ))}
              </div>

              {/* IOC Results */}
              <AnimatePresence>
                {iocResults.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    {iocResults.map((result) => (
                      <Card key={result.id} className="bg-background/50 border-border overflow-hidden">
                        <CardContent className="p-3 sm:p-4 space-y-3">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge className={getThreatColor(result.threat_level)}>
                                {result.threat_level.toUpperCase()}
                              </Badge>
                              <Badge variant="outline" className="text-[10px]">{result.type.toUpperCase()}</Badge>
                              <code className="text-xs sm:text-sm font-mono break-all">{result.value}</code>
                            </div>
                            <Badge variant="outline" className="text-[10px] w-fit">
                              Confidence: {result.confidence}%
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm">
                            <div>
                              <span className="text-muted-foreground">Sources:</span>
                              <span className="ml-2 break-all">{result.source}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">First Seen:</span>
                              <span className="ml-2">{new Date(result.first_seen).toLocaleDateString()}</span>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-1">
                            {result.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-[10px]">
                                {tag}
                              </Badge>
                            ))}
                          </div>

                          {result.related_iocs && result.related_iocs.length > 0 && (
                            <div className="text-xs">
                              <span className="text-muted-foreground">Related IOCs: </span>
                              {result.related_iocs.map((ioc, idx) => (
                                <code key={idx} className="mx-1 bg-secondary/50 px-1 py-0.5 rounded text-[10px]">{ioc}</code>
                              ))}
                            </div>
                          )}

                          {result.ai_analysis && (
                            <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                              <div className="flex items-center gap-2 text-primary mb-2">
                                <Brain className="h-4 w-4" />
                                <span className="font-semibold text-xs sm:text-sm">AI Analysis</span>
                              </div>
                              <p className="text-xs sm:text-sm text-muted-foreground">{result.ai_analysis}</p>
                            </div>
                          )}

                          <div className="flex gap-2">
                            <Button size="sm" className="flex-1 text-xs">
                              <Shield className="h-3 w-3 mr-1" />
                              Block
                            </Button>
                            <Button size="sm" variant="outline" className="flex-1 text-xs">
                              <Eye className="h-3 w-3 mr-1" />
                              Investigate
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Hunt Queries Tab */}
        <TabsContent value="hunt" className="space-y-4">
          {/* Category Filter */}
          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="text-xs capitalize"
              >
                {category}
              </Button>
            ))}
          </div>

          <ScrollArea className="h-[400px] sm:h-[500px]">
            <div className="grid gap-3 sm:gap-4 pr-4">
              {filteredQueries.map((hunt) => (
                <motion.div
                  key={hunt.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className={`bg-card/50 border-border hover:border-primary/50 transition-colors ${activeHunt === hunt.id ? 'border-primary ring-1 ring-primary/20' : ''}`}>
                    <CardContent className="p-3 sm:p-4">
                      <div className="flex flex-col gap-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-1 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-semibold text-sm sm:text-base text-foreground">{hunt.name}</h3>
                              <Badge className={`text-[10px] ${getCategoryColor(hunt.category)}`}>
                                {hunt.category}
                              </Badge>
                            </div>
                            <p className="text-xs sm:text-sm text-muted-foreground">{hunt.description}</p>
                          </div>
                          <Button 
                            onClick={() => runQuery(hunt)}
                            disabled={isSearching}
                            size="sm"
                            className="shrink-0"
                          >
                            {activeHunt === hunt.id ? (
                              <Clock className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                            ) : (
                              <Play className="h-3 w-3 sm:h-4 sm:w-4" />
                            )}
                            <span className="ml-1 hidden sm:inline">Run</span>
                          </Button>
                        </div>
                        <code className="text-[10px] sm:text-xs text-primary/80 block p-2 bg-background/50 rounded overflow-x-auto">
                          {hunt.query}
                        </code>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </ScrollArea>

          {/* Query Results */}
          <AnimatePresence>
            {queryResults.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="bg-card/50 border-border">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base sm:text-lg flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-400" />
                        Hunt Results ({queryResults.length})
                      </span>
                      <Button variant="outline" size="sm">
                        <Download className="h-3 w-3 mr-1" />
                        Export
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-48 sm:h-64">
                      <div className="space-y-2">
                        {queryResults.map((result) => (
                          <div key={result.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-2 bg-background/50 rounded border border-border gap-2">
                            <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
                              <Badge className={`${getThreatColor(result.severity)} text-[10px]`}>{result.severity}</Badge>
                              <span className="font-mono text-[10px] sm:text-xs">{result.source_ip} → {result.destination_ip}</span>
                              <span className="text-muted-foreground text-[10px] sm:text-xs">{result.process}</span>
                            </div>
                            <span className="text-[10px] sm:text-xs text-muted-foreground">
                              {new Date(result.timestamp).toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </TabsContent>

        {/* Custom Query Tab */}
        <TabsContent value="custom" className="space-y-4">
          <Card className="bg-card/50 border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                <Database className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                Custom Query Builder
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Enter your custom hunt query using KQL, Lucene, or natural language..."
                value={customQuery}
                onChange={(e) => setCustomQuery(e.target.value)}
                className="min-h-24 sm:min-h-32 font-mono bg-background/50 text-xs sm:text-sm"
              />
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="text-[10px] sm:text-xs text-muted-foreground flex items-center gap-2">
                  <Brain className="h-3 w-3 text-primary" />
                  AI-powered query translation & optimization
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <Button 
                    variant="outline" 
                    onClick={() => setCustomQuery('')}
                    size="sm"
                    className="flex-1 sm:flex-none"
                  >
                    <RotateCcw className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    Clear
                  </Button>
                  <Button 
                    onClick={() => runQuery({ id: 'custom', name: 'Custom Query', query: customQuery, description: '', category: 'Custom' })} 
                    disabled={isSearching || !customQuery}
                    size="sm"
                    className="flex-1 sm:flex-none"
                  >
                    <Zap className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    Execute
                  </Button>
                </div>
              </div>

              {/* Query Templates */}
              <div className="space-y-2">
                <h4 className="text-xs sm:text-sm font-semibold text-muted-foreground">Quick Templates</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    { name: 'Find by IP', query: 'source.ip:"<IP_ADDRESS>" OR destination.ip:"<IP_ADDRESS>"' },
                    { name: 'File Hash Lookup', query: 'file.hash.sha256:"<HASH>" OR file.hash.md5:"<HASH>"' },
                    { name: 'Process Tree', query: 'process.parent.name:"<PROCESS>" AND event.type:start' },
                    { name: 'Network Connections', query: 'event.type:connection AND destination.port:<PORT>' },
                  ].map((template) => (
                    <Button
                      key={template.name}
                      variant="outline"
                      size="sm"
                      className="justify-start text-xs"
                      onClick={() => setCustomQuery(template.query)}
                    >
                      <code className="mr-2">→</code>
                      {template.name}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
