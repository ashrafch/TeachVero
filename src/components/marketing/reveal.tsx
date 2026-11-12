"use client";
import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
export function Reveal({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      initial={false}
      whileInView={reduced ? undefined : { y: [8, 0] }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      {children}
    </motion.div>
  );
}
