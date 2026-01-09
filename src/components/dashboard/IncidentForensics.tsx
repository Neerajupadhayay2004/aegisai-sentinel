import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Microscope,
  FileSearch,
  HardDrive,
  Network,
  Clock,
  User,
  Terminal,
  Database,
  Download,
  Upload,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ChevronDown,
  Play,
  Pause,
  SkipForward,
  Eye,
  Lock,
  Unlock,
  FileText,
  Cpu,
  MemoryStick,
  Hash,
  Globe,
  Shield,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ForensicArtifact {
  id: string;
  type: 'file' | 'process' | 'network' | 'registry' | 'memory' | 'log';
  name: string;
  path: string;
  timestamp: Date;
  status: 'suspicious' | 'malicious' | 'clean' | 'analyzing';
  hash?: string;
  size?: number;
  details: Record<string, string>;
}

interface TimelineEvent {
  id: string;
  timestamp: Date;
  action: string;
  source: string;
  destination?: string;
  user?: string;
  severity: 'info' | 'warning' | 'critical';
  details: string;
}

interface MemoryAnalysis {
  processName: string;
  pid: number;
  parentPid: number;
  cmdLine: string;
  status: 'suspicious' | 'malicious' | 'clean';
  injectedDlls: string[];
  networkConnections: { ip: string; port: number; protocol: string }[];
}

// Generate mock forensic data
const generateArtifacts = (): ForensicArtifact[] => [
  {
    id: 'art-1',
    type: 'file',
    name: 'svchost_update.exe',
    path: 'C:\\Windows\\Temp\\svchost_update.exe',
    timestamp: new Date(Date.now() - 2 * 3600000),
    status: 'malicious',
    hash: 'a3f2b8c9d4e5f6a7b8c9d0e1f2a3b4c5',
    size: 245760,
    details: {
      'File Type': 'PE32 Executable',
      'Compiler': 'MSVC 2019',
      'Packer': 'UPX Modified',
      'Digital Signature': 'Invalid/Revoked',
    },
  },
  {
    id: 'art-2',
    type: 'process',
    name: 'powershell.exe',
    path: 'C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe',
    timestamp: new Date(Date.now() - 3 * 3600000),
    status: 'suspicious',
    details: {
      'PID': '4856',
      'Parent': 'cmd.exe (PID: 3244)',
      'Command Line': 'powershell -enc SGVsbG8gV29ybGQ=',
      'Memory Usage': '142 MB',
    },
  },
  {
    id: 'art-3',
    type: 'network',
    name: 'C2 Connection',
    path: '185.234.72.14:443',
    timestamp: new Date(Date.now() - 1 * 3600000),
    status: 'malicious',
    details: {
      'Protocol': 'HTTPS',
      'Bytes Sent': '12.4 MB',
      'Bytes Received': '456 KB',
      'Duration': '2h 15m',
      'Domain': 'secure-update.cloud',
    },
  },
  {
    id: 'art-4',
    type: 'registry',
    name: 'Persistence Key',
    path: 'HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Run\\UpdateService',
    timestamp: new Date(Date.now() - 4 * 3600000),
    status: 'malicious',
    details: {
      'Value': 'C:\\Windows\\Temp\\svchost_update.exe',
      'Type': 'REG_SZ',
      'Modified By': 'NT AUTHORITY\\SYSTEM',
    },
  },
  {
    id: 'art-5',
    type: 'memory',
    name: 'Injected Code',
    path: 'explorer.exe (PID: 1234)',
    timestamp: new Date(Date.now() - 30 * 60000),
    status: 'malicious',
    details: {
      'Memory Region': '0x7FFE0000 - 0x7FFE8000',
      'Protection': 'RWX (Suspicious)',
      'Content': 'Shellcode detected',
      'Entropy': '7.8 (Encrypted/Packed)',
    },
  },
  {
    id: 'art-6',
    type: 'log',
    name: 'Security Event 4624',
    path: 'Security.evtx',
    timestamp: new Date(Date.now() - 5 * 3600000),
    status: 'suspicious',
    details: {
      'Event ID': '4624',
      'Logon Type': '10 (RemoteInteractive)',
      'Source IP': '192.168.1.100',
      'Account': 'admin_backup',
    },
  },
];

