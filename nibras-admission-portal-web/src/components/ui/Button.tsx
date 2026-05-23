import { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "gold";

const variants: Record<Variant, string> = {
  primary:
    "bg-[#1D4395] text-white hover:bg-[#0E2250] focus-visible:ring-[#1D4395]",
  secondary:
    "bg-[#0E2250] text-white hover:bg-[#1D4395] focus-visible:ring-[#0E2250]",
  outline:
    "border-2 border-[#1D4395] text-[#1D4395] bg-transparent hover:bg-[#F5F8FF]",
  ghost: "text-[#1D4395] hover:bg-[#F5F8FF]",
  gold: "bg-[#EEA748] text-[#0E2250] hover:brightness-95 focus-visible:ring-[#EEA748]",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  loading?: boolean;
  fullWidth?: boolean;
}

export function Button({
  variant = "primary",
  loading,
  fullWidth,
  className = "",
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${fullWidth ? "w-full" : ""} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </button>
  );
}
