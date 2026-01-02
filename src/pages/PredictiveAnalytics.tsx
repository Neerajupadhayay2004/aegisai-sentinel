import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AdvancedWorldMap } from '@/components/dashboard/AdvancedWorldMap';
import { AIFirewallAnalysis } from '@/components/dashboard/AIFirewallAnalysis';
import { NetworkTrafficAnalysis } from '@/components/dashboard/NetworkTrafficAnalysis';
import { ThreatIntelligenceFeeds } from '@/components/dashboard/ThreatIntelligenceFeeds';
import { RiskPredictionChart, AttackVectorForecast, SecurityPostureRadar, VulnerabilityTrend, AIPredictionSummary } from '@/components/dashboard/PredictiveCharts';
import { AISecurityChatLive } from '@/components/dashboard/AISecurityChatLive';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { Brain, Globe, TrendingUp, Network, Shield, Activity } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const PredictiveAnalytics = () => {
  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              <span className="text-gradient-cyber">Predictive</span> Analytics
            </h1>
            <p className="text-muted-foreground">
              AI-powered threat forecasting and global attack intelligence
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="info" className="px-4 py-2 text-sm gap-2">
              <Brain className="h-4 w-4" />
              AI Model Active
            </Badge>
            <Badge variant="active" className="px-4 py-2 text-sm gap-2">
              <Globe className="h-4 w-4" />
              Live Monitoring
            </Badge>
          </div>
        </motion.div>
      </div>

      {/* Tabbed Interface */}
      <Tabs defaultValue="map" className="space-y-6">
        <TabsList className="grid w-full max-w-2xl grid-cols-4">
          <TabsTrigger value="map" className="gap-2">
            <Globe className="h-4 w-4" />
            Global Map
          </TabsTrigger>
          <TabsTrigger value="network" className="gap-2">
            <Network className="h-4 w-4" />
            Network
          </TabsTrigger>
          <TabsTrigger value="intel" className="gap-2">
            <Shield className="h-4 w-4" />
            Threat Intel
          </TabsTrigger>
          <TabsTrigger value="analytics" className="gap-2">
            <Activity className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* Global Threat Map Tab */}
        <TabsContent value="map" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <AdvancedWorldMap />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <AIFirewallAnalysis />
          </motion.div>
        </TabsContent>

        {/* Network Traffic Tab */}
        <TabsContent value="network">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <NetworkTrafficAnalysis />
          </motion.div>
        </TabsContent>

        {/* Threat Intelligence Tab */}
        <TabsContent value="intel">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <ThreatIntelligenceFeeds />
          </motion.div>
        </TabsContent>

        {/* Predictive Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          {/* Charts Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <RiskPredictionChart />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <SecurityPostureRadar />
            </motion.div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <AttackVectorForecast />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <VulnerabilityTrend />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              <AIPredictionSummary />
            </motion.div>
          </div>
        </TabsContent>
      </Tabs>

      {/* AI Chat - Always visible */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="mt-8">
        <AISecurityChatLive threatContext={{ activeThreats: 6, riskScore: 72, recentIncidents: ['Ransomware', 'Brute Force', 'Data Exfiltration'] }} />
      </motion.div>
    </DashboardLayout>
  );
};

export default PredictiveAnalytics;
