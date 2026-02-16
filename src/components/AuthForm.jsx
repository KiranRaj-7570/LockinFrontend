import * as React from "react";
import { Link } from "react-router-dom";
import { cn } from "../lib/utils";

/**
 * AuthForm - Reusable form container for authentication pages
 * Provides consistent card styling and layout
 */
const AuthForm = ({ children, onSubmit, className }) => {
    return (
        <form
            onSubmit={onSubmit}
            className={cn(
                "bg-slate-800/10 backdrop-blur-xl shadow-2xl rounded-2xl p-6 sm:p-8 space-y-5 border border-white/10",
                className
            )}
        >
            {children}
        </form>
    );
};

/**
 * AuthFormDivider - Divider with "or" text
 */
const AuthFormDivider = () => {
    return (
        <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-slate-700"></div>
            <span className="text-xs text-slate-400 px-2">or</span>
            <div className="flex-1 h-px bg-slate-700"></div>
        </div>
    );
};

/**
 * AuthFormLink - Link to other auth pages (login/register)
 */
const AuthFormLink = ({ text, linkText, to }) => {
    return (
        <p className="text-center text-sm text-slate-400">
            {text}{" "}
            <Link
                to={to}
                className="text-orange-400 hover:text-orange-300 font-semibold transition-colors duration-200"
            >
                {linkText}
            </Link>
        </p>
    );
};

AuthForm.displayName = "AuthForm";
AuthFormDivider.displayName = "AuthFormDivider";
AuthFormLink.displayName = "AuthFormLink";

export { AuthForm, AuthFormDivider, AuthFormLink };
