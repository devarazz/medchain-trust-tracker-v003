
import React from 'react';

interface BatchInfoItemProps {
  label: string;
  value: React.ReactNode;
}

const BatchInfoItem: React.FC<BatchInfoItemProps> = ({ label, value }) => (
  <div>
    <p className="text-muted-foreground">{label}</p>
    <p>{value}</p>
  </div>
);

export default BatchInfoItem;
