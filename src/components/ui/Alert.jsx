import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

const alertVariants = cva(
    "rounded-lg p-4 text-sm animate-fadeIn",
    {
        variants: {
            variant: {
                error: "bg-red-500/10 border border-red-500/30 text-red-300",
                success: "bg-green-500/10 border border-green-500/30 text-green-300",
                warning: "bg-yellow-500/10 border border-yellow-500/30 text-yellow-300",
                info: "bg-blue-500/10 border border-blue-500/30 text-blue-300",
            },
        },
        defaultVariants: {
            variant: "info",
        },
    }
);

const Alert = React.forwardRef(
    ({ className, variant, children, ...props }, ref) => (
        <div
            ref={ref}
            role="alert"
            className={cn(alertVariants({ variant }), className)}
            {...props}
        >
            <p className="font-medium">{children}</p>
        </div>
    )
);

Alert.displayName = "Alert";

export { Alert };
