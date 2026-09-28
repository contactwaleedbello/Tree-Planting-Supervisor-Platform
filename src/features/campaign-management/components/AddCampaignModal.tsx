/**
 * AddCampaignModal.tsx
 *
 * Implements the 3-step "Launch a planting campaign" modal wizard:
 * - Step 1: Set Campaign Boundaries (Name, Target trees, Approved species, Start/End dates)
 * - Step 2: Select Blocks (Search, filter, available blocks with polygon diagram)
 * - Step 3: Assign Officers (Campaign block cards with officer assignment)
 *
 * References:
 * - design/ui-reference/campaign-management/Add Campaign.png
 * - design/ui-reference/campaign-management/Add Campaign-1.png
 * - design/ui-reference/campaign-management/Add Campaign-2.png
 * - design/ui-reference/FR-09-assignment/Add Campaign.png
 *
 * Enforces gated-action-control & form-validation-rules.md:
 * - Rule 1: Submit never fires while a required condition is unmet.
 * - Rule 2: Shows inline validation error next to the field.
 * - Rule 7: Disabled submit button shows why it is disabled.
 */

import React, { useState, useEffect } from 'react';
import { ModalShell } from '../../../components/ModalShell';
import { FormFooter } from '../../../components/FormFooter';
import { SearchFilterBar } from '../../../components/SearchFilterBar';
import { AvailableBlockItem, NewCampaignInput, OperationalCampaignItem } from '../types/campaign';
import { fetchAvailableBlocks, createPlantingCampaign } from '../services/campaignPlaceholder';

interface AddCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newCampaign: OperationalCampaignItem) => void;
}

const AVAILABLE_SPECIES = ['Neem', 'Mahogany', 'Mango', 'Teak', 'Cashew'];

