import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
// import { cva, type VariantProps } from "class-variance-authority"  its value was never read and was showing errors
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-n-primary text-n-primary_foreground hover:bg-n-primary/90 shadow-warm transition-all duration-300",
        destructive:
          "bg-n-destructive text-n-destructive_foreground hover:bg-n-destructive/90",
        outline:
          "border border-n-input bg-n-background hover:bg-n-accent hover:text-n-accent_foreground",
        secondary:
          "bg-n-secondary text-n-secondary_foreground hover:bg-n-secondary/80",
        ghost: "hover:bg-n-accent hover:text-n-accent_foreground",
        link: "text-n-primary underline-offset-4 hover:underline",
        coral:
          "bg-n-lumira_coral text-n-primary_foreground hover:bg-n-lumira_coral/90 shadow-warm hover:shadow-glow transition-all duration-300",
        salmon:
          "bg-n-lumira_salmon text-n-primary_foreground hover:bg-n-lumira_salmon/90 shadow-warm transition-all duration-300",
        warm: "gradient-warm text-n-primary_foreground hover:opacity-90 shadow-warm hover:shadow-glow transition-all duration-300",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
