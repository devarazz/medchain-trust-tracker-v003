
import { Batch, Notification } from '@/types/batch';

// Calculate overall supply chain health (0-100%)
export const calculateSupplyChainHealth = (batches: Batch[]): number => {
  if (batches.length === 0) return 100;
  
  const flaggedBatches = batches.filter(batch => batch.status === 'flagged').length;
  const percentageHealthy = 100 - ((flaggedBatches / batches.length) * 100);
  return Math.round(percentageHealthy);
};

// Generate status distribution data for pie chart
export const generateStatusData = (batches: Batch[]) => {
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
};

// Generate verification progress data
export const generateVerificationData = (batches: Batch[]) => {
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
};

// Generate timeline data (last 5 batches)
export const generateTimelineData = (batches: Batch[]) => {
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
};

// Generate alert analytics
export const generateAlertAnalytics = (notifications: Notification[]) => {
  const unreadAlerts = notifications.filter(n => !n.read).length;
  const alertsByType = {
    verification: notifications.filter(n => n.message.includes('signed')).length,
    registration: notifications.filter(n => n.message.includes('registered')).length,
    issues: notifications.filter(n => n.message.includes('reported')).length,
  };
  
  return { unreadAlerts, alertsByType };
};

// Get color for health indicator
export const getHealthColor = (health: number): string => {
  if (health >= 90) return 'text-green-500';
  if (health >= 70) return 'text-yellow-500';
  return 'text-red-500';
};
