import React, { useEffect, useState } from 'react';
import {
  getNotificationsPlaceholder,
  markAllNotificationsAsReadPlaceholder,
  markNotificationAsReadPlaceholder,
  NotificationItem,
} from '../../services/shellPlaceholder';

interface NotificationsDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onViewAll: () => void;
}

/**
 * NotificationsDropdown: Small popup anchored to the top nav bell.
 * Matches design/ui-reference/shell/notifications-dropdown.
 */
export const NotificationsDropdown: React.FC<NotificationsDropdownProps> = ({
  isOpen,
  onClose,
  onViewAll,
}) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getNotificationsPlaceholder();
      setNotifications(data);
      setIsLoading(false);
    } catch {
      setIsLoading(false);
      setError('Failed to load notifications. Try again.');
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllAsRead = async () => {
    await markAllNotificationsAsReadPlaceholder();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleItemClick = async (id: string) => {
    await markNotificationAsReadPlaceholder(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  return (
    <div className="absolute right-0 top-12 w-80 sm:w-96 bg-[#FAFCFE] rounded-2xl border border-[#E2E5E6] shadow-2xl z-50 overflow-hidden flex flex-col max-h-[500px] animate-in fade-in slide-in-from-top-2 duration-150">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[#EEF0F2] bg-[#FAFCFE]">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-bold text-[#1C211B]">Notifications</h4>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#EAF7EE] text-[#3C7429]">
              {unreadCount} new
            </span>
          )}
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={handleMarkAllAsRead}
            className="text-xs text-[#936B40] hover:text-[#745029] font-medium transition-colors focus:outline-none"
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* Body List */}
      <div className="overflow-y-auto flex-1 divide-y divide-[#EEF0F2]">
        {isLoading ? (
          <div className="p-8 text-center text-xs text-[#7B7E7B] flex flex-col items-center gap-2">
            <svg className="animate-spin h-5 w-5 text-[#3C7429]" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span>Loading notifications...</span>
          </div>
        ) : error ? (
          <div className="p-6 text-center text-xs text-[#C54A40]">
            <p>{error}</p>
            <button
              type="button"
              onClick={fetchNotifications}
              className="mt-2 text-xs text-[#3C7429] font-semibold underline"
            >
              Try again
            </button>
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#7B7E7B]">
            <p className="font-semibold text-[#1C211B]">No notifications</p>
            <p className="mt-1">You're all caught up with recent activity.</p>
          </div>
        ) : (
          notifications.slice(0, 5).map((notif) => (
            <div
              key={notif.id}
              onClick={() => handleItemClick(notif.id)}
              className={`p-3.5 hover:bg-[#EEF0F2]/50 transition-colors cursor-pointer flex items-start gap-3 ${
                !notif.read ? 'bg-[#F5F8F4]/40' : ''
              }`}
            >
              {/* Dot indicator */}
              <div className="mt-1.5 shrink-0">
                <span
                  className={`block w-2 h-2 rounded-full ${
                    !notif.read ? 'bg-[#3C7429]' : 'bg-transparent'
                  }`}
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h5 className="text-xs font-bold text-[#1C211B] truncate">{notif.title}</h5>
                  <span className="text-[10px] text-[#7B7E7B] shrink-0">{notif.timestamp}</span>
                </div>
                <p className="text-xs text-[#5E625E] mt-0.5 line-clamp-2">{notif.message}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-[#EEF0F2] bg-[#FAFCFE] text-center">
        <button
          type="button"
          onClick={() => {
            onClose();
            onViewAll();
          }}
          className="text-xs font-semibold text-[#2E5421] hover:text-[#131811] transition-colors focus:outline-none"
        >
          View all notifications →
        </button>
      </div>
    </div>
  );
};
