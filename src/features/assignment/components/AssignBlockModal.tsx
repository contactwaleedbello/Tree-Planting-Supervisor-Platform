/**
 * AssignBlockModal.tsx
 *
 * Implements FR-09 Assignment form ("Mobilise your team") per:
 * - design/ui-reference/FR-09-assignment/Frame 2147225637.png
 * - AGENTS.md section 8 (FR-09 flow)
 * - form-validation-rules.md (Rule 3: Block, EO, start date required; custodian & end date optional;
 *                             Rule 5: Unsafe block blocked at selection point with exact PRD copy;
 *                             Rule 7: Disabled button shows why disabled)
 * - gated-action-control
 */

import React, { useState, useEffect } from 'react';
import { ModalShell } from '../../../components/ModalShell';
import { FormFooter } from '../../../components/FormFooter';
import {
  MappableBlockItem,
  ActiveOfficerOption,
  CreateAssignmentInput,
} from '../types/assignment';
import {
  fetchMappableBlocks,
  fetchActiveOfficers,
  createBlockAssignment,
} from '../services/assignmentPlaceholder';

export interface AssignBlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedBlockId?: string;
  preselectedOfficerId?: string;
  preselectedOfficerName?: string;
  initialTaskType?: string;
  initialFieldInstructions?: string;
  initialTargetQuota?: string | number;
  onSuccess?: (updatedBlock: MappableBlockItem) => void;
}

const TASK_TYPES = [
  'Sapling Survival Audit, GPS Geotagging, Block Boundary Check',
  'Tree Registration & Species Identification',
  'Quarterly Growth Check & Soil Condition',
  'Re-assignment / Incident Verification',
];

