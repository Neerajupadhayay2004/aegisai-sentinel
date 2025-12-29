import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAudioAlerts } from './useAudioAlerts';
import { useToast } from './use-toast';

interface ThreatSource {
  ip: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
}

interface ThreatTarget {
  ip: string;
  service: string;
  port: number;
}

export interface LiveThreat {
  id: string;
  type: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'active' | 'blocked' | 'investigating';
  source: ThreatSource;
  target: ThreatTarget;
  timestamp: string;
  confidence: number;
  iocIndicators: number;
}

export interface ThreatStats {
  totalAttacks24h: number;
  blockedAttacks: number;
  activeThreats: number;
  criticalAlerts: number;
  averageResponseTime: string;
  threatTrend: 'increasing' | 'decreasing';
  topAttackType: string;
  countriesTargeted: number;
}

export interface BlockedCountry {
  code: string;
  name: string;
  riskLevel: 'critical' | 'high' | 'medium' | 'low';
  blockedIPs: number;
  isBlocked?: boolean;
}

export const useThreatIntelligence = () => {
  const [threats, setThreats] = useState<LiveThreat[]>([]);
  const [stats, setStats] = useState<ThreatStats | null>(null);
  const [blockedCountries, setBlockedCountries] = useState<BlockedCountry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { triggerAlert, playBlockedSound } = useAudioAlerts();
  const { toast } = useToast();

  const fetchThreats = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.functions.invoke('threat-intelligence', {
        body: { action: 'get_threats' },
      });

      if (error) throw error;

      const newThreats = data.threats as LiveThreat[];
      const newStats = data.stats as ThreatStats;

      // Check for new critical threats and trigger alerts
      const criticalThreats = newThreats.filter(
        t => t.severity === 'critical' && t.status === 'active'
      );
      
      if (criticalThreats.length > 0) {
        triggerAlert(
          'critical',
          'Critical Threat Detected',
          `${criticalThreats.length} critical threat(s) from ${criticalThreats[0].source.country}`
        );
      }

      setThreats(newThreats);
      setStats(newStats);
      setError(null);
    } catch (err) {
      console.error('Error fetching threats:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch threats');
    } finally {
      setIsLoading(false);
    }
  }, [triggerAlert]);

  const fetchBlockedCountries = useCallback(async () => {
    try {
      const { data, error } = await supabase.functions.invoke('threat-intelligence', {
        body: { action: 'get_blocked_countries' },
      });

      if (error) throw error;
      setBlockedCountries(data.countries.map((c: BlockedCountry) => ({ ...c, isBlocked: true })));
    } catch (err) {
      console.error('Error fetching blocked countries:', err);
    }
  }, []);

  const toggleCountryBlock = useCallback(async (countryCode: string, block: boolean) => {
    try {
      const { data, error } = await supabase.functions.invoke('threat-intelligence', {
        body: { 
          action: 'block_country', 
          data: { countryCode, block } 
        },
      });

      if (error) throw error;

      setBlockedCountries(prev => 
        prev.map(c => c.code === countryCode ? { ...c, isBlocked: block } : c)
      );

      playBlockedSound();
      
      toast({
        title: block ? 'Country Blocked' : 'Country Unblocked',
        description: data.message,
      });
    } catch (err) {
      console.error('Error toggling country block:', err);
      toast({
        title: 'Error',
        description: 'Failed to update country block status',
        variant: 'destructive',
      });
    }
  }, [playBlockedSound, toast]);

  const blockIP = useCallback(async (ip: string, reason: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('threat-intelligence', {
        body: { 
          action: 'block_ip', 
          data: { ip, reason } 
        },
      });

      if (error) throw error;

      playBlockedSound();
      
      toast({
        title: 'IP Blocked',
        description: `${ip} has been added to the blocklist`,
      });

      return data;
    } catch (err) {
      console.error('Error blocking IP:', err);
      toast({
        title: 'Error',
        description: 'Failed to block IP address',
        variant: 'destructive',
      });
      throw err;
    }
  }, [playBlockedSound, toast]);

  const analyzeThreat = useCallback(async (threatId: string, threatData: LiveThreat) => {
    try {
      const { data, error } = await supabase.functions.invoke('threat-intelligence', {
        body: { 
          action: 'analyze_threat', 
          data: { threatId, threatData } 
        },
      });

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Error analyzing threat:', err);
      throw err;
    }
  }, []);

  // Auto-refresh threats
  useEffect(() => {
    fetchThreats();
    fetchBlockedCountries();
    
    const interval = setInterval(fetchThreats, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, [fetchThreats, fetchBlockedCountries]);

  return {
    threats,
    stats,
    blockedCountries,
    isLoading,
    error,
    fetchThreats,
    toggleCountryBlock,
    blockIP,
    analyzeThreat,
  };
};
