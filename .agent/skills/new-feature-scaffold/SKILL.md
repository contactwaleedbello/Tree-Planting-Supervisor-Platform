---
name: new-feature-scaffold
description: Create a new feature's folder structure, placeholder data function, and loading, empty, and failure states in one pass, including the Supervisor block-scoping filter.
---

1. Confirm the FR number this feature implements, and confirm the feature folder name against react-architecture-rules.md's proposed list.
2. Create the feature folder at src/features/<feature>/, with a components/ subfolder inside it.
3. Create the feature's screen component or components inside that components/ subfolder, following AGENTS.md's UI Implementation Rule.
4. Create the feature's placeholder data function, in whatever sub-location the project's established pattern uses, or directly in the feature root for the first feature, following api-network-rules.md's shape rule.
5. Add the Supervisor's own-blocks filter to that placeholder function, per auth-access-rules.md. If the filtering mechanism is not yet confirmed, stop and ask before writing the filter.
6. Wire the component's three states, in progress, result, and failure, per api-network-rules.md.
7. Add an empty state to the component, using the exact wording the matching PRD requirement gives for that case.
8. Confirm the component renders correctly in all four conditions, in progress, empty, populated, and failed, before starting the next feature.