import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { SOCDashboardAdvanced } from '@/components/dashboard/SOCDashboardAdvanced';
import { motion } from 'framer-motion';
import { Shield, Activity, Users, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const SOCOperations = () => {
  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
              <span className="text-gradient-cyber">SOC</span> Operations Center
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Incident management, analyst workload tracking & escalation control
            </p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <Badge variant="active" className="px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm gap-1 sm:gap-2">
              <Activity className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Operations</span> Active
            </Badge>
            <Badge variant="info" className="px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm gap-1 sm:gap-2">
              <Users className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">4 Analysts</span>
              <span className="sm:hidden">4</span>
            </Badge>
            <Badge variant="outline" className="px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm gap-1 sm:gap-2">
              <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
              24/7
            </Badge>
          </div>
        </motion.div>
      </div>

      {/* SOC Dashboard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <SOCDashboardAdvanced />
      </motion.div>
    </DashboardLayout>
  );
};

export default SOCOperations;
