/**
 * types/report.ts
 *
 * Types for FR-12: Block-level reports.
 * References:
 * - AGENTS.md section 8 (FR-12 flow)
 * - state-mapping-rules.md (M1 and M1b report formulas)
 * - design/ui-reference/FR-10-review-queue/Reports Overview.png
 */

import { RecordState } from '../../../types/states';

export interface ReportsStats {
  totalReports: number;
  needsReviewReports: number;
  verifiedReports: number;
  rejectedReports: number;
}

/**
 * Block coverage data implementing M1 and M1b formulas from state-mapping-rules.md:
 * - M1 (Verified check coverage): verified trees with a check inside monitoring window / expected tree count
 * - M1b (Registration coverage): registered trees / expected tree count
 * Reports count only Verified records in every figure shown.
 * A block with no verified records shows zero values, not blank panels.
 */
export interface BlockCoverageMetric {
  blockId: string;
  blockName: string;
  expectedTreeCount: number;
  verifiedCheckCount: number;
  registeredTreeCount: number;
  m1VerifiedCheckCoveragePercent: number;
  m1bRegistrationCoveragePercent: number;
}

export type ReportType = 'Validation' | 'Growth check' | 'Registration';
export type ReportStatus = RecordState;

export interface ReportItem {
  id: string;
  reporter: {
    name: string;
    phone: string;
    email: string;
    zone: string;
  };
  campaign: string;
  location: string;
  submissionDate: string;
  reportType: ReportType;
  status: ReportStatus;
}
