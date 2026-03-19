import type { Metadata } from "next"
import "./globals.css"
import { MotionProvider } from "@/lib/motion/lazy-motion"

export const metadata: Metadata = {
  title: "Animation Demo",
  description: "Animation built with Next.js and Motion",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  )
}
