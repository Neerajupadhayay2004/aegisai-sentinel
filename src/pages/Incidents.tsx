import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ThreatCard } from '@/components/dashboard/ThreatCard';
import { ThreatHunting } from '@/components/dashboard/ThreatHunting';
import { AutomatedIncidentResponse } from '@/components/dashboard/AutomatedIncidentResponse';
import { MitreAttackDashboard } from '@/components/dashboard/MitreAttackDashboard';
import { mockThreats } from '@/lib/mockData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Crosshair, Zap, Target } from 'lucide-react';

const Incidents = () => (
  <DashboardLayout>
    <h1 className="text-3xl font-bold mb-6 text-gradient-cyber">Security Operations Center</h1>
    
    <Tabs defaultValue="incidents" className="space-y-6">
      <TabsList className="bg-card/50 border border-border">
        <TabsTrigger value="incidents" className="data-[state=active]:bg-primary/20">
          <Shield className="h-4 w-4 mr-2" />
          Active Incidents
        </TabsTrigger>
        <TabsTrigger value="hunting" className="data-[state=active]:bg-primary/20">
          <Crosshair className="h-4 w-4 mr-2" />
          Threat Hunting
        </TabsTrigger>
        <TabsTrigger value="response" className="data-[state=active]:bg-primary/20">
          <Zap className="h-4 w-4 mr-2" />
          Automated Response
        </TabsTrigger>
        <TabsTrigger value="mitre" className="data-[state=active]:bg-primary/20">
          <Target className="h-4 w-4 mr-2" />
          MITRE ATT&CK
        </TabsTrigger>
      </TabsList>

      <TabsContent value="incidents">
        <div className="space-y-4">
          {mockThreats.map((threat) => (
            <ThreatCard key={threat.id} threat={threat} />
          ))}
        </div>
      </TabsContent>

      <TabsContent value="hunting">
        <ThreatHunting />
      </TabsContent>

      <TabsContent value="response">
        <AutomatedIncidentResponse />
      </TabsContent>

      <TabsContent value="mitre">
        <MitreAttackDashboard />
      </TabsContent>
    </Tabs>
  </DashboardLayout>
);

export default Incidents;
