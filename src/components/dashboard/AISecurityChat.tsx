import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles, Loader2, AlertTriangle, Shield, ChevronDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { ChatMessage } from '@/types/security';

const initialMessages: ChatMessage[] = [
  {
    id: '1',
    role: 'assistant',
    content: `🛡️ **AegisAI Security Assistant Online**

I'm your AI-powered security analyst. I can help you with:

• **Threat Analysis** - Investigate active threats and get MITRE ATT&CK mapping
• **Incident Response** - Get playbooks and remediation steps
• **Security Insights** - Predictive analytics and risk assessment
• **Compliance** - SOC 2, ISO 27001, GDPR guidance

How can I assist you today?`,
    timestamp: new Date(),
  },
];

export const AISecurityChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateAIResponse = async (userMessage: string): Promise<string> => {
    // Simulated AI responses for demo - in production this would call the Gemini API
    await new Promise((resolve) => setTimeout(resolve, 1500 + Math.random() * 1000));

    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes('ransomware') || lowerMessage.includes('threat')) {
      return `🔴 **Threat Analysis: Ransomware Detection**

Based on my analysis, here's what I found:

**MITRE ATT&CK Mapping:**
- **Tactic:** Impact (TA0040)
- **Technique:** T1486 - Data Encrypted for Impact
- **Kill Chain Phase:** Actions on Objectives

**Business Impact Assessment:**
- 💰 Estimated Financial Impact: $150,000 - $500,000
- ⏱️ Potential Downtime: 24-72 hours
- 📋 Compliance Risk: HIGH (GDPR, SOC 2 violations)
- 🏢 Reputation Damage: SEVERE

**Recommended Actions:**
1. ✅ Immediately isolate affected endpoint (WS-FINANCE-04)
2. ✅ Revoke all active sessions for compromised accounts
3. ✅ Initiate backup restoration protocol
4. ✅ Enable enhanced monitoring on all finance endpoints
5. ✅ Notify incident response team

Would you like me to generate a detailed incident response playbook?`;
    }

    if (lowerMessage.includes('compliance') || lowerMessage.includes('soc') || lowerMessage.includes('gdpr')) {
      return `📋 **Compliance Status Overview**

**Current Scores:**
| Framework | Score | Status |
|-----------|-------|--------|
| SOC 2 Type II | 87% | ⚠️ Partial |
| ISO 27001 | 92% | ✅ Compliant |
| GDPR | 78% | ⚠️ Partial |
| HIPAA | 94% | ✅ Compliant |

**Critical Gaps Identified:**
1. **SOC 2:** Missing encryption-at-rest for 3 database servers
2. **GDPR:** Data retention policies need update for EU customer data
3. **General:** Access review logs incomplete for Q4

**AI Recommendations:**
- Prioritize encryption implementation (estimated 2-3 days)
- Update data retention automation rules
- Schedule quarterly access reviews

Would you like a detailed remediation plan for any specific framework?`;
    }

    if (lowerMessage.includes('endpoint') || lowerMessage.includes('server')) {
      return `🖥️ **Endpoint Security Analysis**

**Overview:**
- Total Endpoints: 847
- Online: 839 (99.1%)
- At Risk: 12 (1.4%)
- Compromised: 2 (0.2%)

**High-Risk Endpoints:**
1. **WS-FINANCE-04** - Risk Score: 95/100
   - Active ransomware detected
   - Status: Compromised, Isolated
   
2. **WS-IT-07** - Risk Score: 88/100
   - Suspicious lateral movement
   - Status: Isolated, Under Investigation

3. **SRV-DB-01** - Risk Score: 67/100
   - Unusual outbound traffic
   - Status: Monitoring Enhanced

**Recommended Actions:**
- Run full malware scan on finance department workstations
- Review all privileged access in the last 24 hours
- Enable enhanced EDR monitoring

Need details on any specific endpoint?`;
    }

    return `🤖 **Analysis Complete**

I've analyzed your query about "${userMessage}".

**Key Insights:**
- Your security posture shows 3 areas requiring attention
- Current threat level: **HIGH** (elevated from normal)
- Recommended priority: Address active threats first

**Next Steps:**
1. Review the 6 active threats in your dashboard
2. Complete pending vulnerability scans
3. Update endpoint protection policies

Would you like me to elaborate on any of these points or provide specific remediation steps?`;
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await generateAIResponse(input);
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error generating response:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestedQueries = [
    'Analyze the ransomware threat',
    'Show compliance status',
    'Endpoint security report',
    'Predict next attack vector',
  ];

  return (
    <Card variant="glass" className="flex flex-col h-[600px]">
      <CardHeader className="pb-3 border-b border-border/50">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Bot className="h-5 w-5 text-primary" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-success rounded-full animate-pulse" />
            </div>
            <span>AI Security Assistant</span>
          </div>
          <Badge variant="success" className="gap-1">
            <Sparkles className="h-3 w-3" />
            Gemini Powered
          </Badge>
        </CardTitle>
      </CardHeader>

      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          <AnimatePresence initial={false}>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    message.role === 'user'
                      ? 'bg-gradient-to-br from-primary to-accent'
                      : 'bg-secondary border border-border'
                  }`}
                >
                  {message.role === 'user' ? (
                    <User className="h-4 w-4 text-primary-foreground" />
                  ) : (
                    <Bot className="h-4 w-4 text-primary" />
                  )}
                </div>
                <div
                  className={`flex-1 rounded-xl p-4 ${
                    message.role === 'user'
                      ? 'bg-primary/20 border border-primary/30'
                      : 'bg-secondary/50 border border-border/50'
                  }`}
                >
                  <div className="text-sm whitespace-pre-wrap prose prose-invert prose-sm max-w-none">
                    {message.content.split('\n').map((line, i) => (
                      <p key={i} className="mb-2 last:mb-0">
                        {line}
                      </p>
                    ))}
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3"
            >
              <div className="w-8 h-8 rounded-full bg-secondary border border-border flex items-center justify-center">
                <Bot className="h-4 w-4 text-primary" />
              </div>
              <div className="bg-secondary/50 border border-border/50 rounded-xl p-4">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  <span className="text-sm text-muted-foreground">Analyzing security data...</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </ScrollArea>

      {/* Suggested queries */}
      {messages.length <= 2 && (
        <div className="px-4 pb-2">
          <p className="text-xs text-muted-foreground mb-2">Suggested queries:</p>
          <div className="flex flex-wrap gap-2">
            {suggestedQueries.map((query) => (
              <Button
                key={query}
                variant="outline"
                size="sm"
                onClick={() => setInput(query)}
                className="text-xs"
              >
                {query}
              </Button>
            ))}
          </div>
        </div>
      )}

      <CardContent className="border-t border-border/50 p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex gap-2"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about threats, compliance, or security..."
            className="flex-1 bg-secondary/50 border-border/50"
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading || !input.trim()}>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
