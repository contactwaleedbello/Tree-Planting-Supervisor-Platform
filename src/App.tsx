/**
 * App.tsx
 *
 * Root component of the Green Legacy Tree Planting Supervisor Platform (Version 2).
 * Wires persistent AppShell navigation rail to all in-scope Supervisor modules:
 * - Authentication: LoginScreen & ContactAdminModal
 * - Dashboard: DashboardDefault
 * - Users: FieldOfficerRoster (FR-Team)
 * - Beneficiaries: CustodianRoster
 * - Campaigns: CampaignOverview
 * - Report Management: ReportsOverview (FR-12)
 * - Block Management: BlockAssignmentList (FR-09)
 * - Tree Management: ReviewQueueList (FR-10) and IncidentQueueList (FR-11)
 * - Notifications: NotificationsPage
 * - Account Settings: AccountSettingsScreen (General, Sessions, Support)
 */

import React, { useState } from 'react';
import {
  AppShell,
  NavItemKey,
  LoginScreen,
  DashboardDefault,
  NotificationsPage,
  AccountSettingsScreen,
  AlertToast,
} from './components/shell';
import {
  CampaignOverview,
  AddCampaignModal,
  RegisterFarmBlocksModal,
} from './features/campaign-management';
import { FieldOfficerRoster, CustodianRoster } from './features/team-management';
import { BlockAssignmentList, AssignBlockModal } from './features/assignment';
import { ReviewQueueList, GrowthCheckReview } from './features/review';
import { IncidentQueueList, IncidentReview, IncidentRecordData } from './features/incidents';
import { GrowthCheckRecord } from './features/review/types/review';
import { ReportsOverview } from './features/reports';
import { AddSpecieTypeModal } from './features/tree-reference-data';

import { TreeManagementLanding } from './features/record-detail';

import { ReviewRecordType } from './types/states';

