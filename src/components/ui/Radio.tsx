"use client";

import { ReactNode } from "react";

export default function Radio({
  checked,
  onChange,
  name,
  disabled = false,
  children,
}: {
  checked: boolean;
  onChange: () => void;
  name: string;
  disabled?: boolean;
  children?: ReactNode;
}) {
  return (
    <label className={`ck ${disabled ? "is-disabled" : ""}`}>
      <input type="radio" className="visually-hidden" name={name} checked={checked} disabled={disabled} onChange={onChange} />
      <span className={`rdot ${checked ? "checked" : ""}`} aria-hidden="true" />
      {children}
    </label>
  );
}
