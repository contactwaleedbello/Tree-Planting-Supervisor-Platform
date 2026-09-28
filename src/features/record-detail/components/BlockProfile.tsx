import React, { useState } from 'react';
import { Breadcrumbs } from '../../../components/Breadcrumbs';
import { MapBanner } from '../../../components/MapBanner';
import { TabBar } from '../../../components/TabBar';
import { SearchFilterBar } from '../../../components/SearchFilterBar';
import { ActivityItem } from '../../../components/ActivityItem';
import { StatusBadge } from '../../../components/StatusBadge';
import { ReviewRecordType } from '../../../types/states';

export interface StakeholderItem {
  id: string;
  name: string;
  role: 'Field Officer' | 'EXTENSION OFFICER' | 'Custodian' | string;
  phone: string;
  cluster: string;
  timestamp: string;
}

export interface BlockTreeItem {
  id: string;
  blockCode: string;
  coordinateText: string;
  status: 'Validated' | 'Pending' | 'Rejected' | 'Verified';
  campaignName: string;
  timestamp: string;
}

export interface BlockReportItem {
  id: string;
  campaignName: string;
  treeId: string;
  officerName: string;
  phoneNumber: string;
  timestamp: string;
  categoryTag: string;
  statusBadge: string;
  recordType?: ReviewRecordType;
}

export interface BlockSubBlockItem {
  id: string;
  code: string;
  lat: number;
  lng: number;
}

export interface BlockProfileData {
  id: string;
  name: string;
  polygon: Array<{ lat: number; lng: number }>;
  notifications: Array<{
    id: string;
    categoryTag: string;
    title: string;
    recordType?: ReviewRecordType;
    officerName: string;
    phoneNumber: string;
    timestamp: string;
    statusBadge?: string;
  }>;
  stakeholders: StakeholderItem[];
  // Extended fields from Block Profile-9, 10, 11 in Dashboard Flow
  assignmentStatus?: 'Assigned' | 'Unassigned';
  state?: string;
  lga?: string;
  ward?: string;
  village?: string;
  lat?: number;
  lng?: number;
  sizeHectares?: number;
  assignedCampaign?: string;
  subBlocks?: BlockSubBlockItem[];
  trees?: BlockTreeItem[];
  reports?: BlockReportItem[];
}

interface BlockProfileProps {
  block: BlockProfileData;
  onBackToBlocks?: () => void;
  onReviewNotification?: (id: string) => void;
  onTrackActivities?: (stakeholderId: string) => void;
  onSeeAllNotifications?: () => void;
  onViewTreeProfile?: (treeId: string) => void;
  className?: string;
}

const DEFAULT_TREES: BlockTreeItem[] = [
  {
    id: 'MNG/Alph/0012',
    blockCode: 'JGW-BLC-097',
    coordinateText: 'LAT: 23.4556 LNG: 23.4556',
    status: 'Validated',
    campaignName: 'Legacy Tree Campaign',
    timestamp: 'Today 10:25 PM',
  },
  {
    id: 'MNG/Alph/0013',
    blockCode: 'JGW-BLC-098',
    coordinateText: 'LAT: 24.1234 LNG: 24.1234',
    status: 'Pending',
    campaignName: 'Eco Initiative',
    timestamp: 'Tomorrow 9:00 AM',
  },
  {
    id: 'MNG/Alph/0014',
    blockCode: 'JGW-BLC-099',
    coordinateText: 'LAT: 23.4556 LNG: 23.4556',
    status: 'Rejected',
    campaignName: 'Urban Greening Project',
    timestamp: 'Yesterday 04:15 PM',
  },
];

const DEFAULT_REPORTS: BlockReportItem[] = [
  {
    id: 'rep-1',
    campaignName: 'Legacy Tree Campaign',
    treeId: '123-454-YT-1234',
    officerName: 'Marcus A. Lee',
    phoneNumber: '+2349198765432',
    timestamp: 'Today 10:25 PM',
    categoryTag: 'Pending',
    statusBadge: 'Growth Check',
    recordType: 'growth_check',
  },
  {
    id: 'rep-2',
    campaignName: 'Legacy Tree Campaign',
    treeId: '123-454-YT-1234',
    officerName: 'Marcus A. Lee',
    phoneNumber: '+2349198765432',
    timestamp: 'Today 10:25 PM',
    categoryTag: 'Pending',
    statusBadge: 'Damaged/Destroyed',
    recordType: 'incident',
  },
  {
    id: 'rep-3',
    campaignName: 'Legacy Tree Campaign',
    treeId: '123-454-YT-1234',
    officerName: 'Marcus A. Lee',
    phoneNumber: '+2349198765432',
    timestamp: 'Today 10:25 PM',
    categoryTag: 'Pending',
    statusBadge: 'Missing Tree',
    recordType: 'incident',
  },
];

