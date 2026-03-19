# animate-by-describing

**Explaining things visually is a superpower**. A well-crafted animation communicates faster than a paragraph, and for anyone using content as their marketing engine — the ability to produce these **quickly** and **cheaply** is a serious edge.

This repo is built around one idea: what if you could create animations just by describing them? Not a one-shot prompt and hoping for the best, but a **proper system** — a structure you can **iterate on by simply telling it what to change**.

The starting point is always a conversation. Describe your idea, ideate with Claude on how to shape it into a visual, and within a few minutes you have something real on screen. From there it's just writing and adjusting until it feels right.

And it **compounds**. Every screen you build can be reused in the next animation. Every animation you keep in this repo becomes context for the next one — the components, the patterns, the timing decisions. **The library grows with you**.

---

```bash
pnpm install && pnpm dev
# → http://localhost:3000/animation
```

**Ready to build your own?** Open Claude Code in this repo and run:

```
/get-started
```

It will interview you — starting with your goal, then a brain dump, then your brand colors (paste a URL or describe them) — and drop straight into plan mode with a complete screen-by-screen implementation plan ready to build.

Or dive in manually: create `src/app/my-animation/page.tsx` and copy `src/app/animation/page.tsx` as the starting point.

---

## Step 1 — Make the building blocks

Each screen is a React component with two props:

```tsx
function MyScreen({ onComplete, mode }: { onComplete: () => void; mode: "loop" | "slides" }) {
  useEffect(() => {
    if (mode === "slides") return
    const t = setTimeout(onComplete, 4000)
    return () => clearTimeout(t)
  }, [onComplete, mode])

  return <div>your content here</div>
}
```

`onComplete` — call this when the screen is done and the next one should start.
`mode` — `"loop"` auto-advances; `"slides"` waits for a click or keypress.

Build one screen at a time. Get each one right before moving to the next. Every screen you make goes into `src/components/animation/` — your component library grows with each animation you build.

## Step 2 — Write the story you want to tell

Before wiring anything up, write each screen in plain language:

```
Screen 1 — hook: one sharp question
Screen 2 — show the problem
Screen 3 — show your solution
Screen 4 — payoff / CTA
```

Then wire them into the phase state machine:

```ts
type Phase = "hook" | "problem" | "solution" | "payoff" | "done"
const CONTENT_PHASES: Phase[] = ["hook", "problem", "solution", "payoff"]

const next = { hook: "problem", problem: "solution", solution: "payoff", payoff: "done" }
```

Add each screen to the `screens` map — the loop, progress dots, and slide navigation all work automatically.

## Step 3 — Iterate on animation and text

Describe what feels off in plain language and let the AI adjust:

> "make it snappier" → lower the `duration`
> "add a pause before the next screen" → increase the `setTimeout` ms
> "the exit feels abrupt" → adjust the `exit` transition in the `slide` object

Swap the five color tokens at the top of the file to match your brand:

```ts
const CORAL = "#D97757"     // accent
const CHARCOAL = "#1A1817"  // primary text
const BG = "#F5F3EE"        // background
```

## Step 4 — Record or demo as is

Navigate to `/my-animation`. Screen record it, show it at your next meeting, or deploy to Vercel and put it live.
Switch to `⊞ Slides` mode (bottom right) to present with arrow keys.

---

## The pattern that keeps everything composable

Ask an AI to follow these three patterns explicitly — every screen it writes will plug in automatically:

- `AnimatePresence mode="wait"` — waits for exit before mounting the next screen
- `loopKey` counter on each element's `key` — forces animations to replay on loop
- `mode` prop on every screen — same component works in both loop and slides

