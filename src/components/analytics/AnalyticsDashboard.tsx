import React from 'react';
import { useBatch } from '@/contexts/BatchContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  ClipboardCheck,
  Factory,
  Package,
  ShieldCheck,
  Truck
} from 'lucide-react';
import { 
  ChartContainer, 
  ChartTooltipContent, 
  ChartTooltip 
} from '@/components/ui/chart';

const AnalyticsDashboard = () => {
  const { batches, batchNotifications } = useBatch();
  
  // Calculate overall supply chain health (0-100%)
  const calculateSupplyChainHealth = () => {
    if (batches.length === 0) return 100;
    
    const flaggedBatches = batches.filter(batch => batch.status === 'flagged').length;
    const percentageHealthy = 100 - ((flaggedBatches / batches.length) * 100);
    return Math.round(percentageHealthy);
  };
  
  // Status distribution data for pie chart
  const statusData = React.useMemo(() => {
    const statusCounts = {
      registered: 0,
      'in-transit': 0,
      delivered: 0,
      flagged: 0,
    };
    
    batches.forEach(batch => {
      if (statusCounts[batch.status as keyof typeof statusCounts] !== undefined) {
        statusCounts[batch.status as keyof typeof statusCounts]++;
      }
    });
    
    return [
      { name: 'Registered', value: statusCounts.registered, color: '#3b82f6' },
      { name: 'In Transit', value: statusCounts['in-transit'], color: '#f59e0b' },
      { name: 'Delivered', value: statusCounts.delivered, color: '#10b981' },
      { name: 'Flagged', value: statusCounts.flagged, color: '#ef4444' },
    ];
  }, [batches]);

  // Verification progress data
  const verificationData = React.useMemo(() => {
    const verificationStages = {
      '0': 0, // No signatures
      '1': 0, // 1 signature
      '2': 0, // 2 signatures
      '3': 0, // 3 signatures
      '4': 0, // Fully verified (4 signatures)
    };
    
    batches.forEach(batch => {
      const sigCount = Math.min(batch.signatures.length, 4);
      verificationStages[sigCount.toString() as keyof typeof verificationStages]++;
    });
    
    return [
      { name: 'No Verification', count: verificationStages['0'] },
      { name: '25% Verified', count: verificationStages['1'] },
      { name: '50% Verified', count: verificationStages['2'] },
      { name: '75% Verified', count: verificationStages['3'] },
      { name: '100% Verified', count: verificationStages['4'] },
    ];
  }, [batches]);

  // Manufacturing timeline data (last 5 batches)
  const timelineData = React.useMemo(() => {
    return batches
      .slice()
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
      .map(batch => ({
        name: batch.id.slice(-5),
        signatures: batch.signatures.length,
        quantity: batch.quantity / 1000, // Scale down for better visualization
        date: new Date(batch.createdAt).toLocaleDateString()
      }))
      .reverse();
  }, [batches]);

  // Alert analytics
  const unreadAlerts = batchNotifications.filter(n => !n.read).length;
  const alertsByType = {
    verification: batchNotifications.filter(n => n.message.includes('signed')).length,
    registration: batchNotifications.filter(n => n.message.includes('registered')).length,
    issues: batchNotifications.filter(n => n.message.includes('reported')).length,
  };

  const supplyChainHealth = calculateSupplyChainHealth();
  
  // Color coding for health indicator
  const getHealthColor = (health: number) => {
    if (health >= 90) return 'text-green-500';
    if (health >= 70) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Supply Chain Analytics</h2>
        <p className="text-muted-foreground">Real-time insights into your pharmaceutical supply chain</p>
      </div>

      {/* Top metrics cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Supply Chain Health</CardTitle>
            <ShieldCheck className={`h-4 w-4 ${getHealthColor(supplyChainHealth)}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{supplyChainHealth}%</div>
            <Progress value={supplyChainHealth} className="h-2 mt-2" />
            <p className="text-xs text-muted-foreground mt-2">Overall blockchain verification level</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Batches</CardTitle>
            <Package className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{batches.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {batches.filter(b => b.status === 'delivered').length} delivered
              <span className="text-green-500 ml-1 inline-flex items-center">
                <ArrowUpRight className="h-3 w-3" />
              </span>
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alert Notifications</CardTitle>
            <AlertTriangle className={`h-4 w-4 ${unreadAlerts > 0 ? 'text-amber-500' : 'text-green-500'}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unreadAlerts}</div>
            <p className="text-xs text-muted-foreground mt-1">Unread notifications requiring attention</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verification Rate</CardTitle>
            <ClipboardCheck className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {batches.length > 0 
                ? Math.round((batches.filter(b => b.signatures.length === 4).length / batches.length) * 100)
                : 0}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">Fully verified batches in blockchain</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Status distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Batch Status Distribution</CardTitle>
            <CardDescription>Current state of batches in the supply chain</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} batches`, 'Count']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Verification progress */}
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
      </div>

      {/* Timeline chart (full width) */}
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

      {/* Alert analytics (full width) */}
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
    </div>
  );
};

export default AnalyticsDashboard;
