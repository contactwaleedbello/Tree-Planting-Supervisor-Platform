# **Green Legacy Tree Planting Platform, Version 2**

## **Product Requirements Document (revised)**

**Product:** Green Legacy Tree Planting Platform (stakeholder-facing name: Version 2\) 

**Status:** Draft PRD for review. Baseline for the Version 2 prototype. This revision closes the lapses found in the section-by-section review. 

**Source of truth:** The approved refined idea, "Green Legacy Tree Planting Platform, Version 2: Final Product Direction." 

**Date:** 28 August 2026

## **1\. Product Summary**

Version 2 of the Green Legacy Tree Planting Platform is a field data system that gives every tree a unique, trackable identity and organises field work by mapped areas called blocks.

It has field-facing parts and office-facing parts. Extension Officers use an offline-capable mobile app to register new trees, confirm existing ones, run growth and health checks, report incidents, and navigate to a specific tree. Supervisors also work on the ground to map blocks and sub-blocks, so the Supervisor tool is offline-capable and location-aware for mapping, and web-based for assignment, review, and reports. A Super Admin uses a web console to manage users, reference data, tags, and escalations. A Custodian uses a narrow read-only view of the trees in their assigned block.

The product exists so Green Legacy can prove, tree by tree, what was planted, where, by whom, and in what condition, and can report survival honestly to funders and carbon or ESG reviewers.

ASSUMPTION: the Extension Officer app and the Supervisor mapping tool run on Android field devices with offline storage and location access; the Supervisor review tools, the Super Admin console, and the Custodian view are responsive web apps. Reason: mapping is a field task that needs offline capture and GPS, while assignment, review, and administration are office tasks. The source TDD targets Android field devices and web dashboards, and no other platform was named.

## **2\. Problem**

Green Legacy plants and manages large numbers of trees across defined areas, but it cannot trace an individual tree through its life.

When a funder asks Green Legacy to prove last season's trees are still alive, nobody can point to one tree and show its planting date, its custodian, its last check, and a photo, because tree-by-tree history does not exist. An officer drives to a block with no clear list of which trees are due, rechecks some, misses others, and wastes the field day. A tree dies, a replacement goes in, and the old record is never closed, so the count is either doubled or the death is never reported.

The cost is threefold. Money is lost on wasted field trips. Time is lost redoing work that was never recorded. Trust is lost when survival numbers cannot survive an audit, and a funder hesitates on the next grant.

Note on measurement: the size of this problem is not quantified today, because no baseline exists. This build captures a first-cycle baseline so the gain can be shown, not just claimed. See Section 10\.

## **3\. Goals, with non-goals**

### **Goals**

* G1. Give every tree a unique, permanent system identity that holds its full history.  
* G2. Let an Extension Officer do a full field day offline and lose no record. A weak or missing GPS fix must never block the record of a real tree.  
* G3. Capture the best available position for every newly registered tree, labelled by quality, and a clearly marked approximate position for legacy trees where the data allows it.  
* G4. Make survival reportable per block, against a ground-truth denominator, backed by evidence a reviewer can check.  
* G5. Keep officers out of configuration, so the system survives officer turnover.  
* G6. Record who did what and when on every material action, on trusted time, for audit.

### **Non-goals**

* N1. No multi-organization or multi-tenant support. Green Legacy is the only operator.  
* N2. No batch "number of seedlings" record. The per-tree registry is the record. The ground-truth count of trees per block comes from the expected tree count set at mapping, not from a batch tally.  
* N3. No AI, machine learning, or photo-based species identification. A general tool already does the latter.  
* N4. No automated messages, reminders, agents, or follow-ups.  
* N5. No carbon or ESG report screen until Green Legacy names the outside standard it must follow. The underlying data is still captured.  
* N6. No self-service login for community members or the public.  
* N7. No public-facing or marketing surface. This is an internal operations tool.

## **4\. Users and Personas**

### **4.1 Extension Officer (EO), primary user**

Field-based, mobile-first, works in low or no connectivity. Not always permanent staff. Registers new trees, validates existing trees, runs growth and health checks, reports incidents, and navigates to trees. Cannot configure blocks, terrain, or reference data.

Persona: Ibrahim, responsible for a cluster of blocks near Kaduna. On planting days he registers fresh trees as they go in. On check days he confirms existing trees and runs checks. In season he opens the app most days, because it is his worklist.

### **4.2 Supervisor**

Office and field. Maps blocks and sub-blocks in the field, offline, with GPS. Assigns blocks to EOs and custodians. Is the first-line reviewer of submitted records. Reviews incidents and approves or escalates replacements. Sees block-level reports.

### **4.3 Super Admin**

Office. Manages users, roles, and permissions. Manages reference data. Loads the legacy-tree list. Issues tags and IDs. Settles escalated replacements and disputed reviews. Sees programme-wide reports.

### **4.4 Custodian**

A community or local caretaker assigned to a block or sub-block. Has a narrow read-only login that shows only the tree map and growth-check results for the block in their care. The custodian login is a confirmed, in-scope role, switched on for this deployment. The view is minimised to tree and check data and shows no officer personal details, in line with NDPA data minimisation.

## **5\. Scope**

### **5.1 In scope**

