import React from 'react';

interface PermissionDeniedScreenProps {
  onBackToSafety?: () => void;
}

/**
 * PermissionDeniedScreen: Plain placeholder screen awaiting real design and approved copy.
 * The copy shown is placeholder text written by the agent reflecting the architectural
 * intent of auth-access-rules.md (distinct from network failure, no false retry button).
 * Neither the layout nor the copy is sourced from a confirmed design or rule file.
 */
export const PermissionDeniedScreen: React.FC<PermissionDeniedScreenProps> = ({
  onBackToSafety,
}) => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md bg-[#FAFCFE] border border-[#E2E5E6] rounded-2xl p-8 shadow-xs flex flex-col items-center">
        {/* Placeholder Icon */}
        <div className="w-12 h-12 rounded-full bg-[#FEEEED] text-[#C54A40] flex items-center justify-center mb-4">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m0 0v.01M12 9v4m-7 8h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>

        <h3 className="text-base font-bold text-[#1C211B]">
          Permission Denied
        </h3>

        <p className="text-xs text-[#5E625E] mt-2 leading-relaxed">
          You do not have authorization to view or manage this resource. A Supervisor sees and manages only the blocks assigned to them.
        </p>

        {onBackToSafety && (
          <button
            type="button"
            onClick={onBackToSafety}
            className="mt-6 px-5 py-2 rounded-xl bg-[#2E5421] hover:bg-[#213819] text-[#FAFCFE] text-xs font-semibold transition-colors focus:outline-none"
          >
            Return to Dashboard
          </button>
        )}

        <span className="mt-4 text-[10px] text-[#7B7E7B] italic">
          [Placeholder visual and copy awaiting confirmed design and approved copy]
        </span>
      </div>
    </div>
  );
};
