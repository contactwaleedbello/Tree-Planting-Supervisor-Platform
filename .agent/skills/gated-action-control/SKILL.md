---
name: gated-action-control
description: Wire a submit or decision control so it stays disabled until its required fields are valid, shows its blocking reason inline, and completes without a partial or contradictory state.
---

1. List the fields this specific control requires, from the matching PRD requirement. Mark every other field optional.
2. Bind the control's enabled state to the required-fields check from step 1, applying form-validation-rules.md's blocking rule.
3. Place the blocking reason inline, next to the field or action it blocks, per form-validation-rules.md.
4. Use the exact PRD wording for that blocking reason, from AGENTS.md, word for word.
5. On a successful action, either create the record in its correct initial state or move it to its next locked state, whichever this control does, applying form-validation-rules.md's no-partial-completion rule.
6. Confirm the control's disabled reason updates the moment the missing field is filled in, with no page reload needed.