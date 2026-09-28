import React from 'react';

interface NetworkErrorScreenProps {
  onRetry: () => void;
  message?: string;
  isRetrying?: boolean;
}

/**
 * NetworkErrorScreen: Plain placeholder screen awaiting real design and approved copy.
 * The copy shown is placeholder text written by the agent reflecting the architectural
 * intent of api-network-rules.md (actionable retry for transient failure).
 * Neither the layout nor the copy is sourced from a confirmed design or rule file.
 */
export const NetworkErrorScreen: React.FC<NetworkErrorScreenProps> = ({
  onRetry,
  message = 'Failed to load data. Try again.',
  isRetrying = false,
}) => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md bg-[#FAFCFE] border border-[#E2E5E6] rounded-2xl p-8 shadow-xs flex flex-col items-center">
        {/* Placeholder Icon */}
        <div className="w-12 h-12 rounded-full bg-[#FDF0ED] text-[#D05D54] flex items-center justify-center mb-4">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824-2.18a4.992 4.992 0 013.535 1.464M3 3l18 18"
            />
          </svg>
        </div>

        <h3 className="text-base font-bold text-[#1C211B]">
          Network Connection Error
        </h3>

        <p className="text-xs text-[#5E625E] mt-2 leading-relaxed">
          {message}
        </p>

        <button
          type="button"
          disabled={isRetrying}
          onClick={onRetry}
          className="mt-6 flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#2E5421] hover:bg-[#213819] active:bg-[#131811] text-[#FAFCFE] text-xs font-semibold transition-all shadow-sm disabled:opacity-50 focus:outline-none"
        >
          {isRetrying ? (
            <span>Retrying...</span>
          ) : (
            <>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Try again</span>
            </>
          )}
        </button>

        <span className="mt-4 text-[10px] text-[#7B7E7B] italic">
          [Placeholder visual and copy awaiting confirmed design and approved copy]
        </span>
      </div>
    </div>
  );
};
