/**
 * assignmentPlaceholder.ts
 *
 * Implements api-network-rules.md for FR-09 Assignment:
 * - Scoped placeholder functions for mappable blocks and active field officers.
 * - Handles loading, result, and failure states.
 * - Filters officers to active-only per helper text "Only active officers in this ward are listed".
 * - Blocks assignment of Unsafe blocks per state-mapping-rules.md and form-validation-rules.md.
 */

import { MappableBlockItem, ActiveOfficerOption, CreateAssignmentInput } from '../types/assignment';

const INITIAL_BLOCKS: MappableBlockItem[] = [
  {
    id: 'JGW-BLC-097',
    name: 'JGW-BLC-097',
    safety: 'Safe',
    blockState: 'Active',
    location: 'Mariri Ward, Jigawa State',
    spacingStandard: '3m x 3m',
    expectedTreeCount: 1500,
    currentAssignment: {
      officerId: 'fo-1',
      officerName: 'Waleed Aliyu',
      startDate: '2026-09-01',
      endDate: '2026-11-30',
      status: 'Active',
    },
  },
  {
    id: 'JGW-BLC-098',
    name: 'JGW-BLC-098',
    safety: 'Safe',
    blockState: 'Mapped',
    location: 'Gaya Ward, Kano State',
    spacingStandard: '4m x 4m',
    expectedTreeCount: 2200,
    currentAssignment: null,
  },
  {
    id: 'JGW-BLC-099',
    name: 'JGW-BLC-099',
    safety: 'Unsafe',
    blockState: 'Active',
    location: 'Dutse Central, Jigawa State',
    spacingStandard: '3m x 3m',
    expectedTreeCount: 950,
    currentAssignment: null,
  },
  {
    id: 'JGW-BLC-100',
    name: 'JGW-BLC-100',
    safety: 'Safe',
    blockState: 'Mapped',
    location: 'Hadejia South, Jigawa State',
    spacingStandard: '5m x 5m',
    expectedTreeCount: 1800,
    currentAssignment: null,
  },
];

const INITIAL_OFFICERS: ActiveOfficerOption[] = [
  {
    id: 'fo-1',
    name: 'Waleed Aliyu',
    ward: 'Mariri Ward',
    userState: 'Active',
  },
  {
    id: 'fo-2',
    name: 'Marcus A. Lee',
    ward: 'Mariri Ward',
    userState: 'Active',
  },
  {
    id: 'fo-3',
    name: 'Amina Yusuf',
    ward: 'Mariri Ward',
    userState: 'Active',
  },
  {
    id: 'fo-4',
    name: 'Bello Danbatta',
    ward: 'Mariri Ward',
    userState: 'Deactivated', // Excluded: account deactivated
  },
  {
    id: 'fo-5',
    name: 'Zainab Kabir',
    ward: 'Mariri Ward',
    userState: 'Pending', // Excluded: onboarding pending verification
  },
  {
    id: 'fo-6',
    name: 'Ibrahim Sani',
    ward: 'Mariri Ward',
    userState: 'Suspended', // Excluded: account suspended pending review
  },
];

export async function fetchMappableBlocks(shouldFail: boolean = false): Promise<MappableBlockItem[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  if (shouldFail) {
    throw new Error('Failed to load blocks for assignment. Please try again.');
  }
  return [...INITIAL_BLOCKS];
}

/**
 * Returns only Active officers for the picker.
 * Excludes Deactivated officers entirely per assign-form-active-officers-only.png.
 */
export async function fetchActiveOfficers(): Promise<ActiveOfficerOption[]> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return INITIAL_OFFICERS.filter((o) => o.userState === 'Active');
}

export async function createBlockAssignment(
  input: CreateAssignmentInput
): Promise<MappableBlockItem> {
  await new Promise((resolve) => setTimeout(resolve, 400));

  const block = INITIAL_BLOCKS.find((b) => b.id === input.blockId);
  if (!block) {
    throw new Error('Selected block does not exist.');
  }

  if (block.safety === 'Unsafe') {
    throw new Error('This block is flagged unsafe and cannot be assigned.');
  }

  const officer = INITIAL_OFFICERS.find((o) => o.id === input.officerId);
  if (!officer) {
    throw new Error('Selected officer does not exist.');
  }

  block.currentAssignment = {
    officerId: officer.id,
    officerName: officer.name,
    startDate: input.startDate,
    endDate: input.endDate,
    status: 'Active',
  };

  return { ...block };
}
