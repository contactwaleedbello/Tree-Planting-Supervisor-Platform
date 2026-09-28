/**
 * CONSTRUCTED FROM DESIGN SYSTEM
 *
 * This component implements FR-11 (Incident review and replacement, Supervisor portion).
 * Active layout reference: design/ui-reference/FR-11-incident-review/Growth Check(Incident report_ damaged).png
 * Rejection layout references: Growth Check(Incident report_ damaged)-1.png and -2.png
 *
 * NOTE ON ESCALATION:
 * No reference image exists in Figma for the act of escalating an incident.
 * Per standing project instructions (AGENTS.md section 8, COVERAGE.md line 49):
 * 1. A third action ("Escalate Report") is placed alongside Reject Report and Approve Report
 *    in ReviewDecisionFooter, styled to match this project's tone.
 * 2. On successful escalation, this component reuses the locked incident detail structure with copy
 *    changed to read that the incident is escalated and awaiting the Super Admin, rather than already decided.
 * 3. The incident's stored state is set to 'Escalated', the locked value from state-mapping-rules.md,
 *    and renders the literal word "Escalated" in the badge.
 *
 * OPEN QUESTION (form-validation-rules.md):
 * Whether escalating an incident requires a reason field is deliberately unresolved,
 * and is not settled by constructing this visual control. The Escalate control's enabled
 * state is kept always enabled (except during submission). This is not an oversight.
 */

import React, { useState } from 'react';
import { IncidentState } from '../../../types/states';
import { StatusBadge } from '../../../components/StatusBadge';
import { PhotoGallery, PhotoItem } from '../../../components/PhotoGallery';
import { ReviewDecisionFooter } from '../../../components/ReviewDecisionFooter';
import { MapBanner } from '../../../components/MapBanner';

export interface SoilConditionData {
  soilFertilityKg: string | number;
  moistureContentPercent: string | number;
  phValue: string | number;
  temperatureCelsius: string | number;
  sunlightLux: string | number;
  humidityPercent: string | number;
}

export interface PhysicalConditionData {
  brokenBranch: boolean; // Displayed as "BROKEN BRAND" in reference Figma
  damagedBark: boolean;
  bentStem: boolean;
  rootsExposure: boolean;
}

export interface IncidentRecordData {
  id: string; // e.g. "Maize/b23/Alph/00045"
  incidentNumber?: string;
  treeId: string; // e.g. "7890"
  species: string; // e.g. "Mouringa"
  category: 'Damaged/Destroyed' | 'Missing' | string;
  accessibility: 'Accessible' | 'Inaccessible' | string;
  status: IncidentState; // 'NeedsReview' | 'ReplacementRejected' | 'ReplacementApproved' | 'Escalated' | 'Closed' | 'Reported'
  coordinates: { lat: number; lng: number };
  timestamp: string; // e.g. "Today 10:25 PM"
  reasons: string; // Narrative from field officer
  photos: PhotoItem[];
  soilCondition: SoilConditionData;
  physicalCondition: PhysicalConditionData;

  // Audit / Locked metadata
  reporterName?: string;
  blockName?: string;
  decidedBy?: string;
  decidedAt?: string;
  escalatedBy?: string;
  escalatedAt?: string;
  rejectionReason?: string;
}

interface IncidentReviewProps {
  incident: IncidentRecordData;
  onApprove?: (id: string) => void | Promise<void>;
  onReject?: (id: string, reason: string) => void | Promise<void>;
  onEscalate?: (id: string) => void | Promise<void>;
  onReassign?: (id: string) => void | Promise<void>;
  onBack?: () => void;
  onClose?: () => void;
  className?: string;
}

