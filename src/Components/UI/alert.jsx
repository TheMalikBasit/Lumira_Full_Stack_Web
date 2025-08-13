import React from "react";
import { cn } from "@/lib/utils"; // assuming you still want to use this utility

const alertStyles = {
  base: "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-n-foreground",
  variants: {
    default: "bg-n-background text-n-foreground",
    destructive:
      "border-n-destructive/50 text-n-destructive dark:border-n-destructive [&>svg]:text-n-destructive",
  },
};

const Alert = React.forwardRef(
  ({ className, variant = "default", ...props }, ref) => {
    const variantClass =
      alertStyles.variants[variant] || alertStyles.variants.default;
    return (
      <div
        ref={ref}
        role="alert"
        className={cn(alertStyles.base, variantClass, className)}
        {...props}
      />
    );
  }
);
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  />
));
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };
