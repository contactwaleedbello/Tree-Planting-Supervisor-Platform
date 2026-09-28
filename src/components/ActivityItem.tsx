import React from 'react';
import { StatusBadge } from './StatusBadge';
import { ReviewRecordType } from '../types/states';

export interface ActivityItemProps {
  title: string;
  subtitle?: string;
  categoryTag?: string;
  statusBadge?: string;
  recordType?: ReviewRecordType;
  officerName?: string;
  phoneNumber?: string;
  timestamp?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
  iconBg?: string;
  variant?: 'card' | 'feed';
  highlighted?: boolean;
  className?: string;
}

export const ActivityItem: React.FC<ActivityItemProps> = ({
  title,
  subtitle,
  categoryTag,
  statusBadge,
  recordType,
  officerName,
  phoneNumber,
  timestamp,
  actionLabel = 'Review',
  onAction,
  icon,
  iconBg,
  variant = 'card',
  highlighted = false,
  className = '',
}) => {
  if (variant === 'feed') {
    return (
      <div
        className={`border ${
          highlighted ? 'border-[#D89859] bg-[#FDFAF7]' : 'border-[#E2E5E6] bg-[#FAFCFE]'
        } rounded-xl p-4 shadow-2xs hover:shadow-xs transition-shadow flex items-start justify-between gap-4 ${className}`}
      >
        <div className="flex items-start gap-3.5 flex-1 min-w-0">
          {icon && (
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                iconBg || 'bg-[#EEF0F2] text-[#5E625E]'
              }`}
            >
              {icon}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-[#1C211B] leading-tight">{title}</h4>
            {subtitle && (
              <p className="text-xs text-[#5E625E] mt-1 leading-relaxed">{subtitle}</p>
            )}
            {onAction && (
              <div className="mt-3">
                <button
                  type="button"
                  onClick={onAction}
                  className="px-4 py-1.5 rounded-lg bg-[#2E5421] hover:bg-[#28461D] text-[#FAFCFE] text-xs font-semibold transition-colors focus:outline-none"
                >
                  {actionLabel}
                </button>
              </div>
            )}
          </div>
        </div>
        {timestamp && (
          <span className="text-xs text-[#7B7E7B] shrink-0 font-medium">{timestamp}</span>
        )}
      </div>
    );
  }
  return (
    <div
      className={`border border-[#E2E5E6] rounded-xl bg-[#FAFCFE] p-4 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between gap-3 ${className}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-1.5 text-xs text-[#5E625E]">
          {categoryTag && (
            <>
              <svg
                className="w-3.5 h-3.5 text-[#7B7E7B]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"
                />
              </svg>
              <span>{categoryTag}</span>
            </>
          )}
        </div>
        {statusBadge && (
          <StatusBadge status={statusBadge} variant="pill" />
        )}
      </div>

      <div>
        <h4 className="text-sm font-bold text-[#1C211B]">{title}</h4>
        {subtitle && (
          <p className="text-xs text-[#5E625E] mt-1 leading-relaxed">{subtitle}</p>
        )}
      </div>

      {(officerName || phoneNumber || timestamp) && (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#7B7E7B]">
          {officerName && (
            <div className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="text-[#424641]">{officerName}</span>
            </div>
          )}
          {phoneNumber && (
            <div className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>{phoneNumber}</span>
            </div>
          )}
          {timestamp && (
            <div className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{timestamp}</span>
            </div>
          )}
        </div>
      )}

      {onAction && (
        <div className="flex justify-end pt-2 border-t border-[#EEF0F2]">
          <button
            type="button"
            onClick={onAction}
            className="px-4 py-1.5 rounded-lg bg-[#2E5421] hover:bg-[#28461D] text-[#FAFCFE] text-xs font-semibold transition-colors focus:outline-none"
          >
            {actionLabel}
          </button>
        </div>
      )}
    </div>
  );
};
