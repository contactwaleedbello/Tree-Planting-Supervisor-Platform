/**
 * teamPlaceholder.ts
 *
 * Implements api-network-rules.md for Team Management:
 * - Scoped placeholder functions for Field Officers and Custodians.
 * - Handles loading, result, and failure states.
 * - Simulates duplicate-email check for Add Officer form.
 *
 * Scoping Note (auth-access-rules.md):
 * Returns officers and custodians scoped to the Supervisor's jurisdiction/campaigns.
 */

import {
  FieldOfficerStats,
  FieldOfficerItem,
  CustodianStats,
  CustodianItem,
  AddOfficerInput,
  PersonMarker,
} from '../types/team';

const INITIAL_OFFICER_STATS: FieldOfficerStats = {
  totalUsers: 5,
  activeUsers: 2,
  suspendedUsers: 1,
  usersOnline: 2,
};

const INITIAL_OFFICERS: FieldOfficerItem[] = [
  {
    id: 'fo-1',
    name: 'Waleed Aliyu',
    phone: '+234 803 123 4567',
    email: 'abc@gmail.com',
    zone: 'Mariri Ward',
    status: 'Online',
    userState: 'Active',
    presenceStatus: 'Online',
    assignedBlockId: 'JGW-BLC-097',
    assignedBlockName: 'Kano Central Block',
    assignedSubBlockName: 'North Sub-Block',
    assignedCoordinate: { lat: 12.0022, lng: 8.5919 },
    positionType: 'Captured',
    avatarSignedUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    activeAssignment: {
      projectName: 'Ocean Depth Project',
      location: 'Layin wanke wanke street',
      validationsCount: 12,
      growthChecksCount: 11,
    },
    completedTasks: {
      total: 23,
      verifiedCount: 3,
      rejectedCount: 3,
      pendingCount: 3,
    },
    lastSync: '12 minutes ago',
  },
  {
    id: 'fo-2',
    name: 'Ibrahim Haruna',
    phone: '+234 803 987 6543',
    email: 'aliyu.w@gmail.com',
    zone: 'Mariri Ward',
    status: 'Active',
    userState: 'Active',
    presenceStatus: 'Online',
    // Stacks at same block & coordinate as Waleed Aliyu to test multi-person stacking
    assignedBlockId: 'JGW-BLC-097',
    assignedBlockName: 'Kano Central Block',
    assignedSubBlockName: 'South Sub-Block',
    assignedCoordinate: { lat: 12.0022, lng: 8.5919 },
    positionType: 'Simulated',
    activeAssignment: {
      projectName: 'Ocean Depth Project',
      location: 'Layin wanke wanke street',
      validationsCount: 12,
      growthChecksCount: 11,
    },
    completedTasks: {
      total: 23,
      verifiedCount: 3,
      rejectedCount: 3,
      pendingCount: 3,
    },
    lastSync: '12 minutes ago',
  },
  {
    id: 'fo-3',
    name: 'Marcus A. Lee',
    phone: '+234 803 456 7890',
    email: 'marcus.lee@greenlegacy.org',
    zone: 'Mariri Ward',
    status: 'Pending',
    userState: 'Pending',
    presenceStatus: 'Offline',
    assignedBlockId: 'JGW-BLC-098',
    assignedBlockName: 'Mariri Community Forest',
    assignedSubBlockName: 'Sector 1',
    assignedCoordinate: { lat: 12.0065, lng: 8.5985 },
    positionType: 'Simulated',
    activeAssignment: {
      projectName: 'Ocean Depth Project',
      location: 'Layin wanke wanke street',
      validationsCount: 12,
      growthChecksCount: 11,
    },
    completedTasks: {
      total: 23,
      verifiedCount: 3,
      rejectedCount: 3,
      pendingCount: 3,
    },
    lastSync: '25 minutes ago',
  },
  {
    id: 'fo-4',
    name: 'Amina Yusuf',
    phone: '+234 803 765 4321',
    email: 'amina.yusuf@greenlegacy.org',
    zone: 'Wunlan Ward',
    status: 'Suspended',
    userState: 'Suspended',
    presenceStatus: 'Offline',
    assignedBlockId: 'JGW-BLC-099',
    assignedBlockName: 'Wunlan Ward Forest',
    assignedSubBlockName: 'Block C',
    assignedCoordinate: { lat: 11.9980, lng: 8.5870 },
    positionType: 'Low Accuracy',
    activeAssignment: {
      projectName: 'Ocean Depth Project',
      location: 'Layin wanke wanke street',
      validationsCount: 8,
      growthChecksCount: 4,
    },
    completedTasks: {
      total: 12,
      verifiedCount: 2,
      rejectedCount: 6,
      pendingCount: 4,
    },
    lastSync: '2 hours ago',
  },
  {
    id: 'fo-5',
    name: 'Bello Danbatta',
    phone: '+234 803 333 4444',
    email: 'w.aliyu99@gmail.com',
    zone: 'North Ward',
    status: 'Active',
    userState: 'Deactivated',
    presenceStatus: 'Offline',
    assignedBlockId: 'JGW-BLC-100',
    assignedBlockName: 'North Catchment Area',
    assignedSubBlockName: 'Sub-block North',
    assignedCoordinate: { lat: 12.0110, lng: 8.5930 },
    positionType: 'Simulated',
    activeAssignment: {
      projectName: 'Legacy Reforestation',
      location: 'Danbatta boundary',
      validationsCount: 0,
      growthChecksCount: 0,
    },
    completedTasks: {
      total: 0,
      verifiedCount: 0,
      rejectedCount: 0,
      pendingCount: 0,
    },
    lastSync: '3 days ago',
  },
];

