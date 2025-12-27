import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { WorldThreatMap } from '@/components/dashboard/WorldThreatMap';
import { RiskPredictionChart, AttackVectorForecast, SecurityPostureRadar, VulnerabilityTrend, AIPredictionSummary } from '@/components/dashboard/PredictiveCharts';
import { AISecurityChatLive } from '@/components/dashboard/AISecurityChatLive';
import { motion } from 'framer-motion';
import { Brain, Globe, TrendingUp } from 'lucide-react';
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

      {/* World Threat Map */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <WorldThreatMap />
      </motion.div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <RiskPredictionChart />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <SecurityPostureRadar />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <AttackVectorForecast />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <VulnerabilityTrend />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <AIPredictionSummary />
        </motion.div>
      </div>

      {/* AI Chat */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
        <AISecurityChatLive threatContext={{ activeThreats: 6, riskScore: 72, recentIncidents: ['Ransomware', 'Brute Force', 'Data Exfiltration'] }} />
      </motion.div>
    </DashboardLayout>
  );
};

export default PredictiveAnalytics;
