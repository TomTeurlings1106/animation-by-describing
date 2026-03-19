# animation-by-describing

Make product animations by describing them — no After Effects, no Figma, just a conversation with Claude Code.

**See it live:** [github.com/TomTeurlings1106/animation-by-describing](https://github.com/TomTeurlings1106/animation-by-describing) → navigate to `/animation`

---

## What you need

- [Node.js](https://nodejs.org) (v18 or later)
- [pnpm](https://pnpm.io/installation) — `npm install -g pnpm`
- [Claude Code](https://claude.ai/code) — the CLI, not the website

---

## Get up and running

```bash
git clone https://github.com/TomTeurlings1106/animation-by-describing.git
cd animation-by-describing
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) — you should see the demo animation.

---

## Build your own animation

Open Claude Code in this folder:

```bash
claude
```

Then run:

```
/get-started
```

Claude will interview you — your goal, what you want to say, your brand colors — and drop straight into a plan. Approve the plan and it builds the whole thing.

Your animation lands at `http://localhost:3000/your-animation-name`.

---

## How it works (the short version)

Each animation is a single Next.js page at `src/app/[name]/page.tsx`. It's a state machine where each screen is a React component. Screens auto-advance on a timer (loop mode) or wait for a click/keypress (slides mode).

Copy `src/app/animation/page.tsx` as your starting point and describe what you want to change — Claude handles the rest.

---

## Iterating

Once you have something running, just describe what feels off:

> "make it snappier"
> "the exit feels abrupt"
> "add a pause between screens"
> "change the accent color to blue"

Two messages, two saves, done.

---

## Tips

- **Slides mode** — bottom-right toggle. Use arrow keys or click to advance. Good for presenting live.
- **Replay** — bottom-right button. Restarts from the first screen.
- **Record** — just screen-record the browser at `/your-animation`. No exports needed.
- **Deploy** — works on Vercel out of the box. `vercel --prod` and share the URL.
