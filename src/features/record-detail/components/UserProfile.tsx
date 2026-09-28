import React, { useState } from 'react';
import { Breadcrumbs } from '../../../components/Breadcrumbs';
import { MapBanner } from '../../../components/MapBanner';
import { TabBar } from '../../../components/TabBar';
import { SearchFilterBar } from '../../../components/SearchFilterBar';
import { StatusBadge } from '../../../components/StatusBadge';
import { ActivityItem } from '../../../components/ActivityItem';
import { CustodianIndividual, CustodianProfileData } from './CustodianIndividual';
import {
  ReviewRecordType,
  UserState,
  PositionLabel,
  Coordinate,
  PersonMarker,
} from '../../../types/states';

export interface UserProfileData {
  id: string;
  name: string;
  ward: string;
  status: 'Online' | 'Offline' | 'Pending' | 'Suspended';
  userState?: UserState;
  role: string;
  email: string;
  phoneNumber: string;
  idCardFilename?: string;
  assignedBlocksCount: number;
  assignedBlockName?: string;
  assignedBlockPolygon?: Coordinate[];
  assignedCoordinate?: Coordinate;
  positionType?: PositionLabel;
  avatarSignedUrl?: string;
  completedTasks: {
    total: number;
    verified: number;
    rejected: number;
    pending: number;
  };
  activeAssignment?: {
    projectName: string;
    location: string;
    validationsCount: number;
    growthCheckCount: number;
  };
  mapCoordinates?: Array<{ lat: number; lng: number }>;
  notifications: Array<{
    id: string;
    title: string;
    categoryTag: string;
    statusBadge?: string;
    recordType?: ReviewRecordType;
    officerName: string;
    phoneNumber: string;
    timestamp: string;
  }>;
  relatedStakeholders: Array<{
    id: string;
    name: string;
    role: string;
    phone: string;
    cluster: string;
    timestamp: string;
  }>;
  assignedBlockItems?: Array<{
    id: string;
    code: string;
    location: string;
    sizeHectares: number;
    campaign: string;
  }>;
  treesList?: Array<{
    id: string;
    blockCode: string;
    coordinateText: string;
    status: 'Validated' | 'Pending' | 'Rejected' | 'Verified';
    campaign: string;
    timestamp: string;
  }>;
  reportsList?: Array<{
    id: string;
    campaign: string;
    treeId: string;
    officerName: string;
    phone: string;
    timestamp: string;
    categoryTag: string;
    statusBadge: string;
    recordType?: ReviewRecordType;
  }>;
}

interface UserProfileProps {
  user: UserProfileData;
  onBackToTeam?: () => void;
  onExport?: () => void;
  onSuspendUser?: () => void;
  onEditProfile?: () => void;
  onViewIdCard?: () => void;
  onReviewNotification?: (id: string) => void;
  onViewRelatedProfile?: (id: string) => void;
  onViewBlock?: (blockId: string) => void;
  onViewTree?: (treeId: string) => void;
  onSeeAllNotifications?: () => void;
  className?: string;
}

const DEFAULT_USER_BLOCKS = [
  {
    id: 'blk-u-1',
    code: 'JGW-BLC-097',
    location: 'Jigawa State',
    sizeHectares: 5.67443,
    campaign: 'Green Legacy Tree Project',
  },
  {
    id: 'blk-u-2',
    code: 'JGW-BLC-099',
    location: 'Lagos State',
    sizeHectares: 10.40576,
    campaign: 'Urban Greening Drive',
  },
];

const DEFAULT_USER_TREES = [
  {
    id: 'MNG/Alph/0012',
    blockCode: 'JGW-BLC-097',
    coordinateText: 'LAT: 23.4556 LNG: 23.4556',
    status: 'Validated' as const,
    campaign: 'Legacy Tree Campaign',
    timestamp: 'Today 10:25 PM',
  },
  {
    id: 'MNG/Alph/0013',
    blockCode: 'JGW-BLC-098',
    coordinateText: 'LAT: 24.1234 LNG: 24.1234',
    status: 'Pending' as const,
    campaign: 'Eco Initiative',
    timestamp: 'Tomorrow 9:00 AM',
  },
];

