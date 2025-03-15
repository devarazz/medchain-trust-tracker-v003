
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search, BarChart2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface BatchListFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  showAnalytics: boolean;
  toggleAnalyticsView: () => void;
}

const BatchListFilters: React.FC<BatchListFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  showAnalytics,
  toggleAnalyticsView,
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name or batch ID"
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <Select
        value={statusFilter}
        onValueChange={setStatusFilter}
      >
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="registered">Registered</SelectItem>
            <SelectItem value="in-transit">In Transit</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="flagged">Flagged</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      
      <Button
        variant="outline"
        className="gap-2"
        onClick={toggleAnalyticsView}
      >
        <BarChart2 className="h-4 w-4" />
        {showAnalytics ? "View Batches" : "View Analytics"}
      </Button>
    </div>
  );
};

export default BatchListFilters;
