
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, CartesianGrid, XAxis, YAxis, Line, Legend } from 'recharts';
import { useBatch } from '@/contexts/BatchContext';
import { generateTimelineData } from './utils/analyticsUtils';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

const BatchTimelineChart: React.FC = () => {
  const { batches } = useBatch();
  const timelineData = React.useMemo(() => generateTimelineData(batches), [batches]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Batch Activity Timeline</CardTitle>
        <CardDescription>Manufacturing and verification activity for recent batches</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ChartContainer
            config={{
              "signatures": { 
                color: "#3b82f6",
                label: "Verification Signatures" 
              },
              "quantity": { 
                color: "#10b981",
                label: "Quantity (thousands)" 
              }
            }}
          >
            <LineChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="signatures"
                name="signatures"
                stroke="#3b82f6"
                activeDot={{ r: 8 }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="quantity"
                name="quantity"
                stroke="#10b981"
              />
              <Legend />
            </LineChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default BatchTimelineChart;
