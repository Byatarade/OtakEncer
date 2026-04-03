"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface CardProps extends HTMLMotionProps<"div"> {
  variant?: "white" | "glass" | "dark" | "outline";
  padding?: "none" | "sm" | "md" | "lg" | "xl";
  shadow?: "none" | "sm" | "md" | "lg" | "xl";
  hoverable?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "white", padding = "md", shadow = "md", hoverable = false, ...props }, ref) => {
    const variants = {
      white: "bg-white border border-gray-100",
      glass: "bg-white/10 backdrop-blur-md border border-white/20",
      dark: "bg-[#1c0f2e]/80 backdrop-blur-sm border border-white/10 text-white",
      outline: "bg-transparent border border-gray-200",
    };

    const paddings = {
      none: "p-0",
      sm: "p-4 md:p-6",
      md: "p-6 md:p-8",
      lg: "p-8 md:p-12",
      xl: "p-12 md:p-16",
    };

    const shadows = {
      none: "",
      sm: "shadow-sm",
      md: "shadow-md",
      lg: "shadow-lg",
      xl: "shadow-xl",
    };

    return (
      <motion.div
        ref={ref}
        whileHover={hoverable ? { y: -8, transition: { duration: 0.3 } } : undefined}
        className={cn(
          "rounded-[24px] md:rounded-[32px] overflow-hidden transition-all duration-300",
          variants[variant],
          paddings[padding],
          shadows[shadow],
          className
        )}
        {...props}
      />
    );
  }
);

Card.displayName = "Card";
