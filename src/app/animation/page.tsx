"use client"

import { useEffect, useState } from "react"
import { m, AnimatePresence } from "motion/react"

// ─── Design tokens — swap these for your brand colors ─────────────────────────

const CORAL = "#D97757"                  // accent / highlight / CTAs
const CHARCOAL = "#1A1817"               // primary text
const MUTED = "rgba(26,24,23,0.45)"      // secondary text
const DIM = "rgba(26,24,23,0.22)"        // captions / tertiary
const BG = "#F5F3EE"                     // page background

// ─── Claude logo — starburst icon ────────────────────────────────────────────

function ClaudeLogo({ size = 36 }: { size?: number }) {
	return (
		<svg width={size} height={size} viewBox='0 0 100 100' fill='none' xmlns='http://www.w3.org/2000/svg'>
			<rect width='100' height='100' rx='22' fill={CORAL} />
			{Array.from({ length: 12 }, (_, i) => (
				<rect
					key={i}
					x='47'
					y='13'
					width='6'
					height='29'
					rx='3'
					fill='white'
					transform={`rotate(${i * 30} 50 50)`}
				/>
			))}
		</svg>
	)
}

// ─── Hook — your opening question, staggered word by word ─────────────────────
// ↓ Replace with your hook. Words in HOOK_HIGHLIGHT get coral underline emphasis.

const HOOK_WORDS = ["What", "if", "making", "animations", "was", "as", "simple", "as", "describing", "them?"]
const HOOK_HIGHLIGHT: Record<string, boolean> = { animations: true, describing: true }

function HookScreen({ onComplete, mode }: { onComplete: () => void; mode: "loop" | "slides" }) {
	useEffect(() => {
		if (mode === "slides") return
		const t = setTimeout(onComplete, 5500)
		return () => clearTimeout(t)
	}, [onComplete, mode])

	return (
		<m.p
			className='text-[2.5rem] font-semibold leading-snug tracking-[-0.03em]'
			style={{ color: CHARCOAL }}>
			{HOOK_WORDS.map((word, i) => (
				<m.span
					key={i}
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1], delay: i * 0.09 }}
					style={
						HOOK_HIGHLIGHT[word]
							? { color: CORAL, textDecoration: "underline", textDecorationColor: CORAL, textUnderlineOffset: "3px" }
							: {}
					}>
					{word}
					{i < HOOK_WORDS.length - 1 ? " " : ""}
				</m.span>
			))}
		</m.p>
	)
}

// ─── Bridge ───────────────────────────────────────────────────────────────────

function BridgeScreen({ onComplete, mode }: { onComplete: () => void; mode: "loop" | "slides" }) {
	useEffect(() => {
		if (mode === "slides") return
		const t = setTimeout(onComplete, 5000)
		return () => clearTimeout(t)
	}, [onComplete, mode])

	return (
		<div className='flex flex-col gap-6'>
			{/* Streaming intro line */}
			<p className='text-[2rem] font-semibold leading-snug tracking-[-0.025em]' style={{ color: CHARCOAL }}>
				{["I'll", "show", "you", "how", "I", "did", "it,", "with"].map((w, i) => (
					<m.span
						key={i}
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1], delay: i * 0.08 }}>
						{w}{" "}
					</m.span>
				))}
			</p>

			{/* Tools — side by side */}
			<m.div
				initial={{ opacity: 0, y: 12 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: 0.75 }}
				className='flex items-center gap-3 flex-wrap'>
				{/* Claude Code */}
				<div className='flex items-center gap-2'>
					<ClaudeLogo size={32} />
					<span className='text-xl font-semibold tracking-[-0.015em]' style={{ color: CHARCOAL }}>
						Claude Code
					</span>
				</div>

				{/* Plus */}
				<span className='text-xl font-semibold' style={{ color: DIM }}>+</span>

				{/* Some creativity */}
				<div className='flex items-center gap-2'>
					<span className='text-xl leading-none'>🪄</span>
					<span className='text-xl font-semibold tracking-[-0.015em]' style={{ color: MUTED }}>
						some creativity
					</span>
				</div>
			</m.div>
		</div>
	)
}

// ─── Chat ─────────────────────────────────────────────────────────────────────

const TYPED_PART = "Make an animation for my plan, here is some context of what I wanna say "