* Block and sub-block mapping and assignment, done offline in the field.  
* Unique tree identity, with a nursery-tracked sequence and a separate legacy sequence.  
* Physical tags (barcode or QR) issued at the nursery, carrying the tree ID.  
* New-tree registration with a captured position and a graceful fallback when no fix is available.  
* Existing-tree validation, from an uploaded list or field capture.  
* Growth checks and health checks on a schedule.  
* Incident reporting and the replacement workflow, with supervisor approval and super-admin escalation.  
* Navigation to a specific tree.  
* Offline capture and durable sync for both the EO app and the Supervisor mapping tool.  
* Supervisor review, approve, reject, and reports.  
* Super Admin user, role, reference-data, tag, and escalation management.  
* Custodian read-only view.  
* Block safety flag lifecycle: set, clear, and propagate, plus refusal to assign or route officers into unsafe blocks.  
* Full audit trail on material actions, on trusted time.

### **5.2 Out of scope**

* Multi-organization support.  
* Batch seedling counts.  
* AI or photo species identification.  
* Automated messages, reminders, agents, follow-ups.  
* Community or public self-registration.  
* A bespoke carbon or ESG report screen.

### **5.3 Deferred to a future version, with what this build must capture for it**

"Deferred" means not built as a screen or workflow in Version 2, and treated as a candidate for a future version. There is one Version 2 build. The right column is the obligation this build carries so the deferred item is cheap later.

| Deferred item | What this build must capture now |
| :---- | :---- |
| Survival, carbon, or ESG report screens tied to a named standard | Unique tree IDs, species, planting dates, status changes, mortality, positions with quality labels, condition readings, evidence photos, and a full audit trail, all exportable as plain data. |
| Automated reminders for due checks | Check schedules and due dates per tree, and officer and custodian contact details, stored but never sent. |
| Custodian follow-up features | Custodian assignments at block or sub-block level. |
| Advanced measurement hardware (for example height or diameter tools) | Growth-check fields structured so a measured value, its unit, and its capture method can be stored without a schema change. |

## **6\. Functional Requirements**

Notation used below. Every requirement has a user story, a trigger, a flow, inputs, outputs, an empty state, an error state, and acceptance criteria. Acceptance criteria are written so each has a clear pass or fail.

Shared record states, used across many requirements:

* **Draft:** saved locally, not queued.  
* **Pending Sync:** queued, waiting for network.  
* **Synchronizing:** upload in progress.  
* **Submitted:** the server has acknowledged the record.  
* **Sync Failed:** upload failed and will retry.  
* **Needs Review:** submitted and waiting for a supervisor.  
* **Verified:** a supervisor approved it.  
* **Rejected:** a supervisor rejected it and sent it back.

ASSUMPTION: registrations, validations, growth checks, and incidents all require supervisor review before they count as Verified. Reason: the refined idea makes supervisor review the single quality gate, and survival reporting depends on it.

Position quality labels, used across several requirements:

* **Captured:** read from the device at the tree, with an accuracy value.  
* **Low Accuracy:** captured, but the accuracy value is poor.  
* **Simulated (Approximate):** computed from block boundary, spacing, arrangement, and count.  
* **Unknown:** no position yet, pending a field capture.

### **FR-01. Offline worklist**

**User story.** As an EO, I want to open the app with no signal and see my blocks and what is due, so I can work a full day offline.

**Trigger.** EO opens the app.

**Flow.** App loads the data cached at last successful sync. It shows assigned blocks, trees, and due tasks. It shows the last-sync time and any records still pending.

**Inputs.** EO identity and the data set downloaded at last login.

**Outputs.** A list of assigned blocks, a due-task count per block, and a sync status banner.

**Empty state.** If the EO has no assignment, the app shows "No blocks assigned yet. Ask your supervisor." with no task list. If the EO is assigned but has no due tasks, each block shows "Nothing due."

**Error state.** If no cached data exists because the EO has never synced, the app shows "You need to connect once before working offline." and blocks field capture until a first sync succeeds.

**Acceptance criteria.**

* AC1. With the device in airplane mode, the app opens and shows the blocks present at last successful sync.  
* AC2. The app displays the last-sync timestamp.  
* AC3. The due-task count per block equals the number of tasks with a due date on or before today for that block in the cached data.  
* AC4. An EO with zero assignments sees the no-assignment message and no task list.  
* AC5. An EO who has never synced cannot open any capture form and sees the connect-once message.

### **FR-02. Register a new tree**

**User story.** As an EO, I want to register a newly planted tree while standing at it, so it gets a real identity and the best position available.

**Trigger.** EO taps "Register tree" inside an assigned block, or scans a nursery tag.

**Flow.** EO scans the tag or selects the block. App tries to read the device position and its accuracy. EO enters species, planting date, and takes at least one photo. EO reviews and saves. App creates a tree record, links it to the block, sets origin to nursery-tracked, records the position with its quality label, and queues it to sync.

**Inputs.** Tag ID (scanned or system-generated), block, species, planting date, one or two photos, and a position (Captured, Low Accuracy, or Unknown with a reason).

**Outputs.** A new tree record with a unique ID, a labelled position, and a first growth-check task created per the check schedule. Any tree not labelled Captured is added to a position-follow-up list.

**Empty state.** Not applicable. This form always creates a new record.

**Error state.** If the app cannot read a position, it warns "No location yet. Move to open sky or wait." If a position still cannot be read after a set wait, the EO can save with the position marked Low Accuracy, or marked Unknown with a required reason. The app never blocks registration of a real tree the officer is standing at. If the scanned tag already maps to a tree, the app opens that tree instead of creating a duplicate.

**Acceptance criteria.**

