import React from 'react';

interface EmptyStateProps {
  title: string;
  message?: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  actionIcon?: React.ReactNode;
  onAction?: () => void;
  actionVariant?: 'primary' | 'secondary';
  customAction?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  message,
  icon,
  actionLabel,
  actionIcon,
  onAction,
  actionVariant = 'secondary',
  customAction,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-[#FAFCFE] rounded-2xl border border-[#E2E5E6] ${className}`}
    >
      {/* Icon / Illustration wrapper */}
      <div className="w-16 h-16 rounded-2xl bg-[#EEF0F2] flex items-center justify-center text-[#7B7E7B] mb-4">
        {icon || (
          <svg
            className="w-8 h-8 text-[#979A98]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
        )}
      </div>

      <h3 className="text-base font-bold text-[#1C211B]">{title}</h3>
      {message && (
        <p className="text-xs text-[#5E625E] max-w-sm mt-1.5 leading-relaxed">
          {message}
        </p>
      )}

      {customAction ? (
        <div className="mt-5">{customAction}</div>
      ) : actionLabel && onAction ? (
        <button
          type="button"
          onClick={onAction}
          className={`mt-5 inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold transition-all focus:outline-none cursor-pointer ${
            actionVariant === 'primary'
              ? 'bg-[#3C7429] hover:bg-[#2E5421] text-[#FAFCFE] shadow-sm'
              : 'border border-[#C97A3E] text-[#8C532B] hover:bg-[#FDF8F3]'
          }`}
        >
          {actionIcon}
          <span>{actionLabel}</span>
        </button>
      ) : null}
    </div>
  );
};

