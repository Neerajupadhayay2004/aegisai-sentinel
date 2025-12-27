import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, AlertTriangle, Shield, Zap, Target, Brain, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ComposedChart
} from 'recharts';

// Generate predictive data
const generatePredictiveData = () => {
  const now = new Date();
  return [...Array(24)].map((_, i) => {
    const hour = new Date(now.getTime() + i * 3600000);
    const baseRisk = 45 + Math.sin(i / 3) * 20;
    return {
      time: hour.toLocaleTimeString('en-US', { hour: '2-digit' }),
      actual: i < 12 ? Math.floor(baseRisk + Math.random() * 15) : null,
      predicted: Math.floor(baseRisk + Math.random() * 10),
      confidence: 85 - (i * 2),
      attacks: Math.floor(Math.random() * 30 + 10),
    };
  });
};

const attackVectorData = [
  { vector: 'Phishing', current: 85, predicted: 92, change: 8 },
  { vector: 'Ransomware', current: 72, predicted: 78, change: 8 },
  { vector: 'DDoS', current: 45, predicted: 52, change: 16 },
  { vector: 'SQL Injection', current: 38, predicted: 35, change: -8 },
  { vector: 'Zero-Day', current: 28, predicted: 42, change: 50 },
  { vector: 'Insider Threat', current: 22, predicted: 28, change: 27 },
];

const radarData = [
  { subject: 'Network', A: 85, B: 92, fullMark: 100 },
  { subject: 'Endpoint', A: 78, B: 85, fullMark: 100 },
  { subject: 'Identity', A: 92, B: 88, fullMark: 100 },
  { subject: 'Cloud', A: 65, B: 78, fullMark: 100 },
  { subject: 'Data', A: 70, B: 82, fullMark: 100 },
  { subject: 'Application', A: 88, B: 90, fullMark: 100 },
];

const vulnerabilityForecast = [
  { name: 'Week 1', critical: 12, high: 28, medium: 45, low: 67 },
  { name: 'Week 2', critical: 15, high: 32, medium: 42, low: 58 },
  { name: 'Week 3', critical: 18, high: 38, medium: 48, low: 52 },
  { name: 'Week 4', critical: 22, high: 42, medium: 52, low: 48 },
];

export const RiskPredictionChart = () => {
  const [data, setData] = useState(generatePredictiveData());

  useEffect(() => {
    const interval = setInterval(() => {
      setData(generatePredictiveData());
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card variant="glass">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            AI Risk Prediction (24h)
          </div>
          <Badge variant="info" className="gap-1">
            <Activity className="h-3 w-3" />
            93% Accuracy
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <ComposedChart data={data}>
            <defs>
              <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={10} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--background))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
            />
            <Legend />
            <Area type="monotone" dataKey="actual" stroke="hsl(var(--primary))" fill="url(#colorActual)" name="Actual Risk" />
            <Line type="monotone" dataKey="predicted" stroke="hsl(var(--accent))" strokeWidth={2} strokeDasharray="5 5" name="Predicted Risk" dot={false} />
            <Bar dataKey="attacks" fill="hsl(var(--destructive))" opacity={0.3} name="Attack Count" />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export const AttackVectorForecast = () => {
  return (
    <Card variant="glass">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-destructive" />
          Attack Vector Forecast
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {attackVectorData.map((vector, i) => (
          <motion.div 
            key={vector.vector}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="space-y-1"
          >
            <div className="flex items-center justify-between text-sm">
              <span>{vector.vector}</span>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">{vector.current}%</span>
                <span className="text-primary">→</span>
                <span className={vector.change > 0 ? 'text-destructive' : 'text-success'}>
                  {vector.predicted}%
                </span>
                <Badge variant={vector.change > 20 ? 'critical' : vector.change > 0 ? 'high' : 'success'} className="text-[10px] px-1.5">
                  {vector.change > 0 ? '+' : ''}{vector.change}%
                </Badge>
              </div>
            </div>
            <div className="relative h-2 bg-secondary rounded-full overflow-hidden">
              <motion.div
                className="absolute h-full bg-muted-foreground/30 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${vector.current}%` }}
                transition={{ duration: 1, delay: i * 0.1 }}
              />
              <motion.div
                className={`absolute h-full rounded-full ${vector.change > 0 ? 'bg-destructive' : 'bg-success'}`}
                initial={{ width: 0 }}
                animate={{ width: `${vector.predicted}%` }}
                transition={{ duration: 1.2, delay: i * 0.1 }}
                style={{ opacity: 0.6 }}
              />
            </div>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
};

export const SecurityPostureRadar = () => {
  return (
    <Card variant="glass">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-success" />
            Security Posture Forecast
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <RadarChart data={radarData}>
            <PolarGrid stroke="hsl(var(--border))" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 9 }} />
            <Radar name="Current" dataKey="A" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.3} />
            <Radar name="Predicted" dataKey="B" stroke="hsl(var(--accent))" fill="hsl(var(--accent))" fillOpacity={0.3} />
            <Legend />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--background))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export const VulnerabilityTrend = () => {
  return (
    <Card variant="glass">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-warning" />
          Vulnerability Trend Forecast
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={vulnerabilityForecast}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--background))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
            />
            <Legend />
            <Area type="monotone" dataKey="critical" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} />
            <Area type="monotone" dataKey="high" stackId="1" stroke="#f97316" fill="#f97316" fillOpacity={0.6} />
            <Area type="monotone" dataKey="medium" stackId="1" stroke="#eab308" fill="#eab308" fillOpacity={0.6} />
            <Area type="monotone" dataKey="low" stackId="1" stroke="#22c55e" fill="#22c55e" fillOpacity={0.6} />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export const AIPredictionSummary = () => {
  const predictions = [
    { label: 'Ransomware Attack', probability: 78, timeframe: '48 hours', trend: 'up', action: 'Backup verification' },
    { label: 'Phishing Campaign', probability: 65, timeframe: '24 hours', trend: 'up', action: 'Email filter update' },
    { label: 'Data Breach Attempt', probability: 42, timeframe: '72 hours', trend: 'stable', action: 'Access review' },
    { label: 'DDoS Attack', probability: 35, timeframe: '1 week', trend: 'down', action: 'CDN scaling' },
  ];

  return (
    <Card variant="glass">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-accent" />
          AI Threat Predictions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {predictions.map((pred, i) => (
          <motion.div
            key={pred.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-3 rounded-lg bg-secondary/50 border border-border/50"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {pred.trend === 'up' ? (
                  <TrendingUp className="h-4 w-4 text-destructive" />
                ) : pred.trend === 'down' ? (
                  <TrendingDown className="h-4 w-4 text-success" />
                ) : (
                  <Activity className="h-4 w-4 text-warning" />
                )}
                <span className="font-medium text-sm">{pred.label}</span>
              </div>
              <Badge variant={pred.probability > 60 ? 'critical' : pred.probability > 40 ? 'high' : 'medium'}>
                {pred.probability}%
              </Badge>
            </div>
            <Progress value={pred.probability} className="h-1.5 mb-2" />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>⏱️ {pred.timeframe}</span>
              <span>💡 {pred.action}</span>
            </div>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
};
