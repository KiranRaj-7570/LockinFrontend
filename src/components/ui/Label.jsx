import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

const labelVariants = cva(
    "block text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 transition-colors",
    {
        variants: {
            variant: {
                default: "text-white",
                error: "text-red-400",
                success: "text-green-400",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
);

const Label = React.forwardRef(({ className, variant, ...props }, ref) => (
    <LabelPrimitive.Root
        ref={ref}
        className={cn(labelVariants({ variant }), className)}
        {...props}
    />
));

Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
