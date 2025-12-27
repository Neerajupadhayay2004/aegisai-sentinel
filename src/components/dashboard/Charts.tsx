import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const generateTimeSeriesData = () => {
  return Array.from({ length: 24 }, (_, i) => ({
    time: `${i.toString().padStart(2, '0')}:00`,
    threats: Math.floor(Math.random() * 50) + 10,
    blocked: Math.floor(Math.random() * 40) + 5,
    anomalies: Math.floor(Math.random() * 20) + 2,
  }));
};

const threatDistribution = [
  { name: 'Ransomware', value: 25, color: '#ef4444' },
  { name: 'Phishing', value: 35, color: '#f97316' },
  { name: 'DDoS', value: 15, color: '#eab308' },
  { name: 'Malware', value: 20, color: '#00d4aa' },
  { name: 'Other', value: 5, color: '#6366f1' },
];

export const ThreatChart = () => {
  const [data, setData] = useState(generateTimeSeriesData());

  useEffect(() => {
    const interval = setInterval(() => {
      setData((prev) => {
        const newData = [...prev.slice(1)];
        const lastTime = parseInt(prev[prev.length - 1].time.split(':')[0]);
        newData.push({
          time: `${((lastTime + 1) % 24).toString().padStart(2, '0')}:00`,
          threats: Math.floor(Math.random() * 50) + 10,
          blocked: Math.floor(Math.random() * 40) + 5,
          anomalies: Math.floor(Math.random() * 20) + 2,
        });
        return newData;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card variant="glass" className="h-full">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <span>Threat Activity</span>
            <span className="text-xs text-muted-foreground font-normal">(Last 24h)</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorThreats" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorBlocked" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00d4aa" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#00d4aa" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 47%, 18%)" />
                <XAxis
                  dataKey="time"
                  stroke="hsl(215, 20%, 55%)"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="hsl(215, 20%, 55%)"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(222, 47%, 8%)',
                    border: '1px solid hsl(222, 47%, 18%)',
                    borderRadius: '8px',
                    color: 'hsl(210, 40%, 98%)',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="threats"
                  stroke="#ef4444"
                  strokeWidth={2}
                  fill="url(#colorThreats)"
                />
                <Area
                  type="monotone"
                  dataKey="blocked"
                  stroke="#00d4aa"
                  strokeWidth={2}
                  fill="url(#colorBlocked)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-destructive" />
              <span className="text-sm text-muted-foreground">Threats Detected</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary" />
              <span className="text-sm text-muted-foreground">Threats Blocked</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export const ThreatDistributionChart = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Card variant="glass" className="h-full">
        <CardHeader className="pb-2">
          <CardTitle>Threat Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={threatDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {threatDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(222, 47%, 8%)',
                    border: '1px solid hsl(222, 47%, 18%)',
                    borderRadius: '8px',
                    color: 'hsl(210, 40%, 98%)',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {threatDistribution.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-xs text-muted-foreground">{item.name}</span>
                <span className="text-xs font-semibold ml-auto">{item.value}%</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export const ComplianceChart = () => {
  const complianceData = [
    { name: 'SOC 2', score: 87, color: '#00d4aa' },
    { name: 'ISO 27001', score: 92, color: '#00d4aa' },
    { name: 'GDPR', score: 78, color: '#eab308' },
    { name: 'HIPAA', score: 94, color: '#00d4aa' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <Card variant="glass" className="h-full">
        <CardHeader className="pb-2">
          <CardTitle>Compliance Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={complianceData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 47%, 18%)" />
                <XAxis type="number" domain={[0, 100]} stroke="hsl(215, 20%, 55%)" fontSize={10} />
                <YAxis dataKey="name" type="category" stroke="hsl(215, 20%, 55%)" fontSize={10} width={70} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(222, 47%, 8%)',
                    border: '1px solid hsl(222, 47%, 18%)',
                    borderRadius: '8px',
                    color: 'hsl(210, 40%, 98%)',
                  }}
                />
                <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                  {complianceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
