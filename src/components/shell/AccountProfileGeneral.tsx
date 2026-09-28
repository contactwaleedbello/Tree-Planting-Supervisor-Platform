import React, { useEffect, useState } from 'react';
import {
  getProfilePlaceholder,
  updateAppearancePlaceholder,
  UserProfile,
} from '../../services/shellPlaceholder';

/**
 * AccountProfileGeneral: Profile (General) tab.
 * Matches design/ui-reference/shell/Profile  (General).png.
 */
export const AccountProfileGeneral: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [appearanceMode, setAppearanceMode] = useState<'light' | 'dark'>('light');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getProfilePlaceholder();
      setProfile(data);
      setAppearanceMode(data.appearanceMode);
      setIsLoading(false);
    } catch {
      setIsLoading(false);
      setError('Failed to load profile details. Try again.');
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleModeChange = async (mode: 'light' | 'dark') => {
    setAppearanceMode(mode);
    try {
      await updateAppearancePlaceholder(mode);
    } catch {
      // Revert if error
      setAppearanceMode(appearanceMode);
    }
  };

  if (isLoading) {
    return (
      <div className="p-12 text-center text-xs text-[#7B7E7B] flex flex-col items-center gap-2 bg-[#FAFCFE] rounded-2xl border border-[#E2E5E6]">
        <svg className="animate-spin h-6 w-6 text-[#3C7429]" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <span>Loading account settings...</span>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="p-8 text-center text-xs text-[#C54A40] bg-[#FAFCFE] rounded-2xl border border-[#E2E5E6]">
        <p>{error || 'Account profile not found.'}</p>
        <button
          type="button"
          onClick={fetchProfile}
          className="mt-3 px-4 py-1.5 rounded-lg bg-[#3C7429] text-[#FAFCFE] font-semibold text-xs"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* 1. Personal Information Card */}
      <div className="bg-[#FAFCFE] border border-[#E2E5E6] rounded-2xl p-6 shadow-xs">
        <h3 className="text-sm font-bold text-[#1C211B] mb-5">Personal Information</h3>

        {/* Top Header: Avatar + Name + Ward + Role */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#EEF0F2]">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-[#EEF0F2] flex items-center justify-center text-xl font-bold text-[#1C211B]">
                {profile.initials}
              </div>
              <button
                type="button"
                className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-[#FAFCFE] border border-[#CBCDCE] flex items-center justify-center text-[#5E625E] hover:text-[#1C211B] shadow-2xs focus:outline-none"
                aria-label="Edit avatar"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-base font-bold text-[#1C211B]">{profile.fullName}</h4>
                <button
                  type="button"
                  className="text-[#7B7E7B] hover:text-[#1C211B] focus:outline-none"
                  aria-label="Edit name"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
              </div>
              <p className="text-xs text-[#5E625E] mt-0.5">{profile.ward}</p>
              <div className="mt-2">
                <span className="inline-block px-3 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-[#EEF0F2] text-[#424641]">
                  {profile.role}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 2x2 Property Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 pt-6">
          {/* Email */}
          <div className="flex items-center justify-between border-b sm:border-b-0 border-[#EEF0F2] pb-4 sm:pb-0">
            <div>
              <label className="text-[11px] font-medium text-[#7B7E7B] uppercase tracking-wider block">
                Email
              </label>
              <span className="text-xs font-semibold text-[#1C211B] mt-1 block">
                {profile.email}
              </span>
            </div>
            <button
              type="button"
              className="text-[#7B7E7B] hover:text-[#1C211B] focus:outline-none"
              aria-label="Edit email"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
          </div>

          {/* Phone Number */}
          <div className="flex items-center justify-between border-b sm:border-b-0 border-[#EEF0F2] pb-4 sm:pb-0">
            <div>
              <label className="text-[11px] font-medium text-[#7B7E7B] uppercase tracking-wider block">
                Phone number
              </label>
              <span className="text-xs font-semibold text-[#1C211B] mt-1 block">
                {profile.phoneNumber}
              </span>
            </div>
            <button
              type="button"
              className="text-[#7B7E7B] hover:text-[#1C211B] focus:outline-none"
              aria-label="Edit phone number"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
          </div>

          {/* ID-Card */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div>
                <label className="text-[11px] font-medium text-[#7B7E7B] uppercase tracking-wider block">
                  ID-Card
                </label>
                <div className="flex items-center gap-2 mt-1">
                  <svg className="w-4 h-4 text-[#7B7E7B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" strokeWidth={1.5} />
                    <circle cx="8.5" cy="8.5" r="1.5" strokeWidth={1.5} />
                    <polyline points="21 15 16 10 5 21" strokeWidth={1.5} />
                  </svg>
                  <span className="text-xs font-medium text-[#1C211B]">{profile.idCardFileName}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="text-[#7B7E7B] hover:text-[#1C211B] focus:outline-none"
                aria-label="View ID-Card"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
              <button
                type="button"
                className="text-[#7B7E7B] hover:text-[#1C211B] focus:outline-none"
                aria-label="Edit ID-Card"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Assigned Blocks */}
          <div>
            <label className="text-[11px] font-medium text-[#7B7E7B] uppercase tracking-wider block">
              Assigned Blocks
            </label>
            <span className="text-xs font-bold text-[#1C211B] mt-1 block">
              {profile.assignedBlocksCount}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Appearance Section */}
      <div className="bg-[#FAFCFE] border border-[#E2E5E6] rounded-2xl p-6 shadow-xs">
        <h3 className="text-sm font-bold text-[#1C211B] mb-5">Appearance</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-xl">
          {/* Light Mode Card */}
          <div
            onClick={() => handleModeChange('light')}
            className={`cursor-pointer rounded-2xl border-2 p-3 transition-all ${
              appearanceMode === 'light'
                ? 'border-[#2E5421] bg-[#F5F8F4]'
                : 'border-[#E2E5E6] bg-[#FAFCFE] hover:border-[#CBCDCE]'
            }`}
          >
            {/* Visual wireframe */}
            <div className="bg-[#FAFCFE] border border-[#E2E5E6] rounded-xl p-3 h-28 flex flex-col justify-between">
              <div className="grid grid-cols-3 gap-2">
                <div className="h-4 bg-[#EEF0F2] rounded-md" />
                <div className="h-4 bg-[#EEF0F2] rounded-md" />
                <div className="h-4 bg-[#EEF0F2] rounded-md" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="h-10 bg-[#EEF0F2] rounded-md" />
                <div className="h-10 bg-[#EEF0F2] rounded-md" />
              </div>
            </div>

            <div className="flex items-center gap-2 mt-3">
              <div
                className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                  appearanceMode === 'light'
                    ? 'border-[#2E5421] bg-[#2E5421] text-white'
                    : 'border-[#CBCDCE] bg-white'
                }`}
              >
                {appearanceMode === 'light' && (
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className="text-xs font-semibold text-[#1C211B]">Light Mode</span>
            </div>
          </div>

          {/* Dark Mode Card */}
          <div
            onClick={() => handleModeChange('dark')}
            className={`cursor-pointer rounded-2xl border-2 p-3 transition-all ${
              appearanceMode === 'dark'
                ? 'border-[#2E5421] bg-[#F5F8F4]'
                : 'border-[#E2E5E6] bg-[#FAFCFE] hover:border-[#CBCDCE]'
            }`}
          >
            {/* Visual wireframe in dark styling */}
            <div className="bg-[#1C211B] border border-[#2A2F29] rounded-xl p-3 h-28 flex flex-col justify-between">
              <div className="grid grid-cols-3 gap-2">
                <div className="h-4 bg-[#2E5421]/60 rounded-md" />
                <div className="h-4 bg-[#2E5421]/60 rounded-md" />
                <div className="h-4 bg-[#2E5421]/60 rounded-md" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="h-10 bg-[#2E5421]/40 rounded-md" />
                <div className="h-10 bg-[#2E5421]/40 rounded-md" />
              </div>
            </div>

            <div className="flex items-center gap-2 mt-3">
              <div
                className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                  appearanceMode === 'dark'
                    ? 'border-[#2E5421] bg-[#2E5421] text-white'
                    : 'border-[#CBCDCE] bg-white'
                }`}
              >
                {appearanceMode === 'dark' && (
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className="text-xs font-semibold text-[#1C211B]">Dark Mode</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Security Section */}
      <div className="bg-[#FAFCFE] border border-[#E2E5E6] rounded-2xl p-6 shadow-xs">
        <h3 className="text-sm font-bold text-[#1C211B] mb-5">Security</h3>

        {/* Password */}
        <div className="border border-[#EEF0F2] rounded-xl p-4 flex items-center justify-between mb-4">
          <div>
            <label className="text-[11px] font-medium text-[#7B7E7B] uppercase tracking-wider block">
              Password
            </label>
            <span className="text-xs font-bold text-[#1C211B] tracking-widest mt-1 block">
              ********************
            </span>
          </div>
          <button
            type="button"
            className="text-[#7B7E7B] hover:text-[#1C211B] focus:outline-none"
            aria-label="Edit password"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
        </div>

        {/* Legal links (Terms of Use, Privacy Policy) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="border border-[#EEF0F2] rounded-xl p-4 flex items-center justify-between hover:bg-[#EEF0F2]/30 transition-colors cursor-pointer">
            <div>
              <span className="text-[11px] font-medium text-[#7B7E7B] uppercase tracking-wider block">
                Terms of Use
              </span>
              <div className="flex items-center gap-2 mt-1">
                <svg className="w-4 h-4 text-[#7B7E7B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-xs font-semibold text-[#1C211B]">Terms of Use</span>
              </div>
            </div>
            <svg className="w-4 h-4 text-[#7B7E7B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>

          <div className="border border-[#EEF0F2] rounded-xl p-4 flex items-center justify-between hover:bg-[#EEF0F2]/30 transition-colors cursor-pointer">
            <div>
              <span className="text-[11px] font-medium text-[#7B7E7B] uppercase tracking-wider block">
                Privacy Policy
              </span>
              <div className="flex items-center gap-2 mt-1">
                <svg className="w-4 h-4 text-[#7B7E7B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-xs font-semibold text-[#1C211B]">Privacy Policy</span>
              </div>
            </div>
            <svg className="w-4 h-4 text-[#7B7E7B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