const TERM_BG = "#1C1B22"
const TERM_PROMPT = "#D97757"
const TERM_TEXT = "rgba(255,255,255,0.88)"
const TERM_DIM = "rgba(255,255,255,0.28)"

function ChatScreen({ onComplete, mode }: { onComplete: () => void; mode: "loop" | "slides" }) {
	const [typed, setTyped] = useState("")
	const [showCursor, setShowCursor] = useState(true)
	const [showPlaceholder, setShowPlaceholder] = useState(false)
	const [stage, setStage] = useState<"typing" | "concocting" | "done">("typing")
	const [responseText, setResponseText] = useState("")
	const RESPONSE = "localhost:3000/my-animation"

	// Stage 1 — type the prompt
	useEffect(() => {
		let i = 0
		const interval = setInterval(() => {
			if (i < TYPED_PART.length) {
				setTyped(TYPED_PART.slice(0, i + 1))
				i++
			} else {
				clearInterval(interval)
				setShowCursor(false)
				setTimeout(() => setShowPlaceholder(true), 180)
				setTimeout(() => setStage("concocting"), 800)
			}
		}, 40)
		return () => clearInterval(interval)
	}, [])

	// Stage 2 — type the response
	useEffect(() => {
		if (stage !== "concocting") return
		setTimeout(() => {
			setStage("done")
			let j = 0
			const interval = setInterval(() => {
				if (j < RESPONSE.length) {
					setResponseText(RESPONSE.slice(0, j + 1))
					j++
				} else {
					clearInterval(interval)
					if (mode === "loop") setTimeout(onComplete, 2500)
				}
			}, 38)
			return () => clearInterval(interval)
		}, 1400)
	}, [stage, onComplete, mode])

	return (
		<m.div
			initial={{ opacity: 0, y: 18 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
			className='flex flex-col gap-4'>
			<p className='text-3xl font-semibold leading-snug tracking-[-0.025em]' style={{ color: CHARCOAL }}>
				Here is how I make animations now:
			</p>
			<div
				className='overflow-hidden rounded-xl font-mono text-base'
				style={{ background: TERM_BG, border: "1px solid rgba(255,255,255,0.07)" }}>

				{/* Input row — highlighted */}
				<div className='flex items-start gap-2.5 px-4 py-3' style={{ background: "rgba(255,255,255,0.05)" }}>
					<span style={{ color: TERM_PROMPT, flexShrink: 0 }}>❯</span>
					<span style={{ color: TERM_TEXT, lineHeight: 1.5 }}>
						{typed}
						{showCursor && (
							<span
								className='inline-block w-1.5 align-text-bottom'
								style={{ background: TERM_PROMPT, height: "1em", borderRadius: 1 }}
							/>
						)}
						{showPlaceholder && (
							<m.span
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ duration: 0.25 }}
								className='rounded px-1.5 py-0.5 text-xs'
								style={{
									background: "rgba(217,119,87,0.15)",
									border: "1px dashed rgba(217,119,87,0.45)",
									color: TERM_PROMPT,
									fontStyle: "italic"
								}}>
								{"{your plan}"}
							</m.span>
						)}
					</span>
				</div>

				{/* Concocting row */}
				{(stage === "concocting" || stage === "done") && (
					<m.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.2 }}
						className='flex items-center gap-2.5 px-4 py-2'>
						<span style={{ color: TERM_PROMPT }}>*</span>
						<span style={{ color: TERM_PROMPT }}>
							{stage === "concocting" ? "Building your animation…" : "Done."}
						</span>
					</m.div>
				)}

				{/* Separator */}
				{stage === "done" && (
					<m.div
						initial={{ scaleX: 0 }}
						animate={{ scaleX: 1 }}
						transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
						style={{ height: 1, background: "rgba(255,255,255,0.1)", transformOrigin: "left" }}
					/>
				)}

				{/* Response row */}
				{stage === "done" && (
					<m.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.2, delay: 0.35 }}
						className='flex items-center gap-2.5 px-4 py-3'>
						<span style={{ color: TERM_DIM }}>❯</span>
						<span style={{ color: TERM_TEXT }}>{responseText}</span>
					</m.div>
				)}

				{/* Status bar */}
				<div
					className='px-4 py-2'
					style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
					<span style={{ color: TERM_PROMPT, fontSize: 10 }}>
						►► bypass permissions on · esc to interrupt
					</span>
				</div>
			</div>
		</m.div>
	)
}

