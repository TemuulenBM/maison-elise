// Framer Motion variants defined per animation spec

export const EASE_LUXURY = [0.25, 0.1, 0.25, 1] as const

// Page / section entrance
export const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: EASE_LUXURY },
  },
}

// Container for stagger children (0.08s per spec)
export const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
}

// Image hover: scale 1.03 over 0.7s
export const imageHover = {
  rest: { scale: 1 },
  hover: {
    scale: 1.03,
    transition: { duration: 0.7, ease: "easeOut" as const },
  },
}

// Button click: scale 0.97 over 0.15s (PDF 8.2 spec)
export const buttonTap = { scale: 0.97, transition: { duration: 0.15 } }
