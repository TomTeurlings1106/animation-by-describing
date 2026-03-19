# animation-demo — context dump

This is a self-referential animation built with Next.js and Motion (formerly Framer Motion).
The animation explains how it was made — while you are watching it.

---

## What it does

A sequence of 9 screens + a loop screen that walks through:

1. A hook question
2. How it was built ("I'll show you how I did it, with Claude Code + some creativity")
3. A terminal typing animation showing the workflow
4. An overview of the 4 steps
5. Step 1 — Make the building blocks (UI component animation)
6. Step 2 — Write your script (script items appearing one by one)
7. Step 3 — Iterate on animation and text (live code mutation)
8. Step 4 — Show the animation or record it (browser + record button)
9. "You just watched the proof. Built exactly this way."
10. Done screen — "Claude Code. Some creativity. // github.com/{your-repo}" → auto-loops

The key idea: the animation they are watching IS the thing being explained.

---

## Stack

- Next.js 15 (App Router)
- React 19
- Motion (`motion/react`) — `m` components + `AnimatePresence` + `LazyMotion`
- Tailwind CSS v3
- TypeScript

---

## How to run

```bash
pnpm install
pnpm dev
# → http://localhost:3000/video-animation-story
```

`/` redirects to `/video-animation-story`.

---

## Architecture

### Phase system

```ts
type Phase = "hook" | "bridge" | "chat" | "steps" | "step1" | "step2" | "step3" | "step4" | "payoff" | "done"
```

Each phase maps to a screen component. The `next` record defines the linear sequence:

```ts
const next: Record<Exclude<Phase, "done">, Phase> = {
  hook: "bridge",
  bridge: "chat",
  // ...
  step4: "payoff",
  payoff: "done"
}
```

`CONTENT_PHASES` is the ordered list of phases that show a progress dot. `done` is not in this array — it's the auto-loop state.

### Each screen component

Every screen receives `{ onComplete: () => void }` and calls it via `setTimeout` inside a `useEffect`:

```tsx
function HookScreen({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const t = setTimeout(onComplete, 3500)
    return () => clearTimeout(t)
  }, [onComplete])

  return <>{/* JSX */}</>
}
```

This is the entire sequencing system — no external state machine, no libraries.

### Transitions

Screens slide in from the right and exit to the left:

```ts
const slide = {
  initial: { x: 160, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: "-110%", opacity: 0, transition: { duration: 0.38, ease: [0.55, 0, 1, 0.45] } },
  transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
}
```

Wrapped in `<AnimatePresence mode="wait">` so exit completes before the next screen enters.

### loopKey

The `loopKey` integer is incremented on replay. Each screen is keyed with `${phase}-${loopKey}` so React fully remounts it and resets all internal state:

```tsx
<m.div key={`${p}-${loopKey}`} {...slide}>
  {screens[p]}
</m.div>
```

### LazyMotion

The layout wraps everything in `<LazyMotion features={domMax} strict>`. This is required for `m.*` components (the lightweight `motion` alternative). Without it, `m.div` does nothing.

```tsx
// src/lib/motion/lazy-motion.tsx
import { LazyMotion } from "motion/react"
import loadFeatures from "./features"

export function MotionProvider({ children }) {
  return <LazyMotion features={loadFeatures} strict>{children}</LazyMotion>
}
```

---

## Design tokens

```ts
const CORAL    = "#D97757"          // brand / highlight / progress dots / active elements
const CHARCOAL = "#1A1817"          // primary text
const MUTED    = "rgba(26,24,23,0.45)"  // secondary text
const DIM      = "rgba(26,24,23,0.22)"  // tertiary / captions
const BG       = "#F5F3EE"          // page background (warm off-white)
```

Terminal block uses its own dark tokens:
```ts
const TERM_BG     = "#1C1B22"
const TERM_PROMPT = "#D97757"  // same coral
const TERM_TEXT   = "rgba(255,255,255,0.88)"
const TERM_DIM    = "rgba(255,255,255,0.28)"
```

---

## Screens — detail

### HookScreen
Words of the question stagger in with `delay: i * 0.09`. Two words highlighted in coral with underline.
Duration: 3.5s

### BridgeScreen
"I'll show you how I did it, with" streams in word by word.
Then: Claude Code logo (SVG starburst) + "some creativity 🪄" fade in together.
Duration: 3.5s

### ChatScreen
3-stage animation:
1. Types the prompt character by character (40ms/char)
2. Shows `{your plan}` placeholder pill
3. "Building your animation…" → "Done." → types `localhost:3000/my-animation`

### StepsOverviewScreen
"This is how I set it up." + 4 numbered steps stagger in.
Duration: 3.5s

### Step1Screen (4.2s)
Builds a fake UI panel in stages: header → content rows → button moves from top-right to bottom-right.
Internal `stage` 0–4 driven by `setTimeout`.

### Step2Screen (4.2s)
4 script items appear one by one at 650ms intervals.

### Step3Screen (4.8s)
Two AI prompts appear. Between them, a code block mutates live:
- `duration: 0.65` → `0.35` (highlighted coral)
- `delay: 0` → `0.4` (highlighted coral)
Caption: "Two messages. Two saves. Done."

### Step4Screen (4.0s)
Browser chrome mockup with address bar (`localhost:3000/my-animation`).
After 1.8s: record dot pulses coral + "Recording..."
After 2.3s: "No post-production. No exports. Just a URL."

### PayoffScreen (4.0s)
"You just watched the proof." / "Built exactly this way."

### Done screen (auto-loop after 3s)
"Claude Code." / "Some creativity." / `// github.com/{your-repo}` in coral.
Triggers `setPhase("hook")` + increments `loopKey`.

---

## Progress dots

9 dots (one per `CONTENT_PHASES` entry). Active dot expands from `w-6px` to `w-18px` and turns coral. Uses `m.div` with `animate={{ width, backgroundColor }}`.

---

## Other UI

- **Top-left**: Claude Code logo (12-spoke SVG starburst on coral rounded square) + "Claude Code" label — always visible
- **Bottom-right**: ↺ Replay button — resets to hook + increments loopKey
- **Background**: warm radial gradient overlay (`rgba(217,119,87,0.08)`) over the off-white BG
- **Light mode forced**: removes `.dark` class from `<html>` on mount, restores on unmount

---

## How to adapt this for your own content

1. Change `CONTENT_PHASES` to your phase names
2. Add/remove screen components (each just needs `{ onComplete }` prop + `setTimeout` to advance)
3. Update the `next` record to match your new sequence
4. Replace screen content — the `StepWrapper` component handles the numbered step layout reuse
5. Swap design tokens (CORAL, BG, CHARCOAL) for your brand colors
6. Update the `done` screen with your repo/CTA

The hard part is not the code — it's the script. Write each screen as one clear idea. The order becomes the story.

---

## File structure

```
src/
  app/
    layout.tsx                    — wraps with MotionProvider
    page.tsx                      — redirects to /video-animation-story
    globals.css                   — Tailwind directives + reset
    video-animation-story/
      page.tsx                    — all screens + phase logic (single file)
  lib/
    motion/
      features.ts                 — exports domMax
      lazy-motion.tsx             — LazyMotion provider
```

Everything lives in one file (`page.tsx`). Screen components are defined above the page component. This is intentional — it keeps the whole animation readable as a single document.
