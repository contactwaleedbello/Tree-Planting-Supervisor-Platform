/**
 * RegisterFarmBlocksModal.tsx
 *
 * Implements "Register Farm & Tree Blocks" per:
 * - design/ui-reference/Dashboard Flow/Frame 37.png
 * - design/ui-reference/COVERAGE.md ("farm-onboarding.png, Onboard partner farms: organisation, farm manager, location, tree allocation by species and block")
 * - form-validation-rules.md (Required fields validated before submission, clear inline errors)
 */

import React, { useState, useMemo } from 'react';
import { ModalShell } from '../../../components/ModalShell';

export interface FarmBlockItem {
  id: string;
  species: string;
  blockName: string;
  treeCount: number;
}

export interface RegisterFarmBlocksModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (summary: { organisationName: string; totalTrees: number; blockCount: number }) => void;
}

const DEFAULT_SPECIES_OPTIONS = [
  'Mango',
  'Guava',
  'Cashew',
  'Neem',
  'Mahogany',
  'Teak',
  'Moringa',
  'Acacia',
];

const INITIAL_BLOCKS: FarmBlockItem[] = [
  { id: 'b-1', species: 'Mango', blockName: 'Mango Plot North', treeCount: 100 },
  { id: 'b-2', species: 'Guava', blockName: 'Guava Sector West', treeCount: 50 },
  { id: 'b-3', species: 'Cashew', blockName: 'Cashew Zone Central', treeCount: 50 },
];