* AC1. Save is blocked until species, planting date, and at least one photo are present. Position is stored as Captured with an accuracy value, or, when no fix is available, as Low Accuracy or Unknown with a reason. A missing GPS fix never blocks registration.  
* AC2. The saved tree has a unique ID that does not collide with any nursery or legacy ID.  
* AC3. A saved position stores latitude, longitude, and accuracy where available, and is labelled Captured, Low Accuracy, or Unknown in every view. Any tree not labelled Captured appears in the position-follow-up list.  
* AC4. Registering creates exactly one first growth-check task for that tree, dated per the active check schedule.  
* AC5. Scanning a tag that already maps to a tree opens that tree and creates no new record.  
* AC6. The record enters Pending Sync when saved offline and Submitted after the server acknowledges it.

### **FR-03. Validate an existing tree**

**User story.** As an EO, I want to confirm a tree that is already in the ground, so its record is current and trustworthy.

**Trigger.** EO opens an existing tree from the block list or map, or scans its tag.

**Flow.** App shows the tree's known details. EO checks ID, species, and condition against what is in front of them, takes a photo, and confirms. App records a validation event on that tree.

**Inputs.** Tree ID, confirmed species, condition selection, one or two photos, and the captured position if available.

**Outputs.** A validation event added to the tree history, with actor and timestamp. The tree's last-validated date updates on Submitted and Verified.

**Empty state.** If the block has no existing trees loaded, the tree list shows "No existing trees loaded for this block yet." and validation is unavailable until a legacy list is loaded or trees are field-captured.

**Error state.** If the scanned tag does not match any known tree, the app offers two clear paths: "Register as new tree" or "Flag for supervisor." It does not guess a match.

**Acceptance criteria.**

* AC1. Validation cannot complete without a condition selection and at least one photo.  
* AC2. A completed validation appends an event to the tree history and never overwrites a prior event.  
* AC3. An unmatched tag never auto-links to an existing tree; the EO must choose register or flag.  
* AC4. A block with no loaded or captured existing trees shows the empty message and disables validation.  
* AC5. The tree's last-validated date changes only after the validation reaches Submitted.

### **FR-04. Growth and health check**

**User story.** As an EO, I want to record a growth or health check on a due tree, so its condition over time is on record.

**Trigger.** EO opens a due check task.

**Flow.** App shows the tree and the required fields for this check type. EO enters measurements and condition readings and takes a photo. EO submits. App adds the check to the tree history and closes the task.

**Inputs.** Tree ID, measurement values with units, soil and physical condition selections, optional pH value, at least one photo.

**Outputs.** A growth-check record on the tree, the task marked done, and the next scheduled check created if the schedule defines one.

**Empty state.** If no checks are due, the check list for the block shows "Nothing due."

**Error state.** If a numeric reading is outside the allowed range for its field, the app shows an inline message naming the field and the allowed range, and blocks submit until it is fixed. ASSUMPTION: allowed ranges come from reference data set by the Super Admin. Reason: ranges vary by species and must be editable without a code change.

**Acceptance criteria.**

* AC1. Submit is blocked until all required fields for the check type are present.  
* AC2. A reading outside its configured range is rejected inline with the field name and range shown.  
* AC3. Submitting a check marks the source task as done and creates the next scheduled check where the schedule defines one.  
* AC4. Each measurement is stored as a value, a unit, and a capture method.  
* AC5. The check appears in the tree history with actor and timestamp.

### **FR-05. Report an incident**

**User story.** As an EO, I want to report damage or loss on a tree and recommend a replacement, so the supervisor can act.

**Trigger.** EO opens a tree and taps "Report incident."

**Flow.** EO selects a category and a severity, writes a description and the action taken, takes a photo, and optionally recommends replacement. EO submits. App records the incident and routes it to the supervisor.

**Inputs.** Tree ID, incident category, severity, description, action taken, at least one photo, replacement recommendation flag.

**Outputs.** An incident record linked to the tree, set to Needs Review, and the tree status set to Incident-Flagged.

**Empty state.** Not applicable. This form always creates a record.

**Error state.** If category, severity, description, or photo is missing, submit is blocked with an inline message on the missing field.

**Acceptance criteria.**

* AC1. Submit is blocked without a category, a severity, a description, and at least one photo.  
* AC2. A submitted incident sets the tree status to Incident-Flagged.  
* AC3. The incident is linked to the tree and appears in the tree history.  
* AC4. Only a supervisor or super admin can change the incident status after submission; the EO cannot.  
* AC5. The category list matches the reference data configured by the Super Admin.  
* AC6. Severity is required and is stored on the incident.

### **FR-06. Navigate to a tree**

**User story.** As an EO, I want to be guided to a specific tree, so I can find the right one in a block.

**Trigger.** EO selects a tree and taps "Navigate."

**Flow.** App shows a walking guide from the EO's current position to the tree's stored position. On arrival, the EO scans the tag to confirm the exact tree.

**Inputs.** EO current position, tree stored position and its label, tree tag.

**Outputs.** A directional guide, a distance readout, and a tag-scan confirmation step.

**Empty state.** If the tree position is Unknown, the app shows "No position for this tree yet." and offers to capture one on arrival.

**Error state.** If the device has no current position, the app shows "No location. Move to open sky." and shows the tree on the block map without live guidance.

**Acceptance criteria.**

* AC1. A tree with a Simulated or Low Accuracy position shows an "Approximate" label throughout navigation.  
* AC2. The distance readout updates as the EO moves.  
* AC3. The confirm step requires a tag scan that matches the target tree; a non-matching scan shows a mismatch message.  
* AC4. A tree with an Unknown position offers position capture and does not show a false route.

### **FR-07. Offline capture and sync**

**User story.** As an EO, I want everything I capture offline to sync safely later, so no record is lost or duplicated.

