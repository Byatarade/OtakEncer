"use client";

import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";
import { motion } from "framer-motion";

interface AuroraBackgroundProps extends React.HTMLProps<HTMLDivElement> {
  children?: ReactNode;
  showRadialGradient?: boolean;
}

export const AuroraBackground = ({
  className,
  children,
  showRadialGradient = true,
  ...props
}: AuroraBackgroundProps) => {
  return (
    <div
      className={cn(
        "relative flex flex-col h-full items-center justify-center bg-[#672cb9] text-white",
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 overflow-hidden rounded-[inherit] pointer-events-none">
        <div
          className={cn(
            `
            absolute inset-0 
            [background-image:linear-gradient(100deg,#4d2691_10%,#8d4acf_30%,#ffa515_60%,#c876b5_80%,#672cb9_100%)]
            opacity-40`,
            showRadialGradient &&
              `[mask-image:radial-gradient(ellipse_at_100%_0%,black_10%,transparent_70%)]`
          )}
        ></div>
      </div>
      {children}
    </div>
  );
};