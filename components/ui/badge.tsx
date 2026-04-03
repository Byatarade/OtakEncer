"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "primary" | "secondary" | "accent" | "glass" | "success" | "warning";
  size?: "sm" | "md";
  icon?: React.ReactNode;
}

export const Badge = ({ className, variant = "primary", size = "md", icon, children, ...props }: BadgeProps) => {
  const variants = {
    primary: "bg-[#672cb9]/10 text-[#672cb9] border border-[#672cb9]/20",
    secondary: "bg-white/10 text-white border border-white/20 backdrop-blur-md",
    accent: "bg-[#ffa515]/10 text-[#ffa515] border border-[#ffa515]/20",
    glass: "bg-white/20 backdrop-blur-md text-white border border-white/20 shadow-sm",
    success: "bg-[#51cf66]/10 text-[#51cf66] border border-[#51cf66]/20",
    warning: "bg-yellow-500/10 text-yellow-600 border border-yellow-500/20",
  };

  const sizes = {
    sm: "px-2.5 py-0.5 text-[10px] rounded-full",
    md: "px-3.5 py-1.5 text-xs rounded-full",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 font-bold uppercase tracking-wider",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </div>
  );
};
