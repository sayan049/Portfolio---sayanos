import type { Variants } from 'framer-motion'

export const duration = {
  instant:   0.08,
  fast:      0.15,
  normal:    0.22,
  medium:    0.35,
  slow:      0.50,
  cinematic: 0.70,
} as const

export const ease = {
  out:   [0.16, 1, 0.3, 1]  as [number, number, number, number],
  inOut: [0.45, 0, 0.55, 1] as [number, number, number, number],
} as const

export const spring = {
  soft:   { type: 'spring' as const, stiffness: 200, damping: 28 },
  dock:   { type: 'spring' as const, stiffness: 320, damping: 22 },
  window: { type: 'spring' as const, stiffness: 380, damping: 35 },
} as const

export const windowVariants: Variants = {
  hidden: { opacity: 0, scale: 0.93, y: 8 },
  visible: {
    opacity: 1, scale: 1, y: 0,
    transition: spring.window,
  },
  exit: {
    opacity: 0, scale: 0.96, y: 4,
    transition: { duration: 0.18, ease: ease.out },
  },
}

export const listVariants: Variants = {
  hidden:  { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
}

export const listItemVariants: Variants = {
  hidden:  { opacity: 0, y: 8 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: duration.normal, ease: ease.out },
  },
}

export const fadeInVariants: Variants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: duration.medium } },
}

export const slideDownVariants: Variants = {
  hidden:  { opacity: 0, y: -28 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: duration.medium, ease: ease.out },
  },
}

export const slideUpVariants: Variants = {
  hidden:  { opacity: 0, y: 40 },
  visible: {
    opacity: 1, y: 0,
    transition: spring.soft,
  },
}

export const scaleInVariants: Variants = {
  hidden:  { opacity: 0, scale: 0.94 },
  visible: {
    opacity: 1, scale: 1,
    transition: { duration: duration.medium, ease: ease.out },
  },
}