const INITIAL_CUSTODIAN_STATS: CustodianStats = {
  totalCustodians: 4,
  validatedCustodians: 3,
  individualCustodians: 2,
  blockCustodians: 2,
};

const INITIAL_CUSTODIANS: CustodianItem[] = [
  {
    id: 'cust-1',
    name: 'Green Trees Farms',
    phone: '+234 803 123 4567',
    email: 'abc@gmail.com',
    zone: 'Mariri Ward',
    custodianType: 'Individual',
    assignedBlockId: 'JGW-BLC-097',
    assignedBlockName: 'Kano Central Block',
    assignedSubBlockName: 'Sector A',
    assignedCoordinate: { lat: 12.0022, lng: 8.5919 },
    positionType: 'Simulated',
    treeAllocation: {
      total: 1,
      breakdown: [{ count: 1, species: 'Mango' }],
    },
    assignedOfficer: {
      name: 'Waleed Aliyu',
      phone: '+234 803 123 4567',
      email: 'abc@gmail.com',
      zone: 'Mariri Ward',
    },
    campaign: {
      name: 'Ocean Depth Project',
      progressPercent: 23,
      status: 'In Progress',
      verifiedCount: 9,
      pendingCount: 34,
    },
  },
  {
    id: 'cust-2',
    name: 'Kano Agro-Forestry Alliance',
    phone: '+234 803 555 1234',
    email: 'agro@kanoforest.ng',
    zone: 'Mariri Ward',
    custodianType: 'Block',
    assignedBlockId: 'JGW-BLC-098',
    assignedBlockName: 'Mariri Community Forest',
    assignedSubBlockName: 'Block Main Boundary',
    assignedCoordinate: { lat: 12.0065, lng: 8.5985 },
    positionType: 'Captured',
    treeAllocation: {
      total: 23,
      breakdown: [
        { count: 3, species: 'Mango' },
        { count: 3, species: 'Orange' },
        { count: 3, species: 'Mouringa' },
      ],
    },
    assignedOfficer: {
      name: 'Waleed Aliyu',
      phone: '+234 803 123 4567',
      email: 'abc@gmail.com',
      zone: 'Mariri Ward',
    },
    campaign: {
      name: 'Ocean Depth Project',
      progressPercent: 23,
      status: 'In Progress',
      verifiedCount: 9,
      pendingCount: 34,
    },
  },
  {
    id: 'cust-3',
    name: 'Wunlan Community Trust',
    phone: '+234 803 999 8888',
    email: 'trust@wunlan.org',
    zone: 'Mariri Ward',
    custodianType: 'Individual',
    // Stacks at JGW-BLC-098 with Kano Agro-Forestry Alliance
    assignedBlockId: 'JGW-BLC-098',
    assignedBlockName: 'Mariri Community Forest',
    assignedSubBlockName: 'Family Plot 4',
    assignedCoordinate: { lat: 12.0065, lng: 8.5985 },
    positionType: 'Simulated',
    treeAllocation: {
      total: 1,
      breakdown: [{ count: 1, species: 'Mango' }],
    },
    assignedOfficer: {
      name: 'Waleed Aliyu',
      phone: '+234 803 123 4567',
      email: 'abc@gmail.com',
      zone: 'Mariri Ward',
    },
    campaign: {
      name: 'Ocean Depth Project',
      progressPercent: 23,
      status: 'Completed',
      verifiedCount: 9,
      pendingCount: 34,
    },
  },
  {
    id: 'cust-4',
    name: 'Northern Shelterbelt Custodians',
    phone: '+234 803 777 6666',
    email: 'custodians@shelterbelt.org',
    zone: 'North Ward',
    custodianType: 'Block',
    assignedBlockId: 'JGW-BLC-100',
    assignedBlockName: 'North Catchment Area',
    assignedSubBlockName: 'Belt Cluster 2',
    assignedCoordinate: { lat: 12.0110, lng: 8.5930 },
    positionType: 'Low Accuracy',
    treeAllocation: {
      total: 45,
      breakdown: [
        { count: 15, species: 'Neem' },
        { count: 30, species: 'Acacia' },
      ],
    },
    assignedOfficer: {
      name: 'Waleed Aliyu',
      phone: '+234 803 123 4567',
      email: 'abc@gmail.com',
      zone: 'Mariri Ward',
    },
    campaign: {
      name: 'Ocean Depth Project',
      progressPercent: 65,
      status: 'In Progress',
      verifiedCount: 30,
      pendingCount: 15,
    },
  },
];

