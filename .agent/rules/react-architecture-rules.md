---
trigger: always_on
globs: Enforces feature-based folder colocation, component isolation rules, and strict import direction flows to prevent circular dependencies.
---

# react-architecture-rules.md

One job: where a piece of code lives, and which direction an import is allowed to flow.

## Rules

1. Business logic for one feature, meaning its hooks, API calls, types, utilities, and state, lives inside src/features/<feature>/.
Reason: keeps a feature's screens and supporting code in one place, so a change to that feature never means hunting across the codebase for related pieces.

2. A component used by only one feature lives in src/features/<feature>/components/.
Reason: a component does not earn a shared spot just because it could technically be reused somewhere else later. That decision waits until a second feature actually needs it.

3. src/components/ holds only a component already used by two or more unrelated features.
Reason: moving something to shared before it is actually shared gives every feature a dependency on code that was written for one feature's needs.

4. src/hooks/ holds only hooks used by more than one feature. src/services/ holds only app-wide API configuration. src/types/ holds only types used by more than one feature. src/utils/ holds only plain utility functions used by more than one feature.
Reason: the same test applies to all four folders: a home for everything means nothing in it is actually shared. This is also where the status and label values defined in state-mapping-rules.md belong once they are written as code, since review, incidents, reports, and assignment all read them.

5. Do not add an abstraction layer, a wrapper, or a generalized version of something until a second, real use for it exists. Prefer the plain, direct version of the code over one built to anticipate a future need.
Reason: an abstraction built before it is needed adds a layer every future reader has to learn, for a generalization the project may never actually require.

6. Keep each feature as self-contained as reasonably possible.
Reason: a feature that depends on another feature's internals breaks when that other feature changes for its own reasons, and is harder to test, review, or hand off on its own.

7. Imports flow only toward src/components/, src/hooks/, src/services/, src/types/, and src/utils/. A feature never imports directly from another feature's files, one-way or otherwise.
Reason: this is rule 6 stated as something the agent can check file by file, not just a principle to keep in mind.

8. Once a folder pattern exists in the project, follow it, and do not introduce a second pattern for the same kind of code. For the very first feature folder in a fresh project, where nothing exists yet to copy, follow rules 1 through 7 directly.
Reason: two patterns for the same job turns every new file into a guess about which pattern to copy. A fresh project needs a starting point, not an assumption that one already exists.

9. Before adding a new file to src/components/, src/hooks/, src/services/, src/types/, or src/utils/, search that folder and the relevant feature folders first.
Reason: a near-duplicate under a slightly different name is worse than reusing the one that already exists.

## This build's feature folders

Proposed, matched to the in-scope requirement numbers. Confirm before creating them, since the names are a proposed grouping, not something the PRD states directly:
- src/features/assignment/ (FR-09, assign blocks)
- src/features/review/ (FR-10, review queue)
- src/features/incidents/ (FR-11, incident review)
- src/features/reports/ (FR-12, block-level reports)