// ─── Steps overview ───────────────────────────────────────────────────────────

// ─── Steps — your numbered list, shown as the overview and then one-by-one ────
// ↓ Replace with your steps.

const STEPS = [
	{ n: "01", label: "Make the building blocks" },
	{ n: "02", label: "Write your script" },
	{ n: "03", label: "Iterate on animation and text" },
	{ n: "04", label: "Record or demo as is" }
]

function StepsOverviewScreen({ onComplete, mode }: { onComplete: () => void; mode: "loop" | "slides" }) {
	useEffect(() => {
		if (mode === "slides") return
		const t = setTimeout(onComplete, 5500)
		return () => clearTimeout(t)
	}, [onComplete, mode])

	return (
		<div className='flex flex-col gap-5'>
			<m.p
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
				style={{ color: CHARCOAL }}
				className='text-3xl font-semibold leading-snug tracking-[-0.025em]'>
				This is how I set it up.
			</m.p>
			<div className='flex flex-col gap-3.5'>
				{STEPS.map((step, i) => (
					<m.div
						key={step.n}
						initial={{ opacity: 0, x: 14 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.08 + i * 0.11 }}
						className='flex items-baseline gap-3.5'>
						<span className='w-5 shrink-0 font-mono text-xs font-semibold' style={{ color: CORAL }}>
							{step.n}
						</span>
						<span className='text-2xl font-semibold tracking-[-0.02em]' style={{ color: CHARCOAL }}>
							{step.label}
						</span>
					</m.div>
				))}
			</div>
		</div>
	)
}

// ─── Shared step wrapper ──────────────────────────────────────────────────────

function StepWrapper({
	n,
	label,
	description,
	children
}: {
	n: string
	label: string
	description: string
	children: React.ReactNode
}) {
	return (
		<div className='flex flex-col gap-5'>
			<div className='flex flex-col gap-1.5'>
				<m.p
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
					className='font-mono text-xs font-semibold'
					style={{ color: CORAL }}>
					{n}
				</m.p>
				<m.p
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: 0.07 }}
					className='text-3xl font-semibold tracking-[-0.025em]'
					style={{ color: CHARCOAL }}>
					{label}
				</m.p>
				<m.p
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: 0.14 }}
					className='text-base leading-relaxed'
					style={{ color: MUTED }}>
					{description}
				</m.p>
			</div>
			<m.div
				initial={{ opacity: 0, y: 16 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.24 }}>
				{children}
			</m.div>
		</div>
	)
}

// ─── Step 1 — UI component building animation ─────────────────────────────────

