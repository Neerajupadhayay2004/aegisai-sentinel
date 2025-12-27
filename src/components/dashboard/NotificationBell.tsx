import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, AlertTriangle, Shield, Activity, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useTelegramNotifications } from '@/hooks/useTelegramNotifications';
import { useToast } from '@/hooks/use-toast';

interface Notification {
  id: string;
  type: 'threat' | 'info' | 'success';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

const mockNotifications: Notification[] = [
  { id: '1', type: 'threat', title: 'Critical Threat Detected', message: 'Ransomware attack on WS-FINANCE-04', timestamp: new Date(Date.now() - 120000), read: false },
  { id: '2', type: 'threat', title: 'Brute Force Attempt', message: 'Multiple failed logins from 45.95.169.22', timestamp: new Date(Date.now() - 300000), read: false },
  { id: '3', type: 'info', title: 'Scan Complete', message: 'Network vulnerability scan finished', timestamp: new Date(Date.now() - 600000), read: true },
  { id: '4', type: 'success', title: 'Threat Mitigated', message: 'Lateral movement blocked successfully', timestamp: new Date(Date.now() - 900000), read: true },
];

interface Props {
  threats?: Array<{ title: string; severity: string; status: string; source: string }>;
  metrics?: { activeThreats: number; blockedThreats: number; riskScore: number; endpointsAtRisk: number };
}

export const NotificationBell = ({ threats = [], metrics }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const { sendPeriodicSummary } = useTelegramNotifications(threats, metrics);
  const { toast } = useToast();
  
  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleSendTelegram = async () => {
    await sendPeriodicSummary();
    toast({
      title: "Telegram Summary Sent",
      description: "Security summary has been sent to your Telegram",
    });
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'threat': return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case 'success': return <Shield className="h-4 w-4 text-success" />;
      default: return <Activity className="h-4 w-4 text-primary" />;
    }
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-destructive rounded-full flex items-center justify-center text-[10px] font-bold text-destructive-foreground"
          >
            {unreadCount}
          </motion.span>
        )}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute right-0 top-full mt-2 w-80 bg-background border border-border rounded-lg shadow-xl z-50 overflow-hidden"
            >
              <div className="flex items-center justify-between p-3 border-b border-border">
                <h3 className="font-semibold text-sm">Notifications</h3>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={handleSendTelegram} className="h-7 text-xs gap-1">
                    <Send className="h-3 w-3" />
                    Telegram
                  </Button>
                  <Button variant="ghost" size="sm" onClick={markAllRead} className="h-7 text-xs">
                    Mark all read
                  </Button>
                </div>
              </div>

              <ScrollArea className="max-h-[400px]">
                <div className="p-2 space-y-1">
                  {notifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        notification.read ? 'bg-transparent hover:bg-secondary/50' : 'bg-secondary/50 hover:bg-secondary'
                      }`}
                      onClick={() => {
                        setNotifications(prev =>
                          prev.map(n => n.id === notification.id ? { ...n, read: true } : n)
                        );
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">{getIcon(notification.type)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className="font-medium text-sm truncate">{notification.title}</p>
                            {!notification.read && (
                              <span className="w-2 h-2 bg-primary rounded-full shrink-0" />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground truncate">{notification.message}</p>
                          <p className="text-[10px] text-muted-foreground mt-1">
                            {notification.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>

              <div className="p-2 border-t border-border">
                <Button variant="ghost" size="sm" className="w-full text-xs">
                  View All Notifications
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