**Trigger.** Any capture while offline, and any later return to network.

**Flow.** Each record is written to an encrypted local store and given a client operation ID. When network returns, a background process uploads records in order, then pulls authorized changes. The server acknowledges each record and maps local IDs to server IDs.

**Inputs.** Local records with client operation IDs and payload versions.

**Outputs.** Server-acknowledged records, updated states, and a sync summary.

**Empty state.** If nothing is queued, the sync panel shows "All synced" with the last-sync time.

**Error state.** On a transient failure, the record stays queued and retries, and the user can retry manually. On a conflict, the record is set to Needs Review with a plain reason, and the server copy is not overwritten.

**Acceptance criteria.**

* AC1. A record captured offline is never lost across app restart; it reappears in its saved state.  
* AC2. Re-sending the same client operation ID does not create a duplicate record on the server.  
* AC3. A sync conflict sets the record to Needs Review and leaves the server copy unchanged.  
* AC4. Local records are stored encrypted. Logout is blocked while any record is Draft, Pending Sync, or Sync Failed, with a message to sync first. Only fully synced cached data is cleared on logout. Unsynced records are never wiped.  
* AC5. Every record shows one of the shared states at all times, never a blank state.

### **FR-08. Terrain and block mapping (Supervisor)**

**User story.** As a Supervisor, I want to map a block and its sub-blocks in the field, so field work has a real area to hang on.

**Trigger.** Supervisor starts a mapping task for a new or existing block.

**Flow.** In the field, the Supervisor walks or marks the block boundary and captures its coordinates offline, optionally divides it into sub-blocks, sets a unique block code, records the spacing standard, the planting arrangement, and the expected tree count, sets the safety flag, and saves. On sync, the block becomes available for assignment.

**Inputs.** Boundary coordinates, block code, sub-block boundaries, spacing standard, planting arrangement, expected tree count, safety flag.

**Outputs.** A saved block with a polygon boundary, sub-blocks, and a status of Mapped.

**Empty state.** The block list starts empty and shows "No blocks mapped yet. Map your first block."

**Error state.** If a block code is not unique, or the boundary is not a closed shape, save is blocked with a specific message.

**Acceptance criteria.**

* AC1. A block cannot be saved without a closed boundary and a unique code.  
* AC2. A sub-block boundary must sit inside its parent block boundary, or save is blocked.  
* AC3. Only a Supervisor or Super Admin can create or edit a block; an EO account cannot reach this screen.  
* AC4. Setting a block safety flag to Unsafe removes it from new assignment and from EO navigation, and, on the next sync, locks the block in any EO app that holds it.  
* AC5. Mapping works offline and syncs later, like field capture.  
* AC6. The saved spacing standard, planting arrangement, and expected tree count are stored on the block, and simulated positioning is only offered when all three, plus the boundary, are present.  
* AC7. When a block is flagged Unsafe, an EO who has it cached sees a prominent Unsafe banner and cannot start new work in it after the next sync. An EO who is fully offline cannot be reached until they reconnect, which is recorded as an accepted limit in the risk register (R2).

### **FR-09. Assign blocks (Supervisor)**

**User story.** As a Supervisor, I want to assign a block to an EO and a custodian, so responsibility is clear.

**Trigger.** Supervisor opens a mapped block and adds an assignment.

**Flow.** Supervisor selects an EO and a start date, and optionally a custodian at block or sub-block level. Save creates the assignment. On the EO's next sync, the block appears in their worklist.

**Inputs.** Block, EO, custodian, start date, optional end date.

**Outputs.** An active BlockAssignment, and the block appears for the EO and custodian.

**Empty state.** A block with no assignment shows "Unassigned."

**Error state.** Assigning an Unsafe block is blocked with "This block is flagged unsafe and cannot be assigned."

**Acceptance criteria.**

* AC1. A new assignment appears in the EO worklist after the EO's next successful sync.  
* AC2. Ending an assignment returns the block to the unassigned pool and stops new writes by that EO to that block.  
* AC3. An Unsafe block cannot be assigned to any EO.  
* AC4. A custodian assignment grants read-only access to only that block or sub-block.

### **FR-10. Review queue (Supervisor)**

**User story.** As a Supervisor, I want to review submitted records and approve or reject them, so only sound data counts.

**Trigger.** A submitted record arrives in the review queue.

**Flow.** Supervisor opens a record, checks the evidence photos, condition, and position, and approves or rejects. Approve sets Verified. Reject sets Rejected and sends it back to the EO with a reason.

**Inputs.** The submitted record, its evidence, and the supervisor decision and reason.

**Outputs.** A record set to Verified or Rejected, and an audit event for the decision.

**Empty state.** An empty queue shows "Nothing to review."

**Error state.** If a reject has no reason, the reject action is blocked with "Add a reason so the officer can fix it."

**Acceptance criteria.**

* AC1. Approving a record sets it to Verified and counts it in reports.  
* AC2. Rejecting a record sets it to Rejected, requires a reason, and returns it to the submitting EO to rework and resubmit.  
* AC3. The original submitted record and its history are preserved after a reject; nothing is deleted.  
* AC4. Every approve or reject writes an audit event with actor, time, and decision.

### **FR-11. Incident review and replacement (Supervisor and Super Admin)**

**User story.** As a Supervisor, I want to review an incident and approve or escalate a replacement, so damaged trees are handled and counted correctly.

**Trigger.** An incident set to Needs Review arrives.

