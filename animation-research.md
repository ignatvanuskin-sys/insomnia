# Animation / UI reference teardown — for a dark horror-quest promo site

Stack target: Next.js 15 + React 19 + Tailwind 4. No GSAP / no Framer Motion.
Bias toward vanilla CSS keyframes, CSS custom properties, one SVG filter, and at most one
`requestAnimationFrame` loop per page. Every technique must have a `prefers-reduced-motion`
static fallback.

Source of findings: pages fetched directly. `dotmatrix` and `iconimate` ship their real
implementation (shadcn registry JSON / manual-setup page), `doodle-icons` and `codenotch`
source was read from the repos. `60fps`, `posts.design`, `recent.design`, `inspora.design`
are JS-rendered galleries; only their item taxonomy and titles are machine-readable, so those
entries distil the *pattern* rather than quoting code.

---

## 1. https://60fps.design/

**One line.** Catalogue of ~2100 screen-recorded UI micro-interactions from shipped apps, tagged by a fixed effect vocabulary.

**Worth stealing.**
- The taxonomy itself is a checklist you can implement from: `Draw`, `Reveal`, `Glow`, `Pulse`,
  `Stagger`, `Shimmer`, `Wiggle`, `Ticker`, `Scrub`, `Morph`, `Shared Element`, `Idle Animation`,
  `Pull`, `Long Press`, `Scrub`. Half of the horror feel comes from picking 4–5 of these and
  applying them consistently, not from 20 one-offs.
- Recurring recipes visible in the shot titles: border-glow feature highlight, tap-to-reveal,
  pull-down text→logo morph, number-scroll counters, tactile tab press (scale-down on press),
  shimmer skeleton, poster reflection.

**How to implement.**
- **Border glow** (cheap, no JS):
  ```css
  .glow { position: relative; }
  .glow::after {
    content: ""; position: absolute; inset: -1px; border-radius: inherit;
    background: conic-gradient(from var(--a, 0turn), transparent 0turn 0.7turn, #ff2a2a 0.9turn, transparent 1turn);
    mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
    mask-composite: exclude; padding: 1px;
    animation: sweep 4s linear infinite;
  }
  @keyframes sweep { to { --a: 1turn } }
  ```
  (needs `@property --a { syntax: "<angle>"; inherits: false; initial-value: 0turn }`.)
- **Reveal via clip-path**, not width/height (compositor-friendly):
  ```css
  @keyframes reveal { from { clip-path: inset(0 100% 0 0) } to { clip-path: inset(0 0 0 0) } }
  ```
- **Ticker / counter** with `steps()` — no JS, no reflow:
  ```css
  @keyframes roll { to { transform: translateY(-60%) } }
  .ticker { animation: roll 2s steps(6, end) infinite; }
  ```
- **Stagger** off one CSS var instead of per-item delays:
  ```css
  .row > * { animation-delay: calc(var(--i, 0) * 60ms) }
  ```
- Tactile press: `transform: scale(.97)` on `:active` with `transition: transform 120ms`.

**Scary-adaptation.** "Reveal" becomes *arrival of the wrong thing* — clip-path wipes that
reveal an image, then a second mask that re-covers it. Border-glow becomes a dying filament:
irregular, not smooth — drive `--a` with `steps(24, end)` so the light stutters around the frame
instead of gliding.

---

## 2. https://iconimate.app/

**One line.** 216 MIT animated icons distributed as a shadcn registry; each icon is a
hand-scored animation traced off reference footage, not a generic spin.

**Worth stealing.**
- **One named motion per meaning.** Every icon carries a verb: `gust`, `hunt`, `ratchet`,
  `glance`, `ratchet`, `flick`, `stutter`, `low alert`, `fault`, `silenced`. The motion *is* the
  semantics. Steal the discipline: give each horror glyph its own bespoke score.
