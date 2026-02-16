import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

const inputVariants = cva(
    "w-full rounded-lg px-4 py-3 text-white placeholder-slate-500 text-sm transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50",
    {
        variants: {
            variant: {
                default:
                    "bg-slate-800/50 border border-slate-700 hover:border-slate-600 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-none",
                error:
                    "bg-slate-800/50 border border-red-500/50 hover:border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 focus:outline-none",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
);

const Input = React.forwardRef(
    ({ className, variant, type = "text", error, ...props }, ref) => {
        return (
            <input
                type={type}
                className={cn(inputVariants({ variant: error ? "error" : variant }), className)}
                ref={ref}
                {...props}
            />
        );
    }
);

Input.displayName = "Input";

export { Input };
