import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { RadarScanner } from '@/components/dashboard/RadarScanner';
import { LiveScanStatus } from '@/components/dashboard/LiveScanStatus';
import { VulnerabilityScanner } from '@/components/dashboard/VulnerabilityScanner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  Scan, Shield, AlertTriangle, CheckCircle, Clock,
  Server, Globe, Database, Cloud, Wifi, Play, Pause,
  RefreshCw, FileSearch, Bug, Lock, Activity, Zap
} from 'lucide-react';

interface ScanResult {
  id: string;
  type: string;
  target: string;
  status: 'completed' | 'in_progress' | 'queued' | 'failed';
  findings: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  startTime: Date;
  duration?: string;
}

const mockScanResults: ScanResult[] = [
  { id: '1', type: 'Network Scan', target: '10.0.0.0/24', status: 'completed', findings: 47, critical: 3, high: 8, medium: 21, low: 15, startTime: new Date(Date.now() - 3600000), duration: '12m 34s' },
  { id: '2', type: 'Vulnerability Scan', target: 'Production Servers', status: 'in_progress', findings: 23, critical: 1, high: 5, medium: 10, low: 7, startTime: new Date(Date.now() - 600000) },
  { id: '3', type: 'Cloud Security', target: 'AWS Infrastructure', status: 'completed', findings: 18, critical: 0, high: 3, medium: 8, low: 7, startTime: new Date(Date.now() - 7200000), duration: '8m 12s' },
  { id: '4', type: 'Compliance Audit', target: 'SOC 2 Type II', status: 'queued', findings: 0, critical: 0, high: 0, medium: 0, low: 0, startTime: new Date() },
];

const scanTypes = [
  { id: 'network', name: 'Network Scan', icon: Wifi, desc: 'Scan network for open ports and services' },
  { id: 'vulnerability', name: 'Vulnerability Scan', icon: Bug, desc: 'Detect known CVEs and weaknesses' },
  { id: 'cloud', name: 'Cloud Security', icon: Cloud, desc: 'Audit cloud configurations' },
  { id: 'compliance', name: 'Compliance Audit', icon: FileSearch, desc: 'Check regulatory compliance' },
  { id: 'identity', name: 'Identity Audit', icon: Lock, desc: 'Review access and permissions' },
  { id: 'malware', name: 'Malware Scan', icon: Shield, desc: 'Detect malicious software' },
];

