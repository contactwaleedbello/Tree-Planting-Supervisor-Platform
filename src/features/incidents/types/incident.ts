/**
 * types/incident.ts
 *
 * Types for FR-11: Incident Review & Escalation.
 * References:
 * - AGENTS.md section 8 (FR-11 flow)
 * - state-mapping-rules.md (IncidentState)
 */

import { IncidentRecordData } from '../components/IncidentReview';

export type {
  IncidentRecordData,
  SoilConditionData,
  PhysicalConditionData,
} from '../components/IncidentReview';
