import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AISecurityChatLive } from '@/components/dashboard/AISecurityChatLive';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Brain, Zap, Shield, Target, FileSearch, Activity } from 'lucide-react';

const capabilities = [
  { icon: Shield, title: 'Threat Analysis', desc: 'Deep analysis with MITRE ATT&CK mapping' },
  { icon: Target, title: 'Attack Prediction', desc: 'AI-powered threat forecasting' },
  { icon: FileSearch, title: 'Log Analysis', desc: 'Parse and analyze security logs' },
  { icon: Activity, title: 'Real-time Monitoring', desc: 'Live threat intelligence' },
];

const Assistant = () => (
  <DashboardLayout>
    <div className="mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gradient-cyber">AI Security Assistant</h1>
          <p className="text-muted-foreground mt-2">Powered by Google Gemini for advanced threat intelligence</p>
        </div>
        <Badge variant="active" className="gap-2 px-4 py-2">
          <Zap className="h-4 w-4" />
          Gemini 2.5 Pro Active
        </Badge>
      </div>
    </div>

    {/* Capabilities Grid */}
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {capabilities.map((cap, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <Card variant="glass" className="h-full">
            <CardContent className="p-4 flex items-start gap-3">
              <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                <cap.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">{cap.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{cap.desc}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>

    {/* AI Chat Interface */}
    <div className="h-[calc(100vh-320px)] min-h-[500px]">
      <AISecurityChatLive />
    </div>
  </DashboardLayout>
);

export default Assistant;
