import React, { useState } from 'react';
import { Breadcrumbs } from '../../../components/Breadcrumbs';
import { MapBanner } from '../../../components/MapBanner';
import { PhotoGallery, PhotoItem } from '../../../components/PhotoGallery';
import { TabBar } from '../../../components/TabBar';
import { PropertyGrid, PropertyItem } from '../../../components/PropertyGrid';
import { StatusBadge } from '../../../components/StatusBadge';
import { ActivityItem } from '../../../components/ActivityItem';
import { PositionLabel, RecordState } from '../../../types/states';

export interface TreeDetailData {
  id: string;
  blockName: string;
  speciesName: string;
  speciesType: string;
  batch: string;
  qrId: string;
  validationStatus: RecordState;
  positionType: PositionLabel;
  coordinate: { lat: number; lng: number };
  photos: PhotoItem[];
  blockDetails: {
    name: string;
    sizeHectares: number;
    state: string;
    lga: string;
    ward: string;
    village: string;
    lat: number;
    lng: number;
  };
  custodian?: {
    name: string;
    phone: string;
    ward: string;
    type: string;
    timestamp: string;
  };
  growthCheckTasks?: Array<{
    id: string;
    title: string;
    subtitle: string;
    timestamp: string;
  }>;
}

interface TreeProfileProps {
  tree: TreeDetailData;
  onBackToBlock?: () => void;
  onExport?: () => void;
  onReviewTask?: (taskId: string) => void;
  onViewCustodianProfile?: () => void;
  className?: string;
}

export const TreeProfile: React.FC<TreeProfileProps> = ({
  tree,
  onBackToBlock,
  onExport,
  onReviewTask,
  onViewCustodianProfile,
  className = '',
}) => {
  const [activeTab, setActiveTab] = useState<'info' | 'growth' | 'block' | 'custodian'>('info');

  const tabs = [
    { id: 'info', label: 'Tree Information' },
    { id: 'growth', label: 'Growth Check' },
    { id: 'block', label: 'Block' },
    { id: 'custodian', label: 'Custodians' },
  ];

  const treeInfoProperties: PropertyItem[] = [
    { label: 'Tree Specie', value: tree.speciesName },
    { label: 'Tree Type', value: tree.speciesType },
    { label: 'Tree ID', value: tree.id },
    {
      label: 'Validation Status',
      value: <StatusBadge status={tree.validationStatus} variant="pill" />,
    },
    { label: 'Tree Batch', value: tree.batch },
    { label: 'QR-ID', value: tree.qrId },
  ];

  const blockProperties: PropertyItem[] = [
    { label: 'Block Name', value: tree.blockDetails.name },
    { label: 'Block Size', value: `${tree.blockDetails.sizeHectares} hectares` },
    { label: 'State', value: tree.blockDetails.state },
    { label: 'LGA', value: tree.blockDetails.lga },
    { label: 'Ward', value: tree.blockDetails.ward },
    { label: 'Community/Village', value: tree.blockDetails.village },
    { label: 'Latitude', value: tree.blockDetails.lat.toFixed(4) },
    { label: 'Longitude', value: tree.blockDetails.lng.toFixed(4) },
  ];

  return (
    <div className={`flex flex-col gap-5 ${className}`}>
      {/* Breadcrumb Header */}
      <Breadcrumbs
        items={[
          { label: 'Block Management', onClick: onBackToBlock },
          { label: tree.blockName, onClick: onBackToBlock },
          { label: tree.id, active: true },
        ]}
        extraActions={
          onExport && (
            <button
              type="button"
              onClick={onExport}
              className="inline-flex items-center gap-2 px-4 py-2 border border-[#D89859] rounded-lg text-xs font-semibold text-[#936B40] hover:bg-[#F7EADE] transition-colors"
            >
              <span>Export</span>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </button>
          )
        }
      />

      {/* Map Banner */}
      <MapBanner
        positionType={tree.positionType}
        treeCoordinate={tree.coordinate}
        blockName={tree.blockName}
      />

      {/* 2-Column Content: Left Media Gallery, Right Tabbed Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5">
          <PhotoGallery photos={tree.photos} />
        </div>

        <div className="lg:col-span-7 flex flex-col gap-4">
          <TabBar
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={(id) => setActiveTab(id as typeof activeTab)}
          />

          {/* Tab 1: Tree Information */}
          {activeTab === 'info' && (
            <PropertyGrid items={treeInfoProperties} columns={2} />
          )}

          {/* Tab 2: Growth Check Activity List */}
          {activeTab === 'growth' && (
            <div className="flex flex-col gap-3">
              {tree.growthCheckTasks && tree.growthCheckTasks.length > 0 ? (
                tree.growthCheckTasks.map((task) => (
                  <ActivityItem
                    key={task.id}
                    title={task.title}
                    subtitle={task.subtitle}
                    recordType="growth_check"
                    timestamp={task.timestamp}
                    actionLabel="Review submissions"
                    onAction={() => onReviewTask && onReviewTask(task.id)}
                  />
                ))
              ) : (
                <div className="p-8 text-center text-xs text-[#7B7E7B] bg-[#FAFCFE] rounded-xl border border-[#E2E5E6]">
                  No growth checks recorded for this tree.
                </div>
              )}
            </div>
          )}

          {/* Tab 3: Block Details */}
          {activeTab === 'block' && (
            <PropertyGrid items={blockProperties} columns={2} />
          )}

          {/* Tab 4: Custodians */}
          {activeTab === 'custodian' && (
            <div>
              {tree.custodian ? (
                <div className="border border-[#E2E5E6] rounded-xl p-4 bg-[#FAFCFE] flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#EEF0F2] flex items-center justify-center font-bold text-xs text-[#5E625E]">
                        {tree.custodian.name.slice(0, 2).toUpperCase()}
                      </div>
                      <h4 className="text-sm font-bold text-[#1C211B]">
                        {tree.custodian.name}
                      </h4>
                    </div>
                    <StatusBadge status="Individual custodian" variant="outline" />
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-[#7B7E7B]">
                    <span>{tree.custodian.phone}</span>
                    <span>{tree.custodian.ward}</span>
                    <span>{tree.custodian.timestamp}</span>
                  </div>

                  {onViewCustodianProfile && (
                    <div className="flex justify-end pt-2 border-t border-[#EEF0F2]">
                      <button
                        type="button"
                        onClick={onViewCustodianProfile}
                        className="px-4 py-1.5 rounded-lg bg-[#2E5421] text-[#FAFCFE] text-xs font-semibold hover:bg-[#28461D] transition-colors"
                      >
                        View Profile
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-8 text-center text-xs text-[#7B7E7B] bg-[#FAFCFE] rounded-xl border border-[#E2E5E6]">
                  No custodian assigned to this tree.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
