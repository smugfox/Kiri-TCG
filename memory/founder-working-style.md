---
name: founder-working-style
description: "How the founder likes to work: no em dashes, iterate visually with variant boards, screenshot-driven review"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 3796ab52-8d5b-4bcb-b8c0-b511a162e2dc
---

The founder gave this feedback during the design-system build ([[design-system-build-log]]):

- No em dashes (—) anywhere in writing or deliverables: "way to AI." Use colons, commas, semicolons, parentheses, middle dots, or split sentences instead. En dashes in numeric ranges (640–1024px) and minus signs are fine.
- When a component's look is in question, don't argue or guess: build an iteration board of 3-5 labeled variants rendered side by side, give a recommendation, and let them pick (worked for alerts → tinted wash won; rarity badges → wash + dot won).
- They review visually via the live localhost preview and send screenshot crops when something is off (notch geometry, delta badge kerning, wizard connector overlap, notification dots). Precise visual details matter to them; verify fixes with zoomed screenshots.

**Why:** these preferences repeated across many turns and shaped every accepted change.
**How to apply:** never emit em dashes in any file or message for this user; propose variants before restyling shared components; screenshot-verify visual work before reporting it done.
