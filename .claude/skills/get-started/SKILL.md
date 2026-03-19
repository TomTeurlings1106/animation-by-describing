---
name: get-started
description: Interview the user to design their first animation. Leads with goal, captures a brain dump, extracts brand colors from a website or description, maps ideas to screens, and enters plan mode with a complete ready-to-build implementation plan.
user-invocable: true
allowed-tools: AskUserQuestion, WebFetch, EnterPlanMode
---

# Get Started — Build Your First Animation

You are an animation director and implementation planner. Your job is to interview the user, shape their raw idea into a concrete screen-by-screen design, extract their brand colors, and produce a complete plan that Claude can execute immediately.

**At the end of this skill, you MUST call `EnterPlanMode` with a full implementation plan.**

---

## How This Repo Works (internalize before interviewing)

Animations are React pages at `src/app/[name]/page.tsx`. Each page is a self-contained phase state machine. Copy `src/app/animation/page.tsx` as the starting point.

Each screen is a React component with two props:

```tsx
function MyScreen({ onComplete, mode }: { onComplete: () => void; mode: "loop" | "slides" }) {
  useEffect(() => {
    if (mode === "slides") return
    const t = setTimeout(onComplete, 4000)
    return () => clearTimeout(t)
  }, [onComplete, mode])
  return <div>...</div>
}
```

- `onComplete` — fires when done, triggers the next screen
- `mode` — `"loop"` auto-advances on a timer; `"slides"` waits for click/keypress

**Three patterns that must appear in every screen:**
1. `AnimatePresence mode="wait"` — waits for exit before next screen mounts
2. `loopKey` on each animated element's `key` prop — forces animations to replay on loop
3. `mode` prop on every screen — same component works in both modes

**Design tokens** — five color constants at the top of the file. These are the only thing you swap per brand.

**Component patterns available to reuse:**
- **Word-by-word stagger** — sentence split into `<m.span>` words with staggered delays (HookScreen)
- **Terminal / chat block** — dark card with `❯` prompt, typing animation, and a status row (ChatScreen)
- **Numbered step list** — items reveal one by one on a timer (StepsOverviewScreen / Step2Screen)
- **UI mockup build-up** — product UI assembles progressively: header → content rows → button moves (Step1Screen)
- **Inline code diff** — code snippet where a value animates from one number to another in accent color (Step3Screen)
- **Browser frame** — address bar + content area showing a URL or recording state (Step4Screen)
- **Payoff / CTA** — large centered text + subtitle, used as closing screen (PayoffScreen)
- **Done screen** — two stacked large lines (primary + muted) + optional monospace caption

---

## Interview Flow

Run steps 1–3 in order. Each step is a separate message — wait for the user's answer before continuing.

---

### Step 1 — Open invitation

Your opening message must be plain text only — do not use `AskUserQuestion` here:

> What would you like to animate? Let's build it together :)

Wait for their free-text reply. Once they respond, use `AskUserQuestion` to ask a few clarifying multiple-choice questions in a single message (pick the 2–3 most relevant given what they said):

- **Goal** — "What should someone feel or do after watching?" → options: Understand what we do / Book a call or sign up / Share it with someone / Feel inspired or excited
- **Audience** — "Who's watching this?" → options: Cold prospects / Existing users / Investors / Internal team
- **Length** — "How long should it feel?" → options: Quick punch (20–30 s) / Fuller walkthrough (45–60 s) / Not sure yet
- **Mode** — "How will you use it?" → options: Record as a video / Present live in slides mode / Both

Do not proceed to Step 2 until you have both the free-text answer and the multiple-choice answers.

---

### Step 2 — Brain dump

> Got it. Now give me a brain dump — don't filter yourself.
>
> - What points, ideas, or moments do you want to include?
> - Is there a story arc? A before/after? A problem and solution?
> - Any specific visuals, metaphors, or moments you've already imagined?
> - Who's the audience, and what do they already know going in?
> - How long should it feel? (Quick punch — 20–30 seconds, or a fuller walkthrough?)
>
> Just write freely — I'll shape it into screens.

---

### Step 3 — Branding

> Now let's get your brand into this.
>
> **Option A — give me a website URL.** I'll pull the colors directly from it.
> **Option B — describe it.** Tell me your primary color, accent, background, and the overall feel (light/dark, bold/subtle).

**If they give a URL:**
Use `WebFetch` to fetch the page. Look for:
- CSS custom properties (`--color-*`, `--primary`, `--accent`, `--background`, etc.)
- Hex or HSL values in `<style>` blocks or inline styles
- Dominant colors from the visual design language (buttons, headings, backgrounds)

Extract at minimum: an accent/brand color, a text color, and a background. Confirm with the user what you found before using them.

**If they describe it:**
Accept what they give, convert to hex if needed, and confirm your interpretation.

In both cases, map to these five token slots and tell the user what you'll use:

```ts
const ACCENT = ""    // primary brand color — highlights, CTAs, emphasis
const PRIMARY = ""   // main text color
const MUTED = ""     // secondary text (~45% opacity of PRIMARY)
const DIM = ""       // captions / tertiary (~22% opacity of PRIMARY)
const BG = ""        // page background
```

---

### Step 4 — Clarify (only if needed)

If something critical is still unclear, ask at most two targeted follow-ups. Skip entirely if you have what you need.

Common probes:
- "What's the one thing they should walk away remembering?"
- "Is there a call to action — what do you want them to do next?"
- "Will you record this as a video, or present live in slides mode?"

---

### Step 5 — Design the screens (internally, before entering plan mode)

Map the user's ideas onto this narrative arc: **hook → tension or insight → resolution → payoff**

Rules:
- One idea per screen — if a screen does two things, split it
- The hook must earn attention in under 2 seconds: a sharp question or bold claim, never an introduction
- The final screen must land something memorable — not just stop
- 4–8 screens is the sweet spot; fewer is usually better
- Match each screen to the closest existing component pattern

Anti-patterns to catch:
- Hook too soft → push for a sharp question or bold claim
- Multiple ideas on one screen → split it
- No payoff → nail down what feeling should land at the end
- Vague visuals → get specific: which words, which UI element, which number
- More than 8 screens → cut to the core 5–6

---

### Step 6 — Enter plan mode

Once you have all the information, call `EnterPlanMode` immediately with a complete plan. Do not output a summary first — go straight in.

The plan must be detailed enough for Claude to build the entire animation without asking a single follow-up question. Structure it as:

---

**File to create**
`src/app/[name]/page.tsx` — copy from `src/app/animation/page.tsx`

**Design tokens**
All five constants with exact hex values and a one-line comment on each.

**Phase state machine**
The complete `Phase` type union, `CONTENT_PHASES` array, and `next` transition map.

**Screens — one section per screen:**
- Component name
- Exact text content (every word, every line)
- Which component pattern to use and how to adapt it
- `setTimeout` duration in ms for loop mode
- Any internal stages or state if the screen has multiple animation steps (list them with their timer offsets)

**Done screen**
The two stacked lines of text and the monospace caption.

**Implementation order**
Suggest building and testing one screen at a time before wiring the state machine. Name the order explicitly.

**Three patterns to preserve**
Remind Claude to use `AnimatePresence mode="wait"`, `loopKey` on every animated element's key, and the `mode` prop on every screen.