export const IncidentReview: React.FC<IncidentReviewProps> = ({
  incident,
  onApprove,
  onReject,
  onEscalate,
  onReassign,
  onBack,
  onClose,
  className = '',
}) => {
  const [currentStatus, setCurrentStatus] = useState<IncidentState>(incident.status);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  // Handle Approve: transitions to ReplacementApproved
  const handleApprove = async () => {
    setIsSubmitting(true);
    try {
      if (onApprove) {
        await onApprove(incident.id);
      }
      setCurrentStatus('ReplacementApproved');
      setActionMessage('Incident approved. Guided workflow for replacement tree handed off to Field Officer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Reject: transitions to ReplacementRejected with audit reason
  const handleReject = async (reason: string) => {
    setIsSubmitting(true);
    try {
      if (onReject) {
        await onReject(incident.id, reason);
      }
      setCurrentStatus('ReplacementRejected');
      setActionMessage('Incident rejected. Rework returned to Field Officer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handle Escalate: transitions to locked state 'Escalated' per state-mapping-rules.md.
   *
   * OPEN QUESTION:
   * Whether escalating an incident requires a reason is deliberately unresolved
   * per form-validation-rules.md and COVERAGE.md. This control is always enabled
   * without requiring a reason input. This is not an oversight.
   */
  const handleEscalate = async () => {
    setIsSubmitting(true);
    try {
      if (onEscalate) {
        await onEscalate(incident.id);
      }
      setCurrentStatus('Escalated');
      setActionMessage('Incident escalated to the Super Admin. Awaiting final decision.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Determine badge text and visual display:
  // - NeedsReview displays as "Pending"
  // - ReplacementRejected displays as "Rejected"
  // - Escalated displays the literal word "Escalated" (rule 4)
  // - ReplacementApproved displays as "Verified"
  const getReviewBadgeStatus = (): string => {
    switch (currentStatus) {
      case 'NeedsReview':
        return 'Pending';
      case 'ReplacementRejected':
        return 'Rejected';
      case 'Escalated':
        // Renders the literal word Escalated per instruction 4
        return 'Escalated';
      case 'ReplacementApproved':
        return 'Verified';
      default:
        return currentStatus;
    }
  };

  const isLocked = currentStatus === 'Escalated' || currentStatus === 'ReplacementApproved' || currentStatus === 'Closed';

  return (
    <div className={`flex flex-col gap-6 bg-[#FAFCFE] min-h-screen p-6 ${className}`}>
      {/* Top Header Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="p-2 rounded-lg bg-white border border-[#E2E5E6] text-[#1C211B] hover:bg-[#F4F6F8] transition-colors"
              aria-label="Back"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          <h2 className="text-base font-bold text-[#1C211B]">{incident.id}</h2>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#FEE2E2] flex items-center justify-center text-[#EF4444] hover:bg-[#FECACA] transition-colors"
            aria-label="Close"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Map Banner with Location Pin */}
      <MapBanner
        blockPolygon={[
          { lat: incident.coordinates.lat + 0.002, lng: incident.coordinates.lng - 0.002 },
          { lat: incident.coordinates.lat + 0.003, lng: incident.coordinates.lng + 0.002 },
          { lat: incident.coordinates.lat - 0.001, lng: incident.coordinates.lng + 0.003 },
          { lat: incident.coordinates.lat - 0.002, lng: incident.coordinates.lng - 0.001 },
        ]}
        blockName={`Lat: ${incident.coordinates.lat}, Lng: ${incident.coordinates.lng}`}
      />

      {/* Main Content Grid: Left Photos, Right Incident Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Media Evidence Files */}
        <div className="lg:col-span-6 bg-white border border-[#E2E5E6] rounded-xl p-5 shadow-xs flex flex-col gap-4">
          <PhotoGallery photos={incident.photos} title="Media Files" />
        </div>

        {/* Right Column: Incident Report Metadata & Conditions */}
        <div className="lg:col-span-6 bg-white border border-[#E2E5E6] rounded-xl p-5 shadow-xs flex flex-col gap-5">
          {/* Header Row: Title & Review Status Badge */}
          <div className="flex items-center justify-between border-b border-[#EEF0F2] pb-4">
            <h3 className="text-base font-bold text-[#1C211B]">Incident Report</h3>
            <StatusBadge status={getReviewBadgeStatus()} variant="pill" />
          </div>

          {/* Primary Metadata Box */}
          <div className="bg-[#FAFCFE] border border-[#E2E5E6] rounded-xl p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              {/* Category chip: Damaged/Destroyed or Missing */}
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  incident.category === 'Missing'
                    ? 'bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]'
                    : 'bg-[#FEE2E2] text-[#991B1B] border border-[#FECACA]'
                }`}
              >
                {incident.category}
              </span>

              {/* Accessibility chip */}
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9]">
                {incident.accessibility}
              </span>
            </div>

            <div className="text-xs text-[#5E625E] font-medium">
              LAT: {incident.coordinates.lat} LNG: {incident.coordinates.lng}
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#1C211B]">
                TYPE: <span className="font-normal text-[#5E625E]">{incident.species}</span>
              </span>
              <span className="font-semibold text-[#1C211B]">
                ID: <span className="font-normal text-[#5E625E]">{incident.treeId}</span>
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-[#7B7E7B]">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span>{incident.timestamp}</span>
            </div>
          </div>

          {/* Reasons Narrative */}
          <div className="bg-[#FBF7F5] border border-[#F0E4DE] rounded-xl p-4 flex flex-col gap-1.5">
            <h4 className="text-xs font-bold text-[#A34137]">Reasons</h4>
            <p className="text-xs text-[#5E625E] leading-relaxed">{incident.reasons}</p>
          </div>

          {/* Soil Condition Section */}
          <div className="flex flex-col gap-2">
            <h4 className="text-xs font-bold text-[#1C211B]">Soil Condition</h4>
            <div className="border border-[#E2E5E6] rounded-xl grid grid-cols-3 divide-x divide-y divide-[#E2E5E6] overflow-hidden text-xs">
              <div className="p-3 bg-[#FAFCFE]">
                <div className="text-[10px] text-[#7B7E7B] uppercase font-medium">SOIL FERTILITY</div>
                <div className="text-sm font-bold text-[#1C211B] mt-0.5">{incident.soilCondition.soilFertilityKg} <span className="text-xs font-normal">Kg</span></div>
              </div>
              <div className="p-3 bg-[#FAFCFE]">
                <div className="text-[10px] text-[#7B7E7B] uppercase font-medium">Moisture Content</div>
                <div className="text-sm font-bold text-[#1C211B] mt-0.5">{incident.soilCondition.moistureContentPercent} <span className="text-xs font-normal">%</span></div>
              </div>
              <div className="p-3 bg-[#FAFCFE]">
                <div className="text-[10px] text-[#7B7E7B] uppercase font-medium">PH Value</div>
                <div className="text-sm font-bold text-[#1C211B] mt-0.5">{incident.soilCondition.phValue}</div>
              </div>
              <div className="p-3 bg-[#FAFCFE]">
                <div className="text-[10px] text-[#7B7E7B] uppercase font-medium">Temperature</div>
                <div className="text-sm font-bold text-[#1C211B] mt-0.5">{incident.soilCondition.temperatureCelsius} <span className="text-xs font-normal">oC</span></div>
              </div>
              <div className="p-3 bg-[#FAFCFE]">
                <div className="text-[10px] text-[#7B7E7B] uppercase font-medium">Sunlight</div>
                <div className="text-sm font-bold text-[#1C211B] mt-0.5">{incident.soilCondition.sunlightLux} <span className="text-xs font-normal">lux</span></div>
              </div>
              <div className="p-3 bg-[#FAFCFE]">
                <div className="text-[10px] text-[#7B7E7B] uppercase font-medium">Humidity</div>
                <div className="text-sm font-bold text-[#1C211B] mt-0.5">{incident.soilCondition.humidityPercent} <span className="text-xs font-normal">%</span></div>
              </div>
            </div>
          </div>

          {/* Physical Condition Section */}
          <div className="flex flex-col gap-2">
            <h4 className="text-xs font-bold text-[#1C211B]">Physical Condition</h4>
            <div className="border border-[#E2E5E6] rounded-xl grid grid-cols-2 divide-x divide-y divide-[#E2E5E6] overflow-hidden text-xs">
              <div className="p-3 bg-[#FAFCFE]">
                <div className="text-[10px] text-[#7B7E7B] uppercase font-medium">BROKEN BRAND</div>
                <div className={`text-xs font-bold mt-0.5 ${incident.physicalCondition.brokenBranch ? 'text-[#2E7D32]' : 'text-[#D32F2F]'}`}>
                  {incident.physicalCondition.brokenBranch ? 'Yes' : 'NO'}
                </div>
              </div>
              <div className="p-3 bg-[#FAFCFE]">
                <div className="text-[10px] text-[#7B7E7B] uppercase font-medium">DAMAGED BARK</div>
                <div className={`text-xs font-bold mt-0.5 ${incident.physicalCondition.damagedBark ? 'text-[#2E7D32]' : 'text-[#D32F2F]'}`}>
                  {incident.physicalCondition.damagedBark ? 'Yes' : 'NO'}
                </div>
              </div>
              <div className="p-3 bg-[#FAFCFE]">
                <div className="text-[10px] text-[#7B7E7B] uppercase font-medium">BENT STEM</div>
                <div className={`text-xs font-bold mt-0.5 ${incident.physicalCondition.bentStem ? 'text-[#2E7D32]' : 'text-[#D32F2F]'}`}>
                  {incident.physicalCondition.bentStem ? 'Yes' : 'NO'}
                </div>
              </div>
              <div className="p-3 bg-[#FAFCFE]">
                <div className="text-[10px] text-[#7B7E7B] uppercase font-medium">ROOTS EXPOSURE</div>
                <div className={`text-xs font-bold mt-0.5 ${incident.physicalCondition.rootsExposure ? 'text-[#2E7D32]' : 'text-[#D32F2F]'}`}>
                  {incident.physicalCondition.rootsExposure ? 'Yes' : 'NO'}
                </div>
              </div>
            </div>
          </div>

          {/* User Feedback Message (if an action was completed) */}
          {actionMessage && (
            <div className="p-3 rounded-lg text-xs font-medium bg-[#F0FDF4] border border-[#BBF7D0] text-[#166534]">
              {actionMessage}
            </div>
          )}

          {/*
           * CONSTRUCTED POST-ESCALATION LOCKED VIEW (Instruction 3 & 4)
           *
           * Reuses the locked, already-decided incident screen layout.
           * Copy is changed so it reads that the incident is escalated and awaiting the Super Admin,
           * rather than already decided.
           */}
          {currentStatus === 'Escalated' && (
            <div className="bg-[#FFFBEB] border border-[#FDE68A] rounded-xl p-4 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-[#B45309]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <h4 className="text-sm font-bold text-[#92400E]">
                  This incident is escalated and awaiting the Super Admin
                </h4>
              </div>

              <p className="text-xs text-[#78350F] leading-relaxed">
                An escalated incident can be decided by the Super Admin only and is no longer actionable here.
                The record is locked awaiting administrative review.
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#FDE68A] text-xs">
                <div>
                  <span className="text-[#92400E] font-medium">Status: </span>
                  <span className="font-bold text-[#78350F]">Escalated</span>
                </div>
                <div>
                  <span className="text-[#92400E] font-medium">Tree ID: </span>
                  <span className="font-bold text-[#78350F]">{incident.treeId}</span>
                </div>
                {incident.incidentNumber && (
                  <div>
                    <span className="text-[#92400E] font-medium">Incident No: </span>
                    <span className="font-bold text-[#78350F]">{incident.incidentNumber}</span>
                  </div>
                )}
                {incident.reporterName && (
                  <div>
                    <span className="text-[#92400E] font-medium">Reporter: </span>
                    <span className="font-bold text-[#78350F]">{incident.reporterName}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Already Decided View (ReplacementApproved / Closed) */}
          {(currentStatus === 'ReplacementApproved' || currentStatus === 'Closed') && (
            <div className="bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl p-4 flex flex-col gap-2 text-xs">
              <div className="font-bold text-[#166534]">Decision Recorded</div>
              <p className="text-[#15803D]">
                {incident.decidedBy
                  ? `Decided by ${incident.decidedBy} on ${incident.decidedAt || 'recently'}.`
                  : 'This incident decision has been recorded and the record is locked.'}
              </p>
            </div>
          )}

          {/* Re-assign Task button for Rejected state (matching Growth Check(Incident report_ damaged)-2.png) */}
          {currentStatus === 'ReplacementRejected' && (
            <div className="pt-2">
              <button
                type="button"
                onClick={() => onReassign && onReassign(incident.id)}
                className="w-full py-2.5 rounded-lg border border-[#C97A3E] text-[#8C532B] font-semibold text-xs hover:bg-[#FDF8F3] transition-colors flex items-center justify-center gap-1.5 focus:outline-none"
              >
                <span>Re-assign Task</span>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          )}

          {/* Decision Footer for Active / NeedsReview state */}
          {!isLocked && currentStatus === 'NeedsReview' && (
            <ReviewDecisionFooter
              onApprove={handleApprove}
              onReject={handleReject}
              onEscalate={handleEscalate}
              approveLabel="Approve Report"
              rejectLabel="Reject Report"
              escalateLabel="Escalate Report"
              isSubmitting={isSubmitting}
            />
          )}
        </div>
      </div>
    </div>
  );
};
