import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';

const PredictiveAnalytics = () => (
  <DashboardLayout>
    <h1 className="text-3xl font-bold mb-6 text-gradient-cyber">Predictive Analytics</h1>
    <Card variant="glass">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          AI-Powered Predictions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Predictive security analytics coming soon...</p>
      </CardContent>
    </Card>
  </DashboardLayout>
);

export default PredictiveAnalytics;
