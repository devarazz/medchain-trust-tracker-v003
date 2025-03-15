
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useBatch } from '@/contexts/BatchContext';
import { generateAlertAnalytics } from './utils/analyticsUtils';
import { AlertTriangle, CheckCircle2, Factory } from 'lucide-react';

const AlertAnalytics: React.FC = () => {
  const { batchNotifications } = useBatch();
  const { alertsByType } = generateAlertAnalytics(batchNotifications);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Verification Alerts</CardTitle>
          <CheckCircle2 className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{alertsByType.verification}</div>
          <p className="text-xs text-muted-foreground mt-2">Blockchain signature verifications</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">New Batch Alerts</CardTitle>
          <Factory className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{alertsByType.registration}</div>
          <p className="text-xs text-muted-foreground mt-2">Recently registered batches</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Issue Reports</CardTitle>
          <AlertTriangle className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{alertsByType.issues}</div>
          <p className="text-xs text-muted-foreground mt-2">Potential counterfeits or quality issues</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AlertAnalytics;
