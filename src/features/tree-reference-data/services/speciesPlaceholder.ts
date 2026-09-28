/**
 * speciesPlaceholder.ts
 *
 * Implements api-network-rules.md for Tree Reference Data:
 * - Scoped placeholder functions for fetching species reference list and registering new specie type.
 * - Handles loading, result, and failure states.
 * - No hardcoded API endpoints or environment variables.
 */

import { TreeSpecieItem, AddSpecieTypeInput } from '../types/species';

const INITIAL_SPECIES: TreeSpecieItem[] = [
  {
    id: 'sp-1',
    name: 'Cashew',
    spacingStandard: '3m x 3m',
    description: 'High drought tolerance, suitable for arid boundary blocks.',
    createdAt: '2026-08-15',
  },
  {
    id: 'sp-2',
    name: 'Neem',
    spacingStandard: '4m x 4m',
    description: 'Pest-resistant fast growing evergreen shade tree.',
    createdAt: '2026-08-18',
  },
  {
    id: 'sp-3',
    name: 'Mahogany',
    spacingStandard: '5m x 5m',
    description: 'Long-term timber species requiring stable soil depth.',
    createdAt: '2026-08-20',
  },
];

export async function fetchTreeSpecies(shouldFail: boolean = false): Promise<TreeSpecieItem[]> {
  await new Promise((resolve) => setTimeout(resolve, 250));
  if (shouldFail) {
    throw new Error('Failed to load tree species reference data.');
  }
  return [...INITIAL_SPECIES];
}

export async function registerTreeSpecie(input: AddSpecieTypeInput): Promise<TreeSpecieItem> {
  await new Promise((resolve) => setTimeout(resolve, 350));

  const newSpecie: TreeSpecieItem = {
    id: `sp-${Date.now()}`,
    name: input.name.trim(),
    spacingStandard: input.spacingStandard.trim(),
    description: input.description.trim(),
    imageFileName: input.imageFileName,
    createdAt: new Date().toISOString().split('T')[0],
  };

  INITIAL_SPECIES.push(newSpecie);
  return newSpecie;
}
