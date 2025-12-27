import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock } from 'lucide-react';

const ZeroTrust = () => (
  <DashboardLayout>
    <h1 className="text-3xl font-bold mb-6 text-gradient-cyber">Zero Trust Policy</h1>
    <Card variant="glass">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="h-5 w-5 text-primary" />
          Zero Trust Architecture
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Zero trust policy management coming soon...</p>
      </CardContent>
    </Card>
  </DashboardLayout>
);

export default ZeroTrust;
