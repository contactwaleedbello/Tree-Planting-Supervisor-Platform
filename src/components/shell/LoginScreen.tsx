import React, { useState } from 'react';
import { AlertToast } from './AlertToast';
import { ContactAdminModal } from './ContactAdminModal';

interface LoginScreenProps {
  onLoginSuccess: (email: string) => void;
}

/**
 * LoginScreen: Authentication entry point.
 * Matches design/ui-reference/shell/Login.png.
 */
export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState(false);
  const [isContactAdminOpen, setIsContactAdminOpen] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please enter both your email address and password.');
      return;
    }

    setIsLoading(true);

    // Simulate authentication check
    setTimeout(() => {
      // For demonstration, simple validation
      if (email.includes('@') && password.length >= 6) {
        setSuccessToast(true);
        setTimeout(() => {
          setIsLoading(false);
          onLoginSuccess(email);
        }, 1200);
      } else {
        setIsLoading(false);
        setErrorMessage('Double-check your details and try again');
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#F5F8F4] flex flex-col items-center justify-center p-4 sm:p-6 relative">
      {/* Toast Alert fixed at top */}
      <div className="fixed top-6 z-50 max-w-md w-full px-4">
        {errorMessage && (
          <AlertToast
            variant="error"
            title="Incorrect email or password"
            message={errorMessage}
            onClose={() => setErrorMessage(null)}
          />
        )}
        {successToast && (
          <AlertToast
            variant="success"
            title="Signed in successfully"
            message="Loading your verification queue and active campaigns..."
          />
        )}
      </div>

      {/* Centered Login Card */}
      <div className="w-full max-w-md bg-[#FAFCFE] rounded-2xl border border-[#E2E5E6] shadow-xl p-8 sm:p-10 flex flex-col items-center text-center">
        {/* Logo and Brand */}
        <div className="flex items-center gap-2 mb-4">
          <svg className="w-9 h-9 text-[#2E5421]" viewBox="0 0 40 40" fill="currentColor">
            <path d="M20 2C10.059 2 2 10.059 2 20c0 7.95 5.21 14.68 12.39 16.94.88.16 1.21-.38 1.21-.85 0-.42-.02-1.81-.02-3.28-4.9.91-6.04-1.19-6.43-2.3-.22-.57-1.17-2.3-2-2.76-.69-.37-1.67-1.28-.03-1.3 1.55-.02 2.66 1.43 3.03 2.03 1.77 3.01 4.65 2.16 5.79 1.64.18-1.28.69-2.16 1.26-2.66-4.08-.46-8.36-2.04-8.36-9.08 0-2 .72-3.65 1.89-4.93-.19-.46-.82-2.34.18-4.88 0 0 1.54-.49 5.05 1.88 1.47-.41 3.04-.62 4.6-.62 1.56 0 3.13.21 4.6.62 3.51-2.38 5.04-1.88 5.04-1.88 1.01 2.54.38 4.42.19 4.88 1.18 1.28 1.89 2.92 1.89 4.93 0 7.06-4.3 8.61-8.39 9.06.71.61 1.34 1.81 1.34 3.66 0 2.64-.02 4.77-.02 5.43 0 .48.32 1.03 1.22.85C32.79 34.68 38 27.94 38 20c0-9.941-8.059-18-18-18z" />
          </svg>
          <div className="flex flex-col text-left leading-none">
            <span className="text-xl font-bold tracking-tight text-[#936B40]">Green</span>
            <span className="text-xl font-bold tracking-tight text-[#936B40]">Legacy</span>
          </div>
        </div>

        {/* Subtitle description */}
        <p className="text-xs text-[#5E625E] leading-relaxed max-w-xs mt-1">
          Review campaign progress, manage field officers, and process pending verifications.
        </p>

        {/* Heading */}
        <h2 className="text-lg font-bold text-[#1C211B] mt-5 mb-6">
          Sign in to your workspace
        </h2>

        {/* Form */}
        <form onSubmit={handleLogin} className="w-full space-y-4 text-left">
          {/* Email input */}
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

          {/* Password input with reveal toggle */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7B7E7B]">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" strokeWidth={1.5} />
                <path d="M7 11V7a5 5 0 0110 0v4" strokeWidth={1.5} />
              </svg>
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="************"
              required
              className="w-full pl-10 pr-11 py-3 bg-[#FAFCFE] border border-[#CBCDCE] rounded-xl text-xs text-[#1C211B] placeholder-[#979A98] focus:outline-none focus:border-[#3C7429] focus:ring-1 focus:ring-[#3C7429] transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#7B7E7B] hover:text-[#1C211B] transition-colors focus:outline-none"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {showPassword ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"
                  />
                ) : (
                  <>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </>
                )}
              </svg>
            </button>
          </div>

          {/* Submit button: Log in -> */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#2E5421] hover:bg-[#213819] active:bg-[#131811] text-[#FAFCFE] text-sm font-semibold transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none"
          >
            {isLoading ? (
              <span>Logging in...</span>
            ) : (
              <>
                <span>Log in</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </>
            )}
          </button>
        </form>

        {/* Footer: Need help signing in? / Contact your administrator */}
        <div className="mt-8 text-xs text-[#5E625E] flex flex-col items-center gap-2">
          <span>Need help signing in?</span>
          <button
            type="button"
            onClick={() => setIsContactAdminOpen(true)}
            className="inline-flex items-center gap-1.5 text-[#936B40] hover:text-[#745029] font-medium transition-colors focus:outline-none"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>Contact your administrator</span>
          </button>
        </div>
      </div>

      {/* Contact Admin Modal */}
      <ContactAdminModal
        isOpen={isContactAdminOpen}
        onClose={() => setIsContactAdminOpen(false)}
      />
    </div>
  );
};