export const AddCampaignModal: React.FC<AddCampaignModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Step 1: Form state
  const [name, setName] = useState('');
  const [targetTrees, setTargetTrees] = useState('');
  const [selectedSpecies, setSelectedSpecies] = useState<string[]>([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Step 1: Touched state for validation
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Step 2: Block selection state
  const [availableBlocks, setAvailableBlocks] = useState<AvailableBlockItem[]>([]);
  const [selectedBlockIds, setSelectedBlockIds] = useState<string[]>([]);
  const [blockSearch, setBlockSearch] = useState('');

  // Step 3: Officer assignment state
  const [assignedOfficers, setAssignedOfficers] = useState<Array<{ blockId: string; officerName: string }>>([]);

  // Async submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Fetch available blocks when opening
  useEffect(() => {
    if (isOpen) {
      fetchAvailableBlocks().then(setAvailableBlocks);
    } else {
      // Reset state on close
      setCurrentStep(1);
      setName('');
      setTargetTrees('');
      setSelectedSpecies([]);
      setStartDate('');
      setEndDate('');
      setTouched({});
      setSelectedBlockIds([]);
      setSubmitError(null);
    }
  }, [isOpen]);

  // Validation checks per form-validation-rules.md
  const isNameValid = name.trim().length > 0;
  const isTargetTreesValid = Number(targetTrees) > 0;
  const isSpeciesValid = selectedSpecies.length > 0;
  const isStartDateValid = Boolean(startDate);
  const isEndDateValid = Boolean(endDate) && (!startDate || new Date(endDate) >= new Date(startDate));

  const isStep1Valid = isNameValid && isTargetTreesValid && isSpeciesValid && isStartDateValid && isEndDateValid;

  // Inline error messages
  const nameError = touched.name && !isNameValid ? 'Campaign name is required.' : null;
  const targetTreesError =
    touched.targetTrees && !isTargetTreesValid
      ? 'Target tree count is required and must be greater than 0.'
      : null;
  const speciesError = touched.selectedSpecies && !isSpeciesValid ? 'Select at least one approved tree species.' : null;
  const startDateError = touched.startDate && !isStartDateValid ? 'Start date is required.' : null;
  const endDateError =
    touched.endDate && !isEndDateValid
      ? !endDate
        ? 'End date is required.'
        : 'End date must be on or after start date.'
      : null;

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleToggleSpecies = (specie: string) => {
    setTouched((prev) => ({ ...prev, selectedSpecies: true }));
    setSelectedSpecies((prev) =>
      prev.includes(specie) ? prev.filter((s) => s !== specie) : [...prev, specie]
    );
  };

  const handleStep1Continue = () => {
    if (!isStep1Valid) {
      // Mark all fields as touched to display errors inline
      setTouched({
        name: true,
        targetTrees: true,
        selectedSpecies: true,
        startDate: true,
        endDate: true,
      });
      return;
    }
    setCurrentStep(2);
  };

  const handleToggleBlock = (blockId: string) => {
    setSelectedBlockIds((prev) =>
      prev.includes(blockId) ? prev.filter((id) => id !== blockId) : [...prev, blockId]
    );
  };

  const handleStep2Continue = () => {
    setCurrentStep(3);
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const payload: NewCampaignInput = {
        name: name.trim(),
        targetTrees: Number(targetTrees),
        approvedSpecies: selectedSpecies,
        startDate,
        endDate,
        selectedBlockIds,
        assignedOfficers: assignedOfficers.map((o) => ({
          blockId: o.blockId,
          officerId: o.officerName,
        })),
      };
      const created = await createPlantingCampaign(payload);
      onSuccess(created);
      onClose();
    } catch (err) {
      setSubmitError('Failed to launch campaign. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredBlocks = availableBlocks.filter(
    (b) =>
      b.name.toLowerCase().includes(blockSearch.toLowerCase()) ||
      b.state.toLowerCase().includes(blockSearch.toLowerCase())
  );

  return (
    <ModalShell isOpen={isOpen} onClose={onClose} maxWidth="xl">
      <div className="flex flex-col gap-6 p-6">
        {/* Modal Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-[#1C211B]">Launch a planting campaign</h2>
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
        </div>

        {/* 3-Step Wizard Indicator */}
        <div className="flex items-center justify-between px-2 sm:px-6">
          {/* Step 1 */}
          <div className="flex flex-col items-center gap-1.5">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                currentStep > 1
                  ? 'bg-[#2E5421] text-white'
                  : currentStep === 1
                  ? 'border-2 border-[#2E5421] text-[#2E5421] bg-white'
                  : 'border border-[#E2E5E6] text-[#7B7E7B] bg-white'
              }`}
            >
              {currentStep > 1 ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                '1'
              )}
            </div>
            <span
              className={`text-[11px] font-semibold text-center ${
                currentStep >= 1 ? 'text-[#2E5421]' : 'text-[#7B7E7B]'
              }`}
            >
              Set Campaign Boundaries
            </span>
          </div>

          {/* Divider Line 1-2 */}
          <div className="flex-1 h-0.5 mx-2 bg-[#E2E5E6] relative overflow-hidden">
            <div
              className={`h-full bg-[#2E5421] transition-all duration-300 ${
                currentStep > 1 ? 'w-full' : currentStep === 1 ? 'w-1/2' : 'w-0'
              }`}
            />
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center gap-1.5">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                currentStep > 2
                  ? 'bg-[#2E5421] text-white'
                  : currentStep === 2
                  ? 'border-2 border-[#2E5421] text-[#2E5421] bg-white'
                  : 'border border-[#E2E5E6] text-[#7B7E7B] bg-white'
              }`}
            >
              {currentStep > 2 ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                '2'
              )}
            </div>
            <span
              className={`text-[11px] font-semibold text-center ${
                currentStep >= 2 ? 'text-[#2E5421]' : 'text-[#7B7E7B]'
              }`}
            >
              Select Blocks
            </span>
          </div>

          {/* Divider Line 2-3 */}
          <div className="flex-1 h-0.5 mx-2 bg-[#E2E5E6] relative overflow-hidden">
            <div
              className={`h-full bg-[#2E5421] transition-all duration-300 ${
                currentStep > 2 ? 'w-full' : currentStep === 2 ? 'w-1/2' : 'w-0'
              }`}
            />
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center gap-1.5">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                currentStep === 3
                  ? 'border-2 border-[#2E5421] text-[#2E5421] bg-white'
                  : 'border border-[#E2E5E6] text-[#7B7E7B] bg-white'
              }`}
            >
              3
            </div>
            <span
              className={`text-[11px] font-semibold text-center ${
                currentStep === 3 ? 'text-[#2E5421]' : 'text-[#7B7E7B]'
              }`}
            >
              Assign Officer
            </span>
          </div>
        </div>

        {/* STEP 1: Set Campaign Boundaries */}
        {currentStep === 1 && (
          <div className="flex flex-col gap-4">
            {/* Field: Campaign Name */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="campaign-name" className="text-xs font-bold text-[#1C211B]">
                Campaign name <span className="text-[#C54A40]">*</span>
              </label>
              <input
                id="campaign-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={() => handleBlur('name')}
                placeholder="e.g., Green Canopy Initiative – Phase 1"
                className={`w-full p-3 rounded-lg bg-[#FAFCFE] border text-xs text-[#1C211B] placeholder-[#979A98] focus:outline-none focus:ring-1 ${
                  nameError
                    ? 'border-[#C54A40] focus:ring-[#C54A40]'
                    : 'border-[#E2E5E6] focus:border-[#2E5421] focus:ring-[#2E5421]'
                }`}
              />
              {nameError && <span className="text-xs text-[#C54A40] font-medium">{nameError}</span>}
            </div>

            {/* Field: Target Trees to Plant */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="target-trees" className="text-xs font-bold text-[#1C211B]">
                Target trees to plant <span className="text-[#C54A40]">*</span>
              </label>
              <input
                id="target-trees"
                type="number"
                value={targetTrees}
                onChange={(e) => setTargetTrees(e.target.value)}
                onBlur={() => handleBlur('targetTrees')}
                placeholder="e.g., 5,000"
                className={`w-full p-3 rounded-lg bg-[#FAFCFE] border text-xs text-[#1C211B] placeholder-[#979A98] focus:outline-none focus:ring-1 ${
                  targetTreesError
                    ? 'border-[#C54A40] focus:ring-[#C54A40]'
                    : 'border-[#E2E5E6] focus:border-[#2E5421] focus:ring-[#2E5421]'
                }`}
              />
              <span className="text-[11px] text-[#7B7E7B]">Used to track verification milestones</span>
              {targetTreesError && <span className="text-xs text-[#C54A40] font-medium">{targetTreesError}</span>}
            </div>

            {/* Field: Approved Tree Species */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-[#1C211B]">
                Approved tree species <span className="text-[#C54A40]">*</span>
              </label>
              <div className="flex flex-wrap gap-2 p-2.5 bg-[#FAFCFE] border border-[#E2E5E6] rounded-lg">
                {AVAILABLE_SPECIES.map((specie) => {
                  const isSelected = selectedSpecies.includes(specie);
                  return (
                    <button
                      key={specie}
                      type="button"
                      onClick={() => handleToggleSpecies(specie)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                        isSelected
                          ? 'bg-[#2E5421] text-white'
                          : 'bg-[#F4F6F8] text-[#5E625E] hover:bg-[#E5E8EB]'
                      }`}
                    >
                      {isSelected ? `✓ ${specie}` : `+ ${specie}`}
                    </button>
                  );
                })}
              </div>
              {speciesError && <span className="text-xs text-[#C54A40] font-medium">{speciesError}</span>}
            </div>

            {/* Fields: Start Date & End Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="start-date" className="text-xs font-bold text-[#1C211B]">
                  Start date <span className="text-[#C54A40]">*</span>
                </label>
                <div className="relative">
                  <input
                    id="start-date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    onBlur={() => handleBlur('startDate')}
                    className={`w-full p-3 rounded-lg bg-[#FAFCFE] border text-xs text-[#1C211B] focus:outline-none focus:ring-1 ${
                      startDateError
                        ? 'border-[#C54A40] focus:ring-[#C54A40]'
                        : 'border-[#E2E5E6] focus:border-[#2E5421] focus:ring-[#2E5421]'
                    }`}
                  />
                </div>
                <span className="text-[11px] text-[#7B7E7B]">Align with regional planting season</span>
                {startDateError && <span className="text-xs text-[#C54A40] font-medium">{startDateError}</span>}
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="end-date" className="text-xs font-bold text-[#1C211B]">
                  End date <span className="text-[#C54A40]">*</span>
                </label>
                <div className="relative">
                  <input
                    id="end-date"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    onBlur={() => handleBlur('endDate')}
                    className={`w-full p-3 rounded-lg bg-[#FAFCFE] border text-xs text-[#1C211B] focus:outline-none focus:ring-1 ${
                      endDateError
                        ? 'border-[#C54A40] focus:ring-[#C54A40]'
                        : 'border-[#E2E5E6] focus:border-[#2E5421] focus:ring-[#2E5421]'
                    }`}
                  />
                </div>
                {endDateError && <span className="text-xs text-[#C54A40] font-medium">{endDateError}</span>}
              </div>
            </div>

            {/* Reusable FormFooter for Step 1 */}
            <FormFooter
              submitLabel="Continue"
              onSubmit={handleStep1Continue}
              isSubmitDisabled={!isStep1Valid}
              submitDisabledReason="Fill all required fields to continue"
              cancelLabel="Cancel"
              onCancel={onClose}
            />
          </div>
        )}

        {/* STEP 2: Select Blocks */}
        {currentStep === 2 && (
          <div className="flex flex-col gap-4">
            <SearchFilterBar
              searchQuery={blockSearch}
              onSearchChange={setBlockSearch}
              searchPlaceholder="Search here"
            />

            <div className="flex flex-col gap-3 max-h-72 overflow-y-auto pr-1">
              {filteredBlocks.map((block) => {
                const isSelected = selectedBlockIds.includes(block.id);
                return (
                  <div
                    key={block.id}
                    className="flex items-center justify-between p-3.5 bg-white border border-[#E2E5E6] rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      {/* Polygon icon mockup */}
                      <div className="w-10 h-10 rounded-lg bg-[#F8F1E6] flex items-center justify-center border border-[#E6CDA9]">
                        <svg className="w-6 h-6 text-[#8C532B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <polygon points="12 2, 22 8, 18 21, 6 21, 2 8" strokeWidth={1.5} />
                        </svg>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-[#1C211B]">{block.name}</span>
                        <span className="text-[11px] text-[#7B7E7B]">
                          {block.state} <strong className="font-semibold text-[#1C211B]">{block.hectares}</strong> hectares
                        </span>
                      </div>
                    </div>

                    <div>
                      {block.isFilled ? (
                        <span className="px-4 py-1.5 rounded-lg bg-[#EEF0F2] text-[#7B7E7B] text-xs font-semibold">
                          Filled
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleToggleBlock(block.id)}
                          className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${
                            isSelected
                              ? 'bg-[#2E5421] text-white border-[#2E5421]'
                              : 'border-[#C97A3E] text-[#8C532B] hover:bg-[#FDF8F3]'
                          }`}
                        >
                          {isSelected ? '✓ Added' : '+ Add Block'}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Reusable FormFooter for Step 2 */}
            <FormFooter
              submitLabel="Continue"
              onSubmit={handleStep2Continue}
              cancelLabel="Skip"
              onCancel={handleStep2Continue}
            />
          </div>
        )}

        {/* STEP 3: Assign Officers */}
        {currentStep === 3 && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3 max-h-72 overflow-y-auto pr-1">
              {(selectedBlockIds.length > 0 ? selectedBlockIds : ['JGW-BLC-097']).map((blockId) => (
                <div
                  key={blockId}
                  className="flex flex-col gap-3 p-4 bg-white border border-[#E2E5E6] rounded-xl"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#2E5421]">
                      {name || 'Green Legacy Tree Planting Project II'}
                    </span>
                    <span className="text-[11px] text-[#7B7E7B] flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      654-321-GH-7890
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#F8F1E6] flex items-center justify-center border border-[#E6CDA9]">
                      <svg className="w-5 h-5 text-[#8C532B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <polygon points="12 2, 22 8, 18 21, 6 21, 2 8" strokeWidth={1.5} />
                      </svg>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-[#1C211B]">{blockId}</span>
                      <span className="text-[11px] text-[#7B7E7B]">Jigawa State 5.67443 hectares</span>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2 border-t border-[#EEF0F2]">
                    <button
                      type="button"
                      onClick={() => {
                        setAssignedOfficers((prev) => [
                          ...prev.filter((o) => o.blockId !== blockId),
                          { blockId, officerName: 'Marcus A. Lee' },
                        ]);
                      }}
                      className="text-xs font-bold text-[#2E5421] hover:underline flex items-center gap-1"
                    >
                      <span>
                        {assignedOfficers.some((o) => o.blockId === blockId)
                          ? `✓ Assigned (${assignedOfficers.find((o) => o.blockId === blockId)?.officerName})`
                          : '+ Assign Officer'}
                      </span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Submit Failure State with Retry Action (api-network-rules.md Rule 3 & 4) */}
            {submitError && (
              <div className="p-3 bg-[#FEEEED] border border-[#FAC4C0] rounded-xl flex items-center justify-between text-xs text-[#C54A40]">
                <span>{submitError}</span>
                <button
                  type="button"
                  onClick={handleFinalSubmit}
                  className="px-3 py-1 bg-[#C54A40] text-white rounded font-semibold text-xs hover:bg-[#A34137] transition-colors"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Reusable FormFooter for Step 3 */}
            <FormFooter
              submitLabel="Continue"
              onSubmit={handleFinalSubmit}
              isSubmitting={isSubmitting}
              cancelLabel="Skip"
              onCancel={handleFinalSubmit}
            />
          </div>
        )}
      </div>
    </ModalShell>
  );
};