- **Multi-part opposition with per-part `times[]` offsets.** The bell's shell *rotates* while the
  clapper *translates*, peaking ~0.04 of the timeline later:
  ```
  shell.rotate   = [0, -11, 12, -9.5, 7.4, -2.5, 0]  times [0,.20,.44,.64,.80,.92,1]  dur .85s
  clapper.x (px) = [0, -16,  16, -13,  9,  -3.5, 0]  times [0,.24,.48,.68,.84,.94,1]  dur .85s
  ```
  That 40 ms lag is what makes it read as weight instead of a puppet.
- **Motion constants worth copying verbatim:**
  `` DUR = { instant: 0.12, fast: 0.2, base: 0.32, slow: 0.5 } `` and
  `RETURN = cubic-bezier(0.4, 0, 0.2, 1)` — used as the *hover-out* curve everywhere, so
  interrupting a hover glides home instead of snapping.
- **Reduced motion is not "no motion".** Their comment is the right policy: a static fallback
  makes the content undiscoverable. Honor `prefers-reduced-motion` by killing *unattended
  loops* (`repeat: Infinity`) only; an explicit hover/tap still plays one pass.
- Hover replay loop breathes `elapsed * 0.3` between cycles so the loop reads as rhythm, not
  as a frantic back-to-back repeat.
- Imperative `startAnimation()/stopAnimation()` handle, because `:hover` never fires on touch.

**How to implement (CSS port).**
```css
@property --z { syntax: "<number>"; inherits: false; initial-value: 0 }
.bell { transform-box: view-box; transform-origin: 50% 9.375%; } /* crown at y24/256 */
.bell:hover .shell   { animation: bell-shell .85s ease-in-out; }
.bell:hover .clapper { animation: bell-clapper .85s ease-in-out; }
@keyframes bell-shell {
  0%{transform:rotate(0)} 20%{transform:rotate(-11deg)} 44%{transform:rotate(12deg)}
  64%{transform:rotate(-9.5deg)} 80%{transform:rotate(7.4deg)} 92%{transform:rotate(-2.5deg)} 100%{transform:rotate(0)}
}
@keyframes bell-clapper {
  0%{transform:translateX(0)} 24%{transform:translateX(-16px)} 48%{transform:translateX(16px)}
  68%{transform:translateX(-13px)} 84%{transform:translateX(9px)} 94%{transform:translateX(-3.5px)} 100%{transform:translateX(0)}
}
@media (prefers-reduced-motion: reduce) { .looping-glyph { animation: none } } /* one-shots stay */
```

**Scary-adaptation.** Re-score icons with *wrong* timing rather than new shapes: a 3-part
opposition where the second part lags 200 ms and overshoots (a limb that keeps moving after the
body stops), and end every gesture on a value slightly off zero (`rotate(1.5deg)`) so nothing
ever fully rests. A "fault"/"silenced" icon is already the vocabulary you want for broken UI.

---

## 3. https://dotmatrix.zzzzshawn.cloud/

**One line.** 55+ free dot-matrix loaders (5×5 and 7×7) in React + TS + Tailwind + shadcn,
where the *whole* animation is CSS — JS only computes per-dot custom properties.

**Worth stealing (this is the single most reusable thing in the list).**
- **Index-derived CSS vars + `calc()` delay = any sweep you want.** Each dot gets
  `--dmx-distance`, `--dmx-manhattan`, `--dmx-row`, `--dmx-col`, `--dmx-angle`,
  `--dmx-radius`, plus an ordered scalar (`--dmx-ripple-ring`, `--dmx-path`, `--dmx-spiral-order`,
  `--dmx-outer-order`, `--dmx-diagonal-snake-order`). One keyframe set, N patterns:
  radial ripple, snake, spiral-inward, ring snake, diagonal wave, frame chase, line collapse —
  all differ only in the delay formula.
- **Keyframes animate opacity only** (plus a registered number var for glow strength). That is
  why 49 dots at 60 fps cost nothing.
- **Glow is expression-driven `drop-shadow`**, no second element, no filter blur:
  `drop-shadow(0 0 calc(dotSize * 0.75 * bloomLevel) currentColor)` chained 2–3 deep.
