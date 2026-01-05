import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Link2, 
  Shield, 
  Lock, 
  CheckCircle, 
  Hash, 
  Database,
  FileText,
  Clock,
  Fingerprint,
  Key,
  Layers,
  Activity,
  Zap,
  AlertTriangle,
  Eye,
  RefreshCw,
  Copy,
  ExternalLink,
  Server,
  Cpu,
  HardDrive,
  Network,
  Search,
  Filter,
  Download
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

interface BlockchainLog {
  id: string;
  hash: string;
  previousHash: string;
  timestamp: string;
  eventType: string;
  data: string;
  verified: boolean;
  blockNumber: number;
  nonce: number;
  difficulty: number;
  miner: string;
}

interface SmartContract {
  name: string;
  address: string;
  status: 'active' | 'paused' | 'deprecated';
  executions: number;
  lastExecution: string;
  gasUsed: string;
  version: string;
}

interface BlockchainNode {
  id: string;
  name: string;
  location: string;
  status: 'online' | 'syncing' | 'offline';
  blockHeight: number;
  peers: number;
  latency: number;
}

interface TransactionStats {
  totalTransactions: number;
  pendingTransactions: number;
  failedTransactions: number;
  avgGasPrice: number;
  avgBlockTime: number;
}

export const BlockchainSecurityModule = () => {
  const [activeTab, setActiveTab] = useState('ledger');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLog, setSelectedLog] = useState<BlockchainLog | null>(null);
  
  const [logs, setLogs] = useState<BlockchainLog[]>([
    { id: '1', hash: '0x7f8a9b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a', previousHash: '0x4b2c...9f1a', timestamp: new Date(Date.now() - 30000).toISOString(), eventType: 'ACCESS_GRANT', data: 'User admin@aegis.io granted SIEM access', verified: true, blockNumber: 1847329, nonce: 42156, difficulty: 2, miner: '0x742d...F9E2' },
    { id: '2', hash: '0x4b2c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c', previousHash: '0x2e1d...7c4b', timestamp: new Date(Date.now() - 120000).toISOString(), eventType: 'THREAT_LOG', data: 'APT campaign blocked - Source: 185.243.x.x', verified: true, blockNumber: 1847328, nonce: 38921, difficulty: 2, miner: '0x8f3a...B4C1' },
    { id: '3', hash: '0x2e1d7c4b8a9f0e1d2c3b4a5f6e7d8c9b0a1f2e3d', previousHash: '0x9a3f...1e5c', timestamp: new Date(Date.now() - 300000).toISOString(), eventType: 'POLICY_CHANGE', data: 'Firewall rule FW-001 updated', verified: true, blockNumber: 1847327, nonce: 51234, difficulty: 2, miner: '0x1e5c...D7A8' },
    { id: '4', hash: '0x9a3f1e5c2d3b4a5c6d7e8f9a0b1c2d3e4f5a6b7c', previousHash: '0x5d8e...2a7f', timestamp: new Date(Date.now() - 600000).toISOString(), eventType: 'INCIDENT_CREATE', data: 'INC-2024-0147 created - Ransomware detection', verified: true, blockNumber: 1847326, nonce: 29847, difficulty: 2, miner: '0x3b9f...E2C4' },
    { id: '5', hash: '0x5d8e2a7f1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e', previousHash: '0x1c4a...8b3d', timestamp: new Date(Date.now() - 900000).toISOString(), eventType: 'EVIDENCE_HASH', data: 'Forensic image hash stored for case CS-0089', verified: true, blockNumber: 1847325, nonce: 67890, difficulty: 2, miner: '0x742d...F9E2' },
  ]);

  const [contracts] = useState<SmartContract[]>([
    { name: 'AccessControl', address: '0x742dF9E2a1b2c3d4e5f6789012345678', status: 'active', executions: 15847, lastExecution: '2m ago', gasUsed: '1.2M', version: 'v2.1.0' },
    { name: 'AuditLogger', address: '0x8f3aB4C1d2e3f4a5b6c7890123456789', status: 'active', executions: 234567, lastExecution: '30s ago', gasUsed: '45.8M', version: 'v3.0.1' },
    { name: 'ThreatRegistry', address: '0x1e5cD7A8e9f0a1b2c3d4567890123456', status: 'active', executions: 8923, lastExecution: '5m ago', gasUsed: '890K', version: 'v1.5.2' },
    { name: 'IncidentManager', address: '0x3b9fE2C4a5b6c7d8e9f0123456789012', status: 'active', executions: 4521, lastExecution: '15m ago', gasUsed: '2.3M', version: 'v2.0.0' },
    { name: 'EvidenceVault', address: '0x5c8dA3B4c5d6e7f8a9b0123456789012', status: 'active', executions: 1234, lastExecution: '1h ago', gasUsed: '567K', version: 'v1.2.0' },
    { name: 'ComplianceChecker', address: '0x7a2eC5D6e7f8a9b0c1d2345678901234', status: 'paused', executions: 789, lastExecution: '2h ago', gasUsed: '234K', version: 'v1.0.0' },
  ]);

  const [nodes] = useState<BlockchainNode[]>([
    { id: '1', name: 'Primary Node', location: 'US-East', status: 'online', blockHeight: 1847329, peers: 24, latency: 12 },
    { id: '2', name: 'Secondary Node', location: 'EU-West', status: 'online', blockHeight: 1847329, peers: 18, latency: 45 },
    { id: '3', name: 'Backup Node', location: 'Asia-Pacific', status: 'syncing', blockHeight: 1847325, peers: 12, latency: 89 },
    { id: '4', name: 'DR Node', location: 'US-West', status: 'online', blockHeight: 1847329, peers: 21, latency: 23 },
  ]);

  const [chainStats, setChainStats] = useState({
    totalBlocks: 1847329,
    integrityScore: 100,
    activeNodes: 4,
    consensusTime: 2.3,
  });

  const [txStats, setTxStats] = useState<TransactionStats>({
    totalTransactions: 2456789,
    pendingTransactions: 12,
    failedTransactions: 23,
    avgGasPrice: 25,
    avgBlockTime: 2.3,
  });

  // Add new blockchain logs
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.5) {
        const eventTypes = ['ACCESS_GRANT', 'THREAT_LOG', 'POLICY_CHANGE', 'INCIDENT_CREATE', 'EVIDENCE_HASH', 'CONFIG_CHANGE', 'ALERT_VERIFY', 'SIGNATURE_CHECK'];
        const messages = [
          'User session authenticated via MFA',
          'Suspicious activity logged from endpoint',
          'Security policy updated',
          'New incident ticket created',
          'Digital evidence hash recorded',
          'System configuration change logged',
          'Security alert verified and confirmed',
          'Digital signature verification complete',
        ];
        
        const randomIndex = Math.floor(Math.random() * eventTypes.length);
        const newHash = `0x${Array.from({length: 40}, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
        
        const newLog: BlockchainLog = {
          id: crypto.randomUUID(),
          hash: newHash,
          previousHash: logs[0]?.hash.slice(0, 10) + '...' || '0x0000...0000',
          timestamp: new Date().toISOString(),
          eventType: eventTypes[randomIndex],
          data: messages[randomIndex],
          verified: true,
          blockNumber: chainStats.totalBlocks + 1,
          nonce: Math.floor(Math.random() * 100000),
          difficulty: 2,
          miner: contracts[Math.floor(Math.random() * contracts.length)].address.slice(0, 10) + '...',
        };

        setLogs(prev => [newLog, ...prev.slice(0, 49)]);
        setChainStats(prev => ({
          ...prev,
          totalBlocks: prev.totalBlocks + 1,
        }));
        setTxStats(prev => ({
          ...prev,
          totalTransactions: prev.totalTransactions + 1,
        }));
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [logs, chainStats.totalBlocks, contracts]);

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'ACCESS_GRANT': return Key;
      case 'THREAT_LOG': return AlertTriangle;
      case 'POLICY_CHANGE': return FileText;
      case 'INCIDENT_CREATE': return Shield;
      case 'EVIDENCE_HASH': return Fingerprint;
      case 'ALERT_VERIFY': return CheckCircle;
      case 'SIGNATURE_CHECK': return Lock;
      default: return Database;
    }
  };

  const getEventColor = (eventType: string) => {
    switch (eventType) {
      case 'ACCESS_GRANT': return 'text-primary';
      case 'THREAT_LOG': return 'text-destructive';
      case 'POLICY_CHANGE': return 'text-warning';
      case 'INCIDENT_CREATE': return 'text-orange-400';
      case 'EVIDENCE_HASH': return 'text-purple-400';
      case 'ALERT_VERIFY': return 'text-success';
      case 'SIGNATURE_CHECK': return 'text-blue-400';
      default: return 'text-blue-400';
    }
  };

  const getTimeAgo = (timestamp: string) => {
    const diff = Date.now() - new Date(timestamp).getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (seconds < 60) return `${seconds}s ago`;
    if (minutes < 60) return `${minutes}m ago`;
    return `${hours}h ago`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const filteredLogs = logs.filter(log => 
    log.data.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.eventType.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.hash.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Link2 className="h-8 w-8 text-purple-400" />
            <div className="absolute inset-0 bg-purple-400/40 blur-lg rounded-full" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">
              <span className="text-purple-400">Blockchain</span> Security Ledger
            </h2>
            <p className="text-sm text-muted-foreground">Immutable audit trail, evidence management & smart contracts</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="success" className="px-4 py-2">
            <Layers className="h-4 w-4 mr-2" />
            Chain Healthy
          </Badge>
          <Badge variant="outline" className="px-4 py-2">
            <Activity className="h-4 w-4 mr-2 animate-pulse" />
            {chainStats.activeNodes} Nodes
          </Badge>
        </div>
      </div>

      {/* Chain Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <Card variant="glass">
          <CardContent className="p-4 text-center">
            <motion.div 
              className="text-3xl font-bold text-purple-400"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {chainStats.totalBlocks.toLocaleString()}
            </motion.div>
            <div className="text-xs text-muted-foreground mt-1 flex items-center justify-center gap-1">
              <Hash className="h-3 w-3" />
              Total Blocks
            </div>
          </CardContent>
        </Card>
        <Card variant="glass">
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-success">{chainStats.integrityScore}%</div>
            <div className="text-xs text-muted-foreground mt-1 flex items-center justify-center gap-1">
              <CheckCircle className="h-3 w-3" />
              Integrity
            </div>
          </CardContent>
        </Card>
        <Card variant="glass">
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-primary">{chainStats.activeNodes}</div>
            <div className="text-xs text-muted-foreground mt-1 flex items-center justify-center gap-1">
              <Server className="h-3 w-3" />
              Active Nodes
            </div>
          </CardContent>
        </Card>
        <Card variant="glass">
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-blue-400">{chainStats.consensusTime}s</div>
            <div className="text-xs text-muted-foreground mt-1 flex items-center justify-center gap-1">
              <Clock className="h-3 w-3" />
              Consensus
            </div>
          </CardContent>
        </Card>
        <Card variant="glass">
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-warning">{txStats.pendingTransactions}</div>
            <div className="text-xs text-muted-foreground mt-1 flex items-center justify-center gap-1">
              <RefreshCw className="h-3 w-3" />
              Pending Tx
            </div>
          </CardContent>
        </Card>
        <Card variant="glass">
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-orange-400">{txStats.avgGasPrice}</div>
            <div className="text-xs text-muted-foreground mt-1 flex items-center justify-center gap-1">
              <Zap className="h-3 w-3" />
              Avg Gas
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-4 max-w-xl">
          <TabsTrigger value="ledger" className="gap-2">
            <FileText className="h-4 w-4" />
            Audit Ledger
          </TabsTrigger>
          <TabsTrigger value="contracts" className="gap-2">
            <Zap className="h-4 w-4" />
            Contracts
          </TabsTrigger>
          <TabsTrigger value="nodes" className="gap-2">
            <Server className="h-4 w-4" />
            Nodes
          </TabsTrigger>
          <TabsTrigger value="explorer" className="gap-2">
            <Search className="h-4 w-4" />
            Explorer
          </TabsTrigger>
        </TabsList>

        {/* Audit Ledger Tab */}
        <TabsContent value="ledger">
          <Card variant="glass">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileText className="h-5 w-5 text-purple-400" />
                  Immutable Audit Log
                </CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search logs..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 w-64"
                    />
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[450px] pr-2">
                <div className="space-y-3">
                  {filteredLogs.map((log, index) => {
                    const EventIcon = getEventIcon(log.eventType);
                    return (
                      <motion.div
                        key={log.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.02 }}
                        onClick={() => setSelectedLog(selectedLog?.id === log.id ? null : log)}
                        className={`p-3 bg-secondary/30 rounded-lg border cursor-pointer transition-all hover:bg-secondary/50 ${
                          selectedLog?.id === log.id ? 'border-purple-500/50 bg-purple-500/10' : 'border-border/30'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex flex-col items-center">
                            <div className={`p-2 rounded-lg bg-secondary ${getEventColor(log.eventType)}`}>
                              <EventIcon className="h-4 w-4" />
                            </div>
                            {index < filteredLogs.length - 1 && (
                              <div className="w-0.5 h-6 bg-gradient-to-b from-purple-400/50 to-transparent mt-1" />
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge variant="outline" className="text-[10px] font-mono">{log.eventType}</Badge>
                              <span className="text-[10px] text-muted-foreground">Block #{log.blockNumber}</span>
                            </div>
                            <p className="text-sm mt-1">{log.data}</p>
                            <div className="flex items-center gap-3 mt-2 text-[10px] text-muted-foreground font-mono flex-wrap">
                              <span className="flex items-center gap-1">
                                <Hash className="h-3 w-3" />
                                {log.hash.slice(0, 10)}...
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {getTimeAgo(log.timestamp)}
                              </span>
                              {log.verified && (
                                <span className="flex items-center gap-1 text-success">
                                  <CheckCircle className="h-3 w-3" />
                                  Verified
                                </span>
                              )}
                            </div>
                            
                            {/* Expanded Details */}
                            <AnimatePresence>
                              {selectedLog?.id === log.id && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  className="mt-3 pt-3 border-t border-border/30"
                                >
                                  <div className="grid grid-cols-2 gap-3 text-xs">
                                    <div>
                                      <span className="text-muted-foreground">Full Hash:</span>
                                      <div className="flex items-center gap-1 mt-1">
                                        <code className="text-[10px] bg-background/50 px-2 py-1 rounded">{log.hash}</code>
                                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyToClipboard(log.hash)}>
                                          <Copy className="h-3 w-3" />
                                        </Button>
                                      </div>
                                    </div>
                                    <div>
                                      <span className="text-muted-foreground">Previous Hash:</span>
                                      <div className="mt-1">
                                        <code className="text-[10px] bg-background/50 px-2 py-1 rounded">{log.previousHash}</code>
                                      </div>
                                    </div>
                                    <div>
                                      <span className="text-muted-foreground">Nonce:</span>
                                      <div className="mt-1 font-mono">{log.nonce}</div>
                                    </div>
                                    <div>
                                      <span className="text-muted-foreground">Miner:</span>
                                      <div className="mt-1 font-mono">{log.miner}</div>
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Smart Contracts Tab */}
        <TabsContent value="contracts">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {contracts.map((contract) => (
              <motion.div
                key={contract.name}
                whileHover={{ scale: 1.02 }}
              >
                <Card variant="glass" className="h-full">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Lock className="h-5 w-5 text-purple-400" />
                        <span className="font-semibold">{contract.name}</span>
                      </div>
                      <Badge variant={contract.status === 'active' ? 'success' : 'medium'} className="text-[10px]">
                        {contract.status}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground font-mono mb-3 flex items-center gap-1">
                      <span className="truncate">{contract.address}</span>
                      <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => copyToClipboard(contract.address)}>
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="p-2 bg-secondary/30 rounded">
                        <div className="text-muted-foreground">Executions</div>
                        <div className="font-bold text-lg">{contract.executions.toLocaleString()}</div>
                      </div>
                      <div className="p-2 bg-secondary/30 rounded">
                        <div className="text-muted-foreground">Gas Used</div>
                        <div className="font-bold text-lg">{contract.gasUsed}</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs mt-3">
                      <Badge variant="outline">{contract.version}</Badge>
                      <span className="text-muted-foreground">Last: {contract.lastExecution}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Security Features */}
          <Card variant="glass" className="mt-6">
            <CardContent className="p-6">
              <h4 className="font-semibold mb-4 flex items-center gap-2">
                <Shield className="h-5 w-5 text-purple-400" />
                Blockchain Security Features
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: CheckCircle, label: 'Immutable Logs', desc: 'Tamper-proof audit trail' },
                  { icon: Hash, label: 'Cryptographic Hashing', desc: 'SHA-256 verification' },
                  { icon: Server, label: 'Distributed Consensus', desc: 'Multi-node validation' },
                  { icon: Fingerprint, label: 'Evidence Integrity', desc: 'Digital forensics ready' },
                  { icon: Lock, label: 'Non-repudiation', desc: 'Proof of authenticity' },
                  { icon: Eye, label: 'Tamper Detection', desc: 'Real-time monitoring' },
                  { icon: Key, label: 'Access Control', desc: 'Smart contract enforcement' },
                  { icon: Shield, label: 'Zero-Knowledge Proofs', desc: 'Privacy preservation' },
                ].map((feature) => (
                  <div key={feature.label} className="flex items-start gap-2 p-3 bg-secondary/20 rounded-lg">
                    <feature.icon className="h-4 w-4 text-success mt-0.5" />
                    <div>
                      <div className="text-sm font-semibold">{feature.label}</div>
                      <div className="text-[10px] text-muted-foreground">{feature.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Nodes Tab */}
        <TabsContent value="nodes">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {nodes.map((node) => (
              <Card key={node.id} variant="glass">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Server className={`h-5 w-5 ${
                        node.status === 'online' ? 'text-success' : 
                        node.status === 'syncing' ? 'text-warning' : 'text-destructive'
                      }`} />
                      <span className="font-semibold">{node.name}</span>
                    </div>
                    <Badge variant={
                      node.status === 'online' ? 'success' : 
                      node.status === 'syncing' ? 'medium' : 'critical'
                    } className="text-[10px]">
                      {node.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-xs">
                    <div className="p-2 bg-secondary/30 rounded text-center">
                      <div className="text-muted-foreground">Location</div>
                      <div className="font-semibold">{node.location}</div>
                    </div>
                    <div className="p-2 bg-secondary/30 rounded text-center">
                      <div className="text-muted-foreground">Block Height</div>
                      <div className="font-semibold">{node.blockHeight.toLocaleString()}</div>
                    </div>
                    <div className="p-2 bg-secondary/30 rounded text-center">
                      <div className="text-muted-foreground">Latency</div>
                      <div className="font-semibold">{node.latency}ms</div>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Network className="h-3 w-3" />
                      {node.peers} peers connected
                    </span>
                    {node.status === 'syncing' && (
                      <span className="flex items-center gap-1 text-warning">
                        <RefreshCw className="h-3 w-3 animate-spin" />
                        Syncing...
                      </span>
                    )}
                  </div>
                  <Progress 
                    value={node.status === 'online' ? 100 : node.status === 'syncing' ? 75 : 0} 
                    className="h-1 mt-2" 
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Explorer Tab */}
        <TabsContent value="explorer">
          <Card variant="glass">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Search className="h-5 w-5 text-purple-400" />
                Block Explorer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-4">
                <Input placeholder="Search by hash, block number, or event type..." className="flex-1" />
                <Button>
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <Card variant="glass">
                  <CardContent className="p-3 text-center">
                    <div className="text-2xl font-bold text-purple-400">{txStats.totalTransactions.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Total Transactions</div>
                  </CardContent>
                </Card>
                <Card variant="glass">
                  <CardContent className="p-3 text-center">
                    <div className="text-2xl font-bold text-warning">{txStats.pendingTransactions}</div>
                    <div className="text-xs text-muted-foreground">Pending</div>
                  </CardContent>
                </Card>
                <Card variant="glass">
                  <CardContent className="p-3 text-center">
                    <div className="text-2xl font-bold text-destructive">{txStats.failedTransactions}</div>
                    <div className="text-xs text-muted-foreground">Failed</div>
                  </CardContent>
                </Card>
                <Card variant="glass">
                  <CardContent className="p-3 text-center">
                    <div className="text-2xl font-bold text-success">{txStats.avgBlockTime}s</div>
                    <div className="text-xs text-muted-foreground">Avg Block Time</div>
                  </CardContent>
                </Card>
              </div>
              <p className="text-sm text-muted-foreground text-center py-8">
                Enter a transaction hash, block number, or address to explore the blockchain
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
