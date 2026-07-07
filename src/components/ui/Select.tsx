"use client";

import { SelectHTMLAttributes, forwardRef } from "react";

/** Native select styled as the design system's fselect, chevron included. */
const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  function Select({ className = "", disabled, children, ...rest }, ref) {
    return (
      <span className={`fselect ${disabled ? "is-disabled" : ""} ${className}`} style={{ padding: 0 }}>
        <select ref={ref} disabled={disabled} {...rest}>
          {children}
        </select>
        <svg className="caret-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </span>
    );
  }
);

export default Select;
