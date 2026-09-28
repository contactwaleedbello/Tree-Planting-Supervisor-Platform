/**
 * reportPlaceholder.ts
 *
 * Implements api-network-rules.md for FR-12 Block-level reports:
 * - Scoped placeholder functions for reports stats, block coverage (M1 & M1b), and report items.
 * - Enforces state-mapping-rules.md:
 *   - M1: Verified check coverage = verified trees with check / expected tree count
 *   - M1b: Registration coverage = registered trees / expected tree count
 *   - Reports count ONLY Verified records in every figure shown.
 *   - A block with no verified records shows zero values, not blank panels.
 */

import {
  ReportsStats,
  BlockCoverageMetric,
  ReportItem,
} from '../types/report';

const INITIAL_STATS: ReportsStats = {
  totalReports: 6,
  needsReviewReports: 2,
  verifiedReports: 1,
  rejectedReports: 3,
};

const INITIAL_BLOCK_COVERAGE: BlockCoverageMetric[] = [
  {
    blockId: 'JGW-BLC-097',
    blockName: 'JGW-BLC-097 (Mariri Ward)',
    expectedTreeCount: 1500,
    verifiedCheckCount: 1200,
    registeredTreeCount: 1450,
    // M1 = (1200 / 1500) * 100 = 80.0%
    m1VerifiedCheckCoveragePercent: 80.0,
    // M1b = (1450 / 1500) * 100 = 96.6%
    m1bRegistrationCoveragePercent: 96.6,
  },
  {
    blockId: 'JGW-BLC-098',
    blockName: 'JGW-BLC-098 (Gaya Ward)',
    expectedTreeCount: 2000,
    verifiedCheckCount: 1650,
    registeredTreeCount: 1900,
    // M1 = (1650 / 2000) * 100 = 82.5%
    m1VerifiedCheckCoveragePercent: 82.5,
    // M1b = (1900 / 2000) * 100 = 95.0%
    m1bRegistrationCoveragePercent: 95.0,
  },
  {
    blockId: 'JGW-BLC-100',
    blockName: 'JGW-BLC-100 (Hadejia South)',
    expectedTreeCount: 1800,
    verifiedCheckCount: 0,
    registeredTreeCount: 0,
    // Zero-value rule: A block with no verified records shows zero values, not blank panels
    m1VerifiedCheckCoveragePercent: 0.0,
    m1bRegistrationCoveragePercent: 0.0,
  },
];

const INITIAL_REPORTS: ReportItem[] = [
  {
    id: 'rep-1',
    reporter: {
      name: 'Waleed Aliyu',
      phone: '+234 803 123 4567',
      email: 'abc@gmail.com',
      zone: 'Mariri Ward',
    },
    campaign: 'Ocean Depth Project',
    location: 'Layin wanke wanke street',
    submissionDate: 'January 2, 2025',
    reportType: 'Validation',
    status: 'Needs Review',
  },
  {
    id: 'rep-2',
    reporter: {
      name: 'Waleed Aliyu',
      phone: '+234 803 123 4567',
      email: 'abc@gmail.com',
      zone: 'Mariri Ward',
    },
    campaign: 'Ocean Depth Project',
    location: 'Layin wanke wanke street',
    submissionDate: 'January 2, 2025',
    reportType: 'Growth check',
    status: 'Needs Review',
  },
  {
    id: 'rep-3',
    reporter: {
      name: 'Waleed Aliyu',
      phone: '+234 803 123 4567',
      email: 'abc@gmail.com',
      zone: 'Mariri Ward',
    },
    campaign: 'Ocean Depth Project',
    location: 'Layin wanke wanke street',
    submissionDate: 'January 2, 2025',
    reportType: 'Validation',
    status: 'Rejected',
  },
  {
    id: 'rep-4',
    reporter: {
      name: 'Waleed Aliyu',
      phone: '+234 803 123 4567',
      email: 'abc@gmail.com',
      zone: 'Mariri Ward',
    },
    campaign: 'Ocean Depth Project',
    location: 'Layin wanke wanke street',
    submissionDate: 'January 2, 2025',
    reportType: 'Growth check',
    status: 'Rejected',
  },
  {
    id: 'rep-5',
    reporter: {
      name: 'Waleed Aliyu',
      phone: '+234 803 123 4567',
      email: 'abc@gmail.com',
      zone: 'Mariri Ward',
    },
    campaign: 'Ocean Depth Project',
    location: 'Layin wanke wanke street',
    submissionDate: 'January 2, 2025',
    reportType: 'Validation',
    status: 'Rejected',
  },
  {
    id: 'rep-6',
    reporter: {
      name: 'Waleed Aliyu',
      phone: '+234 803 123 4567',
      email: 'abc@gmail.com',
      zone: 'Mariri Ward',
    },
    campaign: 'Ocean Depth Project',
    location: 'Layin wanke wanke street',
    submissionDate: 'January 2, 2025',
    reportType: 'Growth check',
    status: 'Verified',
  },
];

export interface FetchReportsDataResult {
  stats: ReportsStats;
  blockCoverage: BlockCoverageMetric[];
  reports: ReportItem[];
}

export async function fetchReportsData(
  shouldFail: boolean = false
): Promise<FetchReportsDataResult> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  if (shouldFail) {
    throw new Error('Failed to load reports data. Please try again.');
  }
  return {
    stats: { ...INITIAL_STATS },
    blockCoverage: [...INITIAL_BLOCK_COVERAGE],
    reports: [...INITIAL_REPORTS],
  };
}
