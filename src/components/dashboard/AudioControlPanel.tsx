import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Volume2, 
  VolumeX, 
  Bell, 
  BellOff,
  Settings,
  Play,
  AlertTriangle,
  Shield,
  Zap
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useAudioAlerts } from '@/hooks/useAudioAlerts';

interface AudioControlPanelProps {
  className?: string;
  compact?: boolean;
}

export const AudioControlPanel = ({ className = '', compact = false }: AudioControlPanelProps) => {
  const { 
    settings, 
    updateSettings, 
    testSound,
    notificationsEnabled,
    requestNotificationPermission 
  } = useAudioAlerts();

  if (compact) {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className={`relative ${className}`}
          >
            {settings.enabled ? (
              <Volume2 className="h-5 w-5" />
            ) : (
              <VolumeX className="h-5 w-5 text-muted-foreground" />
            )}
            {settings.enabled && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-success rounded-full animate-pulse" />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="end">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Volume2 className="h-4 w-4 text-primary" />
                <span className="font-medium">Audio Alerts</span>
              </div>
              <Switch
                checked={settings.enabled}
                onCheckedChange={(enabled) => updateSettings({ enabled })}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Volume</span>
                <span className="text-foreground">{Math.round(settings.volume * 100)}%</span>
              </div>
              <Slider
                value={[settings.volume * 100]}
                onValueChange={([v]) => updateSettings({ volume: v / 100 })}
                max={100}
                step={5}
                disabled={!settings.enabled}
              />
            </div>

            <div className="space-y-2">
              <span className="text-sm text-muted-foreground">Alert Types</span>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-destructive" />
                    <span className="text-sm">Critical</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => testSound('critical')}
                    >
                      <Play className="h-3 w-3" />
                    </Button>
                    <Switch
                      checked={settings.criticalAlerts}
                      onCheckedChange={(criticalAlerts) => updateSettings({ criticalAlerts })}
                      disabled={!settings.enabled}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-warning" />
                    <span className="text-sm">High</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => testSound('high')}
                    >
                      <Play className="h-3 w-3" />
                    </Button>
                    <Switch
                      checked={settings.highAlerts}
                      onCheckedChange={(highAlerts) => updateSettings({ highAlerts })}
                      disabled={!settings.enabled}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-yellow-500" />
                    <span className="text-sm">Medium</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => testSound('medium')}
                    >
                      <Play className="h-3 w-3" />
                    </Button>
                    <Switch
                      checked={settings.mediumAlerts}
                      onCheckedChange={(mediumAlerts) => updateSettings({ mediumAlerts })}
                      disabled={!settings.enabled}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-border/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  <span className="text-sm">Browser Notifications</span>
                </div>
                {notificationsEnabled ? (
                  <Badge variant="success" className="text-xs">Enabled</Badge>
                ) : (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={requestNotificationPermission}
                  >
                    Enable
                  </Button>
                )}
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Card variant="glass" className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Volume2 className="h-5 w-5 text-primary" />
            <span>Audio Alert System</span>
          </div>
          <Switch
            checked={settings.enabled}
            onCheckedChange={(enabled) => updateSettings({ enabled })}
          />
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Volume Control */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Master Volume</span>
            <span className="text-sm text-muted-foreground">{Math.round(settings.volume * 100)}%</span>
          </div>
          <div className="flex items-center gap-3">
            <VolumeX className="h-4 w-4 text-muted-foreground" />
            <Slider
              value={[settings.volume * 100]}
              onValueChange={([v]) => updateSettings({ volume: v / 100 })}
              max={100}
              step={5}
              className="flex-1"
              disabled={!settings.enabled}
            />
            <Volume2 className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>

        {/* Alert Type Settings */}
        <div className="space-y-3">
          <span className="text-sm font-medium">Alert Types</span>
          
          <div className="space-y-2">
            <motion.div 
              className={`flex items-center justify-between p-3 rounded-lg border ${
                settings.criticalAlerts ? 'bg-destructive/10 border-destructive/30' : 'bg-secondary/50 border-border/50'
              }`}
              whileHover={{ scale: 1.01 }}
            >
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                <div>
                  <div className="font-medium text-sm">Critical Alerts</div>
                  <div className="text-xs text-muted-foreground">Urgent pulsing alarm</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => testSound('critical')}
                >
                  <Play className="h-4 w-4" />
                </Button>
                <Switch
                  checked={settings.criticalAlerts}
                  onCheckedChange={(criticalAlerts) => updateSettings({ criticalAlerts })}
                  disabled={!settings.enabled}
                />
              </div>
            </motion.div>

            <motion.div 
              className={`flex items-center justify-between p-3 rounded-lg border ${
                settings.highAlerts ? 'bg-warning/10 border-warning/30' : 'bg-secondary/50 border-border/50'
              }`}
              whileHover={{ scale: 1.01 }}
            >
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-warning" />
                <div>
                  <div className="font-medium text-sm">High Priority</div>
                  <div className="text-xs text-muted-foreground">Warning beeps</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => testSound('high')}
                >
                  <Play className="h-4 w-4" />
                </Button>
                <Switch
                  checked={settings.highAlerts}
                  onCheckedChange={(highAlerts) => updateSettings({ highAlerts })}
                  disabled={!settings.enabled}
                />
              </div>
            </motion.div>

            <motion.div 
              className={`flex items-center justify-between p-3 rounded-lg border ${
                settings.mediumAlerts ? 'bg-yellow-500/10 border-yellow-500/30' : 'bg-secondary/50 border-border/50'
              }`}
              whileHover={{ scale: 1.01 }}
            >
              <div className="flex items-center gap-3">
                <Zap className="h-5 w-5 text-yellow-500" />
                <div>
                  <div className="font-medium text-sm">Medium Alerts</div>
                  <div className="text-xs text-muted-foreground">Attention tone</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => testSound('medium')}
                >
                  <Play className="h-4 w-4" />
                </Button>
                <Switch
                  checked={settings.mediumAlerts}
                  onCheckedChange={(mediumAlerts) => updateSettings({ mediumAlerts })}
                  disabled={!settings.enabled}
                />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Browser Notifications */}
        <div className="pt-4 border-t border-border/50">
          <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
            <div className="flex items-center gap-3">
              {notificationsEnabled ? (
                <Bell className="h-5 w-5 text-primary" />
              ) : (
                <BellOff className="h-5 w-5 text-muted-foreground" />
              )}
              <div>
                <div className="font-medium text-sm">Browser Notifications</div>
                <div className="text-xs text-muted-foreground">
                  {notificationsEnabled ? 'Enabled for critical alerts' : 'Click to enable'}
                </div>
              </div>
            </div>
            {notificationsEnabled ? (
              <Badge variant="success" className="text-xs">Active</Badge>
            ) : (
              <Button 
                variant="outline" 
                size="sm"
                onClick={requestNotificationPermission}
              >
                Enable
              </Button>
            )}
          </div>
        </div>

        {/* Test Sounds */}
        <div className="pt-4 border-t border-border/50">
          <span className="text-sm font-medium mb-3 block">Test Sounds</span>
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => testSound('success')}
              disabled={!settings.enabled}
            >
              <Play className="h-3 w-3 mr-1" />
              Success
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => testSound('notification')}
              disabled={!settings.enabled}
            >
              <Play className="h-3 w-3 mr-1" />
              Notification
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
