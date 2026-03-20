import type { Metadata } from "next"
import "./globals.css"
import { MotionProvider } from "@/lib/motion/lazy-motion"

export const metadata: Metadata = {
  title: "Animation Demo",
  description: "Animation built with Next.js and Motion",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🤠</text></svg>",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  )
}
