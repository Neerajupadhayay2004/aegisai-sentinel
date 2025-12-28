import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  Brain, 
  Zap, 
  Activity, 
  Lock, 
  Unlock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Eye,
  Server,
  Globe,
  Cpu
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface FirewallRule {
  id: string;
  name: string;
  type: 'allow' | 'block' | 'monitor';
  source: string;
  destination: string;
  port: string;
  protocol: string;
  hits: number;
  lastHit: Date;
  aiConfidence: number;
  status: 'active' | 'disabled' | 'learning';
}

interface ThreatPattern {
  id: string;
  pattern: string;
  detections: number;
  severity: 'critical' | 'high' | 'medium' | 'low';
  blocked: number;
  accuracy: number;
}

interface AIAnalysis {
  overallScore: number;
  threats: {
    detected: number;
    blocked: number;
    investigating: number;
  };
  recommendations: string[];
  anomalies: {
    type: string;
    count: number;
    severity: 'critical' | 'high' | 'medium' | 'low';
  }[];
}

const generateFirewallRules = (): FirewallRule[] => [
  { id: '1', name: 'Block Known Malware IPs', type: 'block', source: 'External', destination: 'All', port: '*', protocol: 'TCP/UDP', hits: 15847, lastHit: new Date(), aiConfidence: 98, status: 'active' },
  { id: '2', name: 'Allow HTTPS Traffic', type: 'allow', source: 'Any', destination: 'Web Servers', port: '443', protocol: 'TCP', hits: 2847562, lastHit: new Date(), aiConfidence: 100, status: 'active' },
  { id: '3', name: 'Monitor Unusual Patterns', type: 'monitor', source: 'Internal', destination: 'External', port: '*', protocol: 'All', hits: 847, lastHit: new Date(), aiConfidence: 75, status: 'learning' },
  { id: '4', name: 'Block SQL Injection Attempts', type: 'block', source: 'External', destination: 'Database', port: '3306', protocol: 'TCP', hits: 3421, lastHit: new Date(), aiConfidence: 95, status: 'active' },
  { id: '5', name: 'Rate Limit API Calls', type: 'monitor', source: 'Any', destination: 'API Gateway', port: '8080', protocol: 'TCP', hits: 98456, lastHit: new Date(), aiConfidence: 88, status: 'active' },
  { id: '6', name: 'Block Crypto Mining', type: 'block', source: 'Any', destination: 'Any', port: '*', protocol: 'All', hits: 542, lastHit: new Date(), aiConfidence: 92, status: 'active' },
];

const generateThreatPatterns = (): ThreatPattern[] => [
  { id: '1', pattern: 'DDoS Signature #4521', detections: 1284, severity: 'critical', blocked: 1280, accuracy: 99.7 },
  { id: '2', pattern: 'SQL Injection Vector', detections: 856, severity: 'high', blocked: 852, accuracy: 99.5 },
  { id: '3', pattern: 'XSS Payload Pattern', detections: 423, severity: 'high', blocked: 420, accuracy: 99.3 },
  { id: '4', pattern: 'Brute Force Signature', detections: 2156, severity: 'medium', blocked: 2150, accuracy: 99.7 },
  { id: '5', pattern: 'Port Scan Detection', detections: 678, severity: 'low', blocked: 670, accuracy: 98.8 },
];

const severityColors = {
  critical: 'text-red-500 bg-red-500/10 border-red-500/30',
  high: 'text-orange-500 bg-orange-500/10 border-orange-500/30',
  medium: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30',
  low: 'text-green-500 bg-green-500/10 border-green-500/30',
};