export const App: React.FC = () => {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  // Active navigation rail tab
  const [currentNav, setCurrentNav] = useState<NavItemKey>('dashboard');

  // Sub-tab switcher for Tree Management: Overview landing (tree management.png) vs Review Queue (FR-10) vs Incident Review (FR-11)
  const [treeTab, setTreeTab] = useState<'overview' | 'review' | 'incidents'>('overview');
  const [isAddSpecieOpen, setIsAddSpecieOpen] = useState(false);
  const [isAddCampaignOpen, setIsAddCampaignOpen] = useState(false);
  const [isRegisterFarmBlocksOpen, setIsRegisterFarmBlocksOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<{
    title: string;
    message: string;
    variant?: 'success' | 'error' | 'info';
  } | null>(null);

  // Unified review and assign state across Dashboard, Notifications & Reports
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [activeReviewRecord, setActiveReviewRecord] = useState<GrowthCheckRecord | null>(null);
  const [activeIncidentRecord, setActiveIncidentRecord] = useState<IncidentRecordData | null>(null);

  const handleAssignReport = () => {
    setIsAssignModalOpen(true);
  };

  const handleReviewItem = (recordType: ReviewRecordType, id?: string) => {

    if (recordType === 'incident') {
      setActiveIncidentRecord({
        id: id || 'Maize/b23/Alph/00045',
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
        reasons: 'An active forest fire creates an extremely dangerous and non-permissible zone of inaccessibility.',
        photos: [
          {
            id: 'inc-photo-1',
            signedUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
            altText: 'Damaged trunk',
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
      });
    } else {
      setActiveReviewRecord({
        id: id || 'gc-001',
        treeId: 'Maize/b23/Alph/00045',
        systemTreeNumber: '7890',
        blockId: 'JGW-BLC-097',
        species: 'Mouringa',
        extensionOfficerName: 'Waleed Aliyu',
        submittedAt: 'Today 10:25 PM',
        state: 'Needs Review',
        coordinates: { lat: 23.4556, lng: 23.4556 },
        accessibility: 'Accessible',
        photos: [
          {
            id: 'gc-photo-1',
            signedUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
            altText: 'Canopy and foliage condition',
          },
        ],
        additionalComments: 'Regular growth check audit.',
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
      });
    }
  };

  // Handle logout
  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  // If not authenticated, render LoginScreen
  if (!isAuthenticated) {
    return (
      <LoginScreen
        onLoginSuccess={() => {
          setIsAuthenticated(true);
          setCurrentNav('dashboard');
        }}
      />
    );
  }

  return (
    <AppShell
      currentNav={currentNav}
      onNavigate={(nav) => setCurrentNav(nav)}
      pageTitle={
        currentNav === 'dashboard'
          ? 'Dashboard Overview'
          : currentNav === 'users'
          ? 'Users Overview'
          : currentNav === 'beneficiaries'
          ? 'Custodian Overview'
          : currentNav === 'campaigns'
          ? 'Campaign Management Overview'
          : currentNav === 'reports'
          ? 'Reports Overview'
          : currentNav === 'blocks'
          ? 'Block Assignments'
          : currentNav === 'trees'
          ? 'Tree Management'
          : currentNav === 'notifications'
          ? 'Notifications'
          : 'Account Settings'
      }
      userInitials="AB"
      onLogoutConfirm={handleLogout}
    >
      {/* Direct Review Screen overlays (when triggered from Dashboard or Notifications) */}
      {activeReviewRecord && (
        <div className="flex flex-col gap-4 p-4 sm:p-6 max-w-7xl mx-auto">
          <button
            type="button"
            onClick={() => setActiveReviewRecord(null)}
            className="inline-flex items-center gap-2 text-xs font-bold text-[#2E5421] hover:underline self-start mb-2 cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back</span>
          </button>
          <GrowthCheckReview
            record={activeReviewRecord}
            onBack={() => setActiveReviewRecord(null)}
            onDecisionComplete={() => setActiveReviewRecord(null)}
          />
        </div>
      )}

      {activeIncidentRecord && (
        <div className="flex flex-col gap-4 p-4 sm:p-6 max-w-7xl mx-auto">
          <button
            type="button"
            onClick={() => setActiveIncidentRecord(null)}
            className="inline-flex items-center gap-2 text-xs font-bold text-[#2E5421] hover:underline self-start mb-2 cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back</span>
          </button>
          <IncidentReview
            incident={activeIncidentRecord}
            onBack={() => setActiveIncidentRecord(null)}
          />
        </div>
      )}

      {/* Main navigation views (when no direct review screen is open) */}
      {!activeReviewRecord && !activeIncidentRecord && (
        <>
          {currentNav === 'dashboard' && (
            <DashboardDefault
              onNavigateToNotifications={() => setCurrentNav('notifications')}
              onAssignReportClick={handleAssignReport}
              onAddOfficerClick={() => setCurrentNav('users')}
              onInitiateCampaignClick={() => setIsAddCampaignOpen(true)}
              onAddBlockClick={() => setIsRegisterFarmBlocksOpen(true)}
              onAddTreeSpecieClick={() => setIsAddSpecieOpen(true)}
              onReviewItemClick={handleReviewItem}
              onNavigateToCampaigns={() => setCurrentNav('campaigns')}
              onNavigateToReports={() => setCurrentNav('reports')}
            />
          )}

          {currentNav === 'users' && (
            <FieldOfficerRoster
              onNavigateToNotifications={() => setCurrentNav('notifications')}
            />
          )}

          {currentNav === 'beneficiaries' && <CustodianRoster />}

          {currentNav === 'campaigns' && <CampaignOverview />}

          {currentNav === 'reports' && <ReportsOverview />}

          {currentNav === 'blocks' && (
            <BlockAssignmentList
              onNavigateToNotifications={() => setCurrentNav('notifications')}
            />
          )}

          {currentNav === 'trees' && (
            <div className="flex flex-col gap-6">
              {/* Tree Management Header Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-4 sm:px-6 pt-4 max-w-7xl mx-auto w-full">
                {/* Tab switch between Tree Overview, Review Queue (FR-10), and Incident Review (FR-11) */}
                <div className="flex items-center gap-2 p-1 bg-[#EEF0F2] rounded-xl self-start">
                  <button
                    type="button"
                    onClick={() => setTreeTab('overview')}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                      treeTab === 'overview'
                        ? 'bg-white text-[#2E5421] shadow-xs'
                        : 'text-[#5E625E] hover:text-[#1C211B]'
                    }`}
                  >
                    Tree Overview
                  </button>
                  <button
                    type="button"
                    onClick={() => setTreeTab('review')}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                      treeTab === 'review'
                        ? 'bg-white text-[#2E5421] shadow-xs'
                        : 'text-[#5E625E] hover:text-[#1C211B]'
                    }`}
                  >
                    Review Queue (FR-10)
                  </button>
                  <button
                    type="button"
                    onClick={() => setTreeTab('incidents')}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                      treeTab === 'incidents'
                        ? 'bg-white text-[#2E5421] shadow-xs'
                        : 'text-[#5E625E] hover:text-[#1C211B]'
                    }`}
                  >
                    Incident Review (FR-11)
                  </button>
                </div>

                {/* Add Specie Reference Action */}
                <button
                  type="button"
                  onClick={() => setIsAddSpecieOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 border border-[#C97A3E] text-[#8C532B] hover:bg-[#FDF8F3] rounded-lg text-xs font-semibold transition-colors self-start sm:self-auto cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Register Tree Specie</span>
                </button>
              </div>

              {/* Active Tree Sub-module */}
              {treeTab === 'overview' && <TreeManagementLanding />}
              {treeTab === 'review' && <ReviewQueueList />}
              {treeTab === 'incidents' && <IncidentQueueList />}

              {/* Add Specie Type Modal */}
              <AddSpecieTypeModal
                isOpen={isAddSpecieOpen}
                onClose={() => setIsAddSpecieOpen(false)}
                onSuccess={() => setIsAddSpecieOpen(false)}
              />
            </div>
          )}

          {currentNav === 'notifications' && (
            <NotificationsPage
              onAssignReportClick={handleAssignReport}
              onReviewItemClick={handleReviewItem}
            />
          )}

          {currentNav === 'settings' && <AccountSettingsScreen />}
        </>
      )}

      {/* Assign Block Modal triggered globally */}
      <AssignBlockModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        onSuccess={() => {
          setIsAssignModalOpen(false);
          setToastMessage({
            title: 'Task assigned!',
            message: 'Amina Bello has been notified and routed to Neem Block Audit.',
            variant: 'success',
          });
        }}
      />

      {/* Launch Planting Campaign Modal */}
      <AddCampaignModal
        isOpen={isAddCampaignOpen}
        onClose={() => setIsAddCampaignOpen(false)}
        onSuccess={() => {
          setIsAddCampaignOpen(false);
          setToastMessage({
            title: 'Campaign created and ready to grow!',
            message: 'Green Canopy Initiative – Phase 1 is live.',
            variant: 'success',
          });
        }}
      />

      {/* Register Farm & Tree Blocks Modal */}
      <RegisterFarmBlocksModal
        isOpen={isRegisterFarmBlocksOpen}
        onClose={() => setIsRegisterFarmBlocksOpen(false)}
        onSuccess={(summary) => {
          setIsRegisterFarmBlocksOpen(false);
          setToastMessage({
            title: 'Farm & Tree Blocks Registered!',
            message: `${summary.organisationName} is active with ${summary.totalTrees} trees across ${summary.blockCount} blocks.`,
            variant: 'success',
          });
        }}
      />

      {/* Global Toast Alert matching Alerts.png - Alerts-5.png */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-3 duration-200">
          <AlertToast
            title={toastMessage.title}
            message={toastMessage.message}
            variant={toastMessage.variant}
            onClose={() => setToastMessage(null)}
          />
        </div>
      )}
    </AppShell>
  );
};

export default App;
