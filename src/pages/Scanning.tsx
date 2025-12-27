import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { RadarScanner } from '@/components/dashboard/RadarScanner';
import { LiveScanStatus } from '@/components/dashboard/LiveScanStatus';

const Scanning = () => (
  <DashboardLayout>
    <h1 className="text-3xl font-bold mb-6 text-gradient-cyber">Network Scanning</h1>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="flex justify-center">
        <RadarScanner size={350} isScanning={true} />
      </div>
      <LiveScanStatus />
    </div>
  </DashboardLayout>
);

export default Scanning;
