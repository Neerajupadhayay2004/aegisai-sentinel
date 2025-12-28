import { useState, useEffect, useCallback, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

interface ThreatAlert {
  id: string;
  type: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  source: string;
  timestamp: Date;
  message: string;
}

// Audio context for generating sounds
let audioContext: AudioContext | null = null;

const getAudioContext = () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
};

// Sound generators
const playAlertSound = (severity: 'critical' | 'high' | 'medium' | 'low') => {
  try {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    // Different frequencies for different severities
    const frequencies = {
      critical: [880, 660, 880, 660], // Urgent alarm
      high: [660, 550, 660],          // Warning beeps
      medium: [440, 550],              // Soft alert
      low: [330],                      // Single tone
    };
    
    const durations = {
      critical: 150,
      high: 200,
      medium: 250,
      low: 300,
    };
    
    const freqs = frequencies[severity];
    let time = ctx.currentTime;
    
    freqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.type = severity === 'critical' ? 'sawtooth' : 'sine';
      osc.frequency.setValueAtTime(freq, time);
      
      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(severity === 'critical' ? 0.3 : 0.15, time + 0.02);
      gain.gain.linearRampToValueAtTime(0, time + durations[severity] / 1000);
      
      osc.start(time);
      osc.stop(time + durations[severity] / 1000);
      
      time += durations[severity] / 1000 + 0.05;
    });
  } catch (e) {
    console.log('Audio not available:', e);
  }
};

const playBlockedSound = () => {
  try {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(880, ctx.currentTime);
    oscillator.frequency.linearRampToValueAtTime(1320, ctx.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.15);
    
    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.15);
  } catch (e) {
    console.log('Audio not available:', e);
  }
};

// Request notification permission
const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    console.log('Notifications not supported');
    return false;
  }
  
  if (Notification.permission === 'granted') {
    return true;
  }
  
  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  
  return false;
};

// Show browser notification
const showBrowserNotification = (alert: ThreatAlert) => {
  if (Notification.permission !== 'granted') return;
  
  const icons = {
    critical: '🚨',
    high: '⚠️',
    medium: '⚡',
    low: '🔔',
  };
  
  const notification = new Notification(`${icons[alert.severity]} ${alert.type}`, {
    body: `${alert.message}\nSource: ${alert.source}`,
    icon: '/favicon.ico',
    tag: alert.id,
    requireInteraction: alert.severity === 'critical',
    silent: true, // We handle our own sounds
  });
  
  notification.onclick = () => {
    window.focus();
    notification.close();
  };
  
  // Auto close non-critical after 5 seconds
  if (alert.severity !== 'critical') {
    setTimeout(() => notification.close(), 5000);
  }
};

export const useThreatAlerts = () => {
  const [alerts, setAlerts] = useState<ThreatAlert[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [stats, setStats] = useState({ total: 0, blocked: 0, active: 0 });
  const { toast } = useToast();
  const alertIdRef = useRef(0);

  // Initialize notifications
  useEffect(() => {
    const initNotifications = async () => {
      const granted = await requestNotificationPermission();
      setNotificationsEnabled(granted);
    };
    initNotifications();
  }, []);

  const triggerAlert = useCallback((
    type: string,
    severity: 'critical' | 'high' | 'medium' | 'low',
    source: string,
    message: string
  ) => {
    const alert: ThreatAlert = {
      id: `alert-${alertIdRef.current++}`,
      type,
      severity,
      source,
      timestamp: new Date(),
      message,
    };

    setAlerts(prev => [alert, ...prev].slice(0, 50));
    setStats(prev => ({ ...prev, total: prev.total + 1, active: prev.active + 1 }));

    // Play sound
    if (soundEnabled) {
      playAlertSound(severity);
    }

    // Show notification for critical/high
    if (notificationsEnabled && (severity === 'critical' || severity === 'high')) {
      showBrowserNotification(alert);
    }

    // Show toast
    const variants = {
      critical: 'destructive' as const,
      high: 'destructive' as const,
      medium: 'default' as const,
      low: 'default' as const,
    };

    toast({
      variant: variants[severity],
      title: `${severity.toUpperCase()}: ${type}`,
      description: message,
    });

    return alert;
  }, [soundEnabled, notificationsEnabled, toast]);

  const blockThreat = useCallback((alertId: string) => {
    setAlerts(prev => prev.filter(a => a.id !== alertId));
    setStats(prev => ({ ...prev, blocked: prev.blocked + 1, active: Math.max(0, prev.active - 1) }));
    
    if (soundEnabled) {
      playBlockedSound();
    }

    toast({
      title: 'Threat Blocked',
      description: 'Threat has been successfully neutralized.',
    });
  }, [soundEnabled, toast]);

  const toggleSound = useCallback(() => {
    setSoundEnabled(prev => !prev);
  }, []);

  const requestNotifications = useCallback(async () => {
    const granted = await requestNotificationPermission();
    setNotificationsEnabled(granted);
    return granted;
  }, []);

  const testAlert = useCallback((severity: 'critical' | 'high' | 'medium' | 'low' = 'high') => {
    triggerAlert(
      'Test Alert',
      severity,
      '192.168.1.1',
      'This is a test alert to verify the notification system is working.'
    );
  }, [triggerAlert]);

  return {
    alerts,
    stats,
    soundEnabled,
    notificationsEnabled,
    triggerAlert,
    blockThreat,
    toggleSound,
    requestNotifications,
    testAlert,
  };
};
