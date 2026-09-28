import React, { useEffect } from 'react';

interface ModalShellProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  onBack?: () => void;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export const ModalShell: React.FC<ModalShellProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  onBack,
  maxWidth = 'lg',
  children,
  footer,
  className = '',
}) => {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const maxWidthClass = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  }[maxWidth];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#1C211B]/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div
        className={`relative w-full ${maxWidthClass} bg-[#FAFCFE] rounded-2xl border border-[#E2E5E6] shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh] ${className}`}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        {(title || onClose || onBack) && (
          <div className="flex items-center justify-between p-6 pb-4 border-b border-[#EEF0F2]">
            <div className="flex items-center gap-3">
              {onBack && (
                <button
                  type="button"
                  onClick={onBack}
                  className="w-8 h-8 rounded-lg bg-[#EEF0F2] hover:bg-[#E2E5E6] flex items-center justify-center text-[#424641] transition-colors focus:outline-none"
                  aria-label="Go back"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                </button>
              )}
              <div>
                {title && (
                  <h2 className="text-lg font-bold text-[#1C211B] tracking-tight">
                    {title}
                  </h2>
                )}
                {subtitle && (
                  <p className="text-xs text-[#5E625E] mt-1">{subtitle}</p>
                )}
              </div>
            </div>

            {/* Close Button with subtle red tint per reference images */}
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-[#FEEEED] hover:bg-[#FCDDDB] text-[#C54A40] flex items-center justify-center transition-colors focus:outline-none shrink-0"
                aria-label="Close"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
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
        )}

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto flex-1">{children}</div>

        {/* Optional Footer */}
        {footer && (
          <div className="p-6 pt-3 border-t border-[#EEF0F2] bg-[#FAFCFE]">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
