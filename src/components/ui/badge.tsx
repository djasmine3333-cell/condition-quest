import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
  {
    variants: {
      variant: {
        soft: "bg-[color:var(--color-soft-green)] text-[color:var(--color-dark-green)]",
        navy: "bg-[color:var(--color-deep-navy)]/10 text-[color:var(--color-deep-navy)]",
        warning: "bg-[color:var(--color-warning)]/15 text-[color:var(--color-warning)]",
        outline: "border border-[color:var(--color-border)] text-[color:var(--color-text-secondary)]",
      },
    },
    defaultVariants: { variant: "soft" },
  },
);

function Badge({
  className,
  variant,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
