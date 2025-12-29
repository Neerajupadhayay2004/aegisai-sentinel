import { useState, useEffect, useCallback, useRef } from 'react';

interface AudioSettings {
  enabled: boolean;
  volume: number;
  criticalAlerts: boolean;
  highAlerts: boolean;
  mediumAlerts: boolean;
}

// Audio context for Web Audio API
let audioContext: AudioContext | null = null;

const getAudioContext = (): AudioContext => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
};

// Generate different alert sounds using Web Audio API
const playTone = (frequency: number, duration: number, type: OscillatorType = 'sine', volume: number = 0.3) => {
  try {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
    
    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  } catch (error) {
    console.error('Audio playback error:', error);
  }
};

// Different alert sound patterns
export const playAlertSound = (severity: 'critical' | 'high' | 'medium' | 'low' | 'success' | 'notification', volume: number = 0.3) => {
  switch (severity) {
    case 'critical':
      // Urgent pulsing alarm
      playTone(880, 0.15, 'square', volume);
      setTimeout(() => playTone(660, 0.15, 'square', volume), 150);
      setTimeout(() => playTone(880, 0.15, 'square', volume), 300);
      setTimeout(() => playTone(660, 0.15, 'square', volume), 450);
      setTimeout(() => playTone(880, 0.2, 'square', volume), 600);
      break;
      
    case 'high':
      // Warning beeps
      playTone(740, 0.2, 'triangle', volume);
      setTimeout(() => playTone(587, 0.2, 'triangle', volume), 250);
      setTimeout(() => playTone(740, 0.3, 'triangle', volume), 500);
      break;
      
    case 'medium':
      // Attention tone
      playTone(523, 0.2, 'sine', volume);
      setTimeout(() => playTone(659, 0.3, 'sine', volume), 200);
      break;
      
    case 'low':
      // Soft notification
      playTone(440, 0.3, 'sine', volume * 0.7);
      break;
      
    case 'success':
      // Success chime
      playTone(523, 0.15, 'sine', volume);
      setTimeout(() => playTone(659, 0.15, 'sine', volume), 100);
      setTimeout(() => playTone(784, 0.25, 'sine', volume), 200);
      break;
      
    case 'notification':
      // General notification
      playTone(587, 0.15, 'sine', volume * 0.8);
      setTimeout(() => playTone(784, 0.2, 'sine', volume * 0.8), 150);
      break;
  }
};

// Play scanning/radar sound
export const playScanSound = (volume: number = 0.2) => {
  const ctx = getAudioContext();
  if (ctx.state === 'suspended') {
    ctx.resume();
  }
  
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);
  
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(200, ctx.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(2000, ctx.currentTime + 0.5);
  
  gainNode.gain.setValueAtTime(volume, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
  
  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + 0.5);
};

// Play blocked threat sound
export const playBlockedSound = (volume: number = 0.3) => {
  playTone(880, 0.1, 'square', volume * 0.5);
  setTimeout(() => playTone(440, 0.15, 'sine', volume), 100);
};

export const useAudioAlerts = () => {
  const [settings, setSettings] = useState<AudioSettings>(() => {
    const saved = localStorage.getItem('audioAlertSettings');
    return saved ? JSON.parse(saved) : {
      enabled: true,
      volume: 0.5,
      criticalAlerts: true,
      highAlerts: true,
      mediumAlerts: false,
    };
  });
  
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const lastAlertRef = useRef<number>(0);

  useEffect(() => {
    localStorage.setItem('audioAlertSettings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'granted') {
      setNotificationsEnabled(true);
    }
  }, []);

  const requestNotificationPermission = useCallback(async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotificationsEnabled(permission === 'granted');
      return permission === 'granted';
    }
    return false;
  }, []);

  const sendBrowserNotification = useCallback((title: string, body: string, severity: 'critical' | 'high' | 'medium' | 'low') => {
    if (!notificationsEnabled) return;
    
    const icon = severity === 'critical' ? '🚨' : severity === 'high' ? '⚠️' : severity === 'medium' ? '🔔' : 'ℹ️';
    
    try {
      new Notification(`${icon} ${title}`, {
        body,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: `threat-${Date.now()}`,
        requireInteraction: severity === 'critical',
      });
    } catch (error) {
      console.error('Notification error:', error);
    }
  }, [notificationsEnabled]);

  const triggerAlert = useCallback((
    severity: 'critical' | 'high' | 'medium' | 'low',
    title: string,
    message: string
  ) => {
    const now = Date.now();
    // Debounce alerts (minimum 500ms between alerts)
    if (now - lastAlertRef.current < 500) return;
    lastAlertRef.current = now;

    if (!settings.enabled) return;

    // Check if this severity should trigger audio
    const shouldPlayAudio = 
      (severity === 'critical' && settings.criticalAlerts) ||
      (severity === 'high' && settings.highAlerts) ||
      (severity === 'medium' && settings.mediumAlerts) ||
      severity === 'low';

    if (shouldPlayAudio) {
      playAlertSound(severity, settings.volume);
    }

    // Send browser notification for high+ severity
    if (severity === 'critical' || severity === 'high') {
      sendBrowserNotification(title, message, severity);
    }
  }, [settings, sendBrowserNotification]);

  const updateSettings = useCallback((updates: Partial<AudioSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  }, []);

  const testSound = useCallback((severity: 'critical' | 'high' | 'medium' | 'low' | 'success' | 'notification') => {
    playAlertSound(severity, settings.volume);
  }, [settings.volume]);

  return {
    settings,
    updateSettings,
    triggerAlert,
    testSound,
    playAlertSound: (severity: 'critical' | 'high' | 'medium' | 'low' | 'success' | 'notification') => 
      playAlertSound(severity, settings.volume),
    playScanSound: () => playScanSound(settings.volume * 0.4),
    playBlockedSound: () => playBlockedSound(settings.volume),
    notificationsEnabled,
    requestNotificationPermission,
  };
};
