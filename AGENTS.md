# AGENTS.md

This file is the standing context for coding sessions in this project. Read it in full before touching code.

## 1. Product Name
Green Legacy Tree Planting Platform. The PRD's stakeholder-facing name for this build is "Version 2." The source PRD is a draft baseline, dated 28 August 2026, with an unresolved Open Questions section. Check that section before treating any PRD line as final.

## 2. Who Uses The Product
- Extension Officer (EO): field role, offline Android app. Registers trees, validates trees, runs growth and health checks, reports incidents, navigates to trees. Not part of this build.
- Supervisor: office and field role. Maps blocks and sub-blocks in the field, offline, with GPS, on a separate mobile app, not this build. Is web-based for assignment, review, and reports. This is the current build target, and the only role this build covers.
- Super Admin: office role, web console. Shares much of the Supervisor's capability plus some dashboard-only additions. Deferred to a later build phase, not part of this one.
- Custodian: read-only web view of one assigned block, no officer contact details. Not part of this build.

## 3. Reference Map
Open the matching source before building anything. Do not rely on memory of an earlier session.

| Source | Path | Use it for |
|---|---|---|
| PRD | /context/Green_Legacy_PRD_v2.md | Every behavior, flow, empty state, error state, and business rule. FR numbers in this file point here. |
| UI reference images | /design/ui-reference/ | Every layout, composition, and component state shown in an exported picture of the Figma design. Subfolders: shell/, campaign-management/, team-management/, FR-09-assignment/, FR-10-review-queue/, FR-11-incident-review/, FR-12-reports/, record-detail/, tree-reference-data/, edge-cases/. |
| Design tokens | /context/design-tokens.json | Every color, spacing, and type value used in code. Trace every Tailwind class to a token here, never a hardcoded hex or px value. |
| Agent rules | /.agents/rules/ | Single-purpose rule files: folder structure, exact status and label values, form and submit behavior, Supervisor access scope, the placeholder data layer, and photo and file handling. Open the matching file before working in that area. |
| Thresholds | /RULES.md | Numeric ranges, environment variable names, and other config values. Does not exist yet. |

These paths are the recommended convention for this repo. If the actual location differs, update this table to match, and do not assume a file exists at a path that has not been confirmed here.
/design/ui-reference/ is organized into one subfolder per flow, named by FR number, for example FR-10-review-queue/, plus a shell/ subfolder for persistent navigation and cross-cutting screens like permission-denied and network-failure. Inside each subfolder, name each file by the state it shows, for example empty.png or unsafe-block-error.png. The full expected list for every folder is in /design/ui-reference/COVERAGE.md. An unchecked item there is a gap, not something to invent.
An image cannot be relied on for an exact hex code, pixel value, or font size. Get those from /context/design-tokens.json. A component state not captured in its own image, such as hover, focus, or disabled, is not verifiable from this source; treat it as undefined and ask, rather than guessing it from a static picture.
If a source is missing or silent on something needed to build a screen, stop and ask. Do not guess and do not fill the gap from another session's memory.

## 4. Scope For This Build
In scope, matched to PRD requirement numbers:
- FR-09 Assign blocks: assign an EO and, optionally, a custodian, to a mapped block.
- FR-10 Review queue: approve or reject submitted registrations, validations, and growth checks.
- FR-11 Incident review, Supervisor portion: approve, reject, or escalate an incident.
- FR-12 Block-level reports: status counts, verified check coverage, registration coverage, export.

