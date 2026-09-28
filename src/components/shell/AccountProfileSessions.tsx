import React, { useEffect, useState } from 'react';
import {
  getSessionLogPlaceholder,
  LoginSessionLog,
} from '../../services/shellPlaceholder';

interface AccountProfileSessionsProps {
  onChangePasswordClick?: () => void;
}

/**
 * AccountProfileSessions: Profile (Sessions) tab.
 * Matches design/ui-reference/shell/Profile  (Sessions).png.
 */
export const AccountProfileSessions: React.FC<AccountProfileSessionsProps> = ({
  onChangePasswordClick,
}) => {
  const [sessionLog, setSessionLog] = useState<LoginSessionLog | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSession = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getSessionLogPlaceholder();
      setSessionLog(data);
      setIsLoading(false);
    } catch {
      setIsLoading(false);
      setError('Failed to load session logs. Try again.');
    }
  };

  useEffect(() => {
    fetchSession();
  }, []);

  if (isLoading) {
    return (
      <div className="p-12 text-center text-xs text-[#7B7E7B] flex flex-col items-center gap-2 bg-[#FAFCFE] rounded-2xl border border-[#E2E5E6]">
        <svg className="animate-spin h-6 w-6 text-[#3C7429]" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <span>Loading session logs...</span>
      </div>
    );
  }

  if (error || !sessionLog) {
    return (
      <div className="p-8 text-center text-xs text-[#C54A40] bg-[#FAFCFE] rounded-2xl border border-[#E2E5E6]">
        <p>{error || 'No active session log found.'}</p>
        <button
          type="button"
          onClick={fetchSession}
          className="mt-3 px-4 py-1.5 rounded-lg bg-[#3C7429] text-[#FAFCFE] font-semibold text-xs"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#FAFCFE] border border-[#E2E5E6] rounded-2xl p-6 shadow-xs">
      <h3 className="text-sm font-bold text-[#1C211B] mb-5">Logs</h3>

      {/* Session Box */}
      <div className="border border-[#EEF0F2] rounded-2xl p-6 flex flex-col gap-5">
        <div>
          <span className="text-xs font-semibold text-[#406AC1] block mb-1">
            Login Session
          </span>
          <h4 className="text-sm font-bold text-[#1C211B]">
            We noticed you logged in to your {sessionLog.portalName} on: {sessionLog.timestamp}.
          </h4>
          <p className="text-xs text-[#7B7E7B] italic mt-2 leading-relaxed">
            If you did not initiate this log in, please change your password and call our support centre immediately on {sessionLog.supportPhone} or send an email to{' '}
            <a
              href={`mailto:${sessionLog.supportEmail}`}
              className="text-[#936B40] underline hover:text-[#745029]"
            >
              {sessionLog.supportEmail}
            </a>
            .
          </p>
        </div>

        {/* Change Password Button */}
        <div>
          <button
            type="button"
            onClick={onChangePasswordClick}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#D89859] text-xs font-semibold text-[#936B40] hover:bg-[#F7EADE] transition-colors focus:outline-none"
          >
            <span>Change Password</span>
            <svg className="w-4 h-4 text-[#936B40]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" strokeWidth={1.5} />
              <path d="M7 11V7a5 5 0 0110 0v4" strokeWidth={1.5} />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
