import * as React from "react";
import { Label } from "./Label";
import { cn } from "../../lib/utils";

const FormField = React.forwardRef(
    (
        {
            label,
            error,
            hint,
            required,
            children,
            className,
            labelClassName,
            ...props
        },
        ref
    ) => {
        const id = React.useId();

        return (
            <div className={cn("space-y-2", className)} ref={ref} {...props}>
                {label && (
                    <Label
                        htmlFor={id}
                        variant={error ? "error" : "default"}
                        className={labelClassName}
                    >
                        {label}
                        {required && <span className="text-red-400 ml-1">*</span>}
                    </Label>
                )}
                {React.Children.map(children, (child) => {
                    if (React.isValidElement(child)) {
                        return React.cloneElement(child, {
                            id,
                            error: !!error,
                            "aria-invalid": !!error,
                            "aria-describedby": error ? `${id}-error` : hint ? `${id}-hint` : undefined,
                        });
                    }
                    return child;
                })}
                {error && (
                    <p
                        id={`${id}-error`}
                        className="text-xs text-red-400 mt-1 animate-fadeIn"
                    >
                        {error}
                    </p>
                )}
                {hint && !error && (
                    <p id={`${id}-hint`} className="text-xs text-slate-400 mt-1">
                        {hint}
                    </p>
                )}
            </div>
        );
    }
);

FormField.displayName = "FormField";

export { FormField };
