import React from 'react';
import { ModalShell } from '../../../components/ModalShell';
import { PropertyGrid, PropertyItem } from '../../../components/PropertyGrid';
import { StatusBadge } from '../../../components/StatusBadge';
import { MapBanner } from '../../../components/MapBanner';
import {
  CustodianType,
  PositionLabel,
  Coordinate,
  PersonMarker,
} from '../../../types/states';

export interface CustodianProfileData {
  id: string;
  name: string;
  ward: string;
  type: CustodianType;
  email: string;
  phoneNumber: string;
  assignedTrees: number;
  assignedBlocks: number;
  campaigns: number;
  assignedSpecies: number;
  assignedBlockName?: string;
  assignedBlockPolygon?: Coordinate[];
  assignedCoordinate?: Coordinate;
  positionType?: PositionLabel;
  avatarSignedUrl?: string;
}

interface CustodianIndividualProps {
  isOpen: boolean;
  onClose: () => void;
  onBack?: () => void;
  custodian: CustodianProfileData;
  onNewAssignment?: () => void;
}

export const CustodianIndividual: React.FC<CustodianIndividualProps> = ({
  isOpen,
  onClose,
  onBack,
  custodian,
  onNewAssignment,
}) => {
  const propertyItems: PropertyItem[] = [
    { label: 'Email', value: custodian.email },
    { label: 'Phone number', value: custodian.phoneNumber },
    { label: 'Assigned Trees', value: custodian.assignedTrees },
    { label: 'Assigned Blocks', value: custodian.assignedBlocks },
    { label: 'Campaigns', value: custodian.campaigns },
    { label: 'Assigned Species', value: custodian.assignedSpecies },
  ];

  const initials = custodian.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      onBack={onBack}
      title={custodian.name}
      maxWidth="xl"
    >
      <div className="flex flex-col gap-6">
        {/* Profile Header Block */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#E2E5E6] flex items-center justify-center text-xl font-bold text-[#1C211B] shrink-0">
              {initials}
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#1C211B]">{custodian.name}</h3>
              <p className="text-xs text-[#5E625E] mt-0.5">{custodian.ward}</p>
              <div className="mt-2">
                <StatusBadge status="Custodian" variant="pill" />
              </div>
            </div>
          </div>

          <StatusBadge status={custodian.type} variant="pill" />
        </div>

        {/* Map Banner with custodian marker differentiated by Custodian Type */}
        <MapBanner
          blockName={custodian.assignedBlockName || 'Kano Central Block'}
          blockPolygon={
            custodian.assignedBlockPolygon || [
              { lat: 12.0022, lng: 8.5919 },
              { lat: 12.0045, lng: 8.5955 },
              { lat: 12.0018, lng: 8.5982 },
              { lat: 11.9995, lng: 8.5942 },
            ]
          }
          peopleMarkers={[
            {
              id: custodian.id,
              name: custodian.name,
              role: `${custodian.type} Custodian`,
              personType: 'custodian',
              custodianType: custodian.type,
              blockId: 'JGW-BLC-097',
              blockName: custodian.assignedBlockName || 'Kano Central Block',
              subBlockName: 'Allocated Sub-Block',
              coordinate: custodian.assignedCoordinate || { lat: 12.0022, lng: 8.5919 },
              positionType: custodian.positionType || 'Simulated',
              avatarSignedUrl: custodian.avatarSignedUrl,
              phone: custodian.phoneNumber,
              email: custodian.email,
            },
          ]}
          height="h-44 sm:h-52"
        />

        {/* 6-Grid Metric & Info Block */}
        <PropertyGrid items={propertyItems} columns={2} />

        {/* New Assignment Action Button */}
        {onNewAssignment && (
          <button
            type="button"
            onClick={onNewAssignment}
            className="w-full py-3 px-4 border border-[#D89859] rounded-xl text-sm font-semibold text-[#936B40] hover:bg-[#F7EADE] transition-colors flex items-center justify-center gap-2 focus:outline-none"
          >
            <span>New Assignment</span>
            <svg
              className="w-4 h-4 text-[#936B40]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </button>
        )}
      </div>
    </ModalShell>
  );
};
