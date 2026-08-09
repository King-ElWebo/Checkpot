# Approved Design System

Status: `NOT_GENERATED`

This file is created for each customer project after discovery and before frontend implementation.

## Inputs

- Project specification:
- UI/UX Pro Max query:
- Customer references:
- Existing brand assets:

## Direction

- Design concept:
- Brand adjectives:
- Visual references:
- Explicitly avoided styles:

## Tokens

- Color roles:
- Typography:
- Spacing rhythm:
- Container widths:
- Radius character:
- Borders and shadows:
- Icon style:
- Image treatment:

## Components

- Navigation:
- Buttons and links:
- Cards:
- Forms:
- Overlays:
- Feedback states:

## Responsive behavior

- Mobile priorities:
- Tablet behavior:
- Desktop behavior:
- Wide-screen limits:

## Motion

- Motion character:
- Motion intensity:
- Scroll-storytelling role:
- Chosen implementation approach:
- Standard easing:
- Standard durations:
- Entrance behavior:
- Interactive feedback:
- Replay policy:
- Mobile simplification:
- Reduced-motion behavior:
- Performance constraints:

### Section-level motion plan

| Route | Section/element | Purpose | Trigger | Approved behavior | Once/repeat | Mobile | Reduced motion | Implementation |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/` |  |  | load / in-view / scroll progress / interaction |  |  |  |  |  |

Every prominent section must have either an explicit motion decision or `none`. Do not use the same reveal on every section by default. Sticky storytelling, scroll progress, parallax, pinned scenes, horizontal sequences, text reveals, and image masks require an explicit approved row.

Essential content must be visible without JavaScript. Scroll-linked motion must define mobile and `prefers-reduced-motion` fallbacks and must not compromise reading order, keyboard operation, LCP, CLS, or input responsiveness.

`.agents/skills/ui-ux-pro-max/references/motion-principles.md` supplies generic motion craft principles. This file records the customer-specific decisions that win when generic recommendations differ.

Page-level metadata, canonicals, structured data, and indexing decisions live in `docs/SEO-SPEC.md`.
