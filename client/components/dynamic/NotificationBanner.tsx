import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  X, 
  Bell, 
  ExternalLink,
  Clock,
  Zap
} from 'lucide-react';
import { NotificationData, apiUtils } from '@/lib/api';

interface NotificationBannerProps {
  notifications: NotificationData[];
  onMarkAsRead: (id: string) => void;
  onDismiss: (id: string) => void;
  maxNotifications?: number;
  autoDismiss?: boolean;
  dismissDelay?: number;
  className?: string;
}

export default function NotificationBanner({
  notifications,
  onMarkAsRead,
  onDismiss,
  maxNotifications = 5,
  autoDismiss = true,
  dismissDelay = 5000,
  className = '',
}: NotificationBannerProps) {
  const [visibleNotifications, setVisibleNotifications] = useState<NotificationData[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Filter unread notifications and limit to maxNotifications
    const unreadNotifications = notifications
      .filter(notification => !notification.read)
      .slice(0, isExpanded ? notifications.length : maxNotifications);

    setVisibleNotifications(unreadNotifications);
  }, [notifications, maxNotifications, isExpanded]);

  useEffect(() => {
    if (!autoDismiss) return;

    const timers: NodeJS.Timeout[] = [];

    visibleNotifications.forEach(notification => {
      const timer = setTimeout(() => {
        onDismiss(notification.id);
      }, dismissDelay);

      timers.push(timer);
    });

    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [visibleNotifications, autoDismiss, dismissDelay, onDismiss]);

  const getNotificationIcon = (type: NotificationData['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      case 'error':
        return <AlertTriangle className="w-5 h-5 text-red-400" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-400" />;
      default:
        return <Bell className="w-5 h-5 text-gray-400" />;
    }
  };

  const getNotificationBgColor = (type: NotificationData['type']) => {
    switch (type) {
      case 'success':
        return 'bg-green-500/10 border-green-500/20';
      case 'warning':
        return 'bg-yellow-500/10 border-yellow-500/20';
      case 'error':
        return 'bg-red-500/10 border-red-500/20';
      case 'info':
        return 'bg-blue-500/10 border-blue-500/20';
      default:
        return 'bg-white/10 border-white/20';
    }
  };

  const getNotificationTextColor = (type: NotificationData['type']) => {
    switch (type) {
      case 'success':
        return 'text-green-400';
      case 'warning':
        return 'text-yellow-400';
      case 'error':
        return 'text-red-400';
      case 'info':
        return 'text-blue-400';
      default:
        return 'text-gray-400';
    }
  };

  if (visibleNotifications.length === 0) {
    return null;
  }

  return (
    <div className={`fixed top-20 right-4 z-50 space-y-2 ${className}`}>
      {visibleNotifications.map((notification, index) => (
        <div
          key={notification.id}
          className={`
            glass-card p-4 rounded-xl border transition-all duration-300 transform
            ${getNotificationBgColor(notification.type)}
            animate-in slide-in-from-right-4
            hover:scale-105 hover:shadow-lg
          `}
          style={{
            animationDelay: `${index * 100}ms`,
          }}
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              {getNotificationIcon(notification.type)}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <h4 className="text-sm font-semibold text-white">
                  {notification.title}
                </h4>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-gray-400">
                    {apiUtils.formatRelativeTime(notification.timestamp)}
                  </span>
                  <button
                    onClick={() => onDismiss(notification.id)}
                    className="p-1 rounded hover:bg-white/10 transition-colors"
                  >
                    <X className="w-3 h-3 text-gray-400" />
                  </button>
                </div>
              </div>
              
              <p className="text-sm text-gray-300 mt-1">
                {notification.message}
              </p>
              
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onMarkAsRead(notification.id)}
                    className={`text-xs font-medium ${getNotificationTextColor(notification.type)} hover:underline`}
                  >
                    Mark as read
                  </button>
                  {notification.actionUrl && (
                    <a
                      href={notification.actionUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-medium text-primary hover:underline flex items-center gap-1"
                    >
                      View Details
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
                
                {autoDismiss && (
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Clock className="w-3 h-3" />
                    <span>Auto-dismiss in {(dismissDelay / 1000).toFixed(0)}s</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
      
      {notifications.length > maxNotifications && !isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          className="glass-card p-3 rounded-xl border border-white/20 hover:bg-white/10 transition-colors text-center w-full"
        >
          <span className="text-sm text-gray-300">
            Show {notifications.length - maxNotifications} more notifications
          </span>
        </button>
      )}
      
      {isExpanded && notifications.length > maxNotifications && (
        <button
          onClick={() => setIsExpanded(false)}
          className="glass-card p-3 rounded-xl border border-white/20 hover:bg-white/10 transition-colors text-center w-full"
        >
          <span className="text-sm text-gray-300">
            Show less
          </span>
        </button>
      )}
    </div>
  );
}

// Live notification component for real-time updates
export function LiveNotificationBanner() {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Simulate real-time notifications
    const mockNotifications: NotificationData[] = [
      {
        id: '1',
        type: 'success',
        title: 'Subsidy Released',
        message: '₹2 Cr subsidy just released to GreenHydro Ltd.',
        timestamp: new Date().toISOString(),
        read: false,
        actionUrl: '/projects/greenhydro-ltd',
      },
      {
        id: '2',
        type: 'info',
        title: 'New Project Onboarded',
        message: 'HydroTech Solutions joined the subsidy program',
        timestamp: new Date(Date.now() - 300000).toISOString(),
        read: false,
      },
      {
        id: '3',
        type: 'warning',
        title: 'Milestone Due',
        message: 'Project PROJ-001 milestone M3 is due in 2 days',
        timestamp: new Date(Date.now() - 600000).toISOString(),
        read: false,
        actionUrl: '/projects/proj-001',
      },
    ];

    setNotifications(mockNotifications);
    setIsVisible(true);

    // Simulate new notifications
    const interval = setInterval(() => {
      const newNotification: NotificationData = {
        id: Date.now().toString(),
        type: Math.random() > 0.7 ? 'success' : 'info',
        title: 'Live Update',
        message: `Real-time update: ${Math.random().toFixed(2)}M subsidy processed`,
        timestamp: new Date().toISOString(),
        read: false,
      };

      setNotifications(prev => [newNotification, ...prev.slice(0, 9)]);
    }, 10000); // New notification every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const handleDismiss = (id: string) => {
    setNotifications(prev =>
      prev.filter(notification => notification.id !== id)
    );
  };

  if (!isVisible) return null;

  return (
    <NotificationBanner
      notifications={notifications}
      onMarkAsRead={handleMarkAsRead}
      onDismiss={handleDismiss}
      maxNotifications={3}
      autoDismiss={true}
      dismissDelay={8000}
    />
  );
}

// Notification counter badge
export function NotificationBadge({ count, onClick }: { count: number; onClick?: () => void }) {
  if (count === 0) return null;

  return (
    <button
      onClick={onClick}
      className="relative p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
    >
      <Bell className="w-5 h-5 text-white" />
      <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold text-white animate-pulse">
        {count > 99 ? '99+' : count}
      </span>
    </button>
  );
}
