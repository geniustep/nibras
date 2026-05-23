import { TextareaHTMLAttributes, forwardRef } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className = "", id, ...props }, ref) => {
    const textareaId = id ?? props.name;
    return (
      <div className="space-y-1.5">
        <label htmlFor={textareaId} className="block text-sm font-medium text-[#0E2250]">
          {label}
        </label>
        <textarea
          ref={ref}
          id={textareaId}
          rows={4}
          className={`w-full resize-y rounded-xl border bg-white px-4 py-3 text-[#0E2250] transition placeholder:text-slate-400 focus:border-[#1D4395] focus:outline-none focus:ring-2 focus:ring-[#1D4395]/20 ${error ? "border-red-400" : "border-slate-200"} ${className}`}
          {...props}
        />
        {hint && !error && <p className="text-xs text-slate-500">{hint}</p>}
        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
