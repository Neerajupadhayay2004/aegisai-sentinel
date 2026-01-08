import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  AlertTriangle,
  Activity,
  Server,
  Wifi,
  Zap,
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { ThreatCard } from '@/components/dashboard/ThreatCard';
import { RadarScanner } from '@/components/dashboard/RadarScanner';
import { ThreatChart, ThreatDistributionChart, ComplianceChart } from '@/components/dashboard/Charts';
import { LiveScanStatus } from '@/components/dashboard/LiveScanStatus';
import { AISecurityChat } from '@/components/dashboard/AISecurityChat';
import { EnhancedGlobalMap } from '@/components/dashboard/EnhancedGlobalMap';
import { GeolocationBlocking } from '@/components/dashboard/GeolocationBlocking';
import { AudioControlPanel } from '@/components/dashboard/AudioControlPanel';
import { RealTimeThreatFeed } from '@/components/dashboard/RealTimeThreatFeed';
import { DarkWebMonitoring } from '@/components/dashboard/DarkWebMonitoring';
import { AutomatedResponseSystem } from '@/components/dashboard/AutomatedResponseSystem';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { mockThreats, generateLiveMetrics } from '@/lib/mockData';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [metrics, setMetrics] = useState(generateLiveMetrics());
  const [activeThreats, setActiveThreats] = useState(mockThreats.filter(t => t.status === 'active'));
  const { toast } = useToast();

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(generateLiveMetrics());
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleMitigate = (threatId: string) => {
    setActiveThreats(prev => prev.filter(t => t.id !== threatId));
    toast({
      title: "Threat Mitigated",
      description: "Automated response initiated. Endpoint isolated and credentials revoked.",
    });
  };

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              <span className="text-gradient-cyber">Live Threat</span> Dashboard
            </h1>
            <p className="text-muted-foreground">
              Real-time security monitoring and autonomous threat response
            </p>
          </div>
          <div className="flex items-center gap-3">
            <AudioControlPanel compact />
            <Badge variant="active" className="px-4 py-2 text-sm gap-2">
              <span className="w-2 h-2 bg-current rounded-full animate-pulse" />
              {activeThreats.length} Active Threats
            </Badge>
            <Button variant="cyber">
              <Zap className="h-4 w-4 mr-2" />
              Auto Response
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Threats Blocked"
          value={metrics.threatsBlocked}
          change={12}
          trend="up"
          icon={Shield}
          variant="success"
          subtitle="Last 24 hours"
        />
        <StatCard
          title="Risk Score"
          value={`${metrics.riskScore}/100`}
          change={-5}
          trend="down"
          icon={AlertTriangle}
          variant={metrics.riskScore > 70 ? 'danger' : metrics.riskScore > 50 ? 'warning' : 'success'}
          subtitle="Organization-wide"
        />
        <StatCard
          title="Endpoints Monitored"
          value={metrics.endpointsMonitored}
          change={2}
          trend="up"
          icon={Server}
          subtitle="99.1% online"
        />
        <StatCard
          title="Network Traffic"
          value={`${(metrics.networkTraffic / 1000).toFixed(1)}k`}
          change={8}
          trend="up"
          icon={Wifi}
          subtitle="Requests/min"
        />
      </div>

      {/* Global Threat Map Section */}
      <div className="mb-8">
        <EnhancedGlobalMap />
      </div>

      {/* Dark Web & Automated Response */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
        <DarkWebMonitoring />
        <AutomatedResponseSystem />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
        {/* Radar & Scanning Status */}
        <div className="xl:col-span-1 space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card variant="glass" className="overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary animate-pulse" />
                  Network Radar
                </CardTitle>
              </CardHeader>
              <CardContent className="flex justify-center py-4">
                <RadarScanner size={280} isScanning={true} />
              </CardContent>
            </Card>
          </motion.div>

          <LiveScanStatus />
        </div>

        {/* Charts */}
        <div className="xl:col-span-2 space-y-6">
          <ThreatChart />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ThreatDistributionChart />
            <ComplianceChart />
          </div>
        </div>
      </div>

      {/* Real-Time Threats & Geolocation Blocking */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
        <div className="xl:col-span-2">
          <RealTimeThreatFeed maxThreats={15} />
        </div>
        <div>
          <GeolocationBlocking />
        </div>
      </div>

      {/* Active Threats & AI Chat */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Active Threats */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card variant="glass">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    Active Threats
                  </div>
                  <Button variant="outline" size="sm">View All</Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 max-h-[600px] overflow-y-auto scrollbar-cyber">
                {activeThreats.length > 0 ? (
                  activeThreats.map((threat) => (
                    <ThreatCard
                      key={threat.id}
                      threat={threat}
                      onMitigate={() => handleMitigate(threat.id)}
                    />
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Shield className="h-12 w-12 text-success mx-auto mb-4" />
                    <p className="text-lg font-medium text-success">All Clear</p>
                    <p className="text-sm text-muted-foreground">No active threats detected</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* AI Chat */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <AISecurityChat />
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
