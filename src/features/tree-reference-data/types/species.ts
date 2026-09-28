/**
 * types/species.ts
 *
 * Types for Tree Reference Data (Register / Add Specie Type)
 * Reference: design/ui-reference/tree-reference-data/Frame 2147225636.png
 */

export interface TreeSpecieItem {
  id: string;
  name: string;
  spacingStandard: string;
  description: string;
  imageFileName?: string;
  createdAt: string;
}

export interface AddSpecieTypeInput {
  name: string;
  spacingStandard: string;
  description: string;
  imageFileName?: string;
}
