# Approved Design System

Status: `APPROVED_FOR_FRONTEND`

This file is created for each customer project after discovery and before frontend implementation.

## Inputs

- Project specification: Checkpot Hietzing - `APPROVED_FOR_DESIGN`
- UI/UX Pro Max query: "Boutique Damenmode natural skandinavisch elegant"
- Customer references: None supplied, Scandinavian / natural direction approved.
- Existing brand assets: Red handwritten Checkpot wordmark.

## Direction

- Design concept: Feature-Rich Showcase (aligned with Boutique context). Replaced the generated "Liquid Glass" style with a cleaner, elegant Scandinavian look that adheres to the customer's constraints.
- Brand adjectives: natural, human, Scandinavian, friendly, confidently elegant, ecological/sustainable.
- Visual references: Scandinavian, calm, boutique.
- Explicitly avoided styles: Luxury, childish, shop-like grids, excessive 3D, fully pill-shaped corners, aggressive parallax, morphing, glossy effects.

## Tokens

- Color roles:
  - Primary: `#C01718` (Checkpot Red)
  - Background: `#FFFFFF` (White)
  - Muted Background: `#F9F9F8` or `#F3F2EE` (Warm light neutral)
  - Text/Foreground: `#1A1A1A` (Dark slate/charcoal)
  - Muted Text: `#4A5568`
  - Border: `#E2E8F0`
- Typography:
  - Logo: Existing Checkpot wordmark
  - Headings: Outfit - classic-elegant, calm, friendly and Scandinavian
  - Body/UI: Inter - calm, neutral and highly legible
  - Overall character: Clear hierarchy and restrained typesetting; typography must never feel loud,
    playful or fashion-editorial at the expense of readability.
- Spacing rhythm: Generous spacing to let product photography breathe.
- Container widths: Max width around 1200px (standard `max-w-7xl` or `max-w-screen-xl`).
- Radius character: Moderately softened (`rounded-md` or `rounded-lg`).
- Borders and shadows: Restrained depth. Subtle shadows (`shadow-sm`, `shadow-md`) for hierarchy.
- Icon style: Simple, clear SVG outlines (Heroicons/Lucide). No emojis.
- Image treatment: Natural, minimal framing. Hidden overflow for subtle hover scales.

## Components

- Navigation: Clean header, subtle border or shadow on scroll.
- Buttons and links: Solid primary (`#C01718`) with white text. `rounded-md`.
- Cards: Subtle hover states.
- Forms: Clear borders, accessible focus rings.
- Contact and route planning: Display the address as text and provide a clearly labeled external
  `Route planen` link. Do not embed Google Maps or another map provider.
- Overlays: Calm backdrops.
- Feedback states: Clear color shifts.

## Responsive behavior

- Mobile priorities: Legibility, fast load times, touch-friendly targets.
- Tablet behavior: Grid transitions from 1 column to 2.
- Desktop behavior: Generous margins, maximum 3-4 columns for outfits.
- Wide-screen limits: Content centered within max-container.
- Browser support: Current and two previous major versions of Chrome, Safari, Firefox and Edge, plus
  current iOS and Android browsers.

## Accessibility

- Target: WCAG 2.2 AA.
- Use semantic HTML and meaningful landmarks as the default structure.
- Text, controls, focus indicators and informative graphics must meet the required contrast.
- All interactive elements must expose visible focus states and remain fully keyboard-operable.
- Images use meaningful alternative text when informative and empty alternative text when decorative.
- Touch targets, labels, validation feedback and reading order must remain usable at every approved
  responsive width.

## Motion

- Motion character: Performance-first, subtle, purposeful.
- Motion intensity: Low-medium. Gentle reveals.
- Scroll-storytelling role: Minimal. Focus is on product photography, not scroll gymnastics.
- Chosen implementation approach: CSS transitions for interaction; minimal IntersectionObserver/Framer Motion for reveals.
- Standard easing: `ease-out` for hover/interaction.
- Standard durations: 150-200ms for hover.
- Entrance behavior: Subtle fade-up (10px).
- Interactive feedback: Smooth color/opacity changes.
- Replay policy: Reveals play once per session/visit.
- Mobile simplification: Reduced spatial movement.
- Reduced-motion behavior: All spatial movement/scroll reveals disabled. Immediate state changes.
- Performance constraints: Avoid heavy blur filters or animating layout properties.

### Section-level motion plan

| Route | Section/element | Purpose | Trigger | Approved behavior | Once/repeat | Mobile | Reduced motion | Implementation |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/` | Hero text & image | Gentle intro | load | Fade in + translate-y 10px (duration: 600ms) | once | Fade in | Immediate | CSS / Motion |
| `/` | Brand Highlights | Content reveal | in-view | Staggered fade in | once | Fade in | Immediate | CSS / Motion |
| `/outfits` | Image Grid | Progressive loading | scroll progress | Subtle fade in per item as they enter view | once | Simple fade | Immediate | CSS / Motion |
| All | Buttons/Links | Interaction | pointer hover | Opacity or bg-color shift (150ms) | repeat | Active state | 150ms color shift | CSS transitions |
| All | Image Cards | Interaction | pointer hover | Slow scale (1.02 over 400ms) | repeat | None | None | CSS `scale` |
