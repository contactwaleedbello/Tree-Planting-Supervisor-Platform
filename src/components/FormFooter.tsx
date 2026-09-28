import React from 'react';

export interface FormFooterProps {
  submitLabel: string;
  onSubmit: (e?: React.FormEvent | React.MouseEvent) => void | Promise<void>;
  isSubmitDisabled?: boolean;
  submitDisabledReason?: string;
  isSubmitting?: boolean;

  cancelLabel?: string;
  onCancel?: () => void;
  isCancelDisabled?: boolean;

  submitVariant?: 'primary' | 'danger';
  className?: string;
}

/**
 * FormFooter: Plain cancel/submit and confirmation action footer.
 * Used for standard forms (Add Campaign, Add Officer, Add Specie Type)
 * and confirmation dialogs (e.g. Logout No/Yes).
 */
export const FormFooter: React.FC<FormFooterProps> = ({
  submitLabel,
  onSubmit,
  isSubmitDisabled = false,
  submitDisabledReason,
  isSubmitting = false,

  cancelLabel,
  onCancel,
  isCancelDisabled = false,

  submitVariant = 'primary',
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#EEF0F2] ${className}`}
    >
      {/* Cancel / Secondary Action */}
      <div>
        {cancelLabel && onCancel && (
          <button
            type="button"
            disabled={isCancelDisabled || isSubmitting}
            onClick={onCancel}
            className="px-6 py-2.5 rounded-lg text-sm font-semibold text-[#5E625E] hover:text-[#1C211B] hover:bg-[#EEF0F2] transition-colors focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {cancelLabel}
          </button>
        )}
      </div>

      {/* Submit / Confirm Action */}
      <div className="flex flex-col sm:flex-row items-center gap-2">
        {isSubmitDisabled && submitDisabledReason && (
          <span className="text-xs text-[#C54A40] font-medium inline-block">
            {submitDisabledReason}
          </span>
        )}
        <button
          type="button"
          disabled={isSubmitDisabled || isSubmitting}
          onClick={onSubmit}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold text-[#FAFCFE] shadow-sm transition-all focus:outline-none ${
            isSubmitDisabled || isSubmitting
              ? 'bg-[#BBCEB4] cursor-not-allowed opacity-60'
              : submitVariant === 'danger'
              ? 'bg-[#C54A40] hover:bg-[#A34137] active:bg-[#612E26]'
              : 'bg-[#3C7429] hover:bg-[#2E5421] active:bg-[#213819]'
          }`}
        >
          {isSubmitting ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span>Submitting...</span>
            </>
          ) : (
            <>
              <span>{submitLabel}</span>
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
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
