
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, AlertCircle } from 'lucide-react';

interface BatchReportDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  reportReason: string;
  setReportReason: (reason: string) => void;
  onSubmit: () => void;
}

const BatchReportDialog: React.FC<BatchReportDialogProps> = ({
  open,
  setOpen,
  reportReason,
  setReportReason,
  onSubmit,
}) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Report Fake or Suspicious Batch</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="reason">
              Reason for Reporting
            </label>
            <textarea
              id="reason"
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Describe the issue with this batch"
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter className="flex gap-2 justify-end">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onSubmit}
            disabled={!reportReason.trim()}
          >
            Report Batch
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BatchReportDialog;
