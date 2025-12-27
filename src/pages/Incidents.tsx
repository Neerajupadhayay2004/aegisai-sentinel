import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ThreatCard } from '@/components/dashboard/ThreatCard';
import { mockThreats } from '@/lib/mockData';

const Incidents = () => (
  <DashboardLayout>
    <h1 className="text-3xl font-bold mb-6 text-gradient-cyber">Incident Response</h1>
    <div className="space-y-4">
      {mockThreats.map((threat) => (
        <ThreatCard key={threat.id} threat={threat} />
      ))}
    </div>
  </DashboardLayout>
);

export default Incidents;
