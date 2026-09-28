/**
 * GrowthCheckReview.tsx
 *
 * Implements FR-10 Growth Check review screen per:
 * - design/ui-reference/FR-10-review-queue/Growth Check.png
 * - AGENTS.md section 8 (FR-10 flow)
 * - state-mapping-rules.md (RecordState: Needs Review, Verified, Rejected)
 * - review-and-decide-screen/SKILL.md
 * - form-validation-rules.md (Rule 4: Reject disabled until reason entered)
 */

import React, { useState } from 'react';
import { PhotoGallery } from '../../../components/PhotoGallery';
import { StatusBadge } from '../../../components/StatusBadge';
import { ReviewDecisionFooter } from '../../../components/ReviewDecisionFooter';
import { GrowthCheckRecord } from '../types/review';
import { approveGrowthCheck, rejectGrowthCheck } from '../services/reviewPlaceholder';

interface GrowthCheckReviewProps {
  record: GrowthCheckRecord;
  onBack: () => void;
  onDecisionComplete: (updatedRecord: GrowthCheckRecord) => void;
}

export const GrowthCheckReview: React.FC<GrowthCheckReviewProps> = ({
  record: initialRecord,
  onBack,
  onDecisionComplete,
}) => {
  const [record, setRecord] = useState<GrowthCheckRecord>(initialRecord);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [decisionNotice, setDecisionNotice] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<{
    action: 'approve' | 'reject';
    reason?: string;
    message: string;
  } | null>(null);

  const handleApprove = async () => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const updated = await approveGrowthCheck(record.id);
      setRecord(updated);
      setDecisionNotice('Record successfully verified.');
      setTimeout(() => {
        onDecisionComplete(updated);
      }, 1000);
    } catch (err: any) {
      setSubmitError({
        action: 'approve',
        message: err?.message || 'Verification failed. Try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async (reason: string) => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const updated = await rejectGrowthCheck(record.id, reason);
      setRecord(updated);
      setDecisionNotice('Record rejected and returned to officer.');
      setTimeout(() => {
        onDecisionComplete(updated);
      }, 1000);
    } catch (err: any) {
      setSubmitError({
        action: 'reject',
        reason,
        message: err?.message || 'Rejection failed. Try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetry = () => {
    if (!submitError) return;
    if (submitError.action === 'approve') {
      handleApprove();
    } else if (submitError.action === 'reject') {
      handleReject(submitError.reason || '');
    }
  };

  const isDecided = record.state === 'Verified' || record.state === 'Rejected';

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-6 max-w-5xl mx-auto bg-white rounded-2xl border border-[#E2E5E6] shadow-xs">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#EEF0F2]">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="w-8 h-8 rounded-lg bg-[#FAFCFE] border border-[#E2E5E6] flex items-center justify-center text-[#1C211B] hover:bg-[#EEF0F2] transition-colors"
            aria-label="Go back"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <span className="text-sm font-bold text-[#1C211B]">{record.treeId}</span>
        </div>

        <button
          type="button"
          onClick={onBack}
          className="w-8 h-8 rounded-full bg-[#FEE2E2] flex items-center justify-center text-[#EF4444] hover:bg-[#FECACA] transition-colors shrink-0"
          aria-label="Close"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Decision notification banner if completed */}
      {decisionNotice && (
        <div
          className={`p-3.5 rounded-xl border text-xs font-semibold ${
            record.state === 'Verified'
              ? 'bg-[#ECFAF7] border-[#3CAD90] text-[#3CAD90]'
              : 'bg-[#FEEEED] border-[#FAC4C0] text-[#C54A40]'
          }`}
        >
          {decisionNotice}
        </div>
      )}

      {/* Submit Failure State with Retry Action (api-network-rules.md Rule 3 & 4) */}
      {submitError && (
        <div className="p-3.5 bg-[#FEEEED] border border-[#FAC4C0] rounded-xl flex items-center justify-between text-xs text-[#C54A40]">
          <span>{submitError.message}</span>
          <button
            type="button"
            onClick={handleRetry}
            className="px-3 py-1 bg-[#C54A40] text-white rounded font-semibold text-xs hover:bg-[#A34137] transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Map Viewport matching Growth Check reference */}
      <div className="relative w-full h-64 sm:h-72 rounded-2xl overflow-hidden border border-[#E2E5E6] bg-[#E8ECE2] shadow-inner">
        {/* City/Road Grid Graphic */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none opacity-80"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Main roads */}
          <line x1="60%" y1="0%" x2="52%" y2="100%" stroke="#EAAA08" strokeWidth="3" />
          <line x1="0%" y1="65%" x2="100%" y2="75%" stroke="#FFFFFF" strokeWidth="2.5" />
          <line x1="20%" y1="0%" x2="40%" y2="100%" stroke="#FFFFFF" strokeWidth="2" />
          {/* Minor blocks & secondary streets */}
          <path
            d="M 50 80 L 150 120 L 220 70 M 120 200 L 260 220 L 320 180 M 650 100 L 780 140 M 700 220 L 850 250"
            fill="none"
            stroke="#C0C7B8"
            strokeWidth="1.25"
          />
        </svg>

        {/* Region Labels */}
        <div className="absolute left-[35%] top-[10%] text-sm font-bold text-[#424641] pointer-events-none">
          Resa
        </div>
        <div className="absolute right-[25%] top-[25%] text-xs font-bold text-[#424641] pointer-events-none">
          KURMIN MASHI
        </div>
        <div className="absolute right-[28%] top-[35%] text-base font-bold text-[#1C211B] pointer-events-none">
          Abakpa
        </div>
        <div className="absolute left-[5%] bottom-[10%] text-sm font-bold text-[#424641] pointer-events-none">
          Ungwan Tama
        </div>

        {/* Tree Pin Location Marker */}
        <div className="absolute left-[44%] top-[30%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-white shadow-lg border-2 border-[#2E5421] flex items-center justify-center">
            <span className="w-5 h-5 rounded-full bg-[#2E5421]" />
          </div>
        </div>
      </div>

      {/* Main Content Grid: Left (Media Files) & Right (Results & Condition) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Media Files */}
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-bold text-[#1C211B]">Media Files</h3>
          <PhotoGallery photos={record.photos} />
        </div>

        {/* Right Column: Growth Check Results */}
        <div className="flex flex-col gap-5">
          {/* Header Row */}
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#1C211B]">Growth Check Results</h3>
            <StatusBadge status={record.state} variant="pill" />
          </div>

          {/* Location & Species Summary Card */}
          <div className="flex flex-col gap-2.5 p-4 rounded-xl border border-[#E2E5E6] bg-[#FAFCFE]">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#5E625E] font-medium">
                LAT: {record.coordinates.lat} LNG: {record.coordinates.lng}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#ECFDF3] text-[#027A48]">
                {record.accessibility}
              </span>
            </div>
            <div className="text-xs text-[#1C211B]">
              <strong className="font-semibold">TYPE:</strong> {record.species}{' '}
              <strong className="font-semibold ml-2">ID:</strong> {record.systemTreeNumber}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#7B7E7B] pt-1 border-t border-[#EEF0F2]">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{record.submittedAt}</span>
            </div>
          </div>

          {/* Additional Comments */}
          {record.additionalComments && (
            <div className="flex flex-col gap-1.5">
              <h4 className="text-xs font-bold text-[#1C211B]">Additional Comments</h4>
              <p className="text-xs text-[#5E625E] leading-relaxed p-3 bg-[#FAFCFE] rounded-lg border border-[#E2E5E6]">
                {record.additionalComments}
              </p>
            </div>
          )}

          {/* Soil Condition Grid */}
          <div className="flex flex-col gap-2">
            <h4 className="text-xs font-bold text-[#1C211B]">Soil Condition</h4>
            <div className="grid grid-cols-3 gap-2 p-3 bg-white rounded-xl border border-[#E2E5E6]">
              <div className="flex flex-col">
                <span className="text-[11px] text-[#7B7E7B]">SOIL FERTILITY</span>
                <span className="text-xs font-bold text-[#1C211B] mt-0.5">
                  {record.soilCondition.soilFertility}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] text-[#7B7E7B]">Moisture Content</span>
                <span className="text-xs font-bold text-[#1C211B] mt-0.5">
                  {record.soilCondition.moistureContent}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] text-[#7B7E7B]">PH Value</span>
                <span className="text-xs font-bold text-[#1C211B] mt-0.5">
                  {record.soilCondition.phValue}
                </span>
              </div>
              <div className="flex flex-col pt-2 border-t border-[#EEF0F2]">
                <span className="text-[11px] text-[#7B7E7B]">Temperature</span>
                <span className="text-xs font-bold text-[#1C211B] mt-0.5">
                  {record.soilCondition.temperature}
                </span>
              </div>
              <div className="flex flex-col pt-2 border-t border-[#EEF0F2]">
                <span className="text-[11px] text-[#7B7E7B]">Sunlight</span>
                <span className="text-xs font-bold text-[#1C211B] mt-0.5">
                  {record.soilCondition.sunlight}
                </span>
              </div>
              <div className="flex flex-col pt-2 border-t border-[#EEF0F2]">
                <span className="text-[11px] text-[#7B7E7B]">Humidity</span>
                <span className="text-xs font-bold text-[#1C211B] mt-0.5">
                  {record.soilCondition.humidity}
                </span>
              </div>
            </div>
          </div>

          {/* Physical Condition Grid */}
          <div className="flex flex-col gap-2">
            <h4 className="text-xs font-bold text-[#1C211B]">Physical Condition</h4>
            <div className="grid grid-cols-2 gap-3 p-3 bg-white rounded-xl border border-[#E2E5E6]">
              <div className="flex flex-col">
                <span className="text-[11px] text-[#7B7E7B]">BROKEN BRAND</span>
                <span
                  className={`text-xs font-bold mt-0.5 ${
                    record.physicalCondition.brokenBranch.toLowerCase() === 'yes'
                      ? 'text-[#027A48]'
                      : 'text-[#D92D20]'
                  }`}
                >
                  {record.physicalCondition.brokenBranch}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] text-[#7B7E7B]">DAMAGED BARK</span>
                <span
                  className={`text-xs font-bold mt-0.5 ${
                    record.physicalCondition.damagedBark.toLowerCase() === 'no'
                      ? 'text-[#D92D20]'
                      : 'text-[#027A48]'
                  }`}
                >
                  {record.physicalCondition.damagedBark}
                </span>
              </div>
              <div className="flex flex-col pt-2 border-t border-[#EEF0F2]">
                <span className="text-[11px] text-[#7B7E7B]">BENT STEM</span>
                <span
                  className={`text-xs font-bold mt-0.5 ${
                    record.physicalCondition.bentStem.toLowerCase() === 'no'
                      ? 'text-[#D92D20]'
                      : 'text-[#027A48]'
                  }`}
                >
                  {record.physicalCondition.bentStem}
                </span>
              </div>
              <div className="flex flex-col pt-2 border-t border-[#EEF0F2]">
                <span className="text-[11px] text-[#7B7E7B]">ROOTS EXPOSURE</span>
                <span
                  className={`text-xs font-bold mt-0.5 ${
                    record.physicalCondition.rootsExposure.toLowerCase() === 'no'
                      ? 'text-[#D92D20]'
                      : 'text-[#027A48]'
                  }`}
                >
                  {record.physicalCondition.rootsExposure}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decision Footer (Active only if not yet decided) */}
      {!isDecided ? (
        <ReviewDecisionFooter
          onApprove={handleApprove}
          onReject={handleReject}
          approveLabel="Approve Report"
          rejectLabel="Reject Report"
          isSubmitting={isSubmitting}
        />
      ) : (
        <div className="p-4 bg-[#FAFCFE] rounded-xl border border-[#E2E5E6] flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#5E625E]">Status:</span>
            <StatusBadge status={record.state} variant="pill" />
            {record.rejectionReason && (
              <span className="text-xs text-[#C54A40] italic ml-2">
                Reason: &quot;{record.rejectionReason}&quot;
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2 text-xs font-bold text-[#2E5421] hover:underline"
          >
            Return to Queue
          </button>
        </div>
      )}
    </div>
  );
};
