import { useState, useEffect, useCallback, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface RealtimeThreat {
  id: string;
  type: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'active' | 'blocked' | 'investigating';
  source: {
    ip: string;
    city: string;
    country: string;
    lat: number;
    lng: number;
  };
  target: {
    ip: string;
    service: string;
    port: number;
  };
  timestamp: string;
  confidence: number;
  iocIndicators: number;
  mitreTactic?: string;
  mitreTechnique?: string;
}

export interface DarkWebAlert {
  id: string;
  type: string;
  message: string;
  severity: 'critical' | 'high';
  source: string;
  timestamp: string;
  affectedAssets: number;
  riskScore: number;
}

export interface AutomatedResponse {
  threatId: string;
  playbook: string;
  actions: Array<{
    action: string;
    status: 'completed' | 'in_progress' | 'pending';
    timestamp: string;
  }>;
  automated: boolean;
  executionTime: string;
}

export interface ThreatStats {
  totalAttacks: number;
  blocked: number;
  activeThreats: number;
  criticalAlerts: number;
  responseTime: string;
}

export const useRealtimeThreats = () => {
  const [threats, setThreats] = useState<RealtimeThreat[]>([]);
  const [darkWebAlerts, setDarkWebAlerts] = useState<DarkWebAlert[]>([]);
  const [automatedResponses, setAutomatedResponses] = useState<AutomatedResponse[]>([]);
  const [stats, setStats] = useState<ThreatStats>({
    totalAttacks: 24589,
    blocked: 24312,
    activeThreats: 12,
    criticalAlerts: 3,
    responseTime: '245ms',
  });
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  const playAlertSound = useCallback((severity: 'critical' | 'high' | 'medium' | 'low') => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      const frequencies: Record<string, number> = {
        critical: 880,
        high: 659,
        medium: 523,
        low: 392,
      };
      
      oscillator.frequency.setValueAtTime(frequencies[severity], audioContext.currentTime);
      oscillator.type = severity === 'critical' ? 'sawtooth' : 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (e) {
      console.log('Audio not supported');
    }
  }, []);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    try {
      const wsUrl = `wss://djjifsngoqlbvshpnrfw.functions.supabase.co/functions/v1/realtime-threats`;
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        setConnectionError(null);
        
        wsRef.current?.send(JSON.stringify({
          type: 'subscribe',
          channels: ['threats', 'dark_web', 'stats', 'responses'],
        }));
      };

      wsRef.current.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          
          switch (message.type) {
            case 'threat':
              setThreats(prev => [message.data, ...prev].slice(0, 50));
              if (message.data.severity === 'critical') {
                playAlertSound('critical');
                toast({
                  title: '🚨 Critical Threat Detected',
                  description: `${message.data.type} from ${message.data.source.country}`,
                  variant: 'destructive',
                });
              }
              break;
              
            case 'dark_web_alert':
              setDarkWebAlerts(prev => [message.data, ...prev].slice(0, 20));
              playAlertSound('high');
              toast({
                title: '🌑 Dark Web Alert',
                description: message.data.message,
                variant: 'destructive',
              });
              break;
              
            case 'automated_response':
              setAutomatedResponses(prev => [message.data, ...prev].slice(0, 20));
              break;
              
            case 'stats_update':
              setStats(message.data);
              break;
              
            case 'connection_established':
              console.log('Connection established:', message.message);
              break;
          }
        } catch (e) {
          console.error('Error parsing WebSocket message:', e);
        }
      };

      wsRef.current.onclose = () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
        
        // Attempt reconnection after 3 seconds
        reconnectTimeoutRef.current = setTimeout(() => {
          console.log('Attempting to reconnect...');
          connect();
        }, 3000);
      };

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setConnectionError('Connection error');
      };
    } catch (error) {
      console.error('Failed to connect:', error);
      setConnectionError('Failed to connect');
    }
  }, [playAlertSound, toast]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    wsRef.current?.close();
    setIsConnected(false);
  }, []);

  const blockIP = useCallback((ip: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'block_ip',
        ip,
      }));
      playAlertSound('low');
      toast({
        title: 'IP Blocked',
        description: `${ip} has been added to the blocklist`,
      });
    }
  }, [playAlertSound, toast]);

  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  return {
    threats,
    darkWebAlerts,
    automatedResponses,
    stats,
    isConnected,
    connectionError,
    blockIP,
    connect,
    disconnect,
  };
};
