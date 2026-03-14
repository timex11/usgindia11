"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface AnimatedCardProps extends React.ComponentProps<typeof Card> {
  children: React.ReactNode;
  delay?: number;
  hoverEffect?: boolean;
}

export function AnimatedCard({ 
  children, 
  className, 
  delay = 0, 
  hoverEffect = true,
  ...props 
}: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      whileHover={hoverEffect ? { y: -5, transition: { duration: 0.2 } } : undefined}
    >
      <Card 
        className={cn(
          "h-full overflow-hidden transition-all duration-300",
          hoverEffect && "hover:shadow-lg hover:border-primary/20",
          className
        )} 
        {...props}
      >
        {children}
      </Card>
    </motion.div>
  );
}

export { CardContent, CardDescription, CardFooter, CardHeader, CardTitle };