export const AssignBlockModal: React.FC<AssignBlockModalProps> = ({
  isOpen,
  onClose,
  preselectedBlockId,
  preselectedOfficerId,
  preselectedOfficerName,
  initialTaskType,
  initialFieldInstructions,
  initialTargetQuota,
  onSuccess,
}) => {
  const [taskType, setTaskType] = useState(initialTaskType || TASK_TYPES[0]);
  const [officerId, setOfficerId] = useState(preselectedOfficerId || '');
  const [blockId, setBlockId] = useState(preselectedBlockId || '');
  const [targetQuota, setTargetQuota] = useState(initialTargetQuota ? String(initialTargetQuota) : '');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [fieldInstructions, setFieldInstructions] = useState(initialFieldInstructions || '');

  const [blocks, setBlocks] = useState<MappableBlockItem[]>([]);
  const [activeOfficers, setActiveOfficers] = useState<ActiveOfficerOption[]>([]);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [syncNotice, setSyncNotice] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchMappableBlocks().then(setBlocks);
      fetchActiveOfficers().then((officers) => {
        setActiveOfficers(officers);
        if (preselectedOfficerId) {
          setOfficerId(preselectedOfficerId);
        } else if (preselectedOfficerName) {
          const matched = officers.find(
            (o) => o.name.toLowerCase() === preselectedOfficerName.toLowerCase()
          );
          if (matched) setOfficerId(matched.id);
        }
      });
      if (preselectedBlockId) {
        setBlockId(preselectedBlockId);
      }
      if (initialTaskType) {
        setTaskType(initialTaskType);
      }
      if (initialFieldInstructions) {
        setFieldInstructions(initialFieldInstructions);
      }
      if (initialTargetQuota) {
        setTargetQuota(String(initialTargetQuota));
      }
    } else {
      setOfficerId('');
      setBlockId('');
      setTargetQuota('');
      setStartDate('');
      setEndDate('');
      setFieldInstructions('');
      setTouched({});
      setSyncNotice(null);
      setSubmitError(null);
    }
  }, [isOpen, preselectedBlockId, preselectedOfficerId, preselectedOfficerName, initialTaskType, initialFieldInstructions, initialTargetQuota]);

  // Selected block analysis for safety rule (form-validation-rules.md Rule 5)
  const selectedBlock = blocks.find((b) => b.id === blockId);
  const isSelectedBlockUnsafe = selectedBlock?.safety === 'Unsafe';

  // Validation rules (form-validation-rules.md Rule 3: Block, EO, and start date are required; end date is optional)
  const isBlockValid = Boolean(blockId) && !isSelectedBlockUnsafe;
  const isOfficerValid = Boolean(officerId);
  const isStartDateValid = Boolean(startDate);
  const isEndDateValid = !endDate || !startDate || new Date(endDate) >= new Date(startDate);
  const isQuotaValid = !targetQuota || Number(targetQuota) > 0;

  const isFormValid =
    isBlockValid &&
    isOfficerValid &&
    isStartDateValid &&
    isEndDateValid &&
    isQuotaValid &&
    !isSelectedBlockUnsafe;

  // Inline error messages
  const blockError = touched.blockId
    ? !blockId
      ? 'Assigned location block is required.'
      : isSelectedBlockUnsafe
      ? 'This block is flagged unsafe and cannot be assigned.'
      : null
    : isSelectedBlockUnsafe
    ? 'This block is flagged unsafe and cannot be assigned.'
    : null;

  const officerError =
    touched.officerId && !isOfficerValid ? 'Please select an officer to assign.' : null;
  const startDateError =
    touched.startDate && !isStartDateValid ? 'Start date is required.' : null;
  const endDateError =
    touched.endDate && !isEndDateValid ? 'End date must be on or after start date.' : null;
  const quotaError =
    touched.targetQuota && !isQuotaValid ? 'Quota must be a positive number.' : null;

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleBlockChange = (selectedId: string) => {
    setBlockId(selectedId);
    setTouched((prev) => ({ ...prev, blockId: true }));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!isFormValid) {
      setTouched({
        blockId: true,
        officerId: true,
        startDate: true,
        endDate: true,
        targetQuota: true,
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const input: CreateAssignmentInput = {
        taskType,
        blockId,
        officerId,
        targetQuota: targetQuota ? Number(targetQuota) : 50,
        startDate,
        endDate: endDate || undefined,
        fieldInstructions: fieldInstructions.trim() || undefined,
      };

      const updated = await createBlockAssignment(input);
      // PRD rule: Assignment reaches EO only after EO's next successful sync
      setSyncNotice('Assignment saved. Will reach officer device upon next sync.');
      setTimeout(() => {
        if (onSuccess) {
          onSuccess(updated);
        }
        onClose();
      }, 1200);
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to deploy assignment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ModalShell isOpen={isOpen} onClose={onClose} maxWidth="lg">
      <div className="flex flex-col gap-5 p-6 relative">
        {/* Sync Notice Alert */}
        {syncNotice && (
          <div className="p-3 bg-[#ECFAF7] border border-[#3CAD90] rounded-xl text-xs text-[#3CAD90] font-medium flex items-center justify-between">
            <span>{syncNotice}</span>
          </div>
        )}

        {/* Submit Failure State with Retry Action (api-network-rules.md Rule 3 & 4) */}
        {submitError && (
          <div className="p-3 bg-[#FEEEED] border border-[#FAC4C0] rounded-xl flex items-center justify-between text-xs text-[#C54A40]">
            <span>{submitError}</span>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-3 py-1 bg-[#C54A40] text-white rounded font-semibold text-xs hover:bg-[#A34137] transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Modal Header */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-base font-bold text-[#1C211B]">Mobilise your team</h2>
            <p className="text-xs text-[#5E625E] mt-1 leading-relaxed max-w-sm">
              Put your officers on the map. Assign areas, set daily targets, and deploy tasks directly to the field.
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

        {/* Assignment Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Task Type */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="task-type" className="text-xs font-bold text-[#1C211B]">
              Task type <span className="text-[#C54A40]">*</span>
            </label>
            <div className="relative">
              <select
                id="task-type"
                value={taskType}
                onChange={(e) => setTaskType(e.target.value)}
                className="w-full p-2.5 rounded-lg bg-[#FAFCFE] border border-[#E2E5E6] text-xs text-[#1C211B] appearance-none focus:outline-none focus:border-[#2E5421] focus:ring-1 focus:ring-[#2E5421]"
              >
                {TASK_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-[#7B7E7B]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Assign To (Active Officers Only) */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="assign-to" className="text-xs font-bold text-[#1C211B]">
              Assign to <span className="text-[#C54A40]">*</span>
            </label>
            <div className="relative">
              <select
                id="assign-to"
                value={officerId}
                onChange={(e) => setOfficerId(e.target.value)}
                onBlur={() => handleBlur('officerId')}
                className={`w-full p-2.5 rounded-lg bg-[#FAFCFE] border text-xs text-[#1C211B] appearance-none focus:outline-none focus:ring-1 ${
                  officerError
                    ? 'border-[#C54A40] focus:ring-[#C54A40]'
                    : 'border-[#E2E5E6] focus:border-[#2E5421] focus:ring-[#2E5421]'
                }`}
              >
                <option value="">Search officer by name or ID</option>
                {activeOfficers.map((officer) => (
                  <option key={officer.id} value={officer.id}>
                    {officer.name} ({officer.id})
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-[#7B7E7B]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            <span className="text-[11px] text-[#7B7E7B]">
              Only active officers in this ward are listed
            </span>
            {officerError && <span className="text-xs text-[#C54A40] font-medium">{officerError}</span>}
          </div>

          {/* Assigned Location (Block Picker with Unsafe Blocking) */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="assigned-location" className="text-xs font-bold text-[#1C211B]">
              Assigned location <span className="text-[#C54A40]">*</span>
            </label>
            <div className="relative">
              <select
                id="assigned-location"
                value={blockId}
                onChange={(e) => handleBlockChange(e.target.value)}
                onBlur={() => handleBlur('blockId')}
                className={`w-full p-2.5 rounded-lg bg-[#FAFCFE] border text-xs text-[#1C211B] appearance-none focus:outline-none focus:ring-1 ${
                  blockError
                    ? 'border-[#C54A40] focus:ring-[#C54A40]'
                    : 'border-[#E2E5E6] focus:border-[#2E5421] focus:ring-[#2E5421]'
                }`}
              >
                <option value="">Select catchment area, community forest, or farm zone</option>
                {blocks.map((block) => (
                  <option key={block.id} value={block.id}>
                    {block.name} — {block.location} ({block.safety === 'Unsafe' ? '⚠️ Unsafe' : 'Safe'})
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-[#7B7E7B]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            {blockError && (
              <span className="text-xs text-[#C54A40] font-medium flex items-center gap-1">
                <svg className="w-3.5 h-3.5 text-[#C54A40]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                {blockError}
              </span>
            )}
          </div>

          {/* Target Quota */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="target-quota" className="text-xs font-bold text-[#1C211B]">
              Target quota
            </label>
            <input
              id="target-quota"
              type="number"
              value={targetQuota}
              onChange={(e) => setTargetQuota(e.target.value)}
              onBlur={() => handleBlur('targetQuota')}
              placeholder="e.g., 50 verified entries"
              className={`w-full p-2.5 rounded-lg bg-[#FAFCFE] border text-xs text-[#1C211B] placeholder-[#979A98] focus:outline-none focus:ring-1 ${
                quotaError
                  ? 'border-[#C54A40] focus:ring-[#C54A40]'
                  : 'border-[#E2E5E6] focus:border-[#2E5421] focus:ring-[#2E5421]'
              }`}
            />
            {quotaError && <span className="text-xs text-[#C54A40] font-medium">{quotaError}</span>}
          </div>

          {/* Start Date & End Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="assign-start-date" className="text-xs font-bold text-[#1C211B]">
                Start date <span className="text-[#C54A40]">*</span>
              </label>
              <input
                id="assign-start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                onBlur={() => handleBlur('startDate')}
                className={`w-full p-2.5 rounded-lg bg-[#FAFCFE] border text-xs text-[#1C211B] focus:outline-none focus:ring-1 ${
                  startDateError
                    ? 'border-[#C54A40] focus:ring-[#C54A40]'
                    : 'border-[#E2E5E6] focus:border-[#2E5421] focus:ring-[#2E5421]'
                }`}
              />
              {startDateError && (
                <span className="text-xs text-[#C54A40] font-medium">{startDateError}</span>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="assign-end-date" className="text-xs font-bold text-[#1C211B]">
                End date <span className="text-[11px] font-normal text-[#7B7E7B]">(optional)</span>
              </label>
              <input
                id="assign-end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                onBlur={() => handleBlur('endDate')}
                className={`w-full p-2.5 rounded-lg bg-[#FAFCFE] border text-xs text-[#1C211B] focus:outline-none focus:ring-1 ${
                  endDateError
                    ? 'border-[#C54A40] focus:ring-[#C54A40]'
                    : 'border-[#E2E5E6] focus:border-[#2E5421] focus:ring-[#2E5421]'
                }`}
              />
              {endDateError && (
                <span className="text-xs text-[#C54A40] font-medium">{endDateError}</span>
              )}
            </div>
          </div>

          {/* Field Instructions */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="field-instructions" className="text-xs font-bold text-[#1C211B]">
              Field instructions
            </label>
            <textarea
              id="field-instructions"
              rows={3}
              value={fieldInstructions}
              onChange={(e) => setFieldInstructions(e.target.value)}
              placeholder="Specific guidelines, access notes, or community leader contact info"
              className="w-full p-2.5 rounded-lg bg-[#FAFCFE] border border-[#E2E5E6] text-xs text-[#1C211B] placeholder-[#979A98] focus:outline-none focus:border-[#2E5421] focus:ring-1 focus:ring-[#2E5421] resize-none"
            />
          </div>

          {/* Reusable FormFooter enforcing Phase 0 reuse gate and form-validation-rules.md */}
          <FormFooter
            submitLabel="Deploy Task"
            onSubmit={() => handleSubmit()}
            isSubmitDisabled={!isFormValid}
            submitDisabledReason={
              isSelectedBlockUnsafe
                ? 'Unsafe block cannot be assigned'
                : 'Fill required fields to deploy task'
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
