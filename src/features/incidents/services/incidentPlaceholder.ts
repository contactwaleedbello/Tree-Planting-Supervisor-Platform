/**
 * incidentPlaceholder.ts
 *
 * Implements api-network-rules.md for FR-11 Incident Review:
 * - Scoped placeholder functions for incident queue records.
 * - Handles loading, result, and failure states.
 * - Moves between locked states: NeedsReview, ReplacementApproved, ReplacementRejected, Escalated.
 */

import { IncidentRecordData } from '../components/IncidentReview';

const INITIAL_INCIDENTS: IncidentRecordData[] = [
  {
    id: 'Maize/b23/Alph/00045',
    incidentNumber: 'INC-2026-0891',
    treeId: '7890',
    species: 'Mouringa',
    category: 'Damaged/Destroyed',
    accessibility: 'Accessible',
    status: 'NeedsReview',
    coordinates: { lat: 23.4556, lng: 23.4556 },
    timestamp: 'Today 10:25 PM',
    reporterName: 'Waleed Aliyu',
    blockName: 'JGW-BLC-097',
    reasons:
      'An active forest fire creates an extremely dangerous and non-permissible zone of inaccessibility.',
    photos: [
      {
        id: 'inc-photo-1',
        signedUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
        altText: 'Damaged trunk',
      },
      {
        id: 'inc-photo-2',
        signedUrl: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=400&q=80',
        altText: 'Branch breakage',
      },
    ],
    soilCondition: {
      soilFertilityKg: '9 Kg',
      moistureContentPercent: '9 %',
      phValue: '9',
      temperatureCelsius: '29 oC',
      sunlightLux: '259 lux',
      humidityPercent: '29 %',
    },
    physicalCondition: {
      brokenBranch: true,
      damagedBark: false,
      bentStem: false,
      rootsExposure: false,
    },
  },
  {
    id: 'Maize/b23/Alph/00048',
    incidentNumber: 'INC-2026-0892',
    treeId: '7893',
    species: 'Neem',
    category: 'Damaged/Destroyed',
    accessibility: 'Accessible',
    status: 'NeedsReview',
    coordinates: { lat: 23.457, lng: 23.458 },
    timestamp: 'Yesterday 02:10 PM',
    reporterName: 'Marcus A. Lee',
    blockName: 'JGW-BLC-097',
    reasons: 'Severe pest infestation caused hollowed trunk and limb loss.',
    photos: [
      {
        id: 'inc-photo-3',
        signedUrl: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=800&q=80',
        altText: 'Bark infestation',
      },
    ],
    soilCondition: {
      soilFertilityKg: '11 Kg',
      moistureContentPercent: '12 %',
      phValue: '7',
      temperatureCelsius: '28 oC',
      sunlightLux: '300 lux',
      humidityPercent: '30 %',
    },
    physicalCondition: {
      brokenBranch: false,
      damagedBark: true,
      bentStem: true,
      rootsExposure: false,
    },
  },
];

export async function fetchIncidentQueue(
  shouldFail: boolean = false
): Promise<IncidentRecordData[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  if (shouldFail) {
    throw new Error('Failed to load incident review queue.');
  }
  return [...INITIAL_INCIDENTS];
}

export async function approveIncident(id: string): Promise<IncidentRecordData> {
  await new Promise((resolve) => setTimeout(resolve, 350));
  const record = INITIAL_INCIDENTS.find((i) => i.id === id);
  if (!record) throw new Error('Incident not found.');
  record.status = 'ReplacementApproved';
  record.decidedAt = new Date().toISOString();
  record.decidedBy = 'Supervisor';
  return { ...record };
}

export async function rejectIncident(
  id: string,
  reason: string
): Promise<IncidentRecordData> {
  await new Promise((resolve) => setTimeout(resolve, 350));
  const record = INITIAL_INCIDENTS.find((i) => i.id === id);
  if (!record) throw new Error('Incident not found.');
  record.status = 'ReplacementRejected';
  record.rejectionReason = reason;
  record.decidedAt = new Date().toISOString();
  record.decidedBy = 'Supervisor';
  return { ...record };
}

export async function escalateIncident(id: string): Promise<IncidentRecordData> {
  await new Promise((resolve) => setTimeout(resolve, 350));
  const record = INITIAL_INCIDENTS.find((i) => i.id === id);
  if (!record) throw new Error('Incident not found.');
  record.status = 'Escalated';
  record.escalatedAt = new Date().toISOString();
  record.escalatedBy = 'Supervisor';
  return { ...record };
}
