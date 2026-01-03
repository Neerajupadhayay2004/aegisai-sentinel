import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ThreatCard } from '@/components/dashboard/ThreatCard';
import { ThreatHunting } from '@/components/dashboard/ThreatHunting';
import { AutomatedIncidentResponse } from '@/components/dashboard/AutomatedIncidentResponse';
import { MitreAttackDashboard } from '@/components/dashboard/MitreAttackDashboard';
import { SOCDashboard } from '@/components/dashboard/SOCDashboard';
import { mockThreats } from '@/lib/mockData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Crosshair, Zap, Target, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

const Incidents = () => (
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
            <span className="text-gradient-cyber">Security</span> Operations Center
          </h1>
          <p className="text-muted-foreground">
            Real-time threat monitoring, incident response, and threat hunting
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="critical" className="px-4 py-2 text-sm gap-2 animate-pulse">
            <Activity className="h-4 w-4" />
            SOC Active
          </Badge>
        </div>
      </motion.div>
    </div>
    
    <Tabs defaultValue="soc" className="space-y-6">
      <TabsList className="grid w-full max-w-3xl grid-cols-5">
        <TabsTrigger value="soc" className="gap-2">
          <Activity className="h-4 w-4" />
          SOC Dashboard
        </TabsTrigger>
        <TabsTrigger value="incidents" className="gap-2">
          <Shield className="h-4 w-4" />
          Incidents
        </TabsTrigger>
        <TabsTrigger value="hunting" className="gap-2">
          <Crosshair className="h-4 w-4" />
          Hunting
        </TabsTrigger>
        <TabsTrigger value="response" className="gap-2">
          <Zap className="h-4 w-4" />
          Response
        </TabsTrigger>
        <TabsTrigger value="mitre" className="gap-2">
          <Target className="h-4 w-4" />
          MITRE
        </TabsTrigger>
      </TabsList>

      <TabsContent value="soc">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <SOCDashboard />
        </motion.div>
      </TabsContent>

      <TabsContent value="incidents">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {mockThreats.map((threat) => (
            <ThreatCard key={threat.id} threat={threat} />
          ))}
        </motion.div>
      </TabsContent>

      <TabsContent value="hunting">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <ThreatHunting />
        </motion.div>
      </TabsContent>

      <TabsContent value="response">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <AutomatedIncidentResponse />
        </motion.div>
      </TabsContent>

      <TabsContent value="mitre">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <MitreAttackDashboard />
        </motion.div>
      </TabsContent>
    </Tabs>
  </DashboardLayout>
);

export default Incidents;
