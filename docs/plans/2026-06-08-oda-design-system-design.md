# Oda InvoTrack Design System

## Goal

Apply the established Oda visual language to every current InvoTrack screen
without changing authentication, authorization, routing, or Phase 1 domain behavior.

## Source

The canonical guidance comes from the existing Oda design update:

- Noto Sans typography
- Oda green primary `#40B65F` and hover `#35974F`
- Heading `#615F6D`, body `#6E6B7B`, and accessible muted text
- Border `#EBE9F1`, canvas `#F9FAFC`, hover surface `#F7F7F8`
- White elevated sidebar and header surfaces with a green selected navigation item
- 5px buttons and inputs, 8px content surfaces, and the guide's defined shadows

The original `#B9B9C3` muted text is retained for decorative elements only. Body
copy uses a darker neutral so normal text meets WCAG AA contrast.

## Visual Direction

### Brand

Use a compact Oda mark built from text and inline SVG rather than introducing an
unverified logo asset. The mark pairs a green rounded square with a white
document-check symbol, followed by the `Oda InvoTrack` wordmark.

### Landing

Use a focused B2B product hero with a restrained green glow, a white product
surface, product boundary callout, and one primary sign-in action. The page remains
clear that InvoTrack is a tracker rather than an invoice archive.

### Sign-In

Use a responsive split layout on large screens and a centered form on mobile.
The visual panel explains the product briefly; the form keeps the existing
magic-link flow unchanged.

### App Shell

Use the guide's white elevated desktop sidebar and header with a green active
dashboard item. On smaller screens, collapse this into a compact top bar so
navigation does not consume content width.

### Dashboard

Keep the current Phase 1 foundation content but present memberships as Oda cards,
with clear role badges and an explicit foundation-status panel. Do not invent
live invoice metrics before the dashboard data flow exists.

## Interaction And Accessibility

- Interactive targets are at least 44px high.
- Focus states use the Oda green ring and remain keyboard-visible.
- Hover effects use 150-200ms opacity, color, transform, or shadow transitions.
- Motion is disabled under `prefers-reduced-motion`.
- Text contrast is WCAG AA for normal content.
- Layouts are checked at 375px, 768px, 1024px, and desktop widths.

## Scope

Files in scope:

- `src/app/globals.css`
- `src/app/layout.tsx`
- `src/app/page.tsx`
- `src/app/(auth)/sign-in/page.tsx`
- `src/app/(app)/layout.tsx`
- `src/app/(app)/dashboard/page.tsx`
- `src/components/auth/magic-link-form.tsx`
- `src/components/auth/sign-out-button.tsx`
- small shared brand/icon components
- frontend tests

No database, API, role, or request-domain files are changed.
