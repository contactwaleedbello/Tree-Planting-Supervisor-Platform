import React, { useState } from 'react';
import { ModalShell } from '../ModalShell';
import { logoutPlaceholder } from '../../services/shellPlaceholder';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmLogout: () => void;
}

/**
 * LogoutModal: Confirmation dialog matching design/ui-reference/shell/Frame 2147225635.png.
 * Reuses shared ModalShell per react-architecture-rules.md and Phase 0 reuse gate.
 */
export const LogoutModal: React.FC<LogoutModalProps> = ({
  isOpen,
  onClose,
  onConfirmLogout,
}) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleConfirm = async () => {
    try {
      setIsLoggingOut(true);
      await logoutPlaceholder();
      setIsLoggingOut(false);
      onConfirmLogout();
    } catch {
      setIsLoggingOut(false);
      onConfirmLogout();
    }
  };

  return (
    <ModalShell isOpen={isOpen} onClose={onClose} maxWidth="sm">
      <div className="flex flex-col items-center text-center p-6 sm:p-8">
        <h3 className="text-base font-bold text-[#1C211B] tracking-tight">
          Are you sure you want to Logout?
        </h3>

        <div className="flex items-center justify-between w-full mt-8 gap-4">
          {/* No button */}
          <button
            type="button"
            disabled={isLoggingOut}
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-[#1C211B] hover:bg-[#EEF0F2] transition-colors focus:outline-none"
          >
            No
          </button>

          {/* Yes button with subtle red fill per reference image */}
          <button
            type="button"
            disabled={isLoggingOut}
            onClick={handleConfirm}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-[#FEEEED] text-[#C54A40] hover:bg-[#FCDDDB] active:bg-[#F8C1BD] transition-colors focus:outline-none disabled:opacity-50"
          >
            {isLoggingOut ? 'Logging out...' : 'Yes'}
          </button>
        </div>
      </div>
    </ModalShell>
  );
};
