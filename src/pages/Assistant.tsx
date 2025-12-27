import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AISecurityChat } from '@/components/dashboard/AISecurityChat';

const Assistant = () => (
  <DashboardLayout>
    <h1 className="text-3xl font-bold mb-6 text-gradient-cyber">AI Security Assistant</h1>
    <AISecurityChat />
  </DashboardLayout>
);

export default Assistant;
