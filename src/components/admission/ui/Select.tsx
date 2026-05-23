import { SelectHTMLAttributes, forwardRef } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, placeholder, className = "", id, required, ...props }, ref) => {
    const selectId = id ?? props.name;
    return (
      <div className="space-y-1.5">
        <label htmlFor={selectId} className="block text-sm font-medium text-[#0E2250]">
          {label}
          {required && (
            <span className="text-red-600" aria-hidden="true">
              {" "}
              *
            </span>
          )}
        </label>
        <select
          ref={ref}
          id={selectId}
          required={required}
          className={`w-full rounded-xl border bg-white px-4 py-3 text-[#0E2250] transition focus:border-[#1D4395] focus:outline-none focus:ring-2 focus:ring-[#1D4395]/20 ${error ? "border-red-400" : "border-slate-200"} ${className}`}
          {...props}
        >
          {placeholder && (
            <option value="">{placeholder}</option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";
