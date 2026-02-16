import * as React from "react";
import LoginBgVideo from "./LoginBgVideo";
import { cn } from "../lib/utils";

/**
 * AuthLayout - Reusable layout component for authentication pages
 * Provides consistent background, structure, and styling
 */
const AuthLayout = ({ children, title, subtitle, footer, className }) => {
    return (
        <div className="relative min-h-screen saira flex items-center justify-center overflow-hidden px-4 py-8 sm:px-6 lg:px-8">
            {/* Background Video */}
            <LoginBgVideo />

            <div className={cn("w-full max-w-md relative z-10", className)}>
                {/* Header */}
                {(title || subtitle) && (
                    <div className="text-center mb-8">
                        {title && (
                            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-2 tracking-tight">
                                {title}
                            </h1>
                        )}
                        {subtitle && (
                            <p className="text-white/80 text-sm sm:text-base">{subtitle}</p>
                        )}
                    </div>
                )}

                {/* Main Content */}
                {children}

                {/* Footer */}
                {footer && (
                    <p className="text-center text-xs text-white/50 mt-6">{footer}</p>
                )}
            </div>
        </div>
    );
};

AuthLayout.displayName = "AuthLayout";

export { AuthLayout };
