import React, { useState } from 'react';
import { RecordState, IncidentState } from '../types/states';

export interface ReviewDecisionFooterProps {
  onApprove: () => void | Promise<void>;
  onReject: (reason: string) => void | Promise<void>;
  onEscalate?: () => void | Promise<void>;

  approveLabel?: string;
  rejectLabel?: string;
  escalateLabel?: string;

  isSubmitting?: boolean;
  className?: string;
}

/**
 * ReviewDecisionFooter: Gated decision footer for FR-10 (Review Queue) and FR-11 (Incident Review).
 * Enforces form-validation-rules.md rule 4:
 * "Rejecting a record (FR-10) has its reject action disabled until a reason is entered."
 * Displays the exact PRD blocking message: "Add a reason so the officer can fix it."
 *
 * CONSTRUCTED FROM DESIGN SYSTEM:
 * The Escalate action included in this footer was constructed from the design system,
 * not built from a reference image, as no reference image exists for the act of escalating an incident.
 */
export const ReviewDecisionFooter: React.FC<ReviewDecisionFooterProps> = ({
  onApprove,
  onReject,
  onEscalate,
  approveLabel = 'Approve Report',
  rejectLabel = 'Reject Report',
  escalateLabel = 'Escalate Report',
  isSubmitting = false,
  className = '',
}) => {
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);

  const isRejectDisabled = !rejectReason.trim();
  const rejectDisabledReason = 'Add a reason so the officer can fix it.';

  const handleRejectClick = () => {
    if (!showRejectInput) {
      setShowRejectInput(true);
      return;
    }
    if (!isRejectDisabled) {
      onReject(rejectReason.trim());
    }
  };

  return (
    <div className={`flex flex-col gap-3 pt-4 border-t border-[#E2E5E6] mt-6 ${className}`}>
      {/* Inline Reject Reason Drawer/Input when rejecting */}
      {showRejectInput && (
        <div className="bg-[#FEEEED] border border-[#FAC4C0] rounded-xl p-4 flex flex-col gap-2">
          <label
            htmlFor="reject-reason-input"
            className="text-xs font-semibold text-[#A34137]"
          >
            Rejection Reason (Required)
          </label>
          <textarea
            id="reject-reason-input"
            rows={2}
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Specify why this record is rejected so the officer can fix it..."
            className="w-full p-2.5 bg-[#FAFCFE] border border-[#FAC4C0] rounded-lg text-xs text-[#1C211B] placeholder-[#979A98] focus:outline-none focus:ring-1 focus:ring-[#C54A40]"
          />
          {isRejectDisabled && (
            <span className="text-xs text-[#C54A40] font-medium">
              {rejectDisabledReason}
            </span>
          )}
        </div>
      )}

      {/* Buttons Row */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Secondary Actions: Reject & Optional Escalate */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <button
              type="button"
              disabled={isSubmitting || (showRejectInput && isRejectDisabled)}
              onClick={handleRejectClick}
              className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors focus:outline-none ${
                showRejectInput && isRejectDisabled
                  ? 'opacity-40 cursor-not-allowed text-[#7B7E7B] bg-[#EEF0F2]'
                  : 'text-[#C54A40] hover:text-[#A34137] hover:bg-[#FEEEED]'
              }`}
            >
              {rejectLabel}
            </button>
            {!showRejectInput && (
              <span className="hidden sm:inline text-xs text-[#7B7E7B]">
                (Requires reason)
              </span>
            )}
          </div>

          {/*
           * CONSTRUCTED FROM DESIGN SYSTEM
           * No reference image exists for the act of escalating an incident.
           *
           * OPEN QUESTION (form-validation-rules.md):
           * Whether escalating an incident requires a reason field is deliberately unresolved,
           * not settled by constructing this visual control. The Escalate control's enabled state
           * is kept always enabled (disabled only when isSubmitting is true). This is not an oversight.
           */}
          {onEscalate && (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={onEscalate}
              className="px-5 py-2.5 rounded-lg text-sm font-semibold text-[#8C532B] hover:text-[#6D3F1E] hover:bg-[#FDF8F3] border border-[#EACBB0] transition-colors focus:outline-none"
            >
              {escalateLabel}
            </button>
          )}

          {showRejectInput && (
            <button
              type="button"
              onClick={() => {
                setShowRejectInput(false);
                setRejectReason('');
              }}
              className="text-xs text-[#5E625E] hover:underline"
            >
              Cancel rejection
            </button>
          )}
        </div>

        {/* Primary Approve Action */}
        <div>
          <button
            type="button"
            disabled={isSubmitting || showRejectInput}
            onClick={onApprove}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold text-[#FAFCFE] shadow-sm transition-all focus:outline-none ${
              isSubmitting || showRejectInput
                ? 'bg-[#BBCEB4] cursor-not-allowed opacity-60'
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
                <span>Processing...</span>
              </>
            ) : (
              <>
                <span>{approveLabel}</span>
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
    </div>
  );
};