**Flow.** Supervisor reviews the incident. Supervisor approves a replacement, rejects it, or escalates to the Super Admin. On approval, the workflow guides the EO to register and link the replacement tree, preserving both tree histories. Escalated incidents go to the Super Admin, who makes the final call.

**Inputs.** Incident record, decision, reason, and, on approval, the linked replacement tree.

**Outputs.** A replacement decision, a link between original tree, incident, and replacement tree, and updated tree statuses.

**Empty state.** No incidents shows "No incidents to review."

**Error state.** Linking a replacement before the incident is approved is blocked. Closing an already-replaced incident twice is blocked.

**Acceptance criteria.**

* AC1. A replacement can be linked only after the incident is approved.  
* AC2. Linking a replacement preserves the original tree record and its history, and sets the original tree status to Replaced.  
* AC3. A supervisor can escalate an incident to the Super Admin, and only the Super Admin can decide an escalated incident.  
* AC4. An incident cannot be closed as replaced more than once.

### **FR-12. Block-level reports (Supervisor)**

**User story.** As a Supervisor, I want block-level reports, so I can see status across my blocks.

**Trigger.** Supervisor opens reports.

**Flow.** App aggregates verified records by block and status and shows counts and coverage. Supervisor can export.

**Inputs.** Verified records for the supervisor's blocks, and each block's expected tree count.

**Outputs.** Counts by status, verified check coverage per block, registration coverage per block, and an export file.

**Empty state.** A block with no verified records shows zeros, not blank panels.

**Error state.** If an export fails, the app shows "Export failed. Try again." and does not produce a partial file.

**Acceptance criteria.**

* AC1. Report figures count only Verified records.  
* AC2. Verified check coverage per block equals verified trees with a check in the monitoring window divided by the block's expected tree count.  
* AC3. Registration coverage per block equals registered trees divided by the block's expected tree count.  
* AC4. Empty blocks render zero values, not blank or fake data.  
* AC5. An export produces a complete file or none.

### **FR-13. User and role management (Super Admin)**

**User story.** As a Super Admin, I want to create and deactivate users and set roles, so access is controlled.

**Trigger.** Super Admin opens user management.

**Flow.** Super Admin creates a user, assigns a role, and later can deactivate. Deactivation blocks login at once and keeps all records.

**Inputs.** Name, contact, role, and status.

**Outputs.** A user account with a role, and an audit event on create or deactivate.

**Empty state.** A fresh system shows only the seeded Super Admin account.

**Error state.** Creating a user with a duplicate login identifier is blocked with a specific message.

**Acceptance criteria.**

* AC1. A deactivated user cannot log in, on the next auth attempt, on any client.  
* AC2. Deactivation preserves the user's submitted records and registered trees under audit history; nothing is deleted.  
* AC3. A user's role controls which screens and actions they can reach, checked on the server for every action.  
* AC4. Create and deactivate each write an audit event.  
* AC5. Deactivation never orphans unsynced field records. If the user's device still holds a queue, the system allows a final authenticated drain of that device, or a supervisor triggers a reconciliation, before any device data is cleared.

### **FR-14. Reference data management (Super Admin)**

**User story.** As a Super Admin, I want to manage species, spacing standards, check schedules, and incident categories, so the field forms stay correct without a code change.

**Trigger.** Super Admin opens reference data.

**Flow.** Super Admin adds or edits a reference item and saves. Field forms use the current values.

**Inputs.** Species, spacing standards, check schedules, incident categories, and reading ranges.

**Outputs.** Updated reference lists used by all field forms.

**Empty state.** Each reference list starts with a seeded default set and can be edited. ASSUMPTION: the system ships with a starter set for each list. Reason: field forms cannot function with empty pick lists on day one.

**Error state.** Deleting a reference item that is in use is blocked with "This item is in use and cannot be deleted. Retire it instead."

**Acceptance criteria.**

* AC1. A change to a reference list appears in the field forms after the next sync.  
* AC2. An in-use reference item cannot be deleted, only retired.  
* AC3. Retiring an item hides it from new entries but keeps it on old records.

### **FR-15. Load the legacy-tree list (Super Admin)**

**User story.** As a Super Admin, I want to upload an existing-tree list when one exists, so officers can validate rather than re-register.

**Trigger.** Super Admin uploads a file, or confirms no list exists.

**Flow.** Super Admin uploads a structured file. The system checks it, assigns legacy-sequence IDs where missing, and links each tree to a block. If no list exists, officers capture those trees in the field under the legacy sequence.

**Inputs.** A structured legacy-tree file, or a "no list" confirmation.

**Outputs.** Legacy trees loaded and linked to blocks, each on the legacy sequence.

**Empty state.** Before any load, blocks show "No existing trees loaded" and field capture is the route.

**Error state.** A malformed file is rejected with a per-row error report, and no partial load occurs.

**Acceptance criteria.**

* AC1. Loaded legacy trees receive IDs on the legacy sequence, distinct from the nursery sequence.  
* AC2. A malformed file produces a row-level error report and loads nothing.  
* AC3. Each loaded tree links to exactly one block.  
* AC4. A loaded legacy tree gets a Simulated position marked Approximate only when its block has boundary, spacing, arrangement, and count. Otherwise its position is Unknown until an officer captures it in the field.

### **FR-16. Tag and ID issuance (Super Admin)**

**User story.** As a Super Admin, I want to issue tags and IDs, so nursery trees carry their identity to the farm.

**Trigger.** Super Admin issues a batch of tags for the nursery.

**Flow.** Super Admin generates a batch of unique IDs on the nursery sequence, each bound to a barcode or QR value. Nursery staff apply tags. On registration, the scan links the physical tag to the tree record.

