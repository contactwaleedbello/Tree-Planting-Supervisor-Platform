---
name: review-and-decide-screen
description: Assemble one screen that shows a record's evidence photos, its current state, and a decision control that moves it to its next state.
---

1. Confirm which records this screen shows, using the Supervisor own-blocks scope already applied in this feature's scaffold.
2. Build the queue list first, one row per record in scope. Each row opens that record's own detail view for the remaining steps.
3. Load each record's evidence photos through a signed URL, applying file-and-media-rules.md in full, including its fallback behavior.
4. Show the record's current state using the exact label state-mapping-rules.md gives for it.
5. Build the decision control using the gated-action-control skill, with this screen's own required fields and outcome states.
6. On a successful decision, transition the record to the exact next state state-mapping-rules.md names for that outcome, and nothing else on the record.
7. If an outcome sends the record to the Super Admin, show only that status. Do not build a control for what happens after that.
8. Confirm the queue shows the correct empty message when no record is waiting, using the exact wording the matching PRD requirement gives.