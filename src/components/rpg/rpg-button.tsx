"use client";
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";
export interface RpgButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> { variant?: "primary"|"secondary"; asChild?: boolean; }
export const RpgButton = React.forwardRef<HTMLButtonElement, RpgButtonProps>(({ className, variant="primary", asChild=false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";
  return <Comp ref={ref} className={cn("rpg-button flex h-14 w-full items-center justify-center gap-2 text-base disabled:cursor-not-allowed disabled:opacity-50", variant==="primary"?"rpg-button-primary":"rpg-button-secondary", className)} {...props}/>;
});
RpgButton.displayName = "RpgButton";
