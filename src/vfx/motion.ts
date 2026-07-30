import type { Transition, Variants } from 'framer-motion';

// Geist-grade easing curves
export const EASE_OUT = [0.16, 1, 0.3, 1] as const;
export const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const;

// Duration constants — 200-400ms window
export const DURATION_FAST = 0.2;
export const DURATION_BASE = 0.3;
export const DURATION_SLOW = 0.4;

// Base spring for physics-based interactions
export const SPRING_TIGHT: Transition = {
  type: 'spring',
  stiffness: 500,
  damping: 40,
  mass: 0.8,
};

export const SPRING_SOFT: Transition = {
  type: 'spring',
  stiffness: 260,
  damping: 30,
  mass: 1,
};

// Fade in with subtle lift — GPU only (transform + opacity)
export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
};

export const fadeInScale: Variants = {
  initial: { opacity: 0, scale: 0.96 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.98 },
};

export const staggerContainer: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.02,
    },
  },
};

// Button micro-interaction — physics based
export const buttonMotion = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.97 },
  transition: SPRING_TIGHT,
};

// Tab pill layout animation (FLIP via layoutId)
export const tabPillTransition: Transition = {
  type: 'spring',
  stiffness: 400,
  damping: 32,
};