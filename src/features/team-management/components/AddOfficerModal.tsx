/**
 * AddOfficerModal.tsx
 *
 * Implements the "Grow your field roster" modal for adding a Field Officer.
 * References:
 * - design/ui-reference/team-management/Frame 1707479575.png
 * - design/ui-reference/team-management/Alerts.png
 *
 * Enforces gated-action-control & form-validation-rules.md:
 * - Rule 1: Submit never fires while a required condition is unmet.
 * - Rule 2: Shows inline validation error next to the field.
 * - Rule 7: Disabled submit button shows why it is disabled.
 * - Handles duplicate-email validation inline.
 */

import React, { useState, useEffect } from 'react';
import { ModalShell } from '../../../components/ModalShell';
import { FormFooter } from '../../../components/FormFooter';
import { AddOfficerInput, FieldOfficerItem } from '../types/team';
import { addFieldOfficer, isDuplicateOfficerEmail } from '../services/teamPlaceholder';

interface AddOfficerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newOfficer: FieldOfficerItem) => void;
}

const JURISDICTIONS = [
  'Mariri Ward',
  'Gaya Ward',
  'Dutse Central',
  'Hadejia South',
  'Kazaure North',
];

const ROLES = [
  'Field Officer',
  'Lead Enumerator',
  'Field Supervisor',
];

