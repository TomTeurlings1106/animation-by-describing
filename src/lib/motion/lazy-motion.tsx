"use client"

import { LazyMotion } from "motion/react"
import loadFeatures from "./features"

export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      {children}
    </LazyMotion>
  )
}
