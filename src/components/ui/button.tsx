import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-glow hover:shadow-elevated hover:scale-[1.02] active:scale-[0.98]",
        destructive:
          "bg-destructive text-destructive-foreground shadow-md hover:shadow-lg hover:bg-destructive/90 active:scale-[0.98]",
        outline:
          "border-2 border-primary/50 bg-transparent text-primary hover:bg-primary/10 hover:border-primary hover:shadow-glow active:scale-[0.98]",
        secondary:
          "bg-secondary text-secondary-foreground border border-border/50 shadow-sm hover:shadow-md hover:bg-secondary/80 hover:border-border active:scale-[0.98]",
        ghost: 
          "hover:bg-secondary/50 hover:text-foreground",
        link: 
          "text-primary underline-offset-4 hover:underline hover:text-primary/80",
        eco: 
          "animated-gradient text-primary-foreground font-bold shadow-glow hover:shadow-elevated hover:scale-[1.02] active:scale-[0.98]",
        hero: 
          "glass-strong text-foreground border border-primary/20 shadow-elevated hover:shadow-glow hover:border-primary/40 hover:scale-[1.02] active:scale-[0.98]",
        carbon:
          "bg-gradient-to-r from-destructive to-eco-earth text-destructive-foreground shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]",
        glass:
          "glass text-foreground hover:bg-card/80 hover:shadow-elevated active:scale-[0.98]",
      },
      size: {
        default: "h-12 px-6 py-2",
        sm: "h-10 rounded-lg px-4 text-sm",
        lg: "h-14 rounded-xl px-8 text-base",
        xl: "h-16 rounded-2xl px-12 text-lg",
        icon: "h-11 w-11 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
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
