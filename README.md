# How I made a product demo video entirely in code

*See it live: [`/animation`](/animation) — the animation that explains itself.*

Most people open After Effects or Figma to make a product demo. I opened my code editor.

---

## Use this as a template

Clone it, run it, then swap in your own content.

```bash
pnpm install
pnpm dev
# → http://localhost:3000/animation
```

Everything lives in one file: `src/app/animation/page.tsx`.

**To customise:**
1. Swap the design tokens at the top of the file (colors, background)
2. Replace `HOOK_WORDS` with your opening question
3. Add or remove screen components — each just needs an `{ onComplete }` prop + a `setTimeout` to advance
4. Update `CONTENT_PHASES` and the `next` map to match your screen order
5. Update the `done` screen at the bottom with your repo/CTA

See [CONTEXT.md](./CONTEXT.md) for a full architecture walkthrough.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/YOUR_REPO)

---

Here's how I built a fully animated, looping product demo for Saleshunt — and why doing it this way is a superpower.

---

## The process

### 1. Build the components
I started with the actual product UI. The animated cards you see in the video — the search bar, the prospect discovery loader, the outreach emails firing off, the live signals — are the **same React components** that live on the real sign-in page.

Build it once. Use it everywhere.

### 2. Wire up the big animation
Each card gets two props: `active` (is it your turn?) and `onComplete` (call this when you're done). A simple state machine chains them together:

```
Search → Discovery → Outreach → Signals → (loop)
```

No timers manually coordinated. No hardcoded delays. Each card just signals when it's finished and the next one starts.

### 3. Fine-tune the animation
This is where the magic is. Tweaking a timing in code is changing one number. Want the email to feel snappier? Change `650` to `400`. Want a longer pause before the loop restarts? Change `1200` to `3500`.

In a video editor you'd scrub through a timeline. In code you just hit save and it re-renders instantly.

### 4. Add the narrative text
Layered in the story screens — the intro ("Describe who you sell to. **Start Closing.**"), the manifesto with the 4 steps streaming in, and the step labels above each product card.

Framer Motion handles all the entrance/exit animations. Slide in from the right. Fade out to the left. It looks cinematic and took about 10 lines of code per transition.

### 5. Screen record
Navigate to `/animation`. Hit record. Done.

The page loops automatically. Light mode, dark mode — there's a toggle button. No post-production needed.

---

## Why this is a superpower

**It compounds.** Every component I build for the product is a potential asset for the next video. The outreach card I animated today lives on the sign-in page tomorrow. The signals card I tuned for the video is the same one users see when they log in.

**It's version controlled.** Every tweak is a git commit. I can go back to any version of the animation instantly.

**It's always up to date.** When the product changes, the demo changes with it — because they're literally the same code.

**It's infinitely tweakable.** Font too small? One class change. Timing off? One number. Colors don't pop? Done. No re-exporting, no re-rendering, no waiting.

---

## The stack

- **Next.js** — the page is just a route (`/animation`)
- **Framer Motion** — all transitions and entrance animations
- **Tailwind CSS** — styling, dark mode, everything
- **React state** — the entire animation sequencing is just a few `useState` hooks

No video editing software. No design tools. Just code.

---

## How to build one of these with a coding AI

You don't need to know Framer Motion deeply. You need to know how to describe what you want. Here are the patterns that actually work.

### Describe screens, not animations

Tell the AI what each screen *shows*, not how it moves. "Show a search bar that types out a company name, then fades out" is better than "use a staggered opacity animation with a 0.3s delay." The AI knows the Framer Motion API — your job is to describe the story.

### Build one screen at a time

Don't ask for the whole animation in one shot. Start with the first screen, get it right, then say "now add the next screen that shows X, and when this one finishes it should slide out to the left." Each screen is independent. Tackle them one by one.

### Give the AI the `active` + `onComplete` pattern upfront

This is the architecture that makes everything composable. Tell the AI: *"each screen component should accept two props: `active` (boolean) and `onComplete` (callback). When the screen is done, it calls `onComplete` and the parent advances to the next phase."* With this contract established, every screen the AI writes will plug into the sequence automatically.

### Use a phase state machine

The sequencing logic is just a string union and a `useState`:

```typescript
type Phase = "text" | "search" | "discovery" | "outreach" | "done"
const [phase, setPhase] = useState<Phase>("text")
```

Ask the AI to follow this pattern explicitly. It's simple, readable, and easy to extend — adding a new screen is just adding a new phase string and a new `AnimatePresence` branch.

### Tell the AI you want `AnimatePresence mode='wait'`

Without this, the next screen enters before the current one finishes exiting. With `mode='wait'`, Framer Motion waits for the exit animation to complete before mounting the next component. Always ask for this. It's the difference between a jumbled transition and a cinematic one.

### The `loopKey` trick — ask for it explicitly

When the animation loops back to the start, React sees the same component and doesn't re-run its animations. The fix is a `loopKey` counter that increments on each loop, which you pass into each element's `key` prop (e.g. `key={\`search-${loopKey}\`}`). This forces React to remount the component and replay the animation from scratch. This is non-obvious — explicitly tell the AI: *"when it loops, I need all animations to reset and replay."*

### Slide right in, slide left out — as a default

The pattern in every animation here:
- **Enter**: slide in from the right (`initial={{ x: 180, opacity: 0 }}`)
- **Exit**: slide out to the left (`exit={{ x: "-110%", opacity: 0 }}`)

This gives a natural left-to-right narrative flow. Ask the AI to use this as the default for all screen transitions. You can always tweak individual screens later.

### Fine-tune with plain language

Once the structure is built, tweaking is just describing feelings. "Make the search card feel snappier." "Add a longer pause before the loop restarts." "The exit feels too slow." The AI will find the right number to change. You don't need to know that `650` means 650ms.

### Keep each screen as its own component

Separate components (`TextIntro`, `SearchCard`, `DiscoveryCard`) mean you can ask the AI to change one screen without touching the others. If everything is in one monolithic render function, every edit risks breaking the whole thing.

### The page is just a route

Each animation is a Next.js page at `/animation-2`, `/animation-3`, etc. Ask the AI to scaffold it as a simple page component with a fullscreen flex container and a centered content area. The routing infrastructure is already there — you're just adding files.

---

*The coolest part? The demo you just watched is running live in a browser right now.*
