"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";
import Spinner from "./Spinner";

type Variant = "primary" | "secondary" | "ghost" | "destructive" | "inverted";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: "md" | "sm";
  loading?: boolean;
}

const variantClass: Record<Variant, string> = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  ghost: "btn-ghost",
  destructive: "btn-destructive",
  inverted: "btn-inverted",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", loading = false, className = "", children, disabled, ...rest },
  ref
) {
  return (
    <button
      ref={ref}
      className={`btn ${variantClass[variant]} ${size === "sm" ? "sm" : ""} ${disabled && variant === "primary" ? "is-disabled" : ""} ${className}`}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading && <Spinner />}
      {children}
    </button>
  );
});

export default Button;