**Inputs.** Tag batch size and the tag type in use.

**Outputs.** A set of unique, unused tag IDs ready to bind to trees.

**Empty state.** No tags issued shows "No tags issued yet."

**Error state.** Binding a tag that is already bound to another tree is blocked with a duplicate message. When a nursery tag is lost or damaged, the officer opens the existing tree record and binds a new tag to it, which keeps the original system ID. A genuinely untagged legacy tree gets a new legacy-sequence ID on a button press.

**Acceptance criteria.**

* AC1. Issued tag IDs are unique and start unbound.  
* AC2. A tag can bind to at most one tree.  
* AC3. When a nursery tag is lost or damaged, the officer opens the existing tree record from the block map or list, confirms it, and binds a new tag to it. Binding re-uses the original system ID and creates no new record. The system never auto-matches a fresh tag to an old tree without this confirmation.  
* AC4. A genuinely untagged tree can be given a new legacy-sequence ID in one action.

### **FR-17. Settle escalations (Super Admin)**

**User story.** As a Super Admin, I want to decide escalated replacements and disputed reviews, so hard cases have a final owner.

**Trigger.** A supervisor escalates an incident or a review dispute.

**Flow.** Super Admin opens the escalated item, reviews the history and evidence, and makes the final decision, which the system records and applies.

**Inputs.** The escalated item, its history, and the super-admin decision and reason.

**Outputs.** A final decision, applied and audited.

**Empty state.** No escalations shows "Nothing escalated."

**Error state.** A decision without a reason is blocked.

**Acceptance criteria.**

* AC1. Only the Super Admin can decide an escalated item.  
* AC2. A final decision records a reason and an audit event.  
* AC3. The decision applies to the item and is visible to the originating supervisor and EO.

### **FR-18. Programme-wide reports (Super Admin)**

**User story.** As a Super Admin, I want programme-wide reports and a plain data export, so Green Legacy can report outward.

**Trigger.** Super Admin opens reports.

**Flow.** App aggregates verified data across all blocks and offers a plain export of the underlying records.

**Inputs.** Verified records across the programme, and each block's expected tree count.

**Outputs.** Programme-wide counts, coverage, and a plain data export.

**Empty state.** A new programme shows zeros.

**Error state.** A failed export shows an error and produces no partial file.

**Acceptance criteria.**

* AC1. Programme figures count only Verified records.  
* AC2. The plain export includes tree ID, origin, species, planting date, status, last check date, position label, and block, at minimum.  
* AC3. No carbon or ESG scoring is computed, because no standard is set.

### **FR-19. Custodian read-only view**

**User story.** As a Custodian, I want to see the trees and growth results for my block, so I can keep an eye on them.

**Trigger.** Custodian logs in.

**Flow.** App shows a read-only tree map and growth-check results for the custodian's assigned block only.

**Inputs.** Custodian identity and block assignment.

**Outputs.** A read-only map and a list of growth-check results for the assigned block.

**Empty state.** A custodian with no assigned block sees "No block assigned yet."

**Error state.** Any attempt to reach another block or any write action returns "Not allowed."

**Acceptance criteria.**

* AC1. A custodian sees only their assigned block, and no other block's data.  
* AC2. A custodian has no create, edit, approve, or configure action anywhere.  
* AC3. The custodian view shows tree and check data only, and no officer contact details, in line with NDPA data minimisation.

## **7\. AI and AI-Related Tools and Solutions**

Omitted by design. This product has no AI, machine-learning, or retrieval component. Photo-based species identification was explicitly cut, because a general tool already does it and it fails the own-data test. Simulated tree positioning is deterministic geometry from the block boundary, spacing, arrangement, and count, not a model. Position steadying where GPS is weak uses the phone's built-in sensor handling, not a model this product trains or calls. There is no chat, no generated text, and no external knowledge lookup. The honesty rules that an AI section would demand still apply to computed positions, and they live in Section 8.5.

## **8\. Technical Architecture**

### **8.1 Shape**

Four clients talk to one backend over a versioned API. ASSUMPTION: a REST or JSON API, an object store for photos, and a map provider for boundaries and positions. Reason: the source TDD proposes these and the requirements above assume request or response calls, private media, and boundary display.

* **EO mobile app (Android):** offline-first, local encrypted store, durable sync queue, camera, location, and tag scanning.  
* **Supervisor tool:** offline-capable and location-aware for field mapping, web-based for assignment, review, and reports.  
* **Super Admin web console:** users, reference data, tags, legacy load, escalations, and reports.  
* **Custodian web view:** read-only map and results.  
* **Backend:** authentication, role and object authorization, validation, sync processing, media handling, reporting, and an audit log.

### **8.2 Cross-cutting rules**

* Authorization is checked on the server for every action, never trusted from the client.  
* Offline writes carry a client operation ID, so re-sends never duplicate.  
* On conflict, the server copy stands and the client record is set to Needs Review.  
* Material actions write an immutable audit event.  
* Every record stores both the device time of capture and the server time of receipt. The server time is authoritative for ordering, audit, and the monitoring window. A large gap between the two is flagged as possible device-clock drift.  
* Personal data cached on a device is encrypted. Cached data is cleared on logout only after all records have synced. Logout is blocked while records are pending, and unsynced records are never wiped.  
* Media is private, with time-limited access.

### **8.3 Data model, logical object model**

ASSUMPTION: relational, as stated in the locked constraints. Reason: the traceability and reporting needs map to tables and joins. Key entities and their important fields follow. IDs are unique. History is append-only; submitted records are corrected through a new event, not an overwrite.

