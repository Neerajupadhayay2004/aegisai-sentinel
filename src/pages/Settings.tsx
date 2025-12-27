import { useState } from 'react';
import { motion } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  Settings as SettingsIcon, Bell, Shield, Globe, Key,
  Mail, Smartphone, Lock, Database, Cloud, Cpu,
  Save, RefreshCw, LogOut, User, AlertTriangle
} from 'lucide-react';

const Settings = () => {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    telegramAlerts: true,
    criticalOnly: false,
    dailyDigest: true,
    weeklyReport: true,
  });

  const [security, setSecurity] = useState({
    mfaEnabled: true,
    sessionTimeout: 30,
    ipWhitelist: false,
    auditLogging: true,
    encryptData: true,
  });

  const [scanning, setScanning] = useState({
    autoScan: true,
    scanInterval: '6',
    deepScan: false,
    vulnScanning: true,
    complianceCheck: true,
  });

  const handleSave = async () => {
    setSaving(true);
    // Simulate save
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged Out",
      description: "You have been securely logged out.",
    });
  };

  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gradient-cyber">Settings</h1>
          <p className="text-muted-foreground mt-2">Configure your security preferences and system settings</p>
        </div>
        <Button variant="destructive" onClick={handleLogout} className="gap-2">
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>

      <Tabs defaultValue="notifications" className="space-y-6">
        <TabsList className="bg-secondary/50 flex-wrap h-auto gap-1 p-1">
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger value="scanning" className="gap-2">
            <Cpu className="h-4 w-4" />
            <span className="hidden sm:inline">Scanning</span>
          </TabsTrigger>
          <TabsTrigger value="integrations" className="gap-2">
            <Cloud className="h-4 w-4" />
            <span className="hidden sm:inline">Integrations</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="notifications">
          <Card variant="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                Notification Preferences
              </CardTitle>
              <CardDescription>Configure how and when you receive security alerts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {[
                  { key: 'emailAlerts', label: 'Email Alerts', desc: 'Receive threat alerts via email', icon: Mail },
                  { key: 'telegramAlerts', label: 'Telegram Alerts', desc: 'Get instant notifications on Telegram', icon: Smartphone },
                  { key: 'criticalOnly', label: 'Critical Only', desc: 'Only notify for critical threats', icon: AlertTriangle },
                  { key: 'dailyDigest', label: 'Daily Digest', desc: 'Receive daily security summary', icon: RefreshCw },
                  { key: 'weeklyReport', label: 'Weekly Report', desc: 'Comprehensive weekly security report', icon: Database },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <item.icon className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium text-sm">{item.label}</p>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                    <Switch
                      checked={notifications[item.key as keyof typeof notifications]}
                      onCheckedChange={(checked) => 
                        setNotifications(prev => ({ ...prev, [item.key]: checked }))
                      }
                    />
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <Label>Telegram Configuration</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                  <div>
                    <Label className="text-xs text-muted-foreground">Bot Token</Label>
                    <Input type="password" value="••••••••••••••••" disabled className="mt-1" />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Chat ID</Label>
                    <Input type="password" value="••••••••••" disabled className="mt-1" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Telegram credentials are securely stored</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card variant="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Security Settings
              </CardTitle>
              <CardDescription>Configure authentication and access controls</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {[
                  { key: 'mfaEnabled', label: 'Multi-Factor Authentication', desc: 'Require MFA for login' },
                  { key: 'ipWhitelist', label: 'IP Whitelist', desc: 'Restrict access to approved IPs' },
                  { key: 'auditLogging', label: 'Audit Logging', desc: 'Log all administrative actions' },
                  { key: 'encryptData', label: 'Data Encryption', desc: 'Encrypt sensitive data at rest' },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                    <Switch
                      checked={security[item.key as keyof typeof security] as boolean}
                      onCheckedChange={(checked) => 
                        setSecurity(prev => ({ ...prev, [item.key]: checked }))
                      }
                    />
                  </div>
                ))}
              </div>

              <div className="p-4 bg-secondary/30 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-medium text-sm">Session Timeout</p>
                    <p className="text-xs text-muted-foreground">Auto-logout after inactivity</p>
                  </div>
                  <span className="text-sm font-mono">{security.sessionTimeout} min</span>
                </div>
                <Slider
                  value={[security.sessionTimeout]}
                  onValueChange={([value]) => setSecurity(prev => ({ ...prev, sessionTimeout: value }))}
                  min={5}
                  max={120}
                  step={5}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scanning">
          <Card variant="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cpu className="h-5 w-5 text-primary" />
                Scanning Configuration
              </CardTitle>
              <CardDescription>Configure automated security scanning</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {[
                  { key: 'autoScan', label: 'Automatic Scanning', desc: 'Enable scheduled security scans' },
                  { key: 'deepScan', label: 'Deep Scan Mode', desc: 'Comprehensive but slower scanning' },
                  { key: 'vulnScanning', label: 'Vulnerability Scanning', desc: 'Scan for known CVEs' },
                  { key: 'complianceCheck', label: 'Compliance Checks', desc: 'Verify regulatory compliance' },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                    <Switch
                      checked={scanning[item.key as keyof typeof scanning] as boolean}
                      onCheckedChange={(checked) => 
                        setScanning(prev => ({ ...prev, [item.key]: checked }))
                      }
                    />
                  </div>
                ))}
              </div>

              <div className="p-4 bg-secondary/30 rounded-lg">
                <Label>Scan Interval</Label>
                <Select
                  value={scanning.scanInterval}
                  onValueChange={(value) => setScanning(prev => ({ ...prev, scanInterval: value }))}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Every Hour</SelectItem>
                    <SelectItem value="6">Every 6 Hours</SelectItem>
                    <SelectItem value="12">Every 12 Hours</SelectItem>
                    <SelectItem value="24">Daily</SelectItem>
                    <SelectItem value="168">Weekly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations">
          <Card variant="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cloud className="h-5 w-5 text-primary" />
                Integrations
              </CardTitle>
              <CardDescription>Connected services and API configurations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: 'Lovable AI Gateway', status: 'connected', desc: 'AI-powered threat analysis' },
                { name: 'Telegram Bot', status: 'connected', desc: 'Real-time notifications' },
                { name: 'Supabase', status: 'connected', desc: 'Database & authentication' },
                { name: 'SIEM Integration', status: 'available', desc: 'Security information management' },
                { name: 'Slack Webhook', status: 'available', desc: 'Team notifications' },
              ].map((integration, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${integration.status === 'connected' ? 'bg-success' : 'bg-muted-foreground'}`} />
                    <div>
                      <p className="font-medium text-sm">{integration.name}</p>
                      <p className="text-xs text-muted-foreground">{integration.desc}</p>
                    </div>
                  </div>
                  <Badge variant={integration.status === 'connected' ? 'success' : 'secondary'}>
                    {integration.status}
                  </Badge>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-6 flex justify-end">
        <Button onClick={handleSave} disabled={saving} variant="cyber" className="gap-2">
          {saving ? (
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }}>
              <RefreshCw className="h-4 w-4" />
            </motion.div>
          ) : (
            <Save className="h-4 w-4" />
          )}
          Save Settings
        </Button>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
