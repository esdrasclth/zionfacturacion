import { type InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={id} className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={`border rounded-lg px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 bg-white transition-all duration-150
            focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
            disabled:bg-slate-50 disabled:text-slate-400
            ${error ? "border-red-400 focus:ring-red-400 focus:border-red-400" : "border-slate-200 hover:border-slate-300"}
            ${className}`}
          {...props}
        />
        {error && <span className="text-xs text-red-600 flex items-center gap-1">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
          </svg>
          {error}
        </span>}
      </div>
    );
  }
);
Input.displayName = "Input";
