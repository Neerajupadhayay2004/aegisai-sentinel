import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
  AlertTriangle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface BlockchainLog {
  id: string;
  hash: string;
  previousHash: string;
  timestamp: string;
  eventType: string;
  data: string;
  verified: boolean;
  blockNumber: number;
}

interface SmartContract {
  name: string;
  address: string;
  status: 'active' | 'paused' | 'deprecated';
  executions: number;
  lastExecution: string;
}

export const BlockchainSecurityModule = () => {
  const [logs, setLogs] = useState<BlockchainLog[]>([
    { id: '1', hash: '0x7f8a...3d2e', previousHash: '0x4b2c...9f1a', timestamp: new Date(Date.now() - 30000).toISOString(), eventType: 'ACCESS_GRANT', data: 'User admin@aegis.io granted SIEM access', verified: true, blockNumber: 1847329 },
    { id: '2', hash: '0x4b2c...9f1a', previousHash: '0x2e1d...7c4b', timestamp: new Date(Date.now() - 120000).toISOString(), eventType: 'THREAT_LOG', data: 'APT campaign blocked - Source: 185.243.x.x', verified: true, blockNumber: 1847328 },
    { id: '3', hash: '0x2e1d...7c4b', previousHash: '0x9a3f...1e5c', timestamp: new Date(Date.now() - 300000).toISOString(), eventType: 'POLICY_CHANGE', data: 'Firewall rule FW-001 updated', verified: true, blockNumber: 1847327 },
    { id: '4', hash: '0x9a3f...1e5c', previousHash: '0x5d8e...2a7f', timestamp: new Date(Date.now() - 600000).toISOString(), eventType: 'INCIDENT_CREATE', data: 'INC-2024-0147 created - Ransomware detection', verified: true, blockNumber: 1847326 },
    { id: '5', hash: '0x5d8e...2a7f', previousHash: '0x1c4a...8b3d', timestamp: new Date(Date.now() - 900000).toISOString(), eventType: 'EVIDENCE_HASH', data: 'Forensic image hash stored for case CS-0089', verified: true, blockNumber: 1847325 },
  ]);

  const [contracts] = useState<SmartContract[]>([
    { name: 'AccessControl', address: '0x742d...F9E2', status: 'active', executions: 15847, lastExecution: '2m ago' },
    { name: 'AuditLogger', address: '0x8f3a...B4C1', status: 'active', executions: 234567, lastExecution: '30s ago' },
    { name: 'ThreatRegistry', address: '0x1e5c...D7A8', status: 'active', executions: 8923, lastExecution: '5m ago' },
    { name: 'IncidentManager', address: '0x3b9f...E2C4', status: 'active', executions: 4521, lastExecution: '15m ago' },
  ]);

  const [chainStats, setChainStats] = useState({
    totalBlocks: 1847329,
    integrityScore: 100,
    activeNodes: 12,
    consensusTime: 2.3,
  });

  // Add new blockchain logs
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.6) {
        const eventTypes = ['ACCESS_GRANT', 'THREAT_LOG', 'POLICY_CHANGE', 'INCIDENT_CREATE', 'EVIDENCE_HASH', 'CONFIG_CHANGE'];
        const messages = [
          'User session authenticated via MFA',
          'Suspicious activity logged from endpoint',
          'Security policy updated',
          'New incident ticket created',
          'Digital evidence hash recorded',
          'System configuration change logged',
        ];
        
        const randomIndex = Math.floor(Math.random() * eventTypes.length);
        
        const newLog: BlockchainLog = {
          id: crypto.randomUUID(),
          hash: `0x${Math.random().toString(16).slice(2, 6)}...${Math.random().toString(16).slice(2, 6)}`,
          previousHash: logs[0]?.hash || '0x0000...0000',
          timestamp: new Date().toISOString(),
          eventType: eventTypes[randomIndex],
          data: messages[randomIndex],
          verified: true,
          blockNumber: chainStats.totalBlocks + 1,
        };

        setLogs(prev => [newLog, ...prev.slice(0, 19)]);
        setChainStats(prev => ({
          ...prev,
          totalBlocks: prev.totalBlocks + 1,
        }));
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [logs, chainStats.totalBlocks]);

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'ACCESS_GRANT': return Key;
      case 'THREAT_LOG': return AlertTriangle;
      case 'POLICY_CHANGE': return FileText;
      case 'INCIDENT_CREATE': return Shield;
      case 'EVIDENCE_HASH': return Fingerprint;
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Link2 className="h-8 w-8 text-purple-400" />
            <div className="absolute inset-0 bg-purple-400/40 blur-lg rounded-full" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">
              <span className="text-purple-400">Blockchain</span> Security Ledger
            </h2>
            <p className="text-sm text-muted-foreground">Immutable audit trail & evidence management</p>
          </div>
        </div>
        <Badge variant="success" className="px-4 py-2">
          <Layers className="h-4 w-4 mr-2" />
          Chain Healthy
        </Badge>
      </div>

      {/* Chain Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
              Integrity Score
            </div>
          </CardContent>
        </Card>
        <Card variant="glass">
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-primary">{chainStats.activeNodes}</div>
            <div className="text-xs text-muted-foreground mt-1 flex items-center justify-center gap-1">
              <Database className="h-3 w-3" />
              Active Nodes
            </div>
          </CardContent>
        </Card>
        <Card variant="glass">
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-blue-400">{chainStats.consensusTime}s</div>
            <div className="text-xs text-muted-foreground mt-1 flex items-center justify-center gap-1">
              <Clock className="h-3 w-3" />
              Consensus Time
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Immutable Audit Log */}
        <Card variant="glass">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="h-5 w-5 text-purple-400" />
              Immutable Audit Log
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[350px] pr-2">
              <div className="space-y-3">
                {logs.map((log, index) => {
                  const EventIcon = getEventIcon(log.eventType);
                  return (
                    <motion.div
                      key={log.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-3 bg-secondary/30 rounded-lg border border-border/30"
                    >
                      <div className="flex items-start gap-3">
                        {/* Chain Link Visual */}
                        <div className="flex flex-col items-center">
                          <div className={`p-2 rounded-lg bg-secondary ${getEventColor(log.eventType)}`}>
                            <EventIcon className="h-4 w-4" />
                          </div>
                          {index < logs.length - 1 && (
                            <div className="w-0.5 h-6 bg-gradient-to-b from-purple-400/50 to-transparent mt-1" />
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="outline" className="text-[10px] font-mono">{log.eventType}</Badge>
                            <span className="text-[10px] text-muted-foreground">Block #{log.blockNumber}</span>
                          </div>
                          <p className="text-sm mt-1">{log.data}</p>
                          <div className="flex items-center gap-3 mt-2 text-[10px] text-muted-foreground font-mono">
                            <span className="flex items-center gap-1">
                              <Hash className="h-3 w-3" />
                              {log.hash}
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
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Smart Contracts */}
        <Card variant="glass">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Zap className="h-5 w-5 text-purple-400" />
              Security Smart Contracts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {contracts.map((contract) => (
                <motion.div
                  key={contract.name}
                  whileHover={{ scale: 1.02 }}
                  className="p-4 bg-secondary/30 rounded-lg border border-border/30"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Lock className="h-4 w-4 text-purple-400" />
                      <span className="font-semibold">{contract.name}</span>
                    </div>
                    <Badge variant={contract.status === 'active' ? 'success' : 'medium'} className="text-[10px]">
                      {contract.status}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground font-mono mb-2">{contract.address}</div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1">
                      <Activity className="h-3 w-3" />
                      {contract.executions.toLocaleString()} executions
                    </span>
                    <span className="text-muted-foreground">Last: {contract.lastExecution}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Security Features */}
            <div className="mt-6 p-4 bg-gradient-to-r from-purple-500/10 to-primary/10 rounded-lg border border-purple-500/20">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Shield className="h-4 w-4 text-purple-400" />
                Blockchain Security Features
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-success" />
                  <span>Immutable Logs</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-success" />
                  <span>Cryptographic Hashing</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-success" />
                  <span>Distributed Consensus</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-success" />
                  <span>Evidence Integrity</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-success" />
                  <span>Non-repudiation</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-success" />
                  <span>Tamper Detection</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
