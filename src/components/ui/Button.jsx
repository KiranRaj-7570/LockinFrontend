import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                default:
                    "bg-linear-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg hover:shadow-orange-500/50 transform hover:scale-105 active:scale-95",
                secondary:
                    "bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 hover:border-slate-600",
                danger:
                    "bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 hover:border-red-500/60 text-red-400 hover:text-red-300",
                outline:
                    "border-2 border-slate-700 bg-transparent hover:bg-slate-800/50 text-white",
                ghost: "hover:bg-slate-800/50 text-white",
                link: "text-orange-400 hover:text-orange-300",
            },
            size: {
                default: "h-11 px-6 py-3 text-base",
                sm: "h-9 px-4 py-2 text-sm",
                lg: "h-12 px-8 py-3 text-lg",
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
