# Oda Design System Implementation Plan

**Goal:** Restyle all current Oda InvoTrack screens with the canonical Oda visual system while preserving functionality.

**Architecture:** Centralize Oda tokens and reusable surface classes in the Tailwind CSS theme, then compose small brand and icon components in the existing Next.js pages. Keep pages server-rendered except for the existing authentication controls.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS 4, Vitest, Playwright

---

### Task 1: Add Visual Regression Assertions

Modify `tests/e2e/auth-shell.spec.ts` to assert the canonical Oda font, green
primary action, white elevated application navigation, green selected state, and
responsive shell.

Run the focused tests and confirm they fail against the existing blue design.

### Task 2: Add Oda Foundations

Update `src/app/globals.css` with Oda colors, typography, shadows, radii,
accessible focus states, and reduced-motion handling. Add a small reusable
`OdaBrand` component with inline SVG icons so no production dependency is needed.

### Task 3: Restyle Public And Auth Screens

Update the landing and sign-in pages to use the new brand component, Oda surfaces,
green actions, product-boundary messaging, and responsive layouts. Preserve the
existing magic-link labels and behavior used by Playwright.

### Task 4: Restyle Authenticated Shell And Dashboard

Build the white elevated responsive app shell with an Oda-green selected state,
then update dashboard cards and role badges. Keep the current membership and role
data flow unchanged.

### Task 5: Verify

Run format, lint, typecheck, unit tests, build, and Playwright. Inspect landing,
sign-in, and dashboard in the in-app browser at desktop and mobile widths.