export const AddOfficerModal: React.FC<AddOfficerModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [jurisdiction, setJurisdiction] = useState('');
  const [role, setRole] = useState('Field Officer');
  const [password, setPassword] = useState('');
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setFullName('');
      setEmail('');
      setPhoneNumber('');
      setJurisdiction('');
      setRole('Field Officer');
      setPassword('');
      setSelectedFileName(null);
      setTouched({});
      setServerError(null);
      setShowSuccessToast(false);
    }
  }, [isOpen]);

  // Validation rules
  const isNameValid = fullName.trim().length > 0;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isEmailFormatValid = emailRegex.test(email.trim());
  const isEmailDuplicate = isEmailFormatValid && isDuplicateOfficerEmail(email);
  const isEmailValid = isEmailFormatValid && !isEmailDuplicate;
  const isPhoneValid = phoneNumber.trim().length >= 7;
  const isJurisdictionValid = jurisdiction.trim().length > 0;
  const isRoleValid = role.trim().length > 0;
  const isPasswordValid = password.length >= 6;

  const isFormValid =
    isNameValid &&
    isEmailValid &&
    isPhoneValid &&
    isJurisdictionValid &&
    isRoleValid &&
    isPasswordValid;

  // Inline errors
  const nameError = touched.fullName && !isNameValid ? 'Full name is required.' : null;
  const emailError = touched.email
    ? !email.trim()
      ? 'Email address is required.'
      : !isEmailFormatValid
      ? 'Enter a valid email address.'
      : isEmailDuplicate
      ? 'An officer with this email address already exists.'
      : null
    : null;
  const phoneError =
    touched.phoneNumber && !isPhoneValid ? 'Enter a valid phone number.' : null;
  const jurisdictionError =
    touched.jurisdiction && !isJurisdictionValid ? 'Select an assigned jurisdiction.' : null;
  const roleError = touched.role && !isRoleValid ? 'Select an assigned role.' : null;
  const passwordError =
    touched.password && !isPasswordValid
      ? 'Password must be at least 6 characters.'
      : null;

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFileName(file.name);
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!isFormValid) {
      setTouched({
        fullName: true,
        email: true,
        phoneNumber: true,
        jurisdiction: true,
        role: true,
        password: true,
      });
      return;
    }

    setIsSubmitting(true);
    setServerError(null);

    try {
      const input: AddOfficerInput = {
        fullName: fullName.trim(),
        email: email.trim(),
        phoneNumber: `+234 ${phoneNumber.trim()}`,
        jurisdiction,
        role,
        password,
        idDocumentName: selectedFileName || undefined,
      };

      const created = await addFieldOfficer(input);
      setShowSuccessToast(true);
      setTimeout(() => {
        onSuccess(created);
        onClose();
      }, 1200);
    } catch (err: any) {
      setServerError(err.message || 'Failed to add officer. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ModalShell isOpen={isOpen} onClose={onClose} maxWidth="lg">
      <div className="flex flex-col gap-5 p-6 relative">
        {/* Success Alert Banner matching Alerts.png */}
        {showSuccessToast && (
          <div className="absolute top-4 left-6 right-6 z-30 p-4 bg-[#D1FADF] border border-[#6CE9A6] rounded-xl flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#12B76A] text-white flex items-center justify-center font-bold text-sm">
                !
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-[#027A48]">Invite Sent!</span>
                <span className="text-[11px] text-[#027A48]">
                  We&apos;ve dispatched an onboarding link to {fullName}.
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowSuccessToast(false)}
              className="text-[#027A48] hover:text-[#054F31]"
            >
              ✕
            </button>
          </div>
        )}

        {/* Modal Header */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-base font-bold text-[#1C211B]">Grow your field roster</h2>
            <p className="text-xs text-[#5E625E] mt-1 leading-relaxed max-w-sm">
              Bring new officers, enumerators, and leads on board. Send invites with preset roles and get them mission-ready.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#FEE2E2] flex items-center justify-center text-[#EF4444] hover:bg-[#FECACA] transition-colors shrink-0"
            aria-label="Close"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Batch Upload Option */}
        <div className="flex items-center justify-between p-3 bg-[#FAFCFE] border border-[#E2E5E6] rounded-xl">
          <span className="text-xs font-medium text-[#1C211B]">Add multiple officers</span>
          <button
            type="button"
            className="inline-flex items-center gap-2 px-3 py-1.5 border border-[#C97A3E] text-[#8C532B] hover:bg-[#FDF8F3] rounded-lg text-xs font-semibold transition-colors"
          >
            <svg className="w-4 h-4 text-[#8C532B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            <span>Upload CSV</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-[#E2E5E6]" />
          <span className="text-xs text-[#7B7E7B] font-medium">Or</span>
          <div className="flex-1 h-px bg-[#E2E5E6]" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Field: Full Name */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="officer-name" className="text-xs font-bold text-[#1C211B]">
              Full name <span className="text-[#C54A40]">*</span>
            </label>
            <input
              id="officer-name"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              onBlur={() => handleBlur('fullName')}
              placeholder="e.g., Amina Yusuf"
              className={`w-full p-2.5 rounded-lg bg-[#FAFCFE] border text-xs text-[#1C211B] placeholder-[#979A98] focus:outline-none focus:ring-1 ${
                nameError
                  ? 'border-[#C54A40] focus:ring-[#C54A40]'
                  : 'border-[#E2E5E6] focus:border-[#2E5421] focus:ring-[#2E5421]'
              }`}
            />
            {nameError && <span className="text-xs text-[#C54A40] font-medium">{nameError}</span>}
          </div>

          {/* Fields: Email & Phone Number */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="officer-email" className="text-xs font-bold text-[#1C211B]">
                Email <span className="text-[#C54A40]">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#7B7E7B]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  id="officer-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => handleBlur('email')}
                  placeholder="abcd@gmail.com"
                  className={`w-full pl-9 pr-3 py-2.5 rounded-lg bg-[#FAFCFE] border text-xs text-[#1C211B] placeholder-[#979A98] focus:outline-none focus:ring-1 ${
                    emailError
                      ? 'border-[#C54A40] focus:ring-[#C54A40]'
                      : 'border-[#E2E5E6] focus:border-[#2E5421] focus:ring-[#2E5421]'
                  }`}
                />
              </div>
              <span className="text-[11px] text-[#7B7E7B]">
                They&apos;ll use this to log in to the field mobile app
              </span>
              {emailError && <span className="text-xs text-[#C54A40] font-medium">{emailError}</span>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="officer-phone" className="text-xs font-bold text-[#1C211B]">
                Phone number <span className="text-[#C54A40]">*</span>
              </label>
              <div className="flex items-center border border-[#E2E5E6] rounded-lg bg-[#FAFCFE] overflow-hidden focus-within:ring-1 focus-within:border-[#2E5421] focus-within:ring-[#2E5421]">
                <div className="flex items-center gap-1.5 px-3 py-2.5 bg-[#F4F6F8] border-r border-[#E2E5E6] text-xs font-medium text-[#1C211B] shrink-0">
                  <span className="text-base leading-none">🇳🇬</span>
                  <svg className="w-3.5 h-3.5 text-[#7B7E7B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                <input
                  id="officer-phone"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  onBlur={() => handleBlur('phoneNumber')}
                  placeholder="0803 123 4567"
                  className="w-full p-2.5 bg-transparent text-xs text-[#1C211B] placeholder-[#979A98] focus:outline-none"
                />
              </div>
              {phoneError && <span className="text-xs text-[#C54A40] font-medium">{phoneError}</span>}
            </div>
          </div>

          {/* Fields: Assigned Jurisdiction & Assign Role */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="officer-jurisdiction" className="text-xs font-bold text-[#1C211B]">
                Assigned jurisdiction <span className="text-[#C54A40]">*</span>
              </label>
              <div className="relative">
                <select
                  id="officer-jurisdiction"
                  value={jurisdiction}
                  onChange={(e) => setJurisdiction(e.target.value)}
                  onBlur={() => handleBlur('jurisdiction')}
                  className={`w-full p-2.5 rounded-lg bg-[#FAFCFE] border text-xs text-[#1C211B] appearance-none focus:outline-none focus:ring-1 ${
                    jurisdictionError
                      ? 'border-[#C54A40] focus:ring-[#C54A40]'
                      : 'border-[#E2E5E6] focus:border-[#2E5421] focus:ring-[#2E5421]'
                  }`}
                >
                  <option value="">Select primary jurisdiction</option>
                  {JURISDICTIONS.map((j) => (
                    <option key={j} value={j}>
                      {j}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-[#7B7E7B]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              {jurisdictionError && (
                <span className="text-xs text-[#C54A40] font-medium">{jurisdictionError}</span>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="officer-role" className="text-xs font-bold text-[#1C211B]">
                Assign role <span className="text-[#C54A40]">*</span>
              </label>
              <div className="relative">
                <select
                  id="officer-role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  onBlur={() => handleBlur('role')}
                  className={`w-full p-2.5 rounded-lg bg-[#FAFCFE] border text-xs text-[#1C211B] appearance-none focus:outline-none focus:ring-1 ${
                    roleError
                      ? 'border-[#C54A40] focus:ring-[#C54A40]'
                      : 'border-[#E2E5E6] focus:border-[#2E5421] focus:ring-[#2E5421]'
                  }`}
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-[#7B7E7B]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              {roleError && <span className="text-xs text-[#C54A40] font-medium">{roleError}</span>}
            </div>
          </div>

          {/* Field: Create Password */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="officer-password" className="text-xs font-bold text-[#1C211B]">
              Create Password <span className="text-[#C54A40]">*</span>
            </label>
            <input
              id="officer-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => handleBlur('password')}
              placeholder="Enter password"
              className={`w-full p-2.5 rounded-lg bg-[#FAFCFE] border text-xs text-[#1C211B] placeholder-[#979A98] focus:outline-none focus:ring-1 ${
                passwordError
                  ? 'border-[#C54A40] focus:ring-[#C54A40]'
                  : 'border-[#E2E5E6] focus:border-[#2E5421] focus:ring-[#2E5421]'
              }`}
            />
            {passwordError && (
              <span className="text-xs text-[#C54A40] font-medium">{passwordError}</span>
            )}
          </div>

          {/* Field: ID Reference Upload */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#1C211B]">ID Reference</label>
            <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-[#E2E5E6] hover:border-[#2E5421] rounded-xl bg-[#FAFCFE] cursor-pointer transition-colors text-center">
              <svg className="w-8 h-8 text-[#7B7E7B] mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="text-xs font-medium text-[#1C211B]">
                {selectedFileName
                  ? `Selected: ${selectedFileName}`
                  : 'Drag and drop or browse to upload your identification document.'}
              </span>
              <span className="text-[11px] text-[#7B7E7B] mt-1">
                Accepted formats: PDF, JPG, PNG. Max size: 5MB.
              </span>
              <input
                type="file"
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
              />
            </label>
          </div>

          {serverError && (
            <div className="p-3 bg-[#FEEEED] border border-[#FAC4C0] rounded-xl flex items-center justify-between text-xs text-[#C54A40]">
              <span>{serverError}</span>
              <button
                type="button"
                onClick={handleSubmit}
                className="px-3 py-1 bg-[#C54A40] text-white rounded font-semibold text-xs hover:bg-[#A34137] transition-colors"
              >
                Retry
              </button>
            </div>
          )}

          {/* Reusable FormFooter */}
          <FormFooter
            submitLabel="Send Invite"
            onSubmit={() => handleSubmit()}
            isSubmitDisabled={!isFormValid}
            submitDisabledReason={
              isEmailDuplicate
                ? 'Resolve duplicate email to continue'
                : 'Fill all required fields to continue'
            }
            isSubmitting={isSubmitting}
            cancelLabel="Cancel"
            onCancel={onClose}
          />
        </form>
      </div>
    </ModalShell>
  );
};