export const AIFirewallAnalysis = () => {
  const [rules, setRules] = useState<FirewallRule[]>(generateFirewallRules());
  const [patterns, setPatterns] = useState<ThreatPattern[]>(generateThreatPatterns());
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AIAnalysis>({
    overallScore: 94,
    threats: { detected: 5284, blocked: 5178, investigating: 106 },
    recommendations: [
      'Enable geo-blocking for high-risk regions',
      'Update DDoS protection rules',
      'Review API rate limiting thresholds',
      'Enable deep packet inspection for encrypted traffic',
    ],
    anomalies: [
      { type: 'Unusual outbound traffic', count: 23, severity: 'high' },
      { type: 'Failed authentication spike', count: 156, severity: 'medium' },
      { type: 'New IP addresses detected', count: 47, severity: 'low' },
    ],
  });

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRules(prev => prev.map(rule => ({
        ...rule,
        hits: rule.hits + Math.floor(Math.random() * 10),
        lastHit: new Date(),
      })));

      setPatterns(prev => prev.map(pattern => ({
        ...pattern,
        detections: pattern.detections + Math.floor(Math.random() * 5),
        blocked: pattern.blocked + Math.floor(Math.random() * 5),
      })));

      setAnalysis(prev => ({
        ...prev,
        threats: {
          detected: prev.threats.detected + Math.floor(Math.random() * 3),
          blocked: prev.threats.blocked + Math.floor(Math.random() * 3),
          investigating: Math.max(0, prev.threats.investigating + (Math.random() > 0.5 ? 1 : -1)),
        },
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const runAIAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setAnalysis(prev => ({
        ...prev,
        overallScore: Math.min(100, prev.overallScore + Math.floor(Math.random() * 3)),
      }));
      setIsAnalyzing(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="h-6 w-6 text-primary" />
            <span className="text-gradient-cyber">AI-Powered</span> Firewall Analysis
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Machine learning threat detection and autonomous response system
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="active" className="gap-2">
            <Shield className="h-3 w-3" />
            Firewall Active
          </Badge>
          <Button 
            variant="cyber" 
            size="sm" 
            onClick={runAIAnalysis}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
            ) : (
              <Brain className="h-4 w-4 mr-1" />
            )}
            {isAnalyzing ? 'Analyzing...' : 'Run AI Analysis'}
          </Button>
        </div>
      </div>

      {/* Score Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card/60 backdrop-blur-sm border border-border/50 rounded-xl p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <Shield className="h-4 w-4 text-primary" />
            <span className="text-xs text-muted-foreground">Security Score</span>
          </div>
          <div className="text-3xl font-bold text-primary">{analysis.overallScore}%</div>
          <Progress value={analysis.overallScore} className="mt-2 h-1.5" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-card/60 backdrop-blur-sm border border-border/50 rounded-xl p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <Eye className="h-4 w-4 text-warning" />
            <span className="text-xs text-muted-foreground">Detected</span>
          </div>
          <div className="text-3xl font-bold text-foreground">
            {analysis.threats.detected.toLocaleString()}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-success/10 border border-success/30 rounded-xl p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="h-4 w-4 text-success" />
            <span className="text-xs text-muted-foreground">Blocked</span>
          </div>
          <div className="text-3xl font-bold text-success">
            {analysis.threats.blocked.toLocaleString()}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-warning/10 border border-warning/30 rounded-xl p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <Activity className="h-4 w-4 text-warning animate-pulse" />
            <span className="text-xs text-muted-foreground">Investigating</span>
          </div>
          <div className="text-3xl font-bold text-warning">
            {analysis.threats.investigating}
          </div>
        </motion.div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Firewall Rules */}
        <Card variant="glass" className="xl:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-primary" />
                Active Firewall Rules
              </div>
              <Badge variant="outline" className="text-xs">
                {rules.length} Rules
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 max-h-[400px] overflow-y-auto scrollbar-cyber">
            {rules.map((rule, i) => (
              <motion.div
                key={rule.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="p-3 rounded-lg bg-secondary/30 border border-border/50"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    {rule.type === 'block' ? (
                      <XCircle className="h-4 w-4 text-destructive" />
                    ) : rule.type === 'allow' ? (
                      <CheckCircle className="h-4 w-4 text-success" />
                    ) : (
                      <Eye className="h-4 w-4 text-warning" />
                    )}
                    <span className="font-medium text-sm">{rule.name}</span>
                  </div>
                  <Badge 
                    variant={rule.status === 'active' ? 'success' : rule.status === 'learning' ? 'info' : 'outline'}
                    className="text-[10px]"
                  >
                    {rule.status}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Globe className="h-3 w-3" />
                    <span>{rule.source} → {rule.destination}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Server className="h-3 w-3" />
                    <span>Port: {rule.port}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Activity className="h-3 w-3" />
                    <span>{rule.hits.toLocaleString()} hits</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Cpu className="h-3 w-3" />
                    <span className="text-primary">{rule.aiConfidence}% confidence</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>

        {/* Threat Patterns */}
        <Card variant="glass">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              Detected Patterns
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {patterns.map((pattern, i) => (
              <motion.div
                key={pattern.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`p-3 rounded-lg border ${severityColors[pattern.severity]}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{pattern.pattern}</span>
                  <Badge variant={pattern.severity} className="text-[10px]">
                    {pattern.severity}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{pattern.detections} detected</span>
                  <span className="text-success">{pattern.blocked} blocked</span>
                  <span>{pattern.accuracy}% accuracy</span>
                </div>
                <Progress value={pattern.accuracy} className="mt-2 h-1" />
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* AI Recommendations */}
      <Card variant="glass">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary animate-pulse" />
            AI Security Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {analysis.recommendations.map((rec, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-4 rounded-lg bg-primary/5 border border-primary/20 hover:border-primary/40 transition-colors cursor-pointer"
              >
                <div className="flex items-start gap-2">
                  <Zap className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{rec}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Anomalies */}
          <div className="mt-6">
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Activity className="h-4 w-4 text-warning" />
              Detected Anomalies
            </h3>
            <div className="flex flex-wrap gap-3">
              {analysis.anomalies.map((anomaly, i) => (
                <Badge 
                  key={i} 
                  variant={anomaly.severity}
                  className="py-1.5 px-3"
                >
                  {anomaly.type}: {anomaly.count}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
