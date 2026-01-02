import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Shield, AlertTriangle, Activity, ExternalLink, 
  Globe, FileWarning, Bug, Skull, Clock, Database,
  CheckCircle, XCircle, Info, RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';

interface ThreatIntel {
  id: string;
  indicator: string;
  type: 'ip' | 'domain' | 'hash' | 'url';
  source: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  confidence: number;
  tags: string[];
  lastSeen: string;
  description: string;
  country?: string;
  malwareFamily?: string;
}

interface IOCResult {
  indicator: string;
  type: string;
  malicious: boolean;
  sources: string[];
  score: number;
  details: {
    firstSeen: string;
    lastSeen: string;
    reports: number;
    categories: string[];
  };
}

const generateThreatIntel = (): ThreatIntel[] => {
  const sources = ['VirusTotal', 'AbuseIPDB', 'AlienVault OTX', 'ThreatCrowd', 'IBM X-Force', 'Shodan'];
  const types: ThreatIntel['type'][] = ['ip', 'domain', 'hash', 'url'];
  const severities: ThreatIntel['severity'][] = ['critical', 'high', 'medium', 'low'];
  const tags = ['ransomware', 'botnet', 'phishing', 'c2', 'malware', 'spam', 'brute-force', 'scanner'];
  const malwareFamilies = ['Emotet', 'TrickBot', 'Ryuk', 'Conti', 'LockBit', 'REvil', 'Dridex', 'Qakbot'];
  const countries = ['Russia', 'China', 'North Korea', 'Iran', 'Unknown'];

  return Array.from({ length: 30 }, (_, i) => {
    const type = types[Math.floor(Math.random() * types.length)];
    let indicator = '';
    
    switch (type) {
      case 'ip':
        indicator = `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`;
        break;
      case 'domain':
        const domainNames = ['malware-c2', 'phish-login', 'evil-server', 'botnet-cmd', 'data-exfil'];
        const tlds = ['.ru', '.cn', '.xyz', '.top', '.cc'];
        indicator = `${domainNames[Math.floor(Math.random() * domainNames.length)]}${Math.floor(Math.random() * 1000)}${tlds[Math.floor(Math.random() * tlds.length)]}`;
        break;
      case 'hash':
        indicator = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
        break;
      case 'url':
        indicator = `https://suspicious-site${Math.floor(Math.random() * 1000)}.com/malware/payload.exe`;
        break;
    }

    return {
      id: `intel-${i}`,
      indicator,
      type,
      source: sources[Math.floor(Math.random() * sources.length)],
      severity: severities[Math.floor(Math.random() * severities.length)],
      confidence: Math.floor(Math.random() * 40 + 60),
      tags: Array.from({ length: Math.floor(Math.random() * 3) + 1 }, () => tags[Math.floor(Math.random() * tags.length)]),
      lastSeen: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString(),
      description: `Detected ${type === 'ip' ? 'malicious IP' : type === 'domain' ? 'malicious domain' : type === 'hash' ? 'malware sample' : 'malicious URL'} associated with threat activity`,
      country: countries[Math.floor(Math.random() * countries.length)],
      malwareFamily: Math.random() > 0.5 ? malwareFamilies[Math.floor(Math.random() * malwareFamilies.length)] : undefined,
    };
  });
};

const severityColors = {
  critical: 'text-red-500 bg-red-500/10 border-red-500/30',
  high: 'text-orange-500 bg-orange-500/10 border-orange-500/30',
  medium: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30',
  low: 'text-green-500 bg-green-500/10 border-green-500/30',
};

const typeIcons = {
  ip: Globe,
  domain: Globe,
  hash: FileWarning,
  url: ExternalLink,
};

