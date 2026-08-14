import Link from "next/link";
import type { Route } from "next";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  href?: Route | string;
};

export function Button({ variant = "primary", size = "md", href, className = "", children, ...props }: ButtonProps) {
  const baseClasses =
    "inline-flex items-center justify-center font-body transition-colors duration-150 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#C01718] focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm rounded-md",
    md: "px-6 py-2.5 text-base rounded-md",
    lg: "px-8 py-3 text-lg rounded-lg",
  };

  const variantClasses = {
    primary: "bg-[#C01718] text-white hover:bg-[#9a1213]",
    secondary: "bg-[#F9F9F8] text-[#1A1A1A] hover:bg-[#E2E8F0]",
    outline: "border border-[#E2E8F0] text-[#1A1A1A] hover:border-[#4A5568]",
    ghost: "text-[#1A1A1A] hover:bg-[#F9F9F8]",
  };

  const classes = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href as Route} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
