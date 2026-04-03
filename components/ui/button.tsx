"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "ref"> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "glass" | "accent";
  size?: "sm" | "md" | "lg" | "xl";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, leftIcon, rightIcon, children, ...props }, ref) => {
    const variants = {
      primary: "bg-white text-[#672cb9] hover:bg-gray-50 shadow-sm",
      secondary: "bg-[#672cb9] text-white hover:bg-[#56249d] shadow-md shadow-[#672cb9]/20",
      accent: "bg-[#ffa515] text-[#0d0415] hover:bg-[#ffb435] shadow-md shadow-[#ffa515]/20",
      outline: "bg-transparent border border-gray-200 text-gray-700 hover:bg-gray-50",
      ghost: "bg-transparent text-gray-600 hover:bg-gray-100",
      glass: "bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 shadow-[0_8px_32px_rgba(255,255,255,0.1)]",
    };

    const sizes = {
      sm: "px-4 py-2 text-xs rounded-xl",
      md: "px-6 py-3 text-sm rounded-2xl",
      lg: "px-8 py-4 text-base rounded-2xl",
      xl: "px-10 py-5 text-lg rounded-[24px]",
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-bold transition-all disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            {leftIcon && <span className="shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="shrink-0">{rightIcon}</span>}
          </>
        )}
      </motion.button>
    );
  }
);

Button.displayName = "Button";
