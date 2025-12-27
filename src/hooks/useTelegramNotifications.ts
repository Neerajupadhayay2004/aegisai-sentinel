import { useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ThreatData {
  title: string;
  severity: string;
  status: string;
  source: string;
}

interface NotificationMetrics {
  activeThreats: number;
  blockedThreats: number;
  riskScore: number;
  endpointsAtRisk: number;
}

export const useTelegramNotifications = (
  threats: ThreatData[] = [],
  metrics: NotificationMetrics = { activeThreats: 0, blockedThreats: 0, riskScore: 0, endpointsAtRisk: 0 }
) => {
  const { toast } = useToast();
  const lastNotificationRef = useRef<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const sendNotification = useCallback(async (
    type: 'threat' | 'summary' | 'alert',
    data: {
      severity?: 'critical' | 'high' | 'medium' | 'low';
      title: string;
      message: string;
      threats?: ThreatData[];
      metrics?: NotificationMetrics;
    }
  ) => {
    try {
      const response = await supabase.functions.invoke('telegram-notify', {
        body: { type, ...data },
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      toast({
        title: "📱 Notification Sent",
        description: `Telegram alert: ${data.title}`,
      });

      return response.data;
    } catch (error) {
      console.error('Failed to send Telegram notification:', error);
      toast({
        title: "Notification Failed",
        description: "Could not send Telegram notification",
        variant: "destructive",
      });
    }
  }, [toast]);

  const sendCriticalAlert = useCallback(async (threatTitle: string, threatMessage: string) => {
    return sendNotification('threat', {
      severity: 'critical',
      title: threatTitle,
      message: threatMessage,
    });
  }, [sendNotification]);

  const sendPeriodicSummary = useCallback(async () => {
    const activeThreats = threats.filter(t => t.status === 'active');
    
    return sendNotification('summary', {
      title: 'Security Summary',
      message: `${activeThreats.length} active threats detected`,
      threats: activeThreats,
      metrics,
    });
  }, [threats, metrics, sendNotification]);

  // Send summary every 30 minutes
  useEffect(() => {
    // Initial notification on mount
    const now = Date.now();
    if (now - lastNotificationRef.current > 1800000) { // 30 minutes
      sendPeriodicSummary();
      lastNotificationRef.current = now;
    }

    // Set up 30-minute interval
    intervalRef.current = setInterval(() => {
      sendPeriodicSummary();
      lastNotificationRef.current = Date.now();
    }, 1800000); // 30 minutes

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [sendPeriodicSummary]);

  // Auto-send critical alerts
  useEffect(() => {
    const criticalThreats = threats.filter(t => t.severity === 'critical' && t.status === 'active');
    
    if (criticalThreats.length > 0) {
      const latestCritical = criticalThreats[0];
      sendNotification('threat', {
        severity: 'critical',
        title: `🔴 CRITICAL: ${latestCritical.title}`,
        message: `Source: ${latestCritical.source}\nStatus: ${latestCritical.status}\nImmediate action required!`,
      });
    }
  }, [threats, sendNotification]);

  return {
    sendNotification,
    sendCriticalAlert,
    sendPeriodicSummary,
  };
};
