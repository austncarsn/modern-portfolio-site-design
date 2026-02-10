# General guidelines (Code cleanup mode)

## Behavior
- Preserve UI and behavior by default; do not “redesign” while refactoring.
- Work incrementally: audit → plan → small batches → verify.
- Prefer clarity over cleverness; avoid unnecessary abstraction.
- More context isn’t always better: keep changes focused and explain tradeoffs briefly.

## Layout & CSS
- Only use absolute positioning when necessary; default to responsive layout using flexbox/grid. 
- Remove unused CSS selectors and consolidate repeated styles into shared utilities or component-level styles.
- Prefer CSS variables/tokens for repeated values (colors, spacing, radii) and deduplicate them.

## File hygiene
- Keep files small; move reusable helpers and components into their own files.
- Use a consistent naming convention (choose one and stick to it):
  - Files: kebab-case (e.g., `prompt-modal.js`, `copy-to-clipboard.js`)
  - Components/constructors: PascalCase
  - Functions/vars: camelCase
- Ensure each file has a single responsibility; avoid “misc dumping grounds.”

## Duplication rules
- If two components/utilities are >80% identical, consolidate into one:
  - Extract shared base, expose small configuration points (props/options).
- Do not consolidate if it harms readability or makes debugging harder.

## Dead code removal rules
- Do not delete immediately. First:
  - Prove it is unused (no references/imports, not called, not in DOM, not in event handlers).
  - If unsure, isolate it (comment block or move to `_deprecated/`) and verify behavior.
- Ask before deleting any file, major block, or changing public APIs.

## Verification
- After each batch of changes, run a quick manual smoke test:
  - Load app, search, filter, modal open/close, copy, and basic responsive check.
- Do not leave the app in a broken state between steps.

## Output format (for your responses)
- Always provide:
  1) Summary of changes
  2) Updated file tree
  3) Risks/notes
  4) Next step + what you need approval for
