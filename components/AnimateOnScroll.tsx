"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

const motionComponents = {
  div: motion.div,
  section: motion.section,
  header: motion.header,
  article: motion.article,
};

interface AnimateOnScrollProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: keyof typeof motionComponents;
}

export function AnimateOnScroll({
  children,
  className,
  delay = 0,
  as = "div",
}: AnimateOnScrollProps) {
  const Component = motionComponents[as];

  return (
    <Component
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.25, 0.1, 0.25, 1] as const,
      }}
      className={className}
    >
      {children}
    </Component>
  );
}