export const ThreatIntelligenceFeeds: React.FC = () => {
  const [threatIntel, setThreatIntel] = useState<ThreatIntel[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<IOCResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [filter, setFilter] = useState<'all' | 'ip' | 'domain' | 'hash' | 'url'>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    setThreatIntel(generateThreatIntel());
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Determine IOC type
    let type = 'unknown';
    if (/^[0-9.]+$/.test(searchQuery)) type = 'IP Address';
    else if (/^[a-f0-9]{32,64}$/i.test(searchQuery)) type = 'Hash';
    else if (/^https?:\/\//.test(searchQuery)) type = 'URL';
    else if (/\.[a-z]{2,}$/i.test(searchQuery)) type = 'Domain';

    const isMalicious = Math.random() > 0.4;
    
    setSearchResults({
      indicator: searchQuery,
      type,
      malicious: isMalicious,
      sources: ['VirusTotal', 'AbuseIPDB', 'AlienVault OTX'].slice(0, Math.floor(Math.random() * 3) + 1),
      score: isMalicious ? Math.floor(Math.random() * 40 + 60) : Math.floor(Math.random() * 30),
      details: {
        firstSeen: new Date(Date.now() - Math.random() * 86400000 * 30).toLocaleDateString(),
        lastSeen: new Date(Date.now() - Math.random() * 86400000).toLocaleDateString(),
        reports: Math.floor(Math.random() * 50) + 1,
        categories: isMalicious 
          ? ['malware', 'c2', 'phishing'].slice(0, Math.floor(Math.random() * 3) + 1)
          : ['clean'],
      },
    });
    
    setIsSearching(false);
    toast.success('IOC analysis complete');
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setThreatIntel(generateThreatIntel());
    setIsRefreshing(false);
    toast.success('Threat intelligence feeds refreshed');
  };

  const filteredIntel = threatIntel.filter(intel => 
    filter === 'all' || intel.type === filter
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="space-y-6">
      {/* IOC Search */}
      <Card className="glass-card border-primary/20">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/20">
              <Search className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>IOC Lookup</CardTitle>
              <p className="text-sm text-muted-foreground">Search indicators across threat intelligence sources</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter IP, domain, hash, or URL..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1"
            />
            <Button onClick={handleSearch} disabled={isSearching} className="gap-2">
              {isSearching ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4" />
                  Search
                </>
              )}
            </Button>
          </div>

          <AnimatePresence>
            {searchResults && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`p-4 rounded-lg border ${searchResults.malicious ? 'bg-destructive/10 border-destructive/30' : 'bg-green-500/10 border-green-500/30'}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {searchResults.malicious ? (
                      <XCircle className="h-8 w-8 text-destructive" />
                    ) : (
                      <CheckCircle className="h-8 w-8 text-green-500" />
                    )}
                    <div>
                      <div className="font-mono text-sm break-all">{searchResults.indicator}</div>
                      <div className="text-sm text-muted-foreground">{searchResults.type}</div>
                    </div>
                  </div>
                  <Badge variant={searchResults.malicious ? 'destructive' : 'secondary'}>
                    Score: {searchResults.score}/100
                  </Badge>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground mb-1">First Seen</div>
                    <div>{searchResults.details.firstSeen}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground mb-1">Last Seen</div>
                    <div>{searchResults.details.lastSeen}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground mb-1">Reports</div>
                    <div>{searchResults.details.reports}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground mb-1">Sources</div>
                    <div>{searchResults.sources.length}</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  {searchResults.details.categories.map((cat, i) => (
                    <Badge key={i} variant="outline">{cat}</Badge>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Threat Intelligence Feeds */}
      <Card className="glass-card border-primary/20">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/20">
                <Database className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Threat Intelligence Feeds</CardTitle>
                <p className="text-sm text-muted-foreground">Aggregated from multiple sources</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="all" onClick={() => setFilter('all')}>All</TabsTrigger>
              <TabsTrigger value="ip" onClick={() => setFilter('ip')}>IPs</TabsTrigger>
              <TabsTrigger value="domain" onClick={() => setFilter('domain')}>Domains</TabsTrigger>
              <TabsTrigger value="hash" onClick={() => setFilter('hash')}>Hashes</TabsTrigger>
              <TabsTrigger value="url" onClick={() => setFilter('url')}>URLs</TabsTrigger>
            </TabsList>

            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                  {filteredIntel.map((intel, index) => {
                    const TypeIcon = typeIcons[intel.type];
                    return (
                      <motion.div
                        key={intel.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: index * 0.02 }}
                        className={`p-4 rounded-lg border ${severityColors[intel.severity]} hover:bg-primary/5 transition-colors`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3 flex-1 min-w-0">
                            <TypeIcon className="h-5 w-5 mt-0.5 shrink-0" />
                            <div className="flex-1 min-w-0">
                              <div className="font-mono text-sm break-all mb-1">
                                {intel.indicator}
                              </div>
                              <div className="text-xs text-muted-foreground mb-2">
                                {intel.description}
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {intel.tags.map((tag, i) => (
                                  <Badge key={i} variant="outline" className="text-xs">{tag}</Badge>
                                ))}
                                {intel.malwareFamily && (
                                  <Badge variant="destructive" className="text-xs">
                                    <Bug className="h-3 w-3 mr-1" />
                                    {intel.malwareFamily}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <Badge className={severityColors[intel.severity]}>
                              {intel.severity}
                            </Badge>
                            <div className="text-xs text-muted-foreground mt-2">
                              <Clock className="h-3 w-3 inline mr-1" />
                              {formatDate(intel.lastSeen)}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {intel.source} • {intel.confidence}% conf
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </ScrollArea>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