const Scanning = () => {
  const [isScanning, setIsScanning] = useState(true);
  const [scanProgress, setScanProgress] = useState(67);
  const [scanResults, setScanResults] = useState(mockScanResults);
  const [analyzing, setAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (isScanning && scanProgress < 100) {
      const interval = setInterval(() => {
        setScanProgress(prev => Math.min(prev + Math.random() * 2, 100));
      }, 500);
      return () => clearInterval(interval);
    }
  }, [isScanning, scanProgress]);

  const startScan = (type: string) => {
    setIsScanning(true);
    setScanProgress(0);
    toast({
      title: "Scan Started",
      description: `${type} initiated. This may take a few minutes.`,
    });
  };

  const analyzeWithAI = async () => {
    setAnalyzing(true);
    setAiAnalysis(null);
    
    try {
      const response = await supabase.functions.invoke('threat-analysis', {
        body: {
          threatData: {
            title: 'Security Scan Results Analysis',
            severity: 'high',
            description: `Analysis of ${scanResults.length} scan results with ${scanResults.reduce((a, b) => a + b.critical, 0)} critical findings`,
            source: 'Automated Scanning',
            scanResults: scanResults.map(s => ({
              type: s.type,
              findings: s.findings,
              critical: s.critical,
              high: s.high
            }))
          }
        }
      });

      if (response.data?.analysis) {
        setAiAnalysis(response.data.analysis.recommendations?.join('\n\n') || 'Analysis complete. Review findings for details.');
      }
    } catch (error) {
      toast({
        title: "Analysis Error",
        description: "Failed to analyze with AI. Please try again.",
        variant: "destructive",
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      completed: { variant: 'success', icon: CheckCircle },
      in_progress: { variant: 'warning', icon: RefreshCw },
      queued: { variant: 'secondary', icon: Clock },
      failed: { variant: 'destructive', icon: AlertTriangle },
    };
    const { variant, icon: Icon } = variants[status] || variants.queued;
    return (
      <Badge variant={variant} className="gap-1">
        <Icon className={`h-3 w-3 ${status === 'in_progress' ? 'animate-spin' : ''}`} />
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gradient-cyber">Network Scanning</h1>
          <p className="text-muted-foreground mt-2">Comprehensive security scanning and vulnerability detection</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant={isScanning ? "destructive" : "cyber"} 
            onClick={() => setIsScanning(!isScanning)}
            className="gap-2"
          >
            {isScanning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {isScanning ? 'Pause Scan' : 'Resume Scan'}
          </Button>
          <Button 
            variant="outline" 
            onClick={analyzeWithAI}
            disabled={analyzing}
            className="gap-2"
          >
            {analyzing ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <Zap className="h-4 w-4" />
            )}
            AI Analysis
          </Button>
        </div>
      </div>

      {/* Scan Progress Overview */}
      <Card variant="glass" className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row items-center gap-6">
            <div className="flex-shrink-0">
              <RadarScanner size={200} isScanning={isScanning} />
            </div>
            <div className="flex-1 w-full">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Current Scan Progress</span>
                <span className="text-sm text-muted-foreground">{Math.round(scanProgress)}%</span>
              </div>
              <Progress value={scanProgress} className="h-3 mb-4" />
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-secondary/30 rounded-lg">
                  <p className="text-2xl font-bold text-destructive">4</p>
                  <p className="text-xs text-muted-foreground">Critical</p>
                </div>
                <div className="text-center p-3 bg-secondary/30 rounded-lg">
                  <p className="text-2xl font-bold text-orange-500">16</p>
                  <p className="text-xs text-muted-foreground">High</p>
                </div>
                <div className="text-center p-3 bg-secondary/30 rounded-lg">
                  <p className="text-2xl font-bold text-warning">39</p>
                  <p className="text-xs text-muted-foreground">Medium</p>
                </div>
                <div className="text-center p-3 bg-secondary/30 rounded-lg">
                  <p className="text-2xl font-bold text-success">29</p>
                  <p className="text-xs text-muted-foreground">Low</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Analysis Result */}
      <AnimatePresence>
        {aiAnalysis && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6"
          >
            <Card variant="glass" className="border-primary/30">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Zap className="h-4 w-4 text-primary" />
                  AI Security Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground whitespace-pre-line">{aiAnalysis}</p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <Tabs defaultValue="vulnerability" className="space-y-6">
        <TabsList className="grid w-full max-w-2xl grid-cols-4">
          <TabsTrigger value="vulnerability" className="gap-2">
            <Bug className="h-4 w-4" />
            CVE Scanner
          </TabsTrigger>
          <TabsTrigger value="results" className="gap-2">
            <Activity className="h-4 w-4" />
            Results
          </TabsTrigger>
          <TabsTrigger value="quick-scan" className="gap-2">
            <Scan className="h-4 w-4" />
            Quick Scans
          </TabsTrigger>
          <TabsTrigger value="live" className="gap-2">
            <Wifi className="h-4 w-4" />
            Live Status
          </TabsTrigger>
        </TabsList>

        <TabsContent value="vulnerability">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <VulnerabilityScanner />
          </motion.div>
        </TabsContent>

        <TabsContent value="results">
          <Card variant="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileSearch className="h-5 w-5 text-primary" />
                Recent Scan Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {scanResults.map((scan, i) => (
                  <motion.div
                    key={scan.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-4 bg-secondary/30 rounded-lg"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{scan.type}</h3>
                          {getStatusBadge(scan.status)}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">Target: {scan.target}</p>
                        {scan.duration && (
                          <p className="text-xs text-muted-foreground">Duration: {scan.duration}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          {scan.critical > 0 && (
                            <Badge variant="critical" className="text-xs">{scan.critical} Critical</Badge>
                          )}
                          {scan.high > 0 && (
                            <Badge variant="destructive" className="text-xs">{scan.high} High</Badge>
                          )}
                          <span className="text-sm text-muted-foreground">{scan.findings} total</span>
                        </div>
                        <Button variant="outline" size="sm">View Details</Button>
                      </div>
                    </div>
                    {scan.status === 'in_progress' && (
                      <Progress value={67} className="h-1 mt-3" />
                    )}
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quick-scan">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {scanTypes.map((scanType, i) => (
              <motion.div
                key={scanType.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card variant="glass" className="cursor-pointer hover:border-primary/50 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <scanType.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{scanType.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{scanType.desc}</p>
                        <Button 
                          size="sm" 
                          variant="cyber" 
                          className="mt-3"
                          onClick={() => startScan(scanType.name)}
                        >
                          <Play className="h-3 w-3 mr-1" />
                          Start Scan
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="live">
          <LiveScanStatus />
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default Scanning;
