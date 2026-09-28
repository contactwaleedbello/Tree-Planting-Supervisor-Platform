/**
 * AddSpecieTypeModal.tsx
 *
 * Implements "Register Tree Specie" modal per:
 * - design/ui-reference/tree-reference-data/Frame 2147225636.png
 * - AGENTS.md section 4 (Add Specie Type on Supervisor side)
 * - gated-action-control & form-validation-rules.md
 */

import React, { useState, useEffect } from 'react';
import { ModalShell } from '../../../components/ModalShell';
import { FormFooter } from '../../../components/FormFooter';
import { AddSpecieTypeInput, TreeSpecieItem } from '../types/species';
import { registerTreeSpecie } from '../services/speciesPlaceholder';

interface AddSpecieTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newSpecie: TreeSpecieItem) => void;
}

export const AddSpecieTypeModal: React.FC<AddSpecieTypeModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [name, setName] = useState('');
  const [spacingStandard, setSpacingStandard] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setName('');
      setSpacingStandard('');
      setDescription('');
      setSelectedFileName(null);
      setTouched({});
      setServerError(null);
    }
  }, [isOpen]);

  const isNameValid = name.trim().length > 0;
  const isSpacingValid = spacingStandard.trim().length > 0;
  const isDescriptionValid = description.trim().length > 0;
  const isFormValid = isNameValid && isSpacingValid && isDescriptionValid;

  const nameError = touched.name && !isNameValid ? 'Specie name is required.' : null;
  const spacingError =
    touched.spacingStandard && !isSpacingValid ? 'Spacing standard is required (e.g. 3m x 3m).' : null;
  const descriptionError =
    touched.description && !isDescriptionValid ? 'Description is required.' : null;

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
        name: true,
        spacingStandard: true,
        description: true,
      });
      return;
    }

    setIsSubmitting(true);
    setServerError(null);

    try {
      const input: AddSpecieTypeInput = {
        name: name.trim(),
        spacingStandard: spacingStandard.trim(),
        description: description.trim(),
        imageFileName: selectedFileName || undefined,
      };

      const created = await registerTreeSpecie(input);
      onSuccess(created);
      onClose();
    } catch (err: any) {
      setServerError(err.message || 'Failed to register specie type.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ModalShell isOpen={isOpen} onClose={onClose} maxWidth="md">
      <div className="flex flex-col gap-5 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-[#1C211B]">Register Tree Specie</h2>
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Specie name */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="specie-name" className="text-xs font-bold text-[#1C211B]">
              Specie name
            </label>
            <input
              id="specie-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => handleBlur('name')}
              placeholder="e.g cashew"
              className={`w-full p-2.5 rounded-lg bg-[#FAFCFE] border text-xs text-[#1C211B] placeholder-[#979A98] focus:outline-none focus:ring-1 ${
                nameError
                  ? 'border-[#C54A40] focus:ring-[#C54A40]'
                  : 'border-[#E2E5E6] focus:border-[#2E5421] focus:ring-[#2E5421]'
              }`}
            />
            {nameError && <span className="text-xs text-[#C54A40] font-medium">{nameError}</span>}
          </div>

          {/* Spacing Standard */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="spacing-standard" className="text-xs font-bold text-[#1C211B]">
              Spacing Standard
            </label>
            <input
              id="spacing-standard"
              type="text"
              value={spacingStandard}
              onChange={(e) => setSpacingStandard(e.target.value)}
              onBlur={() => handleBlur('spacingStandard')}
              placeholder="e.g 3m x 3m"
              className={`w-full p-2.5 rounded-lg bg-[#FAFCFE] border text-xs text-[#1C211B] placeholder-[#979A98] focus:outline-none focus:ring-1 ${
                spacingError
                  ? 'border-[#C54A40] focus:ring-[#C54A40]'
                  : 'border-[#E2E5E6] focus:border-[#2E5421] focus:ring-[#2E5421]'
              }`}
            />
            {spacingError && (
              <span className="text-xs text-[#C54A40] font-medium">{spacingError}</span>
            )}
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="specie-description" className="text-xs font-bold text-[#1C211B]">
              Description
            </label>
            <textarea
              id="specie-description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={() => handleBlur('description')}
              placeholder="e.g., Ibrahim Musa, Phone: +234 800 000 0000"
              className={`w-full p-2.5 rounded-lg bg-[#FAFCFE] border text-xs text-[#1C211B] placeholder-[#979A98] focus:outline-none focus:ring-1 resize-none ${
                descriptionError
                  ? 'border-[#C54A40] focus:ring-[#C54A40]'
                  : 'border-[#E2E5E6] focus:border-[#2E5421] focus:ring-[#2E5421]'
              }`}
            />
            {descriptionError && (
              <span className="text-xs text-[#C54A40] font-medium">{descriptionError}</span>
            )}
          </div>

          {/* Add Images */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#1C211B]">Add Images</label>
            <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-[#E2E5E6] hover:border-[#2E5421] rounded-xl bg-[#FAFCFE] cursor-pointer transition-colors text-center">
              <svg className="w-8 h-8 text-[#7B7E7B] mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
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
            submitLabel="Register tree"
            onSubmit={() => handleSubmit()}
            isSubmitDisabled={!isFormValid}
            submitDisabledReason="Fill required fields to register tree"
            isSubmitting={isSubmitting}
            cancelLabel="Cancel"
            onCancel={onClose}
          />
        </form>
      </div>
    </ModalShell>
  );
};