function Step1Screen({ onComplete, mode }: { onComplete: () => void; mode: "loop" | "slides" }) {
	const [stage, setStage] = useState(0)
	// 0 → shell, 1 → header, 2 → rows, 3 → button appears top-right, 4 → button moves to bottom

	useEffect(() => {
		const timers = [
			setTimeout(() => setStage(1), 400),
			setTimeout(() => setStage(2), 950),
			setTimeout(() => setStage(3), 1600),
			setTimeout(() => setStage(4), 2400)
		]
		if (mode === "slides") return () => { timers.forEach(clearTimeout) }
		const t = setTimeout(onComplete, 6500)
		return () => { timers.forEach(clearTimeout); clearTimeout(t) }
	}, [onComplete, mode])

	return (
		<StepWrapper n='01' label='Make the building blocks' description='Use your real product UI. Describe each component — the AI builds it.'>
			<div
				className='overflow-hidden rounded-xl'
				style={{ border: "1px solid rgba(26,24,23,0.12)", background: "rgba(255,255,255,0.6)", minHeight: 130 }}>

				{/* Header bar */}
				{stage >= 1 && (
					<m.div
						initial={{ opacity: 0, y: -8 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
						className='flex items-center justify-between px-4 py-2.5'
						style={{ borderBottom: "1px solid rgba(26,24,23,0.08)", background: "rgba(26,24,23,0.03)" }}>
						<div className='flex items-center gap-2'>
							<div className='h-5 w-5 rounded-full' style={{ background: CORAL + "55" }} />
							<div className='h-2 w-16 rounded-full' style={{ background: "rgba(26,24,23,0.15)" }} />
						</div>
						{/* Button — starts here at stage 3, leaves at stage 4 */}
						{stage === 3 && (
							<m.div
								initial={{ opacity: 0, scale: 0.85 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
								className='rounded-lg px-3 py-1 text-xs font-semibold'
								style={{ background: CORAL, color: "white" }}>
								Get started
							</m.div>
						)}
					</m.div>
				)}

				{/* Content rows */}
				{stage >= 2 && (
					<m.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
						className='flex flex-col gap-2.5 px-4 py-3'>
						{[70, 90, 55].map((w, i) => (
							<m.div
								key={i}
								initial={{ opacity: 0, x: -10 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1], delay: i * 0.12 }}
								className='h-2 rounded-full'
								style={{ width: `${w}%`, background: "rgba(26,24,23,0.1)" }}
							/>
						))}
					</m.div>
				)}

				{/* Button moved to bottom */}
				{stage >= 4 && (
					<m.div
						initial={{ opacity: 0, y: 8 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
						className='flex justify-end px-4 pb-3'>
						<div
							className='rounded-lg px-3 py-1 text-xs font-semibold'
							style={{ background: CORAL, color: "white" }}>
							Get started
						</div>
					</m.div>
				)}
			</div>
		</StepWrapper>
	)
}

// ─── Step 2 — script items ─────────────────────────────────────────────────────

const SCRIPT_ITEMS = [
	"Screen 1 — hook: one sharp question",
	"Screen 2 — show how you did it",
	"Screen 3 — walk through each step",
	"Screen 4 — payoff with your logo"
]

function Step2Screen({ onComplete, mode }: { onComplete: () => void; mode: "loop" | "slides" }) {
	const [count, setCount] = useState(0)

	useEffect(() => {
		const timers = SCRIPT_ITEMS.map((_, i) =>
			setTimeout(() => setCount(i + 1), 400 + i * 650)
		)
		if (mode === "slides") return () => { timers.forEach(clearTimeout) }
		const t = setTimeout(onComplete, 6500)
		return () => { timers.forEach(clearTimeout); clearTimeout(t) }
	}, [onComplete, mode])

	return (
		<StepWrapper n='02' label='Write your script' description='Describe each screen in plain language. The order becomes the story.'>
			<div
				className='rounded-xl px-4 py-3.5'
				style={{ background: "rgba(26,24,23,0.04)", border: "1px solid rgba(26,24,23,0.08)" }}>
				<div className='flex flex-col gap-2'>
					{SCRIPT_ITEMS.slice(0, count).map((line, i) => (
						<m.div
							key={i}
							initial={{ opacity: 0, x: 8 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
							className='flex items-start gap-2'>
							<span className='mt-0.5 text-xs' style={{ color: CORAL }}>→</span>
							<span className='text-sm leading-relaxed' style={{ color: CHARCOAL }}>{line}</span>
						</m.div>
					))}
				</div>
			</div>
		</StepWrapper>
	)
}

// ─── Step 3 ───────────────────────────────────────────────────────────────────

function Step3Screen({ onComplete, mode }: { onComplete: () => void; mode: "loop" | "slides" }) {
	const [stage, setStage] = useState(0)
	// 0 → empty
	// 1 → first prompt appears
	// 2 → duration changes 0.65 → 0.35
	// 3 → second prompt appears
	// 4 → delay changes 0 → 0.4
	// 5 → caption

	useEffect(() => {
		const timers = [
			setTimeout(() => setStage(1), 300),
			setTimeout(() => setStage(2), 1100),
			setTimeout(() => setStage(3), 2000),
			setTimeout(() => setStage(4), 2800),
			setTimeout(() => setStage(5), 3300)
		]
		if (mode === "slides") return () => { timers.forEach(clearTimeout) }
		const t = setTimeout(onComplete, 7500)
		return () => { timers.forEach(clearTimeout); clearTimeout(t) }
	}, [onComplete, mode])

	const duration = stage >= 2 ? "0.35" : "0.65"
	const delay = stage >= 4 ? "0.4" : "0"

	return (
		<StepWrapper n='03' label='Iterate on animation and text' description='Just describe what feels off. The AI finds the number.'>
			<div className='flex flex-col gap-2'>

				{/* Prompt 1 */}
				{stage >= 1 && (
					<m.div
						initial={{ opacity: 0, y: 6 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
						className='flex items-center gap-2 font-mono text-sm'
						style={{ color: TERM_PROMPT }}>
						<span>❯</span>
						<span>&ldquo;make it snappier&rdquo;</span>
					</m.div>
				)}

				{/* Code block */}
				{stage >= 1 && (
					<div
						className='rounded-xl px-4 py-3 font-mono text-sm'
						style={{ background: "rgba(26,24,23,0.05)", border: "1px solid rgba(26,24,23,0.08)" }}>
						<span style={{ color: DIM }}>transition: &#123;</span><br />
						<span className='ml-4' style={{ color: MUTED }}>duration: </span>
						<m.span
							animate={{ color: stage >= 2 ? CORAL : CHARCOAL }}
							transition={{ duration: 0.35 }}
							className='font-semibold'>
							{duration}
						</m.span>
						<span style={{ color: MUTED }}>,</span><br />
						<span className='ml-4' style={{ color: MUTED }}>delay: </span>
						<m.span
							animate={{ color: stage >= 4 ? CORAL : CHARCOAL }}
							transition={{ duration: 0.35 }}
							className='font-semibold'>
							{delay}
						</m.span>
						<br />
						<span style={{ color: DIM }}>&#125;</span>
					</div>
				)}

				{/* Prompt 2 */}
				{stage >= 3 && (
					<m.div
						initial={{ opacity: 0, y: 6 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
						className='flex items-center gap-2 font-mono text-sm'
						style={{ color: TERM_PROMPT }}>
						<span>❯</span>
						<span>&ldquo;add a pause between steps&rdquo;</span>
					</m.div>
				)}

				{/* Caption */}
				{stage >= 5 && (
					<m.p
						initial={{ opacity: 0, y: 6 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
						className='text-sm'
						style={{ color: DIM }}>
						Two messages. Two saves. Done.
					</m.p>
				)}
			</div>
		</StepWrapper>
	)
}

// ─── Step 4 ───────────────────────────────────────────────────────────────────

function Step4Screen({ onComplete, mode }: { onComplete: () => void; mode: "loop" | "slides" }) {
	const [recording, setRecording] = useState(false)
	const [showNote, setShowNote] = useState(false)

	useEffect(() => {
		const t1 = setTimeout(() => setRecording(true), 1800)
		const t2 = setTimeout(() => setShowNote(true), 2300)
		if (mode === "slides") return () => { clearTimeout(t1); clearTimeout(t2) }
		const t3 = setTimeout(onComplete, 6000)
		return () => {
			clearTimeout(t1)
			clearTimeout(t2)
			clearTimeout(t3)
		}
	}, [onComplete, mode])

	return (
		<StepWrapper n='04' label='Record or demo as is' description='Navigate to the page. Screen record or share the URL directly.'>
			<div className='flex flex-col gap-2.5'>
				<div
					className='overflow-hidden rounded-xl'
					style={{ border: "1px solid rgba(26,24,23,0.1)", background: "rgba(255,255,255,0.7)" }}>
					<div
						className='flex items-center gap-2 px-3 py-2'
						style={{ borderBottom: "1px solid rgba(26,24,23,0.07)", background: "rgba(26,24,23,0.02)" }}>
						<div className='flex gap-1.5'>
							{[0, 1, 2].map((i) => (
								<div key={i} className='h-2 w-2 rounded-full' style={{ background: "rgba(26,24,23,0.1)" }} />
							))}
						</div>
						<div
							className='flex-1 rounded px-2 py-0.5 text-center font-mono text-xs'
							style={{ background: "rgba(26,24,23,0.05)", color: MUTED }}>
							localhost:3000/my-animation
						</div>
					</div>
					<div className='flex items-center justify-center gap-2.5 py-5'>
						<m.div
							animate={{
								backgroundColor: recording ? CORAL : "rgba(26,24,23,0.15)",
								boxShadow: recording ? `0 0 10px ${CORAL}55` : "none"
							}}
							transition={{ duration: 0.4 }}
							className='h-3 w-3 rounded-full'
						/>
						<span className='text-xs font-medium' style={{ color: MUTED }}>
							{recording ? "Recording..." : "Ready"}
						</span>
					</div>
				</div>
				{showNote && (
					<m.p
						initial={{ opacity: 0, y: 6 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
						className='text-xs'
						style={{ color: DIM }}>
						No post-production. No exports. Just a URL.
					</m.p>
				)}
			</div>
		</StepWrapper>
	)
}

// ─── Payoff ───────────────────────────────────────────────────────────────────

function PayoffScreen({ onComplete, mode }: { onComplete: () => void; mode: "loop" | "slides" }) {
	useEffect(() => {
		if (mode === "slides") return
		const t = setTimeout(onComplete, 6000)
		return () => clearTimeout(t)
	}, [onComplete, mode])

	return (
		<m.div
			initial={{ opacity: 0, y: 12 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
			className='text-center'>
			<p className='text-4xl font-semibold tracking-[-0.03em]' style={{ color: CHARCOAL }}>
				You just watched the proof.
			</p>
			<p className='mt-3 text-lg' style={{ color: MUTED }}>
				Built exactly this way.
			</p>
		</m.div>
	)
}

// ─── Types — add/remove phases to match your screen count ─────────────────────
// Each phase maps to a screen component below. "done" is the auto-loop state.
// CONTENT_PHASES drives the progress dots — one dot per entry.

type Phase = "hook" | "bridge" | "chat" | "steps" | "step1" | "step2" | "step3" | "step4" | "payoff" | "done"
const CONTENT_PHASES: Phase[] = ["hook", "bridge", "chat", "steps", "step1", "step2", "step3", "step4", "payoff"]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function VideoAnimationStoryPage() {
	const [phase, setPhase] = useState<Phase>("hook")
	const [loopKey, setLoopKey] = useState(0)
	const [mode, setMode] = useState<"loop" | "slides">("loop")

	useEffect(() => {
		const html = document.documentElement
		const hadDark = html.classList.contains("dark")
		html.classList.remove("dark")
		return () => {
			if (hadDark) html.classList.add("dark")
		}
	}, [])

	useEffect(() => {
		if (phase !== "done" || mode !== "loop") return
		const t = setTimeout(() => {
			setPhase("hook")
			setLoopKey((k) => k + 1)
		}, 5000)
		return () => clearTimeout(t)
	}, [phase, mode])

	const next: Record<Exclude<Phase, "done">, Phase> = {
		hook: "bridge",
		bridge: "chat",
		chat: "steps",
		steps: "step1",
		step1: "step2",
		step2: "step3",
		step3: "step4",
		step4: "payoff",
		payoff: "done"
	}

	// Keyboard + click-to-advance (slides mode only)
	useEffect(() => {
		if (mode !== "slides") return
		const advance = () => {
			if (phase === "done") { setPhase("hook"); setLoopKey((k) => k + 1); return }
			setPhase(next[phase as Exclude<Phase, "done">])
		}
		const back = () => {
			const i = CONTENT_PHASES.indexOf(phase as Exclude<Phase, "done">)
			if (i > 0) setPhase(CONTENT_PHASES[i - 1])
		}
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); advance() }
			if (e.key === "ArrowLeft") back()
		}
		window.addEventListener("keydown", onKey)
		return () => window.removeEventListener("keydown", onKey)
	}, [mode, phase])

	const slide = {
		initial: { x: 160, opacity: 0 },
		animate: { x: 0, opacity: 1 },
		exit: { x: "-110%", opacity: 0, transition: { duration: 0.38, ease: [0.55, 0, 1, 0.45] } },
		transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
	} as const

	const dotIndex = CONTENT_PHASES.indexOf(phase as Exclude<Phase, "done">)

	const handleContentClick = () => {
		if (mode !== "slides") return
		if (phase === "done") { setPhase("hook"); setLoopKey((k) => k + 1); return }
		setPhase(next[phase as Exclude<Phase, "done">])
	}

	const screens: Partial<Record<Phase, React.ReactNode>> = {
		hook: <HookScreen onComplete={() => setPhase(next.hook)} mode={mode} />,
		bridge: <BridgeScreen onComplete={() => setPhase(next.bridge)} mode={mode} />,
		chat: <ChatScreen onComplete={() => setPhase(next.chat)} mode={mode} />,
		steps: <StepsOverviewScreen onComplete={() => setPhase(next.steps)} mode={mode} />,
		step1: <Step1Screen onComplete={() => setPhase(next.step1)} mode={mode} />,
		step2: <Step2Screen onComplete={() => setPhase(next.step2)} mode={mode} />,
		step3: <Step3Screen onComplete={() => setPhase(next.step3)} mode={mode} />,
		step4: <Step4Screen onComplete={() => setPhase(next.step4)} mode={mode} />,
		payoff: <PayoffScreen onComplete={() => setPhase(next.payoff)} mode={mode} />,
		done: (
			<div className='flex flex-col items-start gap-7'>
				<div className='flex flex-col gap-2'>
					{(
						[
							[0.18, "Claude Code.", CHARCOAL],
							[0.38, "Some creativity.", MUTED]
						] as const
					).map(([delay, text, color]) => (
						<m.p
							key={text}
							initial={{ opacity: 0, y: 14 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay }}
							style={{ color }}
							className='text-[2.75rem] font-semibold tracking-[-0.03em]'>
							{text}
						</m.p>
					))}
					<m.p
						initial={{ opacity: 0, y: 14 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: 0.58 }}
						className='mt-2 font-mono text-xs'
						style={{ color: CORAL }}>
						{"// github.com/{your-repo}"}
					</m.p>
				</div>
			</div>
		)
	}

	return (
		<div
			className='relative flex h-screen w-full items-center justify-center overflow-hidden'
			style={{ background: BG }}>
			{/* Warm wash */}
			<div
				className='pointer-events-none absolute inset-0'
				style={{
					background: "radial-gradient(ellipse 65% 55% at 50% 40%, rgba(217,119,87,0.08) 0%, transparent 65%)"
				}}
			/>

			{/* LinkedIn CTA */}
			<div className='absolute top-5 left-6 z-20'>
				<a
					href='https://www.linkedin.com/in/tom-teurlings-ab791317b/'
					target='_blank'
					rel='noopener noreferrer'
					className='flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold transition-opacity hover:opacity-75'
					style={{
						background: "#0A66C2",
						color: "white",
						boxShadow: "0 1px 4px rgba(10,102,194,0.3)"
					}}>
					<svg width='13' height='13' viewBox='0 0 24 24' fill='white' xmlns='http://www.w3.org/2000/svg'>
						<path d='M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z'/>
					</svg>
					Connect and see more like this
				</a>
			</div>

			{/* Progress dots */}
			<div className='absolute top-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1.5'>
				{CONTENT_PHASES.map((p, i) => (
					<m.div
						key={p}
						animate={{
							width: i === dotIndex ? 18 : 6,
							backgroundColor: i === dotIndex ? CORAL : "rgba(26,24,23,0.18)"
						}}
						transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
						className='h-1.5 rounded-full'
					/>
				))}
			</div>

			{/* Content */}
			<div
				className='relative z-10 w-full max-w-2xl px-12'
				onClick={handleContentClick}
				style={{ cursor: mode === "slides" ? "pointer" : "default" }}>
				<AnimatePresence mode='wait'>
					{CONTENT_PHASES.concat("done" as Phase).map(
						(p) =>
							phase === p && (
								<m.div key={`${p}-${loopKey}`} {...slide}>
									{screens[p]}
								</m.div>
							)
					)}
				</AnimatePresence>
			</div>

			{/* Slides mode hint */}
			<AnimatePresence>
				{mode === "slides" && (
					<m.p
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.4 }}
						className='absolute bottom-6 left-1/2 z-20 -translate-x-1/2 font-mono text-xs'
						style={{ color: DIM }}>
						← → to navigate
					</m.p>
				)}
			</AnimatePresence>

			{/* Controls: Mode toggle + Replay */}
			<div className='absolute bottom-6 right-6 z-20 flex items-center gap-2'>
				<button
					onClick={() => setMode((m) => m === "loop" ? "slides" : "loop")}
					className='rounded-full px-3 py-1.5 text-xs font-medium transition-opacity hover:opacity-60'
					style={{
						background: "rgba(26,24,23,0.06)",
						color: MUTED,
						border: "1px solid rgba(26,24,23,0.09)"
					}}>
					{mode === "loop" ? "⊞ Slides" : "↺ Loop"}
				</button>
				<button
					onClick={() => {
						setPhase("hook")
						setLoopKey((k) => k + 1)
					}}
					className='rounded-full px-3 py-1.5 text-xs font-medium transition-opacity hover:opacity-60'
					style={{
						background: "rgba(26,24,23,0.06)",
						color: MUTED,
						border: "1px solid rgba(26,24,23,0.09)"
					}}>
					↺ Replay
				</button>
			</div>
		</div>
	)
}
