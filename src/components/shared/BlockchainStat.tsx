
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface BlockchainStatProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
}

const BlockchainStat: React.FC<BlockchainStatProps> = ({
  icon: Icon,
  label,
  value
}) => (
  <div className="flex items-center gap-1">
    <Icon className="h-3.5 w-3.5 text-muted-foreground" />
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium">{value}</p>
    </div>
  </div>
);

export default BlockchainStat;
