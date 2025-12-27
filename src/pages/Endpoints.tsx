import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Server } from 'lucide-react';
import { mockEndpoints } from '@/lib/mockData';

const Endpoints = () => (
  <DashboardLayout>
    <h1 className="text-3xl font-bold mb-6 text-gradient-cyber">Endpoint Management</h1>
    <div className="grid gap-4">
      {mockEndpoints.map((ep) => (
        <Card key={ep.id} variant="glass">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Server className="h-8 w-8 text-primary" />
              <div>
                <p className="font-semibold">{ep.name}</p>
                <p className="text-sm text-muted-foreground">{ep.ip} • {ep.os}</p>
              </div>
            </div>
            <Badge variant={ep.status as any}>{ep.status}</Badge>
          </CardContent>
        </Card>
      ))}
    </div>
  </DashboardLayout>
);

export default Endpoints;
