/**
 * types/team.ts
 *
 * Types for Team Management (Field Officers & Custodians)
 * References:
 * - design/ui-reference/team-management/User Management.png
 * - design/ui-reference/team-management/Custodian Overview.png
 * - design/ui-reference/team-management/Frame 1707479575.png
 * - state-mapping-rules.md
 */

import {
  UserState,
  CustodianType,
  PositionLabel,
  Coordinate,
  PersonMarker,
} from '../../../types/states';

export type { UserState, CustodianType, PositionLabel, Coordinate, PersonMarker };

export interface FieldOfficerStats {
  totalUsers: number;
  activeUsers: number;
  suspendedUsers: number;
  usersOnline: number;
}

export type OfficerStatus = 'Online' | 'Pending' | 'Suspended' | 'Active';

export interface FieldOfficerItem {
  id: string;
  name: string;
  phone: string;
  email: string;
  zone: string;
  status: OfficerStatus;
  userState: UserState;
  presenceStatus?: 'Online' | 'Offline';
  assignedBlockId: string;
  assignedBlockName: string;
  assignedSubBlockName?: string;
  assignedCoordinate: Coordinate;
  positionType: PositionLabel;
  avatarSignedUrl?: string;
  activeAssignment: {
    projectName: string;
    location: string;
    validationsCount: number;
    growthChecksCount: number;
  };
  completedTasks: {
    total: number;
    verifiedCount: number;
    rejectedCount: number;
    pendingCount: number;
  };
  lastSync: string;
}

export interface CustodianStats {
  totalCustodians: number;
  validatedCustodians: number;
  individualCustodians: number;
  blockCustodians: number;
}

export interface SpeciesAllocation {
  count: number;
  species: string;
}

export interface CustodianItem {
  id: string;
  name: string;
  phone: string;
  email: string;
  zone: string;
  custodianType: CustodianType;
  assignedBlockId: string;
  assignedBlockName: string;
  assignedSubBlockName?: string;
  assignedCoordinate: Coordinate;
  positionType: PositionLabel;
  avatarSignedUrl?: string;
  treeAllocation: {
    total: number;
    breakdown: SpeciesAllocation[];
  };
  assignedOfficer: {
    name: string;
    phone: string;
    email: string;
    zone: string;
  };
  campaign: {
    name: string;
    progressPercent: number;
    status: 'In Progress' | 'Completed';
    verifiedCount: number;
    pendingCount: number;
  };
}

export interface AddOfficerInput {
  fullName: string;
  email: string;
  phoneNumber: string;
  jurisdiction: string;
  role: string;
  password: string;
  idDocumentName?: string;
}
