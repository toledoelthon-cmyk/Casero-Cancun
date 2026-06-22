import Link from "next/link";
import { ButtonHTMLAttributes, ReactNode } from "react";
import { clsx } from "clsx";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  href?: string;
  variant?: ButtonVariant;
  children: ReactNode;
};

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-casero-orange text-casero-dark shadow-soft hover:bg-amber-400 focus-visible:ring-casero-orange",
  secondary:
    "bg-casero-green text-white shadow-soft hover:bg-emerald-700 focus-visible:ring-casero-green",
  outline:
    "border border-casero-dark/15 bg-white text-casero-dark hover:border-casero-green hover:text-casero-green focus-visible:ring-casero-turquoise",
  ghost:
    "text-casero-dark hover:bg-casero-beige/60 focus-visible:ring-casero-turquoise",
};

export function Button({
  href,
  variant = "primary",
  className,
  children,
  ...props
}: ButtonProps) {
  const classes = clsx(
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-5 py-2.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
    variants[variant],
    className,
  );

  if (href) {
    return (
      <Link className={classes} href={href}>
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
