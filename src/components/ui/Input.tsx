"use client";

import { InputHTMLAttributes, forwardRef } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { error = false, disabled, className = "", ...rest },
  ref
) {
  return (
    <input
      ref={ref}
      className={`input ${error ? "is-error" : ""} ${disabled ? "is-disabled" : ""} ${className}`}
      disabled={disabled}
      aria-invalid={error || undefined}
      {...rest}
    />
  );
});

export default Input;
