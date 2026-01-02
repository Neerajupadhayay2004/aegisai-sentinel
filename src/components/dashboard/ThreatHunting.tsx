import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Database, FileSearch, Target, Crosshair, AlertTriangle, CheckCircle, Clock, Zap } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
}

interface HuntQuery {
  id: string;
  name: string;
  query: string;
  description: string;
  lastRun?: string;
  results?: number;
}

const predefinedQueries: HuntQuery[] = [
  {
    id: '1',
    name: 'Suspicious PowerShell Activity',
    query: 'process.name:"powershell.exe" AND (command_line:*-enc* OR command_line:*-hidden* OR command_line:*bypass*)',
    description: 'Detect encoded or hidden PowerShell commands'
  },
  {
    id: '2',
    name: 'Lateral Movement Detection',
    query: 'event.type:"authentication" AND source.ip:internal AND destination.ip:internal AND user.name:admin*',
    description: 'Find admin account usage across internal systems'
  },
  {
    id: '3',
    name: 'Data Exfiltration Patterns',
    query: 'network.bytes_out:>10000000 AND destination.geo.country_name:NOT("United States")',
    description: 'Large outbound transfers to foreign countries'
  },
  {
    id: '4',
    name: 'Persistence Mechanisms',
    query: 'registry.path:*\\Run* OR file.path:*\\Startup\\* OR scheduled_task.name:*',
    description: 'Detect common persistence techniques'
  },
  {
    id: '5',
    name: 'Credential Access Attempts',
    query: 'process.name:("mimikatz.exe" OR "procdump.exe") OR file.path:*\\lsass*',
    description: 'Identify credential dumping attempts'
  }
];

