import * as React from "react";
import { cn } from "../../lib/utils";

const LoadingSpinner = React.forwardRef(
    ({ className, size = "default", ...props }, ref) => {
        const sizeClasses = {
            sm: "w-3 h-3 border",
            default: "w-4 h-4 border-2",
            lg: "w-6 h-6 border-2",
        };

        return (
            <div
                ref={ref}
                className={cn(
                    "border-white/30 border-t-white rounded-full animate-spin",
                    sizeClasses[size],
                    className
                )}
                role="status"
                aria-label="Loading"
                {...props}
            />
        );
    }
);

LoadingSpinner.displayName = "LoadingSpinner";

export { LoadingSpinner };
