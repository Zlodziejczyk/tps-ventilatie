# Interactive Hero Section Design

## Overview
Replace the static hero image box with an interactive particle-based HVAC visualization that shows dirty air being purified through a spinning fan, producing clean air.

## Layout & Structure
- **Left column:** Existing text content unchanged (badge, h1, subtitle, CTAs, trust badges)
- **Right column (lg+):** Canvas-based particle animation with spinning fan SVG overlay, replaces the current image box
- **Full-width background:** Subtle ambient particle layer behind all content
- **Floating card:** "Luchtkwaliteit Status" card stays in place below the animation
- **Mobile (<lg):** Background ambient canvas only (denser ~30 particles), no fan, no focal canvas

## Technical Approach: HTML Canvas + Framer Motion
- Canvas for particle rendering (performant with many particles)
- Framer Motion for fan SVG rotation and existing fade-up animations
- Zero new dependencies

## Particle System

### Two canvas layers:
1. **Background canvas** — full-width absolute, z-index below text. ~20 slow-drifting particles in muted primary/tertiary at 10-20% opacity. Left-to-right drift.
2. **Focal canvas** — contained in right column box (lg+ only). Main animation.

### Particle lifecycle (focal canvas):
- **Spawn zone:** Left edge of the box, ~2-3 particles/second
- **Dirty state:** Warm tones (#8B7355, #A0896C, #9B8567), radius 3-5px, opacity 0.6-0.8
- **Attraction:** Accelerate toward fan center with gravity-like physics
- **Transformation zone:** Particles reach fan center, pause briefly, re-emit from right side
- **Clean state:** Brand tones (#006580, #006B42, #257F9C), radius 1.5-3px, opacity 0.3-0.5, dispersed trajectories
- **Despawn:** Fade out at right edge
- **~50-60 particles** active at any time

### Interactivity:
- **Desktop:** Cursor proximity causes gentle particle repulsion (~30px radius). Subtle, not dramatic.
- **Mobile:** Passive loop only, no touch/gyroscope interaction.

## Fan Visualization
- SVG overlay centered in right-column box, animated with Framer Motion
- 6 curved blades radiating from center, thin strokes in primary (#006580) at ~40% opacity
- Outer ring: dashed circle (matches existing decorative SVG style)
- Center: small solid circle hub
- Continuous rotation: 8 seconds/revolution, linear easing
- Subtle pulse on outer ring (opacity oscillates 0.3-0.5)

## Colors
- **Dirty particles:** #8B7355, #A0896C, #9B8567
- **Clean particles:** #006580, #006B42, #257F9C
- **Fan SVG:** #006580 at 40% opacity
- **Ambient particles:** primary/tertiary mix at 10-20% opacity
- **Canvas backgrounds:** transparent

## Performance
- `requestAnimationFrame` loop
- `IntersectionObserver` to pause when off-screen
- `prefers-reduced-motion`: static snapshot (frozen particles, no fan spin)
- Canvas scales with `devicePixelRatio`, capped at 2x
- Cleanup on component unmount

## Responsive
- **lg+ (1024px+):** Both canvases, fan visible, cursor reactivity
- **<lg:** Background ambient canvas only (~30 particles), passive loop
