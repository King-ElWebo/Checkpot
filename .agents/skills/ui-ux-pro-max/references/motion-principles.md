# Motion Principles

These are the binding baseline rules for motion and interaction work in this template. Customer-specific decisions in `docs/DESIGN-SYSTEM.md` take precedence. Use `motion-playbook.md` only for deeper examples and techniques.

## Decide before animating

Every animation needs a purpose: feedback, state continuity, spatial orientation, explanation, or reducing a jarring change.

Consider:

- how often the interaction occurs;
- whether it was initiated by pointer, touch, or keyboard;
- whether motion delays the next action;
- whether it can be interrupted or reversed cleanly;
- whether the same meaning remains clear with reduced motion.

Frequent and keyboard-driven actions should respond immediately. This does not forbid all keyboard-triggered animation; it forbids decorative delay and motion that makes expert workflows feel slower.

## Timing and easing

Use these as starting ranges, then tune them in context:

| Interaction | Typical duration |
| --- | --- |
| Press feedback | 80–160 ms |
| Hover and color feedback | 120–200 ms |
| Tooltip, menu, or popover | 150–250 ms |
| Modal, drawer, or larger state change | 180–400 ms |
| Explanatory or marketing sequence | As long as needed to remain understandable and skippable |

Exits are usually slightly faster than entrances. There is no universal 300 ms ceiling.

- Use ease-out for entrances and immediate reactions.
- Use ease-in-out for movement or morphing already on screen.
- Use linear easing for genuinely constant motion.
- Use springs for gesture-linked or momentum-based movement when they improve continuity.
- Avoid slow ease-in entrances that postpone visible feedback.

Project tokens should define the final curves and durations.

## Properties and performance

- Prefer `transform` and `opacity` for frequent motion.
- Layout properties may be animated when the behavior requires them, but measure the result and keep the affected subtree small.
- `filter`, `backdrop-filter`, blur, large shadows, and `clip-path` can be expensive. Do not assume they are always compositor-only.
- Avoid `transition: all`.
- Apply `will-change` temporarily and only to elements known to benefit.
- CSS and JavaScript animation can both perform well. Choose based on interaction needs, interruption, sequencing, and measured behavior.
- Test on representative mobile hardware, not only a fast desktop.

## Interaction patterns

- Keep transform origins spatially connected to a trigger when that relationship helps orientation.
- Preserve the current visual state when an animation is interrupted or reversed.
- Press scale, blur, stagger, parallax, and spring effects are optional tools, not universal defaults.
- Keep stagger short and skip it for frequently refreshed lists or time-sensitive content.
- Avoid animating every element merely to make a page feel active.
- Hover must never carry essential information or be required for operation.

## Scroll-linked motion

- Define motion per route and section before implementation: purpose, trigger, progress mapping, replay, mobile fallback, and reduced-motion fallback.
- Do not apply the same reveal preset to every section. Alternating rhythm and intentionally static sections are part of good motion direction.
- Prefer in-view triggers for discrete reveals and scroll progress only when continuous movement communicates a spatial or narrative relationship.
- Essential content must be rendered visible and usable without JavaScript. Motion is progressive enhancement, not a content gate.
- Keep observation and animation outside large React render loops. Avoid setting React state on every raw scroll event.
- Use sticky, pinned, parallax, horizontal, or scrubbed sequences only when explicitly approved and understandable on touch devices.
- Bound parallax and depth effects; do not let foreground and background motion reduce legibility or cause motion sickness.
- Define what happens when viewport height is small, content wraps, images load late, or the user scrolls rapidly in either direction.
- Reduced motion replaces large spatial or scroll-scrubbed movement with an immediate state or short opacity transition while preserving content order.
- Verify scroll work for dropped frames, layout shift, input delay, overscroll, focus movement, and correct restoration after navigation.

## Accessibility and input

- Respect `prefers-reduced-motion`.
- With reduced motion, remove large spatial movement, parallax, spinning, and nonessential sequences while retaining immediate state feedback.
- Do not hide focus indicators or delay keyboard feedback.
- Gate hover-only effects behind hover-capable pointers.
- Ensure touch targets and gestures have an accessible non-gesture alternative.
- Never let motion block reading, navigation, form completion, or dismissal.

## Verification

Before accepting motion work:

1. test normal, rapid repeated, interrupted, and reversed interactions;
2. test keyboard, touch, and pointer paths where applicable;
3. inspect reduced-motion behavior;
4. check for layout shift, overflow, dropped frames, and delayed input;
5. verify that the animation communicates the intended state without becoming the focus.

Use `motion-playbook.md` for advanced gestures, orchestration, debugging ideas, and implementation examples. Treat its stronger wording as craft guidance, not an absolute rule, unless this document or the approved customer design system adopts it explicitly.