- **Off-cells are neutralised inline**: `opacity:0; visibility:hidden; animation:none` so
  keyframes can never "win" them back on.
- `usePrefersReducedMotion()` = `matchMedia("(prefers-reduced-motion: reduce)")` + `change`
  listener; the boolean is passed into the dot resolver which returns a static style.
- `--dmx-cycle: 1500ms` and `--dmx-speed` (set to `1/speed`) multiply every duration, so global
  speed is one number.

**How to implement (core, abbreviated).**
```css
@property --dmx-bloom-level { syntax: "<number>"; inherits: false; initial-value: 0 }
.dmx-root {
  --dmx-cycle: 1500ms;
  --dmx-opacity-base: .16; --dmx-opacity-mid: .32; --dmx-opacity-peak: 1;
}
.dmx-grid { display: grid; grid-template-columns: repeat(5, 1fr); grid-template-rows: repeat(5, 1fr); }
.dmx-dot {
  display: block; border-radius: 999px; background: var(--dmx-dot-fill, currentColor);
  opacity: calc(.5 * (var(--dmx-opacity-base) + var(--dmx-opacity-mid)));
  --dmx-bloom-level: 0; transform-origin: center; will-change: opacity;
}
.dmx-ripple {
  animation: dmx-ripple calc(var(--dmx-cycle) * var(--dmx-speed, 1)) cubic-bezier(.42,0,.58,1) infinite;
  animation-delay: calc(var(--dmx-ripple-ring, 0) * .2333 * var(--dmx-cycle) * var(--dmx-speed, 1));
}
@keyframes dmx-ripple {
  0%, 100% { opacity: var(--dmx-opacity-base); --dmx-bloom-level: 0 }
  50%      { opacity: var(--dmx-opacity-peak); --dmx-bloom-level: 1 }
}
.dmx-bloom .dmx-dot {
  filter: drop-shadow(0 0 calc(var(--dmx-dot-size,3px) * .75 * var(--dmx-bloom-level)) currentColor)
          drop-shadow(0 0 calc(var(--dmx-dot-size,3px) * 1.35 * var(--dmx-bloom-level)) currentColor);
}
```
```tsx
// 25 cells; only the delay inputs come from JS. Off-cells are inert.
const step = dot + gap, c = 2;
{Array.from({length:25}).map((_,i)=>{
  const row = Math.floor(i/5), col = i%5;
  const ring = Math.abs(Math.hypot(row-c, col-c) - 1.5);        // → --dmx-ripple-ring
  const active = PATTERN.diamond.has(i);
  return <i key={i} className={active ? "dmx-dot dmx-ripple" : "dmx-dot dmx-inactive"}
            style={{width:dot, height:dot, "--dmx-ripple-ring":ring,
                    "--dmx-dot-fill":active?"#8b1111":"transparent",
                    ...(!active && {opacity:0, visibility:"hidden", animation:"none"})}} />;
})}
```
Reduced motion: drop the `animation` property, keep the base opacity — the matrix reads as a
dim grid, which is a perfectly good static logo.

**Scary-adaptation.** This *is* the CRT boot sequence. Points to change, nothing else:
use a 7×7 grid with `--dmx-opacity-base: .07` (mostly-dead phosphor); give each dot a 3–6 %
chance of a permanent full-brightness stuck pixel; add a second keyframe that intermittently
flashes whole rows (`steps(1,end)`, 1 frame every ~4 s); add small vertical jitter per dot
(`translate: 0 calc(sin(...)*0.3px)` frozen per dot) to kill the perfect grid. Colour: `#7dff9b`
on near-black with `text-shadow` bloom, or blood-red `#a01313`. Perfect as the pre-quest
"system boot" gate and as the section-loading divider.

---

## 4. https://github.com/vinzdg/codenotch

**One line.** macOS menu-bar "notch" app (SwiftUI + AppKit) that draws AI usage limits as rings —
a small, unusually well-reasoned study in indicator motion.