export function mapOfficersToPeopleMarkers(officers: FieldOfficerItem[]): PersonMarker[] {
  return officers.map((o) => ({
    id: o.id,
    name: o.name,
    role: 'Field Officer',
    personType: 'officer',
    userState: o.userState,
    blockId: o.assignedBlockId,
    blockName: o.assignedBlockName,
    subBlockName: o.assignedSubBlockName,
    coordinate: o.assignedCoordinate,
    positionType: o.positionType,
    avatarSignedUrl: o.avatarSignedUrl,
    phone: o.phone,
    email: o.email,
  }));
}

export function mapCustodiansToPeopleMarkers(custodians: CustodianItem[]): PersonMarker[] {
  return custodians.map((c) => ({
    id: c.id,
    name: c.name,
    role: `${c.custodianType} Custodian`,
    personType: 'custodian',
    custodianType: c.custodianType,
    blockId: c.assignedBlockId,
    blockName: c.assignedBlockName,
    subBlockName: c.assignedSubBlockName,
    coordinate: c.assignedCoordinate,
    positionType: c.positionType,
    avatarSignedUrl: c.avatarSignedUrl,
    phone: c.phone,
    email: c.email,
    assignedCount: c.treeAllocation.total,
  }));
}

export interface FetchFieldOfficersResult {
  stats: FieldOfficerStats;
  officers: FieldOfficerItem[];
  peopleMarkers: PersonMarker[];
}

export interface FetchCustodiansResult {
  stats: CustodianStats;
  custodians: CustodianItem[];
  peopleMarkers: PersonMarker[];
}

/**
 * Fetch field officer roster and statistics.
 */
export async function fetchFieldOfficers(
  shouldFail: boolean = false
): Promise<FetchFieldOfficersResult> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  if (shouldFail) {
    throw new Error('Failed to load field officers roster. Please try again.');
  }
  return {
    stats: { ...INITIAL_OFFICER_STATS },
    officers: [...INITIAL_OFFICERS],
    peopleMarkers: mapOfficersToPeopleMarkers(INITIAL_OFFICERS),
  };
}

/**
 * Fetch custodian roster and statistics.
 */
export async function fetchCustodians(
  shouldFail: boolean = false
): Promise<FetchCustodiansResult> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  if (shouldFail) {
    throw new Error('Failed to load custodians roster. Please try again.');
  }
  return {
    stats: { ...INITIAL_CUSTODIAN_STATS },
    custodians: [...INITIAL_CUSTODIANS],
    peopleMarkers: mapCustodiansToPeopleMarkers(INITIAL_CUSTODIANS),
  };
}

/**
 * Check whether an email is already registered to another officer.
 */
export function isDuplicateOfficerEmail(email: string): boolean {
  const normalized = email.trim().toLowerCase();
  return INITIAL_OFFICERS.some((o) => o.email.toLowerCase() === normalized);
}

/**
 * Add / invite a new field officer.
 */
export async function addFieldOfficer(
  input: AddOfficerInput
): Promise<FieldOfficerItem> {
  await new Promise((resolve) => setTimeout(resolve, 400));

  if (isDuplicateOfficerEmail(input.email)) {
    throw new Error('An officer with this email address already exists.');
  }

  const newOfficer: FieldOfficerItem = {
    id: `fo-${Date.now()}`,
    name: input.fullName,
    phone: input.phoneNumber,
    email: input.email,
    zone: input.jurisdiction || 'Mariri Ward',
    status: 'Pending',
    userState: 'Pending',
    presenceStatus: 'Offline',
    assignedBlockId: 'JGW-BLC-097',
    assignedBlockName: 'Kano Central Block',
    assignedSubBlockName: 'New Assignment',
    assignedCoordinate: { lat: 12.0022, lng: 8.5919 },
    positionType: 'Simulated',
    activeAssignment: {
      projectName: 'Unassigned',
      location: 'Pending block assignment',
      validationsCount: 0,
      growthChecksCount: 0,
    },
    completedTasks: {
      total: 0,
      verifiedCount: 0,
      rejectedCount: 0,
      pendingCount: 0,
    },
    lastSync: 'Just now',
  };

  INITIAL_OFFICERS.unshift(newOfficer);
  INITIAL_OFFICER_STATS.totalUsers += 1;
  return newOfficer;
}
