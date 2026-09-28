---
trigger: model_decision
description: Apply when a screen displays, loads, or exports a photo or another private, time-limited file.
---

# file-and-media-rules.md

One job: how an evidence photo is fetched and shown, since the PRD marks all media private with time-limited access.

## Rules

1. Every photo shown in this build, on the review queue or the incident screen, loads from a signed URL, never a permanent or public path.
Reason: the PRD states media is private with time-limited access. A plain image path assumes a backend detail this build is not confirmed to have.

2. An expired or broken signed URL shows a clear fallback message in place of the image, not a broken image icon.
Reason: a broken image icon reads as a bug. A message that says the image cannot be loaded right now reads as the expected behavior of a link that was always meant to expire.

3. A photo is never written to local storage, a global store, or disk. Holding its signed URL in the screen's own in-memory state for as long as that screen stays open is fine.
Reason: the concern is a private image persisting somewhere after the user has moved on, not the ordinary behavior of a component holding its own data while it is still on screen.

4. The export action on the reports screen never includes a photo.
Reason: a photo is never part of a tabular export. If the export's confirmed format later needs an image reference, that will be a URL or an ID, not the image itself.