Also in scope, confirmed additions beyond the original V2 PRD document, added through later design decisions, not omissions:
- Campaign management: a campaign is a tree-planting season or drive, with a target tree count, an approved species list, and start and end dates. A campaign contains blocks and has officers assigned to it. This is very likely how a Supervisor's "own blocks" (section 9 of this file, auth-access-rules.md) actually get determined; confirm the exact mechanism before building the filter.
- Team management: a standing roster of Field Officers (the PRD's EO) and a standing roster of Custodians, each showing status, contact, assignment, and task or tree-allocation counts. Distinct from FR-09's one-at-a-time assignment action.
- Notifications: an activity feed of system events (report submitted, reviewed, approved; user, block, or campaign added; a security alert). This is a log of what already happened, not a reminder or a follow-up, so it does not conflict with PRD non-goal N4.
- Account settings: a Profile area with General, Sessions, and Support tabs.
- Species reference data (Add Specie Type): the PRD gives this to Super Admin (FR-14). It now also appears on the Supervisor side; treat this as a confirmed decision, not an error, but keep it in its own folder so it stays easy to find.

Out of scope for this build:
- Block and sub-block mapping (FR-08), including drawing or editing a block boundary on a map. This is offline and GPS based, done on the separate mobile app, not the web app. One prototype screen in the Figma file, "Add Block", showed boundary drawing on the web with its own validation errors; that screen is explicitly excluded and will be replaced with a different design. If a reference image ever shows boundary editing on the web again, treat it the same way: excluded, not a signal to build it.
- Anything belonging to the EO app or the Custodian's own read-only login, as opposed to the Supervisor's view of Custodian data covered above.
- Multi-organization or multi-tenant support. PRD non-goal N1 states: "No multi-organization or multi-tenant support. Green Legacy is the only operator."
- Linking a replacement tree to an incident. FR-11 gives this action to the EO app, not the Supervisor screen. See section 8.

Ask before building anything not named above.

## 5. Stack
- React, Tailwind CSS, and Prisma are fixed by the project owner's direct instruction, not by the PRD or the UI reference images. Treat them as binding unless the owner changes them.
- React: functional components and hooks only. No class components.
- Tailwind CSS: utility classes only, mapped to /context/design-tokens.json. No separate CSS files unless asked.
- Prisma is the backend's ORM. This build does not write, read, or reference Prisma schema or any database code.
- Do not hardcode an endpoint name, a field name, or a schema shape from any source, including the PRD's data model in its Technical Architecture section, since that model is marked an assumption there. Use a placeholder data layer until a real API contract is given. Full rules for that layer live in /.agents/rules/api-network-rules.md.
- No new package, framework, or state library without asking first.

## 6. Folder Map
Feature and domain based structure. Full rules and the reasons behind them live in /.agents/rules/react-architecture-rules.md.

Proposed, unconfirmed feature folders for this build, matched to the requirement numbers in section 4:
- src/features/assignment/ (FR-09)
- src/features/review/ (FR-10)
- src/features/incidents/ (FR-11)
- src/features/reports/ (FR-12)
Get explicit confirmation in a session before creating any of these, even though they are named here.

## 7. UI Implementation Rule
Build every screen from the images in /design/ui-reference/ and from /context/design-tokens.json together. Tokens set the exact color, spacing, and type values. The reference images set the layout, composition, and which component state is shown. Do not copy layout or composition from an image until the matching file exists in /design/ui-reference/. The flows in section 8 must still be built from PRD text in the meantime, since behavior does not wait on visuals.
When a reference image does not show a state the PRD requires, an empty state, an error state, or a status label, build that state using the exact wording given in the matching PRD requirement. Do not invent wording.
Every position label and record state this build uses is locked in /.agents/rules/state-mapping-rules.md. Never invent, rename, or paraphrase one.

## 8. User Journeys For This Build
Build these flows from PRD text even where a reference image does not show them.

FR-09 Assign blocks
Trigger: Supervisor opens a mapped block and adds an assignment.
Flow: pick an EO, a start date, and, optionally, a custodian at block or sub-block level. Save creates the assignment. The assignment reaches the EO only after the EO's next successful sync; do not show or imply instant delivery. A separate action ends an assignment, returns the block to the unassigned pool, and stops further writes by that EO to that block.
Empty state: a block with no assignment shows "Unassigned."
Error state: assigning an Unsafe block is blocked, with "This block is flagged unsafe and cannot be assigned."

FR-10 Review queue
Trigger: a submitted registration, validation, or growth check reaches the queue. This queue is the system's single quality gate before a record counts as Verified. No bulk or blind approval action may be built.
Flow: open the record, check its photos, condition, and position, then approve or reject. Approve sets the record to Verified and writes an audit event. Reject requires a reason, sets it to Rejected, writes an audit event, and returns it to the EO to rework. The original record and its history are never deleted or overwritten.
Empty state: "Nothing to review."
Error state: a reject with no reason is blocked, with "Add a reason so the officer can fix it."

FR-11 Incident review, Supervisor portion
Trigger: an incident reaches Needs Review. This is a separate queue and a separate route from FR-10, not a tab on the same screen.
Flow: review the incident, then approve it for replacement, reject it, or escalate it to the Super Admin.
Empty state: "No incidents to review."
Error state: an escalated incident is decided by the Super Admin only, not actionable here. No reference image exists for the act of escalating itself. Build a third action alongside Reject Report and Approve Report, styled to match them, and once escalated, reuse the already-confirmed locked, already-decided incident screen, with its copy changed to say the incident is escalated and awaiting the Super Admin, rather than inventing a new screen. Whether escalating requires a reason is a separate, still-open question, not settled by building the visual. This build has no replacement-linking action. After a Supervisor approves an incident, the PRD gives the replacement link to the EO app. Show the incident status as ReplacementApproved and stop there.

FR-12 Block-level reports
Trigger: Supervisor opens reports.
Flow: view counts by status, verified check coverage per block, and registration coverage per block, for the supervisor's own blocks. Reports count only Verified records.
Export: an export action is available, but the PRD gives no column list or file format for this report, unlike the Super Admin's programme-wide export. Ask for both before building the export.
Empty state: a block with no verified records shows zero values, not blank panels.
Error state: a failed export shows "Export failed. Try again." and produces no partial file.

## 9. How To Work In This Codebase
- One change at a time. Do not bundle unrelated screens or fixes in one pass.
- Ask before adding a package, a route, or a flow not named in this file or the PRD.
- Never touch the database, an API contract, or backend code. This is a frontend-only build. Access and role behavior is defined in /.agents/rules/auth-access-rules.md.
- List every assumption made, at the end of every response, even a small one.
- If the PRD, /design/ui-reference/, and /context/design-tokens.json are all silent on something needed to build a screen, stop and ask. Do not guess.
- When implementing a screen, name the PRD requirement number it comes from.

## 10. Where The Detailed Rules Live
Single-purpose agent rule files live in /.agents/rules/, listed in section 3. Numeric thresholds, ranges, and environment variable names live in /RULES.md, not in this file and not in the agent rules. RULES.md does not exist yet. Create it only once those values are confirmed and given.

## 11. Definitions
- Block: a mapped field area with a boundary, a spacing standard, a planting arrangement, and an expected tree count.
- Sub-block: a smaller area inside a block boundary.
- Tree: one planted tree with a unique system ID and an origin, Nursery-Tracked, Legacy, or Replacement.
- Registration: a new tree's first record, holding species, planting date, and photos.
- Validation: a confirmation of a tree already in the ground, holding a condition selection and photos.
- Growth Check: a scheduled measurement record, holding values, units, soil and physical condition, and an optional pH reading.
- BlockAssignment: the link between a block or sub-block and an EO or a custodian, with a start date and an optional end date.
- Incident: a report of damage or loss on a tree, with a category, a severity, and an optional replacement recommendation.
- Escalation: a Supervisor sends an incident or a disputed review to the Super Admin for a final decision.
- Exact enum values, position labels, record states, and the M1 and M1b report formulas are locked in /.agents/rules/state-mapping-rules.md, not restated here.

## 12. One Thing The Agent Must Do Well
Never show a position or a record without its label or state, and never invent a label, a state, or a piece of wording that is not in the PRD, a reference image, or /context/design-tokens.json. The product exists to produce a survival record that can survive an audit, so an unlabeled or invented value is a bigger failure than a missed pixel.