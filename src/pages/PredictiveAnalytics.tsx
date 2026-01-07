import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { GlobalThreatMapAdvanced } from '@/components/dashboard/GlobalThreatMapAdvanced';
import { AIFirewallAnalysis } from '@/components/dashboard/AIFirewallAnalysis';
import { NetworkTrafficAnalysis } from '@/components/dashboard/NetworkTrafficAnalysis';
import { ThreatIntelligenceFeeds } from '@/components/dashboard/ThreatIntelligenceFeeds';
import { RiskPredictionChart, AttackVectorForecast, SecurityPostureRadar, VulnerabilityTrend, AIPredictionSummary } from '@/components/dashboard/PredictiveCharts';
import { AISecurityChatLive } from '@/components/dashboard/AISecurityChatLive';
import { AzureSecurityHub } from '@/components/dashboard/AzureSecurityHub';
import { BlockchainSecurityModule } from '@/components/dashboard/BlockchainSecurityModule';
import { SecurityAlertCenter } from '@/components/dashboard/SecurityAlertCenter';
import { ThreatHuntingAdvanced } from '@/components/dashboard/ThreatHuntingAdvanced';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { Brain, Globe, TrendingUp, Network, Shield, Activity, Cloud, Link2, Bell, Crosshair } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const PredictiveAnalytics = () => {
  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4"
        >
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">
              <span className="text-gradient-cyber">Predictive</span> Analytics
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              AI-powered threat forecasting with Azure & Blockchain integration
            </p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <Badge variant="info" className="px-2 sm:px-4 py-1 sm:py-2 text-[10px] sm:text-sm gap-1 sm:gap-2">
              <Brain className="h-3 w-3 sm:h-4 sm:w-4" />
              AI Active
            </Badge>
            <Badge className="px-2 sm:px-4 py-1 sm:py-2 text-[10px] sm:text-sm gap-1 sm:gap-2 bg-blue-500/20 text-blue-400 border-blue-500/30">
              <Cloud className="h-3 w-3 sm:h-4 sm:w-4" />
              Azure
            </Badge>
            <Badge className="px-2 sm:px-4 py-1 sm:py-2 text-[10px] sm:text-sm gap-1 sm:gap-2 bg-purple-500/20 text-purple-400 border-purple-500/30">
              <Link2 className="h-3 w-3 sm:h-4 sm:w-4" />
              Blockchain
            </Badge>
            <Badge variant="active" className="px-2 sm:px-4 py-1 sm:py-2 text-[10px] sm:text-sm gap-1 sm:gap-2">
              <Globe className="h-3 w-3 sm:h-4 sm:w-4" />
              Live
            </Badge>
          </div>
        </motion.div>
      </div>

      {/* Tabbed Interface - Mobile Responsive */}
      <Tabs defaultValue="map" className="space-y-4 sm:space-y-6">
        <TabsList className="grid w-full grid-cols-4 sm:grid-cols-7 gap-1">
          <TabsTrigger value="map" className="gap-1 text-[10px] sm:text-sm px-1 sm:px-3">
            <Globe className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Global Map</span>
            <span className="sm:hidden">Map</span>
          </TabsTrigger>
          <TabsTrigger value="hunting" className="gap-1 text-[10px] sm:text-sm px-1 sm:px-3">
            <Crosshair className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Threat Hunt</span>
            <span className="sm:hidden">Hunt</span>
          </TabsTrigger>
          <TabsTrigger value="blockchain" className="gap-1 text-[10px] sm:text-sm px-1 sm:px-3">
            <Link2 className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Blockchain</span>
            <span className="sm:hidden">Chain</span>
          </TabsTrigger>
          <TabsTrigger value="azure" className="gap-1 text-[10px] sm:text-sm px-1 sm:px-3">
            <Cloud className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Azure Hub</span>
            <span className="sm:hidden">Azure</span>
          </TabsTrigger>
          <TabsTrigger value="alerts" className="gap-1 text-[10px] sm:text-sm px-1 sm:px-3 hidden sm:flex">
            <Bell className="h-3 w-3 sm:h-4 sm:w-4" />
            Alerts
          </TabsTrigger>
          <TabsTrigger value="intel" className="gap-1 text-[10px] sm:text-sm px-1 sm:px-3 hidden sm:flex">
            <Shield className="h-3 w-3 sm:h-4 sm:w-4" />
            Intel
          </TabsTrigger>
          <TabsTrigger value="analytics" className="gap-1 text-[10px] sm:text-sm px-1 sm:px-3 hidden sm:flex">
            <Activity className="h-3 w-3 sm:h-4 sm:w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* Global Threat Map Tab */}
        <TabsContent value="map" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <GlobalThreatMapAdvanced />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <AIFirewallAnalysis />
          </motion.div>
        </TabsContent>

        {/* Threat Hunting Tab */}
        <TabsContent value="hunting">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <ThreatHuntingAdvanced />
          </motion.div>
        </TabsContent>

        {/* Azure Security Hub Tab */}
        <TabsContent value="azure">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <AzureSecurityHub />
          </motion.div>
        </TabsContent>

        {/* Blockchain Security Tab */}
        <TabsContent value="blockchain">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <BlockchainSecurityModule />
          </motion.div>
        </TabsContent>

        {/* Security Alerts Tab */}
        <TabsContent value="alerts">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <SecurityAlertCenter />
          </motion.div>
        </TabsContent>

        {/* Threat Intelligence Tab */}
        <TabsContent value="intel" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <ThreatIntelligenceFeeds />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <NetworkTrafficAnalysis />
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