const generateTimeline = (): TimelineEvent[] => [
  { id: 't-1', timestamp: new Date(Date.now() - 6 * 3600000), action: 'Phishing Email Received', source: 'hr-payroll@external.com', destination: 'finance@company.com', severity: 'warning', details: 'Malicious attachment: Invoice_Q4.xlsm' },
  { id: 't-2', timestamp: new Date(Date.now() - 5.5 * 3600000), action: 'Macro Execution', source: 'EXCEL.EXE', user: 'jsmith', severity: 'critical', details: 'VBA macro executed PowerShell download cradle' },
  { id: 't-3', timestamp: new Date(Date.now() - 5 * 3600000), action: 'Payload Download', source: '185.234.72.14', destination: 'WORKSTATION-01', severity: 'critical', details: 'Downloaded svchost_update.exe (245 KB)' },
  { id: 't-4', timestamp: new Date(Date.now() - 4.5 * 3600000), action: 'Persistence Established', source: 'svchost_update.exe', severity: 'critical', details: 'Registry Run key created for persistence' },
  { id: 't-5', timestamp: new Date(Date.now() - 4 * 3600000), action: 'Credential Dumping', source: 'mimikatz.exe', severity: 'critical', details: 'LSASS memory dumped, credentials extracted' },
  { id: 't-6', timestamp: new Date(Date.now() - 3 * 3600000), action: 'Lateral Movement', source: 'WORKSTATION-01', destination: 'DC-01', user: 'domain_admin', severity: 'critical', details: 'PSExec used for lateral movement' },
  { id: 't-7', timestamp: new Date(Date.now() - 2 * 3600000), action: 'Data Staging', source: 'DC-01', severity: 'warning', details: 'Large files compressed to C:\\Temp\\backup.7z' },
  { id: 't-8', timestamp: new Date(Date.now() - 1 * 3600000), action: 'Data Exfiltration', source: 'DC-01', destination: '45.142.213.56', severity: 'critical', details: '2.3 GB exfiltrated via HTTPS' },
];

const generateMemoryAnalysis = (): MemoryAnalysis[] => [
  {
    processName: 'svchost_update.exe',
    pid: 4856,
    parentPid: 3244,
    cmdLine: 'C:\\Windows\\Temp\\svchost_update.exe -silent',
    status: 'malicious',
    injectedDlls: ['meterpreter.dll', 'beacon.dll'],
    networkConnections: [
      { ip: '185.234.72.14', port: 443, protocol: 'TCP' },
      { ip: '45.142.213.56', port: 8443, protocol: 'TCP' },
    ],
  },
  {
    processName: 'explorer.exe',
    pid: 1234,
    parentPid: 456,
    cmdLine: 'C:\\Windows\\explorer.exe',
    status: 'suspicious',
    injectedDlls: ['unknown_module.dll'],
    networkConnections: [],
  },
  {
    processName: 'chrome.exe',
    pid: 5678,
    parentPid: 1234,
    cmdLine: '"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"',
    status: 'clean',
    injectedDlls: [],
    networkConnections: [
      { ip: '142.250.185.206', port: 443, protocol: 'TCP' },
    ],
  },
];