* **ProgrammeArea:** id, name, level (State, LGA, Ward), parentId.  
* **Block:** id, code (unique), programmeAreaId, boundaryPolygon, spacingStandardId, plantingArrangement, expectedTreeCount, safetyFlag (Safe, Unsafe), status (Draft, Mapped, Active, Retired).  
* **SubBlock:** id, blockId, code, boundaryPolygon.  
* **User:** id, name, contact, role (EO, Supervisor, SuperAdmin, Custodian), status (Active, Deactivated).  
* **BlockAssignment:** id, blockId or subBlockId, userId, assigneeType (EO, Custodian), startDate, endDate, status (Active, Ended).  
* **Tree:** id, blockId, subBlockId, systemId (unique), origin (NurseryTracked, Legacy, Replacement), sequence (Nursery, Legacy), tagValue, tagType (Barcode, QR, None), speciesId, position (lat, lng, accuracy), positionLabel (Captured, LowAccuracy, Simulated, Unknown), plantingDate, custodianAssignmentId, status (Active, IncidentFlagged, Dead, Replaced).  
* **TreeRegistration:** id, treeId, actorId, position, positionLabel, photos, deviceTime, serverTime, recordState.  
* **TreeValidation:** id, treeId, actorId, condition, photos, position, deviceTime, serverTime, recordState.  
* **MonitoringTask:** id, treeId, type (GrowthCheck, HealthCheck), dueDate, assigneeId, status (Open, Done), sourceScheduleId.  
* **GrowthCheck:** id, treeId, taskId, measurements (value, unit, method), soilCondition, physicalCondition, phValue, photos, actorId, deviceTime, serverTime, recordState.  
* **Incident:** id, treeId, categoryId, severity, description, actionTaken, photos, replacementRecommended, status (Reported, NeedsReview, ReplacementApproved, ReplacementRejected, Escalated, Closed), actorId, deviceTime, serverTime.  
* **ReplacementDecision:** id, incidentId, decision, reason, approverId, decidedAt, escalated (yes, no).  
* **TreeReplacement:** id, originalTreeId, incidentId, replacementTreeId.  
* **MediaAsset:** id, ownerRecordId, checksum, captureLat, captureLng, captureTime, storageKey, uploadState.  
* **SyncOperation:** id, clientOperationId (unique), userId, entity, action, payloadVersion, status, attempts, error.  
* **AuditEvent:** id, actorId, action, entity, entityId, beforeRef, afterRef, deviceTime, serverTime, location, clientVersion.  
* **Reference:** Species (id, name, readingRanges), SpacingStandard (id, name, spacingValue), CheckSchedule (id, name, cadence, checkType), IncidentCategory (id, name, active).

### **8.4 ERD**