export const RegisterFarmBlocksModal: React.FC<RegisterFarmBlocksModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [organisationName, setOrganisationName] = useState('Bello Agro Farm');
  const [farmManager, setFarmManager] = useState('Ibrahim Musa, Phone: +234 800 000 0000');
  const [farmLocation, setFarmLocation] = useState('Kuje Sector Catchment Zone');
  const [blocks, setBlocks] = useState<FarmBlockItem[]>(INITIAL_BLOCKS);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Auto-calculated total allocation
  const totalAllocation = useMemo(() => {
    return blocks.reduce((sum, b) => sum + (Number(b.treeCount) || 0), 0);
  }, [blocks]);

  // Breakdown summary string for species
  const breakdownSummary = useMemo(() => {
    const countsBySpecies: Record<string, number> = {};
    for (const b of blocks) {
      if (!b.species) continue;
      countsBySpecies[b.species] = (countsBySpecies[b.species] || 0) + (Number(b.treeCount) || 0);
    }
    return Object.entries(countsBySpecies)
      .map(([specie, count]) => `${count} ${specie}`)
      .join(', ');
  }, [blocks]);

  if (!isOpen) return null;

  const handleAddBlock = () => {
    const nextNum = blocks.length + 1;
    setBlocks((prev) => [
      ...prev,
      {
        id: `b-${Date.now()}-${nextNum}`,
        species: DEFAULT_SPECIES_OPTIONS[0],
        blockName: `Block ${nextNum}`,
        treeCount: 50,
      },
    ]);
  };

  const handleRemoveBlock = (id: string) => {
    if (blocks.length <= 1) return;
    setBlocks((prev) => prev.filter((b) => b.id !== id));
  };

  const handleUpdateBlock = (id: string, updates: Partial<FarmBlockItem>) => {
    setBlocks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updates } : b))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!organisationName.trim()) {
      setErrorMessage('Organisation name is required.');
      return;
    }
    if (!farmManager.trim()) {
      setErrorMessage('Farm manager / POC is required.');
      return;
    }
    if (!farmLocation.trim()) {
      setErrorMessage('Farm location / boundary area is required.');
      return;
    }
    if (blocks.length === 0 || totalAllocation === 0) {
      setErrorMessage('At least one block with a valid tree count is required.');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      // Simulate placeholder network call
      await new Promise((resolve) => setTimeout(resolve, 350));
      setIsSubmitting(false);

      if (onSuccess) {
        onSuccess({
          organisationName,
          totalTrees: totalAllocation,
          blockCount: blocks.length,
        });
      }
      onClose();
    } catch {
      setIsSubmitting(false);
      setErrorMessage('Failed to register farm and blocks. Try again.');
    }
  };

  return (
    <ModalShell isOpen={isOpen} onClose={onClose} maxWidth="2xl">
      <div className="p-6 sm:p-7">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-2">
          <div>
            <h3 className="text-lg font-bold text-[#1C211B] leading-tight">
              Register Farm & Tree Blocks
            </h3>
            <p className="text-xs text-[#5E625E] mt-1 leading-relaxed">
              Onboard partner farms and allocate their tree quotas into organized, species-based blocks for easy tracking.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#FCE8E6] text-[#C54A40] hover:bg-[#FCD4D0] flex items-center justify-center shrink-0 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {errorMessage && (
          <div className="my-3 p-3 bg-[#FEEEED] border border-[#C54A40] rounded-xl text-xs text-[#C54A40] flex items-center justify-between">
            <span>{errorMessage}</span>
            <button
              type="button"
              onClick={() => setErrorMessage(null)}
              className="text-[#C54A40] font-bold hover:underline"
            >
              Dismiss
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
          {/* Organisation name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#1C211B]">
              Organisation name
            </label>
            <input
              type="text"
              value={organisationName}
              onChange={(e) => setOrganisationName(e.target.value)}
              placeholder="Green Valley Agro-Forestry / Alhaji Bello Farm"
              className="w-full px-3.5 py-2.5 bg-white border border-[#CBCDCE] rounded-xl text-xs text-[#1C211B] placeholder-[#979A98] focus:outline-none focus:border-[#3C7429] focus:ring-1 focus:ring-[#3C7429] transition-colors"
            />
          </div>

          {/* Farm manager / POC */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#1C211B]">
              Farm manager / POC
            </label>
            <input
              type="text"
              value={farmManager}
              onChange={(e) => setFarmManager(e.target.value)}
              placeholder="e.g., Ibrahim Musa, Phone: +234 800 000 0000"
              className="w-full px-3.5 py-2.5 bg-white border border-[#CBCDCE] rounded-xl text-xs text-[#1C211B] placeholder-[#979A98] focus:outline-none focus:border-[#3C7429] focus:ring-1 focus:ring-[#3C7429] transition-colors"
            />
          </div>

          {/* Farm location / boundary area */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#1C211B]">
              Farm location / boundary area
            </label>
            <div className="relative">
              <input
                type="text"
                value={farmLocation}
                onChange={(e) => setFarmLocation(e.target.value)}
                placeholder="Select community, ward, or GPS coordinate center"
                className="w-full px-3.5 py-2.5 bg-white border border-[#CBCDCE] rounded-xl text-xs text-[#1C211B] placeholder-[#979A98] focus:outline-none focus:border-[#3C7429] focus:ring-1 focus:ring-[#3C7429] transition-colors pr-9"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-[#7B7E7B]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Total tree allocation */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-[#1C211B]">
              Total tree allocation
            </label>
            <input
              type="text"
              readOnly
              value={totalAllocation}
              className="w-full px-3.5 py-2.5 bg-[#EEF0F2] border border-[#CBCDCE] rounded-xl text-xs text-[#1C211B] font-semibold cursor-not-allowed"
            />
            <span className="text-[11px] text-[#7B7E7B]">
              Auto-calculates from species blocks
            </span>
          </div>

          {/* Blocks Section */}
          <div className="flex flex-col gap-2 pt-2">
            <h4 className="text-xs font-bold text-[#1C211B] tracking-tight">
              Blocks
            </h4>

            {/* Header row labels */}
            <div className="grid grid-cols-12 gap-3 text-[11px] font-semibold text-[#5E625E] px-1">
              <span className="col-span-4">Species</span>
              <span className="col-span-5">Block name</span>
              <span className="col-span-3">Tree count</span>
            </div>

            {/* Block rows */}
            <div className="flex flex-col gap-2.5">
              {blocks.map((block) => (
                <div key={block.id} className="grid grid-cols-12 gap-3 items-center">
                  {/* Species select */}
                  <div className="col-span-4 relative">
                    <select
                      value={block.species}
                      onChange={(e) => handleUpdateBlock(block.id, { species: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-[#CBCDCE] rounded-xl text-xs text-[#1C211B] focus:outline-none focus:border-[#3C7429] appearance-none pr-8 cursor-pointer"
                    >
                      {DEFAULT_SPECIES_OPTIONS.map((sp) => (
                        <option key={sp} value={sp}>
                          e.g., {sp}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-[#7B7E7B]">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>

                  {/* Block name input */}
                  <div className="col-span-5">
                    <input
                      type="text"
                      value={block.blockName}
                      onChange={(e) => handleUpdateBlock(block.id, { blockName: e.target.value })}
                      placeholder="e.g., Mango Plot North"
                      className="w-full px-3 py-2 bg-white border border-[#CBCDCE] rounded-xl text-xs text-[#1C211B] focus:outline-none focus:border-[#3C7429]"
                    />
                  </div>

                  {/* Tree count input & remove button */}
                  <div className="col-span-3 flex items-center gap-1.5">
                    <input
                      type="number"
                      min="1"
                      value={block.treeCount}
                      onChange={(e) =>
                        handleUpdateBlock(block.id, { treeCount: Math.max(0, parseInt(e.target.value, 10) || 0) })
                      }
                      className="w-full px-3 py-2 bg-white border border-[#CBCDCE] rounded-xl text-xs text-[#1C211B] focus:outline-none focus:border-[#3C7429]"
                    />
                    {blocks.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveBlock(block.id)}
                        className="p-1.5 text-[#C54A40] hover:bg-[#FEEEED] rounded-lg transition-colors cursor-pointer shrink-0"
                        title="Remove block"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* + Add block button */}
            <div className="pt-1">
              <button
                type="button"
                onClick={handleAddBlock}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 border border-[#C97A3E] text-[#8C532B] hover:bg-[#FDF8F3] rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Add block</span>
              </button>
            </div>
          </div>

          {/* Calculation summary banner */}
          <div className="mt-2 p-3 bg-[#F5F7F8] border border-[#E2E5E6] rounded-xl text-[11px] text-[#555] flex flex-wrap items-center gap-1 leading-normal">
            <span>Target:</span>
            <strong className="text-[#1C211B] font-bold">{totalAllocation} trees</strong>
            <span className="mx-1 text-[#CBCDCE]">|</span>
            <span>Configured:</span>
            <strong className="text-[#1C211B] font-bold">
              {blocks.length} blocks ({breakdownSummary || '0 trees'})
            </strong>
            <span className="mx-1 text-[#CBCDCE]">|</span>
            <span>Unassigned:</span>
            <strong className="text-[#1C211B] font-bold">0</strong>
          </div>

          {/* Form action button */}
          <div className="flex justify-end pt-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-[#2E5421] text-white hover:bg-[#23421A] rounded-xl text-xs font-bold transition-all shadow-sm focus:outline-none disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? 'Registering...' : 'Register farm & blocks'}
            </button>
          </div>
        </form>
      </div>
    </ModalShell>
  );
};
