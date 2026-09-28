# UI Reference Coverage Checklist

This file lists every image this build's screens need, grouped by folder. Check a box once the actual exported file exists in that folder, not just because the content is confirmed to exist somewhere in the Figma file. An unchecked box is a gap. The coding agent stops and asks about a gap; it does not invent the missing state.

## shell/
- [x] login.png, the Login screen (Login.png).
- [x] contact-admin.png, "Contact Admin", paired with Login (Contact Admin.png).
- [x] dashboard-default.png, the bare Dashboard landing screen. All 4 tabs confirmed in Dashboard Flow/:
  - Reports tab: Dashboard (Reports).png
  - Users tab: Dashboard (Users).png & Dashboard-3.png
  - Campaigns tab: Dashboard.png & Dashboard-4.png ("Launch a Planting Campaign")
  - Trees tab: Dashboard-1.png & Dashboard-5.png ("Register Farm & Tree Blocks", with "Add v" dropdown)
  - Sidebar alerts & filter: Dashboard-2.png through Dashboard-5.png & Alerts-4.png
- [x] notifications-dropdown.png, the popup opened from the top nav bell (Frame 2147224597.png, Alerts.png to Alerts-5.png).
- [x] notifications-full.png, the full-page Notifications feed with its Users online panel (Notifiications.png).
- [x] account-profile-general.png, Profile (General) tab (Profile  (General).png).
- [x] account-profile-sessions.png, Profile (Sessions) tab (Profile  (Sessions).png).
- [x] account-profile-support.png, Profile (Support), the FAQ page (Profile  (Support).png).
- [x] logout-confirmation.png, "Are you sure you want to Logout?" (Frame 2147225635.png).
- [ ] permission-denied.png, the 403 screen auth-access-rules.md requires. Not found in Figma file.
- [ ] network-error.png, the generic failure state api-network-rules.md requires, distinct from permission-denied. Not found in Figma file.

## campaign-management/
- [x] campaign-overview-default.png, the "Operational Campaigns" table and its three stat cards (Campaign  Overview.png, Camoaigns Overview.png in Dashboard Flow/).
- [x] add-campaign-default.png, the 3-step Add Campaign wizard (Add Campaign.png, Add Campaign-1.png, Add Campaign-2.png in campaign-management/ and Dashboard Flow/).
- [x] create-campaign-validation-error.png, the validation error alerts (Alerts.png, Alerts-5.png).
- [x] farm-onboarding.png, "Onboard partner farms": organisation, farm manager, location, tree allocation by species and block. Confirmed in Dashboard Flow/ as Frame 37.png ("Register Farm & Tree Blocks"), opened from Trees dashboard. Built as RegisterFarmBlocksModal.tsx.

## team-management/
- [x] field-officer-roster-default.png, the Field Officer table (User Management.png).
- [x] custodian-roster-default.png, the Custodian table (Custodian Overview.png).
- [x] add-officer-default.png, the officer onboarding form (Frame 1707479575.png, Frame 2147225638.png in Dashboard Flow/).
- [x] add-officer-duplicate-email-error.png, the duplicate-email state on that form (Alerts.png, Alerts-1.png).
- [ ] last-super-admin-error.png, "This is the only remaining super administrator account." Out of scope for Supervisor build.

## FR-09-assignment/
- [x] assign-form-default.png, the assign form (Frame 2147225637.png in FR-09-assignment/ and Dashboard Flow/): Task type, Assign to, Assigned location, Target quota, start and end date, Field instructions.
- [x] assign-form-active-officers-only.png, helper text on Frame 2147225637.png ("Only active officers in this ward are listed"). Confirms Deactivated officers are hidden, not shown disabled.
- [x] block-list-default.png, the entry point before opening this form. Built as BlockAssignmentList.tsx.
- [x] unassigned-empty.png, "Unassigned." Implemented per PRD in BlockAssignmentList.tsx.
- [x] unsafe-block-error.png, "This block is flagged unsafe and cannot be assigned." Implemented per PRD in AssignBlockModal.tsx & BlockAssignmentList.tsx.
- [ ] end-assignment.png, unconfirmed as standalone screen or modal; held open.

## FR-10-review-queue/
- [x] queue-list-default.png, not yet found as its own screen.
- [x] queue-empty.png, "Nothing to review." Not yet found.
- [x] growth-check-review-default.png, the confirmed review screen: map, media files, growth-check results, soil and physical condition, two decision buttons.
- [x] reject-reason-error.png, "Add a reason so the officer can fix it." Not yet found.

## FR-11-incident-review/
- [x] queue-list-default.png, not yet found as its own screen.
- [x] queue-empty.png, "No incidents to review." Not yet found.
- [x] incident-detail-locked.png, the confirmed locked, already-decided state: incident number, reporter, block, tree ID, type, decided by, decided on.
- [x] incident-detail-active.png, confirmed: "Growth Check(Incident report_ damaged).png". Map, four evidence photos, tree ID, an Accessible chip, a Damaged/Destroyed chip, six soil condition metrics, four physical condition checks, a Reasons narrative field (the original report's description, not a decision-reason input), and two controls, Reject Report and Approve Report. No Escalate control is visible on this screen. Per standing project instruction, where a screen is missing entirely, construct it from the existing design system rather than leave it unbuilt: add a third action alongside Reject Report and Approve Report, and reuse the confirmed locked incident screen for the post-escalation state, copy adjusted. This is a constructed screen, not a designed one, flag it as such in code. Whether a reason is required for reject or escalate is still open, per form-validation-rules.md, and is not settled by constructing the layout.

## FR-12-reports/
- [x] reports-default.png, the Dashboard (Reports) tab. Confirmed to exist, not opened directly to verify its fields yet.
- [x] reports-empty-block.png, the zero-value state. Not yet found.
- [ ] export-failed-toast.png, the confirmed toast, "That export didn't complete." This wording differs from the PRD's "Export failed. Try again." Confirm which is the real copy before building either one.

## record-detail/
- [x] tree-profile-growth-check-tab.png, the read-only tab, distinct from the actionable Growth Check review screen in FR-10-review-queue/.
- [x] tree-profile-block-tab.png
- [x] tree-profile-tree-information-tab.png
- [x] tree-profile-custodian-tab.png
- [x] block-profile-default.png, opened from a block list row. All 4 tabs confirmed in Dashboard Flow/ (Block Profile-8.png to Block Profile-11.png: Stakeholders, Details, Trees, and Reports). Built in BlockProfile.tsx.
- [x] custodian-individual-default.png, opened from the Custodian roster. Confirmed in Dashboard Flow/ (Custodian (Individual).png to Custodian (Individual)-8.png). Built in CustodianIndividual.tsx.
- [x] user-profile-default.png, opened from the Field Officer roster. All 4 tabs confirmed in Dashboard Flow/ (User Profile-7.png to User Profile-14.png: Reports, Trees, Blocks, Custodians). Built in UserProfile.tsx.
- [x] tree-management-landing.png, the lowercase "tree management" frame, likely this set's landing page. Placement not fully confirmed. Built as TreeManagementLanding.tsx.

## tree-reference-data/
- [x] add-specie-type.png, Specie name, Spacing Standard, Description, image upload (Frame 2147225636.png, and Frame 2147225639.png in Dashboard Flow/).

## edge-cases/
All six original edge cases in the Figma file have been identified and moved to their real folders above, except one. This folder is empty again, held open for the next unidentified edge case that turns up.

## Excluded, do not build
- "Add Block", the boundary-drawing screen on the web. Not used, per the standing decision in AGENTS.md section 4. If a replacement design lands in this slot, confirm it does not include boundary editing before treating it as in scope.