import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ComplianceChart } from '@/components/dashboard/Charts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockCompliance } from '@/lib/mockData';
import { FileText } from 'lucide-react';

const Compliance = () => (
  <DashboardLayout>
    <h1 className="text-3xl font-bold mb-6 text-gradient-cyber">Compliance Hub</h1>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ComplianceChart />
      <Card variant="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Framework Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {mockCompliance.map((c) => (
            <div key={c.framework} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
              <span className="font-medium">{c.framework}</span>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">{c.score}%</span>
                <Badge variant={c.status === 'compliant' ? 'success' : 'medium'}>{c.status}</Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  </DashboardLayout>
);

export default Compliance;
