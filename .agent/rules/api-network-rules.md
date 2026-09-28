---
trigger: always_on
description: Governs API base URL environmental variables, dynamic reference data fetching rules, timestamp payload structures, and exact network error UI messaging.
---

# api-network-rules.md

One job, in two related parts: what a placeholder data function returns, and how a component behaves while that data loads, submits, arrives empty, or fails. This file never names a real endpoint, base URL, or environment variable, since none of those are confirmed yet.

## Rules

1. Every component's data comes through a placeholder function scoped to that feature, never a value hardcoded directly in the component.
Reason: the real backend is separate work, done later by another engineer. A placeholder function is the one seam that lets a real fetch replace fake data without touching the component itself.

2. A placeholder function returns only the fields the matching PRD requirement actually names.
Reason: inventing an extra field now means the real backend either has to support a field nobody asked for, or the frontend has to be touched again once the real contract arrives.

3. Every component or data region that fetches, loads, or submits data shows three distinct states: in progress, the result, and a failure state. This covers a submit action, approve, reject, assign, the same as it covers an initial data load.
Reason: a component that jumps straight from blank to result hides the one moment most likely to behave differently once a real network is involved, and a submit action goes through the same seam as a load, so it needs the same three states.

4. A failed load or a failed submit shows a retry action, never a dead end.
Reason: nothing in this build's flows treats a network failure as final. The PRD's own export failure state says "try again," and every other network dependent action follows the same pattern.

5. An empty result is a distinct state from loading and from failure, and shows the exact empty message the matching PRD requirement gives.
Reason: no data yet, still loading, and something went wrong are three different situations. Collapsing them into one state leaves the user unable to tell which one they are looking at. The exact wording stays owned by AGENTS.md and the PRD; this rule only says an empty state needs its own distinct message, not what that message says.

6. No endpoint name, base URL, or environment variable appears in this file or in any component.
Reason: none of these are confirmed yet. Writing one down here would make a guess look like a decision the project has actually made.