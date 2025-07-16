import React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-n-primary text-n-primary_foreground hover:bg-n-primary/80",
        secondary:
          "border-transparent bg-n-secondary text-n-secondary_foreground hover:bg-n-secondary/80",
        destructive:
          "border-transparent bg-n-destructive text-n-destructive_foreground hover:bg-n-destructive/80",
        outline: "text-n-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({ className, variant, ...props }) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