export const IncidentForensics = () => {
  const [artifacts, setArtifacts] = useState<ForensicArtifact[]>(generateArtifacts());
  const [timeline, setTimeline] = useState<TimelineEvent[]>(generateTimeline());
  const [memoryAnalysis, setMemoryAnalysis] = useState<MemoryAnalysis[]>(generateMemoryAnalysis());
  const [selectedArtifact, setSelectedArtifact] = useState<ForensicArtifact | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [timelinePosition, setTimelinePosition] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Timeline playback
  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      setTimelinePosition(prev => {
        if (prev >= timeline.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 2000);
    
    return () => clearInterval(interval);
  }, [isPlaying, timeline.length]);

  const runDeepAnalysis = async () => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    
    for (let i = 0; i <= 100; i += 1) {
      await new Promise(resolve => setTimeout(resolve, 30));
      setAnalysisProgress(i);
    }
    
    // Update some artifacts to analyzed
    setArtifacts(prev => prev.map(a => ({
      ...a,
      status: a.status === 'analyzing' ? 'suspicious' : a.status,
    })));
    
    setIsAnalyzing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'malicious': return 'text-red-500 bg-red-500/10 border-red-500/30';
      case 'suspicious': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30';
      case 'clean': return 'text-green-500 bg-green-500/10 border-green-500/30';
      case 'analyzing': return 'text-blue-500 bg-blue-500/10 border-blue-500/30';
      default: return 'text-muted-foreground bg-muted/10 border-muted/30';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-500';
      case 'warning': return 'text-yellow-500';
      case 'info': return 'text-blue-500';
      default: return 'text-muted-foreground';
    }
  };

  const getArtifactIcon = (type: string) => {
    switch (type) {
      case 'file': return FileText;
      case 'process': return Cpu;
      case 'network': return Globe;
      case 'registry': return Database;
      case 'memory': return MemoryStick;
      case 'log': return FileSearch;
      default: return FileText;
    }
  };

  const maliciousCount = artifacts.filter(a => a.status === 'malicious').length;
  const suspiciousCount = artifacts.filter(a => a.status === 'suspicious').length;

  return (
    <Card variant="glass" className="overflow-hidden">
      <CardHeader className="pb-4 border-b border-border/50">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/30">
              <Microscope className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <CardTitle className="text-lg">Incident Forensics</CardTitle>
              <p className="text-sm text-muted-foreground">Deep-dive analysis & artifact examination</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="cyber"
              size="sm"
              onClick={runDeepAnalysis}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <>
                  <Cpu className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Microscope className="h-4 w-4 mr-2" />
                  Deep Scan
                </>
              )}
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
          <div className="bg-red-500/10 rounded-lg p-3 border border-red-500/30">
            <div className="flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-500" />
              <span className="text-xs text-muted-foreground">Malicious</span>
            </div>
            <div className="text-xl font-bold text-red-500">{maliciousCount}</div>
          </div>
          <div className="bg-yellow-500/10 rounded-lg p-3 border border-yellow-500/30">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              <span className="text-xs text-muted-foreground">Suspicious</span>
            </div>
            <div className="text-xl font-bold text-yellow-500">{suspiciousCount}</div>
          </div>
          <div className="bg-background/50 rounded-lg p-3 border border-border/50">
            <div className="flex items-center gap-2">
              <FileSearch className="h-4 w-4 text-primary" />
              <span className="text-xs text-muted-foreground">Artifacts</span>
            </div>
            <div className="text-xl font-bold">{artifacts.length}</div>
          </div>
          <div className="bg-background/50 rounded-lg p-3 border border-border/50">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Timeline</span>
            </div>
            <div className="text-xl font-bold">{timeline.length}</div>
          </div>
        </div>

        {/* Analysis Progress */}
        <AnimatePresence>
          {isAnalyzing && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Running deep forensic analysis...</span>
                <span className="text-sm font-mono text-primary">{analysisProgress}%</span>
              </div>
              <Progress value={analysisProgress} className="h-2" />
              <div className="flex flex-wrap gap-2 mt-2 text-xs text-muted-foreground">
                <span className={analysisProgress > 20 ? 'text-success' : ''}>✓ File Analysis</span>
                <span className={analysisProgress > 40 ? 'text-success' : ''}>✓ Memory Scan</span>
                <span className={analysisProgress > 60 ? 'text-success' : ''}>✓ Network Forensics</span>
                <span className={analysisProgress > 80 ? 'text-success' : ''}>✓ Registry Analysis</span>
                <span className={analysisProgress >= 100 ? 'text-success' : ''}>✓ IOC Extraction</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardHeader>

      <CardContent className="p-0">
        <Tabs defaultValue="artifacts" className="w-full">
          <TabsList className="w-full justify-start rounded-none border-b border-border/50 bg-transparent p-0 h-auto overflow-x-auto">
            <TabsTrigger value="artifacts" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary px-4 py-3 whitespace-nowrap">
              <FileSearch className="h-4 w-4 mr-2" />
              Artifacts
            </TabsTrigger>
            <TabsTrigger value="timeline" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary px-4 py-3 whitespace-nowrap">
              <Clock className="h-4 w-4 mr-2" />
              Timeline
            </TabsTrigger>
            <TabsTrigger value="memory" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary px-4 py-3 whitespace-nowrap">
              <MemoryStick className="h-4 w-4 mr-2" />
              Memory
            </TabsTrigger>
            <TabsTrigger value="iocs" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary px-4 py-3 whitespace-nowrap">
              <Shield className="h-4 w-4 mr-2" />
              IOCs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="artifacts" className="p-4">
            <ScrollArea className="h-[400px]">
              <div className="space-y-2">
                {artifacts.map((artifact, index) => {
                  const Icon = getArtifactIcon(artifact.type);
                  return (
                    <motion.div
                      key={artifact.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        selectedArtifact?.id === artifact.id
                          ? 'bg-primary/10 border-primary/50'
                          : 'bg-background/50 border-border/50 hover:border-primary/30'
                      }`}
                      onClick={() => setSelectedArtifact(selectedArtifact?.id === artifact.id ? null : artifact)}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="h-5 w-5 text-muted-foreground" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium truncate">{artifact.name}</span>
                            <Badge className={getStatusColor(artifact.status)}>
                              {artifact.status}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground truncate font-mono">{artifact.path}</p>
                        </div>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {new Date(artifact.timestamp).toLocaleTimeString()}
                        </span>
                        <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${
                          selectedArtifact?.id === artifact.id ? 'rotate-180' : ''
                        }`} />
                      </div>

                      <AnimatePresence>
                        {selectedArtifact?.id === artifact.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-3 pt-3 border-t border-border/50"
                          >
                            {artifact.hash && (
                              <div className="flex items-center gap-2 mb-2">
                                <Hash className="h-3 w-3 text-muted-foreground" />
                                <span className="text-xs font-mono text-muted-foreground">{artifact.hash}</span>
                              </div>
                            )}
                            <div className="grid grid-cols-2 gap-2">
                              {Object.entries(artifact.details).map(([key, value]) => (
                                <div key={key} className="text-xs">
                                  <span className="text-muted-foreground">{key}: </span>
                                  <span className="font-mono">{value}</span>
                                </div>
                              ))}
                            </div>
                            <div className="flex gap-2 mt-3">
                              <Button size="sm" variant="outline">
                                <Eye className="h-3 w-3 mr-1" />
                                Analyze
                              </Button>
                              <Button size="sm" variant="outline">
                                <Lock className="h-3 w-3 mr-1" />
                                Quarantine
                              </Button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="timeline" className="p-4">
            {/* Playback Controls */}
            <div className="flex items-center gap-4 mb-4 p-3 bg-background/50 rounded-lg border border-border/50">
              <Button
                size="sm"
                variant={isPlaying ? 'destructive' : 'cyber'}
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setTimelinePosition(Math.min(timelinePosition + 1, timeline.length - 1))}
              >
                <SkipForward className="h-4 w-4" />
              </Button>
              <Progress value={(timelinePosition / (timeline.length - 1)) * 100} className="flex-1 h-2" />
              <span className="text-xs text-muted-foreground font-mono">
                {timelinePosition + 1} / {timeline.length}
              </span>
            </div>

            <ScrollArea className="h-[350px]">
              <div className="relative pl-8">
                <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-border" />
                
                {timeline.map((event, i) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0.3 }}
                    animate={{ opacity: i <= timelinePosition ? 1 : 0.3 }}
                    className="relative pb-6"
                  >
                    <div className={`absolute left-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      i <= timelinePosition
                        ? event.severity === 'critical'
                          ? 'bg-red-500 border-red-500'
                          : event.severity === 'warning'
                          ? 'bg-yellow-500 border-yellow-500'
                          : 'bg-blue-500 border-blue-500'
                        : 'bg-background border-border'
                    }`}>
                      {i <= timelinePosition && (
                        <CheckCircle className="h-3 w-3 text-background" />
                      )}
                    </div>
                    
                    <div className="ml-10 p-3 bg-background/50 rounded-lg border border-border/50">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-muted-foreground font-mono">
                          {new Date(event.timestamp).toLocaleString()}
                        </span>
                        <Badge className={getSeverityColor(event.severity)}>
                          {event.severity}
                        </Badge>
                      </div>
                      <h4 className="font-semibold text-sm">{event.action}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{event.details}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Network className="h-3 w-3" />
                          {event.source}
                        </span>
                        {event.destination && (
                          <span className="flex items-center gap-1">
                            → {event.destination}
                          </span>
                        )}
                        {event.user && (
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {event.user}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="memory" className="p-4">
            <ScrollArea className="h-[400px]">
              <div className="space-y-3">
                {memoryAnalysis.map((proc, index) => (
                  <motion.div
                    key={proc.pid}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 bg-background/50 rounded-lg border border-border/50"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Cpu className="h-5 w-5 text-primary" />
                        <div>
                          <span className="font-semibold">{proc.processName}</span>
                          <span className="text-xs text-muted-foreground ml-2">PID: {proc.pid}</span>
                        </div>
                      </div>
                      <Badge className={getStatusColor(proc.status)}>
                        {proc.status}
                      </Badge>
                    </div>
                    
                    <div className="text-xs font-mono text-muted-foreground mb-3 bg-black/50 p-2 rounded">
                      {proc.cmdLine}
                    </div>
                    
                    {proc.injectedDlls.length > 0 && (
                      <div className="mb-3">
                        <h5 className="text-xs font-semibold text-red-500 mb-1">Injected DLLs:</h5>
                        <div className="flex flex-wrap gap-1">
                          {proc.injectedDlls.map((dll, i) => (
                            <Badge key={i} variant="destructive" className="text-xs">
                              {dll}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {proc.networkConnections.length > 0 && (
                      <div>
                        <h5 className="text-xs font-semibold text-muted-foreground mb-1">Network Connections:</h5>
                        <div className="space-y-1">
                          {proc.networkConnections.map((conn, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs font-mono">
                              <Globe className="h-3 w-3 text-primary" />
                              <span>{conn.ip}:{conn.port}</span>
                              <Badge variant="outline" className="text-xs">{conn.protocol}</Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="iocs" className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Extracted IOCs */}
              <div className="bg-background/50 rounded-lg border border-border/50 p-4">
                <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  Extracted IOCs
                </h4>
                <div className="space-y-2">
                  {[
                    { type: 'IP', value: '185.234.72.14', severity: 'critical' },
                    { type: 'IP', value: '45.142.213.56', severity: 'high' },
                    { type: 'Domain', value: 'secure-update.cloud', severity: 'critical' },
                    { type: 'Hash', value: 'a3f2b8c9d4e5f6a7...', severity: 'critical' },
                    { type: 'Email', value: 'hr-payroll@external.com', severity: 'warning' },
                  ].map((ioc, i) => (
                    <div key={i} className="flex items-center justify-between p-2 bg-black/20 rounded">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">{ioc.type}</Badge>
                        <span className="text-xs font-mono">{ioc.value}</span>
                      </div>
                      <Badge className={getStatusColor(ioc.severity === 'critical' ? 'malicious' : ioc.severity === 'high' ? 'suspicious' : 'analyzing')}>
                        {ioc.severity}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* Threat Intel Matches */}
              <div className="bg-background/50 rounded-lg border border-border/50 p-4">
                <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <Globe className="h-4 w-4 text-warning" />
                  Threat Intel Matches
                </h4>
                <div className="space-y-2">
                  {[
                    { source: 'VirusTotal', matches: 47, verdict: 'Malicious' },
                    { source: 'AbuseIPDB', matches: 89, verdict: 'Malicious' },
                    { source: 'AlienVault OTX', matches: 12, verdict: 'Known IOC' },
                    { source: 'MISP', matches: 3, verdict: 'APT-29' },
                  ].map((intel, i) => (
                    <div key={i} className="flex items-center justify-between p-2 bg-black/20 rounded">
                      <span className="text-sm">{intel.source}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">{intel.matches} hits</span>
                        <Badge variant="destructive" className="text-xs">{intel.verdict}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
