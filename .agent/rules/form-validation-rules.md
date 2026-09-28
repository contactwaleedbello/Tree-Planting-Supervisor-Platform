---
trigger: model_decision
description: Apply when building or editing a form, a submit action, or any control that approves, rejects, or blocks based on a required field or a condition.
---

# form-validation-rules.md

One job: how a blocking rule behaves in code. This file does not hold the wording a blocked action shows. That wording is exact PRD text and lives in AGENTS.md section 8. This file holds the pattern, not the copy.

## Rules

1. A submit action never fires while a required condition is unmet.
Reason: firing the action first and rejecting it after creates a moment where a record looks submitted but is not. A button that will not click yet is clearer than a submission that quietly fails.

2. Show the blocking reason inline, next to the field or action it blocks, not as a separate banner or toast.
Reason: a banner disconnected from the field makes the user hunt for what is wrong. AGENTS.md and the PRD already give the exact wording for each blocked action; this rule only governs where that wording appears, not what it says.

3. On the FR-09 assignment form, Block, EO, and start date are required before save enables. Custodian and end date are optional.
Reason: the PRD's own FR-09 input list marks end date as optional and describes custodian as optional in its flow text, and marks nothing else that way. Every other requirement in the PRD follows the same pattern: an input not marked optional is required for save.

4. Rejecting a record (FR-10) has its reject action disabled until a reason is entered.
Reason: a reason-less reject leaves the EO with nothing to fix, which defeats the purpose of sending the record back.

5. Assigning a block flagged Unsafe (FR-09) is blocked at the point of selecting that block, not after the save action fires.
Reason: letting the user pick an Unsafe block and only refusing on save wastes a step and reads as a bug rather than a deliberate rule.

6. A blocked action never leaves the screen showing a record in two states at once, for example both still pending and already rejected.
Reason: this is a UI consistency rule, not a promise about the real backend. This build's backend is a placeholder, so this file cannot and does not guarantee transaction behavior once a real backend exists; it only guarantees the screen never shows a contradictory state.

7. A disabled control shows why it is disabled, not only that it is disabled.
Reason: a greyed-out button with no explanation reads as broken. The same button with a reason attached reads as a rule being enforced.

## Reject and escalate reasons

Rejecting an incident (FR-11) does not require a reason. The confirmed frame sequence, Pending, to Rejected with the reject control removed and approve disabled, to a Re-assign Task action, shows no reason-input step anywhere in between. This is not a PRD quote, it is read from the actual screens, strong enough to act on but not airtight; a reason step could in principle exist on a frame that was never exported.

Still open, ask before building: escalating an incident is a separate question. No reference screen for the act of escalating exists at all, so there is nothing to read this answer from the same way. Do not assume escalate follows reject's pattern.