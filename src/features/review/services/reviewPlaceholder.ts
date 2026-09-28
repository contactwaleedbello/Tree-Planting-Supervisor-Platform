/**
 * reviewPlaceholder.ts
 *
 * Implements api-network-rules.md for FR-10 Review Queue:
 * - Scoped placeholder functions for review records.
 * - Handles loading, result, and failure states.
 * - Approves to 'Verified' and rejects to 'Rejected' (with mandatory reason).
 */

import { GrowthCheckRecord } from '../types/review';

const INITIAL_QUEUE_RECORDS: GrowthCheckRecord[] = [
  {
    id: 'gc-001',
    treeId: 'Maize/b23/Alph/00045',
    systemTreeNumber: '7890',
    blockId: 'JGW-BLC-097',
    species: 'Mouringa',
    extensionOfficerName: 'Waleed Aliyu',
    submittedAt: 'Today 10:25 PM',
    coordinates: { lat: 23.4556, lng: 23.4556 },
    accessibility: 'Accessible',
    photos: [
      {
        id: 'gc-photo-1',
        signedUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
        altText: 'Canopy and foliage condition',
      },
      {
        id: 'gc-photo-2',
        signedUrl: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=400&q=80',
        altText: 'Main stem and bark structure',
      },
      {
        id: 'gc-photo-3',
        signedUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=400&q=80',
        altText: 'Surrounding ground and soil',
      },
      {
        id: 'gc-photo-4',
        signedUrl: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=400&q=80',
        altText: 'Wide-angle block context',
      },
    ],
    additionalComments:
      'An active forest fire creates an extremely dangerous and non-permissible zone of inaccessibility.',
    soilCondition: {
      soilFertility: '9 Kg',
      moistureContent: '9 %',
      phValue: '9',
      temperature: '29 oC',
      sunlight: '259 lux',
      humidity: '29 %',
    },
    physicalCondition: {
      brokenBranch: 'Yes',
      damagedBark: 'NO',
      bentStem: 'NO',
      rootsExposure: 'NO',
    },
    state: 'Needs Review',
  },
  {
    id: 'gc-002',
    treeId: 'Maize/b23/Alph/00046',
    systemTreeNumber: '7891',
    blockId: 'JGW-BLC-097',
    species: 'Neem',
    extensionOfficerName: 'Marcus A. Lee',
    submittedAt: 'Yesterday 04:15 PM',
    coordinates: { lat: 23.4571, lng: 23.4582 },
    accessibility: 'Accessible',
    photos: [
      {
        id: 'gc-photo-5',
        signedUrl: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=800&q=80',
        altText: 'Upper branch formation',
      },
      {
        id: 'gc-photo-6',
        signedUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=400&q=80',
        altText: 'Base stem and root zone',
      },
    ],
    additionalComments: 'Healthy foliage, excellent branch development.',
    soilCondition: {
      soilFertility: '12 Kg',
      moistureContent: '14 %',
      phValue: '6.8',
      temperature: '26 oC',
      sunlight: '310 lux',
      humidity: '35 %',
    },
    physicalCondition: {
      brokenBranch: 'NO',
      damagedBark: 'NO',
      bentStem: 'NO',
      rootsExposure: 'NO',
    },
    state: 'Needs Review',
  },
];

export async function fetchReviewQueue(
  shouldFail: boolean = false
): Promise<GrowthCheckRecord[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  if (shouldFail) {
    throw new Error('Failed to load review queue. Please try again.');
  }
  return [...INITIAL_QUEUE_RECORDS];
}

export async function approveGrowthCheck(recordId: string): Promise<GrowthCheckRecord> {
  await new Promise((resolve) => setTimeout(resolve, 400));
  const record = INITIAL_QUEUE_RECORDS.find((r) => r.id === recordId);
  if (!record) {
    throw new Error('Record not found.');
  }
  record.state = 'Verified';
  record.decidedAt = new Date().toISOString();
  record.decidedBy = 'Supervisor';
  return { ...record };
}

export async function rejectGrowthCheck(
  recordId: string,
  reason: string
): Promise<GrowthCheckRecord> {
  await new Promise((resolve) => setTimeout(resolve, 400));
  if (!reason.trim()) {
    throw new Error('Add a reason so the officer can fix it.');
  }
  const record = INITIAL_QUEUE_RECORDS.find((r) => r.id === recordId);
  if (!record) {
    throw new Error('Record not found.');
  }
  record.state = 'Rejected';
  record.rejectionReason = reason.trim();
  record.decidedAt = new Date().toISOString();
  record.decidedBy = 'Supervisor';
  return { ...record };
}
