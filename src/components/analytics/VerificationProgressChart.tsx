
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, CartesianGrid, XAxis, YAxis, Bar } from 'recharts';
import { useBatch } from '@/contexts/BatchContext';
import { generateVerificationData } from './utils/analyticsUtils';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

const VerificationProgressChart: React.FC = () => {
  const { batches } = useBatch();
  const verificationData = React.useMemo(() => generateVerificationData(batches), [batches]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Blockchain Verification Progress</CardTitle>
        <CardDescription>Signature verification stages across all batches</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ChartContainer
            config={{
              "No Verification": { color: "#e5e7eb" },
              "25% Verified": { color: "#93c5fd" },
              "50% Verified": { color: "#60a5fa" }, 
              "75% Verified": { color: "#3b82f6" },
              "100% Verified": { color: "#1d4ed8" }
            }}
          >
            <BarChart data={verificationData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="count" name="Batches" />
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default VerificationProgressChart;
