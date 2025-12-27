import { useState } from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Lock, Shield, Users, Server, Globe, Key, 
  CheckCircle, AlertTriangle, XCircle, Settings,
  Network, Eye, FileCheck, Fingerprint, UserCheck
} from 'lucide-react';

const zeroTrustPolicies = [
  { id: 1, name: 'Verify Explicitly', description: 'Always authenticate and authorize based on all available data points', enabled: true, score: 94 },
  { id: 2, name: 'Least Privilege Access', description: 'Limit user access with Just-In-Time and Just-Enough-Access', enabled: true, score: 87 },
  { id: 3, name: 'Assume Breach', description: 'Minimize blast radius and segment access. Verify end-to-end encryption', enabled: true, score: 91 },
  { id: 4, name: 'MFA Enforcement', description: 'Require multi-factor authentication for all users', enabled: true, score: 98 },
  { id: 5, name: 'Device Compliance', description: 'Only allow access from compliant and healthy devices', enabled: false, score: 72 },
  { id: 6, name: 'Network Segmentation', description: 'Micro-segment network to contain threats', enabled: true, score: 85 },
];

const accessRequests = [
  { id: 1, user: 'john.smith@company.com', resource: 'Production Database', status: 'approved', risk: 'low', time: '2 mins ago' },
  { id: 2, user: 'alice.wong@company.com', resource: 'Admin Console', status: 'pending', risk: 'medium', time: '5 mins ago' },
  { id: 3, user: 'bob.jones@external.com', resource: 'Customer Data API', status: 'denied', risk: 'high', time: '8 mins ago' },
  { id: 4, user: 'sarah.lee@company.com', resource: 'Finance Reports', status: 'approved', risk: 'low', time: '12 mins ago' },
  { id: 5, user: 'unknown@suspicious.ip', resource: 'SSH Gateway', status: 'denied', risk: 'critical', time: '15 mins ago' },
];

const identityMetrics = [
  { label: 'Active Sessions', value: 247, icon: Users, trend: '+12%' },
  { label: 'MFA Adoption', value: '94%', icon: Fingerprint, trend: '+3%' },
  { label: 'Failed Logins', value: 23, icon: XCircle, trend: '-8%' },
  { label: 'Policy Violations', value: 7, icon: AlertTriangle, trend: '-15%' },
];

const ZeroTrust = () => {
  const [policies, setPolicies] = useState(zeroTrustPolicies);
  
  const togglePolicy = (id: number) => {
    setPolicies(prev => prev.map(p => 
      p.id === id ? { ...p, enabled: !p.enabled } : p
    ));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4 text-success" />;
      case 'pending': return <AlertTriangle className="h-4 w-4 text-warning" />;
      case 'denied': return <XCircle className="h-4 w-4 text-destructive" />;
      default: return null;
    }
  };

  const getRiskBadge = (risk: string) => {
    const variants: Record<string, any> = {
      low: 'success',
      medium: 'warning',
      high: 'destructive',
      critical: 'critical'
    };
    return <Badge variant={variants[risk] || 'default'}>{risk.toUpperCase()}</Badge>;
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gradient-cyber">Zero Trust Security</h1>
        <p className="text-muted-foreground mt-2">Never trust, always verify - Comprehensive identity and access management</p>
      </div>

      {/* Identity Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {identityMetrics.map((metric, i) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card variant="glass">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{metric.label}</p>
                    <p className="text-2xl font-bold mt-1">{metric.value}</p>
                    <span className={`text-xs ${metric.trend.startsWith('+') ? 'text-success' : 'text-destructive'}`}>
                      {metric.trend}
                    </span>
                  </div>
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <metric.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Tabs defaultValue="policies" className="space-y-6">
        <TabsList className="bg-secondary/50">
          <TabsTrigger value="policies" className="gap-2">
            <Shield className="h-4 w-4" />
            Policies
          </TabsTrigger>
          <TabsTrigger value="access" className="gap-2">
            <UserCheck className="h-4 w-4" />
            Access Requests
          </TabsTrigger>
          <TabsTrigger value="network" className="gap-2">
            <Network className="h-4 w-4" />
            Network
          </TabsTrigger>
        </TabsList>

        <TabsContent value="policies">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {policies.map((policy, i) => (
              <motion.div
                key={policy.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card variant="glass" className={policy.enabled ? 'border-primary/30' : 'border-border/30'}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Shield className={`h-5 w-5 ${policy.enabled ? 'text-primary' : 'text-muted-foreground'}`} />
                          <h3 className="font-semibold">{policy.name}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{policy.description}</p>
                        <div className="mt-3">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-muted-foreground">Compliance Score</span>
                            <span className={policy.score >= 90 ? 'text-success' : policy.score >= 70 ? 'text-warning' : 'text-destructive'}>
                              {policy.score}%
                            </span>
                          </div>
                          <Progress value={policy.score} className="h-2" />
                        </div>
                      </div>
                      <Switch
                        checked={policy.enabled}
                        onCheckedChange={() => togglePolicy(policy.id)}
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="access">
          <Card variant="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-primary" />
                Real-time Access Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {accessRequests.map((request, i) => (
                  <motion.div
                    key={request.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-secondary/30 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      {getStatusIcon(request.status)}
                      <div>
                        <p className="font-medium text-sm">{request.user}</p>
                        <p className="text-xs text-muted-foreground">{request.resource}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {getRiskBadge(request.risk)}
                      <span className="text-xs text-muted-foreground">{request.time}</span>
                      {request.status === 'pending' && (
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="h-7 text-xs">Approve</Button>
                          <Button size="sm" variant="destructive" className="h-7 text-xs">Deny</Button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="network">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card variant="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Network className="h-5 w-5 text-primary" />
                  Micro-Segmentation Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { segment: 'Production Servers', devices: 45, status: 'Protected', score: 98 },
                  { segment: 'Development Zone', devices: 78, status: 'Protected', score: 94 },
                  { segment: 'Guest Network', devices: 23, status: 'Isolated', score: 100 },
                  { segment: 'IoT Devices', devices: 156, status: 'Monitoring', score: 76 },
                ].map((seg, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{seg.segment}</p>
                      <p className="text-xs text-muted-foreground">{seg.devices} devices</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={seg.score >= 90 ? 'success' : 'medium'}>{seg.status}</Badge>
                      <span className="text-sm font-mono">{seg.score}%</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card variant="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5 text-primary" />
                  Certificate & Key Management
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { name: 'SSL/TLS Certificates', expiring: 2, total: 47, status: 'healthy' },
                  { name: 'SSH Keys', expiring: 0, total: 234, status: 'healthy' },
                  { name: 'API Keys', expiring: 5, total: 89, status: 'warning' },
                  { name: 'Service Accounts', expiring: 1, total: 56, status: 'healthy' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.total} total</p>
                    </div>
                    <div className="flex items-center gap-3">
                      {item.expiring > 0 && (
                        <span className="text-xs text-warning">{item.expiring} expiring</span>
                      )}
                      <div className={`w-2 h-2 rounded-full ${item.status === 'healthy' ? 'bg-success' : 'bg-warning'}`} />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default ZeroTrust;
