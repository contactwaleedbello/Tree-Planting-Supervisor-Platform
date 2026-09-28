---
trigger: always_on
description: Locks the agent to the exact PRD-mandated string values for record states, position labels, tree statuses, and list empty states.
---

# state-mapping-rules.md

One job: lock the exact strings and formulas this product uses, so nothing gets invented, renamed, or paraphrased. This covers both fixed string values and the two report formulas, since the same discipline applies to a value the agent might otherwise be tempted to compute or word differently.

## Position labels

A position always carries exactly one of these four labels:
- Captured: read from the device at the tree, with an accuracy value.
- Low Accuracy: captured, but the accuracy value is poor.
- Simulated: computed from the block's boundary, spacing, and count. Displayed to the user as "Approximate."
- Unknown: no position captured yet.

The stored and compared value is always Simulated. "Approximate" is display text only and is never the value checked, filtered, or stored anywhere in code.

Reason: the PRD allows only these four values. A position shown with no label reads as an exact location, which is the one claim this product is built never to make. Confusing the display text with the stored value would make a filter or a status check silently fail.

## Record states, this build

A record in this build always carries exactly one of these four states:
- Submitted
- Needs Review
- Verified
- Rejected

Reason: these are the only states a record reaches once it leaves the offline EO app and lands in this web app. Draft, Pending Sync, Synchronizing, and Sync Failed belong to that offline app. They never appear in this build's UI, since a record here has already synced by definition.

## Incident states

An incident always carries exactly one of these six states:
- Reported
- NeedsReview
- ReplacementApproved
- ReplacementRejected
- Escalated
- Closed

Reason: these come directly from the PRD's incident record. FR-11's review screen renders and moves between exactly these states, not a shortened or reworded version of them.

## Tree states

A tree always carries exactly one of these four states:
- Active
- IncidentFlagged
- Dead
- Replaced

Reason: the review and incident screens display a tree's current state. Inventing a fifth state, or renaming one of these, breaks any screen that later filters or counts by state.

## Block states

A block always carries exactly one of these four states:
- Draft
- Mapped
- Active
- Retired

A block also carries a separate safety flag, one of:
- Safe
- Unsafe

Reason: the assignment screen (FR-09) blocks assigning an Unsafe block. The safety flag has to be its own value, not folded into the block's main state, or that check has nothing distinct to test against.

## Block assignment states

A block assignment always carries exactly one of these two states:
- Active
- Ended

Reason: the unassign action in FR-09 needs a clear state to move a record into. An assignment that is simply deleted leaves no record that it ever existed.

## User states

A user always carries exactly one of these four states:
- Active
- Suspended
- Pending
- Deactivated

Reason: User Management, Field Officer Roster, and User Profile define these four lifecycle states for an officer account.

## Custodian types

A custodian always carries exactly one of these two types:
- Individual
- Block

Reason: Custodian Management and Custodian Individual records discriminate by allocation structure (Individual vs. Block). Custodian Type is a structural category, not an account lifecycle status or safety flag.

## Report formulas

Verified check coverage, called M1: verified trees with a check inside the monitoring window, divided by the block's expected tree count.
Reason: the expected tree count is the ground truth denominator on purpose. Using the system's own registration count instead would measure the system against itself.

Registration coverage, called M1b: registered trees divided by the block's expected tree count.
Reason: same denominator as M1, a different numerator. Do not substitute total trees, verified trees, or any other count for either formula's numerator or denominator.

The block-level report screen (FR-12) counts only Verified records in every figure it shows.
Reason: a Needs Review or Rejected record has not cleared the product's single quality gate yet. Counting it would overstate coverage before the review step has done its job.