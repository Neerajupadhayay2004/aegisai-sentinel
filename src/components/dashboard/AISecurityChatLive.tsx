import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles, Loader2, AlertTriangle, Shield, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useAIChat } from '@/hooks/useAIChat';
import { ChatMessage } from '@/types/security';

const initialMessage: ChatMessage = {
  id: '0',
  role: 'assistant',
  content: `🛡️ **AegisAI Security Assistant Online**

I'm powered by Google Gemini and ready to help with:

• **Threat Analysis** - MITRE ATT&CK mapping & root cause analysis
• **Incident Response** - Automated playbooks & remediation steps  
• **Predictive Intelligence** - Attack forecasting & risk assessment
• **Compliance** - SOC 2, ISO 27001, GDPR guidance

Ask me anything about your security posture!`,
  timestamp: new Date(),
};

interface Props {
  threatContext?: {
    activeThreats: number;
    riskScore: number;
    recentIncidents: string[];
  };
}

export const AISecurityChatLive = ({ threatContext }: Props) => {
  const { messages, isLoading, sendMessage, setMessages, clearMessages } = useAIChat(threatContext);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([initialMessage]);
  }, [setMessages]);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userInput = input;
    setInput('');
    await sendMessage(userInput);
  };

  const suggestedQueries = [
    'Analyze ransomware threat',
    'Show MITRE mapping',
    'Compliance status',
    'Predict next attack',
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
            <span>AI Security Analyst</span>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => { clearMessages(); setMessages([initialMessage]); }}
              className="h-8 w-8 p-0"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <Badge variant="success" className="gap-1">
              <Sparkles className="h-3 w-3" />
              Gemini Live
            </Badge>
          </div>
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
                  className={`flex-1 rounded-xl p-4 max-w-[85%] ${
                    message.role === 'user'
                      ? 'bg-primary/20 border border-primary/30'
                      : 'bg-secondary/50 border border-border/50'
                  }`}
                >
                  <div className="text-sm whitespace-pre-wrap prose prose-invert prose-sm max-w-none">
                    {message.content.split('\n').map((line, i) => (
                      <p key={i} className="mb-1 last:mb-0">
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
                  <span className="text-sm text-muted-foreground">Analyzing with Gemini AI...</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </ScrollArea>

      {/* Suggested queries */}
      {messages.length <= 2 && (
        <div className="px-4 pb-2">
          <p className="text-xs text-muted-foreground mb-2">Quick actions:</p>
          <div className="flex flex-wrap gap-2">
            {suggestedQueries.map((query) => (
              <Button
                key={query}
                variant="outline"
                size="sm"
                onClick={() => setInput(query)}
                className="text-xs h-7"
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
          <Button type="submit" disabled={isLoading || !input.trim()} variant="cyber">
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
