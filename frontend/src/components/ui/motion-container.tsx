"use client";

import { motion } from "framer-motion";

interface MotionContainerProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function MotionContainer({ children, className, delay = 0 }: MotionContainerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{
        duration: 0.4,
        ease: [0.25, 0.1, 0.25, 1.0], // cubic-bezier for smooth easing
        delay: delay,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1.0],
    },
  },
};
