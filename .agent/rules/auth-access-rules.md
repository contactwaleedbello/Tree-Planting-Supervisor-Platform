---
trigger: model_decision
description: Apply when a screen fetches or displays data scoped to the Supervisor's own blocks, or shows a permission-denied result.
---

# auth-access-rules.md

One job: what this build's single role, Supervisor, can see and do, and what it must never touch. Super Admin, EO, and Custodian screens are a later build phase and are not covered here.

## Rules

1. A Supervisor sees and manages only the blocks assigned to them, on every screen in this build, not only on the reports screen.
Reason: FR-12 scopes reports to "the supervisor's own blocks." The same scoping has to hold on the assignment and review screens too, or a Supervisor could act on a block that is not theirs.

2. Data belonging to the EO app, the Super Admin console, or the Custodian view is never editable here. It may be shown read-only, and only where an in-scope requirement needs it, for example an incident category on a reviewed incident, or an evidence photo attached to a submitted record.
Reason: this build is Supervisor-only for now. Read-only display of another role's data supports the Supervisor's own review work. Building an editable version of it would be building that role's screen by accident.

3. Any officer detail shown to the Supervisor, for example in the assignment picker, defaults to a name and one unique identifier only. Ask before showing anything more.
Reason: the PRD's data minimization principle is stated explicitly for the Custodian view, and the same concern applies here. Without a concrete default, "show only what's needed" is a judgment call every builder makes differently.

4. A permission-denied response from the backend renders a dedicated screen, distinct from a network failure screen.
Reason: a 403 means the action was never allowed. A network failure means the request did not get through. Treating them the same hides an authorization problem behind a retry button that will never fix it.

5. Hiding a button or a route based on role or block assignment is a display choice only, never the actual security check.
Reason: the real authorization check happens on the server for every action. This build can keep a confusing screen from showing, but it is never the thing deciding whether an action is actually allowed.

## Open question, ask before building

- Rule 1 assumes a Supervisor is tied to a defined set of blocks, but the PRD's own BlockAssignment entity only names EO and Custodian as valid assignee types. Nothing in the PRD's data model, as written, shows the actual mechanism connecting a Supervisor to their blocks. Ask for this before building the filtering logic; do not invent a field to make rule 1 work.