export const ThreatHunting = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [iocInput, setIocInput] = useState('');
  const [customQuery, setCustomQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [iocResults, setIocResults] = useState<IOCResult[]>([]);
  const [queryResults, setQueryResults] = useState<any[]>([]);

  const searchIOC = async () => {
    if (!iocInput.trim()) return;
    
    setIsSearching(true);
    try {
      const { data, error } = await supabase.functions.invoke('threat-intelligence', {
        body: { 
          action: 'ioc_lookup',
          ioc: iocInput,
          type: detectIOCType(iocInput)
        }
      });

      if (error) throw error;

      // Simulate IOC results with AI analysis
      const mockResults: IOCResult[] = [
        {
          id: '1',
          type: detectIOCType(iocInput),
          value: iocInput,
          threat_level: Math.random() > 0.5 ? 'high' : 'medium',
          source: 'VirusTotal, AbuseIPDB, AlienVault',
          first_seen: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
          last_seen: new Date().toISOString(),
          tags: ['malware', 'c2', 'ransomware'].slice(0, Math.floor(Math.random() * 3) + 1),
          ai_analysis: data?.analysis || 'AI analysis indicates this IOC is associated with known threat actor APT29. Recommend immediate blocking and forensic investigation of any systems that communicated with this indicator.'
        }
      ];

      setIocResults(mockResults);
      toast.success('IOC search completed');
    } catch (error) {
      console.error('IOC search error:', error);
      toast.error('Failed to search IOC');
    } finally {
      setIsSearching(false);
    }
  };

  const detectIOCType = (value: string): 'ip' | 'domain' | 'hash' | 'url' | 'email' => {
    if (/^(\d{1,3}\.){3}\d{1,3}$/.test(value)) return 'ip';
    if (/^[a-f0-9]{32,64}$/i.test(value)) return 'hash';
    if (value.includes('@')) return 'email';
    if (value.startsWith('http')) return 'url';
    return 'domain';
  };

  const runQuery = async (query: string) => {
    setIsSearching(true);
    try {
      // Simulate query execution with AI-powered results
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockResults = Array.from({ length: Math.floor(Math.random() * 10) + 3 }, (_, i) => ({
        id: `result-${i}`,
        timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
        source_ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        destination_ip: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        process: ['powershell.exe', 'cmd.exe', 'python.exe', 'wscript.exe'][Math.floor(Math.random() * 4)],
        severity: ['critical', 'high', 'medium', 'low'][Math.floor(Math.random() * 4)],
        description: 'Suspicious activity detected matching hunt query criteria'
      }));

      setQueryResults(mockResults);
      toast.success(`Query returned ${mockResults.length} results`);
    } catch (error) {
      toast.error('Query execution failed');
    } finally {
      setIsSearching(false);
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Crosshair className="h-6 w-6 text-primary" />
            Threat Hunting Console
          </h2>
          <p className="text-muted-foreground">Advanced IOC search and custom threat queries</p>
        </div>
      </div>

      <Tabs defaultValue="ioc" className="space-y-4">
        <TabsList className="bg-card/50 border border-border">
          <TabsTrigger value="ioc" className="data-[state=active]:bg-primary/20">
            <Target className="h-4 w-4 mr-2" />
            IOC Search
          </TabsTrigger>
          <TabsTrigger value="hunt" className="data-[state=active]:bg-primary/20">
            <FileSearch className="h-4 w-4 mr-2" />
            Hunt Queries
          </TabsTrigger>
          <TabsTrigger value="custom" className="data-[state=active]:bg-primary/20">
            <Database className="h-4 w-4 mr-2" />
            Custom Query
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ioc" className="space-y-4">
          <Card className="bg-card/50 border-border">
            <CardHeader>
              <CardTitle className="text-lg">Indicator of Compromise (IOC) Lookup</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter IP, domain, hash, URL, or email..."
                  value={iocInput}
                  onChange={(e) => setIocInput(e.target.value)}
                  className="flex-1 bg-background/50"
                />
                <Button onClick={searchIOC} disabled={isSearching}>
                  {isSearching ? (
                    <Clock className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Search className="h-4 w-4 mr-2" />
                  )}
                  Search
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {['8.8.8.8', 'malware.evil.com', 'a1b2c3d4e5f6...', 'https://phish.site'].map((example) => (
                  <Badge
                    key={example}
                    variant="outline"
                    className="cursor-pointer hover:bg-primary/20"
                    onClick={() => setIocInput(example)}
                  >
                    {example}
                  </Badge>
                ))}
              </div>

              {iocResults.length > 0 && (
                <div className="space-y-4 mt-4">
                  {iocResults.map((result) => (
                    <Card key={result.id} className="bg-background/50 border-border">
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge className={getThreatColor(result.threat_level)}>
                              {result.threat_level.toUpperCase()}
                            </Badge>
                            <Badge variant="outline">{result.type.toUpperCase()}</Badge>
                            <code className="text-sm font-mono">{result.value}</code>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Sources:</span>
                            <span className="ml-2">{result.source}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">First Seen:</span>
                            <span className="ml-2">{new Date(result.first_seen).toLocaleDateString()}</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {result.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        {result.ai_analysis && (
                          <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                            <div className="flex items-center gap-2 text-primary mb-2">
                              <Zap className="h-4 w-4" />
                              <span className="font-semibold text-sm">AI Analysis</span>
                            </div>
                            <p className="text-sm text-muted-foreground">{result.ai_analysis}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hunt" className="space-y-4">
          <div className="grid gap-4">
            {predefinedQueries.map((hunt) => (
              <Card key={hunt.id} className="bg-card/50 border-border hover:border-primary/50 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h3 className="font-semibold text-foreground">{hunt.name}</h3>
                      <p className="text-sm text-muted-foreground">{hunt.description}</p>
                      <code className="text-xs text-primary/80 block mt-2 p-2 bg-background/50 rounded">
                        {hunt.query}
                      </code>
                    </div>
                    <Button 
                      onClick={() => runQuery(hunt.query)}
                      disabled={isSearching}
                      size="sm"
                    >
                      <Zap className="h-4 w-4 mr-2" />
                      Run Hunt
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {queryResults.length > 0 && (
            <Card className="bg-card/50 border-border">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  Hunt Results ({queryResults.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {queryResults.map((result) => (
                    <div key={result.id} className="flex items-center justify-between p-2 bg-background/50 rounded border border-border">
                      <div className="flex items-center gap-4">
                        <Badge className={getThreatColor(result.severity)}>{result.severity}</Badge>
                        <span className="font-mono text-sm">{result.source_ip} → {result.destination_ip}</span>
                        <span className="text-muted-foreground text-sm">{result.process}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(result.timestamp).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="custom" className="space-y-4">
          <Card className="bg-card/50 border-border">
            <CardHeader>
              <CardTitle className="text-lg">Custom Query Builder</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Enter your custom hunt query using KQL or Lucene syntax..."
                value={customQuery}
                onChange={(e) => setCustomQuery(e.target.value)}
                className="min-h-32 font-mono bg-background/50"
              />
              <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  Supports KQL, Lucene, and natural language queries with AI translation
                </div>
                <Button onClick={() => runQuery(customQuery)} disabled={isSearching || !customQuery}>
                  <Zap className="h-4 w-4 mr-2" />
                  Execute Query
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