const DEFAULT_SUB_BLOCKS: BlockSubBlockItem[] = [
  { id: 'sb-1', code: 'JGW-BLC-097-001', lat: 23.4000, lng: 23.4000 },
  { id: 'sb-2', code: 'JGW-BLC-097-002', lat: 23.4550, lng: 43.4550 },
];

export const BlockProfile: React.FC<BlockProfileProps> = ({
  block,
  onBackToBlocks,
  onReviewNotification,
  onTrackActivities,
  onSeeAllNotifications,
  onViewTreeProfile,
  className = '',
}) => {
  const [activeTab, setActiveTab] = useState<'details' | 'trees' | 'reports' | 'stakeholders'>('stakeholders');
  const [notificationSearch, setNotificationSearch] = useState('');
  const [stakeholderSearch, setStakeholderSearch] = useState('');
  const [treeSearch, setTreeSearch] = useState('');
  const [reportSearch, setReportSearch] = useState('');
  const [isStakeholderFilterActive, setIsStakeholderFilterActive] = useState(false);

  const tabs = [
    { id: 'details', label: 'Details' },
    { id: 'trees', label: 'Trees' },
    { id: 'reports', label: 'Reports' },
    { id: 'stakeholders', label: 'Stakeholders' },
  ];

  const treeList = block.trees || DEFAULT_TREES;
  const reportList = block.reports || DEFAULT_REPORTS;
  const subBlocks = block.subBlocks || DEFAULT_SUB_BLOCKS;

  const filteredStakeholders = block.stakeholders.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(stakeholderSearch.toLowerCase()) ||
      s.role.toLowerCase().includes(stakeholderSearch.toLowerCase()) ||
      s.cluster.toLowerCase().includes(stakeholderSearch.toLowerCase());
    if (isStakeholderFilterActive) {
      return matchesSearch && (s.role.toLowerCase().includes('officer') || s.role.toLowerCase().includes('supervisor'));
    }
    return matchesSearch;
  });

  const filteredTrees = treeList.filter(
    (t) =>
      t.id.toLowerCase().includes(treeSearch.toLowerCase()) ||
      t.blockCode.toLowerCase().includes(treeSearch.toLowerCase()) ||
      t.campaignName.toLowerCase().includes(treeSearch.toLowerCase())
  );

  const filteredReports = reportList.filter(
    (r) =>
      r.treeId.toLowerCase().includes(reportSearch.toLowerCase()) ||
      r.campaignName.toLowerCase().includes(reportSearch.toLowerCase()) ||
      r.officerName.toLowerCase().includes(reportSearch.toLowerCase())
  );

  const filteredNotifications = block.notifications.filter(
    (n) =>
      n.title.toLowerCase().includes(notificationSearch.toLowerCase()) ||
      n.officerName.toLowerCase().includes(notificationSearch.toLowerCase())
  );

  return (
    <div className={`flex flex-col gap-5 ${className}`}>
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: 'Block Management', onClick: onBackToBlocks },
          { label: block.name, active: true },
        ]}
      />

      {/* Map Banner with Polygon */}
      <MapBanner blockPolygon={block.polygon} blockName={block.name} />

      {/* 2-Column Split: Notifications on Left, Tabbed Content on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Notifications */}
        <div className="lg:col-span-5 bg-[#FAFCFE] border border-[#E2E5E6] rounded-xl p-5 shadow-xs flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#1C211B]">Notifications</h3>
            <button
              type="button"
              onClick={onSeeAllNotifications}
              className="text-xs font-semibold text-[#3C7429] hover:underline cursor-pointer"
            >
              See All
            </button>
          </div>

          <SearchFilterBar
            searchQuery={notificationSearch}
            onSearchChange={setNotificationSearch}
            searchPlaceholder="Search here"
          />

          <div className="flex flex-col gap-3">
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-8 text-xs text-[#7B7E7B]">
                No notifications matching search
              </div>
            ) : (
              filteredNotifications.map((notif) => (
                <ActivityItem
                  key={notif.id}
                  title={notif.title}
                  categoryTag={notif.categoryTag}
                  statusBadge={notif.statusBadge}
                  recordType={notif.recordType}
                  officerName={notif.officerName}
                  phoneNumber={notif.phoneNumber}
                  timestamp={notif.timestamp}
                  actionLabel="Review"
                  onAction={() =>
                    onReviewNotification && onReviewNotification(notif.id)
                  }
                />
              ))
            )}
          </div>
        </div>

        {/* Right Column: Tabbed Content */}
        <div className="lg:col-span-7 bg-[#FAFCFE] border border-[#E2E5E6] rounded-xl p-5 shadow-xs flex flex-col gap-4">
          <TabBar
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={(id) => setActiveTab(id as typeof activeTab)}
          />

          {/* Details Tab - matches Block Profile-9.png directly */}
          {activeTab === 'details' && (
            <div className="flex flex-col gap-5">
              {/* Block Information Section */}
              <div className="border border-[#E2E5E6] rounded-xl p-5 bg-[#FAFCFE] flex flex-col gap-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#7B7E7B]">
                  Block Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className="text-[11px] text-[#7B7E7B]">Block Name</span>
                    <div className="text-sm font-bold text-[#1C211B] mt-0.5">{block.name}</div>
                  </div>
                  <div>
                    <span className="text-[11px] text-[#7B7E7B]">Assignment Status</span>
                    <div className="mt-1 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#2E5421]" />
                      <span className="text-xs font-bold text-[#2E5421]">
                        {block.assignmentStatus || 'Assigned'}
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className="text-[11px] text-[#7B7E7B]">Block Size</span>
                    <div className="text-xs font-semibold text-[#1C211B] mt-0.5">
                      {block.sizeHectares ? `${block.sizeHectares} hectares` : '5.67443 hectares'}
                    </div>
                  </div>
                  <div>
                    <span className="text-[11px] text-[#7B7E7B]">Assigned Campaign</span>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-[#1C211B] mt-0.5">
                      <svg className="w-3.5 h-3.5 text-[#3C7429]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                      </svg>
                      <span>{block.assignedCampaign || 'Green Legacy Tree Project'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Location Section */}
              <div className="border border-[#E2E5E6] rounded-xl p-5 bg-[#FAFCFE] flex flex-col gap-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#7B7E7B]">
                  Location
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className="text-[11px] text-[#7B7E7B]">State</span>
                    <div className="text-xs font-semibold text-[#1C211B] mt-0.5">
                      {block.state || 'Jigawa'}
                    </div>
                  </div>
                  <div>
                    <span className="text-[11px] text-[#7B7E7B]">LGA</span>
                    <div className="text-xs font-semibold text-[#1C211B] mt-0.5">
                      {block.lga || 'Dutse'}
                    </div>
                  </div>
                  <div>
                    <span className="text-[11px] text-[#7B7E7B]">Ward</span>
                    <div className="text-xs font-semibold text-[#1C211B] mt-0.5">
                      {block.ward || 'Unguwa Uku'}
                    </div>
                  </div>
                  <div>
                    <span className="text-[11px] text-[#7B7E7B]">Community Village</span>
                    <div className="text-xs font-semibold text-[#1C211B] mt-0.5">
                      {block.village || 'Layin Awaki'}
                    </div>
                  </div>
                  <div>
                    <span className="text-[11px] text-[#7B7E7B]">Latitude</span>
                    <div className="text-xs font-mono text-[#555] mt-0.5">
                      {block.lat !== undefined ? block.lat : 23.4556}
                    </div>
                  </div>
                  <div>
                    <span className="text-[11px] text-[#7B7E7B]">Longitude</span>
                    <div className="text-xs font-mono text-[#555] mt-0.5">
                      {block.lng !== undefined ? block.lng : 5.67443}
                    </div>
                  </div>
                </div>
              </div>

              {/* Sub-Blocks Section */}
              <div className="border border-[#E2E5E6] rounded-xl p-5 bg-[#FAFCFE] flex flex-col gap-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#7B7E7B]">
                  Sub-Blocks
                </h4>
                <div className="divide-y divide-[#EEF0F2]">
                  {subBlocks.map((sb) => (
                    <div key={sb.id} className="py-2.5 flex items-center justify-between">
                      <span className="text-xs font-bold text-[#1C211B]">{sb.code}</span>
                      <span className="text-[11px] font-mono text-[#7B7E7B]">
                        Lat: {sb.lat.toFixed(4)} LNG: {sb.lng.toFixed(4)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Trees Tab - matches Block Profile-10.png directly */}
          {activeTab === 'trees' && (
            <div className="flex flex-col gap-4">
              <SearchFilterBar
                searchQuery={treeSearch}
                onSearchChange={setTreeSearch}
                searchPlaceholder="Search here"
              />

              <div className="flex flex-col gap-3">
                {filteredTrees.length === 0 ? (
                  <div className="text-center py-8 text-xs text-[#7B7E7B]">
                    No trees found
                  </div>
                ) : (
                  filteredTrees.map((t) => (
                    <div
                      key={t.id}
                      className="border border-[#E2E5E6] rounded-xl p-4 bg-[#FAFCFE] flex flex-col gap-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-[#1C211B]">{t.id}</h4>
                          <span className="text-xs text-[#7B7E7B]">|</span>
                          <span className="text-xs text-[#555] font-medium">{t.blockCode}</span>
                        </div>
                        <StatusBadge
                          status={t.status}
                          variant="pill"
                        />
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-[#7B7E7B]">
                        <span className="font-mono">{t.coordinateText}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-[#555]">
                          <svg className="w-3 h-3 text-[#3C7429]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                          </svg>
                          {t.campaignName}
                        </span>
                        <span>•</span>
                        <span>{t.timestamp}</span>
                      </div>

                      <div className="flex justify-end pt-2 border-t border-[#EEF0F2]">
                        <button
                          type="button"
                          onClick={() => onViewTreeProfile && onViewTreeProfile(t.id)}
                          className="px-4 py-1.5 rounded-lg bg-[#2E5421] text-[#FAFCFE] text-xs font-semibold hover:bg-[#28461D] transition-colors cursor-pointer"
                        >
                          View Profile
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Reports Tab - matches Block Profile-11.png directly */}
          {activeTab === 'reports' && (
            <div className="flex flex-col gap-4">
              <SearchFilterBar
                searchQuery={reportSearch}
                onSearchChange={setReportSearch}
                searchPlaceholder="Search here"
              />

              <div className="flex flex-col gap-3">
                {filteredReports.length === 0 ? (
                  <div className="text-center py-8 text-xs text-[#7B7E7B]">
                    No reports found
                  </div>
                ) : (
                  filteredReports.map((r) => (
                    <ActivityItem
                      key={r.id}
                      title={r.treeId}
                      subtitle={r.campaignName}
                      categoryTag={r.categoryTag}
                      statusBadge={r.statusBadge}
                      recordType={r.recordType}
                      officerName={r.officerName}
                      phoneNumber={r.phoneNumber}
                      timestamp={r.timestamp}
                      actionLabel="Review"
                      onAction={() =>
                        onReviewNotification && onReviewNotification(r.id)
                      }
                    />
                  ))
                )}
              </div>
            </div>
          )}

          {/* Stakeholders Tab - matches Block Profile-8.png directly */}
          {activeTab === 'stakeholders' && (
            <div className="flex flex-col gap-4">
              <SearchFilterBar
                searchQuery={stakeholderSearch}
                onSearchChange={setStakeholderSearch}
                onFilterClick={() => setIsStakeholderFilterActive((prev) => !prev)}
                isFilterActive={isStakeholderFilterActive}
                searchPlaceholder="Search here"
              />

              <div className="flex flex-col gap-3">
                {filteredStakeholders.length === 0 ? (
                  <div className="text-center py-8 text-xs text-[#7B7E7B]">
                    No stakeholders found
                  </div>
                ) : (
                  filteredStakeholders.map((s) => (
                    <div
                      key={s.id}
                      className="border border-[#E2E5E6] rounded-xl p-4 bg-[#FAFCFE] flex flex-col gap-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <svg
                            className="w-4 h-4 text-[#7B7E7B]"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                          <h4 className="text-sm font-bold text-[#1C211B]">
                            {s.name}
                          </h4>
                        </div>
                        <StatusBadge
                          status={s.role}
                          variant="outline"
                        />
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-[#7B7E7B]">
                        <span>{s.phone}</span>
                        <span>{s.cluster}</span>
                        <span>{s.timestamp}</span>
                      </div>

                      <div className="flex justify-end pt-2 border-t border-[#EEF0F2]">
                        <button
                          type="button"
                          onClick={() => {
                            if (onTrackActivities) {
                              onTrackActivities(s.id);
                            } else if (onSeeAllNotifications) {
                              onSeeAllNotifications();
                            }
                          }}
                          className="px-4 py-1.5 rounded-lg bg-[#2E5421] text-[#FAFCFE] text-xs font-semibold hover:bg-[#28461D] transition-colors cursor-pointer"
                        >
                          Track Activities
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