erDiagram  
    ProgrammeArea ||--o{ Block : contains  
    Block ||--o{ SubBlock : divides  
    Block ||--o{ Tree : holds  
    Block ||--o{ BlockAssignment : has  
    User ||--o{ BlockAssignment : holds  
    Tree ||--|| TreeRegistration : "registered by"  
    Tree ||--o{ TreeValidation : "validated by"  
    Tree ||--o{ MonitoringTask : schedules  
    Tree ||--o{ GrowthCheck : records  
    Tree ||--o{ Incident : reports  
    Incident ||--o| ReplacementDecision : decides  
    Incident ||--o| TreeReplacement : links  
    Tree ||--o{ MediaAsset : has  
    Species ||--o{ Tree : classifies  
    SpacingStandard ||--o{ Block : sets  
    CheckSchedule ||--o{ MonitoringTask : drives  
    IncidentCategory ||--o{ Incident : types  
    User ||--o{ AuditEvent : acts

### **8.5 Positioning method and its limits**

Positions come from two methods. A Captured position is read from the device at the tree and stored with an accuracy value; a poor accuracy value is labelled Low Accuracy. A Simulated position is computed from the block boundary, the spacing standard, the planting arrangement, and the tree count. Simulation is only possible when all four are known. When they are not, the position is Unknown until an officer captures it.

Every non-captured position is labelled Approximate or Unknown in every view. No position is ever reported to an outside body as an exact location. There is no model or learned component; the simulation is arithmetic.

The Supervisor mapping tool captures boundaries offline and syncs like the field app, because mapping happens on the ground.

## **9\. Operating and Value Model**

This is an operating model, not a commercial business model. It is an internal operations platform built for a single operator, Green Legacy, by DET.

Access is governed by an active account, an assigned role, and, for officers, an active block assignment. There is no paywall and no per-seat billing inside the product. When an officer leaves, the account is deactivated, not deleted, and their blocks return to the unassigned pool.

Data is jointly owned by Green Legacy and DET. When the contract ends, DET returns Green Legacy's data on request.

The value is operational, not transactional. It comes from records that survive an audit, survival numbers Green Legacy can defend to funders, and fewer wasted field trips. These are claims, not yet measured. This build captures a baseline in the first monitoring cycle so the value can be shown through the metrics in Section 10, not just asserted.

ASSUMPTION: DET is paid through a build and operate arrangement, not through revenue from the platform. Reason: the engagement context describes DET building and operating for Green Legacy, and no in-product revenue was described. Confirm this in the contract.

## **10\. Success Metrics**

Each metric has a formula. Targets are set with Green Legacy after a first-cycle baseline. No target is invented here, because an invented number gets quoted back as a commitment.

* **M1. Verified check coverage per block.** Verified trees with a check inside the monitoring window, divided by the block's expected tree count set at mapping. The expected tree count, not the system's own registrations, is the ground-truth denominator, so the metric does not measure the system against itself. ASSUMPTION: the monitoring window is the cadence set in the check schedule. Reason: no fixed window was given, so the schedule defines it. Dependency: M1 is only as accurate as the expected tree count; see R11.  
* **M1b. Registration coverage per block.** Registered trees divided by the block's expected tree count. This shows how much of a mapped block is actually recorded. It is the closest honest stand-in for the ground truth the cut batch count would have given. A low value means trees exist that the system does not know about.  
* **M2. Data-quality guardrail, not a success metric.** The registration form blocks incomplete saves, so completeness is 100 percent by construction. Reported as a check that the controls hold, not as evidence of success.  
* **M3. Data-quality guardrail, not a success metric.** Review blocks records without a photo, so evidence completeness is 100 percent by construction. Reported as a check that the controls hold, not as evidence of success.  
* **M4. Sync success rate.** Records that reach Submitted without manual intervention, divided by all submitted records. Target set after a first-cycle baseline, because network conditions are unknown.  
* **M5. Review turnaround.** Median time from Submitted to Verified or Rejected, on server time. Lower is better. Target set with supervisors.  
* **M6. Incident to replacement time.** Median time from incident approval to a linked replacement tree. Lower is better.  
* **M7. Officer adoption.** EOs who submitted at least one record in a period, divided by assigned EOs. Target set after a first-cycle baseline.

## **11\. Risks**

Ordered by severity, not likelihood. Each risk names an owner and a detection signal.

| ID | Risk | Guard | Owner | Detection signal |
| :---- | :---- | :---- | :---- | :---- |
| R1 | Trust and audit failure. A simulated or unconfirmed record is reported as settled fact, and an audit finds trees not where the system claims. | Label non-captured positions Approximate or Unknown, capture real positions at registration, require evidence before Verified, hold the review gate. | Super Admin | Share of outward-reported records that are not Verified or are not Captured. |
| R2 | Officer safety, including the offline delay in propagating an Unsafe flag. A block turns unsafe while an officer is offline with it cached. | Block safety flag, refusal to assign or route into Unsafe blocks, lock on next sync, prominent banner. Accepted limit: a fully offline officer cannot be warned until reconnect. | Supervisor | Count of blocks flagged Unsafe with active offline assignments. |
| R3 | Data loss or duplication at scale. Heavy queues on poor networks drop or duplicate records. | Durable encrypted queue, client operation IDs that cannot apply twice, visible sync states, duplicate checks, tested recovery, no wipe of unsynced records. | DevOps | Sync failure rate and queue age above a set threshold. |
| R4 | No legacy list on day one. Validation has nothing to work on until field capture fills the gap. | Support both upload and field capture, honest empty states. | Super Admin | Blocks with legacy trees expected but none loaded or captured. |
| R11 | Inaccurate expected tree count. The metric denominator is wrong, so coverage is wrong. | Capture the count at mapping, review it against registrations, correct with an audited change. | Supervisor | Blocks where registration coverage exceeds 100 percent or is implausibly low. |
| R5 | Missing arrangement data for legacy blocks. Simulated positions cannot be computed. | Fall back to Unknown position and field capture, never invent a position. | Supervisor | Legacy trees with Unknown position by block. |
| R6 | GPS accuracy under canopy. Navigation lands near, not on, the tree. | Sensor steadying, an accuracy value stored with each position, tag scan as the final confirmation. | DevOps | Share of positions labelled Low Accuracy. |
| R7 | Tag process dependency. Nursery tagging and tag durability sit partly outside the software. | The system ID is the truth, tags are re-linkable by officer confirmation, damaged tags have a defined recovery path. | Super Admin | Count of tag re-link events. |
| R8 | Personal data exposure. The system holds names, numbers, and locations. | NDPA data minimisation, role-scoped visibility, device encryption, wipe of synced cache on logout. | Super Admin | Access reviews and any report of over-broad visibility. |
| R9 | Scope creep after prototype. New asks reopen an approved prototype. | The severity check in change control, with a written record for anything held for a future version. | Product | New requests logged after prototype approval. |

## **12\. Open Questions**

These do not block design. They must be answered before or during build. Several route to Halima and the Chairman by the plan the minutes set.

* Q1. The tagging method: barcode or QR, and the exact nursery-to-farm process.  
* Q2. Whether a legacy-tree list exists to upload, or field capture is the only route on day one.  
* Q3. The confirmed incident categories. Proposed default: physical damage, pest or disease, drought or water stress, fire, animal or livestock damage, theft or vandalism, mortality, and other.  
* Q4. The real spacing standards and planting arrangement per species, since simulated positions depend on them.  
* Q5. Whether a formal carbon or ESG report is wanted, and if so, the exact outside standard it must follow. Until then, only a plain data export is built.  
* Q6. The Android device baseline. Suggested default: Android 9 and above. ASSUMPTION, reason: it covers most low-cost field phones while allowing modern camera and location handling. This is at the front-end engineer's discretion.  
* Q7. The confirmed DET software stack, since the source TDD leaves frameworks, database engine, map provider, and media storage as open decisions.  
* Q8. The confirmed monitoring window for M1, so the metric has a fixed period.  
* Q9. Whether arrangement data exists for legacy blocks, which decides how many legacy trees can be positioned at all.  
* Q10. Confirmation that the Supervisor mapping tool is delivered as an offline, location-aware Android tool, matching Section 1\.  
* Q11. Data ownership specifics in the contract, to back the joint-ownership and return-on-request rule.