const DEFAULT_USER_REPORTS = [
  {
    id: 'rep-u-1',
    campaign: 'Legacy Tree Campaign',
    treeId: '123-454-YT-1234',
    officerName: 'Marcus A. Lee',
    phone: '+2349198765432',
    timestamp: 'Today 10:25 PM',
    categoryTag: 'Pending',
    statusBadge: 'Growth Check',
    recordType: 'growth_check' as ReviewRecordType,
  },
  {
    id: 'rep-u-2',
    campaign: 'Legacy Tree Campaign',
    treeId: '123-454-YT-1234',
    officerName: 'Marcus A. Lee',
    phone: '+2349198765432',
    timestamp: 'Today 10:25 PM',
    categoryTag: 'Pending',
    statusBadge: 'Damaged/Destroyed',
    recordType: 'incident' as ReviewRecordType,
  },
];

export const UserProfile: React.FC<UserProfileProps> = ({
  user,
  onBackToTeam,
  onExport,
  onSuspendUser,
  onEditProfile,
  onViewIdCard,
  onReviewNotification,
  onViewRelatedProfile,
  onViewBlock,
  onViewTree,
  onSeeAllNotifications,
  className = '',
}) => {
  const [activeTab, setActiveTab] = useState<'reports' | 'trees' | 'blocks' | 'custodians'>('custodians');
  const [notificationSearch, setNotificationSearch] = useState('');
  const [stakeholderSearch, setStakeholderSearch] = useState('');
  const [isStakeholderFilterActive, setIsStakeholderFilterActive] = useState(false);
  const [selectedRelatedCustodian, setSelectedRelatedCustodian] = useState<CustodianProfileData | null>(null);

  const tabs = [
    { id: 'reports', label: 'Reports' },
    { id: 'trees', label: 'Trees' },
    { id: 'blocks', label: 'Blocks' },
    { id: 'custodians', label: 'Custodians' },
  ];

  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const filteredNotifications = user.notifications.filter(
    (n) =>
      n.title.toLowerCase().includes(notificationSearch.toLowerCase()) ||
      n.officerName.toLowerCase().includes(notificationSearch.toLowerCase())
  );

  const filteredStakeholders = user.relatedStakeholders.filter((s) => {
    const matches =
      s.name.toLowerCase().includes(stakeholderSearch.toLowerCase()) ||
      s.role.toLowerCase().includes(stakeholderSearch.toLowerCase()) ||
      s.cluster.toLowerCase().includes(stakeholderSearch.toLowerCase());
    if (isStakeholderFilterActive) {
      return matches && s.role.toLowerCase().includes('custodian');
    }
    return matches;
  });

  const handleViewRelatedProfile = (s: typeof user.relatedStakeholders[0]) => {
    setSelectedRelatedCustodian({
      id: s.id,
      name: s.name,
      ward: s.cluster,
      type: s.role.toLowerCase().includes('custodian') ? 'Individual' : 'Block',
      email: `${s.name.toLowerCase().replace(/[^a-z]/g, '')}@greenlegacy.org`,
      phoneNumber: s.phone,
      assignedTrees: 120,
      assignedBlocks: 2,
      campaigns: 1,
      assignedSpecies: 3,
    });
    if (onViewRelatedProfile) {
      onViewRelatedProfile(s.id);
    }
  };

  return (
    <div className={`flex flex-col gap-6 ${className}`}>
      {/* Breadcrumbs & Top Actions */}
      <Breadcrumbs
        items={[
          { label: 'Users', onClick: onBackToTeam },
          { label: user.name, active: true },
        ]}
        extraActions={
          <div className="flex items-center gap-3">
            {onExport && (
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
            )}
            {onSuspendUser && (
              <button
                type="button"
                onClick={onSuspendUser}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#FEEEED] border border-[#FAC4C0] rounded-lg text-xs font-semibold text-[#C54A40] hover:bg-[#FCDDDB] transition-colors"
              >
                <span>Suspend User</span>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </button>
            )}
          </div>
        }
      />

      {/* Main Profile Info Card */}
      <div className="bg-[#FAFCFE] border border-[#E2E5E6] rounded-2xl p-6 shadow-xs flex flex-col gap-6">
        {/* Header: Avatar, Name, Status, Role, Edit */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#EEF0F2]">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#E2E5E6] flex items-center justify-center text-xl font-bold text-[#1C211B] shrink-0">
              {initials}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-bold text-[#1C211B]">{user.name}</h3>
                <StatusBadge status={user.status} variant="dot" />
              </div>
              <p className="text-xs text-[#5E625E] mt-0.5">{user.ward}</p>
              <div className="mt-2">
                <StatusBadge status={user.role} variant="pill" />
              </div>
            </div>
          </div>

          {onEditProfile && (
            <button
              type="button"
              onClick={onEditProfile}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1C211B] hover:text-[#3C7429] transition-colors"
            >
              <span>Edit Profile</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
          )}
        </div>

        {/* Details Grid & Task Panels */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left: Contact & ID info */}
          <div className="flex flex-col gap-4">
            <div>
              <span className="text-[11px] font-medium text-[#7B7E7B]">Email</span>
              <div className="text-sm font-semibold text-[#1C211B] mt-0.5">{user.email}</div>
            </div>

            <div>
              <span className="text-[11px] font-medium text-[#7B7E7B]">ID-Card</span>
              {user.idCardFilename ? (
                <div className="flex items-center justify-between p-2.5 mt-1 border border-[#CBCDCE] rounded-lg bg-[#FAFCFE] max-w-sm">
                  <div className="flex items-center gap-2 truncate">
                    <svg className="w-4 h-4 text-[#7B7E7B] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-xs font-medium text-[#1C211B] truncate">{user.idCardFilename}</span>
                  </div>
                  {onViewIdCard && (
                    <button
                      type="button"
                      onClick={onViewIdCard}
                      className="p-1 text-[#5E625E] hover:text-[#1C211B] focus:outline-none"
                      title="View ID card"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                  )}
                </div>
              ) : (
                <div className="text-xs text-[#7B7E7B] mt-1">No ID card uploaded</div>
              )}
            </div>

            {/* Completed Tasks Box */}
            <div className="border border-[#E2E5E6] rounded-xl p-4 bg-[#FAFCFE] mt-2">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-[#1C211B]">{user.completedTasks.total}</span>
                <span className="text-xs text-[#5E625E]">Completed Tasks</span>
              </div>
              <div className="flex flex-wrap items-center gap-2 mt-3">
                <span className="text-xs px-2.5 py-0.5 rounded-md font-medium bg-[#ECFAF7] text-[#3CAD90]">
                  {user.completedTasks.verified} Verified
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-md font-medium bg-[#FEEEED] text-[#C54A40]">
                  {user.completedTasks.rejected} Rejected
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-md font-medium bg-[#EEF0F2] text-[#5E625E]">
                  {user.completedTasks.pending} Pending
                </span>
              </div>
            </div>
          </div>

          {/* Right: Phone, Assigned Blocks & Active Assignment */}
          <div className="flex flex-col gap-4">
            <div>
              <span className="text-[11px] font-medium text-[#7B7E7B]">Phone number</span>
              <div className="text-sm font-semibold text-[#1C211B] mt-0.5">{user.phoneNumber}</div>
            </div>

            <div>
              <span className="text-[11px] font-medium text-[#7B7E7B]">Assigned Blocks</span>
              <div className="text-sm font-bold text-[#1C211B] mt-0.5">{user.assignedBlocksCount}</div>
            </div>

            {/* Active Assignment Box */}
            {user.activeAssignment && (
              <div className="border border-[#E2E5E6] rounded-xl p-4 bg-[#FAFCFE] mt-2">
                <span className="text-[11px] font-medium text-[#7B7E7B]">Active Assignment</span>
                <div className="flex items-center gap-1.5 mt-1 font-semibold text-xs text-[#1C211B]">
                  <svg className="w-3.5 h-3.5 text-[#5E625E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                  </svg>
                  <span>{user.activeAssignment.projectName}</span>
                </div>
                <div className="text-xs text-[#7B7E7B] mt-1 bg-[#EEF0F2] px-2 py-0.5 rounded inline-block">
                  {user.activeAssignment.location}
                </div>
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  <span className="text-xs px-2.5 py-0.5 rounded-md font-medium bg-[#F8F1E6] text-[#975F0B]">
                    {user.activeAssignment.validationsCount} Validations
                  </span>
                  <span className="text-xs px-2.5 py-0.5 rounded-md font-medium bg-[#FEEEED] text-[#C54A40]">
                    {user.activeAssignment.growthCheckCount} Growth check
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Map Banner with officer marker anchored to block and colored by UserState */}
      <MapBanner
        blockName={user.assignedBlockName || 'Kano Central Block'}
        blockPolygon={
          user.assignedBlockPolygon || [
            { lat: 12.0022, lng: 8.5919 },
            { lat: 12.0045, lng: 8.5955 },
            { lat: 12.0018, lng: 8.5982 },
            { lat: 11.9995, lng: 8.5942 },
          ]
        }
        peopleMarkers={[
          {
            id: user.id,
            name: user.name,
            role: user.role || 'Field Officer',
            personType: 'officer',
            userState:
              user.userState ||
              (user.status === 'Suspended'
                ? 'Suspended'
                : user.status === 'Pending'
                ? 'Pending'
                : 'Active'),
            blockId: 'JGW-BLC-097',
            blockName: user.assignedBlockName || 'Kano Central Block',
            subBlockName: 'Assigned Sub-Block',
            coordinate: user.assignedCoordinate || { lat: 12.0022, lng: 8.5919 },
            positionType: user.positionType || 'Captured',
            avatarSignedUrl: user.avatarSignedUrl,
            phone: user.phoneNumber,
            email: user.email,
          },
        ]}
        height="h-64 sm:h-72"
      />

      {/* 2-Column Split: Notifications & Stakeholders */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Notifications */}
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

        {/* Right: Tabbed Stakeholders */}
        <div className="lg:col-span-7 bg-[#FAFCFE] border border-[#E2E5E6] rounded-xl p-5 shadow-xs flex flex-col gap-4">
          <TabBar
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={(id) => setActiveTab(id as typeof activeTab)}
          />

          {/* Reports Tab - matches User Profile-11.png */}
          {activeTab === 'reports' && (
            <div className="flex flex-col gap-4">
              <SearchFilterBar
                searchQuery={stakeholderSearch}
                onSearchChange={setStakeholderSearch}
                searchPlaceholder="Search here"
              />

              <div className="flex flex-col gap-3">
                {(user.reportsList || DEFAULT_USER_REPORTS)
                  .filter(
                    (r) =>
                      r.treeId.toLowerCase().includes(stakeholderSearch.toLowerCase()) ||
                      r.campaign.toLowerCase().includes(stakeholderSearch.toLowerCase())
                  )
                  .map((r) => (
                    <ActivityItem
                      key={r.id}
                      title={r.treeId}
                      subtitle={r.campaign}
                      categoryTag={r.categoryTag}
                      statusBadge={r.statusBadge}
                      recordType={r.recordType}
                      officerName={r.officerName}
                      phoneNumber={r.phone}
                      timestamp={r.timestamp}
                      actionLabel="Review"
                      onAction={() =>
                        onReviewNotification && onReviewNotification(r.id)
                      }
                    />
                  ))}
              </div>
            </div>
          )}

          {/* Trees Tab - matches User Profile-10.png */}
          {activeTab === 'trees' && (
            <div className="flex flex-col gap-4">
              <SearchFilterBar
                searchQuery={stakeholderSearch}
                onSearchChange={setStakeholderSearch}
                searchPlaceholder="Search here"
              />

              <div className="flex flex-col gap-3">
                {(user.treesList || DEFAULT_USER_TREES)
                  .filter(
                    (t) =>
                      t.id.toLowerCase().includes(stakeholderSearch.toLowerCase()) ||
                      t.blockCode.toLowerCase().includes(stakeholderSearch.toLowerCase())
                  )
                  .map((t) => (
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
                        <StatusBadge status={t.status} variant="pill" />
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-[#7B7E7B]">
                        <span className="font-mono">{t.coordinateText}</span>
                        <span>•</span>
                        <span>{t.campaign}</span>
                        <span>•</span>
                        <span>{t.timestamp}</span>
                      </div>

                      <div className="flex justify-end pt-2 border-t border-[#EEF0F2]">
                        <button
                          type="button"
                          onClick={() => onViewTree && onViewTree(t.id)}
                          className="px-4 py-1.5 rounded-lg bg-[#2E5421] text-[#FAFCFE] text-xs font-semibold hover:bg-[#28461D] transition-colors cursor-pointer"
                        >
                          View Profile
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Blocks Tab - matches User Profile-7.png */}
          {activeTab === 'blocks' && (
            <div className="flex flex-col gap-4">
              <SearchFilterBar
                searchQuery={stakeholderSearch}
                onSearchChange={setStakeholderSearch}
                searchPlaceholder="Search here"
              />

              <div className="flex flex-col gap-3">
                {(user.assignedBlockItems || DEFAULT_USER_BLOCKS)
                  .filter(
                    (b) =>
                      b.code.toLowerCase().includes(stakeholderSearch.toLowerCase()) ||
                      b.location.toLowerCase().includes(stakeholderSearch.toLowerCase())
                  )
                  .map((b) => (
                    <div
                      key={b.id}
                      className="border border-[#E2E5E6] rounded-xl p-4 bg-[#FAFCFE] flex flex-col gap-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-[#3C7429]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth={1.5} />
                            <path d="M3 9h18M9 21V9" strokeWidth={1.5} />
                          </svg>
                          <h4 className="text-sm font-bold text-[#1C211B]">{b.code}</h4>
                        </div>
                        <span className="text-xs font-semibold text-[#2E5421] bg-[#EAF7EE] px-2.5 py-0.5 rounded-full">
                          {b.sizeHectares} hectares
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-[#7B7E7B]">
                        <span>{b.location}</span>
                        <span>•</span>
                        <span>{b.campaign}</span>
                      </div>

                      <div className="flex justify-end pt-2 border-t border-[#EEF0F2]">
                        <button
                          type="button"
                          onClick={() => onViewBlock && onViewBlock(b.id)}
                          className="px-4 py-1.5 rounded-lg bg-[#2E5421] text-[#FAFCFE] text-xs font-semibold hover:bg-[#28461D] transition-colors cursor-pointer"
                        >
                          View Block
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Custodians Tab - matches User Profile-8.png & 9.png */}
          {activeTab === 'custodians' && (
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
                    No records found
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
                          <h4 className="text-sm font-bold text-[#1C211B]">{s.name}</h4>
                        </div>
                        <StatusBadge status={s.role} variant="outline" />
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-[#7B7E7B]">
                        <span>{s.phone}</span>
                        <span>{s.cluster}</span>
                        <span>{s.timestamp}</span>
                      </div>

                      <div className="flex justify-end pt-2 border-t border-[#EEF0F2]">
                        <button
                          type="button"
                          onClick={() => handleViewRelatedProfile(s)}
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
        </div>
      </div>

      {/* Related Custodian Modal */}
      {selectedRelatedCustodian && (
        <CustodianIndividual
          isOpen={Boolean(selectedRelatedCustodian)}
          onClose={() => setSelectedRelatedCustodian(null)}
          onBack={() => setSelectedRelatedCustodian(null)}
          custodian={selectedRelatedCustodian}
        />
      )}
    </div>
  );
};
