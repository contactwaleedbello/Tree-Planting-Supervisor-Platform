import React from 'react';
import tokens from '../../utils/tokens';

export interface AlertToastProps {
  variant?: 'success' | 'error' | 'info';
  title: string;
  message?: string;
  onClose?: () => void;
  className?: string;
}

/**
 * AlertToast: Toast notification matching Alerts.png / Alerts-2.png.
 */
export const AlertToast: React.FC<AlertToastProps> = ({
  variant = 'success',
  title,
  message,
  onClose,
  className = '',
}) => {
  const isError = variant === 'error';
  const isSuccess = variant === 'success';

  return (
    <div
      role="alert"
      className={`flex items-start justify-between gap-3 p-3.5 rounded-xl border transition-all shadow-sm ${
        isError
          ? 'bg-[#FEEEED] border-[#C54A40] text-[#1C211B]'
          : isSuccess
          ? 'bg-[#EAF7EE] border-[#448B2D] text-[#1C211B]'
          : 'bg-[#EDF2FD] border-[#406AC1] text-[#1C211B]'
      } ${className}`}
    >
      <div className="flex items-start gap-2.5">
        <div
          className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
            isError ? 'text-[#C54A40]' : isSuccess ? 'text-[#3C7429]' : 'text-[#406AC1]'
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="9" strokeWidth="2" />
            <path strokeLinecap="round" strokeWidth="2" d="M12 8v4m0 4h.01" />
          </svg>
        </div>

        <div>
          <h5 className="text-sm font-bold leading-snug">{title}</h5>
          {message && <p className="text-xs text-[#5E625E] mt-0.5">{message}</p>}
        </div>
      </div>

      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-[#5E625E] hover:text-[#1C211B] hover:bg-black/5 transition-colors shrink-0"
          aria-label="Dismiss alert"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );
};
