import React, { useEffect, useState } from 'react';
import {
  getNotificationsPlaceholder,
  getOnlineUsersPlaceholder,
  NotificationItem,
  OnlineUser,
} from '../../services/shellPlaceholder';
import { ActivityItem } from '../ActivityItem';
import { StatusBadge } from '../StatusBadge';
import { ReviewRecordType } from '../../types/states';

export interface NotificationsPageProps {
  onAssignReportClick?: () => void;
  onReviewItemClick?: (recordType: ReviewRecordType, id?: string) => void;
}

/**
 * NotificationsPage: Full-page Notifications feed with Users Online sidebar.
 * Matches design/ui-reference/shell/Notifiications.png.
 */
export const NotificationsPage: React.FC<NotificationsPageProps> = ({
  onAssignReportClick,
  onReviewItemClick,
}) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [users, setUsers] = useState<OnlineUser[]>([]);
  const [searchNotification, setSearchNotification] = useState('');
  const [searchUser, setSearchUser] = useState('');

  const [isLoadingNotifications, setIsLoadingNotifications] = useState(true);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [notifError, setNotifError] = useState<string | null>(null);
  const [userError, setUserError] = useState<string | null>(null);

  const fetchAllData = async () => {
    try {
      setIsLoadingNotifications(true);
      setNotifError(null);
      const data = await getNotificationsPlaceholder();
      setNotifications(data);
      setIsLoadingNotifications(false);
    } catch {
      setIsLoadingNotifications(false);
      setNotifError('Failed to load notifications. Try again.');
    }

    try {
      setIsLoadingUsers(true);
      setUserError(null);
      const userData = await getOnlineUsersPlaceholder();
      setUsers(userData);
      setIsLoadingUsers(false);
    } catch {
      setIsLoadingUsers(false);
      setUserError('Failed to load users list. Try again.');
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const getNotificationIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'report_submission':
      case 'report_review':
      case 'report_approval':
        return {
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          ),
          bg: 'bg-[#EEF0F2] text-[#424641]',
        };
      case 'user_added':
        return {
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          ),
          bg: 'bg-[#ECFAF7] text-[#3CAD90]',
        };
      case 'block_added':
        return {
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          ),
          bg: 'bg-[#EDF2FD] text-[#406AC1]',
        };
      case 'assignment_deployed':
        return {
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          bg: 'bg-[#EEF0F2] text-[#1C211B]',
        };
      case 'campaign_added':
        return {
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
            </svg>
          ),
          bg: 'bg-[#F8F1E6] text-[#D89859]',
        };
      case 'tree_added':
        return {
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3L6 10h3l-4 7h6v4h2v-4h6l-4-7h3l-6-7z" />
            </svg>
          ),
          bg: 'bg-[#ECF1EA] text-[#3C7429]',
        };
      case 'system_error':
        return {
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          ),
          bg: 'bg-[#FDF0ED] text-[#D05D54]',
        };
      case 'security_alert':
        return {
          icon: (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          ),
          bg: 'bg-[#FBF5EE] text-[#B17E4B]',
        };
    }
  };

  const filteredNotifications = notifications.filter(
    (n) =>
      n.title.toLowerCase().includes(searchNotification.toLowerCase()) ||
      n.message.toLowerCase().includes(searchNotification.toLowerCase())
  );

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(searchUser.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Left Column: Notifications Feed (7 to 8 cols) */}
      <div className="lg:col-span-8 flex flex-col gap-4">
        <div>
          <h3 className="text-base font-bold text-[#1C211B]">Notifications</h3>
        </div>

        {/* Search input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7B7E7B]">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={searchNotification}
            onChange={(e) => setSearchNotification(e.target.value)}
            placeholder="Search here"
            className="w-full pl-10 pr-4 py-2.5 bg-[#FAFCFE] border border-[#CBCDCE] rounded-xl text-xs text-[#1C211B] placeholder-[#979A98] focus:outline-none focus:border-[#3C7429] focus:ring-1 focus:ring-[#3C7429] transition-colors"
          />
        </div>

        {/* Feed List */}
        <div className="flex flex-col gap-3">
          {isLoadingNotifications ? (
            <div className="p-12 text-center text-xs text-[#7B7E7B] flex flex-col items-center gap-2 bg-[#FAFCFE] rounded-2xl border border-[#E2E5E6]">
              <svg className="animate-spin h-6 w-6 text-[#3C7429]" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Loading notifications feed...</span>
            </div>
          ) : notifError ? (
            <div className="p-8 text-center text-xs text-[#C54A40] bg-[#FAFCFE] rounded-2xl border border-[#E2E5E6]">
              <p>{notifError}</p>
              <button
                type="button"
                onClick={fetchAllData}
                className="mt-3 px-4 py-1.5 rounded-lg bg-[#3C7429] text-[#FAFCFE] font-semibold text-xs"
              >
                Try again
              </button>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="p-12 text-center text-xs text-[#7B7E7B] bg-[#FAFCFE] rounded-2xl border border-[#E2E5E6]">
              <p className="font-bold text-sm text-[#1C211B]">No notifications</p>
              <p className="mt-1 text-xs text-[#5E625E]">
                {searchNotification
                  ? 'No notifications match your search.'
                  : "You're all caught up with recent activity."}
              </p>
            </div>
          ) : (
            filteredNotifications.map((item) => {
              const { icon, bg } = getNotificationIcon(item.type);
              return (
                <ActivityItem
                  key={item.id}
                  title={item.title}
                  subtitle={item.message}
                  timestamp={item.timestamp}
                  actionLabel={item.actionLabel}
                  recordType={item.recordType}
                  onAction={
                    item.actionLabel
                      ? () => {
                          if (
                            item.actionLabel === 'Assign' ||
                            item.actionLabel === 'Assign Report' ||
                            item.type === 'assignment_deployed'
                          ) {
                            onAssignReportClick && onAssignReportClick();
                          } else if (item.recordType) {
                            onReviewItemClick && onReviewItemClick(item.recordType, item.id);
                          }
                        }
                      : undefined
                  }
                  icon={icon}
                  iconBg={bg}
                  variant="feed"
                  highlighted={item.highlighted}
                />
              );
            })
          )}
        </div>
      </div>

      {/* Right Column: Users Online (4 cols) */}
      <div className="lg:col-span-4 bg-[#FAFCFE] rounded-2xl border border-[#E2E5E6] p-5 shadow-xs">
        <h3 className="text-base font-bold text-[#1C211B] mb-3">Users</h3>

        {/* User search */}
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7B7E7B]">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={searchUser}
            onChange={(e) => setSearchUser(e.target.value)}
            placeholder="Search here"
            className="w-full pl-10 pr-4 py-2 bg-[#FAFCFE] border border-[#CBCDCE] rounded-xl text-xs text-[#1C211B] placeholder-[#979A98] focus:outline-none focus:border-[#3C7429] focus:ring-1 focus:ring-[#3C7429] transition-colors"
          />
        </div>

        {/* Users list */}
        <div className="flex flex-col gap-2 max-h-[600px] overflow-y-auto pr-1">
          {isLoadingUsers ? (
            <div className="p-8 text-center text-xs text-[#7B7E7B]">Loading users...</div>
          ) : userError ? (
            <div className="p-4 text-center text-xs text-[#C54A40]">
              <p>{userError}</p>
              <button
                type="button"
                onClick={fetchAllData}
                className="mt-2 text-xs text-[#3C7429] font-semibold underline"
              >
                Try again
              </button>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-6 text-center text-xs text-[#7B7E7B]">No users found.</div>
          ) : (
            filteredUsers.map((user, idx) => (
              <div
                key={`${user.id}-${idx}`}
                className="flex items-center justify-between p-2.5 rounded-xl border border-[#EEF0F2] bg-[#FAFCFE] hover:bg-[#EEF0F2]/50 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-[#EEF0F2] flex items-center justify-center text-[#5E625E]">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <span className="text-xs font-semibold text-[#1C211B]">{user.name}</span>
                </div>

                <StatusBadge
                  status={user.status}
                  variant="pill"
                  className={
                    user.status === 'Online'
                      ? 'border border-[#94B389] text-[#2E5421] bg-[#F5F8F4]'
                      : 'border border-[#CBCDCE] text-[#7B7E7B] bg-[#EEF0F2]'
                  }
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