**Worth stealing.** (The Swift doesn't matter; the decisions port one-to-one to CSS.)
- **Spin the reading itself, don't add a spinner.** While a value is refetching, the progress
  arc's own rotation advances (`rotationEffect(-90 + spin)`); an overlay spinner "only competes
  with it".
- **Never `repeatForever` a value you cancel by writing it back.** The documented trap: writing
  the same target value means nothing changes and the loop runs forever. They use **one finite
  360° turn** with an eased curve (`timingCurve(.32, 0, .14, 1, .95s)`) — lands exactly where 0°
  is, no cancellation state to leak.
- **Two-state indicator, two different motions:** *working* = a 25 % arc rotating at
  `1.1 s / turn` (a running arc, legible as progress); *blocked* = the full ring pulsing
  `opacity 1 → .3`, `.9s ease-in-out, alternate infinite`. Also: *queued* renders the arc as a
  **ring of dots** via `lineDashPattern [0.01, lineWidth*2.2]`.
- **"A ring that snaps to a new value reads as a glitch; one that sweeps reads as a measurement."**
  Interpolate the reading (`response .9, damping .9` spring ≈ `transition: <prop> .9s cubic-bezier(.22,1,.36,1)`).
- **Perf:** continuous rotation lives in a layer animation (compositor), not in state. A
  `repeatForever` driven per-frame "kept the app near 4 % of a core" — i.e. don't rotate via React
  state or per-frame JS.
- Stale readings **dim** instead of disappearing (a known-wrong value is still information).
- Motion vocabulary centralised in one enum; `stagger(index)` = `delay(min(index*0.045, 0.18))`
  so long lists never feel sluggish.

**How to implement.**
```html
<svg viewBox="0 0 100 100" class="ring">
  <circle class="track" cx="50" cy="50" r="44"/>
  <circle class="arc"   cx="50" cy="50" r="44" pathLength="1"
          style="--used:0.42"/>
</svg>
```
```css
.ring { transform: rotate(-90deg) }
.track { fill: none; stroke: #1b1b1b; stroke-width: 8 }
.arc {
  fill: none; stroke: var(--c, #8b1111); stroke-width: 8; stroke-linecap: round;
  stroke-dasharray: 1;
  stroke-dashoffset: calc(1 - var(--used));
  transition: stroke-dashoffset .9s cubic-bezier(.22,1,.36,1), stroke .6s linear;
}
.spin   { animation: turn 1.1s linear infinite }          /* compositor-only */
.blocked{ animation: throb .9s ease-in-out infinite alternate }
@keyframes turn  { to { transform: rotate(1turn) } }
@keyframes throb { to { opacity: .3 } }
.dots   { stroke-dasharray: 0.01 12; stroke-linecap: butt } /* queued = ring of dots */
@media (prefers-reduced-motion: reduce) { .spin, .blocked { animation: none } }
```

**Scary-adaptation.** The *blocked* pulse is the whole horror vocabulary: an eye that dilates
`.9 s alternate`, or a CTA that throbs while `aria-busy`. Steal the dot-ring trick for an
"empty" progress ring — a full circle of dots is far more unnerving than an empty track. And
steal the stale-dim rule for "the seal is weakening": desaturate + drop opacity to `.45` rather
than hiding the element.

---

## 5. https://github.com/oreo-design/doodle-icons

**One line.** 152 hand-drawn SVG icons that draw themselves in and then "boil" forever, using one
shared SVG filter and zero runtime dependencies.

**Worth stealing.**
- **The boil is one filter for the entire page.** `feTurbulence` → `feDisplacementMap`, with a
  six-step `<animate>` on the *seed*. "200 boiling icons cost about what one does."
- **Six discrete steps, not a tween.** `calcMode="discrete"` makes the ink *jump* between
  drawings the way hand-inked animation does; a smooth seed tween reads as digital warping.
  This is the entire difference between "wobbly" and "cursed".
- Tuned constants (the site's own values): `amplitude 4`, `duration 0.86s`, `frequency 0.055`,
  `octaves 2`, `frames 6`; stroke `3.4`, round cap/join. `amplitude` is in viewBox units so it
  scales (1 = shiver, 8 = mess).
- **Draw-on entrance** is a separate, staggerable animation: `.32 s` per stroke, `drawDelay` to
  stagger a row. Replays on every remount → use for hero/one-shot, not per-hover.
- `currentColor` for strokes so colour is pure CSS.

**How to implement.**
```html
<svg width="0" height="0" aria-hidden="true" style="position:absolute">
  <filter id="boil" x="-20%" y="-20%" width="140%" height="140%">
    <feTurbulence type="fractalNoise" baseFrequency="0.055" numOctaves="2" seed="1" result="noise">
      <animate attributeName="seed" values="1;2;3;4;5;6;1" calcMode="discrete"
               dur="0.86s" repeatCount="indefinite"/>
    </feTurbulence>
    <feDisplacementMap in="SourceGraphic" in2="noise" scale="4"
                       xChannelSelector="R" yChannelSelector="G"/>
  </filter>
</svg>
```
```css
.doodle { filter: url(#boil); }
.doodle path {
  stroke: currentColor; fill: none;
  stroke-width: 3.4; stroke-linecap: round; stroke-linejoin: round;
  pathLength: 1;                       /* normalises every path to length 1 */
  stroke-dasharray: 1; stroke-dashoffset: 1;
  animation: draw .32s ease-out var(--d, 0s) forwards;
}
@keyframes draw { to { stroke-dashoffset: 0 } }
.row > .doodle:nth-child(2) { --d: .32s } /* or set --d from map() */
@media (prefers-reduced-motion: reduce) {
  .doodle { filter: none }
  .doodle path { animation: none; stroke-dashoffset: 0 }
}
```
Caveat: `filter: url()` on a large element forces raster work — apply to icon/heading-sized
line art, not to a full-page wrapper. If you must animate the whole page, animate a fixed
`<svg>` noise layer instead.

**Scary-adaptation.** Same filter, different numbers: `baseFrequency 0.02`, `numOctaves 1`,
`scale 1.5`, `dur 6s`… then add a second, much rarer filter instance with `scale 9 / dur 0.2s`
that you toggle on for 300 ms when something is "wrong". Also: boiling line art is the cheapest
way to make a *hand-drawn* horror prop — a scratchy sigil, a shaky blood-drawn divider, a
diagnosis scribble — read as hand-made rather than as a font.

---

## 6. https://arloui.com/docs/components/input

**One line.** A token-driven React Native text input with filled / no-background appearances,
inset labels, and focus / error / password / search states.

**Worth stealing.**
- **State matrix as data, not branches**: appearance × label × size × slots × state. Every state
  is a token swap. Two documented slots you should copy: `insetLabel` and `trailingAction`.
- **Inset label** — the label moves *into* the field's frame and persists after a value is
  entered, so context survives typing. This is a pure-CSS pattern and it's the only genuinely
  animated part of the component.
- **Error is a colour token, not a red border painted ad hoc** (`borderError` vs `borderFocus`),
  which is why the state transitions read as one system.

**How to implement (CSS).**
```html
<label class="field"><span class="lab">Invocation</span>
  <input placeholder=" " /><span class="rule"></span></label>
```
```css
.field { position: relative; display: block }
.field input { background: #0d0d0d; border: 1px solid #262626; border-radius: 2px;
               padding: 18px 12px 8px; color: #ddd; width: 100%; }
.field .lab { position: absolute; left: 12px; top: 14px; font-size: 14px; color: #6b6b6b;
              transition: transform 160ms cubic-bezier(.4,0,.2,1), font-size 160ms, color 160ms;
              pointer-events: none; }
.field input:focus + .rule, .field input:not(:placeholder-shown) + .rule { }
.field input:focus ~ .lab, .field input:not(:placeholder-shown) ~ .lab {
  transform: translateY(-8px) scale(.75); transform-origin: left top;
}
.field input:focus { border-color: #8b1111; outline: none;
                     box-shadow: 0 0 0 1px #8b1111, 0 0 18px -4px #8b1111; }
.field[data-error] input { border-color: #d43a2f }
.field[data-error] { animation: deny 220ms steps(3, end) 1 }
@keyframes deny { 25% { transform: translateX(-2px) } 75% { transform: translateX(2px) } }
input::selection { background: #8b1111; color: #000 }
input:disabled { opacity: .4; filter: saturate(0) }
```

**Scary-adaptation.** The wrong-password path is the horror moment: use `steps(3,end)` shake (a
*stuttering* refusal, not a smooth shake), hold the error border lit for 4 s while everything
else dims, and swap the placeholder for a typewriter-deleted phrase before the error lands
(`animation` on `::placeholder` colour + `step-end` character count via a monospace width trick).
Keep lowercase labels — an interface that whispers your field names is worse than one that shouts.

---

## 7. https://posts.design/

**One line.** Index of 1800+ social/marketing posts shipped by real companies — announcement
cards, video clips, charts — with fifteen type filters.

**Worth stealing.**
- **Aspect-ratio-locked card grid + hover-play media.** Cards are cheap: fixed aspect box, one
  `<video muted loop playsinline preload="none" poster>` per cell, played on pointer-enter only.
  Dormant media is the reason the page is fast.
- **Faceted type filter** (Event / Partnership / Hiring / Contest / Launch / Teaser / Feature…)
  drives an instant re-layout. Worth copying as-is: filter chips that reorder without animation
  jank.
- Type badge + source avatar + "captured <date>" metadata strip is a complete, reusable
  content-teaser anatomy for a lore/archive section.

**How to implement.**
```css
.card { aspect-ratio: 4 / 5; overflow: hidden; background: #111 }
.card video { width: 100%; height: 100%; object-fit: cover;
              filter: grayscale(1) contrast(1.1) brightness(.7); transition: filter .4s }
.card:hover video { filter: none }
```
```tsx
const v = useRef<HTMLVideoElement>(null);
<div className="card" onPointerEnter={() => v.current?.play()}
                     onPointerLeave={() => { v.current?.pause(); v.current!.currentTime = 0 }}>
  <video ref={v} src={src} poster={poster} muted loop playsInline preload="none" />
</div>
```
Reduced motion: never autoplay; render the poster only. Keep images out of the JS bundle.

**Scary-adaptation.** Hover-to-play is the *best* cheap scare carrier on this whole list: the
thumbnail shows a calm still, and the video that plays on hover is 2 s of something moving in it.
Also steal the metadata strip for dread — `subject: <name> · status: missing · last seen: 2014-03-02`,
same anatomy, wrong information.

---

## 8. https://recent.design/

**One line.** Curated design gallery (Web / Interface / Branding / Motion / 3D / Illustration…) —
130+ items, motion and 3D are first-class tags.

**Worth stealing.** The tag list is a menu of effect *categories* with their own well-known
implementations; the ones with real horror mileage:
- **Liquid Mask Cursor FX** → a cursor-followed `mask-image`.
- **Calendly Pinned Scroll** → `position: sticky` + scroll-driven animation, no library.
- **WebGL Particle Creature / Feeling Tree / Fourth Dimension** → canvas, but the *cheap*
  version (2D canvas, 200 alpha-blended points) is indistinguishable at horror lighting.
- **Infinite FAQ** → `<details>` + a marquee of repeating rows.
- **Angry Sliders** / **Glass AI Button** / **Holographic Card** → specular + gradient maths.

**How to implement.**
```css
/* flashlight: black overlay, transparent only near the pointer */
.darkness {
  position: fixed; inset: 0; background: #000; z-index: 40; pointer-events: none;
  -webkit-mask-image: radial-gradient(circle 220px at var(--mx,50%) var(--my,40%), transparent 0 45%, #000 100%);
          mask-image: radial-gradient(circle 220px at var(--mx,50%) var(--my,40%), transparent 0 45%, #000 100%);
  transition: --mx .35s ease-out, --my .35s ease-out; /* @property, or lerp in rAF for weight */
}
```
```tsx
// ONE listener for the page, rAF-throttled, writes two custom props. ~10 LOC.
useEffect(() => {
  let f = 0;
  const on = (e: PointerEvent) => { if (f) return; f = requestAnimationFrame(() => {
    f = 0; const r = document.documentElement.style;
    r.setProperty("--mx", e.clientX + "px"); r.setProperty("--my", e.clientY + "px"); }); };
  addEventListener("pointermove", on, { passive: true });
  return () => { removeEventListener("pointermove", on); cancelAnimationFrame(f); };
}, []);
```
```css
/* pinned section */
.pin { position: sticky; top: 0; height: 100vh; }
/* scroll-driven (Chrome 115+) with a JS-free fallback of the same keyframes */
@supports (animation-timeline: view()) {
  .fog { animation: drift linear both; animation-timeline: view(); }
}
@keyframes drift { from { translate: 0 12vh; opacity: .25 } to { translate: 0 -12vh; opacity: .6 } }
```

**Scary-adaptation.** The flashlight mask is the highest-value single effect here — it makes the
*user* work to see, which is the definition of dread. Set it to `transparent 0 35%` so the cone is
tight, add a 300 ms lag so the darkness trails the cursor, and give it a *flickering* radius
(`@property --r` animated `.12s steps(2,end)`). For pinned scroll, don't scale anything — translate
a fog plate and a silhouetted horizon in opposite directions.

---

## 9. https://www.inspora.design/

**One line.** Another curated post gallery (Design / Motion / 3D as one stream on the homepage).

**Worth stealing.** The item titles double as a technique index, and three of them are exactly
the horror register:
- **"Hypnotizing UI"** → rotating conic-gradient + mask, no images.
- **"Glowing Loader"** → bloom without blur: layered `drop-shadow` / `text-shadow` (same trick as
  dotmatrix), so it stays on the compositor.
- **"Liquid Metal" / "Vintage Stamp Collage" / "Dynamic Island Pixel Art"** → SVG
  `feTurbulence` + `feDisplacementMap` (specular displacement) and pixel-art `steps()`.
- **"Handmade Icons"** → the same hand-drawn register as doodle-icons; worth noting that the
  "hand-made" tell is *irregularity*, not a font.
- **"Enter The Unknown"** → a title that is doing the work; label your own transitions this way.

**How to implement.**
```css
.hypno {
  background: repeating-conic-gradient(#0a0a0a 0 6deg, #8b1111 6deg 12deg);
  -webkit-mask-image: radial-gradient(circle, #000 30%, transparent 72%);
          mask-image: radial-gradient(circle, #000 30%, transparent 72%);
  animation: hypno 12s linear infinite;
}
@keyframes hypno { to { rotate: 1turn } }
.bloom { color: #8b1111;
         text-shadow: 0 0 4px currentColor, 0 0 12px currentColor, 0 0 28px currentColor; }
```

**Scary-adaptation.** Hypno ring at 12–20 s/turn, 8 % opacity, behind the hero — motion you can't
quite locate. Bloom (never blur) for every glowing edge. And steal `steps()` pixel-art for an
`image-rendering: pixelated` "evidence photo" that resolves out of noise on scroll.

---

## Cross-cutting implementation notes

- **Global CSS custom-property animation requires `@property`.** Animate `--a` (angle), `--mx/--my`
  (px), `--r` (px), `--dmx-bloom-level` (number) only after registering with `syntax` +
  `initial-value`, otherwise they snap instead of interpolating.
- **The reduce-motion contract** used by both `dotmatrix` and `iconimate` and worth adopting:
  - kill *ambient / infinite* loops;
  - keep user-initiated one-shots (hover, tap, submit) — they are not unattended motion;
  - replace the loop with the *resting* state, never with `display:none`.
  ```css
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { animation-duration: .001ms !important; animation-iteration-count: 1 !important; }
    .ambient { animation: none !important }
    .one-shot:hover { animation-duration: .35s !important; animation-iteration-count: 1 !important }
  }
  ```
- **Animate only `opacity` and `transform`/`rotate`/`translate`.** Everything above is built that
  way; the two exceptions deliberately used are `clip-path` (reveal/glitch) and `drop-shadow`
  (bloom), both applied to small elements.
- **Use `steps()` whenever the motion should feel mechanical.** Scanlines, flicker, counters,
  glitch, dot-matrix, pixel-art: smooth easing reads as "modern UI"; stepped values read as
  "damaged machine".
- **Budget:** one shared SVG filter, one rAF pointer loop, zero animation libraries. Everything
  else is keyframes.
- Gallery sites (1, 7, 8, 9) are JS-rendered; their value here is the **taxonomy and item titles**,
  which were the only machine-readable signal. Their own site chrome is not the reference.

---

## PRIORITISED SHORTLIST — ranked by (scariness impact ÷ implementation cost)

| # | Technique | Cost | Where it goes |
|---|---|---|---|
| 1 | **Film grain + vignette overlay** — one fixed `::after` at `inset:-50%`, tiled noise, `opacity:.06`, `animation: .5s steps(1) infinite` translating a few percent. | ~8 lines CSS, one tiny PNG/SVG | Fixed page-wide, z-index above everything, `pointer-events:none` |
| 2 | **Flashlight darkness** — fixed black overlay masked by `radial-gradient(at var(--mx) var(--my))`, one rAF-throttled `pointermove` writing two custom props, 300 ms trailing lag. | ~15 lines CSS + 10 lines TS | Hero + the long-form lore section (not over forms) |
| 3 | **CRT boot / dot-matrix loader** — 7×7 grid, per-dot delay from a distance/order scalar, keyframes animate opacity + registered bloom var only, chained `drop-shadow` for phosphor glow, stuck pixels, `steps(2,end)` row flicker. | ~60 lines CSS + 25 cells JSX | Pre-quest "system boot" gate + every section-loading divider |
| 4 | **SVG boil filter** — `feTurbulence` + `feDisplacementMap`, seed stepped `calcMode="discrete"` over 6 frames at `.86 s`; one `<filter>` shared by the page. | ~12 lines SVG/CSS | Hand-drawn sigils, scratchy dividers, speaker/character glyphs |
| 5 | **`stroke-dashoffset` draw-on** — `pathLength:1`, `stroke-dasharray/offset` → 0, `.32 s` per stroke, `--d` delay to stagger. | ~10 lines CSS | H1/H2 underline, carve-line dividers, quest-path arrows (on scroll into view) |
| 6 | **Stepped glitch text** — `clip-path: inset()` slices + `translateX` on `steps(3,end)`, triggered on hover/focus only. | ~14 lines CSS | Nav items, buttons, any word that should arrive wrong |
| 7 | **Number ticker / odometer** — `transform: translateY` with `steps(N, end)`. | ~6 lines CSS | Countdown to release, "N souls claimed", price/stat counters |
| 8 | **Blocked-state throb ring** — SVG ring with dashoffset progress + a `1.1 s` rotating 25 % arc for busy, `.9 s alternate` opacity pulse for blocked; finite `1turn` spin, never `repeatForever` + value-write. | ~25 lines CSS/SVG | CTA "awaiting confirmation", live-player status, seal-integrity indicator |
| 9 | **Hover-play teaser card** — aspect-locked box, `preload="none"` video, `play()` on pointer-enter / `pause()`+reset on leave; poster-only under reduced motion. | ~12 lines TSX/CSS | Roster/archive grid — the calm still that isn't calm on hover |
| 10 | **Sticky pinned scroll + fog parallax** — `position: sticky` panel and two plates translated in opposite directions, `animation-timeline: view()` inside `@supports`, static offsets otherwise. | ~20 lines CSS | Long-form lore/backstory chapter break |
