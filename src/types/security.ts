export type ThreatSeverity = 'critical' | 'high' | 'medium' | 'low' | 'info';
export type ThreatStatus = 'active' | 'mitigated' | 'investigating' | 'resolved';
export type ScanStatus = 'idle' | 'scanning' | 'completed' | 'error';

export interface Threat {
  id: string;
  title: string;
  description: string;
  severity: ThreatSeverity;
  status: ThreatStatus;
  source: string;
  targetAsset: string;
  timestamp: Date;
  mitreTactic?: string;
  mitreTechnique?: string;
  killChainPhase?: string;
  ipAddress?: string;
  affectedEndpoints?: number;
  confidenceScore: number;
}

export interface SecurityMetric {
  label: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  icon: string;
}

export interface ComplianceScore {
  framework: string;
  score: number;
  status: 'compliant' | 'partial' | 'non-compliant';
  lastAudit: Date;
  gaps: number;
}

export interface Endpoint {
  id: string;
  name: string;
  type: 'server' | 'workstation' | 'mobile' | 'iot' | 'cloud';
  status: 'online' | 'offline' | 'compromised' | 'isolated';
  lastSeen: Date;
  os: string;
  ip: string;
  riskScore: number;
  threats: number;
}

export interface ScanResult {
  id: string;
  type: 'network' | 'vulnerability' | 'misconfiguration' | 'identity' | 'cloud';
  status: ScanStatus;
  startTime: Date;
  endTime?: Date;
  findings: number;
  criticalFindings: number;
  progress: number;
}

export interface AIInsight {
  id: string;
  type: 'prediction' | 'recommendation' | 'analysis' | 'alert';
  title: string;
  content: string;
  confidence: number;
  timestamp: Date;
  relatedThreats?: string[];
}

export interface NetworkNode {
  id: string;
  label: string;
  type: 'server' | 'endpoint' | 'firewall' | 'router' | 'cloud' | 'threat';
  status: 'healthy' | 'warning' | 'critical' | 'unknown';
  x?: number;
  y?: number;
}

export interface NetworkLink {
  source: string;
  target: string;
  type: 'normal' | 'suspicious' | 'malicious';
  bandwidth?: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  threatContext?: Threat;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'analyst' | 'viewer';
  avatar?: string;
  lastLogin: Date;
}
