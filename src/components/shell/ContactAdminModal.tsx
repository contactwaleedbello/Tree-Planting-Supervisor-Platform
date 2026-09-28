import React, { useState } from 'react';
import { ModalShell } from '../ModalShell';
import { submitContactAdminPlaceholder } from '../../services/shellPlaceholder';
import { AlertToast } from './AlertToast';

interface ContactAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBack?: () => void;
}

/**
 * ContactAdminModal: "Contact Admin" modal paired with Login screen.
 * Matches design/ui-reference/shell/Contact Admin.png.
 */
export const ContactAdminModal: React.FC<ContactAdminModalProps> = ({
  isOpen,
  onClose,
  onBack,
}) => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [complaint, setComplaint] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !complaint.trim()) {
      setErrorMessage('Please fill in your email address and describe your request.');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      const res = await submitContactAdminPlaceholder({
        email,
        phone,
        complaint,
      });
      setSuccessMessage(res.message);
      setTimeout(() => {
        setIsSubmitting(false);
        onClose();
      }, 1500);
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMessage(err.message || 'Failed to submit request. Try again.');
    }
  };

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      onBack={onBack}
      maxWidth="md"
      className="p-2 sm:p-4"
    >
      <div className="flex flex-col items-center text-center px-4 pt-2 pb-6">
        <h3 className="text-xl font-bold text-[#1C211B] tracking-tight">
          Finding It Difficult to access your Profile?
        </h3>
        <p className="text-xs text-[#5E625E] mt-2 max-w-xs">
          Submit your request, and we'll respond In no time.
        </p>

        {errorMessage && (
          <div className="w-full mt-4 text-left">
            <AlertToast
              variant="error"
              title="Submission error"
              message={errorMessage}
              onClose={() => setErrorMessage(null)}
            />
          </div>
        )}

        {successMessage && (
          <div className="w-full mt-4 text-left">
            <AlertToast
              variant="success"
              title="Request Received"
              message={successMessage}
              onClose={() => setSuccessMessage(null)}
            />
          </div>
        )}

        <form onSubmit={handleSubmit} className="w-full mt-6 space-y-4 text-left">
          {/* Email input with envelope */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7B7E7B]">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="abcd@gmail.com"
              required
              className="w-full pl-10 pr-4 py-3 bg-[#FAFCFE] border border-[#CBCDCE] rounded-xl text-xs text-[#1C211B] placeholder-[#979A98] focus:outline-none focus:border-[#3C7429] focus:ring-1 focus:ring-[#3C7429] transition-colors"
            />
          </div>

          {/* Phone input with country flag selector */}
          <div className="flex border border-[#CBCDCE] rounded-xl overflow-hidden bg-[#FAFCFE] focus-within:border-[#3C7429] focus-within:ring-1 focus-within:ring-[#3C7429] transition-colors">
            <div className="flex items-center gap-1.5 px-3 bg-[#EEF0F2] border-r border-[#CBCDCE] text-xs text-[#424641] shrink-0">
              <span className="text-base">🇳🇬</span>
              <svg className="w-3.5 h-3.5 text-[#5E625E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0"
              className="w-full px-4 py-3 bg-transparent text-xs text-[#1C211B] placeholder-[#979A98] focus:outline-none"
            />
          </div>

          {/* Complaint Textarea */}
          <div>
            <textarea
              rows={4}
              value={complaint}
              onChange={(e) => setComplaint(e.target.value)}
              placeholder="Complaint"
              required
              className="w-full px-4 py-3 bg-[#FAFCFE] border border-[#CBCDCE] rounded-xl text-xs text-[#1C211B] placeholder-[#979A98] focus:outline-none focus:border-[#3C7429] focus:ring-1 focus:ring-[#3C7429] transition-colors resize-none"
            />
          </div>

          {/* Submit button with arrow */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#2E5421] hover:bg-[#213819] active:bg-[#131811] text-[#FAFCFE] text-sm font-semibold transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none"
          >
            {isSubmitting ? (
              <span>Submitting...</span>
            ) : (
              <>
                <span>Submit</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </>
            )}
          </button>
        </form>
      </div>
    </ModalShell>
  );
};
