import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-semibold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none",
  {
    variants: {
      variant: {
        default:
          "bg-brand-blue text-white hover:bg-brand-blue-hover shadow-sm active:scale-[0.98]",
        secondary:
          "bg-brand-green text-white hover:bg-brand-green-hover shadow-sm active:scale-[0.98]",
        outline:
          "border border-brand-border bg-brand-surface text-brand-dark hover:bg-brand-blue-light hover:text-brand-blue hover:border-brand-blue",
        outlineGreen:
          "border border-brand-green text-brand-green bg-brand-surface hover:bg-brand-green-light",
        ghost:
          "text-brand-dark hover:bg-brand-blue-light hover:text-brand-blue",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 shadow-sm",
        link: "text-brand-blue underline-offset-4 hover:underline p-0 h-auto",
      },
      size: {
        default: "h-11 px-5 py-2.5",
        sm: "h-9 rounded-md px-3 text-xs",
        lg: "h-12 rounded-lg px-7 text-base font-medium",
        xl: "h-14 rounded-xl px-8 text-lg font-semibold",
        icon: "h-10 w-10",
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
