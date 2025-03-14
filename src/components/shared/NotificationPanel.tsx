
import React from 'react';
import { useBatch } from '@/contexts/BatchContext';
import { formatDistanceToNow } from 'date-fns';
import { Check, Info, X } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface NotificationPanelProps {
  onClose: () => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ onClose }) => {
  const { batchNotifications, clearBatchNotification } = useBatch();
  
  const handleMarkAsRead = (id: string) => {
    clearBatchNotification(id);
  };
  
  const handleMarkAllAsRead = () => {
    batchNotifications.forEach(notification => {
      if (!notification.read) {
        clearBatchNotification(notification.id);
      }
    });
  };
  
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between pb-4">
        <h3 className="text-lg font-semibold">Notifications</h3>
        <div className="flex items-center gap-2">
          {batchNotifications.some(n => !n.read) && (
            <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
              <Check className="mr-1 h-4 w-4" />
              Mark all as read
            </Button>
          )}
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <Separator />
      
      <ScrollArea className="flex-1 overflow-auto">
        <div className="space-y-4 py-4">
          {batchNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Info className="h-10 w-10 text-muted-foreground/60 mb-3" />
              <p className="text-muted-foreground">No notifications yet</p>
            </div>
          ) : (
            batchNotifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`p-3 rounded-md flex gap-3 items-start ${notification.read ? 'bg-gray-50' : 'bg-primary/5 border-l-2 border-primary animate-pulse-slow'}`}
              >
                <div className="flex-1">
                  <p className={`text-sm ${notification.read ? 'text-muted-foreground' : 'text-foreground'}`}>
                    {notification.message}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                  </p>
                </div>
                {!notification.read && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleMarkAsRead(notification.id)}
                    className="h-6 w-6"
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default NotificationPanel;
